import { configureStore, Store } from '@reduxjs/toolkit';
import taskBlockReducer from '../../redux/taskBlocks';
import quietModeReducer from '../../redux/quietMode';
import screenModeReducer from '../../redux/screenMode';
import keyboardOffsetReducer from '../../redux/keyboardOffset';

interface MockStore extends Store {
  getState: () => {}
}

type REF_OBJ = {
  store?: MockStore;
};

export default function mockStore() {
  const refObj: REF_OBJ = {};
  beforeEach(() => {
    const tempStore = configureStore({
      reducer: {
        taskBlocks: taskBlockReducer,
        screenMode: screenModeReducer,
        quietMode: quietModeReducer,
        keyboardOffset: keyboardOffsetReducer,
      },
    });
    refObj.store = tempStore;
  });
  return refObj;
}
