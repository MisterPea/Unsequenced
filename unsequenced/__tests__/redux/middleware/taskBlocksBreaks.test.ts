import mockStore from '../../../jest/testHelpers/mockStore';
import { addBreaks, removeBreaks, addTaskBlock, toggleBreak } from '../../../redux/taskBlocks';
import DATA from '../../../constants/DATA';

const storeRef = mockStore();
const createTaskBlocks = () => (
  storeRef.store.dispatch(addTaskBlock(DATA[0])),
  storeRef.store.dispatch(addTaskBlock(DATA[1])),
  storeRef.store.dispatch(addTaskBlock(DATA[2])),
  storeRef.store.dispatch(addTaskBlock(DATA[3])),
  storeRef.store.dispatch(toggleBreak({ id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' }))
);

describe('Test the addition and removal of breaks between tasks', () => {
  it('Creates Task Blocks with Tasks', () => {
    createTaskBlocks();
    const { blocks } = storeRef.store.getState().taskBlocks;
    expect(blocks).toHaveLength(4);
  });

  it('Creates 3 Tasks in Task Block', () => {
    createTaskBlocks();
    const blockId = '3ac68afc-c605-48d3-a4f8-fbd91aa97f63';
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === blockId);
    storeRef.store?.dispatch(addBreaks({ id: blockId, amount: 10 }));
    expect(storeRef.store?.getState().taskBlocks.blocks[currentIndex].tasks).toHaveLength(5);
  });

  it('Should correct the spacing of breaks to every other one', () => {
    createTaskBlocks();
    const blockId = '3ac68afc-c605-48d3-a4f8-fbd11aa11f11';
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === blockId);
    storeRef.store?.dispatch(addBreaks({ id: blockId, amount: 10 }));
    expect(storeRef.store?.getState().taskBlocks.blocks[currentIndex].tasks).toHaveLength(5);
  });

  it('Should remove all the breaks from a list of tasks', () => {
    createTaskBlocks();
    const blockId = '3ac68afc-c605-48d3-a4f8-fbd11aa11f11';
    const { blocks } = storeRef.store.getState().taskBlocks;
    const currentIndex = blocks.findIndex(({ id }: { id: string; }) => id === blockId);
    storeRef.store?.dispatch(addBreaks({ id: blockId, amount: 10 }));
    storeRef.store?.dispatch(removeBreaks({ id: blockId }));
    expect(storeRef.store?.getState().taskBlocks.blocks[currentIndex].tasks).toHaveLength(3);
  });
});
