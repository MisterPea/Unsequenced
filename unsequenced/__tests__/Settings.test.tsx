import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Settings from '../screens/Settings';

describe('Settings.tsx', () => {
  it('Renders the component', () => {
    render(<Provider store={store}><Settings /></Provider>);
  });
});
