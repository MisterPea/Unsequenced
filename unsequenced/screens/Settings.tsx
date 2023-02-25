/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { colors, font } from '../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { toggleScreenMode } from '../redux/screenMode';
import { SettingsNavProps } from '../constants/types';
import { DarkMode, SoundSettings, Banners, HowTo } from '../components/SettingsGroups';
import haptic from '../components/helpers/haptic';
import { selectAllowBanners, toggleAllowSounds } from '../redux/notificationPrefs';
import { setOnboarding } from '../redux/firstRun';

export default function Settings({ navigation }: { navigation: SettingsNavProps; }) {
  const { screenMode, notificationPrefs } = useAppSelector((state) => state);
  const { mode } = screenMode;

  const { allowBanners, allowSounds } = notificationPrefs;
  const dispatch = useAppDispatch();

  // function handleScreenModeToggle() {
  //   haptic.select();
  //   dispatch(toggleScreenMode());
  // }

  function handleAllowSoundsToggle() {
    haptic.select();
    dispatch(toggleAllowSounds());
  }

  function handleSetAllowBanners(button: string | boolean) {
    haptic.select();
    dispatch(selectAllowBanners({ preference: button }));
  }

  function handleBackButtonPress() {
    haptic.select();
    navigation.goBack();
  }

  function handleLaunchHowTo() {
    haptic.success();
    dispatch(setOnboarding({ isFirstRun: true }));
    navigation.replace('TaskBlocksNavigator', { screen: 'Task Blocks' });
  }

  return (
    <View style={styles(mode).container}>
      <View style={styles(mode).headerView}>
        <Pressable
          onPress={handleBackButtonPress}
          style={{ padding: 10, width: 50 }}
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
      {/* We're removing this for now until a better dark mode scheme can be figured out. */}
      {/* <DarkMode mode={mode} toggle={handleScreenModeToggle} /> */}
      <Text style={styles(mode).sectionHeader}>NOTIFICATIONS</Text>
      <SoundSettings mode={mode} toggle={handleAllowSoundsToggle} allowSounds={allowSounds} />
      <Banners mode={mode} allowBanners={allowBanners} setAllowBanners={handleSetAllowBanners} />
      <Text style={styles(mode).sectionHeader}>HOW-TO</Text>
      <HowTo mode={mode} launchHowTo={handleLaunchHowTo} />
      <SafeAreaView style={styles(mode).bottomContainer}>
        <Text style={styles(mode).bottomText}>Version: 1.1.1</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomText: {
    alignSelf: 'flex-end',
    color: colors.settingsTextMain[mode],
    fontFamily: font.settingsTextOne.fontFamily,
    fontSize: font.settingsTextOne.fontSize,
  },
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
    paddingTop: 25,
  },
  headerView: {
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  sectionHeader: {
    marginLeft: 25,
    marginBottom: 0,
    marginTop: 20,
    fontSize: font.settingsTitle.fontSize,
    fontFamily: font.header.fontFamily,
    color: colors.title[mode],
  },
  headerText: {
    marginTop: 10,
    fontSize: font.header.fontSize,
    fontFamily: font.header.fontFamily,
    color: colors.title[mode],
    marginLeft: 25,
  },

});
