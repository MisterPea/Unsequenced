/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../redux/hooks';
import { TaskBlockNavProps } from '../constants/types';
import { colors, font } from '../constants/GlobalStyles';
import PillButton from '../components/PillButton';
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
      console.log('here!!!')
      const { addATaskBlock } = route.params;
      dispatch(addTaskBlock(addATaskBlock));
      navigation.setParams({ addATaskBlock: undefined });

    } else if (route.params?.editTaskBlock) {
      console.log('there')
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

      <SafeAreaView style={styles(mode).safeView}>
        <PillButton
          label="Create New Task Block"
          size="lg"
          shadow
          colors={{ text: colors.confirmText[mode], background: colors.createNewTaskBtn[mode], border: 'transparent' }}
          action={handleCreateTaskBlockPress}
        />
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
  safeView: {
    alignSelf: 'center',
    bottom: 70,
    position: 'absolute',
  },
});
