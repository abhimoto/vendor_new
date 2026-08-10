import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  hp,
  wp,
  moderateScale,
  normalizeFont,
} from '@utils/responsive';

interface Props {
  driverName?: string;
  driverId?: string;
  profileImage?: string;
  onMenuPress?: () => void;
}

export default function DashboardAppHeader({
  driverName = 'Rohit Sharma',
  driverId = '268823',
  profileImage = 'https://i.pravatar.cc/150?img=12',
  onMenuPress,
}: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left section */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
            activeOpacity={0.8}>
            <MaterialIcons
              name="menu"
              size={moderateScale(28)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.trackingIcon}>
            <MaterialIcons
              name="place"
              size={moderateScale(14)}
              color="#FFFFFF"
            />
            <View style={styles.dottedLine} />
            <MaterialIcons
              name="inventory-2"
              size={moderateScale(14)}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>Tracking</Text>
        </View>

        {/* Right section */}
        <View style={styles.rightSection}>
          <View style={styles.infoContainer}>
            <Text numberOfLines={1} style={styles.driverName}>
              {driverName}
            </Text>
            <Text numberOfLines={1} style={styles.driverId}>
              id {driverId}
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#355C97',
  },

  container: {
    backgroundColor: '#355C97',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuButton: {
    width: moderateScale(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },

  trackingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2.5),
  },

  dottedLine: {
    width: 1,
    height: moderateScale(14),
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#FFFFFF',
    marginVertical: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: normalizeFont(18),
    fontWeight: '700',
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
  },

  infoContainer: {
    alignItems: 'flex-end',
    marginRight: wp(3),
    maxWidth: wp(35),
  },

  driverName: {
    color: '#FFFFFF',
    fontSize: normalizeFont(15),
    fontWeight: '700',
  },

  driverId: {
    color: '#FFFFFF',
    fontSize: normalizeFont(14),
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.95,
  },

  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: '#E5C39A',
  },
});