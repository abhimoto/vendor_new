// TableHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonstyles from '@utils/commonstyles';
import spacing from '@utils/spacing';
import { Column } from './types';

type Props<T> = {
  columns: Column<T>[];
};

function TableHeader<T>({ columns }: Props<T>) {
  return (
    <View style={[commonstyles.row, styles.header]}>
      {columns.map(col => (
        <View
          key={String(col.key)}
          style={[
            styles.cell,
            col.flex && { flex: col.flex },
            col.minWidth && { minWidth: col.minWidth },
          ]}
        >
          <Text style={[commonstyles.semiBold]}>{col.title}</Text>
        </View>
      ))}
    </View>
  );
}

export default React.memo(TableHeader);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f5f5f5',
    paddingVertical: spacing.sm,
  },
  cell: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
});
