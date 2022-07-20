import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../constants/GlobalStyles';

interface InputProps {
  label:string;
  placeholder:string;
  value: string;
  callback:React.Dispatch<React.SetStateAction<string>>;
}

export default function InputField({ label, placeholder, value, callback }:InputProps) {
  return (
    <View style={styles().container}>
      <Text style={styles().ctaText}>{label}</Text>
      <TextInput
        style={styles().input}
        onChangeText={callback}
        placeholder={placeholder}
        value={value}
        autoCapitalize="words"
      />
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 6,
    marginBottom: 2,
  },
  input: {
    fontSize: 20,
    fontFamily: 'Roboto_400Regular',
    borderWidth: 0.5,
    borderColor: colors.textBoxBorder.light,
    padding: 10,

    width: 300,
    borderRadius: 5,
  },
});
