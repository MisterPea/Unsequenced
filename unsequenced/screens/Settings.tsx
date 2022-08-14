/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { colors, font } from '../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleScreenMode } from '../redux/screenMode';
import { toggleQuietMode } from '../redux/quietMode';
import { SettingsNavProps } from '../constants/types';
import { DarkMode, QuietMode } from '../components/SettingsGroups';
import haptic from '../components/helpers/haptic';

export default function Settings({ navigation, route }:{navigation:SettingsNavProps}) {
  const { screenMode, quietMode } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { isQuiet } = quietMode;
  const dispatch = useAppDispatch();

  function handleScreenModeToggle() {
    haptic.select();
    dispatch(toggleScreenMode());
  }

  function handleQuietModeToggle() {
    haptic.select();
    dispatch(toggleQuietMode());
  }

  function handleBackButtonPress() {
    haptic.select();
    navigation.goBack();
  }

  return (
    <View style={styles(mode).container}>
      <View style={styles(mode).headerView}>
        <Pressable
          onPress={handleBackButtonPress}
        >
          <EvilIcons
            style={{ marginLeft: -7 }}
            name="arrow-left"
            size={font.backButton.fontSize}
            color={colors.settingsGear[mode]}
          />
        </Pressable>
        <Text style={styles(mode).headerText}>SETTINGS</Text>

      </View>
      <DarkMode mode={mode} toggle={handleScreenModeToggle} />
      <QuietMode mode={mode} toggle={handleQuietModeToggle} isQuiet={isQuiet} />
    </View>
  );
}

const styles = (mode:string) => StyleSheet.create({
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
    paddingTop: 25,
  },
  headerView: {
    marginTop: 35,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  headerText: {
    marginTop: 10,
    fontSize: font.header.fontSize,
    fontFamily: font.header.fontFamily,
    color: colors.title[mode],
    marginLeft: 25,
  },

});
