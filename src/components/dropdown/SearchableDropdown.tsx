// SearchableDropdown.tsx
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
  TextStyle,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface DropdownItem {
  label: string;
  value: string | number;
}

interface SearchableDropdownProps {
  data: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  defaultValue?: DropdownItem;
  value?: DropdownItem | null;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  itemStyle?: TextStyle;
  selectedItemStyle?: TextStyle;
  maxHeight?: number;
  closeOnSelect?: boolean;
  clearOnSearch?: boolean;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
}

export interface SearchableDropdownRef {
  clearInput: () => void;
}

const SearchableDropdown = forwardRef<SearchableDropdownRef, SearchableDropdownProps>(({
  data,
  onSelect,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  defaultValue,
  value,
  containerStyle,
  inputStyle,
  dropdownStyle,
  itemStyle,
  selectedItemStyle,
  maxHeight = 250,
  closeOnSelect = true,
  clearOnSearch = false,
  disabled = false,
  error,
  loading = false,
}, ref) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(defaultValue || value || undefined);
  const [inputPosition, setInputPosition] = useState({ y: 0, height: 0 });
  const inputRef = useRef<View>(null);
  const searchInputRef = useRef<TextInput>(null);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    clearInput: () => {
      setSearchText('');
      setSelectedItem(undefined);
    },
  }));

  useEffect(() => {
    if (value) {
      setSelectedItem(value);
    } else if (value === null) {
      setSelectedItem(undefined);
      setSearchText('');
    }
  }, [value]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedItem(defaultValue);
    }
  }, [defaultValue]);

  const filteredData = searchText.trim() === ''
    ? data
    : data.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    onSelect(item);
    if (closeOnSelect) {
      setVisible(false);
      setSearchText('');
    }
  };

  const handleOpen = () => {
    if (disabled || loading) return;

    // Measure input position
    if (inputRef.current) {
      inputRef.current.measure((x, y, width, height, pageX, pageY) => {
        setInputPosition({ y: pageY, height });
      });
    }
    setVisible(true);

    // Focus search input after modal opens
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setVisible(false);
    setSearchText('');
  };

  const renderItem = ({ item }: { item: DropdownItem }) => {
    const isSelected = selectedItem?.value === item.value;
    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && styles.selectedItem,
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.itemText,
            itemStyle,
            isSelected && (selectedItemStyle || styles.selectedItemText),
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };
  const dropdownTop = inputPosition.y + inputPosition.height;

  return (
    <>
      <View ref={inputRef} style={[styles.container, containerStyle]}>
        <TouchableOpacity
          onPress={handleOpen}
          activeOpacity={0.7}
          disabled={disabled || loading}
        >
          <View pointerEvents="none">
            <View style={[styles.inputWrapper, disabled && styles.disabledInput, error && styles.errorInput]}>
              <TextInput
                style={[
                  styles.input,
                  inputStyle,
                  disabled && styles.disabledInputText,
                ]}
                placeholder={placeholder}
                value={selectedItem?.label || ''}
                editable={false}
                pointerEvents="none"
              />
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#999"
                  style={styles.loaderIcon}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  dropdownStyle,
                  {
                    top: dropdownTop,
                    maxHeight,
                  },
                ]}
              >
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputWrapper}>
                    <Icon name="search" size={18} color="#999" style={styles.searchIcon} />
                    <TextInput
                      ref={searchInputRef}
                      style={styles.searchInput}
                      placeholder={searchPlaceholder}
                      placeholderTextColor="#999"
                      value={searchText}
                      onChangeText={setSearchText}
                      clearButtonMode="while-editing"
                    />
                  </View>
                </View>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3F5C8A" />
                    <Text style={styles.loadingText}>Loading items...</Text>
                  </View>
                ) : filteredData.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No items found</Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.value)}
                    showsVerticalScrollIndicator
                    keyboardShouldPersistTaps="handled"
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    ListFooterComponent={<View style={{ height: 8 }} />}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
});

SearchableDropdown.displayName = 'SearchableDropdown';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#000',
  },
  loaderIcon: {
    marginLeft: 8,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  disabledInputText: {
    color: '#999',
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    paddingHorizontal: 0,
    color: '#000',
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  selectedItemText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

  searchIcon: {
    marginRight: 8,
  },


});

export default SearchableDropdown;