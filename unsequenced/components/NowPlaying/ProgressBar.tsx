import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, font } from '../../constants/GlobalStyles';

type ProgressObject = {
  completed: number,
  total: number,
};

interface ProgressBarProps {
  mode: 'light' | 'dark' | string;
  progress: ProgressObject;
}

export default function ProgressBar({ mode, progress }: ProgressBarProps) {
  const progressBar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    updateBar(progress.completed);
  }, [progress]);

  function updateBar(amount: number) {
    Animated.timing(progressBar, {
      toValue: amount,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }

  const widthPercent = progressBar.interpolate({
    inputRange: [0, progress.total],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <>
      <View style={styles(mode).progressWrapper}>
        <View style={styles(mode).progressBar} />
        <Animated.View style={[styles(mode).completeAmt, { width: widthPercent }]} />
      </View>
      <View>
        <Text style={styles(mode).completeText}>{`${Math.floor(progress.completed)} of ${progress.total} minutes completed`}</Text>
      </View>
    </>
  );
}

const styles = (mode: 'light' | 'dark') => StyleSheet.create({
  progressWrapper: {
    marginHorizontal: 40,
  },
  completeAmt: {
    height: 4,
    backgroundColor: colors.barCompleteAmt[mode],
    top: -4,
  },
  progressBar: {
    height: 4,
    width: '100%',
    backgroundColor: colors.barBackground[mode],
  },
  completeText: {
    fontFamily: font.settingsTextOne.fontFamily,
    fontSize: font.settingsTextOne.fontSize,
    color: colors.settingsTextNote[mode],
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
});
