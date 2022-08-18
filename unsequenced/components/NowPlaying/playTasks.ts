// import BackgroundTimer from 'react-native-background-timer';
import { Task } from '../../constants/types';
import { decrementTask } from '../../redux/taskBlocks';
import { useAppDispatch } from '../../redux/hooks';

export default function playTasks(taskBlockId: string, taskList: Task[]) {
  const dispatch = useAppDispatch();
  // find the first useable task - something where completed is less than amount

  function findFirstTask() {
    for (let i = 0; i < taskList.length; i += 1) {
      const { completed, amount, id } = taskList[i];
      if (completed < amount) {
        return id;
      }
    }
    // no uncompleted tasks
    return null;
  }

  function end() {
    // BackgroundTimer.stopBackgroundTimer();
  }

  // BackgroundTimer.runBackgroundTimer(() => {
  const taskId = findFirstTask();
  if (taskId) {
    dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 0.25 })); // 15sec
  } else {
    end();
  }
  // }, 15000);
}

// call decrement.
// if none, check next index. If last index then call stop
