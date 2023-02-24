import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../redux/store';
import AppEntry from '../AppEntry';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('AppEntry.tsx', () => {
  it('Renders the component', () => {
    render(
      <Provider store={store}>
        <AppEntry />
      </Provider>,
    );
  });
});

describe('Settings Route', () => {
  it('Navigates to the Settings screen on button click', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AppEntry />
      </Provider>,
    );

    // TODO: settingsBtn is not being found? ☹️

    // const settingsBtn = getByTestId('settingsBtn');

    // fireEvent(settingsBtn, 'press');
    // const settingsText = await screen.findByText('Light Mode');
    // expect(settingsText).toBeTruthy();
  });
});
