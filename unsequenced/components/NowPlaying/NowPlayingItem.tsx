/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, Animated, UIManager } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { SwipeRow } from 'react-native-swipe-list-view';
import { AntDesign, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useAppDispatch } from '../../redux/hooks';
import { RefProps, RenderItemProps, HiddenRowNowPlayingProps } from '../../constants/types';
import ProgressListItem from './ProgressListItem';
import haptic from '../helpers/haptic';
import { colors } from '../../constants/GlobalStyles';
import { markTaskComplete, duplicateTask, removeTask, resetTaskTime } from '../../redux/taskBlocks';
import AddEditTask from './AddEditTask';
import { middlewearActions } from './playTasks';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

function HiddenRow(props: HiddenRowNowPlayingProps) {
  const { swipeAnimatedValue, item, id, closeRow, setEditTask, isFirstRun, firstRunCallback } = props;
  const dispatch = useAppDispatch();

  function deleteScale() {
    return swipeAnimatedValue!.interpolate({
      inputRange: [30, 75],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }

  function widthMax() {
    return swipeAnimatedValue!.interpolate({
      inputRange: [0, 75, 200],
      outputRange: [-200, -65, 0],
    });
  }

  function handleMarkTaskComplete() {
    haptic.success();
    closeRow();
    middlewearActions.markCompletedCalled();
    dispatch(markTaskComplete({ id, taskId: item.id }));
  }

  function handleResetTime() {
    haptic.success();
    closeRow();
    middlewearActions.markCompletedCalled();
    dispatch(resetTaskTime({ id, taskId: item.id }));
  }

  function handleDuplicateTask() {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    isFirstRun && firstRunCallback(5);
    haptic.light();
    closeRow();
    dispatch(duplicateTask({ id, taskId: item.id }));
  }

  function handleDelete() {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    haptic.warning();
    closeRow();
    dispatch(removeTask({ id, taskId: item.id }));
  }

  function handleOpenEdit() {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    haptic.light();
    closeRow();
    setEditTask({ isEdit: true, itemId: item.id });
  }

  return (
    <View style={styles().hiddenWrapper}>
      <View style={styles().leftBank}>
        <Pressable
          onPress={handleDelete}
        >
          <Animated.View style={[styles().icon, styles().delete]}>
            <Animated.View style={[
              { opacity: deleteScale() },
              {
                transform: [{ scale: deleteScale() }, { translateX: widthMax() }],
              },
            ]}
            >
              <MaterialCommunityIcons name="delete" size={26} color="white" />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>
      {/* HIDDEN ELEMENTS ON RIGHT SIDE */}

      <View style={styles().rightBank}>
        {item.completed !== 0 && (
          <Pressable
            style={[styles().iconWrapper]}
            onPress={handleResetTime}
          >
            <View style={[styles().icon, styles().resetTime]}>
              <SimpleLineIcons name="refresh" size={24} color="#ffffff" />
            </View>
          </Pressable>
        )}
        <Pressable
          style={[styles().iconWrapper]}
          onPress={handleOpenEdit}
        >
          <View style={[styles().icon, styles().options]}>
            <Ionicons name="ellipsis-vertical-circle" size={24} color="#ffffff" />
          </View>
        </Pressable>
        <Pressable
          style={[styles().iconWrapper]}
          onPress={handleDuplicateTask}
        >
          <View style={[styles().icon, styles().duplicate]}>
            <Ionicons name="duplicate-outline" size={24} color="#ffffff" />
          </View>
        </Pressable>
        {item.completed !== item.amount
          && (
            <Pressable
              style={[styles().iconWrapper]}
              onPress={handleMarkTaskComplete}
            >
              <View style={[styles().icon, styles().done]}>
                <AntDesign name="checkcircleo" size={20} color="#ffffff" />
              </View>
            </Pressable>
          )}
      </View>
    </View>

  );
}
/*
 *************************************
 *************************************
 ********* Root of list item *********
 *************************************
 *************************************
 */
export default function NowPlayingItem(props: RenderItemProps) {
  const { item, drag, isActive, swipeRef, setEnableScroll, mode, id, setEditTask, editTask, isFirstRun, firstRunCallback } = props;

  useEffect(() => {
    // We check to see if we're in add/edit mode. If so, we call the close method incase any slider is open.
    if (editTask !== undefined) {
      closeRowAction();
    }
  }, [editTask]);

  // This allows us to store the reference for the closeRow() at the top-est level for where we need it.
  let ref: RefProps;

  // We parse the ref here, and make it usable to closeRowAction (which closes the row)
  function onLoad(refFromSwipe: any) {
    if (refFromSwipe) {
      ref = refFromSwipe;
    }
  }

  // Convenience method to close open sliders. When populated, ref refers to a currently open slider
  function closeRowAction() {
    if (ref) {
      ref.closeRow();
    }
  }

  /**
     * Method to close a previously opened swiped list item
     * We store the id along with the close method in swipeRef.
     * If we see the same id, it means that it's being closed manually.
     */
  function postRow() {
    setEnableScroll(false);
    if (swipeRef.current !== undefined) {
      if (swipeRef.current.id !== item.id) {
        swipeRef.current.close();
      } else {
        swipeRef.current = undefined;
      }
    }
    swipeRef.current = { id: item.id, close: closeRowAction };
  }

  function resumeScroll() {
    setEnableScroll(true);
  }

  function rowOpen() {
    haptic.light();
  }

  // For SwipeRow, the first argument is the hidden component,
  // followed by the visible one.
  return (
    <ScaleDecorator>
      <SwipeRow
        ref={onLoad}
        leftOpenValue={editTask ? 0.1 : 75}
        stopLeftSwipe={editTask ? 0.1 : 200}
        rightOpenValue={editTask ? -0.1 : -180}
        stopRightSwipe={editTask ? -0.1 : -180}
        closeOnRowPress
        swipeGestureBegan={postRow}
        swipeGestureEnded={resumeScroll}
        friction={20}
        tension={100}
        onRowOpen={rowOpen}
        swipeToOpenVelocityContribution={10}
      >
        <HiddenRow
          mode={mode}
          item={item}
          id={id!}
          closeRow={closeRowAction}
          setEditTask={setEditTask}
          isFirstRun={isFirstRun}
          firstRunCallback={firstRunCallback}
        />
        <Pressable onLongPress={drag} disabled={isActive}>
          {/* THIS IS THE ACTUAL INNARDS OF THE LI PROGRESS BAR */}
          <ProgressListItem
            title={item.title}
            time={{ total: item.amount, completed: item.completed }}
            mode={mode}
          />
          {editTask?.itemId === item.id && (
            <AddEditTask
              setEditTask={setEditTask}
              editTask={editTask}
              id={id} // id of the task block
              item={item}
              mode={mode}
            />
          )}
        </Pressable>
      </SwipeRow>
    </ScaleDecorator>
  );
}

const styles = () => StyleSheet.create({
  tooltip: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.85,
    color: '#ffffff',
  },
  hiddenWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 63,
    // flex: 1,
  },
  leftBank: {
    marginTop: 2,
    marginLeft: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  rightBank: {
    flexDirection: 'row',
    marginRight: 2,
    marginTop: 2,
    justifyContent: 'flex-end',
    width: 182,
  },
  iconWrapper: {
    flexDirection: 'row',
    flexBasis: 33,
    flexGrow: 1,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    height: '100%',
    flex: 1,
  },
  done: {
    backgroundColor: colors.createNewTaskBtn.light,
  },
  duplicate: {
    backgroundColor: 'hsl(208, 40%, 35%)',
  },
  options: {
    paddingLeft: 4,
    backgroundColor: 'hsl(208, 50%, 50%)',
  },
  resetTime: {
    backgroundColor: 'hsl(208, 60%, 70%)',
    paddingLeft: 4,
  },
  delete: {
    backgroundColor: 'red',
    width: 200,
  },
});
