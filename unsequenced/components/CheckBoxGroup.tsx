/* eslint-disable max-len */
import React from 'react';
import { View,
  Text,
  StyleSheet,
  Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../constants/GlobalStyles';

export default function CheckBoxGroup({
  title, screenMode, toggleFunc, switchValue, testID,
}:{title:string, screenMode:string, toggleFunc: ()=> void, switchValue:boolean, testID: string}) {
  return (
    <View style={settingsScreen(screenMode).componentWrapper}>
      <Pressable
        onPress={toggleFunc}
        testID={testID}
      >
        <View style={settingsScreen(screenMode).switchWrapper}>
          {switchValue
            ? <AntDesign name="checkcircle" size={20} color={colors.topBar[screenMode] } />
            : <AntDesign name="checkcircleo" size={20} color="#B6B6B6" />}
          {/* <Switch
          value={switchValue}
          onValueChange={toggleFunc}
          trackColor={{ true: colors.topBar[screenMode] }}
          testID={testID}
        /> */}
          <Text style={settingsScreen(screenMode).settingTitle}>{title}</Text>

        </View>
      </Pressable>
    </View>
  );
}

const settingsScreen = (mode:string) => StyleSheet.create({
  componentWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    opacity: 0.95,
  },
  settingTitle: {
    fontFamily: 'Roboto_400Regular',
    color: colors.textOne[mode],
    fontSize: 15,
    marginLeft: 5,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
});
