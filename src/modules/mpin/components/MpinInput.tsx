import React, {useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

interface MpinInputProps {
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
}

const MPIN_LENGTH = 6;

const MpinInput = ({
  value,
  onChangeText,
  secureTextEntry = false,
}: MpinInputProps) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      const newValue =
        value.slice(0, index) +
        numericValue.slice(-1) +
        value.slice(index + 1);

      onChangeText(newValue.slice(0, MPIN_LENGTH));

      if (index < MPIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      return;
    }

    const newValue =
      value.slice(0, index) +
      numericValue +
      value.slice(index + 1);

    onChangeText(newValue.slice(0, MPIN_LENGTH));

    if (numericValue && index < MPIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: any,
    index: number,
  ) => {
    if (
      event.nativeEvent.key === 'Backspace' &&
      !value[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({length: MPIN_LENGTH}).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref;
          }}
          value={value[index] || ''}
          onChangeText={text =>
            handleChange(text, index)
          }
          onKeyPress={event =>
            handleKeyPress(event, index)
          }
          keyboardType="number-pad"
          maxLength={1}
          secureTextEntry={secureTextEntry}
          textAlign="center"
          selectTextOnFocus
          style={styles.input}
        />
      ))}
    </View>
  );
};

export default MpinInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },

  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#2F5F9F',
    borderRadius: 6,
    fontSize: 15,
    color: '#222',
    padding: 0,
  },
});