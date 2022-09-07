/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { Task, TaskBlock, TaskBlockUpdate, TaskUpdate } from '../constants/types';
import DATA from '../constants/DATA';

const initialState = [] as TaskBlock[];
type minutes = number;

// const initialState = [];

const taskBlockSlice = createSlice({
  name: 'taskBlocks',
  initialState: {
    blocks: initialState,
  },
  reducers: {
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
          amount: amount || state.blocks[taskBlockIndex].tasks[taskIndex].amount,
          completed: completed || state.blocks[taskBlockIndex].tasks[taskIndex].completed,
        };
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
      }
    },
    reorderTasks: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, updatedOrder: Task[]; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const deleteAmount = state.blocks[taskBlockIndex].tasks.length;
        state.blocks[taskBlockIndex].tasks.splice(0, deleteAmount, ...action.payload.updatedOrder);
      }
    },
    toggleBreak: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const currentBlock = state.blocks[taskBlockIndex];
        currentBlock.breaks = !currentBlock.breaks;
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
        const newRecord = { ...state.blocks[taskBlockIndex].tasks[taskIndex], completed: amt };
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
      }
    },
    duplicateTask: (state: { blocks: TaskBlock[]; }, action: { payload: { id: string, taskId: string; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const { title } = state.blocks[taskBlockIndex];
        const newId = `${title}${Math.random().toString(36).replace(/[^\w\s']|_/g, '')}`;
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        const duplicateRecord = { ...state.blocks[taskBlockIndex].tasks[taskIndex], id: newId, completed: 0 };
        state.blocks[taskBlockIndex].tasks.unshift(duplicateRecord);
      }
    },
    decrementTask: (state: { blocks: TaskBlock[]; }, action: { payload: { taskBlockId: string, taskId: string, decrementAmount: minutes; }; }) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.taskBlockId);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        if (taskIndex > -1) {
          const { completed, amount, title, id } = state.blocks[taskBlockIndex].tasks[taskIndex];
          if (completed < amount) {
            const newRecord = {
              title,
              amount,
              id,
              completed: completed + action.payload.decrementAmount,
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
  addTaskBlock,
  removeTaskBlock,
  updateTaskBlock,
  addTask,
  removeTask,
  updateTask,
  toggleAutoplay,
  toggleBreak,
  reorderTasks,
  markTaskComplete,
  duplicateTask,
  decrementTask,
} = taskBlockSlice.actions;
