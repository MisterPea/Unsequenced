import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import colors from '../constants/GlobalStyles';

interface InputProps {
  screenMode: string;
  label:string;
  placeholder?:string;
  value: string;
  callback:React.Dispatch<React.SetStateAction<string>>;
  style?: ViewStyle
}

export default function InputField({ screenMode, label, placeholder, value, callback, style }:InputProps) {
  return (
    <View style={styles(screenMode).container}>
      <Text style={styles(screenMode).ctaText}>{label}</Text>
      <TextInput
        style={[styles(screenMode).input, style]}
        onChangeText={callback}
        placeholder={placeholder}
        value={value}
        autoCapitalize="words"
        placeholderTextColor={colors.placeholderText[screenMode]}
      />
    </View>
  );
}

const styles = (screenMode :string) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 6,
    marginBottom: 2,
    color: colors.textOne[screenMode],
  },
  input: {
    fontSize: 19,
    fontFamily: 'Roboto_400Regular',
    borderWidth: 0.5,
    borderColor: colors.textBoxBorder[screenMode],
    padding: 10,
    backgroundColor: colors.textBox[screenMode],
    maxWidth: 250,
    borderRadius: 8,
    color: colors.textOne[screenMode],
  },
});
