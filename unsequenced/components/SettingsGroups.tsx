import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, font } from '../constants/GlobalStyles';

interface Settings {
  mode: string;
  toggle: () => void;
  isQuiet?: boolean;
}

export function DarkMode({ mode, toggle }:Settings) {
  return (
    <View style={styles(mode).section}>
      <View style={styles(mode).textWrap}>
        <Text style={styles(mode).title}>Dark Mode</Text>
      </View>
      {/* Light Mode */}
      <Pressable
        onPress={toggle}
        testID="lightDarkModeBtn"
      >
        <View style={styles(mode).textWrap}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, mode === 'light' && styles(mode).select]}>Light Mode</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {mode === 'light' && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
        {/* Dark Mode */}
        <View style={[styles(mode).textWrap, { borderBottomWidth: 0 }]}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, mode === 'dark' && styles(mode).select]}>Dark Mode</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {mode === 'dark' && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export function QuietMode({ mode, toggle, isQuiet }:Settings) {
  return (
    <View style={[styles(mode).section, { marginTop: 25 }]}>
      <View style={styles(mode).textWrap}>
        <Text style={styles(mode).title}>Quiet Mode</Text>
      </View>
      {/* Quiet Mode Off */}
      <Pressable
        onPress={toggle}
        testID="quietModeBtn"
      >
        <View style={styles(mode).textWrap}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, !isQuiet && styles(mode).select]}>Off</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {!isQuiet && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
        {/* Quiet Mode On */}
        <View style={[styles(mode).textWrap, { borderBottomWidth: 0 }]}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, isQuiet && styles(mode).select]}>On</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {isQuiet && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = (mode:string) => StyleSheet.create({
  section: {
    backgroundColor: colors.settingsBoxes[mode],
    paddingHorizontal: 23,
    // paddingVertical: 15,
  },
  textWrap: {
    borderBottomColor: colors.settingsLine[mode],
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSide: {
    flex: 3,
  },
  checkSide: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    color: colors.settingsTitle[mode],
    fontSize: font.settingsTitle.fontSize,
    fontFamily: font.settingsTitle.fontFamily,
    marginLeft: 25,
    paddingVertical: 10,
  },
  option: {
    color: colors.settingsTextMain[mode],
    fontFamily: font.settingsTextOne.fontFamily,
    fontSize: font.settingsTextOne.fontSize,
    paddingVertical: 10,
  },
  select: {
    fontFamily: font.settingsTextTwo.fontFamily,
  },
  subOption: {
    color: colors.settingsTextNote[mode],
    fontFamily: font.settingsTextTwo.fontFamily,
    fontSize: font.settingsTextTwo.fontSize,
    paddingBottom: 10,
  },
});
