/* eslint-disable max-len */
import { duplicateTask, markTaskComplete, addTaskBlock, removeTaskBlock, updateTaskBlock, addTask, removeTask, updateTask, toggleAutoplay, toggleBreak, reorderTasks, decrementTask } from '../../redux/taskBlocks';
import { Task, TaskBlock } from '../../constants/types';
import DATA from '../../constants/DATA';
import mockStore from '../../jest/testHelpers/mockStore';

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
    id: 'taskOne',
    title: 'Do react js stuff',
    amount: 120,
    completed: 0,
  },
];

function blockIndex(taskBlockId: string, taskBlocks: any): number {
  return taskBlocks.findIndex((taskBlock: Task) => taskBlock.id === taskBlockId);
}

describe('taskBlocks redux state tests', () => {
  const storeRef = mockStore();

  it('Should initially see taskBlocks as an empty array', () => {
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks).toHaveLength(0);
  });

  it('Should add a taskBlock to the array', () => {
    storeRef.store.dispatch(addTaskBlock(dataOne));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks).toHaveLength(1);
  });

  it('Should should add another taskBlock to array and have length 6', () => {
    // store retains dispatch from previous test
    storeRef.store.dispatch(addTaskBlock(dataOne));
    storeRef.store.dispatch(addTaskBlock(dataTwo));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks).toHaveLength(2);
  });

  it('Should remove a taskBlock via id and leave the store with 1', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    storeRef.store.dispatch(removeTaskBlock({ id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba' }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[1].id).toBe('3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
  });

  it('Should replace the information of the appropriate record - title', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    storeRef.store.dispatch(updateTaskBlock({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', update: { title: 'New Title' } }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[1].title).toBe('New Title');
  });

  it('Should replace the information of the appropriate record - breaks', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(dataTwo));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    storeRef.store.dispatch(updateTaskBlock({ id: 'aabbcc', update: { breaks: false } }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[1].breaks).toBe(false);
  });
});

describe('taskBlocks.tasks redux state tests', () => {
  const storeRef = mockStore();

  it('Should initially see tasks as an empty array', () => {
    storeRef.store.dispatch(addTaskBlock(dataThree));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[0].tasks).toHaveLength(0);
  });

  it('Should add a task to the taskBlock', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTask({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', task: addedTaskOne }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[0].tasks[0]).toMatchObject(addedTaskOne);
  });

  it('Should reorder the list of tasks', () => {
    const id = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(reorderTasks({ id, updatedOrder: reorderedTasks }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[0].tasks).toMatchObject(reorderedTasks);
  });
});

describe('Test the toggling of 5 min breaks and autoplay', () => {
  const storeRef = mockStore();

  it('Has a value of false for 5 min break', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { breaks } = blocks[currentIndex];
    expect(breaks).toBe(false);
  });

  it('Toggles the 5 min break from false to true', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    storeRef.store.dispatch(toggleBreak({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { breaks } = blocks[currentIndex];
    expect(breaks).toBe(true);
  });

  it('Has the value of true for autoplay', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { autoplay } = blocks[currentIndex];
    expect(autoplay).toBe(true);
  });

  it('Toggles autoplay from false to true', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    storeRef.store.dispatch(toggleAutoplay({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === '3ac68afc-c605-48d3-a4f8-fbd91aa97f63');
    const { autoplay } = blocks[currentIndex];
    expect(autoplay).toBe(false);
  });
});

describe('Methods pertaining to Now Playing screen', () => {
  const storeRef = mockStore();

  it('Should delete the appropriate task', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const id = '58694a0f-3da1-471f-bd96-145571e29d72';
    const taskId = 'taskTwo';
    const expected = [
      { id: 'taskOne', title: 'Active', amount: 25, completed: 0 },
      { id: 'taskThree', title: 'Active', amount: 25, completed: 0 },
    ];
    storeRef.store.dispatch(removeTask({ id, taskId }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const { tasks } = blocks[blockIndex(id, blocks)];
    expect(tasks).toMatchObject(expected);
  });

  it('Should mark a task as done (completed equals amount)', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const id = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskTwo';
    storeRef.store.dispatch(markTaskComplete({ id, taskId }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks[1].tasks[1].amount === blocks[1].tasks[1].completed).toBeTruthy();
  });

  it('Should duplicate the appropriate task and zero out progress', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const id = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskTwo';
    storeRef.store.dispatch(duplicateTask({ id, taskId }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const { title, completed } = blocks[1].tasks[0];
    expect(title === 'Take a cat-nap' && completed === 0).toBeTruthy();
  });

  it('Should update the appropriate task', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const id = '58694a0f-3da1-471f-bd96-145571e29d72';
    const taskId = 'taskThree';
    const update = { title: 'Rest', amount: 5 };
    storeRef.store.dispatch(updateTask({ id, taskId, update }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const { title, amount } = blocks[0].tasks[1];
    expect(title === 'Rest' && amount === 5).toBeTruthy();
  });
});

describe('Methods pertaining to playing task', () => {
  const storeRef = mockStore();

  it('Should decrement the time (amount) by the value passed in', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const taskBlockId = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskOne';
    storeRef.store.dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 1 }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const { tasks } = blocks[blockIndex(taskBlockId, blocks)];
    expect(tasks[0].completed).toBe(1);
  });

  it('Should not decrement if the completed value is equal to or less than the amount', () => {
    storeRef.store.dispatch(addTaskBlock(DATA[0]));
    storeRef.store.dispatch(addTaskBlock(DATA[1]));
    storeRef.store.dispatch(addTaskBlock(DATA[2]));
    const taskBlockId = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const taskId = 'taskThree';
    storeRef.store.dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 1 }));
    storeRef.store.dispatch(decrementTask({ taskBlockId, taskId, decrementAmount: 1 }));
    const { blocks } = storeRef.store.getState().taskBlocks;
    const { tasks } = blocks[blockIndex(taskBlockId, blocks)];
    expect(tasks[2].completed).toBe(60);
  });
});
