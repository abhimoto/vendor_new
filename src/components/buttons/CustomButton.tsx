import { colors } from '@utils/colors';
import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { wp, hp, moderateScale } from '@utils/responsive';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;

  // New props
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[styles.button, style, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}

            <Text style={[styles.text, textStyle]}>
              {title}
            </Text>

            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: wp(35),
    height: hp(5.5),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: colors.primary,
    fontSize: moderateScale(16),
  },

  iconLeft: {
    marginRight: moderateScale(8),
  },

  iconRight: {
    marginLeft: moderateScale(8),
  },

  disabled: {
    backgroundColor: '#F2F2F2',
    borderColor: '#D0D0D0',
  },
});