/* eslint-disable no-console */
const logger = (store: { getState: () => any; }) => (next: (arg0: any) => any) => (action: { type: any; }) => {
  console.group(action.type);
  console.log('The action:', action);
  const result = next(action);
  console.log('The new state is:', store.getState());
  console.groupEnd();
  return result;
};

export default logger;
