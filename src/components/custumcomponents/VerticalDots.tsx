import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function VerticalDots() {
  const dots = new Array(8).fill(0);

  return (
    <View style={styles.container}>
      {dots.map((_, index) => (
        <View key={index} style={styles.dot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 19,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#CFCFCF',
  },
});
