/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { TaskBlockNavProps } from '../constants/types';
import { colors, font } from '../constants/GlobalStyles';
import SwipeList from '../components/swipeable/SwipeList';
import haptic from '../components/helpers/haptic';
import { addTaskBlock, updateTaskBlock } from '../redux/taskBlocks';
import IntroMain from '../components/IntroMain';
import IntroTwo from '../components/IntroTwo';

export default function TaskBlocks({ route, navigation }: { navigation: TaskBlockNavProps; }) {
  const dispatch = useAppDispatch();
  const { screenMode, taskBlocks, firstRun } = useAppSelector((state) => state);
  const { isFirstRun } = firstRun;
  const { mode } = screenMode;
  const { blocks } = taskBlocks;
  const [validWidth, setValidWidth] = useState<number | undefined>(undefined);
  const addBlockBtn = useRef<View>(null);

  // We look to see if we're in the first-run walkthrough
  // and if we're coming from CreateNewTaskBlock...if so we set our step to 3
  const initialIntroState = (route.params?.inIntro && isFirstRun === true) ? 3 : 0;

  const [currentIntroStep, setCurrentIntroStep] = useState<number | null>(initialIntroState);
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
    <>
      {(isFirstRun === true && currentIntroStep === 0) && <IntroMain introControl={setCurrentIntroStep} />}
      {(isFirstRun === true && currentIntroStep === 1) && <IntroTwo introControl={setCurrentIntroStep} />}
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
            <>
              <Tooltip
                isVisible={currentIntroStep === 3}
                onClose={() => setCurrentIntroStep(null)}
                contentStyle={{ marginTop: 10, backgroundColor: '#303030', marginHorizontal: '-3%' }}
                backgroundColor="#00000000"
                disableShadow
                allowChildInteraction
                closeOnChildInteraction
                content={(
                  <Text style={[styles(mode).tooltip]}>
                    Great! Now we can click on our freshly created Task Block and add some Tasks.
                  </Text>
                )}
              >
                <View />
              </Tooltip>
              <SwipeList
                data={blocks}
                mode={mode}
              />
            </>
          )}
        {/* Wait till we have a width before rendering - without this, the button animates to it's position */}
        {validWidth && (
          <SafeAreaView>
            {/* Create New Task Block '+' button */}
            <Tooltip
              isVisible={isFirstRun && currentIntroStep === 2}
              content={
                <Text style={styles(mode).tooltip}>First, we create a new Task Block.</Text>
              }
              placement="top"
              onClose={() => setCurrentIntroStep(10)}
              useInteractionManager
              allowChildInteraction
              closeOnChildInteraction
              closeOnContentInteraction={false}
              contentStyle={{ backgroundColor: '#303030' }}
              backgroundColor="#00000000"
              disableShadow
            >
              <Pressable
                onPress={handleCreateTaskBlockPress}
                style={styles(mode).safePressable}
              >
                <View
                  style={styles(mode).safePressableView}
                  ref={addBlockBtn}
                />
                <Ionicons name="ios-add-circle-sharp" size={68} color={colors.createNewTaskBtn[mode]} />
              </Pressable>
            </Tooltip>
          </SafeAreaView>
        )}
      </View>
    </>
  );
}

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  tooltip: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 17,
    color: '#ffffff',
    lineHeight: 26,
    width: '100%',
  },
  container: {
    position: 'relative',
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
    // bottom: 70,
    // position: 'absolute',
    zIndex: 10,
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
