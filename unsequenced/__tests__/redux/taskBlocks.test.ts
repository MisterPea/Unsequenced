import { configureStore } from '@reduxjs/toolkit';
import store from '../../redux/store';
import taskBlockReducer, {
  addTaskBlock, removeTaskBlock, updateTaskBlock, addTask, removeTask, updateTask,
} from '../../redux/taskBlocks';
import { Task, TaskBlock } from '../../constants/types';

const dataOne:TaskBlock = {
  id: 'abcdef',
  title: 'Test One',
  breaks: false,
  autoplay: false,
  tasks: [
    {
      id: 'abcdefgh',
      title: 'Task test',
      amount: 60,
      isBreak: false,
    },
    {
      id: 'ABCDEFGH',
      title: 'Task test two',
      amount: 60,
      isBreak: false,
    },
  ],
};

const dataTwo:TaskBlock = {
  id: 'aabbcc',
  title: 'Test Two',
  breaks: true,
  autoplay: false,
  tasks: [
    {
      id: 'ijklmnop',
      title: 'Task test',
      amount: 60,
      isBreak: false,
    },
    {
      id: 'IJKLMNOP',
      title: 'Task test two',
      amount: 60,
      isBreak: false,
    },
  ],
};

const dataThree:TaskBlock = {
  id: 'dataThreeId',
  title: 'Test Two',
  breaks: true,
  autoplay: false,
  tasks: [],
};

const addedTaskOne: Task = {
  id: 'taskOne',
  title: 'Do react js stuff',
  amount: 120,
  isBreak: false,
};

const addedTaskTwo: Task = {
  id: 'taskTwo',
  title: 'Take a break',
  amount: 5,
  isBreak: true,
};

const taskUpdate = {
  title: 'Write some tests',
  isBreak: false,
};

function mockStore() {
  const tempStore = configureStore({
    reducer: {
      taskBlocks: taskBlockReducer,
    },
  });
  return tempStore;
}

describe('taskBlocks redux state tests', () => {
  it('Should initially see taskBlocks as an empty array', () => {
    const state = store.getState().taskBlocks;
    expect(state.blocks).toEqual([]);
  });

  it('Should add a taskBlock to the array', () => {
    store.dispatch(addTaskBlock(dataOne));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[0].tasks).toHaveLength(2);
  });

  it('Should should add another taskBlock to array and have length 2', () => {
    // store retains dispatch from previous test
    store.dispatch(addTaskBlock(dataTwo));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks).toHaveLength(2);
  });

  it('Should remove a taskBlock via id and leave the store with 1', () => {
    store.dispatch(removeTaskBlock({ id: 'abcdef' }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[0].id).toBe('aabbcc');
  });

  it('Should replace the information of the appropriate record - title', () => {
    store.dispatch(addTaskBlock(dataOne));
    store.dispatch(updateTaskBlock({ id: 'aabbcc', update: { title: 'New Title' } }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[0].title).toBe('New Title');
  });

  it('Should replace the information of the appropriate record - breaks', () => {
    store.dispatch(updateTaskBlock({ id: 'aabbcc', update: { breaks: false } }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[0].breaks).toBe(false);
  });
});

describe('taskBlocks.tasks redux state tests', () => {
  const mockStoreInstance = mockStore();

  it('Should initially see tasks as an empty array', () => {
    mockStoreInstance.dispatch(addTaskBlock(dataThree));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0].tasks).toEqual([]);
  });

  it('Should add a task to the taskBlock', () => {
    mockStoreInstance.dispatch(addTask({ id: 'dataThreeId', task: addedTaskOne }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0].tasks[0]).toMatchObject(addedTaskOne);
  });

  it('Should remove a task from the taskBlock', () => {
    mockStoreInstance.dispatch(addTask({ id: 'dataThreeId', task: addedTaskTwo }));
    mockStoreInstance.dispatch(removeTask({ id: 'dataThreeId', taskId: 'taskOne' }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0].tasks).toHaveLength(1);
  });

  it('Should retain addedTaskTwo', () => {
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0].tasks[0]).toMatchObject(addedTaskTwo);
  });

  it('Should have taskBlock info after deleting only task', () => {
    mockStoreInstance.dispatch(removeTask({ id: 'dataThreeId', taskId: 'taskTwo' }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0]).toMatchObject(dataThree);
  });

  it('Should update task entries', () => {
    mockStoreInstance.dispatch(addTask({ id: 'dataThreeId', task: addedTaskOne }));
    mockStoreInstance.dispatch(addTask({ id: 'dataThreeId', task: addedTaskTwo }));
    mockStoreInstance.dispatch(updateTask({ id: 'dataThreeId', taskId: 'taskTwo', update: taskUpdate }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0].tasks[1]).toMatchObject({
      id: 'taskTwo', title: 'Write some tests', amount: 5, isBreak: false,
    });
  });
});
