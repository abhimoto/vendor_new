import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import spacing from '@utils/spacing';
import { moderateScale } from '@utils/responsive';
import { colors } from '@utils/colors';
import { Image } from 'react-native';
type Props = {
  title?: string;
  notificationCount?: number;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
};

export default function DashboardAppheader({
  title = 'Tracking',
  notificationCount = 3,
  onMenuPress,
  onNotificationPress,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onMenuPress}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onNotificationPress} style={styles.bell}>
            <MaterialIcons name="notifications-none" size={26} color="#fff" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Title Section */}
        {/* <View style={styles.titleContainer}>
          <Image
            source={require('@assets/icons/tracking.png')}
            style={{ width: 49, height: 74, tintColor: '#ffffff' }}
            resizeMode="contain"
          />

          <Text style={styles.title}>{title}</Text>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safeArea: {
  backgroundColor: '#fff',
},

header: {
  width: 396,
  height: 103,
  backgroundColor: colors.primary,
  borderRadius: 20,
  paddingHorizontal: 20,
  paddingTop: 16,
  alignSelf: 'center', // ✅ Center horizontally
},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bell: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: colors.background,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },
  titleContainer: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: colors.background,
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
});
