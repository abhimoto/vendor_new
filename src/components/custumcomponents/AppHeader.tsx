import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title: string;
  disableBack?: boolean;
  onBackPress?: () => void;
}

export default function AppHeader({
  title,
  disableBack = false,
  onBackPress,
}: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        disabled={disableBack}
        onPress={() => {
          if (onBackPress) {
            onBackPress();
          } else {
            navigation.goBack();
          }
        }}
      >
        <MaterialIcons
          name="arrow-back"
          size={20}
          color={disableBack ? '#999' : '#333'}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
  },
});
