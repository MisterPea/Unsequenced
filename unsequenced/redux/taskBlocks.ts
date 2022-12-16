/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { Task, TaskBlock, TaskBlockUpdate, TaskUpdate, Blocks } from '../constants/types';
// import DATA from '../constants/DATA';

const initialState = [] as TaskBlock[];
type minutes = number;

// const initialState = [];
const generateId = (title: string) => `${title}${Math.random().toString(36).replace(/[^\w\s']|_/g, '')}`;

/**
 * This method is used to add/remove the automatically added task breaks.
 * The general idea is that we have to remove them all and add them back in whenever a
 * change to the Tasks Array is made. This is easier than keeping explicit track of the breaks.
 * We first check for existing tasks breaks and (if there are any) we remove them and store them.
 * If we need to reuse them, we retrieve them in the order they were added last-in/last-out.
 */
function executeBreaks(state: any, index: number, breakAmount: number) {
  const { tasks }: { tasks: Task[]; } = state.blocks[index];
  if (state.blocks[index].breaks === true) {
    const newTasks: Task[] = [];
    const previousBreaks: Task[] | any = [];

    /**
     * Because of a strange lag in the update of tasks:Task[], we have to continuously check
     * for breaks until none are found: Hence, the while loop with Array.some.
     */
    const removeBreak = () => {
      const curIndex = tasks.findIndex((element) => element.break === true);
      previousBreaks.push(tasks.splice(curIndex, 1)[0]);
    };

    while (tasks.some((element) => element.break === true)) {
      removeBreak();
    }

    for (let i = 0; i < tasks.length; i += 1) {
      if (i === 0) {
        newTasks.push(tasks[i]);
      } else {
        if (previousBreaks.length > 0) {
          newTasks.push(previousBreaks.shift());
        } else {
          newTasks.push({
            id: generateId('break'),
            title: `${breakAmount} minute break.`,
            amount: breakAmount,
            completed: 0,
            break: true,
          });
        }
        newTasks.push(tasks[i]);
      }
    }

    const deleteAmount = state.blocks[index].tasks.length;
    state.blocks[index].tasks.splice(0, deleteAmount, ...newTasks);
  } else {
    const newTasks: Task[] = [];
    const { tasks } = state.blocks[index];
    for (let i = 0; i < tasks.length; i += 1) {
      if (!tasks[i].break) {
        newTasks.push(tasks[i]);
      }
    }
    const deleteAmount = state.blocks[index].tasks.length;
    state.blocks[index].tasks.splice(0, deleteAmount, ...newTasks);
  }
}

const taskBlockSlice = createSlice({
  name: 'taskBlocks',
  initialState: {
    blocks: initialState,
  },

  reducers: {
    populateBlocks: (state: { blocks: TaskBlock[]; }, action: { payload: Blocks; }) => {
      const { blocks } = action.payload;
      state.blocks.push(...blocks);
    },
    addTaskBlock: (state: { blocks: TaskBlock[]; }, action: { payload: TaskBlock; }) => {
      state.blocks.unshift(action.payload);
    },
    removeTaskBlock: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string; }; }) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        state.blocks.splice(index, 1);
      }
    },
    // À-la-carte updating of all fields except id or tasks
    updateTaskBlock: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, update: TaskBlockUpdate; }; }) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        const { title, breaks, autoplay } = action.payload.update;
        const newRecord: TaskBlock = {
          id: action.payload.id,
          title: title || state.blocks[index].title,
          breaks: breaks === undefined ? state.blocks[index].breaks : breaks,
          autoplay: autoplay === undefined ? state.blocks[index].autoplay : autoplay,
          tasks: state.blocks[index].tasks,
        };
        state.blocks.splice(index, 1, newRecord);
      }
    },
    init: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string; }; }) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        executeBreaks(state, index, 5);
      }
    },
    addTask: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, task: Task; }; }) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        state.blocks[index].tasks.unshift(action.payload.task);
      }
    },
    removeTask: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, taskId: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1);
        executeBreaks(state, taskBlockIndex, 5);
      }
    },
    resetAllTasks: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        for (let i = 0; i < state.blocks[taskBlockIndex].tasks.length; i += 1) {
          const { id, title, amount } = state.blocks[taskBlockIndex].tasks[i];
          const newRecord = {
            id,
            title,
            amount,
            break: state.blocks[taskBlockIndex].tasks[i].break || false,
            completed: 0,
            notified: false,
          };
          state.blocks[taskBlockIndex].tasks.splice(i, 1, newRecord);
        }
      }
    },
    resetTaskTime: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, taskId: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        const newRecord = {
          id: action.payload.taskId,
          title: state.blocks[taskBlockIndex].tasks[taskIndex].title,
          amount: state.blocks[taskBlockIndex].tasks[taskIndex].amount,
          break: state.blocks[taskBlockIndex].tasks[taskIndex].break || false,
          completed: 0,
          notified: false,
        };
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
      }
    },
    updateTask: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, taskId: string, update: TaskUpdate; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        const { title, amount, completed } = action.payload.update;
        const newRecord = {
          id: action.payload.taskId,
          title: title || state.blocks[taskBlockIndex].tasks[taskIndex].title,
          break: state.blocks[taskBlockIndex].tasks[taskIndex].break || false,
          amount: amount || state.blocks[taskBlockIndex].tasks[taskIndex].amount,
          completed: completed || state.blocks[taskBlockIndex].tasks[taskIndex].completed,
          notified: state.blocks[taskBlockIndex].tasks[taskIndex].notified || false,
        };
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
        if (state.blocks[taskBlockIndex].breaks !== null) {
          executeBreaks(state, taskBlockIndex, 5);
        }
      }
    },
    reorderTasks: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, updatedOrder: Task[]; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const deleteAmount = state.blocks[taskBlockIndex].tasks.length;
        state.blocks[taskBlockIndex].tasks.splice(0, deleteAmount, ...action.payload.updatedOrder);
        executeBreaks(state, taskBlockIndex, 5);
      }
    },
    /**
     * Method to remove all the breaks from a list of Tasks
     */
    toggleBreak: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const currentBlock = state.blocks[taskBlockIndex];
        currentBlock.breaks = !currentBlock.breaks;
        executeBreaks(state, taskBlockIndex, 5);
      }
    },
    toggleAutoplay: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const currentBlock = state.blocks[taskBlockIndex];
        currentBlock.autoplay = !currentBlock.autoplay;
      }
    },
    markTaskComplete: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, taskId: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        const amt = state.blocks[taskBlockIndex].tasks[taskIndex].amount;
        const newRecord = { ...state.blocks[taskBlockIndex].tasks[taskIndex], completed: amt, notified: true };
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
      }
    },
    duplicateTask: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, taskId: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const { title } = state.blocks[taskBlockIndex];
        const id = generateId(title);
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        const duplicateRecord = { ...state.blocks[taskBlockIndex].tasks[taskIndex], id, completed: 0 };
        state.blocks[taskBlockIndex].tasks.unshift(duplicateRecord);
        executeBreaks(state, taskBlockIndex, 5);
      }
    },
    decrementTask: (state: { blocks: TaskBlock[]; }, action: { payload: { taskBlockId: string, taskId: string, decrementAmount: minutes; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.taskBlockId);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        if (taskIndex > -1) {
          const nextTask: Task = state.blocks[taskBlockIndex].tasks[taskIndex];

          if (nextTask.completed < nextTask.amount) {
            const newRecord = {
              title: nextTask.title,
              amount: nextTask.amount,
              break: nextTask.break,
              id: nextTask.id,
              notified: nextTask.notified || false,
              completed: Number((nextTask.completed + action.payload.decrementAmount).toFixed(3)),
            };
            state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
          }
        }
      }
    },
  },
});

export default taskBlockSlice.reducer;
export const {
  init,
  addTaskBlock,
  removeTaskBlock,
  updateTaskBlock,
  addTask,
  removeTask,
  updateTask,
  resetAllTasks,
  resetTaskTime,
  toggleAutoplay,
  toggleBreak,
  reorderTasks,
  markTaskComplete,
  duplicateTask,
  decrementTask,
  populateBlocks,
} = taskBlockSlice.actions;
