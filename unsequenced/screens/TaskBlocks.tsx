/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { TaskBlockNavProps } from '../constants/types';
import { colors, font } from '../constants/GlobalStyles';
import SwipeList from '../components/swipeable/SwipeList';
import haptic from '../components/helpers/haptic';
import { addTaskBlock, updateTaskBlock } from '../redux/taskBlocks';

export default function TaskBlocks({ route, navigation }: { navigation: TaskBlockNavProps; }) {
  const dispatch = useDispatch();
  const { screenMode, taskBlocks } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { blocks } = taskBlocks;
  const [validWidth, setValidWidth] = useState<number | undefined>(undefined);

  // This handles the adding and updating of Task Blocks and is only run on layout change: i.e. Task Block add or change
  // The reason behind this is that if we perform the update in the modal, the state
  // changes on this screen and causes a re-render. When we do the update after navigation
  // to this screen, we avoid that.
  useFocusEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (route.params?.addATaskBlock) {
      const { addATaskBlock } = route.params;
      dispatch(addTaskBlock(addATaskBlock));
      navigation.setParams({ addATaskBlock: undefined });
    } else if (route.params?.editTaskBlock) {
      const { editTaskBlock } = route.params;
      dispatch(updateTaskBlock({ id: editTaskBlock.id, update: editTaskBlock.update }));
      navigation.setParams({ editTaskBlock: undefined });
    }
  });

  function handleCreateTaskBlockPress() {
    haptic.medium();
    navigation.navigate('createNewTaskBlock');
  }

  function handleSettingsPress() {
    haptic.select();
    navigation.navigate('Settings');
  }

  // We wait until we have a layout so don't have movement when button enters DOM
  function handleButtonPlacement(e: any) {
    if (!validWidth) { setValidWidth(e.nativeEvent.layout.width); }
  }

  return (
    <View onLayout={handleButtonPlacement} style={[styles(mode).container]}>
      <View style={styles(mode).headerView}>
        <View>
          <Text style={styles(mode).header}>TASK BLOCKS</Text>
          <Text style={styles(mode).subHeader}>Choose a Task Block or Create a New One</Text>
        </View>
        {/* Wait till we have a width before rendering - without this, the button animates to it's position */}
        {validWidth && (
          <Pressable
            testID="settingsBtn"
            onPress={handleSettingsPress}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.settingsGear[mode]}
            />
          </Pressable>
        )}
      </View>
      {blocks.length === 0
        ? (
          <View style={styles(mode).ctaView}>
            <Text style={styles(mode).ctaText}>You should add a Task Block</Text>
          </View>
        )
        : (
          <SwipeList
            data={blocks}
            mode={mode}
          />
        )}
      {/* Wait till we have a width before rendering - without this, the button animates to it's position */}
      {validWidth && (
        <SafeAreaView>
          {/* Create New Task Block */}

          <Pressable
            onPress={handleCreateTaskBlockPress}
            style={styles(mode).safePressable}
          >
            <View style={styles(mode).safePressableView} />
            <Ionicons name="ios-add-circle-sharp" size={68} color={colors.createNewTaskBtn[mode]} />
          </Pressable>

        </SafeAreaView>
      )}
    </View>
  );
}

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
    paddingTop: 25,
    width: '100%',
  },
  headerView: {
    marginTop: 35,
    marginHorizontal: 20,
    marginBottom: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: font.header.fontSize,
    fontFamily: font.header.fontFamily,
    color: colors.title[mode],

  },
  subHeader: {
    fontSize: font.subHead.fontSize,
    fontFamily: font.subHead.fontFamily,
    color: colors.subTitle[mode],
  },
  safePressable: {
    alignSelf: 'center',
    bottom: 70,
    position: 'absolute',
  },
  ctaView: {
    flex: 1,
  },
  ctaText: {
    textAlign: 'center',
    color: colors.subTitle[mode],
    fontFamily: font.liTitle.fontFamily,
    fontSize: font.liTitle.fontSize,
    marginTop: 10,
  },
  safePressableView: {
    position: 'absolute',
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 50,
    marginTop: 15,
    backgroundColor: colors.confirmText[mode],
  },
});
