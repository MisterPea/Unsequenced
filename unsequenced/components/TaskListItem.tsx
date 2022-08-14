import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { Task } from '../constants/types';
import { colors, font } from '../constants/GlobalStyles';
import totalTime from './helpers/totalTime';

interface TaskListItemProps extends Task {
  mode: string;

}

export default function TaskListItem({ item, mode, dataLength }) {
  const { id, title, amount } = item.item;

  return (
    <View
      // Add gap if last element - to allow scrolling
      style={[styles(mode).container,
        (dataLength - 1) === item.index && styles(mode).last,
      ]}
      testID="taskBlockListItem"

    >
      <View style={styles(mode).leftSide}>
        <Text style={styles(mode).title}>{title}</Text>
        <Text style={styles(mode).time}>{totalTime(Number(amount))}</Text>
      </View>
      <View>
        <EvilIcons name="chevron-right" size={30} color="black" />
      </View>
    </View>
  );
}

const styles = (mode:string) => StyleSheet.create({
  container: {
    height: 62,
    backgroundColor: colors.taskListItemBG[mode],
    marginHorizontal: 1,
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSide: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontFamily: font.liTitle.fontFamily,
    fontSize: font.liTitle.fontSize,
    color: colors.taskListItemText[mode],
  },
  time: {
    fontFamily: font.liSubTitle.fontFamily,
    fontSize: font.liSubTitle.fontSize,
    color: colors.taskListItemText[mode],
  },
  last: {
    marginBottom: 70,
  },
});
