import { createSlice } from '@reduxjs/toolkit';
import { QuietProp } from '../constants/types';

interface QuietMode {
  isQuiet: boolean;
}

const initialState: QuietMode = { isQuiet: false };

const quietModeSlice = createSlice({
  name: 'quietMode',
  initialState,
  reducers: {
    populateQuietMode: (state: { isQuiet: boolean; }, action: { payload: QuietProp; }) => {
      const { isQuiet } = action.payload;
      return { ...state, isQuiet };
    },
    toggleQuietMode: (state: { isQuiet: boolean; }) => ({ ...state, isQuiet: !state.isQuiet }),
  },
});

export default quietModeSlice.reducer;
export const { toggleQuietMode, populateQuietMode } = quietModeSlice.actions;
