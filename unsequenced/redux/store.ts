import { configureStore } from '@reduxjs/toolkit';
import taskBlockReducer from './taskBlocks';
import screenModeReducer from './screenMode';
import quietModeReducer from './quietMode';
import keyboardOffsetReducer from './keyboardOffset';
import logger from './middleware/logger';
import asyncStorage from './middleware/asyncStorage';
import taskBreak from './middleware/break';
import currentBlockReducer from './currentBlock';

const store = configureStore({
  reducer: {
    taskBlocks: taskBlockReducer,
    screenMode: screenModeReducer,
    quietMode: quietModeReducer,
    keyboardOffset: keyboardOffsetReducer,
    currentBlock: currentBlockReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(taskBreak, asyncStorage),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
