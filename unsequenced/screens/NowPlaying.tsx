/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { EvilIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { SwipeRow } from 'react-native-swipe-list-view';
import { colors, font } from '../constants/GlobalStyles';
import { MainTaskBlocksNavProps, TaskBlockRouteProps, UseSelectorProps, ScreenProp, Task } from '../constants/types';
import haptic from '../components/helpers/haptic';
import ProgressListItem from '../components/ProgressListItem';
import { reorderTasks } from '../redux/taskBlocks';

type Route = TaskBlockRouteProps;
type MainNav = MainTaskBlocksNavProps;

interface AddTaskProps {
  navigation: MainNav;
  route: Route;
}

interface RouteParamsProps {
  id:string;
  mode?:string;
  title:string;
}

interface SlideObj {
  close:() => void;
  id:string;
}

export default function NowPlaying({ route, navigation }:AddTaskProps) {
  const { id, title }:RouteParamsProps = route.params!;
  const { screenMode, taskBlocks }:UseSelectorProps = useSelector((state) => state!);
  const { mode }:ScreenProp = screenMode!;
  const [tasksLocal, setTasksLocal] = useState<Task[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0, percent: 0 });
  const [enableScroll, setEnableScroll] = useState(true);
  const swipeRefVar = useRef<SlideObj|undefined>();

  const dispatch = useDispatch();

  useEffect(() => {
    // We only need to initiate the tasksLocal on load. Thereafter we handle it
    // through onDragEnd, where we also update the store.
    if (tasksLocal.length === 0) {
      const index:number = taskBlocks!.blocks.findIndex((elem) => elem.id === id);
      if (index > -1) {
        setTasksLocal(taskBlocks!.blocks[index].tasks);
        calculateProgress(taskBlocks!.blocks[index].tasks);
      }
    }
  }, [taskBlocks]);

  function handleBackButtonPress() {
    haptic.select();
    navigation.navigate('TaskBlocksNavigator', { screen: 'Task Blocks' });
  }

  function handleSettingsPress() {
    haptic.select();
    navigation.navigate('Settings');
  }

  function calculateProgress(tasks:Task[]) {
    const totalTime = tasks.reduce((prev:number, curr:Task) => curr.amount + prev, 0);
    const completedTime = tasks.reduce((prev:number, curr:Task) => curr.completed + prev, 0);
    const barPercentage = (((completedTime / totalTime) - 1) * 100) + 100;

    setProgress({ total: totalTime, completed: completedTime, percent: barPercentage });
  }

  function extractKey(item:Task) {
    return item.id;
  }

  function handlePlay() {
    haptic.select();
  }

  function handleAddTask() {
    haptic.select();
  }

  function handleStop() {
    haptic.warning();
  }

  function onDragEnd({ data }:{data:Task[]}) {
    haptic.light();
    setTasksLocal(data);
    dispatch(reorderTasks({ id, updatedOrder: data }));
  }

  function onDragStart() {
    haptic.medium();
    if (swipeRefVar.current !== undefined) {
      swipeRefVar.current.close();
    }
  }

  interface RefProps {
    [key:string]:any
  }

  function RenderItem({ item, drag, isActive }:{item:Task, isActive:boolean, drag:()=>void}) {
    let ref:RefProps;

    // We parse the ref here, and make it usable to closeRowAction
    function onLoad(refFromSwipe:object) {
      if (refFromSwipe) {
        ref = refFromSwipe;
      }
    }

    function closeRowAction() {
      if (ref) {
        ref.closeRow();
      }
    }

    /**
     * Method to close a previously opened swiped list item
     * We store the id along with the close method in swipeRefVar.
     * If we see the same id, it means that it's being closed manually.
     */
    function postRow() {
      setEnableScroll(false);
      if (swipeRefVar.current !== undefined) {
        if (swipeRefVar.current.id !== item.id) {
          swipeRefVar.current.close();
        } else {
          swipeRefVar.current = undefined;
        }
      }
      swipeRefVar.current = { id: item.id, close: closeRowAction };
    }

    function resumeScroll() {
      setEnableScroll(true);
    }

    return (
      <ScaleDecorator>
        <SwipeRow
          ref={onLoad}
          leftOpenValue={100}
          closeOnRowPress
          swipeGestureBegan={postRow}
          swipeGestureEnded={resumeScroll}
          friction={20}
          tension={100}
        >
          <View>
            <Text>Hidden</Text>
          </View>
          <Pressable onLongPress={drag} disabled={isActive}>
            <ProgressListItem title={item.title} time={{ total: item.amount, completed: item.completed }} mode={mode} />
          </Pressable>
        </SwipeRow>
      </ScaleDecorator>
    );
  }

  return (
    <View style={[styles(mode).container]}>
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
      <View style={styles(mode).progressWrapper}>
        <View style={styles(mode).progressBar} />
        <View style={[styles(mode).completeAmt, { width: `${progress.percent}%` }]} />
      </View>
      <View>
        <Text style={styles(mode).completeText}>{`${progress.completed} of ${progress.total} minutes completed`}</Text>
      </View>
      {/* Three Navigation Buttons */}
      <View style={styles(mode).navWrapper}>
        <Pressable
          onPress={handlePlay}
        >
          <View style={[styles(mode).navButton, mode === 'light' && shadow.on, { paddingLeft: 2 }]}>
            <Ionicons
              name="play-outline"
              size={24}
              color={colors.roundButtonIcon[mode]}
            />
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
        <Pressable
          onPress={handleStop}
        >
          <View style={[
            styles(mode).navButton,
            styles(mode).navClose,
            mode === 'dark' && shadow.on,
          ]}
          >
            <AntDesign name="close" size={24} color={colors.roundCloseBtnIcon[mode]} />
          </View>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        { tasksLocal.length === 0
          ? <Text style={{ textAlign: 'center' }}>Add some tasks</Text>
          : (
            <DraggableFlatList
              data={tasksLocal}
              renderItem={RenderItem}
              keyExtractor={extractKey}
              onDragEnd={onDragEnd}
              onDragBegin={onDragStart}
              activationDistance={20}
              scrollEnabled={enableScroll}
            />
          )}
      </View>
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
    width: '50%',
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
