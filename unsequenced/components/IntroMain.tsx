import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import haptic from './helpers/haptic';
import { setOnboarding } from '../redux/firstRun';
import { useAppDispatch } from '../redux/hooks';

export default function IntroMain({ introControl }: { introControl: React.Dispatch<React.SetStateAction<number>>; }) {
  const dispatch = useAppDispatch();

  function handleStart() {
    haptic.success();
    introControl(1);
  }

  function handleSkip() {
    haptic.light();
    dispatch(setOnboarding({ isFirstRun: false }));
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.contentContainer}>
          <Text style={styles.headingMain}>Let&apos;s get started!</Text>
          <Text style={styles.bodyText}>
            Tap
            <Text style={styles.bodyStart}>
              {' '}
              Start
              {' '}
            </Text>
            to learn how to use the app, or
            <Text style={styles.bodySkip}>
              {' '}
              Skip
              {' '}
            </Text>
            to jump right in and start exploring.
          </Text>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={handleSkip}
            >
              <Text style={styles.buttonSkip}>
                Skip
              </Text>
            </Pressable>
            <Pressable
              onPress={handleStart}
            >
              <Text style={styles.buttonStart}>
                Start
              </Text>
            </Pressable>
          </View>
          <View style={styles.asideTextWrapper}>
            <Text>
              If you wish to skip right now, or if you ever need a refresher,
              you can launch this run-through from the
              <Text style={styles.boldAside}> Settings </Text>
              Screen.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(242,234,216,0.9)',
    zIndex: 1000,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 18,
  },
  contentContainer: {
    justifyContent: 'center',
    // marginBottom: 20,
    backgroundColor: '#ffffff98',
    borderRadius: 10,
    padding: 30,
  },
  headingMain: {
    fontSize: 28,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: 'Rubik_400Regular',
  },
  bodyText: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: 10,
    color: '#303030',
    lineHeight: 28,
    fontFamily: 'Rubik_400Regular',
  },
  bodyStart: {
    fontFamily: 'Rubik_500Medium',
  },
  bodySkip: {
    fontFamily: 'Rubik_500Medium',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  buttonSkip: {
    fontSize: 25,
    fontFamily: 'Rubik_400Regular',
    borderColor: '#00000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    color: '#404040',
    marginRight: 10,
  },
  buttonStart: {
    fontSize: 25,
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontFamily: 'Rubik_400Regular',
    color: '#202020',
    marginLeft: 10,
  },
  asideTextWrapper: {
    marginTop: 50,
    marginHorizontal: 20,

  },
  boldAside: {
    fontFamily: 'Rubik_500Medium',
  },
});
