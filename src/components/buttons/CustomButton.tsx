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

export default function CustomButton({
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
    width: wp(35),           // ~148px on 428px base width
    height: hp(5.5),         // ~50px on 926px base height
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  text: {
    color: colors.primary,
    fontSize: moderateScale(16)
  },

  disabled: {
    backgroundColor: '#F2F2F2',
    borderColor: '#D0D0D0',
  },
});