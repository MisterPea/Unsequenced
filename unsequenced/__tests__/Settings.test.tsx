import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react-native';
import store from '../redux/store';
import Settings from '../screens/Settings';

describe('Settings component', () => {
  const component = (
    <Provider store={store}>
      <Settings />
    </Provider>
  );

  it('Renders the component', () => {
    render(component);
  });

  // Screen Mode
  it('screenMode.mode has initial value of "light"', () => {
    const screenState = store.getState().screenMode.mode;
    expect(screenState).toBe('light');
  });

  it('Toggles the mode from "light" to "dark"', () => {
    const { getByTestId } = render(component);
    const darkModeBtn = getByTestId('lightDarkModeBtn');

    fireEvent(darkModeBtn, 'valueChange', 'true');

    const screenState = store.getState().screenMode.mode;
    expect(screenState).toBe('dark');
  });

  // Quiet Mode
  it('quietMode has initial value of false', () => {
    const quietState = store.getState().quietMode.isQuiet;
    expect(quietState).toBeFalsy();
  });

  it('Toggles isQuiet mode from false to true', () => {
    const { getByTestId } = render(component);
    const isQuietBtn = getByTestId('quietModeBtn');

    fireEvent(isQuietBtn, 'valueChange', 'true');

    const quietState = store.getState().quietMode.isQuiet;
    expect(quietState).toBeTruthy();
  });
});
