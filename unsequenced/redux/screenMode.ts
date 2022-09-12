/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { ScreenProp } from '../constants/types';

interface ScreenMode {
  mode: string;
}

const initialState: ScreenMode = { mode: 'light' };

const screenModeSlice = createSlice({
  name: 'screenMode',
  initialState,
  reducers: {
    populateScreenMode: (state: { mode: string; }, action: { payload: ScreenProp; }) => {
      const { mode } = action.payload;
      return { ...state, mode };
    },
    toggleScreenMode: (state: { mode: string; }) => ({ ...state, mode: state.mode === 'dark' ? 'light' : 'dark' }),
  },
});

export default screenModeSlice.reducer;
export const { toggleScreenMode, populateScreenMode } = screenModeSlice.actions;
