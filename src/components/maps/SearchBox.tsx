import React, { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { wp } from '@utils/responsive';

export default function SearchBox({ searchHook, onSelect }: any) {
  const [query, setQuery] = useState('');
  const { results, searchPlaces } = searchHook;

  return (
    <View
      style={{
        position: 'absolute',
        top: 50,
        width: wp(90),
        alignSelf: 'center',
      }}
    >
      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={t => {
          setQuery(t);
          searchPlaces(t);
        }}
        style={{ backgroundColor: '#fff', padding: 10 }}
      />

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text onPress={() => onSelect(item)}>{item.place_name}</Text>
        )}
      />
    </View>
  );
}
