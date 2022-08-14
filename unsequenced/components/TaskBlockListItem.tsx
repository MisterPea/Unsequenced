/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated, LayoutAnimation} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, font } from '../constants/GlobalStyles';
import haptic from './helpers/haptic';

interface TaskBlockProps {
  item:undefined;
  mode:string;
}

interface Current {
  amount: number
}

export default function TaskBlockListItem(props:TaskBlockProps) {
  const navigation = useNavigation();

  const { item } = props.item;
  const { mode } = props;
  const { title, tasks } = item;

  function totalTime() {
    const timeMinutes = tasks.reduce((prev:number, curr:Current) => prev + curr.amount, 0) || 0;
    if (timeMinutes <= 60) {
      if (timeMinutes === 60) {
        return '1 hour';
      }
      return `${timeMinutes} minutes`;
    }
    return `${Math.round((timeMinutes / 60) * 10 ** 1) / 10 ** 1} hours`;
  }

  function handleOnPress() {
    haptic.light();
    navigation.navigate('Now Playing', { id: item.id, title: item.title });
  }
  return (
    <Pressable
      onPress={handleOnPress}
      testID={`taskBlock-${item.title}`}
    >
      <Animated.View
        style={styles(mode).container}
        testID="taskBlockListItem"
      >
        <View style={styles(mode).leftSide}>
          <Text style={styles(mode).title}>{title}</Text>
          <Text style={styles(mode).time}>{totalTime()}</Text>
        </View>
        <View>
          <EvilIcons name="chevron-right" size={30} color={colors.disabled[mode]} />
        </View>
      </Animated.View>
    </Pressable>
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
});
