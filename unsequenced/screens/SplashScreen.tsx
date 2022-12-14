/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useFonts, Rubik_700Bold, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../redux/hooks';
import { populateBlocks } from '../redux/taskBlocks';
import { populateAllowBanners, populateAllowSounds } from '../redux/notificationPrefs';
import { populateScreenMode } from '../redux/screenMode';
import SplashLogo from '../components/SplashScreen/SplashLogo';
import { colors } from '../constants/GlobalStyles';

export default function SplashScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const [fontsLoaded] = useFonts({ Rubik_700Bold, Rubik_400Regular, Rubik_500Medium });
  const [fontsAreReady, setFontsAreReady] = useState<boolean>(false);
  const [localStateReady, setLocalStateReady] = useState<boolean>(false);
  const mountTime = useRef<number | undefined>(undefined);
  const firstRun = useRef<boolean>(true);

  // Methods to populate local state
  function setBlocks(blocks: string | null) {
    if (blocks) {
      dispatch(populateBlocks({ blocks: JSON.parse(blocks) }));
    }
  }

  function setAllowSounds(allowSounds: string | null) {
    if (allowSounds) {
      dispatch(populateAllowSounds({ preference: JSON.parse(allowSounds) }));
    }
  }
  function setAllowBanners(allowBanners: string | null) {
    if (allowBanners) {
      dispatch(populateAllowBanners({ preference: JSON.parse(allowBanners) }));
    }
  }

  function setScreenMode(modeString: string | null) {
    if (modeString) {
      dispatch(populateScreenMode({ mode: modeString }));
    }
  }

  if (fontsLoaded === true) {
    !fontsAreReady && setFontsAreReady(true);
  }

  // Logo Animation
  const logoOpacity = new Animated.Value(0);
  const logoPosition = new Animated.ValueXY({ x: 0.98, y: 0 });
  Animated.parallel([
    Animated.timing(logoOpacity, {
      toValue: 0.9,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(logoPosition, {
      toValue: { x: 1, y: -5 },
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
  ]).start();

  const navToMainScreen = () => navigation.replace('TaskBlocksNavigator');

  function closeAnimation() {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 90,
        easing: Easing.out(Easing.linear),
        useNativeDriver: true,
      }),
      Animated.timing(logoPosition, {
        toValue: { x: 0.98, y: 10 },
        duration: 100,
        easing: Easing.out(Easing.linear),
        useNativeDriver: true,
      }),
    ]).start(navToMainScreen);
  }

  // We get/store the time that the app has loaded
  // Then we grab the stored content if it's available
  useEffect(() => {
    if (mountTime.current === undefined) {
      mountTime.current = Date.now();
    }

    async function prepare() {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 4 && firstRun.current === true) {
        const blocks: string | null = await AsyncStorage.getItem('blocks');
        setBlocks(blocks);

        const allowSoundsString: string | null = await AsyncStorage.getItem('allowSounds');
        setAllowSounds(allowSoundsString);

        const allowBannersString: string | null = await AsyncStorage.getItem('allowBanners');
        setAllowBanners(allowBannersString);

        const screenModeString: string | null = await AsyncStorage.getItem('mode');
        setScreenMode(screenModeString);
        firstRun.current = false;
        setLocalStateReady(true);
      } else if (keys.length === 0) {
        firstRun.current = false;
        setLocalStateReady(true);
      }
    }
    prepare();
  }, []);

  // Side Effect to handle redirect to main screen
  // We wait till 2500ms has elapsed so we don't have a flashing splash screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (fontsAreReady === true && localStateReady === true) {
      const loadingDiff: number = 2500 - (Date.now() - mountTime!.current);
      if (loadingDiff > 0) {
        timer = setTimeout(closeAnimation, loadingDiff);
      } else {
        closeAnimation();
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [fontsAreReady, localStateReady]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoStyle,
          {
            opacity: logoOpacity,
            transform: [{
              scale: logoPosition.x,
            }],
          }]}
      >
        <Animated.View style={{ transform: [{ translateY: logoPosition.y }] }}>
          <SplashLogo />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  logoStyle: {
    width: '40%',
  },
});
