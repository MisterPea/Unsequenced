/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../redux/hooks';
import { TaskBlockNavProps } from '../constants/types';
import { colors, font } from '../constants/GlobalStyles';
import SwipeList from '../components/swipeable/SwipeList';
import haptic from '../components/helpers/haptic';
import { useDispatch } from 'react-redux';
import { addTaskBlock, updateTaskBlock } from '../redux/taskBlocks';
import { useFocusEffect } from '@react-navigation/native';

export default function TaskBlocks({ route, navigation }: { navigation: TaskBlockNavProps; }) {

  const dispatch = useDispatch();
  const { screenMode, taskBlocks } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { blocks } = taskBlocks;

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

  const onLeftActionStatusChange = () => {
    console.log('>>>>>>>>>fff>>');
  };

  function handleSettingsPress() {
    haptic.select();
    navigation.navigate('Settings');
  }

  return (
    <View style={[styles(mode).container]}>
      <View style={styles(mode).headerView}>
        <View>
          <Text style={styles(mode).header}>TASK BLOCKS</Text>
          <Text style={styles(mode).subHeader}>Choose a Task Block or Create a New One</Text>
        </View>
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
      </View>

      <SwipeList
        data={blocks}
        mode={mode}
        leftStatusChg={onLeftActionStatusChange}
      />

      <SafeAreaView>
        {/* Create New Task Block */}
        <Pressable
          onPress={handleCreateTaskBlockPress}
          style={styles(mode).safePressable}>
          <View style={styles(mode).safePressableView} />
          <Ionicons name="ios-add-circle-sharp" size={68} color={colors.createNewTaskBtn[mode]} />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = (mode: string) => StyleSheet.create({
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
    paddingTop: 25,
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
  safePressableView: {
    position: 'absolute',
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 50,
    marginTop: 15,
    backgroundColor: colors.confirmText[mode]
  }
});
