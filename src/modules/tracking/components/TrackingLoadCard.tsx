import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from '@utils/colors';

interface TrackingLoadCardProps {
  item: any;
  onPress: (item: any) => void;
}

const TrackingLoadCard = ({
  item,
  onPress,
}: TrackingLoadCardProps) => {

    console.log('CARD ITEM:', item);
console.log('CARD LOAD ID:', item?.LoadId);

  const formatTime = (date?: string | null) => {
    if (!date) {
      return '--';
    }

    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date?: string | null) => {
    if (!date) {
      return '--';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(item)}>

      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.loadLabel}>
            LOAD ID
          </Text>

          <Text style={styles.loadId}>
            {item.LoadId?.slice(0, 8)}...
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            {item.CurrentStatus ||
              item.LoadStatus ||
              'UNKNOWN'}
          </Text>
        </View>
      </View>

      {/* Driver */}
      <View style={styles.driverSection}>
        <View style={styles.driverIcon}>
          <Text style={styles.driverIconText}>
            {item.DriverName?.charAt(0)?.toUpperCase() || 'D'}
          </Text>
        </View>

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>
            {item.DriverName || 'Driver not available'}
          </Text>

          <Text style={styles.vehicleNumber}>
            {item.VehicleNo || 'Vehicle not assigned'}
          </Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeContainer}>

        {/* Pickup */}
        <View style={styles.locationRow}>
          <View style={styles.pickupDot} />

          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>
              PICKUP
            </Text>

            <Text
              numberOfLines={1}
              style={styles.locationName}>
              {item.PickupPlaceName || '-'}
            </Text>

            <Text
              numberOfLines={2}
              style={styles.address}>
              {item.PickupFullAddress || '-'}
            </Text>
          </View>
        </View>

        {/* Line */}
        <View style={styles.routeLine} />

        {/* Delivery */}
        <View style={styles.locationRow}>
          <View style={styles.deliveryDot} />

          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>
              DELIVERY
            </Text>

            <Text
              numberOfLines={1}
              style={styles.locationName}>
              {item.DeliveryPlaceName || '-'}
            </Text>

            <Text
              numberOfLines={2}
              style={styles.address}>
              {item.DeliveryFullAddress || '-'}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>

        <View>
          <Text style={styles.footerLabel}>
            LOAD TIME
          </Text>

          <Text style={styles.footerValue}>
            {formatDate(item.LoadCreatedAt)}
          </Text>
        </View>

        <View style={styles.updatedContainer}>
          <Text style={styles.footerLabel}>
            LAST UPDATED
          </Text>

          <Text style={styles.footerValue}>
            {formatTime(item.LastUpdated)}
          </Text>
        </View>

        <View style={styles.viewTracking}>
          <Text style={styles.viewTrackingText}>
            Track →
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default TrackingLoadCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EAF0',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F4',
  },

  loadLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9299A5',
    letterSpacing: 0.5,
  },

  loadId: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },

  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  driverIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  driverIconText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },

  driverInfo: {
    marginLeft: 11,
  },

  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },

  vehicleNumber: {
    marginTop: 3,
    fontSize: 12,
    color: '#7B8494',
  },

  routeContainer: {
    marginTop: 18,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
    marginTop: 4,
  },

  deliveryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
    marginTop: 4,
  },

  locationContent: {
    flex: 1,
    marginLeft: 10,
  },

  locationLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9299A5',
    letterSpacing: 0.6,
  },

  locationName: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#252A34',
  },

  address: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    color: '#8A919D',
  },

  routeLine: {
    height: 20,
    width: 1,
    backgroundColor: '#D6D9DF',
    marginLeft: 4.5,
    marginVertical: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F4',
  },

  footerLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9AA1AD',
  },

  footerValue: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },

  updatedContainer: {
    marginLeft: 25,
  },

  viewTracking: {
    marginLeft: 'auto',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 7,
  },

  viewTrackingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});