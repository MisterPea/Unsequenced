import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, font } from '../constants/GlobalStyles';

interface Settings {
  mode: 'light' | 'dark';
  toggle: () => void;
  allowSounds?: boolean;
}

export function DarkMode({ mode, toggle }: Settings) {
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

export function SoundSettings({ mode, toggle, allowSounds }: Settings) {
  return (
    <View style={[styles(mode).section, { marginTop: 5 }]}>
      <View style={styles(mode).textWrap}>
        <Text style={styles(mode).title}>Allow Sounds</Text>
      </View>
      {/* Allow Sounds On */}
      <Pressable
        onPress={toggle}
        testID="toggleSoundsBtn"
      >
        <View style={styles(mode).textWrap}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, allowSounds && styles(mode).select]}>Yes</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {allowSounds && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
        {/* Allow Sounds Off */}
        <View style={[styles(mode).textWrap, { borderBottomWidth: 0 }]}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, !allowSounds && styles(mode).select]}>No</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {!allowSounds && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

interface BannerSettings {
  mode: 'light' | 'dark';
  allowBanners: boolean | string;
  setAllowBanners: (value: boolean | string) => void;
}
export function Banners({ mode, allowBanners, setAllowBanners }: BannerSettings) {
  return (
    <View style={[styles(mode).section, { marginTop: 5 }]}>
      <View style={styles(mode).textWrap}>
        <Text style={styles(mode).title}>Allow Banners</Text>
      </View>

      <Pressable
        onPress={setAllowBanners.bind(this, true)}
      >
        <View style={styles(mode).textWrap}>
          <View style={styles(mode).textSide}>
            <Text
              style={[styles(mode).option, allowBanners === true && styles(mode).select]}
            >
              Yes

            </Text>
          </View>
          <View style={styles(mode).checkSide}>
            {allowBanners === true && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={setAllowBanners.bind(this, false)}
      >
        <View style={styles(mode).textWrap}>
          <View style={styles(mode).textSide}>
            <Text style={[styles(mode).option, allowBanners === false && styles(mode).select]}>No</Text>
          </View>
          <View style={styles(mode).checkSide}>
            {allowBanners === false && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={setAllowBanners.bind(this, 'background_only')}
      >
        <View style={[styles(mode).textWrap, { borderBottomWidth: 0 }]}>
          <View style={styles(mode).textSide}>
            <Text
              style={[styles(mode).option, allowBanners === 'background_only' && styles(mode).select]}
            >
              Only when app is in background
            </Text>
          </View>
          <View style={styles(mode).checkSide}>
            {allowBanners === 'background_only' && <MaterialIcons name="done" size={25} color={colors.settingsCheck[mode]} />}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = (mode: string) => StyleSheet.create({
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
