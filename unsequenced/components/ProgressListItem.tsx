import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { colors, font } from '../constants/GlobalStyles';

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
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    const percentComplete = 100 - ((time.completed / time.total) * 100);
    setPercentage(percentComplete);
  }, [time.completed]);

  return (
    <View style={listItem(mode).container}>
      <View style={listItem(mode, percentage).progressContainer} />
      <View style={listItem(mode).textWrapper}>
        <View style={listItem(mode).leftSide}>
          <Text style={listItem(mode).title}>{title}</Text>
          <Text style={listItem(mode).timeInfo}>{`${time.completed} min of ${time.total} min complete`}</Text>
        </View>
        <View>
          <EvilIcons name="chevron-right" size={30} color={colors.disabled[mode]} />
        </View>
      </View>
    </View>
  );
}

const listItem = (mode:string, percent?:number) => StyleSheet.create({
  container: {
    height: 62,
    backgroundColor: colors.background[mode],
    borderTopColor: colors.settingsTextMain[mode],
    borderTopWidth: 1,
    borderBottomColor: colors.settingsTextMain[mode],
    borderBottomWidth: 1,
    marginHorizontal: 1,
    marginVertical: 2,
  },
  progressContainer: {
    backgroundColor: colors.taskListItemBG[mode],
    height: 62,
    top: -1,
    width: `${percent}%`,
    alignSelf: 'flex-end',
  },
  textWrapper: {
    height: 62,
    top: -62,
    marginLeft: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // flex: 1,
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
