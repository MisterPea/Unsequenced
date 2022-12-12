import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStorage = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: { type: any; }) => {
  const result = next(action);
  const reducer = action.type.split('/');
  if (reducer[0] === 'taskBlocks') {
    const { taskBlocks, screenMode, notificationPrefs } = store.getState();
    const { blocks } = taskBlocks;
    const { mode } = screenMode;
    const { allowBanners, allowSounds } = notificationPrefs;
    AsyncStorage.multiSet([
      ['blocks', JSON.stringify(blocks)],
      ['mode', mode],
      ['allowBanners', JSON.stringify(allowBanners)],
      ['allowSounds', JSON.stringify(allowSounds)],
    ]);
  }
  return result;
};
export default asyncStorage;
