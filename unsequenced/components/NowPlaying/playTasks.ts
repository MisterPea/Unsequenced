/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { NativeEventSubscription, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import store from '../../redux/store';
import { decrementTask, markTaskComplete, updateTask } from '../../redux/taskBlocks';
import { Task } from '../../constants/types';

// _taskForTimer is a reference to the previously played task
interface TaskVars {
  _taskList: Task[];
  _taskBlockId: string;
  _firstTask?: Task;
  _taskForTimer?: Task | undefined;
  _currentId?: string;
  _isEndedCallback: (value: boolean) => void;
  _timer?: NodeJS.Timer,
}

const taskVars: TaskVars = {
  _taskList: [],
  _taskBlockId: '',
  _firstTask: undefined,
  _currentId: undefined,
  _isEndedCallback: () => { },
  _timer: undefined,
  _taskForTimer: undefined,
};

function _decrement() {
  const taskId = findFirstTask()?.id;
  const _10sec = 0.010;
  if (taskId && taskVars._taskBlockId) {
    taskVars._currentId = taskId;
    store.dispatch(decrementTask({ taskBlockId: taskVars._taskBlockId, taskId, decrementAmount: _10sec }));
  } else {
    taskVars._isEndedCallback!(false);
    playTasks.end();
  }
}

export const middlewearActions = {
  _completeCalled: false,
  markCompletedCalled: () => {
    middlewearActions._completeCalled = true;
  },
  resetResetMarkCompleted: () => {
    middlewearActions._completeCalled = false;
  },
};

let localCurrent: string | undefined;
function findFirstTask(): Task | null {
  for (let i = 0; i < taskVars._taskList!.length; i += 1) {
    const { completed, amount } = taskVars._taskList![i];
    if (completed < amount) {
      localCurrent = taskVars._currentId;
      // update the first task
      taskVars._firstTask = taskVars._taskList![i];
      // return the first id that is incomplete
      if (taskVars._taskForTimer === undefined) taskVars._taskForTimer = taskVars._taskList[i];
      return taskVars._taskList![i];
    }
    if (completed >= amount && localCurrent !== taskVars._currentId) {
      if (localCurrent !== undefined && localCurrent?.length > 0) {
        if (middlewearActions._completeCalled === false && taskVars._taskForTimer?.title) {
          createForegroundNotification(taskVars._taskForTimer.title);
        }
        localCurrent = '';
        taskVars._taskForTimer = undefined;
      }
      middlewearActions.resetResetMarkCompleted();
    }
  }
  // All tasks completed
  if (middlewearActions._completeCalled === false && taskVars._firstTask?.title) {
    createForegroundNotification(taskVars._firstTask?.title);
  }
  localCurrent = undefined;
  taskVars._taskForTimer = undefined;
  middlewearActions.resetResetMarkCompleted();
  return null;
}

// ************************* PlayTasks ************************* //
interface PlayTaskModule {
  play: (taskBlockId: string, taskList: Task[], isEndedCallback: (value: boolean) => void) => void;
  update: (taskList: Task[]) => void;
  pause: () => void;
  end: () => void;
}

const playTasks: PlayTaskModule = {
  play(taskBlockId, taskList, isEndedCallback) {
    taskVars._taskBlockId = taskBlockId;
    taskVars._taskList = taskList;
    taskVars._isEndedCallback = isEndedCallback;
    taskVars._timer = setInterval(_decrement, 600);
  },
  update(taskList) {
    taskVars._taskList = taskList;
  },
  pause() {
    clearInterval(taskVars._timer);
    taskVars._timer = undefined;
  },
  end() {
    clearInterval(taskVars._timer);
    taskVars._timer = undefined;
  },
};

// ************************** AppState ************************** //
let appStateVar: NativeEventSubscription;
const appState = {
  init() {
    appStateVar = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' && taskVars._timer) {
        const [{ autoplay }] = store.getState().taskBlocks.blocks.filter(({ id }) => id === taskVars._taskBlockId);
        console.log(autoplay);
        if (autoplay) {
          executeBackgroundStateNonstop();
        } else {
          executeBackgroundState();
        }
      }
      if (nextAppState === 'active') {
        if (individualExpirationTime) {
          executeActiveState();
        }
        if (backgroundNotifications.length > 0) {
          executeActiveStateNonstop();
        }
      }
    });
  },
  removeListener() {
    appStateVar.remove();
  },
};

interface TaskNotification {
  taskId: string;
  taskTitle: string;
  totalAmount: number;
  expiration: number;
  utcStart: number;
  utcEnd: number;
}
const backgroundNotifications: TaskNotification[] = [];
let individualExpirationTime: number;
/**
 * This method is executed on foreground to background state change.
 * It takes the current, active tasks - and assigns a local notification to them.
 * It then takes that info {taskId, totalAmount (total time), expiration (time)} and
 * stores it in an Array until the app is returned to the foreground.
 * Further: we actually take that Array and loop through it backwards, so then we can
 * set the title as
 */
// AUTOPLAY
function executeBackgroundStateNonstop() {
  console.log('AUTO BACKGROUND');
  playTasks.pause();
  const [{ tasks }] = store.getState().taskBlocks.blocks.filter(({ id }) => id === taskVars._taskBlockId);
  const startOfBackground = Math.floor(Date.now() / 1000); // current time in seconds
  // create array, which to set the notifications
  let taskStart = 0;
  for (let i = 0; i < tasks.length; i += 1) {
    const { completed, amount, title, id } = tasks[i];
    if (completed < amount) { // if there's time remaining
      const taskLength = ((amount - completed) * 60); // in seconds
      const taskExpire = taskLength + taskStart; // when the notification should sound
      const utcStart = startOfBackground + taskStart;
      const utcEnd = startOfBackground + taskExpire;

      const taskNotification: TaskNotification = {
        taskId: id,
        taskTitle: title,
        totalAmount: amount,
        expiration: taskExpire,
        utcStart,
        utcEnd,
      };
      backgroundNotifications.push(taskNotification);
      taskStart += taskLength;
    }
  }
  let previousTitle: string | null = null;
  for (let i = backgroundNotifications.length - 1; i >= 0; i -= 1) {
    const { taskTitle, expiration } = backgroundNotifications[i];
    const titleOne = `${taskTitle} has ended`;
    const titleTwo = previousTitle ? `→ begin ${previousTitle}.` : '';
    previousTitle = taskTitle;
    createBackgroundNotification(expiration, titleOne + titleTwo);
  }
}

function executeActiveStateNonstop() {
  const currentTime = Math.floor(Date.now() / 1000);
  let anyUnfinishedTasks = false;
  Notifications.cancelAllScheduledNotificationsAsync();

  for (let i = 0; i < backgroundNotifications.length; i += 1) {
    const { taskId, utcStart, utcEnd, totalAmount } = backgroundNotifications[i];
    if (currentTime > utcEnd) { // if we completed the task-mark it so.
      store.dispatch(markTaskComplete({
        id: taskVars._taskBlockId,
        taskId,
      }));
    }
    if (currentTime < utcEnd && currentTime > utcStart) {
      anyUnfinishedTasks = true;
      const taskRemaining = (utcEnd - currentTime) / 60;
      const amtCompleted = totalAmount - taskRemaining;
      store.dispatch(updateTask({
        id: taskVars._taskBlockId,
        taskId,
        update: { completed: amtCompleted },
      }));
    }
  }
  if (anyUnfinishedTasks) {
    taskVars._isEndedCallback!(true);
    playTasks.play(taskVars._taskBlockId, taskVars._taskList, taskVars._isEndedCallback);
  } else {
    taskVars._isEndedCallback!(false);
  }
  backgroundNotifications.length = 0;
}

// NON-AUTOPLAY
function executeBackgroundState() {
  console.log('BACKGROUND');
  playTasks.pause();
  const timeToSeconds = (taskVars._firstTask!.amount - taskVars._firstTask!.completed) * 60;
  const startOfBackground = Math.floor(Date.now() / 1000); // current time in seconds
  individualExpirationTime = startOfBackground + timeToSeconds;
  createBackgroundNotification(timeToSeconds, taskVars._firstTask!.title);
}

function executeActiveState() {
  console.log('ACTIVE');
  const currentTime = Math.floor(Date.now() / 1000);
  // if there's time left on the notification
  Notifications.cancelAllScheduledNotificationsAsync();
  if (currentTime < individualExpirationTime) {
    const taskRemaining = (individualExpirationTime - currentTime) / 60;
    const amtCompleted = taskVars._firstTask!.amount - taskRemaining;
    store.dispatch(updateTask({
      id: taskVars!._taskBlockId,
      taskId: taskVars._firstTask!.id,
      update: { completed: amtCompleted },
    }));
    taskVars._isEndedCallback!(true);
    playTasks.play(taskVars._taskBlockId, taskVars._taskList, taskVars._isEndedCallback);
  } else {
    // if time has elapsed
    store.dispatch(markTaskComplete({
      id: taskVars!._taskBlockId,
      taskId: taskVars._firstTask!.id,
    }));
  }
}

// NOTIFICATIONS //
interface PrefTypes {
  allowSounds: boolean;
  allowBanners: boolean | string;
}
const prefs: PrefTypes = {
  allowSounds: true,
  allowBanners: true,
};

store.subscribe(() => {
  const p = store.getState().notificationPrefs;
  prefs.allowBanners = p.allowBanners;
  prefs.allowSounds = p.allowSounds;
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

interface NotificationContent {
  title?: string;
  body?: string;
  sound?: boolean | string;
  vibrate?: number[];
}

async function createBackgroundNotification(time: number, message: string): Promise<any> {
  const tailoredContent: NotificationContent = {
    title: 'Unsequenced',
    body: message,
    sound: true,
    vibrate: [100, 9, 299, 2, 100],
  };

  const { allowBanners, allowSounds } = prefs;
  if (allowBanners === false && allowSounds) {
    delete tailoredContent.title;
    delete tailoredContent.body;
  }
  if (allowBanners && allowSounds === false) {
    // add empty sound
  }
  if (allowBanners === false && allowSounds === false) {
    return;
  }

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Unsequenced',
      body: message,
      sound: prefs.allowSounds,
      vibrate: [200, 0, 200, 0, 200, 0],
    },
    trigger: { seconds: time },
  });
}

async function createForegroundNotification(message: string): Promise<any> {
  const tailoredContent: NotificationContent = {
    title: 'Unsequenced',
    body: `${message} has completed`,
    sound: true,
    vibrate: [100, 9, 299, 2, 100],
  };

  const { allowBanners, allowSounds } = prefs;
  if ((allowBanners === false || allowBanners === 'background_only') && allowSounds) {
    delete tailoredContent.title;
    delete tailoredContent.body;
  }
  if (allowBanners && !allowSounds) {
    // add empty sound
  }
  if (!allowBanners && !allowSounds) {
    return;
  }

  Notifications.scheduleNotificationAsync({
    content: tailoredContent,
    trigger: null,
  });
}

export {
  appState,
  playTasks,
  executeBackgroundState,
  executeActiveState,
  executeBackgroundStateNonstop,
  executeActiveStateNonstop,
};
