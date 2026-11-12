import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import commonstyles from '@utils/commonstyles';

import AppHeader from '@components/custumcomponents/AppHeader';

import {
  wp,
  hp,
  moderateScale,
  normalizeFont,
} from '@utils/responsive';

import {colors} from '@utils/colors';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useTracking} from './hooks/useTracking';

export default function Tracking() {
    const route = useRoute<any>();
      console.log('========== TRACKING SCREEN ==========');
  console.log('ROUTE PARAMS:', route.params);
  /*
  
   * Get LoadId from previous screen
   */

   const loadId = route.params?.loadId;



  console.log(loadId,'loadid')

  const navigation = useNavigation<any>();

  const {
    timelineData,
    loadInfo,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTracking(loadId);

  console.log('LOAD INFO:', loadInfo);

  console.log(
    'TIMELINE DATA:',
    JSON.stringify(timelineData, null, 2),
  );

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (isLoading) {
    return (
      <View style={commonstyles.container}>
        <AppHeader title="Live Tracking" />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading tracking...
          </Text>
        </View>
      </View>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (isError) {
    return (
      <View style={commonstyles.container}>
        <AppHeader title="Live Tracking" />

        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={moderateScale(45)}
            color={colors.primary}
          />

          <Text style={styles.errorText}>
            Unable to load tracking history
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetch}>
            <Text style={styles.retryText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /*
   * ==========================================
   * NO DATA
   * ==========================================
   */

  if (!loadInfo) {
    return (
      <View style={commonstyles.container}>
        <AppHeader title="Live Tracking" />

        <View style={styles.center}>
          <Ionicons
            name="location-outline"
            size={moderateScale(45)}
            color="#999"
          />

          <Text style={styles.errorText}>
            No tracking information available
          </Text>
        </View>
      </View>
    );
  }

  /*
   * ==========================================
   * FORMAT CURRENT STATUS
   * ==========================================
   */

  const currentStatus =
    loadInfo.currentStatus
      ?.replace(/_/g, ' ')
      ?.toLowerCase()
      ?.replace(/\b\w/g, char =>
        char.toUpperCase(),
      ) || 'Unknown';

  /*
   * ==========================================
   * MAIN SCREEN
   * ==========================================
   */

  return (
    <View style={commonstyles.container}>
      <AppHeader title="Live Tracking" />

      <FlatList
        data={timelineData}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            {/* ==================================
                HEADER
            ================================== */}

            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.date}>
                  {loadInfo.date || '--'}
                </Text>

                <Text style={styles.driverName}>
                  {loadInfo.driverName || 'Driver'}
                </Text>
              </View>

              <View style={styles.rightHeader}>
                <Text style={styles.postId}>
                  Load ID
                </Text>

                <Text style={styles.loadId}>
                  {loadInfo.loadId
                    ? `${loadInfo.loadId.slice(0, 8)}...`
                    : '--'}
                </Text>
              </View>
            </View>

            {/* ==================================
                CURRENT STATUS
            ================================== */}

            <View style={styles.currentStatusCard}>
              <View style={styles.statusIcon}>
                <Ionicons
                  name="navigate"
                  size={moderateScale(20)}
                  color={colors.primary}
                />
              </View>

              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>
                  CURRENT STATUS
                </Text>

                <Text style={styles.statusValue}>
                  {currentStatus}
                </Text>
              </View>
            </View>

            {/* ==================================
                VEHICLE INFO
            ================================== */}

            <View style={styles.vehicleInfo}>
              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Vehicle
                </Text>

                <Text style={styles.vehicleValue}>
                  {loadInfo.vehicleNo || '--'}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Type
                </Text>

                <Text style={styles.vehicleValue}>
                  {loadInfo.vehicleType || '--'}
                </Text>
              </View>

              <View style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>
                  Weight
                </Text>

                <Text style={styles.vehicleValue}>
                  {loadInfo.weight != null
                    ? `${loadInfo.weight}`
                    : '--'}
                </Text>
              </View>
            </View>

            {/* ==================================
                ROUTE
            ================================== */}

            <View style={styles.routeCard}>
              <Text style={styles.sectionTitle}>
                Trip Route
              </Text>

              {/* PICKUP */}

              <View style={styles.locationRow}>
                <View style={styles.pickupIcon}>
                  <Ionicons
                    name="radio-button-on"
                    size={moderateScale(16)}
                    color="#16A34A"
                  />
                </View>

                <View style={styles.locationContent}>
                  <Text style={styles.locationLabel}>
                    PICKUP
                  </Text>

                  <Text style={styles.locationName}>
                    {loadInfo.pickupPlaceName || '--'}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={styles.address}>
                    {loadInfo.pickupAddress || '--'}
                  </Text>
                </View>
              </View>

              {/* LINE */}

              <View style={styles.routeLine} />

              {/* DELIVERY */}

              <View style={styles.locationRow}>
                <View style={styles.deliveryIcon}>
                  <Ionicons
                    name="location"
                    size={moderateScale(16)}
                    color="#DC2626"
                  />
                </View>

                <View style={styles.locationContent}>
                  <Text style={styles.locationLabel}>
                    DELIVERY
                  </Text>

                  <Text style={styles.locationName}>
                    {loadInfo.deliveryPlaceName || '--'}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={styles.address}>
                    {loadInfo.deliveryAddress || '--'}
                  </Text>
                </View>
              </View>
            </View>

            {/* ==================================
                LIVE LOCATION
            ================================== */}

            {loadInfo.lastLatitude != null &&
              loadInfo.lastLongitude != null && (
                <View style={styles.liveLocationCard}>
                  <View style={styles.liveLocationIcon}>
                    <Ionicons
                      name="location"
                      size={moderateScale(20)}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.liveLocationInfo}>
                    <Text style={styles.liveLabel}>
                      LAST KNOWN LOCATION
                    </Text>

                    <Text style={styles.coordinates}>
                      {loadInfo.lastLatitude},{' '}
                      {loadInfo.lastLongitude}
                    </Text>

                    {loadInfo.lastSpeed != null && (
                      <Text style={styles.speed}>
                        Speed: {loadInfo.lastSpeed} km/h
                      </Text>
                    )}
                  </View>
                </View>
              )}

            {/* ==================================
                TIMELINE TITLE
            ================================== */}

            <View style={styles.timelineHeader}>
              <Text style={styles.sectionTitle}>
                Tracking History
              </Text>

              <Text style={styles.eventCount}>
                {timelineData.length} Events
              </Text>
            </View>
          </>
        }
        renderItem={({item, index}) => (
          <View style={styles.row}>
            {/* ==================================
                LEFT TIMELINE
            ================================== */}

            <View style={styles.leftContainer}>
              {item.status === 'done' && (
                <Ionicons
                  name="checkmark-circle"
                  size={moderateScale(19)}
                  color={colors.primary}
                />
              )}

              {item.status === 'active' && (
                <Ionicons
                  name="radio-button-on"
                  size={moderateScale(19)}
                  color={colors.primary}
                />
              )}

              {item.status === 'pending' && (
                <Ionicons
                  name="ellipse-outline"
                  size={moderateScale(19)}
                  color="#DADADA"
                />
              )}

              {index !== timelineData.length - 1 && (
                <View
                  style={[
                    styles.verticalLine,

                    item.status === 'done' &&
                      styles.completedLine,
                  ]}
                />
              )}
            </View>

            {/* ==================================
                RIGHT CONTENT
            ================================== */}

            <View style={styles.content}>
              <Text
                style={[
                  styles.title,

                  item.status === 'done' &&
                    styles.doneText,

                  item.status === 'active' &&
                    styles.activeText,
                ]}>
                {item.title}
              </Text>

              {item.time ? (
                <Text style={styles.time}>
                  {item.time}
                </Text>
              ) : null}

              {item.remarks ? (
                <Text style={styles.remarks}>
                  {item.remarks}
                </Text>
              ) : null}

              {/* DISTANCE FROM PICKUP */}

              {item.distanceFromPickup != null && (
                <Text style={styles.distance}>
                  {item.distanceFromPickup} km from pickup
                </Text>
              )}

              {/* LOCATION */}

              {item.latitude != null &&
                item.longitude != null && (
                  <View style={styles.location}>
                    <Ionicons
                      name="location-outline"
                      size={moderateScale(12)}
                      color="#999"
                    />

                    <Text style={styles.locationText}>
                      {item.latitude},{' '}
                      {item.longitude}
                    </Text>
                  </View>
                )}

              {/* PACKAGES */}

              {item.packagesLoaded != null && (
                <Text style={styles.packages}>
                  Packages Loaded:{' '}
                  {item.packagesLoaded}
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyTimeline}>
            <Text style={styles.emptyText}>
              No tracking history available
            </Text>
          </View>
        }
      />
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: hp(3),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    marginVertical: hp(1.5),
  },

  headerLeft: {
    flex: 1,
  },

  date: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: colors.primary,
  },

  driverName: {
    fontSize: normalizeFont(13),
    color: '#555',
    marginTop: hp(0.5),
    fontWeight: '600',
  },

  rightHeader: {
    alignItems: 'flex-end',
  },

  postId: {
    fontSize: normalizeFont(11),
    color: '#777',
  },

  loadId: {
    fontSize: normalizeFont(13),
    color: colors.primary,
    fontWeight: '800',
    marginTop: hp(0.3),
  },

  currentStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    padding: wp(3),
    borderRadius: moderateScale(10),
    backgroundColor: '#EEF2FF',
  },

  statusIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  statusInfo: {
    marginLeft: wp(3),
  },

  statusLabel: {
    fontSize: normalizeFont(9),
    color: '#777',
    fontWeight: '600',
  },

  statusValue: {
    marginTop: hp(0.3),
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: colors.primary,
  },

  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    padding: wp(3),
    borderRadius: moderateScale(10),
    backgroundColor: '#F7F7F7',
  },

  vehicleItem: {
    flex: 1,
  },

  vehicleLabel: {
    fontSize: normalizeFont(10),
    color: '#888',
  },

  vehicleValue: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: '#333',
    marginTop: hp(0.4),
  },

  routeCard: {
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    padding: wp(3),
    borderRadius: moderateScale(10),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  sectionTitle: {
    fontSize: normalizeFont(15),
    fontWeight: '700',
    color: '#333',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp(1.5),
  },

  pickupIcon: {
    width: moderateScale(22),
    alignItems: 'center',
  },

  deliveryIcon: {
    width: moderateScale(22),
    alignItems: 'center',
  },

  locationContent: {
    flex: 1,
    marginLeft: wp(2),
  },

  locationLabel: {
    fontSize: normalizeFont(9),
    fontWeight: '700',
    color: '#999',
  },

  locationName: {
    marginTop: hp(0.2),
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: '#333',
  },

  address: {
    marginTop: hp(0.3),
    fontSize: normalizeFont(11),
    lineHeight: normalizeFont(16),
    color: '#888',
  },

  routeLine: {
    height: hp(2.5),
    width: 2,
    backgroundColor: '#DDD',
    marginLeft: moderateScale(10),
    marginTop: hp(0.3),
  },

  liveLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    padding: wp(3),
    borderRadius: moderateScale(10),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  liveLocationIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveLocationInfo: {
    marginLeft: wp(3),
    flex: 1,
  },

  liveLabel: {
    fontSize: normalizeFont(9),
    color: '#999',
    fontWeight: '700',
  },

  coordinates: {
    marginTop: hp(0.3),
    fontSize: normalizeFont(12),
    color: '#444',
    fontWeight: '600',
  },

  speed: {
    marginTop: hp(0.2),
    fontSize: normalizeFont(10),
    color: '#888',
  },

  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },

  eventCount: {
    fontSize: normalizeFont(10),
    color: '#999',
  },

  row: {
    flexDirection: 'row',
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    minHeight: hp(5),
  },

  leftContainer: {
    width: wp(10),
    alignItems: 'center',
  },

  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 2,
  },

  completedLine: {
    backgroundColor: colors.primary,
  },

  content: {
    flex: 1,
    paddingLeft: wp(2),
    paddingBottom: hp(0.5),
  },

  title: {
    fontSize: normalizeFont(14),
    color: '#999',
  },

  doneText: {
    color: '#555',
    fontWeight: '500',
  },

  activeText: {
    color: colors.primary,
    fontWeight: '700',
  },

  time: {
    fontSize: normalizeFont(11),
    color: '#777',
    marginTop: hp(0.3),
  },

  remarks: {
    fontSize: normalizeFont(11),
    color: '#999',
    marginTop: hp(0.3),
  },

  distance: {
    fontSize: normalizeFont(10),
    color: colors.primary,
    marginTop: hp(0.4),
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.4),
  },

  locationText: {
    marginLeft: 3,
    fontSize: normalizeFont(10),
    color: '#999',
  },

  packages: {
    fontSize: normalizeFont(10),
    color: '#777',
    marginTop: hp(0.4),
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
  },

  loadingText: {
    marginTop: hp(1),
    fontSize: normalizeFont(13),
    color: '#777',
  },

  errorText: {
    marginTop: hp(1),
    fontSize: normalizeFont(14),
    color: '#777',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: hp(2),
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    borderRadius: moderateScale(7),
    backgroundColor: colors.primary,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: normalizeFont(12),
    fontWeight: '600',
  },

  emptyTimeline: {
    paddingVertical: hp(3),
    alignItems: 'center',
  },

  emptyText: {
    fontSize: normalizeFont(13),
    color: '#999',
  },
});

