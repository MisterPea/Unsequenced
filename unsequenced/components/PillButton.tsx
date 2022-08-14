/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PillBtnFilledProps, PillBtnColors } from '../constants/types';
import { font } from '../constants/GlobalStyles';

export default function PillButton({ label, size, colors, shadow = false, action, disabled }: PillBtnFilledProps) {
  const sizes = { sm: { h: 40, w: 138 }, md: { h: 40, w: 140 }, lg: { h: 50, w: 260 } };

  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => pressed && { opacity: 0.9 }}
      testID="pillButtonFilledId"
      disabled={disabled}
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
    fontSize: dimensions.w === 260 ? font.largeButton.fontSize : font.cancelConfirm.fontSize,
    fontFamily: font.largeButton.fontFamily,
  },
  shadow: {
    shadowOpacity: 0.2,
    shadowColor: '#000000',
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },
});
