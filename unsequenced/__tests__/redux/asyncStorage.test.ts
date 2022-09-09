// import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../../redux/store';
import { populateBlocks } from '../../redux/taskBlocks';
import { populateQuietMode } from '../../redux/quietMode';
import { populateScreenMode } from '../../redux/screenMode';

const mockBlocks = { key: 'blocks', item: [{ id: '058mb3yp0qwt', title: 'TestHello', breaks: true, autoplay: false, tasks: [{ id: 'Hello0flvbnu5047o', title: 'Two', amount: 2, completed: 0 }, { id: 'Hello0ejht8b9hj1e', title: 'One', amount: 1, completed: 0 }] }] };
const mockScreenMode = { key: 'mode', item: 'dark' };
const mockQuietMode = { key: 'isQuiet', item: false };

// These tests are related to the actions run on app start and through middlewear
describe('AsyncStorage-middlewear tests', () => {
  it('Should write data - blocks to redux store', () => {
    store.dispatch(populateBlocks({ blocks: mockBlocks.item }));
    const { blocks } = store.getState().taskBlocks;
    expect(blocks).toMatchObject(mockBlocks.item);
  });
  it('Should write data - quietMode to redux store', () => {
    store.dispatch(populateQuietMode({ isQuiet: mockQuietMode.item }));
    const { isQuiet } = store.getState().quietMode;
    expect(isQuiet).toBe(mockQuietMode.item);
  });
  it('Should write data - screenMode to redux store', () => {
    store.dispatch(populateScreenMode({ mode: mockScreenMode.item }));
    const { mode } = store.getState().screenMode;
    expect(mode).toBe(mockScreenMode.item);
  });
});
