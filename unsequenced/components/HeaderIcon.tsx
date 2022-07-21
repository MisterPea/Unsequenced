import React from 'react';
import { StyleSheet, View } from 'react-native';

interface HeaderIconProps {
  children: React.ReactElement;
  color?: string;
  heightWidth?: number
}

function HeaderIcon({ children, color, heightWidth }:HeaderIconProps) {
  return (
    <View style={styles().container}>
      <View style={styles(color, heightWidth).iconWrapper}>
        {children}
      </View>
    </View>
  );
}

const styles = (color?:string, heightWidth?:number) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    height: heightWidth || 70,
    width: heightWidth || 70,
    borderRadius: (heightWidth && heightWidth / 2) || 35,
    padding: (heightWidth && heightWidth / 7) || 10,
    backgroundColor: color,
  },
});

export default HeaderIcon;
