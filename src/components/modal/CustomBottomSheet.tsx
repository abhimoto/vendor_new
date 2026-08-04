import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@utils/colors';
import { wp, hp, moderateScale } from '@utils/responsive';

type ActionItem = {
  label: string;
  value: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onAction: (value: string) => void;
  title?: string;
  actions: ActionItem[];
};

export default function CustomBottomSheet({
  visible,
  onClose,
  onAction,
  title = 'Actions',
  actions,
}: Props) {
  const translateY = useRef(new Animated.Value(hp(40))).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : hp(40),
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.arrow}>⌄</Text>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {actions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => {
                onAction(item.value);
                onClose();
              }}
            >
              <Text style={styles.gridText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: wp(4),
    height:hp(28)
    // marginBottom: hp(2),
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.primary,
  },

  arrow: {
    fontSize: moderateScale(18),
    color: colors.primary,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridItem: {
    width: '30%',
    backgroundColor: '#EAEAEA',
    paddingVertical: hp(1.8),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginBottom: hp(1.5),
  },

  gridText: {
    fontSize: moderateScale(14),
    color: '#000',
  },
});
