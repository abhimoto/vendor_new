import { colors } from '@utils/colors';
import commonstyles from '@utils/commonstyles';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

const CustomRadioButton: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <Pressable
      style={[styles.container, commonstyles.rowCenter, commonstyles.m8]}
      onPress={onPress}
    >
      {/* Outer Circle */}
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CustomRadioButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});
