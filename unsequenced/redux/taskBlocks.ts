import { createSlice } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  amount: Number;
  isBreak: boolean;
}

interface TaskBlock {
  id: string;
  title: string;
  breaks: boolean;
  autoplay: boolean;
  totalTime: Number;
  tasks: Task[];
}

const initialState = [] as TaskBlock[];

const taskBlockSlice = createSlice({
  name: 'taskBlocks',
  initialState: {
    taskBlocks: initialState,
  },
  reducers: {
    addTaskBlock: () => { },
    removeTaskBlock: () => { },
    updateTaskBlock: () => { },
  },
});

export default taskBlockSlice.reducer;

// darkMode: false,
// currentPlay: undefined,
