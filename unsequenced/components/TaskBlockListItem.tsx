import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { TaskBlock } from '../constants/types';

export default function TaskBlockListItem({ item }:{item:TaskBlock}) {
  const { title, tasks } = item;

  function totalTime() {
    const timeMinutes = tasks.reduce((prev, curr) => prev + curr.amount, 0) || 0;
    if (timeMinutes <= 60) {
      if (timeMinutes === 60) {
        return '1 hour';
      }
      return `${timeMinutes} minutes`;
    }
    return `${Math.round((timeMinutes / 60) * 10 ** 1) / 10 ** 1} hours`;
    // return `${Math.round(((timeMinutes / 60) * 100) / 100)} hours`;
  }

  return (
    <View
      style={styles().container}
      testID="taskBlockListItem"
    >
      <View style={styles().leftSide}>
        <Text style={styles().title}>{title}</Text>
        <Text style={styles().time}>{totalTime()}</Text>
      </View>
      <View>
        <EvilIcons name="chevron-right" size={30} color="black" />
      </View>
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    height: 68,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSide: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 20,
  },
  time: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
  },
});
