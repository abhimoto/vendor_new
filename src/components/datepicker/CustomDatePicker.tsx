import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';

interface Props {
  label?: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

const CustomDatePicker = ({
  label,
  value,
  onChange,
  disabled = false,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleOpen = useCallback(() => {
    if (!disabled) setShow(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const handleChange = useCallback(
    (_: any, selectedDate?: Date) => {
      if (selectedDate) {
        onChange(selectedDate);
      }
      if (Platform.OS !== 'ios') {
        handleClose();
      }
    },
    [onChange, handleClose],
  );

  const formatDate = (date?: Date | null) => {
    if (!date) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input Box */}
      <TouchableOpacity
        style={[styles.input, disabled && styles.disabled]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.valueText : styles.placeholder}>
          {value ? formatDate(value) : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* Picker */}
      {show && (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.pickerBox}>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleChange}
              />

              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={handleClose} style={styles.doneBtn}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default memo(CustomDatePicker);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    marginBottom: spacing.xs,
    color: colors.primary,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  placeholder: {
    color: '#888',
  },

  disabled: {
    backgroundColor: '#F5F5F5',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  pickerBox: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  doneBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },

  doneText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
