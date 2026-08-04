import React, { useCallback } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import commonstyles from '@utils/commonstyles';

type Props<T> = {
  columns: any;
  data: T[];
  keyExtractor: (item: T, index: number) => string;
};

export default function Custumtable<T>({
  columns,
  data,
  keyExtractor,
}: Props<T>) {
  const renderItem = useCallback(
    ({ item }: { item: T }) => <TableRow item={item} columns={columns} />,
    [columns],
  );
  
  return (
    <View style={[commonstyles.flex1]}>
      {/* Horizontal Scroll (for many columns) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: '100%' }}>
          {/* Header */}
          <TableHeader columns={columns} />

          {/* Body */}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
