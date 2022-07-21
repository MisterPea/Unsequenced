import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * React Navigator
 * Navigation Props
 */
 type RootStackParamList = {
  Settings: undefined,
  'Task Blocks': undefined,
  createNewTaskBlock:undefined
};
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
type TaskBlockScreenProps = NativeStackScreenProps<RootStackParamList, 'createNewTaskBlock'>;

export type SettingsNavProps = SettingsScreenProps['navigation'];
export type TaskBlockNavProps = TaskBlockScreenProps['navigation'];
export type TaskBlockRouteProps = TaskBlockScreenProps['route'];

/**
 * Screen Modes
 */
export interface ScreenElements {
  statusBar:('light'|'dark');
  colorScheme:('light'|'dark');
}

export interface ScreenModeProps {
  children: React.ReactElement;
  callback: (screenMode: ScreenElements) => void;
}

/**
 * Task Blocks
 */
export interface Task {
  id: string;
  title: string;
  amount: number;
  isBreak: boolean;
}

export interface TaskUpdate {
  title?: string;
  amount?: number;
  isBreak?: boolean;
}

export interface TaskBlock {
  id: string;
  title: string;
  breaks: boolean;
  autoplay: boolean;
  tasks: Task[];
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
}
