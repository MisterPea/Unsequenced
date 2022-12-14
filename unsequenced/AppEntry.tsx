/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
// import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import TaskBlocks from './screens/TaskBlocks';
import NowPlaying from './screens/NowPlaying';
import Settings from './screens/Settings';
import SplashScreen from './screens/SplashScreen';
import { useAppSelector } from './redux/hooks';
import CreateNewTaskBlock from './screens_modals/CreateNewTaskBlock';
// import { populateBlocks } from './redux/taskBlocks';
// import { populateScreenMode } from './redux/screenMode';
// import { populateAllowBanners, populateAllowSounds } from './redux/notificationPrefs';

export default function AppEntry() {
  const { screenMode, keyboardOffset } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { offset } = keyboardOffset;
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark';
  const Stack = createNativeStackNavigator();

  // Notifications Permissions
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
            name="SplashScreen"
            component={SplashScreen}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="TaskBlocksNavigator"
            component={TaskBlocksNavigator}
            options={{
              title: 'Task Blocks',
              animation: 'fade',
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
