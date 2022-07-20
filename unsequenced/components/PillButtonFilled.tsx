/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PillBtnFilledProps, PillBtnColors } from '../constants/types';

export default function PillButtonFilled({ label, size, colors, shadow = false, action }: PillBtnFilledProps) {
  const sizes = { sm: { h: 58, w: 275 }, md: { h: 52, w: 210 }, lg: { h: 58, w: 275 } };

  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => pressed && { opacity: 0.9 }}
      testID="pillButtonFilledId"
    >
      <View
        style={
          [buttonStyle(colors, sizes[size]).container,
            shadow && buttonStyle(colors, sizes[size]).shadow]
          }
      >
        <Text style={buttonStyle(colors, sizes[size]).text}>{label}</Text>
      </View>
    </Pressable>
  );
}

const buttonStyle = (colors: PillBtnColors, dimensions: {h:number, w:number}) => StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: dimensions.w,
    height: dimensions.h,
    backgroundColor: colors.background,
    borderRadius: dimensions.h,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Roboto_400Regular',
  },
  shadow: {
    shadowOpacity: 0.2,
    shadowColor: '#000000',
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
});
