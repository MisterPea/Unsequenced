import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/GlobalStyles';
import { TaskBlockNavProps, TaskBlockRouteProps } from '../constants/types';
import HeaderIcon from '../components/HeaderIcon';
import AddTaskIcon from '../components/icons/AddTaskIcon';
import InputField from '../components/InputField';
import PillButton from '../components/PillButton';

type Nav = TaskBlockNavProps;
type Route = TaskBlockRouteProps;

export default function AddTask({ route, navigation }:{navigation: Nav, route: Route}) {
  const { mode } = route.params;
  const [taskName, setTaskName] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  return (
    <View style={[styles(mode).container]}>
      <HeaderIcon color={colors.iconMainBG[mode]}>
        <AddTaskIcon size={70} color={colors.iconMainFG[mode]} />
      </HeaderIcon>
      <View style={styles(mode).inputGroup}>
        <InputField
          label="TASK NAME:"
          screenMode={mode}
          placeholder="Enter Task Name"
          value={taskName}
          callback={setTaskName}
          style={{ maxWidth: '100%' }}
        />
        <View style={styles(mode).durationRow}>
          <View style={styles(mode).durationFlexItem}>
            <InputField
              label="DURATION:"
              screenMode={mode}
              value={duration}
              callback={setDuration}
              placeholder="Minutes"
            />
          </View>
          <View style={styles(mode).durationFlexItem}>
            <PillButton
              size="sm"
              label="Add Task"
              colors={{
                text: colors.confirmBtnText[mode],
                background: colors.confirmBtnBG[mode],
                border: 'rgba(0, 0, 0, 0)',
              }}
            />
          </View>
        </View>
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
  inputGroup: {
    marginTop: 15,
  },
  durationRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 0.25,
    borderBottomColor: '#000000',
    paddingBottom: 35,
  },
  durationFlexItem: {
    flex: 1,
  },
});
