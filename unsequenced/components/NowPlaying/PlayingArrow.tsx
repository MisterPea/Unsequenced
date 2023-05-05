import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { colors } from '../../constants/GlobalStyles';

function Arrow() {
  const fadeInRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeInRef, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(fadeInRef, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeInRef]);

  return (
    <Animated.View style={{
      opacity: fadeInRef,
      margin: 0,
      padding: 0,
      justifyContent: 'flex-end',
      height: 10,
    }}
    >
      <Text
        style={{
          lineHeight: 13,
          alignSelf: 'flex-end',
          color: colors.title.light,
        }}
      >
        {' >'}
      </Text>
    </Animated.View>
  );
}

/**
 * This Component renders a series of arrows `>` at 1000ms intervals.
 * The animation of said arrows is handled by the Arrow component (above)
 * @returns {JSX}
 */
export default function PlayingArrow(): ReactElement {
  const intervalRef = useRef<NodeJS.Timer>();
  const [arrowsArray, setArrowsArray] = useState<number[]>([]);
  const arrowInt = useRef<number>(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (arrowInt.current < 5) {
        setArrowsArray((s) => [...s, arrowInt.current]);
      } if (arrowInt.current < 6) {
        // we have this count to give room for fade out
        arrowInt.current += 1;
      } else {
        setArrowsArray([]);
        arrowInt.current = 0;
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View
      style={{ flexDirection: 'row' }}
    >
      {arrowsArray.map((_, index) => (
        <Arrow key={`ar${index}`} />
      ))}
    </View>
  );
}
