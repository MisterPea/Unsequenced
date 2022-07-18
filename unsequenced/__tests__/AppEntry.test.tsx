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

  it('Renders settings button', () => {
    const component = <Provider store={store}><AppEntry /></Provider>;
    const { getByTestId } = render(component);
    const settingsBtn = getByTestId('taskBlockSettings');

    expect(settingsBtn).toBeTruthy();
  });

  it('Takes you to settings page on button click', async () => {
    const component = <Provider store={store}><AppEntry /></Provider>;
    const { getByTestId } = render(component);
    const settingsBtn = getByTestId('taskBlockSettings');

    fireEvent(settingsBtn, 'press');
    const settingsText = await screen.findByText('LIGHT/DARK MODE');

    expect(settingsText).toBeTruthy();
  });
});
