import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Keyboard, Platform, EmitterSubscription } from 'react-native';
import { useDispatch } from 'react-redux';
import { removeTask, updateTask } from '../../redux/taskBlocks';
import InputField from '../InputField';
import PillButton from '../PillButton';
import { colors } from '../../constants/GlobalStyles';
import { Task, TaskUpdate } from '../../constants/types';
import { setKeyboardOffset } from '../../redux/keyboardOffset';
import haptic from '../helpers/haptic';

type EditTask = {
  isEdit: boolean,
  id?: string,
};

interface AddEditTaskProps {
  setEditTask: (value: undefined | string) => void;
  editTask: EditTask;
  item: Task;
  mode: 'light' | 'dark';
  id: string;
}

// Descending view for editing task.
// This appears when we edit or add a task
export default function AddEditTask(this: any, props: AddEditTaskProps) {
  const { setEditTask, editTask, item, mode, id } = props;
  const [taskName, setTaskName] = useState<string>(item.title || '');
  const [duration, setDuration] = useState<string>(String(item.amount) || '');
  const [entriesAreValid, setEntriesAreValid] = useState<boolean>(false);
  const [itemHeight, setItemHeight] = useState<number | undefined>(undefined);
  const [keyboardHeight, setKeyboardHeight] = useState<number | undefined>(undefined);
  const addEditSubmitted = useRef<boolean>(false);
  const dispatch = useDispatch();

  const animateTextInput = useRef(new Animated.Value(0)).current;
  const opacityTextInput = useRef(new Animated.Value(0)).current;
  const animatedButtons = useRef(new Animated.Value(0)).current;
  const contentRef = useRef<undefined | any>();

  useEffect(() => {
    animateOpen();
    let show: EmitterSubscription;
    let hide: EmitterSubscription;
    if (Platform.OS === 'ios') {
      show = Keyboard.addListener('keyboardWillShow', ({ endCoordinates }) => handleKeyboardHeight(endCoordinates.screenY));
      hide = Keyboard.addListener('keyboardWillHide', ({ endCoordinates }) => handleKeyboardHeight(endCoordinates.screenY));
    }
    // cleanup
    return () => {
      if (Platform.OS === 'ios') {
        show.remove();
        hide.remove();
      }
      // If we haven't submitted we need to check for a task that's
      // been created and not submitted. If there is one, we remove it.
      if (addEditSubmitted.current === false) {
        checkIfAbortedAddition();
      }
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight && itemHeight) {
      const difference = keyboardHeight - (itemHeight + 137);
      const offset = Math.min(0, difference);
      dispatch(setKeyboardOffset({ offset }));
    }
  }, [keyboardHeight, itemHeight]);

  // Ensure that we have valid entries
  useEffect(() => {
    const validText = taskName.length > 0 || (taskName !== item.title && taskName.length);

    const validDuration = Number(duration) > 0;
    const changedText = item.title !== taskName;
    const changedDuration = String(item.amount) !== duration;

    // is valid if text AND duration is valid AND either the text AND/OR the duration changed
    const isValid = !!(validText && validDuration) && (changedText || changedDuration);
    setEntriesAreValid(isValid);
  }, [taskName, duration]);

  // *************************************
  // ********* Animation Methods *********
  // *************************************
  function animateOpen() {
    Animated.timing(animatedButtons, {
      toValue: 100,
      duration: 250,
      delay: editTask.isEdit ? 200 : 0,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(animateTextInput, {
      toValue: 100,
      duration: 150,
      delay: editTask.isEdit ? 250 : 50,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(opacityTextInput, {
      toValue: 100,
      duration: 300,
      delay: editTask.isEdit ? 500 : 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  function animateClosed(callback: () => void) {
    Animated.timing(opacityTextInput, {
      toValue: 0,
      duration: 350,
      delay: 0,
      easing: Easing.bezier(0.58, 0.18, 0.37, 0.89),
      useNativeDriver: false,
    }).start();

    Animated.timing(animateTextInput, {
      toValue: 0,
      duration: 350,
      delay: 0,
      easing: Easing.bezier(0.58, 0.18, 0.37, 0.89),
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedButtons, {
      toValue: 0,
      duration: 300,
      delay: 80,
      easing: Easing.bezier(0.58, 0.18, 0.37, 0.89),
      useNativeDriver: false,
    }).start(callback);
  }

  const inputMarginTop = animateTextInput.interpolate({
    inputRange: [0, 100],
    outputRange: [-60, 0],
    extrapolate: 'clamp',
  });

  const inputOpacity = opacityTextInput.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const buttonMarginTop = animatedButtons.interpolate({
    inputRange: [0, 100],
    outputRange: [-70, 15],
    extrapolate: 'clamp',
  });

  const buttonOpacity = animatedButtons.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  function checkIfAbortedAddition() {
    // We're saying, if we're adding a task, but canceling the naming, then
    // we will delete that empty, non-named task.
    if (editTask.isEdit === false) {
      dispatch(removeTask({ id, taskId: item.id }));
    }
  }

  function handleCancelEdit() {
    haptic.light();
    animateClosed(finishClosing);
  }

  function handleUpdateTask() {
    haptic.success();
    const completed = editTask.isEdit ? Math.min(Number(duration), item.completed) : 0;
    const update: TaskUpdate = {
      title: taskName,
      amount: Number(duration),
      completed,
    };
    dispatch(updateTask({ id, taskId: item.id, update }));
    addEditSubmitted.current = true;
    animateClosed(finishClosing);
  }

  function finishClosing() {
    setEditTask(undefined);
  }

  // **************************************
  // **** Controlled Component Methods ****
  // **************************************
  function handleUpdateDuration(value: string | any) {
    if (+value > 0) {
      setDuration(value);
    } else {
      setDuration('0');
    }
  }

  // **************************************
  // ***** List Item//Keyboard Height *****
  // **************************************
  function handleItemHeight(y: number) {
    setItemHeight(y);
  }

  function handleKeyboardHeight(y: number) {
    setKeyboardHeight(y);
  }

  return (
    <View
      ref={contentRef}
      onLayout={() => {
        if (contentRef.current) {
          contentRef.current.measureInWindow((_x: number, y: number) => handleItemHeight(y));
        }
      }}
      style={[editDialogStyles(mode).container]}
    >

      <Animated.View style={[
        editDialogStyles().textInputWrapper,
        {
          marginTop: inputMarginTop,
          opacity: inputOpacity,
        },
      ]}
      >
        <View style={editDialogStyles().inputTask}>
          <InputField
            label="TASK NAME"
            placeholder="Enter Task Name"
            value={taskName}
            callback={setTaskName}
            screenMode={mode}
            inputStyle={{
              backgroundColor: colors.playEditInputBG[mode],
              color: colors.inputText[mode],
              borderColor: colors.inputBorder[mode],
            }}
          />
        </View>
        <View style={editDialogStyles().inputDuration}>
          <InputField
            label="DURATION"
            placeholder="Minutes"
            keyboardType="number-pad"
            value={Number(duration) < 1 ? undefined : String(Number(duration) * 1)}
            callback={handleUpdateDuration}
            screenMode={mode}
            maxLength={3}
            inputStyle={{
              backgroundColor: colors.playEditInputBG[mode],
              color: colors.inputText[mode],
              borderColor: colors.inputBorder[mode],
            }}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[editDialogStyles().buttonWrapper, { marginTop: buttonMarginTop, opacity: buttonOpacity }]}
      >
        <View style={editDialogStyles().button}>
          <PillButton
            label="Cancel"
            size="md"
            action={handleCancelEdit}
            colors={{
              text: colors.inputText[mode],
              background: '#00000000',
              border: colors.inputText[mode],
            }}
          />
        </View>
        <View style={editDialogStyles().button}>
          <PillButton
            label={editTask.isEdit === true ? 'Edit Task' : 'Add Task'}
            size="md"
            action={handleUpdateTask}
            disabled={!entriesAreValid}
            colors={{
              text: !entriesAreValid ? colors.createNewTaskText[mode] : colors.createNewTaskText[mode],
              background: entriesAreValid ? colors.confirmBtn[mode] : colors.disabled[mode],
              border: colors.inputBorder[mode],
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const editDialogStyles = (mode?: string) => StyleSheet.create({
  container: {
    backgroundColor: colors.taskListItemBG[mode!],
    marginTop: -64,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 0,
    overflow: 'hidden',
    minHeight: 64,
  },
  textInputWrapper: {
    flexDirection: 'row',
  },
  inputTask: {
    flex: 2,
  },
  inputDuration: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: 20,
  },
});
