import { configureStore, Store } from '@reduxjs/toolkit';
import taskBlockReducer from '../../redux/taskBlocks';
import notificationPrefsReducer from '../../redux/notificationPrefs';
import screenModeReducer from '../../redux/screenMode';
import keyboardOffsetReducer from '../../redux/keyboardOffset';
import currentBlockReducer from '../../redux/currentBlock';
import onboardingReducer from '../../redux/firstRun';

interface MockStore extends Store {
  getState: () => {};
}

type REF_OBJ = {
  store?: MockStore;
};

export default function mockStore() {
  const refObj: REF_OBJ = {};
  beforeEach(() => {
    const tempStore = configureStore({
      reducer: {
        currentBlock: currentBlockReducer,
        taskBlocks: taskBlockReducer,
        screenMode: screenModeReducer,
        notificationPrefs: notificationPrefsReducer,
        keyboardOffset: keyboardOffsetReducer,
        firstRun: onboardingReducer,
      },
    });
    refObj.store = tempStore;
  });
  return refObj;
}
