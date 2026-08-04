import { colors } from '@utils/colors';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAction: (type: string) => void;
};

export default function DriverSheet({ visible, onClose, onAction }: Props) {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 200,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      onPress={onClose}
      activeOpacity={1}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Driver</Text>
          {/* <Text style={styles.headerSubtitle}>Onboard Driver</Text> */}
        </View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onAction('Onboard');
            onClose();
          }}
        >
          <Text style={styles.text}>Onboard Driver</Text>
        </TouchableOpacity>
        {/* Menu Items */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onAction('add');
            onClose();
          }}
        >
          <Text style={styles.text}>Add Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onAction('discontinue');
            onClose();
          }}
        >
          <Text style={styles.text}>Discontinue Driver</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 10,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 70,
  },

  headerCard: {
    backgroundColor: colors.background,
    marginHorizontal: 12,
    borderRadius: 10,
    padding: 12,
    // borderWidth: 2,
    // borderColor: colors.primary,
  },

  headerTitle: {
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },

  headerSubtitle: {
    color: '#000',
  },

  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: colors.background,
  },

  text: {
    fontSize: 15,
    color: '#000',
  },
});
