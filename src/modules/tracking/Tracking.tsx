import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import { wp, hp, moderateScale, normalizeFont } from '@utils/responsive';
import { colors } from '@utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const trackingData = [
  { id: 1, title: 'Post', time: '09:00 AM', status: 'done' },
  { id: 2, title: 'Booking', time: '09:15 AM', status: 'done' },
  { id: 3, title: 'Reporting', time: '09:45 AM', status: 'done' },
  { id: 4, title: 'Loading', time: '10:15 AM', status: 'done' },
  { id: 5, title: 'Payment', time: '10:30 AM', status: 'done' },
  { id: 6, title: 'Departed (200, 300 m)', time: '11:00 AM', status: 'active' },
  { id: 7, title: 'Location', time: '11:30 AM', status: 'pending' },
  { id: 8, title: 'Reporting', time: '12:00 PM', status: 'pending' },
  { id: 9, title: 'Unloading', time: '12:30 PM', status: 'pending' },
  { id: 10, title: 'Delivered', time: '01:00 PM', status: 'pending' },
  { id: 11, title: 'POD', time: '01:15 PM', status: 'pending' },
];

export default function Tracking() {
  return (
    <View style={commonstyles.container}>
      <AppHeader title="Live Tracking" />

      {/* Header Info */}
      <View style={styles.headerRow}>
        <Text style={styles.date}>05/03/2026</Text>
        <Text style={styles.postId}>Post Id 262623</Text>
      </View>

      {/* Timeline */}
      <FlatList
        data={trackingData}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: wp(4) }}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            {/* LEFT LINE + DOT */}
            <View style={styles.leftContainer}>
              {/* ICON */}
              {item.status === 'done' && (
                <Ionicons
                  name="checkmark-circle"
                  size={moderateScale(16)}
                  color={colors.primary}
                />
              )}

              {item.status === 'active' && (
                <Ionicons
                  name="radio-button-on"
                  size={moderateScale(16)}
                  color={colors.primary}
                />
              )}

              {item.status === 'pending' && (
                <Ionicons
                  name="ellipse-outline"
                  size={moderateScale(16)}
                  color="#DADADA"
                />
              )}

              {/* LINE */}
              {index !== trackingData.length - 1 && (
                <View style={styles.verticalLine} />
              )}
            </View>

            {/* RIGHT CONTENT */}
            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  item.status === 'active' && styles.activeText,
                ]}
              >
                {item.title}
              </Text>

              {item.time && <Text style={styles.time}>{item.time}</Text>}
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    marginVertical: hp(1.5),
  },

  date: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: colors.primary,
  },

  postId: {
    fontSize: normalizeFont(13),
    color: colors.primary,
    fontWeight: '800',
  },

  row: {
    flexDirection: 'row',
    marginBottom: hp(2),
  },

  leftContainer: {
    width: wp(10),
    alignItems: 'center',
  },

  circle: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: 50,
    backgroundColor: '#DADADA',
  },

  doneCircle: {
    backgroundColor: colors.primary,
  },

  activeCircle: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },

  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 2,
  },

  content: {
    flex: 1,
    paddingLeft: wp(2),
  },

  title: {
    fontSize: normalizeFont(14),
    color: '#999',
  },

  activeText: {
    color: colors.primary,
    fontWeight: '600',
  },

  time: {
    fontSize: normalizeFont(12),
    color: '#777',
    marginTop: 2,
  },
});
