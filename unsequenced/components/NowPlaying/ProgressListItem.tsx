import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { colors, font } from '../../constants/GlobalStyles';

interface TimeProp {
  completed: number;
  total: number;
}

interface ProgressListItemProps {
  mode: string;
  title: string;
  time: TimeProp;
}

// This component is the progress bar attached to the list item.
// export default function ProgressListItem({ mode, title, time }: ProgressListItemProps) {
export default function ProgressListItem(props) {
  const { mode, title, time } = props;
  const percentage = useRef(new Animated.Value(time.completed)).current;

  useEffect(() => {
    load(time.completed);
  }, [time.completed]);

  function load(count: number) {
    Animated.timing(percentage, {
      toValue: count,
      duration: 600,
      useNativeDriver: false,
      easing: Easing.linear,
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
          {time.total > 0 && <Text style={listItem(mode).timeInfo}>{`${Math.round(time.completed)} min of ${time.total} min complete`}</Text>}
        </View>
        <View>
          <EvilIcons name="chevron-right" size={30} color={colors.disabled[mode]} />
        </View>
      </View>
    </View>
  );
}

const listItem = (mode: string) => StyleSheet.create({
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
