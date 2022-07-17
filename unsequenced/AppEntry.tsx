/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import TaskBlocks from './screens/TaskBlocks';
import AddTask from './screens/AddTask';
import NowPlaying from './screens/NowPlaying';
import Settings from './screens/Settings';
import { useAppSelector } from './redux/hooks';
import colors from './constants/GlobalStyles';

type RootStackParamList = {
  Settings: undefined
};
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
type NavProps = SettingsScreenProps['navigation'];

export default function AppEntry() {
  const { mode } = useAppSelector((state) => state.screenMode);
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark';
  const Stack = createNativeStackNavigator();

  function SettingsButton({ nav }:{nav:NavProps}) {
    return (
      <Pressable onPress={() => nav.navigate('Settings')}>
        <MaterialIcons
          name="settings"
          size={24}
          color={colors.textTwo[mode]}
        />
      </Pressable>
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
            name="Task Blocks"
            component={TaskBlocks}
            options={({ navigation }) => ({
              headerRight: () => <SettingsButton nav={navigation} />,
            })}
          />
          <Stack.Screen
            name="Add a Task"
            component={AddTask}
            options={({ navigation }) => ({
              headerRight: () => <SettingsButton nav={navigation} />,
            })}
          />
          <Stack.Screen
            name="Now Playing"
            component={NowPlaying}
            options={({ navigation }) => ({
              headerRight: () => <SettingsButton nav={navigation} />,
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
