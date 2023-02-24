/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { ScreenProp } from '../constants/types';

const initialState: { mode: 'light' | 'dark'; } = { mode: 'light' };

const screenModeSlice = createSlice({
  name: 'screenMode',
  initialState,
  reducers: {
    populateScreenMode: (state: { mode: 'light' | 'dark'; }, action: { payload: ScreenProp; }) => {
      const { mode } = action.payload;
      return { ...state, mode };
    },
    toggleScreenMode: (state: { mode: 'light' | 'dark'; }) => ({ ...state, mode: state.mode === 'dark' ? 'light' : 'dark' }),
  },
});

export default screenModeSlice.reducer;
export const { toggleScreenMode, populateScreenMode } = screenModeSlice.actions;
