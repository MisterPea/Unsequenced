import { Dimensions } from 'react-native';

const definitions = [
  'background', 'settingsGear',
  'title', 'subTitle',
  'cancelButton', 'confirmBtn',
  'confirmText', 'taskListItemBG',
  'taskListItemText', 'createNewTaskBtn',
  'createNewTaskText', 'backgroundOverlay',
  'bottomSheetBG', 'inputBG',
  'inputBorder', 'inputText',
  'placeholder', 'unselectOptionBorder',
  'unselectOptionFill', 'unselectOptionText',
  'selectedOptionBorder', 'selectedOptionFill',
  'selectedOptionText', 'blockName',
  'taskInputBG', 'taskInputBorder',
  'roundButtonBG', 'roundButtonBorder',
  'roundButtonIcon', 'roundCloseBtnBG',
  'roundCloseBtnIcon', 'barBackground',
  'barCompleteAmt', 'listItemBorder',
  'editOpenBG', 'editOpenInputBg',
  'editOpenCancelBtn', 'editOpenConfirmBG',
  'editOpenConfirmText',
];

const { fontScale } = Dimensions.get('window');
const fontAdj = Number(((1 - fontScale) + 1).toFixed(2));
// const fontAdj = 1;

export const colors: { [key: string]: any; } = {
  background: { light: 'rgb(242,234,216)', dark: 'hsl(214, 15%, 10%)' },
  progressBackground: { light: '#ece5d3', dark: 'hsl(214, 15%, 20%)' },
  progressBorder: { light: '#b7b1a1', dark: 'hsl(214, 15%, 30%)' },
  settingsGear: { light: 'rgb(0,0,0)', dark: 'rgb(191,191,191)' },
  title: { light: 'rgb(0,151,235)', dark: 'rgb(220,252,52)' },
  subTitle: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  cancelButton: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  confirmBtn: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  confirmText: { light: 'rgb(255,255,255)', dark: 'rgb(0,0,0)' },
  disabled: { light: '#666666', dark: '#9c9c9c' },

  // Task Blocks
  taskListItemBG: { light: 'rgb(255,255,255)', dark: 'rgb(0,0,0)' },
  taskListItemText: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  createNewTaskBtn: { light: 'rgb(63,150,93)', dark: 'hsl(187, 73%, 45%)' },
  createNewTaskText: { light: 'rgb(255,255,255)', dark: 'rgb(0,0,0)' },

  // Create New Task Block
  backgroundOverlay: { light: 'rgba(0,0,0,0.7)', dark: 'rgba(0,0,0,0.7)' },
  bottomSheetBG: { light: 'rgb(255,255,255)', dark: 'rgb(45,52,61)' },
  inputBG: { light: 'rgb(224,224,224)', dark: 'rgb(73,77,88)' },
  inputBorder: { light: 'rgb(112,112,112)', dark: 'rgb(73,77,88)' },
  inputText: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  placeholder: { light: 'rgba(0,0,0,0.5)', dark: 'rgba(255,255,255,0.5)' },
  unselectOptionBorder: { light: 'rgba(112,112,112,1)', dark: 'rgb(71,209,226)' },
  unselectOptionFill: { light: 'rgba(112,112,112,0)', dark: 'rgba(71,209,226,0)' },
  unselectOptionText: { light: 'rgb(112,112,112)', dark: 'rgb(255,255,255)' },
  selectedOptionBorder: { light: 'rgba(63,150,193,0)', dark: 'rgb(71,209,226,0)' },
  selectedOptionFill: { light: 'rgb(63,150,93)', dark: 'rgb(71,209,226)' },
  selectedOptionText: { light: 'rgb(255,255,255)', dark: 'rgb(0,0,0)' },
  tabFill: { light: '#cacaca', dark: '#404c59' },

  // Add Tasks
  blockName: { light: 'rgb(227,219,203)', dark: 'rgb(55,61,71)' },
  taskInputBG: { light: 'rgb(255,255,255)', dark: 'rgb(73,77,88)' },
  taskInputBorder: { light: 'rgb(112,112,112)', dark: 'rgb(112,112,112)' },
  iconCircle: { light: 'rgb(212,207,193)', dark: 'rgb(106,111,120)' },
  iconPencil: { light: 'rgb(0,0,0)', dark: 'rgb(179,181,185)' },

  // Play Tasks
  roundButtonBG: { light: 'rgb(255,255,255)', dark: 'rgba(0,0,0,0)' },
  roundButtonBorder: { light: 'rgba(255,255,255,0)', dark: 'rgb(255,255,255)' },
  roundButtonIcon: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  roundCloseBtnBG: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  roundCloseBtnIcon: { light: 'rgb(255,255,255)', dark: 'rgb(0,0,0)' },
  barBackground: { light: 'rgb(255,255,255)', dark: 'hsl(0, 0%, 25%)' },
  barCompleteAmt: { light: 'hsl(208, 76%, 52%)', dark: 'rgb(220,252,52)' },
  listItemBorder: { light: 'rgb(0,0,0)', dark: 'rgb(201,201,201)' },
  shadowColor: { light: 'rgba(0,0,0,1)', dark: 'rgba(0,0,0,0)' },
  playEditInputBG: { light: 'hsl(0, 0%, 96%)', dark: 'hsl(220, 11%, 20%)' },

  // Play Task
  editOpenBG: { light: 'rgb(249,247,241)', dark: 'rgb(255,255,255)' },
  editOpenInputBg: { light: 'rgb(227,219,203)', dark: 'rgb(227,228,230)' },
  editOpenCancelBtn: { light: 'rgb(0,0,0)', dark: 'rgb(0,0,0)' },
  editOpenConfirmBG: { light: 'rgb(255,255,255)', dark: 'rgb(255,255,255)' },
  editOpenConfirmText: { light: 'rgb(0,0,0)', dark: 'rgb(0,0,0)' },

  // Settings
  settingsTitle: { light: 'rgb(0,0,0)', dark: 'rgb(220,252,52)' },
  settingsTextMain: { light: 'rgb(0,0,0)', dark: 'rgb(255,255,255)' },
  settingsTextNote: { light: 'rgb(112,112,112)', dark: 'rgb(255,255,255)' },
  settingsCheck: { light: 'rgb(63,150,193)', dark: 'rgb(220,252,52)' },
  settingsLine: { light: 'rgb(213,213,204)', dark: 'rgb(73,73,70)' },
  settingsBoxes: { light: 'rgb(255,255,255)', dark: 'rgb(0,0,0)' },

  slideAddTask: { light: 'rgb(63,150,93)', dark: 'rgb(71,209,226)' },
  slideAddTaskText: { light: 'rgb(255,255,255)', dark: 'hsl(210, 13%, 20%)' },
  slideEditTask: { light: 'hsl(42, 20%, 80%)', dark: 'hsl(210, 13%, 20%)' },
  slideEditTaskText: { light: 'hsl(210, 13%, 20%)', dark: 'rgb(71,209,226)' },

};

interface FamilySize {
  fontSize: number;
  fontFamily?: string;
}

export const font: { [key: string]: FamilySize; } = {
  header: {
    fontSize: Math.ceil(26 * fontAdj),
    fontFamily: 'Rubik_700Bold',
  },
  subHead: {
    fontSize: Math.ceil(12 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  liTitle: {
    fontSize: Math.ceil(18 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  liSubTitle: {
    fontSize: Math.ceil(12 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  inputTitle: {
    fontSize: Math.ceil(12 * fontAdj),
    fontFamily: 'Rubik_500Medium',
  },
  input: {
    fontSize: Math.ceil(17 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  largeButton: {
    fontSize: Math.ceil(18 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  optionSelect: {
    fontSize: Math.ceil(15 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  cancelConfirm: {
    fontSize: Math.ceil(15 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  taskBlockAddTask: {
    fontSize: Math.ceil(18 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  settingsTitle: {
    fontSize: Math.ceil(16 * fontAdj),
    fontFamily: 'Rubik_500Medium',
  },
  settingsTextOne: {
    fontSize: Math.ceil(12 * fontAdj),
    fontFamily: 'Rubik_400Regular',
  },
  settingsTextTwo: {
    fontSize: Math.ceil(12 * fontAdj),
    fontFamily: 'Rubik_700Bold',
  },
  backButton: {
    fontSize: Math.ceil(40 * fontAdj),
  },
};