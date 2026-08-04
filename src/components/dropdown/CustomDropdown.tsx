import { colors } from '@utils/colors';
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Option = {
  ifsc: string;
  label: string;
  value: string;
};

type Props = {
  label?: string;
  data: Option[];
  value?: string;
  placeholder?: string;
  onSelect: (item: Option) => void;
  searchable?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  style?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
};

export default function CustomDropdown({
  label,
  data,
  value,
  placeholder = 'Select option',
  onSelect,
  searchable = false,
  disabled = false,
  error = false,
  errorText,
  style,
  dropdownStyle,
  modalStyle,
  itemStyle,
  itemTextStyle,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item
  const selectedItem = useMemo(() => {
    if (!value) return undefined;

    const normalizedValue = value.toLowerCase().trim();

    return (
      data.find(item => item.value.toLowerCase().trim() === normalizedValue) ||
      data.find(item => item.label.toLowerCase().trim() === normalizedValue)
    );
  }, [data, value]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const handleSelect = useCallback(
    (item: Option) => {
      onSelect(item);
      setVisible(false);
      setSearchQuery('');
    },
    [onSelect],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    setSearchQuery('');
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Option }) => (
      <TouchableOpacity
        style={[styles.item, itemStyle]}
        onPress={() => handleSelect(item)}
      >
        <Text style={[styles.itemText, itemTextStyle]}>{item.label}</Text>

        {(item.value.toLowerCase().trim() === value?.toLowerCase().trim() ||
          item.label.toLowerCase().trim() === value?.toLowerCase().trim()) && (
          <MaterialIcons name="check" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    ),
    [handleSelect, value, itemStyle, itemTextStyle],
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Dropdown Button */}
      <TouchableOpacity
        style={[
          styles.dropdown,
          dropdownStyle,
          disabled && styles.dropdownDisabled,
          error && styles.dropdownError,
        ]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.text,
            !selectedItem && styles.placeholder,
            disabled && styles.textDisabled,
          ]}
          numberOfLines={1}
        >
          {selectedItem ? selectedItem.label : value ? value : placeholder}
        </Text>

        <MaterialIcons
          name={visible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={disabled ? '#ccc' : '#777'}
        />
      </TouchableOpacity>

      {error && errorText && <Text style={styles.errorText}>{errorText}</Text>}

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        {/* Overlay */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <SafeAreaView
          style={[styles.modalContainer, modalStyle]}
          edges={['bottom']}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label || 'Select option'}</Text>

            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#777" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          {searchable && (
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#ccc" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {/* List */}
          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No options available</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 2,
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  dropdownDisabled: {
    backgroundColor: '#f5f5f5',
  },
  dropdownError: {
    borderColor: '#ff3b30',
  },
  text: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholder: {
    color: '#2A2A2A',
    fontWeight:'600'
  },
  textDisabled: {
    color: '#aaa',
  },

  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    elevation: 5,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  listContent: {
    paddingVertical: 8,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#aaa',
  },
});
