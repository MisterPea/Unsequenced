import { createSlice } from '@reduxjs/toolkit';

interface KeyboardOffset {
  offset: number;
}

const initialState: KeyboardOffset = { offset: 0 };

const keyboardOffsetSlice = createSlice({
  name: 'keyboardOffset',
  initialState,
  reducers: {
    setKeyboardOffset: (state: {offset:number;}, action:{payload: {offset: number}}) => (
      { ...state, offset: action.payload.offset }
    ),
  },
});

export default keyboardOffsetSlice.reducer;
export const { setKeyboardOffset } = keyboardOffsetSlice.actions;
