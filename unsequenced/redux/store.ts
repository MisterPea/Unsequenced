import { configureStore } from '@reduxjs/toolkit';
import taskBlockReducer from './taskBlocks';
import screenModeReducer from './screenMode';
import quietModeReducer from './quietMode';
import keyboardOffsetReducer from './keyboardOffset';

const store = configureStore({
  reducer: {
    taskBlocks: taskBlockReducer,
    screenMode: screenModeReducer,
    quietMode: quietModeReducer,
    keyboardOffset: keyboardOffsetReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
