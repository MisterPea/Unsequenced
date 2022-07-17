/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';

interface ScreenMode {
  mode:string;
}

const initialState: ScreenMode = { mode: 'light' };

const screenModeSlice = createSlice({
  name: 'screenMode',
  initialState,
  reducers: {
    toggleScreenMode: (state: { mode: string; }) => ({ ...state, mode: state.mode === 'dark' ? 'light' : 'dark' }),
  },
});

export default screenModeSlice.reducer;
export const { toggleScreenMode } = screenModeSlice.actions;
