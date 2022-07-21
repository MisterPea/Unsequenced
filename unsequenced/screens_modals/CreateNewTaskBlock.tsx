/* eslint-disable max-len */
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import HeaderIcon from '../components/HeaderIcon';
import colors from '../constants/GlobalStyles';
import CreateIcon from '../components/icons/CreateIcon';
import InputField from '../components/InputField';
import CheckBoxGroup from '../components/CheckBoxGroup';
import PillButton from '../components/PillButton';
import { TaskBlockNavProps, TaskBlockRouteProps } from '../constants/types';

type Nav = TaskBlockNavProps;
type Route = TaskBlockRouteProps;

export default function CreateNewTaskBlock({ route, navigation: { goBack, reset } }:{navigation: Nav, route: Route}) {
  const { mode } = route.params;
  const [input, setInput] = useState<string>('');

  function handleCancel() {
    goBack();
  }

  function handleCreateTaskBlock() {
    reset({
      index: 0,
      routes: [{ name: 'Add a Task' }],
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-20}
      style={styles(mode).container}
    >
      <View
        style={styles(mode).card}
      >
        <View style={styles(mode).centerHeader}>
          <View style={styles(mode).header}>
            <HeaderIcon heightWidth={40} color={colors.iconModalBG[mode]}>
              <CreateIcon size={40} color={colors.iconModalFG[mode]} />
            </HeaderIcon>
            <Text style={styles(mode).headerText}>Create New Task Block</Text>
          </View>
        </View>
        <InputField
          screenMode={mode}
          label="TASK BLOCK NAME:"
          placeholder="Enter Task Block Name"
          callback={setInput}
          value={input}
        />
        <View style={styles(mode).checkboxWrapper}>
          <View style={styles(mode).switchWrapInner}>
            <CheckBoxGroup
              title="Add 5 min break between tasks"
              screenMode={mode}
            />
            <CheckBoxGroup
              title="Autoplay on launch"
              screenMode={mode}
            />
          </View>
        </View>
        <View style={styles(mode).buttonHolder}>
          <View style={styles(mode).eachButtonWrap}>
            <PillButton
              label="Create Task Block"
              colors={{ text: colors.confirmBtnText[mode],
                background: colors.confirmBtnBG[mode],
                border: 'rgba(0,0,0,0)' }}
              size="md"
              action={handleCreateTaskBlock}
            />
          </View>
          <View style={styles(mode).eachButtonWrap}>
            <PillButton
              label="Cancel"
              colors={{ text: colors.cancelBtn1[mode], background: 'rgba(0,0,0,0)', border: colors.cancelBtn1[mode] }}
              size="md"
              action={handleCancel}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (mode:string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundOverlay[mode],
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHeader: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    paddingHorizontal: 20,
    backgroundColor: colors.modalAndTaskBlockLi[mode],
    borderRadius: 6,
    borderColor: colors.textBoxBorder[mode],
    borderWidth: 0.5,
    borderStyle: 'solid',
    shadowOpacity: 0.45,
    shadowColor: '#000000',
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 5,
    textAlign: 'center',
    color: colors.textOne[mode],
  },
  checkboxWrapper: {
    marginTop: 20,
    alignItems: 'center',

  },
  switchWrapInner: {
    alignItems: 'flex-start',
    paddingBottom: 20,
    borderBottomColor: colors.textOne[mode],
    borderBottomWidth: 0.5,
  },
  buttonHolder: {
    marginVertical: 15,
  },
  eachButtonWrap: {
    marginVertical: 10,
  },
});
