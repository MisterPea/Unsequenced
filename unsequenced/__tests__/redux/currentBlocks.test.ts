import store from '../../redux/store';
import { setCurrentBlock } from '../../redux/currentBlock';
import mockStore from '../../jest/testHelpers/mockStore';

describe('Current Block redux tests', () => {
  const storeRef = mockStore();

  it('Should return null on the initial run', () => {
    const { block } = storeRef.store.getState().currentBlock;
    expect(block).toBeNull();
  });

  it('Should be able to set the value', () => {
    store.dispatch(setCurrentBlock({ block: 'Block A' }));
    const { block } = store.getState().currentBlock;
    expect(block).toBe('Block A');
  });
});
