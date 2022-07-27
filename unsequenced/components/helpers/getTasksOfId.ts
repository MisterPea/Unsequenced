import { TaskBlock } from '../../constants/types';

type Callback = React.Dispatch<React.SetStateAction<Array<Object>>>;

export default function getTasksOfId(taskBlocks: TaskBlock[], id:string, callback:Callback):void {
  const index = taskBlocks.findIndex((item) => item.id === id);
  callback(taskBlocks[index].tasks);
}
