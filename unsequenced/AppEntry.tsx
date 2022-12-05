/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import TaskBlocks from './screens/TaskBlocks';
import NowPlaying from './screens/NowPlaying';
import Settings from './screens/Settings';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import CreateNewTaskBlock from './screens_modals/CreateNewTaskBlock';
import { populateBlocks } from './redux/taskBlocks';
import { populateQuietMode } from './redux/quietMode';
import { populateScreenMode } from './redux/screenMode';

export default function AppEntry() {
  const { screenMode, keyboardOffset } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { mode } = screenMode;
  const { offset } = keyboardOffset;
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark';
  const Stack = createNativeStackNavigator();
  const firstRun = useRef(true);
  // const [currAppState, setCurrAppState] = useState();

  function setBlocks(blocks: string | null) {
    if (blocks) {
      dispatch(populateBlocks({ blocks: JSON.parse(blocks) }));
    }
  }

  function setQuietMode(isQuiet: string | null) {
    if (isQuiet) {
      dispatch(populateQuietMode({ isQuiet: JSON.parse(isQuiet) }));
    }
  }

  function setScreenMode(modeString: string | null) {
    if (modeString) {
      dispatch(populateScreenMode({ mode: modeString }));
    }
  }

  async function allowNotifications() {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted
      || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  }

  async function requestPermissions() {
    return Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  }

  useEffect(() => {
    async function getLocalStorage() {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 3 && firstRun.current === true) {
        const blocks: string | null = await AsyncStorage.getItem('blocks');
        setBlocks(blocks);

        const isQuiet: string | null = await AsyncStorage.getItem('isQuiet');
        setQuietMode(isQuiet);

        const screenModeString: string | null = await AsyncStorage.getItem('mode');
        setScreenMode(screenModeString);
        firstRun.current = false;
      }
    }

    getLocalStorage();
  }, []);

  useEffect(() => {
    async function checkNotificationPermissions() {
      const hasNotificationsPermissionsGranted = await allowNotifications();
      if (!hasNotificationsPermissionsGranted) {
        await requestPermissions();
      }
    }
    checkNotificationPermissions();
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
