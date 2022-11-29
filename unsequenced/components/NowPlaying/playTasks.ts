/* eslint-disable no-underscore-dangle */
// import BackgroundTimer from 'react-native-background-timer';
import { Task } from '../../constants/types';
import store from '../../redux/store';
import { decrementTask } from '../../redux/taskBlocks';

let _timer: undefined | NodeJS.Timer;
let _taskList: undefined | Task[];
let _taskBlockId: undefined | string;
let _isEndedCallback: undefined | ((value: boolean) => void);
let j = 0;

function _decrement() {
  console.log(j++);
  const taskId = findFirstTask();
  const _10sec = 0.010;
  if (taskId && _taskBlockId) {
    store.dispatch(decrementTask({ taskBlockId: _taskBlockId, taskId, decrementAmount: _10sec }));
  } else {
    _isEndedCallback!(false);
    playTasks.end();
  }
}

function findFirstTask(): string | null {
  for (let i = 0; i < _taskList!.length; i += 1) {
    const { completed, amount, id } = _taskList![i];
    if (completed < amount) {
      // return the first id that is incomplete
      return id;
    }
  }
  // All tasks completed
  return null;
}

interface PlayTaskModule {
  play: (taskBlockId: string, taskList: Task[], isEndedCallback: (value: boolean) => void) => void;
  update: (taskList: Task[]) => void;
  end: () => void;
}

const playTasks: PlayTaskModule = {
  play(taskBlockId, taskList, isEndedCallback) {
    _taskBlockId = taskBlockId;
    _taskList = taskList;
    _timer = setInterval(_decrement, 600);
    _isEndedCallback = isEndedCallback;
  },
  update(taskList) {
    _taskList = taskList;
  },
  end() {
    clearInterval(_timer);
    _timer = undefined;
  },
};

export default playTasks;
