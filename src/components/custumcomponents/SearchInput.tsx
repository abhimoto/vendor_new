import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function SearchInput({
  value,
  onChangeText,
  containerStyle,
  ...rest
}: SearchInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <MaterialIcons name="search" size={20} color="#9E9E9E" />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search Vehicle By Number"
        placeholderTextColor="#9E9E9E"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
});
