import React from 'react';
import { View, Animated, StyleSheet, Pressable, Alert, LayoutAnimation } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';
import TaskBlockListItem from '../TaskBlockListItem';
import { TaskBlock } from '../../constants/types';
import { colors } from '../../constants/GlobalStyles';
import haptic from '../helpers/haptic';
import { removeTaskBlock } from '../../redux/taskBlocks';
import { useAppDispatch } from '../../redux/hooks';

let screenMode: 'light' | 'dark';

interface HiddenItemProps {
  [key: string]: any;
}

interface SwipeListProps {
  data: TaskBlock[];
  mode: 'light' | 'dark';
  leftStatusChg?: () => void;
}

function HiddenItemWithActions(props: HiddenItemProps) {
  const { data, rowMap, swipeAnimatedValue } = props;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  function handleEditTaskBlock() {
    haptic.select();
    rowMap[data.item.id].closeRow();
    navigation.navigate('TaskBlocksNavigator', {
      screen: 'createNewTaskBlock',
      params: {
        title: data.item.title,
        id: data.item.id,
        autoplay: data.item.autoplay,
        breaks: data.item.breaks,
      },
    });
  }

  function deleteConfirmed() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    haptic.success();
    dispatch(removeTaskBlock({ id: data.item.id }));
  }

  // Method to confirm you want to delete a task block
  function handleDeleteTaskBlock() {
    haptic.warning();
    rowMap[data.item.id].closeRow();
    Alert.alert(
      `Delete ${data.item.title}?`,
      'This action cannot be undone!',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete', onPress: deleteConfirmed, style: 'destructive',
        },
      ],
    );
  }

  function deleteScale() {
    return swipeAnimatedValue.interpolate({
      inputRange: [40, 70],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }

  function rightScale() {
    return swipeAnimatedValue.interpolate({
      inputRange: [-90, -40],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  }

  return (
    <View style={styles(screenMode).row}>
      <Pressable
        onPress={handleDeleteTaskBlock}
      >
        <Animated.View style={[styles(screenMode).delete, { opacity: deleteScale() }]}>
          <Animated.View style={[{
            transform: [{
              scale: deleteScale(),
            }],
          }]}
          >
            <MaterialCommunityIcons name="delete" size={26} color="white" />
          </Animated.View>
        </Animated.View>
      </Pressable>
      <Animated.View style={[styles(screenMode).rightBank, {
        opacity: rightScale(),

      }]}
      >
        <Pressable
          onPress={handleEditTaskBlock}
        >
          <View style={styles(screenMode).rowEdit}>
            <MaterialCommunityIcons name="folder-edit-outline" size={24} color={colors.slideAddTaskText[screenMode]} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function RenderHiddenItem(data: TaskBlock[], rowMap: [key: string]) {
  return (
    <HiddenItemWithActions
      data={data}
      rowMap={rowMap}
    />
  );
}

export default function SwipeList({ data, mode, leftStatusChg }: SwipeListProps) {
  screenMode = mode;
  function renderItem(item: any) {
    return <TaskBlockListItem item={item} mode={mode} />;
  }

  function extractKey(item: TaskBlock) {
    return item.id;
  }

  function rowOpen() {
    haptic.light();
  }

  return (

    <SwipeListView
      data={data}
      renderItem={renderItem}
      renderHiddenItem={RenderHiddenItem}
      keyExtractor={extractKey}
      leftOpenValue={75}
      stopLeftSwipe={75}
      onLeftActionStatusChange={leftStatusChg}
      rightOpenValue={-75}
      stopRightSwipe={-75}
      closeOnRowBeginSwipe
      onRowOpen={rowOpen}
      friction={100}
      tension={100}
      testID="swipeListItem"
    />

  );
}

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightBank: {
    flexDirection: 'row-reverse',
  },
  delete: {
    backgroundColor: 'red',
    width: 77,
    height: 62,
    marginTop: 1,
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowEdit: {
    width: 76,
    height: 62,
    marginTop: 1,
    backgroundColor: colors.slideAddTask[mode],
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
});
