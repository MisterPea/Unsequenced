import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { colors, font } from '../../constants/GlobalStyles';

interface TimeProp {
  completed: number;
  total: number;
}

interface ProgressListItemProps {
  mode:string;
  title:string;
  time: TimeProp;
}

export default function ProgressListItem({ mode, title, time }:ProgressListItemProps) {
  const percentage = useRef(new Animated.Value(time.completed)).current;

  useEffect(() => {
    load(time.completed);
  }, [time.completed]);

  function load(count:number) {
    Animated.timing(percentage, {
      toValue: count,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  const widthPercent = percentage.interpolate({
    inputRange: [0, time.total],
    outputRange: ['100%', '0%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={listItem(mode).container}>
      <Animated.View style={[listItem(mode).progressContainer, { width: widthPercent }]} />
      <View style={listItem(mode).textWrapper}>
        <View>
          <Text numberOfLines={1} style={listItem(mode).title}>{title}</Text>
          {time.total > 0 && <Text style={listItem(mode).timeInfo}>{`${time.completed} min of ${time.total} min complete`}</Text>}
        </View>
        <View>
          <EvilIcons name="chevron-right" size={30} color={colors.disabled[mode]} />
        </View>
      </View>
    </View>
  );
}

const listItem = (mode:string) => StyleSheet.create({
  container: {
    height: 62,
    backgroundColor: colors.progressBackground[mode],
    borderTopColor: colors.progressBorder[mode],
    borderTopWidth: 1,
    borderBottomColor: colors.progressBorder[mode],
    borderBottomWidth: 1,
    marginHorizontal: 1,
    marginVertical: 2,
  },
  progressContainer: {
    backgroundColor: colors.taskListItemBG[mode],
    height: 62,
    top: -1,
    alignSelf: 'flex-end',
  },
  textWrapper: {
    height: 62,
    top: -62,
    marginLeft: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontFamily: font.liTitle.fontFamily,
    fontSize: font.liTitle.fontSize,
    color: colors.taskListItemText[mode],
  },
  timeInfo: {
    fontFamily: font.liSubTitle.fontFamily,
    fontSize: font.liSubTitle.fontSize,
    color: colors.taskListItemText[mode],
  },
});
