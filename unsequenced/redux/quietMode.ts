import { createSlice } from '@reduxjs/toolkit';

interface QuietMode {
  isQuiet: boolean;
}

const initialState: QuietMode = { isQuiet: false };

const quietModeSlice = createSlice({
  name: 'quietMode',
  initialState,
  reducers: {
    toggleQuietMode: (state: { isQuiet: boolean; }) => ({ ...state, isQuiet: !state.isQuiet }),
  },
});

export default quietModeSlice.reducer;
export const { toggleQuietMode } = quietModeSlice.actions;
