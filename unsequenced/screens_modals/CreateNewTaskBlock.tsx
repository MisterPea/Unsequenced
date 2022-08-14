/* eslint-disable max-len */
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { colors, font } from '../constants/GlobalStyles';
import InputField from '../components/InputField';
import CheckBoxGroup from '../components/CheckBoxGroup';
import PillButton from '../components/PillButton';
import { TaskBlockRouteProps, ScreenProp, MainTaskBlocksNavProps, TaskBlock } from '../constants/types';
import haptic from '../components/helpers/haptic';


type Nav = MainTaskBlocksNavProps;
type Route = TaskBlockRouteProps;

interface SwipeRouteProps {
  title?: string | undefined;
  id?: string | undefined;
  autoplay?: boolean | undefined;
  breaks?: boolean | undefined;
}

type ButtonOptions = {
  breaks: boolean,
  autoplay: boolean,
};


export default function CreateNewTaskBlock({ route, navigation: { goBack, navigate, reset } }: { navigation: Nav, route: Route; }) {
  const { mode }: ScreenProp = route.params!;
  const { title, id, autoplay, breaks }: SwipeRouteProps = route.params;
  const [input, setInput] = useState<string>(title || '');
  const [option, setOption] = useState<ButtonOptions>({ breaks: breaks || false, autoplay: autoplay || false });

  function handleCreateTaskBlock() {
    const taskBlock: TaskBlock = {
      id: Math.random().toString(36).replace(/[^\w\s']|_/g, ''),
      title: input,
      breaks: option.breaks,
      autoplay: option.autoplay,
      tasks: [],
    };

    // the actual adding of the new task is done in TaskBlocks.tsx
    navigate('Task Blocks', { addATaskBlock: taskBlock });
  }

  function handleCancel() {
    haptic.select();
    goBack();
  }

  function handleToggleBreak() {
    haptic.select();
    setOption((s) => ({ ...s, breaks: !s.breaks }));
  }

  function handleToggleAutoplay() {
    haptic.select();
    setOption((s) => ({ ...s, autoplay: !s.autoplay }));
  }

  function handleUpdateTaskBlock() {
    haptic.success();
    const update = { title: input, breaks: option.breaks, autoplay: option.autoplay };
    navigate('Task Blocks', { editTaskBlock: { id, update } });
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
      style={styles(mode).container}
    >
      <View style={styles(mode).card}>
        <View>
          <View style={styles(mode).tab} />
          <Text style={styles(mode).tabText}>Create New Task Block</Text>
        </View>
        <View style={styles(mode).centerHeader} />
        <InputField
          screenMode={mode}
          label="TASK BLOCK NAME:"
          placeholder="Enter Task Block Name"
          callback={setInput}
          value={input}
          inputStyle={{
            backgroundColor: colors.inputBG[mode],
            borderColor: colors.inputBorder[mode],
            color: colors.inputText[mode],
          }}
        />
        <View style={styles(mode).checkboxWrapper}>
          <CheckBoxGroup
            title="Add 5 min break between tasks"
            screenMode={mode}
            value={option.breaks}
            toggleFunc={handleToggleBreak}
            testID="breakCheckbox"
          />
          <CheckBoxGroup
            title="Autoplay on launch"
            screenMode={mode}
            value={option.autoplay}
            toggleFunc={handleToggleAutoplay}
            testID="autoplayCheckbox"
            extraStyle={{ marginTop: 12 }}
          />
        </View>
        <View style={styles(mode).buttonHolder}>
          <View style={styles(mode).eachButtonWrap}>
            <PillButton
              label={title ? 'Edit Block' : 'Create Block'}
              colors={{
                text: colors.confirmText[mode],
                background: input.length ? colors.confirmBtn[mode] : colors.disabled[mode],
                border: 'rgba(0,0,0,0)'
              }}
              size="md"
              action={id ? handleUpdateTaskBlock : handleCreateTaskBlock}
              disabled={!input.length}
            />
          </View>
          <View style={styles(mode).eachButtonWrap}>
            <PillButton
              label="Cancel"
              colors={{
                text: colors.cancelButton[mode],
                background: 'rgba(0,0,0,0)',
                border: colors.cancelButton[mode]
              }}
              size="md"
              action={handleCancel}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (mode: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tab: {
    width: 40,
    height: 6,
    backgroundColor: colors.tabFill[mode],
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  tabText: {
    textAlign: 'center',
    color: colors.inputText[mode],
    fontFamily: font.settingsTitle.fontFamily,
    fontSize: font.settingsTitle.fontSize,
  },
  centerHeader: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: colors.bottomSheetBG[mode],
    borderRadius: 20,
    // borderWidth: 0.5,
    // borderStyle: 'solid',
    shadowOpacity: 0.45,
    shadowColor: '#000000',
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  checkboxWrapper: {
    marginTop: 20,
    alignItems: 'center',
    marginHorizontal: 30,
    borderBottomColor: colors.settingsGear[mode],
    borderBottomWidth: 0.5,
    paddingBottom: 20,
  },
  switchWrapInner: {
    alignItems: 'flex-start',
    paddingBottom: 20,
    borderBottomWidth: 0.5,
  },
  buttonHolder: {
    marginVertical: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginHorizontal: 20,

  },
  eachButtonWrap: {
    marginVertical: 10,
  },
});
