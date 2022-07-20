import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskBlocks from '../../screens/TaskBlocks';
import taskBlockReducer, { addTaskBlock } from '../../redux/taskBlocks';
import screenModeReducer from '../../redux/screenMode';
import quietModeReducer from '../../redux/quietMode';
import DATA from '../../constants/DATA';
import { TaskBlock } from '../../constants/types';

function mockStore() {
  const store = configureStore({
    reducer: {
      taskBlocks: taskBlockReducer,
      screenMode: screenModeReducer,
      quietMode: quietModeReducer,
    },
  });
  return store;
}
const mockStoreInstance = mockStore();

function populateStore() {
  DATA.forEach((block:TaskBlock) => {
    mockStoreInstance.dispatch(addTaskBlock(block));
  });
}

describe('TaskBlocks.tsx', () => {
  it('Renders the component', () => {
    render(<Provider store={mockStoreInstance}><TaskBlocks /></Provider>);
  });

  it('Should have render 3 taskBlocks', () => {
    populateStore();
    render(<Provider store={mockStoreInstance}><TaskBlocks /></Provider>);
    const elements = screen.getAllByTestId('taskBlockListItem');
    expect(elements).toHaveLength(3);
  });
});
