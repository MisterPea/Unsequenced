/* eslint-disable max-len */
import React from 'react';
import { View,
  Switch,
  Text,
  StyleSheet } from 'react-native';
import colors from '../constants/GlobalStyles';

export default function SettingsToggleGroup({
  title, screenMode, toggleFunc, switchValue, testID,
}:{title:string, screenMode:string, toggleFunc: ()=> void, switchValue:boolean, testID: string}) {
  return (
    <View style={settingsScreen(screenMode).componentWrapper}>
      <View style={settingsScreen(screenMode).switchWrapper}>
        <Text style={settingsScreen(screenMode).settingTitle}>{title}</Text>
        <Switch
          value={switchValue}
          onValueChange={toggleFunc}
          trackColor={{ true: colors.topBar[screenMode] }}
          testID={testID}
        />
      </View>
    </View>
  );
}

const settingsScreen = (mode:string) => StyleSheet.create({
  componentWrapper: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.taskListItem[mode],
    opacity: 0.95,
    borderRadius: 5,
    marginVertical: 2,
  },
  settingTitle: {
    fontFamily: 'Roboto_500Medium',
    color: colors.textOne[mode],
    fontSize: 15,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 5,
  },
});
