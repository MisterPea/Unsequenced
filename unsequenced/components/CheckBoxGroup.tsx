/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, font } from '../constants/GlobalStyles';

interface CheckBox {
  title: string;
  screenMode: string;
  toggleFunc: () => void;
  value: boolean;
  testID: string;
  extraStyle?: ViewStyle;
}

export default function CheckBoxGroup({ title, screenMode, toggleFunc, value, testID, extraStyle }: CheckBox) {
  let fill;
  let border;
  let text;

  if (value) {
    fill = colors.selectedOptionFill[screenMode];
    border = colors.selectedOptionBorder[screenMode];
    text = colors.selectedOptionText[screenMode];
  } else {
    fill = colors.unselectOptionFill[screenMode];
    border = colors.unselectOptionBorder[screenMode];
    text = colors.unselectOptionText[screenMode];
  }

  return (
    <View
      style={[
        settingsScreen.componentWrapper,
        {
          backgroundColor: fill,
          borderColor: border
        },
        extraStyle,
      ]}
    >
      <Pressable
        onPress={toggleFunc}
        testID={testID}
      >
        <View style={settingsScreen.switchWrapper}>
          {value
            ? <MaterialIcons name="check-circle-outline" size={24} color={text} />
            : <MaterialIcons name="radio-button-unchecked" size={24} color={text} />}
          <Text style={[settingsScreen.settingTitle, { color: text }]}>{title}</Text>

        </View>
      </Pressable>
    </View>
  );
}

const settingsScreen = StyleSheet.create({
  componentWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    width: '100%',
    borderRadius: 100,
  },
  settingTitle: {
    fontFamily: font.optionSelect.fontFamily,
    fontSize: font.optionSelect.fontSize,
    marginLeft: 5,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
});
