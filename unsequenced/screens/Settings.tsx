/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderIcon from '../components/HeaderIcon';
import SettingsIcon from '../components/icons/SettingsIcon';
import SettingsToggleGroup from '../components/SettingsToggleGroup';
import colors from '../constants/GlobalStyles';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleScreenMode } from '../redux/screenMode';
import { toggleQuietMode } from '../redux/quietMode';

export default function Settings() {
  const { screenMode, quietMode } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { isQuiet } = quietMode;
  const dispatch = useAppDispatch();

  function handleScreenModeToggle() {
    dispatch(toggleScreenMode());
  }

  function handleQuietModeToggle() {
    dispatch(toggleQuietMode());
  }

  return (
    <View style={settingsScreen(mode).container}>
      <HeaderIcon color={colors.iconMainBG[mode]}>
        <SettingsIcon size={70} color={colors.iconMainFG[mode]} />
      </HeaderIcon>
      <View style={settingsScreen(mode).optionsWrapper}>
        <SettingsToggleGroup
          title="LIGHT/DARK MODE"
          screenMode={mode}
          toggleFunc={handleScreenModeToggle}
          switchValue={mode === 'dark'}
          testID="lightDarkModeBtn"
        />
        <SettingsToggleGroup
          title="QUIET MODE"
          screenMode={mode}
          toggleFunc={handleQuietModeToggle}
          switchValue={isQuiet}
          testID="quietModeBtn"
        />
      </View>
    </View>
  );
}

const settingsScreen = (mode:string) => StyleSheet.create({
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
  },
  optionsWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    borderTopColor: colors.backArrow[mode],
    borderTopWidth: 0.5,
    borderBottomColor: colors.backArrow[mode],
    borderBottomWidth: 0.5,
    paddingVertical: 15,
  },
});
