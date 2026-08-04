import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, wp, hp, normalizeFont } from '@utils/responsive';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import { colors } from '@utils/colors';
import { useGetexpiryAlertsQuery } from '@app/redux/query/queryApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';

// ===== TYPES =====
interface ExpiryAlertItem {
  vehicleid: string;
  vendorid: string;
  registration_no: string;
  expiry_type: string;
  expiry_date: string;
  days_left: number;
  status: 'EXPIRED' | 'ACTIVE';
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB');
};

export default function VehicleExpiry() {
  const [search, setSearch] = useState('');

  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );

  // ===== API =====
  const {
    data: expiryData,
    isLoading,
    isError,
  } = useGetexpiryAlertsQuery(
    {
      vendorid: vendorid || '',
    },
    {
      skip: !vendorid,
    },
  );

  // ===== FILTER + SORT =====
  const filteredVehicles = useMemo(() => {
    if (!expiryData?.data) return [];

    return expiryData.data
      .filter((item: ExpiryAlertItem) =>
        item.registration_no
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
      .sort(
        (a: ExpiryAlertItem, b: ExpiryAlertItem) =>
          a.days_left - b.days_left,
      );
  }, [expiryData, search]);

  // ===== RENDER ITEM =====
  const renderItem = ({ item }: { item: ExpiryAlertItem }) => {
    const expired = item.status === 'EXPIRED';

    return (
      <View
        style={[
          styles.card,
          expired && {
            borderColor: 'red',
            borderWidth: 1,
          },
        ]}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <Ionicons name="car-outline" size={18} color="#000" />

          <Text style={styles.vehicleNo}>
            {item.registration_no}
          </Text>

          {/* Badge */}
          <View
            style={[
              styles.badge,
              {
                backgroundColor: expired
                  ? '#FFCDD2'
                  : '#E3F2FD',
              },
            ]}
          >
            <Text
              style={{
                color: expired ? 'red' : '#0D47A1',
                fontSize: 11,
                fontWeight: '600',
              }}
            >
              {expired
                ? 'Expired'
                : `${item.days_left} days left`}
            </Text>
          </View>
        </View>

        {/* Expiry Type */}
        <Text style={styles.expiryType}>
          {item.expiry_type.replace(/_/g, ' ')}
        </Text>

        {/* Expiry Date */}
        <Text
          style={[
            styles.expiryText,
            expired && styles.expiredText,
          ]}
        >
          Expiry Date : {formatDate(item.expiry_date)}
        </Text>
      </View>
    );
  };

  return (
    <View style={commonstyles.container}>
      <AppHeader title="Vehicle Expiry" />

      <SearchInput
        value={search}
        onChangeText={setSearch}
      />

      <CustomFlatList
        data={filteredVehicles}
        renderItem={renderItem}
        loading={isLoading}
        emptyMessage={
          isError
            ? 'Failed to load expiry alerts'
            : 'No expiry alerts found 🚚'
        }
        contentContainerStyle={{
          padding: wp(4),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: moderateScale(10),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.border,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  vehicleNo: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#000',
    marginLeft: wp(2),
  },

  badge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  expiryType: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
    color: colors.primary,
    marginBottom: hp(0.8),
  },

  expiryText: {
    fontSize: normalizeFont(12),
    color: '#666',
  },

  expiredText: {
    color: 'red',
    fontWeight: '600',
  },
});