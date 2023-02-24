/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { colors, font } from '../constants/GlobalStyles';
import InputField from '../components/InputField';
import CheckBoxGroup from '../components/CheckBoxGroup';
import PillButton from '../components/PillButton';
import { TaskBlockRouteProps, ScreenProp, MainTaskBlocksNavProps, TaskBlock } from '../constants/types';
import haptic from '../components/helpers/haptic';
import { useAppSelector } from '../redux/hooks';
import validTextCheck from '../components/helpers/validTextCheck';

// import taskBlocks from '../redux/taskBlocks';

type Nav = MainTaskBlocksNavProps;
type Route = TaskBlockRouteProps;

// interface SwipeRouteProps {
//   title?: string | undefined;
//   id?: string | undefined;
//   autoplay?: boolean | undefined;
//   breaks?: boolean | undefined;
// }

type ButtonOptions = {
  breaks: boolean,
  autoplay: boolean,
};

export default function CreateNewTaskBlock({ route, navigation: { goBack, navigate, reset } }: { navigation: Nav, route: Route; }) {
  const { mode }: Readonly<any> = route.params!;
  const { taskBlocks, firstRun } = useAppSelector((state) => state);
  const { isFirstRun } = firstRun;
  const { blocks } = taskBlocks;
  const blockTitles: string[] = blocks.map((block) => block.title);
  const { title, id, autoplay, breaks }: Readonly<any | undefined> = route.params;
  const [input, setInput] = useState<string>(title || '');
  const [option, setOption] = useState<ButtonOptions>({ breaks: breaks || false, autoplay: autoplay || true });
  const [validInput, setValidInput] = useState<boolean>(false);
  const [openFirstRun, setOpenFirstRun] = useState(isFirstRun);

  // Check for the validity of input
  useEffect(() => {
    const isValidTitle = validTextCheck(input, blockTitles, title);
    const hasLength = input.length > 0;
    // If we're editing
    if (title) {
      const diffTitle = (input !== title) && hasLength;
      const diffOptionPlay = autoplay !== option.autoplay;
      const diffOptionBreak = breaks !== option.breaks;
      const isValid = (diffTitle || diffOptionBreak || diffOptionPlay) && isValidTitle;
      setValidInput(isValid);
    } else {
      setValidInput(isValidTitle && hasLength);
    }
  }, [input, option.autoplay, option.breaks]);

  function handleCreateTaskBlock() {
    const taskBlock: TaskBlock = {
      id: Math.random().toString(36).replace(/[^\w\s']|_/g, ''),
      title: input,
      breaks: option.breaks,
      autoplay: option.autoplay,
      tasks: [],
    };

    // the actual adding of the new task is done in TaskBlocks.tsx
    navigate('Task Blocks', { addATaskBlock: taskBlock, inIntro: true });
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
          <View style={{ alignSelf: 'center', width: '100%' }}>
            <Tooltip
              isVisible={openFirstRun}
              onClose={() => setOpenFirstRun(false)}
              backgroundColor="#00000000"
              contentStyle={{ marginTop: 10, width: '100%', backgroundColor: '#303030' }}
              disableShadow
              useInteractionManager
              showChildInTooltip={false}
              content={(
                <>
                  <Text style={styles(mode).tooltip}>
                    1. Let&apos;s name our new Task Block.
                  </Text>
                  <Text style={styles(mode).tooltip}>
                    2. Click &apos;Add 5 min break between tasks&apos;
                  </Text>
                  <Text style={styles(mode).tooltip}>
                    3. Click &apos;Create Block&apos;
                  </Text>
                </>
              )}
            >

              <Text style={styles(mode).tabText}>Create New Task Block</Text>
            </Tooltip>
          </View>
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
            title="Stop between tasks/breaks"
            screenMode={mode}
            value={!option.autoplay}
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
                background: validInput ? colors.confirmBtn[mode] : colors.disabled[mode],
                border: 'rgba(0,0,0,0)',
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
                border: colors.cancelButton[mode],
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

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  tooltip: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.85,
    color: '#ffffff',
  },
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
