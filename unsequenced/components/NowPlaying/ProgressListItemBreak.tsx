import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { colors, font } from '../../constants/GlobalStyles';

// This component is the progress bar attached to the list item.
// export default function ProgressListItem({ mode, title, time }: ProgressListItemProps) {
export default function ProgressListItemBreak(props) {
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
    <View style={listItemBreak(mode).container}>
      <Animated.View style={[listItemBreak(mode).progressContainer, { width: widthPercent }]} />
      <View style={listItemBreak(mode).textWrapper}>
        <View>
          <Text numberOfLines={1} style={listItemBreak(mode).title}>{title}</Text>
          {time.total > 0 && <Text style={listItemBreak(mode).timeInfo}>{`${Math.round(time.completed)} min of ${time.total} min complete`}</Text>}
        </View>
        <View>
          <EvilIcons name="chevron-right" size={30} color={colors.disabled[mode]} />
        </View>
      </View>
    </View>
  );
}

const listItemBreak = (mode: 'light' | 'dark') => StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors.progressBackground[mode],
    borderTopColor: colors.progressBorder[mode],
    borderTopWidth: 1,
    borderBottomColor: colors.progressBorder[mode],
    borderBottomWidth: 1,
    marginHorizontal: 1,
    marginVertical: 2,
  },
  progressContainer: {
    backgroundColor: colors.breakContainer[mode],
    height: 50,
    top: -1,
    alignSelf: 'flex-end',

  },
  textWrapper: {
    height: 50,
    top: -50,
    marginLeft: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontFamily: font.liBreak.fontFamily,
    fontSize: font.liBreak.fontSize,
    color: colors.taskListItemTextBreak[mode],
  },
  timeInfo: {
    fontFamily: font.liSubTitle.fontFamily,
    fontSize: font.liSubTitle.fontSize,
    color: colors.taskListItemTextBreak[mode],
  },
});
