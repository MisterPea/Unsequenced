/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { useFonts, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'
import { Text } from 'react-native';
import store from './redux/store';
import AppEntry from './AppEntry';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium });

  if (!fontsLoaded) {
    return <Text>Loading Fonts</Text>;
  }

  return (
    <Provider store={store}>
      <AppEntry />
    </Provider>
  );
}
