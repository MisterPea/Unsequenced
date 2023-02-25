import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import haptic from './helpers/haptic';
import { setOnboarding } from '../redux/firstRun';
import { useAppDispatch } from '../redux/hooks';
import { font } from '../constants/GlobalStyles';

export default function IntroTwo({ introControl }: { introControl: React.Dispatch<React.SetStateAction<number>>; }) {
  const dispatch = useAppDispatch();

  function handleNext() {
    haptic.success();
    introControl(2);
  }

  function handleExit() {
    haptic.light();
    dispatch(setOnboarding({ isFirstRun: false }));
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.contentContainer}>
          <Text style={styles.bodyText}>
            This app is built upon the idea of
            <Text style={[styles.boldText]}> Task Blocks </Text>
            and
            <Text style={[styles.boldText]}> Tasks</Text>
            .
          </Text>
          <Text style={styles.bodyText}>
            <Text style={[styles.boldText]}>• Task Blocks </Text>
            are like recipes. They are the container for
            <Text style={[styles.boldText]}> Tasks</Text>
            .
          </Text>
          <Text style={styles.bodyText}>
            <Text style={[styles.boldText]}>• Tasks </Text>
            are like the ingredients for the recipe.
          </Text>
          <Text style={[styles.bodyText, styles.bodyTextLast]}>
            Now, let&apos;s see how we use them —we&apos;ll do this together!
          </Text>


          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={handleExit}
            >
              <Text style={styles.buttonSkip}>
                Exit
              </Text>
            </Pressable>
            <Pressable
              onPress={handleNext}
            >
              <Text style={styles.buttonStart}>
                Next
              </Text>
            </Pressable>
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
    padding: 20,
  },
  bodyText: {
    textAlign: 'left',
    fontSize: font.largeBodyIntro.fontSize,
    marginTop: 10,
    color: '#303030',
    lineHeight: 28,
    fontFamily: 'Rubik_400Regular',
  },
  bodyTextLast: {
    marginTop: 50,
  },
  bodyStart: {
    fontFamily: 'Rubik_500Medium',
  },
  bodySkip: {
    fontFamily: 'Rubik_500Medium',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    marginBottom: '10%',
    marginHorizontal: 20,

  },
  boldText: {
    fontFamily: 'Rubik_500Medium',
  },
});
