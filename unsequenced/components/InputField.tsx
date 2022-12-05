import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { colors, font } from '../constants/GlobalStyles';

interface InputStyle extends ViewStyle {
  color?: string;
}

interface InputProps {
  screenMode: 'light' | 'dark';
  label: string;
  placeholder?: string;
  value: undefined | string;
  callback: React.Dispatch<React.SetStateAction<string>>;
  inputStyle?: InputStyle;
  viewStyle?: ViewStyle;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  maxLength?: number;
}

export default function InputField({
  screenMode,
  label,
  placeholder,
  value,
  callback,
  inputStyle,
  viewStyle,
  keyboardType,
  maxLength,
}: InputProps) {
  return (
    <View style={[styles(screenMode).container, viewStyle]}>
      <Text style={styles(screenMode).ctaText}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        keyboardAppearance={screenMode}
        style={[styles(screenMode).input, inputStyle]}
        onChangeText={callback}
        placeholder={placeholder}
        value={value}
        autoCapitalize="sentences"
        placeholderTextColor={colors.placeholder[screenMode]}
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = (screenMode: string) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  ctaText: {
    fontSize: font.inputTitle.fontSize,
    fontFamily: font.inputTitle.fontFamily,
    marginLeft: 6,
    marginBottom: 2,
    color: colors.taskListItemText[screenMode],
  },
  input: {
    fontFamily: font.input.fontFamily,
    fontSize: font.input.fontSize,
    borderWidth: 0.5,
    // borderColor: colors.textBoxBorder[screenMode],
    padding: 7,
    // backgroundColor: colors.textBox[screenMode],
    // maxWidth: 250,
    borderRadius: 4,
    // color: colors.textOne[screenMode],
  },
});
