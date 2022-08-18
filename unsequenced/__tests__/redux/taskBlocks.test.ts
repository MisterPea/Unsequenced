/* eslint-disable max-len */
import { configureStore } from '@reduxjs/toolkit';
import store from '../../redux/store';
import taskBlockReducer, { duplicateTask, markTaskComplete, addTaskBlock, removeTaskBlock, updateTaskBlock, addTask, removeTask, updateTask, toggleAutoplay, toggleBreak, reorderTasks, decrementTask } from '../../redux/taskBlocks';
import { Task, TaskBlock } from '../../constants/types';
import DATA from '../../constants/DATA';

const dataOne: TaskBlock = {
  id: 'abcdef',
  title: 'Test One',
  breaks: false,
  autoplay: false,
  tasks: [
    {
      id: 'abcdefgh',
      title: 'Task test',
      amount: 60,
      completed: 0,
    },
    {
      id: 'ABCDEFGH',
      title: 'Task test two',
      amount: 60,
      completed: 0,
    },
  ],
};

const dataTwo: TaskBlock = {
  id: 'aabbcc',
  title: 'Test Two',
  breaks: true,
  autoplay: false,
  tasks: [
    {
      id: 'ijklmnop',
      title: 'Task test',
      amount: 60,
      completed: 0,
    },
    {
      id: 'IJKLMNOP',
      title: 'Task test two',
      amount: 60,
      completed: 0,
    },
  ],
};

const dataThree: TaskBlock = {
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
  completed: 0,
};

const addedTaskTwo: Task = {
  id: 'taskTwo',
  title: 'Take a break',
  amount: 5,
  completed: 0,
};

const taskUpdate = {
  title: 'Write some tests',
};

const reorderedTasks = [
  {
    id: 'taskThree',
    title: 'Write Tests',
    amount: 60,
    completed: 59,
  },
  {
    id: 'taskOne',
    title: 'Work on React.js app',
    amount: 50,
    completed: 0,
  },
  {
    id: 'taskThree',
    title: 'Write Tests',
    amount: 60,
    completed: 59,
  },
  {
    id: 'taskOne',
    title: 'Do react js stuff',
    amount: 120,
    completed: 0,
  },
];

function mockStore() {
  const tempStore = configureStore({
    reducer: {
      taskBlocks: taskBlockReducer,
    },
  });
  return tempStore;
}

const mockStoreInstance = mockStore();

function blockIndex(taskBlockId: string, taskBlocks: any): number {
  return taskBlocks.findIndex((taskBlock: Task) => taskBlock.id === taskBlockId);
}

describe('taskBlocks redux state tests', () => {
  it('Should initially see taskBlocks as an empty array', () => {
    const { blocks } = store.getState().taskBlocks;
    expect(blocks).toMatchObject(DATA);
  });

  it('Should add a taskBlock to the array', () => {
    store.dispatch(addTaskBlock(dataOne));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks).toHaveLength(4);
  });

  it('Should should add another taskBlock to array and have length 6', () => {
    // store retains dispatch from previous test
    store.dispatch(addTaskBlock(dataOne));
    store.dispatch(addTaskBlock(dataTwo));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks).toHaveLength(6);
  });

  it('Should remove a taskBlock via id and leave the store with 1', () => {
    store.dispatch(removeTaskBlock({ id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba' }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[3].id).toBe('3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
  });

  it('Should replace the information of the appropriate record - title', () => {
    store.dispatch(addTaskBlock(dataOne));
    store.dispatch(updateTaskBlock({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', update: { title: 'New Title' } }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[4].title).toBe('New Title');
  });

  it('Should replace the information of the appropriate record - breaks', () => {
    store.dispatch(updateTaskBlock({ id: 'aabbcc', update: { breaks: false } }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks[0].breaks).toBe(false);
  });
});

describe('taskBlocks.tasks redux state tests', () => {
  it('Should initially see tasks as an empty array', () => {
    mockStoreInstance.dispatch(addTaskBlock(dataThree));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[0].tasks).toEqual([]);
  });

  it('Should add a task to the taskBlock', () => {
    mockStoreInstance.dispatch(addTask({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', task: addedTaskOne }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[2].tasks[0]).toMatchObject(addedTaskOne);
  });

  // it('Should remove a task from the taskBlock', () => {
  //   mockStoreInstance.dispatch(addTaskBlock(dataThree));
  //   mockStoreInstance.dispatch(addTaskBlock(dataTwo));
  //   mockStoreInstance.dispatch(addTask({ id: 'dataThreeId', task: addedTaskTwo }));
  //   const { blocks } = mockStoreInstance.getState().taskBlocks;
  //   expect(blocks[3].tasks).toHaveLength(1);
  // });

  // it('Should remove a task from the taskBlock', () => {
  //   mockStoreInstance.dispatch(addTaskBlock(dataThree));
  //   mockStoreInstance.dispatch(addTaskBlock(dataTwo));
  //   mockStoreInstance.dispatch(addTask({ id: 'dataThreeId', task: addedTaskTwo }));
  //   mockStoreInstance.dispatch(removeTask({ id: 'dataThreeId', taskId: 'taskOne' }));
  //   const { blocks } = mockStoreInstance.getState().taskBlocks;
  //   expect(blocks[3].tasks).toHaveLength(1);
  // });

  it('Should reorder the list of tasks', () => {
    const id = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    mockStoreInstance.dispatch(reorderTasks({ id, updatedOrder: reorderedTasks }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    expect(blocks[2].tasks).toMatchObject(reorderedTasks);
  });
});

describe('Test the toggling of 5 min breaks and autoplay', () => {
  it('Has a value of false for 5 min break', () => {
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { breaks } = blocks[currentIndex];
    expect(breaks).toBe(false);
  });

  it('Toggles the 5 min break from false to true', () => {
    mockStoreInstance.dispatch(toggleBreak({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { breaks } = blocks[currentIndex];
    expect(breaks).toBe(true);
  });

  it('Has the value of false for autoplay', () => {
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { autoplay } = blocks[currentIndex];
    expect(autoplay).toBe(false);
  });

  it('Toggles autoplay from false to true', () => {
    mockStoreInstance.dispatch(toggleAutoplay({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' }));
    const { blocks } = mockStoreInstance.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { autoplay } = blocks[currentIndex];
    expect(autoplay).toBe(true);
  });
});

describe('Methods pertaining to Now Playing screen', () => {
  const nowPlayingStore = mockStore();
  it('Should delete the appropriate task', () => {
    const id = '58694a0f-3da1-471f-bd96-145571e29d72';
    const taskId = 'taskTwo';
    const expected = [
      { id: 'taskOne', title: 'Active', amount: 25, completed: 0 },
      { id: 'taskThree', title: 'Active', amount: 25, completed: 0 },
    ];
    nowPlayingStore.dispatch(removeTask({ id, taskId }));
    const { blocks } = nowPlayingStore.getState().taskBlocks;
    const { tasks } = blocks[blockIndex(id, blocks)];
    expect(tasks).toMatchObject(expected);
  });

  it('Should mark a task as done (completed equals amount)', () => {
    const id = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskTwo';
    nowPlayingStore.dispatch(markTaskComplete({ id, taskId }));
    const { blocks } = nowPlayingStore.getState().taskBlocks;
    expect(blocks[1].tasks[1].amount === blocks[1].tasks[1].completed).toBeTruthy();
  });

  it('Should duplicate the appropriate task and zero out progress', () => {
    const id = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskTwo';
    nowPlayingStore.dispatch(duplicateTask({ id, taskId }));
    const { blocks } = nowPlayingStore.getState().taskBlocks;
    const { title, completed } = blocks[1].tasks[0];
    expect(title === 'Take a cat-nap' && completed === 0).toBeTruthy();
  });

  it('Should update the appropriate task', () => {
    const id = '58694a0f-3da1-471f-bd96-145571e29d72';
    const taskId = 'taskThree';
    const update = { title: 'Rest', amount: 5 };
    nowPlayingStore.dispatch(updateTask({ id, taskId, update }));
    const { blocks } = nowPlayingStore.getState().taskBlocks;
    const { title, amount } = blocks[2].tasks[1];
    expect(title === 'Rest' && amount === 5).toBeTruthy();
  });
});

describe('Methods pertaining to playing task', () => {
  it('Should decrement the time (amount) by the value passed in', () => {
    const taskBlockId = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskOne';
    store.dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 1 }));
    const { blocks } = store.getState().taskBlocks;
    const { tasks } = blocks[blockIndex(taskBlockId, blocks)];
    expect(tasks[0].completed).toBe(1);
  });
  it('Should not decrement if the completed value is equal to or less than the amount', () => {
    const taskBlockId = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskThree';
    store.dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 1 }));
    store.dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 1 }));
    const { blocks } = store.getState().taskBlocks;
    const { tasks } = blocks[blockIndex(taskBlockId, blocks)];
    expect(tasks[2].completed).toBe(60);
  });
});
