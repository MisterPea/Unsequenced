import React from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import HeaderIcon from '../components/HeaderIcon';
import TaskBlockIcon from '../components/icons/TaskBlockIcon';
import TaskBlockListItem from '../components/TaskBlockListItem';
import { TaskBlock, TaskBlockNavProps } from '../constants/types';
import colors from '../constants/GlobalStyles';
import PillButton from '../components/PillButton';

export default function TaskBlocks({ navigation }:{navigation: TaskBlockNavProps}) {
  const { screenMode, taskBlocks } = useAppSelector((state) => state);
  const { mode } = screenMode;
  const { blocks } = taskBlocks;

  function handleCreateTaskBlockPress() {
    navigation.navigate('createNewTaskBlock');
  }

  function extractKey(item:TaskBlock) {
    return item.id;
  }

  return (
    <View style={[taskBlockView(mode).container]}>
      <HeaderIcon color={colors.iconMainBG[mode]}>
        <TaskBlockIcon size={70} color={colors.iconMainFG[mode]} />
      </HeaderIcon>
      <View style={taskBlockView(mode).ctaView}>
        <Text style={taskBlockView(mode).ctaText}>Choose a Task Block</Text>
        <Text style={taskBlockView(mode).ctaText}>or Create a New One</Text>
      </View>
      <FlatList
        data={blocks}
        renderItem={TaskBlockListItem}
        keyExtractor={extractKey}
      />
      <SafeAreaView style={taskBlockView(mode).safeView}>
        <PillButton
          label="Create New Task Block"
          size="lg"
          shadow
          colors={{ text: '#ffffff', background: colors.greenBtn[mode], border: 'transparent' }}
          action={handleCreateTaskBlockPress}
        />
      </SafeAreaView>
    </View>
  );
}

const taskBlockView = (mode: string) => StyleSheet.create({
  container: {
    backgroundColor: colors.background[mode],
    flex: 1,
    paddingTop: 25,
  },
  ctaView: {
    marginVertical: 20,
  },
  ctaText: {
    textAlign: 'center',
    color: colors.textOne[mode],
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
  },
  safeView: {
    marginBottom: 70,
  },
});
