import store from '../../redux/store';
import { setKeyboardOffset } from '../../redux/keyboardOffset';

describe('Keyboard Offset redux tests', () => {
  it('Should return 0 on the initial run', () => {
    const { offset } = store.getState().keyboardOffset;
    expect(offset).toBe(0);
  });

  it('Should change the value of the offset', () => {
    store.dispatch(setKeyboardOffset({ offset: -432 }));
    const { offset } = store.getState().keyboardOffset;
    expect(offset).toBe(-432);
  });
});
