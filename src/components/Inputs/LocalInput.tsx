import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Animated,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { colors } from '@utils/colors';
import spacing from '@utils/spacing';

interface LocalInputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export default function LocalInput({
  label,
  value,
  error,
  errorMessage,
  labelStyle: customLabelStyle,
  inputStyle,
  multiline,
  ...props
}: LocalInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : '#E0E0E0';

  const labelColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : '#2A2A2A';

  const animatedLabelStyle = {
    position: 'absolute' as const,
    left: spacing.md,
    zIndex: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 6,

    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),

    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 11],
    }),

    fontWeight: '600',
    color: labelColor,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { borderColor },
          multiline && styles.multilineContainer, // ✅ important
        ]}
      >
        {label && (
          <Animated.Text
            style={[animatedLabelStyle, customLabelStyle]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}

        <TextInput
          {...props}
          value={value}
          multiline={multiline}
          style={[
            styles.input,
            multiline && styles.multilineInput, // ✅ important
            inputStyle,
          ]}
          placeholder={!isFocused ? props.placeholder : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>

      {error && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  inputContainer: {
    borderWidth: 1,
    borderRadius: spacing.sm,
    height: 56, // ✅ default unchanged
    paddingHorizontal: spacing.md,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'visible',
  },

  multilineContainer: {
    height: 120,        // ✅ only for multiline
    justifyContent: 'flex-start',
    paddingTop: 16,
  },

  input: {
    fontWeight: '600',
    padding: 0,
    margin: 0,
    zIndex: 1,
  },

  multilineInput: {
    minHeight: 100,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});