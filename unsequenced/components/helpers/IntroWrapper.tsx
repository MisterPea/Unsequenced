import { View, Text } from 'react-native';
import * as React from 'react';

export default function IntroWrapper({ children }) {
  return (
    <>

      <Text>XXXX</Text>
      <View style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        height: 1000,
        width: '100%',
        backgroundColor: '#00000050',
        zIndex: 1000,
      }}
      />
      {children}
    </>
  );
}
