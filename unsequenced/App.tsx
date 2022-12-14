import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppEntry from './AppEntry';

export default function App() {
  return (
    <Provider store={store}>
      <AppEntry />
    </Provider>
  );
}
