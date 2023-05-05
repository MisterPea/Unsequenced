/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Easing, LayoutAnimation, SafeAreaView } from 'react-native';
import { EvilIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { colors, font } from '../constants/GlobalStyles';
import { MainTaskBlocksNavProps, TaskBlockRouteProps, UseSelectorProps, ScreenProp, Task, RenderItemProps, EditingTask } from '../constants/types';
import haptic from '../components/helpers/haptic';
import { reorderTasks, addTask, init, resetAllTasks, resetTaskTime } from '../redux/taskBlocks';
import NowPlayingItem from '../components/NowPlaying/NowPlayingItem';
import ProgressBar from '../components/NowPlaying/ProgressBar';
import { playTasks, appState } from '../components/NowPlaying/playTasks';
import NowPlayingItemBreak from '../components/NowPlaying/NowPlayingItemBreak';
import { setOnboarding } from '../redux/firstRun';
import PlayingArrow from '../components/NowPlaying/PlayingArrow';

type Route = TaskBlockRouteProps;
type MainNav = MainTaskBlocksNavProps;

interface AddTaskProps {
  navigation: MainNav;
  route: Route;
}

interface RouteParamsProps {
  id: string;
  mode?: string;
  title: string;
}

interface SlideObj {
  close: () => void;
  id: string;
}

export default function NowPlaying({ route, navigation }: AddTaskProps) {
  const { id, title }: RouteParamsProps = route.params!;
  const { screenMode, taskBlocks, keyboardOffset, firstRun }: UseSelectorProps = useAppSelector((state) => state!);
  const { mode }: ScreenProp = screenMode!;
  const { isFirstRun } = firstRun;
  const { offset } = keyboardOffset!;
  const [tasksLocal, setTasksLocal] = useState<Task[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0, percent: 0 });
  const [enableScroll, setEnableScroll] = useState(true);
  const [editTask, setEditTask] = useState<EditingTask | undefined>(undefined);
  const swipeRef = useRef<SlideObj | undefined>();
  const keyboardOffsetAnimation = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [restrictPlay, setRestrictPlay] = useState<boolean>(true);
  const [tasksComplete, setTasksComplete] = useState<boolean>(false);
  const [currentNowPlayingStep, setCurrentNowPlayingStep] = useState<number>(0);
  const [showPartingMsg, setShowPartingMsg] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Pick appropriate Tasks via id.
    const index: number = taskBlocks!.blocks.findIndex((elem) => elem.id === id);

    if (index > -1) {
      // afik having the layout animation here allows it to work on all elements
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasksLocal(taskBlocks!.blocks[index].tasks);
    }
    // We're checking for a populated, useable task list in order to enable the play button
    if (taskBlocks?.blocks[index]?.tasks?.some(({ completed, amount }) => completed < amount)) {
      restrictPlay === true && setRestrictPlay(false);
    } else {
      restrictPlay === false && setRestrictPlay(true);
    }
  }, [taskBlocks]);

  useEffect(() => {
    // We calculate progress bar status here. It's possible to combine this and the previous
    // useEffect, but this is a little easier to read and keep our concerns separate.
    const index: number = taskBlocks!.blocks.findIndex((elem) => elem.id === id);
    if (index > -1) {
      calculateProgress(taskBlocks!.blocks[index].tasks);
    }
    if (isPlaying) {
      playTasks.update(tasksLocal);
    }
  }, [tasksLocal, taskBlocks]);

  useEffect(() => {
    // We need to watch the tasksLocal for all tasks being complete.
    // If/when they are all complete, we can deploy the reset all button.
    // So, we're saying if amount === 0 (it's an added task) or completed < amount (we're unfinished)
    const isUnfinished = tasksLocal.some(({ amount, completed }) => (amount > 0 && completed < amount) || amount === 0);
    if (isUnfinished) {
      tasksComplete === true && setTasksComplete(false);
    } else if (tasksLocal.length > 0) {
      tasksComplete === false && setTasksComplete(true);
    } else {
      setTasksComplete(false);
    }
  }, [tasksLocal]);

  useEffect(() => {
    dispatch(init({ id }));
    appState.init();
    return () => {
      appState.removeListener();
    };
  }, []);
  // useEffect(() => {
  //   console.log('<<BASE useEffect in NowPlaying>>')
  //   setIsPlaying(false);
  //   return () => {
  //     if (isPlaying) {
  //       console.log("BASE useEFFECT CALLED");
  //       playTasks.end();
  //       setIsPlaying(false);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    animateKeyboardOffset(offset);
  }, [offset]);

  // This bit is setting the number of arrows next to NOW PLAYING
  // We have an arrow component that performs the animation, and
  // this side effect handles the timing.
  const arrowArray = useRef<string[]>([]);
  const arrowCount = useRef<number>(0);
  const intervalRef = useRef<any | null>(null);
  // const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (arrowCount.current < 5) {
          arrowArray.current.push(' >');
          arrowCount.current += 1;
        } else if (arrowCount.current < 8) {
          arrowCount.current += 1;
        } else {
          arrowArray.current = [];
          arrowCount.current = 0;
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      arrowArray.current = [];
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Method to animate keyboard offset
  function animateKeyboardOffset(offsetValue: number) {
    Animated.timing(keyboardOffsetAnimation, {
      toValue: offsetValue,
      duration: 300,
      easing: Easing.bezier(0.63, 0.04, 0.35, 0.99),
      useNativeDriver: true,
    }).start();
  }

  // Method to calculate progress bar completion.
  function calculateProgress(tasks: Task[]) {
    const totalTime = tasks.reduce((prev: number, curr: Task) => curr.amount + prev, 0);
    const completedTime = tasks.reduce((prev: number, curr: Task) => curr.completed + prev, 0);
    const barPercentage = (((completedTime / totalTime) - 1) * 100) + 100;
    setProgress({ total: totalTime, completed: completedTime, percent: barPercentage });
  }

  // We stop playing when we go back to main screen.
  function handleBackButtonPress() {
    haptic.select();
    if (isPlaying) {
      playTasks.pause();
    }
    navigation.navigate('TaskBlocksNavigator', { screen: 'Task Blocks' });
  }

  function handleSettingsPress() {
    haptic.select();
    navigation.navigate('Settings');
  }

  function extractKey(item: Task) {
    return item.id;
  }

  function handlePlay() {
    haptic.select();
    if (!isPlaying && !editTask) {
      playTasks.play(id, tasksLocal, setIsPlaying);
      setIsPlaying(true);
    }
  }

  // function handleToggleReset(tasksAreDone: boolean) {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setTasksComplete(tasksAreDone);
  // }

  /**
   * Method to create a new task. Called from the 'plus' button
   */
  function handleAddTask() {
    haptic.select();
    if (isPlaying) {
      playTasks.pause();
      setIsPlaying(false);
    }

    const taskId = `${title}${Math.random().toString(36).replace(/[^\w\s']|_/g, '')}`;
    const task: Task = { id: taskId, title: '', amount: 0, completed: 0, break: false };
    dispatch(addTask({ id, task }));
    setEditTask({ isEdit: false, itemId: taskId });
  }

  function handleStop() {
    haptic.warning();
    if (isPlaying) {
      playTasks.pause();
      setIsPlaying(false);
    }
  }

  function handleResetAllTasks() {
    haptic.warning();
    let i = 0;
    let timeOutRef: NodeJS.Timeout;
    const resetStagger = () => {
      const taskId = tasksLocal[i].id;
      dispatch(resetTaskTime({ id, taskId }));
      timeOutRef = setTimeout(() => {
        i += 1;
        if (i < tasksLocal.length) {
          resetStagger();
        } else {
          clearTimeout(timeOutRef);
        }
      }, 400);
    };
    resetStagger();
  }

  function onDragEnd({ data }: { data: Task[]; }) {
    haptic.light();
    setTasksLocal(data);
    dispatch(reorderTasks({ id, updatedOrder: data }));
  }

  function onDragStart() {
    haptic.medium();
    if (swipeRef.current !== undefined) {
      swipeRef.current.close();
    }
  }

  // We're wrapping out AnimateArrow in useCallback to insulate it from rerenders
  // within this component; allowing it to keep track of it's own state.
  const AnimateArrow = useCallback(() => <PlayingArrow />, [isPlaying]);

  /**
  * Component rendered by the DraggableFlatlist component
  * This is an intermediary component to allow the passing of other props
  * to the NowPlayingItem, which is a list item component.
  */
  function RenderItem({ drag, item, isActive }: RenderItemProps) {
    if (item.break === true) {
      return (
        <NowPlayingItemBreak
          item={item}
          drag={drag}
          swipeRef={swipeRef}
          setEnableScroll={setEnableScroll}
          isActive={isActive}
          mode={mode}
          id={id}
          closeSwipeBar={onDragStart}
          setEditTask={setEditTask}
          editTask={editTask}
        />
      );
    }
    return (
      <NowPlayingItem
        item={item}
        drag={drag}
        swipeRef={swipeRef}
        setEnableScroll={setEnableScroll}
        isActive={isActive}
        mode={mode}
        id={id}
        closeSwipeBar={onDragStart}
        setEditTask={setEditTask}
        editTask={editTask}
        isFirstRun={isFirstRun}
        firstRunCallback={setCurrentNowPlayingStep} // state update for duplicate press
      />
    );
  }

  return (
    <Animated.View style={[styles(mode).container, {
      transform: [{
        translateY: keyboardOffsetAnimation,
      }],
    }]}
    >
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
        <Pressable
          onPress={handleSettingsPress}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.settingsGear[mode]}
          />
        </Pressable>
      </View>
      <Text style={styles(mode).headerTitle}>
        NOW PLAYING
        {isPlaying && <AnimateArrow />}
      </Text>
      <Text testID="taskBlockTitle" style={styles(mode).headerText} numberOfLines={1}>
        {title && title.toUpperCase()}
      </Text>
      <ProgressBar mode={mode} progress={progress} />
      {/* Three Navigation Buttons */}
      <View style={styles(mode).navWrapper}>
        <Tooltip
          isVisible={isFirstRun && currentNowPlayingStep === 5 && tasksLocal[0].amount !== 0}
          backgroundColor="#00000000"
          content={<Text style={styles(mode).tooltip}>Now, we can tap this button to play/start our timer.</Text>}
          contentStyle={{ backgroundColor: '#303030', marginTop: 10, width: '100%' }}
          disableShadow
          childrenWrapperStyle={{ opacity: 0 }}
          onClose={() => {
            dispatch(setOnboarding({ isFirstRun: false }));
            setShowPartingMsg(true);
          }}
          useInteractionManager
        >
          <Pressable
            onPress={isPlaying ? handleStop : handlePlay}
            disabled={restrictPlay}
          >
            <View style={[styles(mode).navButton, mode === 'light' && shadow.on, { paddingLeft: 5 }]}>
              {isPlaying ? (
                <Ionicons
                  name="stop"
                  size={24}
                  color={colors.roundButtonIcon[mode]}
                  style={{ paddingRight: 2 }}
                />
              ) : (
                <Ionicons
                  name="play-outline"
                  size={24}
                  color={colors.roundButtonIcon[mode]}
                />
              )}
            </View>
          </Pressable>
        </Tooltip>
        <Tooltip
          isVisible={isFirstRun && currentNowPlayingStep === 0}
          backgroundColor="#00000000"
          content={<Text style={styles(mode).tooltip}>Click this one to create a new Task</Text>}
          contentStyle={{ backgroundColor: '#303030', marginTop: 10, width: '100%' }}
          disableShadow
          childrenWrapperStyle={{ opacity: 0 }}
          onClose={() => setCurrentNowPlayingStep(2)}
          useInteractionManager
        >
          <Pressable
            onPress={handleAddTask}
            disabled={!!editTask}
          >
            <View style={[styles(mode).navButton, mode === 'light' && shadow.on]}>
              <AntDesign
                name="plus"
                size={24}
                color={colors.roundButtonIcon[mode]}
              />
            </View>
          </Pressable>
        </Tooltip>
        {/* We only deploy this on complete */}
        {tasksComplete && (
          <Pressable
            onPress={handleResetAllTasks}
          >
            <View style={[styles(mode).navButton, mode === 'light' && shadow.on]}>
              <AntDesign
                name="reload1"
                size={24}
                color={colors.roundButtonIcon[mode]}
              />
            </View>
          </Pressable>
        )}

      </View>

      {/* This is our component to render the draggable list
          The addition of GestureHandlerRootView is to fix the inability
          to drag on Android */}

      <GestureHandlerRootView style={{ flex: 1, height: '100%', width: '100%' }}>
        {tasksLocal.length === 0
          ? <Text style={styles(mode).addTasksText}>Add some tasks</Text>
          : (
            <SafeAreaView>
              <Tooltip
                isVisible={
                  (isFirstRun && currentNowPlayingStep === 2)
                  || (isFirstRun && currentNowPlayingStep === 3 && tasksLocal[0].amount > 0)
                }
                backgroundColor="#00000000"
                content={
                  (currentNowPlayingStep === 2
                    ? <View style={{ alignSelf: 'center' }}><Text style={styles(mode).tooltip}>Enter a Task name, and duration.</Text></View>
                    : (
                      <>
                        <Text style={styles(mode).tooltip}>
                          Now let&apos;s swipe to the left and tap the
                          <Text style={styles(mode).tooltipBold}> Duplicate Task (+) </Text>
                          button.
                        </Text>
                        <Text>{' '}</Text>
                        <Text style={styles(mode).tooltip}>
                          There&apos;s also:
                        </Text>
                        <Text style={styles(mode).tooltip}>
                          • A
                          <Text style={styles(mode).tooltipBold}> Mark Task Complete </Text>
                          button.
                        </Text>
                        <Text style={styles(mode).tooltip}>
                          • An
                          <Text style={styles(mode).tooltipBold}> Edit Task </Text>
                          button.
                        </Text>
                        <Text style={styles(mode).tooltip}>
                          • A
                          <Text style={styles(mode).tooltipBold}> Reset Time </Text>
                          button (once time has elapsed).
                        </Text>
                        <Text style={styles(mode).tooltip}>
                          • A
                          <Text style={styles(mode).tooltipBold}> Delete Task </Text>
                          button (when you swipe right).
                        </Text>
                      </>
                    )
                  )
                }
                contentStyle={{ marginLeft: -5, backgroundColor: '#303030', width: '100%' }}
                disableShadow
                placement="bottom"
                childrenWrapperStyle={{ opacity: 0 }}
                onClose={() => {
                  currentNowPlayingStep === 2 ? setCurrentNowPlayingStep(3) : setCurrentNowPlayingStep(4);
                }}
                useInteractionManager
                showChildInTooltip={false}
              >
                <DraggableFlatList
                  data={tasksLocal}
                  extraData={taskBlocks}
                  renderItem={RenderItem}
                  keyExtractor={extractKey}
                  onDragEnd={onDragEnd}
                  onDragBegin={onDragStart}
                  activationDistance={20}
                  scrollEnabled={enableScroll}
                />
              </Tooltip>
              <Tooltip
                isVisible={showPartingMsg}
                contentStyle={{ marginLeft: -10, backgroundColor: '#303030', width: '100%' }}
                disableShadow
                placement="bottom"
                backgroundColor="#00000000"
                childrenWrapperStyle={{ opacity: 0 }}
                onClose={() => {
                  setShowPartingMsg(false);
                  setCurrentNowPlayingStep(0); // resetting other tooltip states
                }}
                content={(
                  <View style={{ alignSelf: 'center' }}>
                    <Text style={styles(mode).tooltip}>
                      ...and that&apos;s the how you create a Task Block, and add, duplicate and play a Task.
                      If you need to review, you can re-watch from the Settings screen.
                    </Text>
                    <Text>{' '}</Text>
                    <Text style={styles(mode).tooltip}>Tap anywhere to close this dialogue.</Text>
                  </View>
                )}
              />
            </SafeAreaView>
          )}
      </GestureHandlerRootView>
    </Animated.View>
  );
}

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  tooltip: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.85,
    color: '#e9e9e9',
    padding: 5,
  },
  tooltipBold: {
    fontFamily: 'Rubik_500Medium',
    color: '#ffffff',
  },
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
    paddingTop: 25,
    width: '100%',
    height: '100%',
  },
  addTasksText: {
    textAlign: 'center',
    color: colors.subTitle[mode],
    fontFamily: font.liTitle.fontFamily,
    fontSize: font.liTitle.fontSize,
    marginTop: 10,
  },
  headerView: {
    marginTop: 35,
    marginHorizontal: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    marginHorizontal: 40,
    fontSize: font.inputTitle.fontSize,
    fontFamily: font.inputTitle.fontFamily,
    color: colors.taskListItemText[mode],
  },
  headerText: {
    fontSize: font.header.fontSize,
    fontFamily: font.header.fontFamily,
    color: colors.title[mode],
    marginTop: -5,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  title: {
    marginVertical: 12,
    backgroundColor: colors.blockName[mode],
    marginHorizontal: 40,
    padding: 5,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: font.input.fontFamily,
    fontSize: font.input.fontSize,
    color: colors.disabled[mode],
    alignSelf: 'center',
    paddingLeft: 10,

  },
  progressWrapper: {
    marginHorizontal: 40,
  },
  completeAmt: {
    height: 4,
    backgroundColor: colors.barCompleteAmt[mode],
    // position: 'absolute',
    top: -4,
  },
  progressBar: {
    height: 4,
    width: '100%',
    backgroundColor: colors.barBackground[mode],
  },
  completeText: {
    color: colors.settingsTextNote[mode],
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  inputGroup: {
    borderTopColor: colors.settingsTextNote[mode],
    borderTopWidth: 1,
    marginTop: 15,
    marginHorizontal: 50,
  },
  inputWrapper: {
    flexDirection: 'row',
    marginTop: 25,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderBottomColor: colors.settingsTextNote[mode],
    borderBottomWidth: 1,
    paddingBottom: 30,
    marginBottom: 30,
  },
  navWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    // width: '30%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    height: 44,
    width: 44,
    borderRadius: 25,
    backgroundColor: colors.roundButtonBG[mode],
    borderColor: colors.roundButtonBorder[mode],
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  navClose: {
    backgroundColor: colors.roundCloseBtnBG[mode],
  },
});

const shadow = StyleSheet.create({
  on: {
    shadowColor: colors.shadowColor.light,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 4, width: 0 },
  },
});
