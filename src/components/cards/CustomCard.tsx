import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
};

export default function CustomCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    // Shadow (Android)
    elevation: 3,
  },
});
