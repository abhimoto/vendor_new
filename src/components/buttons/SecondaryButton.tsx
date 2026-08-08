import { colors } from '@utils/colors';
import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { wp, hp, moderateScale } from '@utils/responsive';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function SecondaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}: Props) {
  return (
    <Pressable
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: wp(86),           // ~368px on 428px base width
    height: hp(5.5),         // ~50px on 926px base height
    backgroundColor: colors.primary,
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  disabled: {
    backgroundColor: '#B0B0B0',
  },
});