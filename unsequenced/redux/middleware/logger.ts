/* eslint-disable no-console */
const logger = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: { type: any, payload: any; }) => {
  console.log('<><><><><><><><><><><>');
  console.group(action.type);
  console.log('<><><><><><><><><><><>');
  console.log('The payload:', action.payload);
  const result = next(action);
  // console.log('The action:', action);
  // const result = next(action);
  // console.log('---------------------------')
  console.log('The new state is:', store.getState());
  console.groupEnd();
  return result;
};

export default logger;
