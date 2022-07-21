/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { Task, TaskBlock, TaskBlockUpdate, TaskUpdate } from '../constants/types';
import DATA from '../constants/DATA';

// const initialState = [] as TaskBlock[];
const initialState = DATA;

const taskBlockSlice = createSlice({
  name: 'taskBlocks',
  initialState: {
    blocks: initialState,
  },
  reducers: {
    addTaskBlock: (state: { blocks: TaskBlock[]; }, action: { payload: TaskBlock }) => {
      state.blocks.push(action.payload);
    },
    removeTaskBlock: (state:{blocks: TaskBlock[]}, action:{payload: {id:string}}) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        state.blocks.splice(index, 1);
      }
    },
    // À-la-carte updating of all fields except id or tasks
    updateTaskBlock: (state:{blocks:TaskBlock[]}, action:{payload: {id:string, update: TaskBlockUpdate}}) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        const { title, breaks, autoplay } = action.payload.update;
        const newRecord:TaskBlock = {
          id: action.payload.id,
          title: title || state.blocks[index].title,
          breaks: breaks === undefined ? state.blocks[index].breaks : breaks,
          autoplay: autoplay === undefined ? state.blocks[index].autoplay : autoplay,
          tasks: state.blocks[index].tasks,
        };
        state.blocks.splice(index, 1, newRecord);
      }
    },
    addTask: (state:{blocks:TaskBlock[]}, action:{payload:{id:string, task:Task}}) => {
      const index = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (index > -1) {
        state.blocks[index].tasks.push(action.payload.task);
      }
    },
    removeTask: (state:{blocks:TaskBlock[]}, action:{payload:{id:string, taskId: string}}) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1);
      }
    },
    updateTask: (state:{blocks:TaskBlock[]}, action:{payload:{id:string, taskId: string, update: TaskUpdate }}) => {
      const taskBlockIndex = state.blocks.findIndex((block) => block.id === action.payload.id);
      if (taskBlockIndex > -1) {
        const taskIndex = state.blocks[taskBlockIndex].tasks.findIndex((task) => task.id === action.payload.taskId);
        const { title, amount, isBreak } = action.payload.update;
        const newRecord = {
          id: action.payload.taskId,
          title: title || state.blocks[taskBlockIndex].tasks[taskIndex].title,
          amount: amount || state.blocks[taskBlockIndex].tasks[taskIndex].amount,
          isBreak: isBreak === undefined ? state.blocks[taskBlockIndex].tasks[taskIndex].isBreak : isBreak,
        };
        state.blocks[taskBlockIndex].tasks.splice(taskIndex, 1, newRecord);
      }
    },
  },
});

export default taskBlockSlice.reducer;
export const {
  addTaskBlock, removeTaskBlock, updateTaskBlock, addTask, removeTask, updateTask,
} = taskBlockSlice.actions;
