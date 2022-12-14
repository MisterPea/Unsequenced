/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, UIManager } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { SwipeRow } from 'react-native-swipe-list-view';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { RefProps, RenderItemProps, HiddenRowNowPlayingProps } from '../../constants/types';
import ProgressListItemBreak from './ProgressListItemBreak';
import haptic from '../helpers/haptic';
import { colors } from '../../constants/GlobalStyles';
import { markTaskComplete, resetTaskTime } from '../../redux/taskBlocks';
import AddEditTask from './AddEditTask';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

function HiddenRow(props: HiddenRowNowPlayingProps) {
  const { item, id, closeRow } = props;
  const dispatch = useDispatch();

  function handleMarkTaskComplete() {
    haptic.success();
    closeRow();
    dispatch(markTaskComplete({ id, taskId: item.id }));
  }

  function handleResetTime() {
    haptic.success();
    closeRow();
    dispatch(resetTaskTime({ id, taskId: item.id }));
  }

  return (
    <View style={styles().hiddenWrapper}>
      {/* Hidden Element on Left Side */}
      <View />
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
export default function NowPlayingItemBreak(props: RenderItemProps) {
  const { item, drag, isActive, swipeRef, setEnableScroll, mode, id, setEditTask, editTask } = props;

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
        leftOpenValue={-0.1}
        stopLeftSwipe={-0.1}
        rightOpenValue={editTask ? -0.1 : -90}
        stopRightSwipe={editTask ? -0.1 : -90}
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
        />
        <Pressable onLongPress={drag} disabled={isActive}>
          {/* THIS IS THE ACTUAL INNARDS OF THE LI PROGRESS BAR */}
          <ProgressListItemBreak
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
  hiddenWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 52,
    // flex: 1,
  },
  rightBank: {
    flexDirection: 'row',
    marginRight: 2,
    marginTop: 2,
    justifyContent: 'flex-end',
    width: 91,
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
