import { createSlice } from '@reduxjs/toolkit';

interface CurrentBlock {
  block: string | null;
}

const initialState: CurrentBlock = { block: null };

const currentBlockSlice = createSlice({
  name: 'currentBlock',
  initialState,
  reducers: {
    setCurrentBlock: (state: { block: CurrentBlock; }, action: { payload: { block: CurrentBlock; }; }) => (
      { ...state, block: action.payload.block }
    ),
  },
});

export default currentBlockSlice.reducer;
export const { setCurrentBlock } = currentBlockSlice.actions;
