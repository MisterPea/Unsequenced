/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Easing, LayoutAnimation } from 'react-native';
import { EvilIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors, font } from '../constants/GlobalStyles';
import { MainTaskBlocksNavProps, TaskBlockRouteProps, UseSelectorProps, ScreenProp, Task, RenderItemProps, EditingTask } from '../constants/types';
import haptic from '../components/helpers/haptic';
import { reorderTasks, addTask } from '../redux/taskBlocks';
import NowPlayingItem from '../components/NowPlaying/NowPlayingItem';
import ProgressBar from '../components/NowPlaying/ProgressBar';
import { playTasks, appState } from '../components/NowPlaying/playTasks';

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
  const { screenMode, taskBlocks, keyboardOffset }: UseSelectorProps = useSelector((state) => state!);
  const { mode }: ScreenProp = screenMode!;
  const { offset } = keyboardOffset;
  const [tasksLocal, setTasksLocal] = useState<Task[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0, percent: 0 });
  const [enableScroll, setEnableScroll] = useState(true);
  const [editTask, setEditTask] = useState<EditingTask | undefined>(undefined);
  const swipeRef = useRef<SlideObj | undefined>();
  const keyboardOffsetAnimation = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const index: number = taskBlocks!.blocks.findIndex((elem) => elem.id === id);
    if (index > -1) {
      // afik having the layout animation here allows it to work on all elements
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasksLocal(taskBlocks!.blocks[index].tasks);
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

  // Method to animate keyboard offset
  function animateKeyboardOffset(offsetValue: number) {
    Animated.timing(keyboardOffsetAnimation, {
      toValue: offsetValue,
      duration: 300,
      easing: Easing.bezier(0.63, 0.04, 0.35, 0.99),
      useNativeDriver: false,
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
      console.log('END CALLED FROM BACK BUTTON');
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

  /**
   * Method to create a new task. Called from the 'plus' button
   */
  function handleAddTask() {
    haptic.select();
    if (isPlaying) {
      console.log('END CALLED FROM ADD TASK');
      playTasks.pause();
      setIsPlaying(false);
    }

    const taskId = `${title}${Math.random().toString(36).replace(/[^\w\s']|_/g, '')}`;
    const task = { id: taskId, title: '', amount: 0, completed: 0 };
    dispatch(addTask({ id, task }));
    setEditTask({ isEdit: false, itemId: taskId });
  }

  function handleStop() {
    haptic.warning();
    if (isPlaying) {
      console.log('END CALLED FROM HANDLE STOP');
      playTasks.pause();
      setIsPlaying(false);
    }
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

  /**
   * Component rendered by the DraggableFlatlist component
   * This is an intermediary component to allow the passing of other props
   * to the NowPlayingItem, which is a list item component.
   */
  function RenderItem({ drag, item, isActive }: RenderItemProps) {
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
      <Text style={styles(mode).headerTitle}>NOW PLAYING</Text>
      <Text testID="taskBlockTitle" style={styles(mode).headerText} numberOfLines={1}>
        {title && title.toUpperCase()}
      </Text>
      <ProgressBar mode={mode} progress={progress} />
      {/* Three Navigation Buttons */}
      <View style={styles(mode).navWrapper}>
        <Pressable
          onPress={isPlaying ? handleStop : handlePlay}
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
        <Pressable
          onPress={handleAddTask}
        >
          <View style={[styles(mode).navButton, mode === 'light' && shadow.on]}>
            <AntDesign
              name="plus"
              size={24}
              color={colors.roundButtonIcon[mode]}
            />
          </View>
        </Pressable>

      </View>

      {/* This is our component to render the draggable list
          The addition of GestureHandlerRootView is to fix the inability
          to drag on Android */}
      <GestureHandlerRootView style={{ flex: 1, height: '100%', width: '100%' }}>
        {tasksLocal.length === 0
          ? <Text style={styles(mode).addTasksText}>Add some tasks</Text>
          : (

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

          )}
      </GestureHandlerRootView>
    </Animated.View>
  );
}

const styles = (mode: string) => StyleSheet.create({
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
    width: '30%',
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
