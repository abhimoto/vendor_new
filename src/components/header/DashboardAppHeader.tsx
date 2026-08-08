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
  isOnline: boolean;
  onToggle: (value: boolean) => void;
  driverName?: string;
  vehicleNumber?: string;
  profileImage?: string;
  onMenuPress?: () => void;
}

export default function DashboardAppHeader({
  isOnline,
  onToggle,
  driverName = 'Rohit Sharma',
  vehicleNumber = 'MH12JM2623',
  profileImage = 'https://i.pravatar.cc/150?img=12',
  onMenuPress,
}: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Menu */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onMenuPress}
          style={styles.menuButton}>
          <MaterialIcons
            name="menu"
            size={moderateScale(32)}
            color="#FFF"
          />
        </TouchableOpacity>

        {/* Toggle */}
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.toggleTrack}
            onPress={() => onToggle(!isOnline)}>
            <View
              style={[
                styles.thumb,
                isOnline && styles.thumbRight,
              ]}
            />
          </TouchableOpacity>

          <View style={styles.toggleLabels}>
            <Text
              style={[
                styles.toggleText,
                !isOnline && styles.activeToggleText,
              ]}>
              Off
            </Text>

            <Text
              style={[
                styles.toggleText,
                isOnline && styles.activeToggleText,
              ]}>
              On
            </Text>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.infoContainer}>
          <Text
            numberOfLines={1}
            style={styles.driverName}>
            {driverName}
          </Text>

          <Text
            numberOfLines={1}
            style={styles.vehicleNumber}>
            {vehicleNumber}
          </Text>
        </View>

        {/* Profile */}
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={{ uri: profileImage }}
            style={styles.avatar}
          />
        </TouchableOpacity>
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

    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
  },

  menuButton: {
    width: moderateScale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },

  toggleWrapper: {
    alignItems: 'center',
    marginLeft: wp(5),
  },

  toggleTrack: {
    width: wp(26),
    minWidth: moderateScale(95),
    height: moderateScale(22),
    backgroundColor: '#FFF',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    paddingHorizontal: 2,
  },

  thumb: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),

    backgroundColor: '#355C97',

    borderWidth: 3,
    borderColor: '#FFF',
  },

  thumbRight: {
    alignSelf: 'flex-end',
  },

  toggleLabels: {
    width: wp(26),
    minWidth: moderateScale(95),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.4),
    paddingHorizontal: moderateScale(2),
  },

  toggleText: {
    color: '#FFFFFF',
    fontSize: normalizeFont(14),
    opacity: 0.7,
    fontWeight: '500',
  },

  activeToggleText: {
    opacity: 1,
    fontWeight: '700',
  },

  infoContainer: {
    flex: 1,
    marginLeft: wp(10),
    marginRight: wp(3),
  },

  driverName: {
    color: '#FFF',
    fontSize: normalizeFont(14),
    fontWeight: '700',
  },

  vehicleNumber: {
    color: '#FFFFFF',
    fontSize: normalizeFont(14),
    marginTop: hp(0.2),
    opacity: 0.95,
    fontWeight: '500',
  },

  avatar: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),

    borderWidth: 2,
    borderColor: '#FFF',
  },
});