/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';
import { Text } from 'react-native';
import store from './redux/store';
import AppEntry from './AppEntry';

export default function App() {
  const [fontsLoaded] = useFonts({ Rubik_700Bold, Rubik_400Regular, Rubik_500Medium });

  if (!fontsLoaded) {
    return <Text>Loading Fonts</Text>;
  }

  return (
    <Provider store={store}>
      <AppEntry />
    </Provider>
  );
}
