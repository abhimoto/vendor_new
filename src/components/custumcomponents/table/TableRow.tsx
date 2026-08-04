// TableRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import commonstyles from '@utils/commonstyles';
import spacing from '@utils/spacing';
import { Column } from './types';

type Props<T> = {
  item: T;
  columns: Column<T>[];
};

function TableRow<T>({ item, columns }: Props<T>) {
  return (
    <View style={[commonstyles.row, styles.row]}>
      {columns.map(col => (
        <View
          key={String(col.key)}
          style={[
            styles.cell,
            col.flex && { flex: col.flex },
            col.minWidth && { minWidth: col.minWidth },
          ]}
        >
          {col.render ? (
            col.render(item)
          ) : (
            <Text numberOfLines={1}>{String(item[col.key])}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

export default React.memo(TableRow);

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  cell: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
});
