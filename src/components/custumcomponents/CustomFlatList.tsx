import React, { memo } from 'react';
import {
  FlatList,
  FlatListProps,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';

interface CustomFlatListProps<ItemT> extends FlatListProps<ItemT> {
  loading?: boolean;
  emptyMessage?: string;
  onItemPress?: (item: ItemT) => void;
}

function CustomFlatList<ItemT>({
  loading,
  emptyMessage = 'No Data Found',
  data,
  renderItem,
  onItemPress,
  ...rest
}: CustomFlatListProps<ItemT>) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const wrappedRenderItem = ({ item, index }: ListRenderItemInfo<ItemT>) => {
    if (!renderItem) return null;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => onItemPress?.(item)}>
        {renderItem({ item, index, separators: undefined as any })}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList<ItemT>
      data={data}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item: any, index) =>
        item?.id?.toString() || index.toString()
      }
      renderItem={wrappedRenderItem}
      ListEmptyComponent={() => (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
      {...rest}
    />
  );
}

export default memo(CustomFlatList) as typeof CustomFlatList;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
