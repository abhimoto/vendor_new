import { colors } from '@utils/colors';
import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  currentStep: number;
};

export default function ProgressBar({ currentStep }: Props) {
  const totalSteps = 2;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    marginVertical: 20,
  },

  track: {
    width: '100%',
    height: 6,
    backgroundColor: colors.stroke,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
});
