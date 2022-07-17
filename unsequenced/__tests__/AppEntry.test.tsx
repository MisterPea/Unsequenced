import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../redux/store';
import AppEntry from '../AppEntry';

describe('AppEntry.tsx', () => {
  it('Renders the component', () => {
    render(<Provider store={store}><AppEntry /></Provider>);
  });
});
