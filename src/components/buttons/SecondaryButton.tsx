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

  // Optional loading state
  loading?: boolean;

  // Optional icon
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export default function SecondaryButton({
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
      style={[
        styles.button,
        style,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>
                {icon}
              </View>
            )}

            <Text style={[styles.text, textStyle]}>
              {title}
            </Text>

            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>
                {icon}
              </View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: wp(86),
    height: hp(5.5),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  iconLeft: {
    marginRight: moderateScale(8),
  },

  iconRight: {
    marginLeft: moderateScale(8),
  },

  disabled: {
    backgroundColor: '#B0B0B0',
  },
});