/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import TaskBlocks from './screens/TaskBlocks';
import AddTask from './screens/AddTask';
import NowPlaying from './screens/NowPlaying';
import Settings from './screens/Settings';
import { useAppSelector } from './redux/hooks';
import colors from './constants/GlobalStyles';
import CreateNewTaskBlock from './screens_modals/CreateNewTaskBlock';
import { SettingsNavProps } from './constants/types';

export default function AppEntry() {
  const { mode } = useAppSelector((state) => state.screenMode);
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark';
  const Stack = createNativeStackNavigator();

  function SettingsButton({ testID, nav }:{testID:string, nav:SettingsNavProps}) {
    return (
      <Pressable
        testID={testID}
        onPress={() => nav.navigate('Settings')}
      >
        <MaterialIcons
          name="settings"
          size={24}
          color={colors.textTwo[mode]}
        />
      </Pressable>
    );
  }

  function TaskBlocksNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Task Blocks"
          component={TaskBlocks}
          options={({ navigation }) => ({
            headerShown: false,
            headerRight: () => <SettingsButton testID="taskBlockSettings" nav={navigation} />,
          })}
        />
        <Stack.Screen
          name="createNewTaskBlock"
          initialParams={{ mode }}
          component={CreateNewTaskBlock}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.topBar[mode] },
            headerTitleStyle: {
              color: colors.textOne[mode],
              fontFamily: 'Roboto_500Medium',
              fontSize: 20,
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="TaskBlocksNavigator"
            component={TaskBlocksNavigator}
            options={({ navigation }) => ({
              title: 'Task Blocks',
              headerRight: () => <SettingsButton testID="taskBlockSettings" nav={navigation} />,
            })}
          />
          <Stack.Screen
            name="Add a Task"
            initialParams={{ mode }}
            component={AddTask}
            options={({ navigation }) => ({
              headerRight: () => <SettingsButton testID="addTaskSettings" nav={navigation} />,
              headerLeft: () => (
                <Pressable onPress={() => navigation.reset({ index: 1,
                  routes: [{ name: 'TaskBlocksNavigator' }] })}
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={28}
                    color={colors.textTwo[mode]}
                  />
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Now Playing"
            component={NowPlaying}
            options={({ navigation }) => ({
              headerRight: () => <SettingsButton testID="nowPlayingSettings" nav={navigation} />,
            })}
          />

          <Stack.Screen
            name="Settings"
            component={Settings}
            options={({ navigation }) => ({
              headerLeft: () => (
                <Pressable onPress={() => navigation.goBack()}>
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={28}
                    color={colors.textTwo[mode]}
                  />
                </Pressable>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
