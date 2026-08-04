import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarkerView } from '@rnmapbox/maps';
import { Driver } from './types';
import spacing from '@utils/spacing';
import { moderateScale } from '@utils/responsive';

const getColor = (status: string) => {
  switch (status) {
    case 'online':
      return '#2ecc71';
    case 'onTrip':
      return '#f39c12';
    default:
      return '#95a5a6';
  }
};

interface Props {
  driver: Driver;
  onPress: (d: Driver) => void;
}

const DriverMarker = ({ driver, onPress }: Props) => {
  return (
    <MarkerView coordinate={driver.coordinate}>
      <View
        style={[styles.marker, { backgroundColor: getColor(driver.status) }]}
      >
        <Text onPress={() => onPress(driver)}>🚗</Text>
      </View>
    </MarkerView>
  );
};

export default memo(DriverMarker);

const styles = StyleSheet.create({
  marker: {
    padding: spacing.sm,
    borderRadius: moderateScale(20),
  },
});
