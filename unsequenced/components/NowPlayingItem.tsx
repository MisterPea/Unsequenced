import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { SwipeRow } from 'react-native-swipe-list-view';
import { Task } from '../constants/types';
import ProgressListItem from './ProgressListItem';

interface RefProps {
  [key:string]:any
}

type UseRefProp ={
  current: any,
};

interface RenderItemProps {
  drag:()=> void;
  item: Task;
  isActive: boolean;
  swipeRef:UseRefProp;
  setEnableScroll:(bool:boolean)=> void;
  mode:string;
}

export default function NowPlayingItem({ item, drag, isActive, swipeRef, setEnableScroll, mode }:RenderItemProps) {
  let ref:RefProps;

  // We parse the ref here, and make it usable to closeRowAction (which closes the row)
  function onLoad(refFromSwipe:object) {
    if (refFromSwipe) {
      ref = refFromSwipe;
    }
  }

  function closeRowAction() {
    if (ref) {
      ref.closeRow();
    }
  }

  /**
     * Method to close a previously opened swiped list item
     * We store the id along with the close method in swipeRef.
     * If we see the same id, it means that it's being closed manually.
     */
  function postRow() {
    setEnableScroll(false);
    if (swipeRef.current !== undefined) {
      if (swipeRef.current.id !== item.id) {
        swipeRef.current.close();
      } else {
        swipeRef.current = undefined;
      }
    }
    swipeRef.current = { id: item.id, close: closeRowAction };
  }

  function resumeScroll() {
    setEnableScroll(true);
  }

  return (
    <ScaleDecorator>
      <SwipeRow
        ref={onLoad}
        leftOpenValue={100}
        closeOnRowPress
        swipeGestureBegan={postRow}
        swipeGestureEnded={resumeScroll}
        friction={20}
        tension={100}
      >
        <View>
          <Text>Hidden</Text>
        </View>
        <Pressable onLongPress={drag} disabled={isActive}>
          <ProgressListItem title={item.title} time={{ total: item.amount, completed: item.completed }} mode={mode} />
        </Pressable>
      </SwipeRow>
    </ScaleDecorator>
  );
}
