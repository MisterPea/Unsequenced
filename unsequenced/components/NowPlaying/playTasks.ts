/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { NativeEventSubscription, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import store from '../../redux/store';
import { decrementTask, markTaskComplete, updateTask } from '../../redux/taskBlocks';
import { Task } from '../../constants/types';

interface TaskVars {
  _taskList: Task[];
  _taskBlockId: string;
  _firstTask?: Task;
  _currentId?: string;
  _isEndedCallback: (value: boolean) => void;
  _timer?: NodeJS.Timer;
}

const taskVars: TaskVars = {
  _taskList: [],
  _taskBlockId: '',
  _firstTask: undefined,
  _currentId: undefined,
  _isEndedCallback: () => { },
  _timer: undefined,
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

function findFirstTask(): Task | null {
  for (let i = 0; i < taskVars._taskList!.length; i += 1) {
    const { completed, amount } = taskVars._taskList![i];
    if (completed < amount) {
      // update the first task
      taskVars._firstTask = taskVars._taskList![i];
      // return the first id that is incomplete
      return taskVars._taskList![i];
    }
  }
  // All tasks completed
  return null;
}

// ************************* PlayTasks ************************* //
interface PlayTaskModule {
  play: (taskBlockId: string, taskList: Task[], isEndedCallback: (value: boolean) => void) => void;
  update: (taskList: Task[]) => void;
  pause: () => void;
  end: () => void;
}

let calledLocally: boolean = false;
const playTasks: PlayTaskModule = {
  play(taskBlockId, taskList, isEndedCallback) {
    taskVars._taskBlockId = taskBlockId;
    taskVars._taskList = taskList;
    taskVars._isEndedCallback = isEndedCallback;
    taskVars._timer = setInterval(_decrement, 600);
    calledLocally = findFirstTask() === null;
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
    if (calledLocally === false) {
      createForegroundNotification();
    }
    calledLocally = false;
  },
};

// ************************** AppState ************************** //
// let expirationTime: number;
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
      calledLocally = true;
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
    calledLocally = true;
    store.dispatch(markTaskComplete({
      id: taskVars!._taskBlockId,
      taskId: taskVars._firstTask!.id,
    }));
  }
}

// NOTIFICATIONS //
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

async function createBackgroundNotification(time: number, message: string): Promise<any> {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Unsequenced',
      body: message,
      sound: true,
      vibrate: [200, 0, 200, 0, 200, 0],
      data: { test: 'TESTING' },
    },
    trigger: { seconds: time },
  });
}

async function createForegroundNotification(): Promise<any> {
  Notifications.scheduleNotificationAsync({
    content: {
      sound: true,
    },
    trigger: null,
  });
}

export { appState, playTasks };
