import React from 'react';
import { StyleSheet, View } from 'react-native';

interface HeaderIconProps {
  children: React.ReactElement;
  color?: string;
}

function HeaderIcon({ children, color }:HeaderIconProps) {
  return (
    <View style={styles().container}>
      <View style={styles(color).iconWrapper}>
        {children}
      </View>
    </View>
  );
}

const styles = (color?:string) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    height: 70,
    width: 70,
    borderRadius: 35,
    marginTop: 20,
    marginBottom: 15,
    padding: 10,
    backgroundColor: color,
  },
});

export default HeaderIcon;
