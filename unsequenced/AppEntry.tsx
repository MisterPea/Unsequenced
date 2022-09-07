/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskBlocks from './screens/TaskBlocks';
import NowPlaying from './screens/NowPlaying';
import Settings from './screens/Settings';
import { useAppSelector } from './redux/hooks';
import CreateNewTaskBlock from './screens_modals/CreateNewTaskBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppEntry() {
  const { screenMode, keyboardOffset } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { offset } = keyboardOffset;
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark';
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    /// Look at local storage on start---populate state
  }, []);

  function TaskBlocksNavigator() {
    return (

      <Stack.Navigator>
        <Stack.Screen
          name="Task Blocks"
          component={TaskBlocks}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="createNewTaskBlock"
          initialParams={{ mode }}
          component={CreateNewTaskBlock}
          options={{
            presentation: 'modal',
            headerShown: false,

            contentStyle: {
              backgroundColor: 'transparent',
              flex: 1,
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <StatusBar
        style={statusBarStyle}
        hidden={offset < 0}
      />

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 20,
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="TaskBlocksNavigator"
            component={TaskBlocksNavigator}
            options={{
              title: 'Task Blocks',

            }}
          />
          <Stack.Screen
            name="Now Playing"
            component={NowPlaying}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
