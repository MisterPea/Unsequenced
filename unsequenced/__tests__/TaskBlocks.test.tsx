import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../redux/store';
import TaskBlocks from '../screens/TaskBlocks';

describe('TaskBlocks.tsx', () => {
  it('Renders the component', () => {
    render(<Provider store={store}><TaskBlocks /></Provider>);
  });
});
