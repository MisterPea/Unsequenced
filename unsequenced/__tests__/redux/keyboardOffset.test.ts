import { setKeyboardOffset } from '../../redux/keyboardOffset';
import mockStore from '../../jest/testHelpers/mockStore';

describe('Keyboard Offset redux tests', () => {
  const storeRef = mockStore();

  it('Should return 0 on the initial run', () => {
    const { offset } = storeRef.store.getState().keyboardOffset;
    expect(offset).toBe(0);
  });

  it('Should change the value of the offset', () => {
    storeRef.store!.dispatch(setKeyboardOffset({ offset: -432 }));
    const { offset } = storeRef.store!.getState().keyboardOffset;
    expect(offset).toBe(-432);
  });
});
