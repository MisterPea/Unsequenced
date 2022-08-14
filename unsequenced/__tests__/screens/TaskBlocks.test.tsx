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

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

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

// to appease TaskBlocks prop

describe('TaskBlocks.tsx', () => {
  const stumpNav:any = {
    navigation: {
      navigate: () => {},
    },
  };

  it('Renders the component', () => {
    render(<Provider store={mockStoreInstance}><TaskBlocks navigation={stumpNav} /></Provider>);
  });

  it('Should have render 3 taskBlocks', () => {
    // populateStore();
    render(<Provider store={mockStoreInstance}><TaskBlocks navigation={stumpNav} /></Provider>);
    const elements = screen.getAllByTestId('taskBlockListItem');
    expect(elements).toHaveLength(3);
  });

  it('Should render a "Create New Task Block" button', () => {
    const { findByTestId } = render(
      <Provider store={mockStoreInstance}>
        <TaskBlocks navigation={stumpNav} />
      </Provider>,
    );

    const button = findByTestId('pillButtonFilledId');
    expect(button).toBeDefined();
  });
});
