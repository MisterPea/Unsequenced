import { configureStore } from '@reduxjs/toolkit';
import taskBlockReducer from './taskBlocks';
import screenModeReducer from './screenMode';
import keyboardOffsetReducer from './keyboardOffset';
import asyncStorage from './middleware/asyncStorage';
import currentBlockReducer from './currentBlock';
import notificationPrefsReducer from './notificationPrefs';
import onboardingReducer from './firstRun';

const store = configureStore({
  reducer: {
    currentBlock: currentBlockReducer,
    taskBlocks: taskBlockReducer,
    screenMode: screenModeReducer,
    keyboardOffset: keyboardOffsetReducer,
    notificationPrefs: notificationPrefsReducer,
    firstRun: onboardingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(asyncStorage),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
