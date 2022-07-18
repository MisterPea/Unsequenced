import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import HeaderIcon from '../components/HeaderIcon';
import TaskBlockIcon from '../components/icons/TaskBlockIcon';

import colors from '../constants/GlobalStyles';

export default function TaskBlocks() {
  const { mode } = useAppSelector((state) => state.screenMode);

  return (
    <View style={[taskBlockView(mode).container]}>
      <HeaderIcon color={colors.iconMainBG[mode]}>
        <TaskBlockIcon size={70} color={colors.iconMainFG[mode]} />
      </HeaderIcon>
      <View>
        <Text style={taskBlockView(mode).ctaText}>Choose a Task Block</Text>
        <Text style={taskBlockView(mode).ctaText}>or Create a New One</Text>
      </View>
    </View>
  );
}

const taskBlockView = (mode:string) => StyleSheet.create({
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
  },
  ctaText: {
    textAlign: 'center',
    color: colors.textOne[mode],
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
  },
});
