import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Task Blocks
 */
export interface Task {
  id: string;
  title: string;
  amount: number;
  completed: number;
  break?: boolean;
  notified?: boolean;
}

export interface TaskUpdate {
  title?: string;
  amount?: number;
  completed?: number;
}

export interface TaskBlock {
  id: string;
  title: string;
  breaks: boolean;
  autoplay: boolean;
  tasks: Task[];
}

export interface CurrentBlock {
  block: string | null;
}
/**
 * React Navigator
 * Navigation Props
 */
type Params = {
  id?: string;
  title?: string;
  taskBlock?: TaskBlock;
};

type RootStackParamList = {
  Settings: undefined,
  'Task Blocks': Params,
  createNewTaskBlock: any;
  TaskBlocksNavigator: { screen: string; },
  'Add a Task': undefined,
};
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
type TaskBlockScreenProps = NativeStackScreenProps<RootStackParamList, 'createNewTaskBlock'>;
type MainTaskBlocksProps = NativeStackScreenProps<RootStackParamList, 'Task Blocks'>;

export type SettingsNavProps = SettingsScreenProps['navigation'];
export type TaskBlockNavProps = TaskBlockScreenProps['navigation'];
export type TaskBlockRouteProps = TaskBlockScreenProps['route'];
export type MainTaskBlocksNavProps = MainTaskBlocksProps['navigation'];

/**
 * Screen Modes
 */
export interface ScreenElements {
  statusBar: ('light' | 'dark');
  colorScheme: ('light' | 'dark');
}

export interface ScreenModeProps {
  children: React.ReactElement;
  callback: (screenMode: ScreenElements) => void;
}

export interface Blocks {
  blocks: TaskBlock[];
}

export interface TaskBlockUpdate {
  title?: string;
  breaks?: boolean;
  autoplay?: boolean;
}

/**
 * Pill Button (Filled) Component
 */
export interface PillBtnColors {
  text: string;
  background: string;
  border: string;
}

export interface PillBtnFilledProps {
  label: string;
  size: 'sm' | 'md' | 'lg';
  colors: PillBtnColors;
  shadow?: boolean;
  action?: () => void;
  disabled?: boolean;
  bold?: boolean;
}

export type QuietProp = {
  isQuiet: boolean,
};

export type ScreenProp = {
  mode: 'light' | 'dark' | string,
};

type KeyboardOffset = {
  offset: number,
};

type FirstRun = {
  isFirstRun: boolean;
};

export interface UseSelectorProps {
  screenMode: ScreenProp;
  taskBlocks?: Blocks;
  quietMode?: QuietProp;
  keyboardOffset?: KeyboardOffset;
  currentBlock?: CurrentBlock;
  firstRun?: FirstRun;
}

/**
 * Now Playing Props
 */
export interface RefProps {
  [key: string]: any;
}

type UseRefProp = {
  current: any,
};

export type EditingTask = {
  isEdit: boolean,
  itemId: string,
};

export interface RenderItemProps {
  drag: () => void;
  item: Task;
  isActive: boolean;
  swipeRef: UseRefProp;
  setEnableScroll: (bool: boolean) => void;
  mode: 'light' | 'dark';
  id: string;
  closeSwipeBar?: () => void;
  setEditTask: (value: any) => void;
  editTask: EditingTask | undefined;
  isFirstRun: boolean;
  firstRunCallback: React.Dispatch<React.SetStateAction<number>>;
}

type Interpolate = {
  inputRange?: number[],
  outputRange?: number[],
  extrapolate?: string,
};

type SwipeAnimatedValue = {
  interpolate: ({ inputRange, outputRange, extrapolate }: Interpolate) => number;
};

export interface HiddenRowNowPlayingProps {
  id: string;
  item: Task;
  leftActionActivated?: boolean;
  leftActionState?: boolean;
  rightActionActivated?: boolean;
  rightActionState?: boolean;
  swipeAnimatedValue?: SwipeAnimatedValue;
  mode: 'light' | 'dark';
  closeRow: () => void;
  setEditTask: (value: any) => void;
  isFirstRun?: boolean;
  firstRunCallback: React.Dispatch<React.SetStateAction<number>>;
}

export type FirstRun = boolean;
