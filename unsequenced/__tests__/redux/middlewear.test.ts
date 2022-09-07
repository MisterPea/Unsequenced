import AsyncStorage from '@react-native-async-storage/async-storage';

describe('AsyncStorage/middlewear tests', () => {
  const items: { [key: string]: string; } = {};

  jest.mock('@react-native-async-storage/async-storage', () => ({
    AsyncStorage: {
      setItem: jest.fn((item: string, value: string) => new Promise((resolve, reject) => {
        items[item] = value;
        resolve(value);
      })),
      multiSet: jest.fn((setItems: [string, string][]) => new Promise((resolve, reject) => {
        for (let i = 0; i < setItems.length; i += 1) {
          const [key, value] = setItems[i];
          items[key] = value;
        }
        resolve(true);
      })),
      getItem: jest.fn((item) => new Promise((resolve, reject) => {
        resolve(items[item]);
      })),
      multiGet: jest.fn((item: string[]) => new Promise((resolve, reject) => {
        const multiGetArray = [];
        for (let i = 0; i < item.length; i += 1) {
          multiGetArray.push([item[i], items[item[i]]]);
        }
        resolve(multiGetArray);
      })),
      removeItem: jest.fn((item) => new Promise((resolve, reject) => {
        resolve(delete items[item]);
      })),
      getAllKeys: jest.fn(() => new Promise((resolve, reject) => {
        resolve(Object.keys(items));
      })),
    },
  }));

  it('Should pull data from AsyncStorage and write to redux store', () => { });
  it('Should update AsyncStorage when the redux store is updated', () => { });
});
