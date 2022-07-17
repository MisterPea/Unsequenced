import { configureStore } from '@reduxjs/toolkit';
import taskBlockReducer from './taskBlocks';
import screenModeReducer from './screenMode';
import quietModeReducer from './quietMode';

const store = configureStore({
  reducer: {
    taskBlocks: taskBlockReducer,
    screenMode: screenModeReducer,
    quietMode: quietModeReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
