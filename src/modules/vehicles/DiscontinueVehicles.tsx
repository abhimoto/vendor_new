import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import React, {useMemo, useState, useCallback} from 'react';

import commonstyles from '@utils/commonstyles';

import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';

import {
  useGetunAssignedVehiclesQuery,
} from '@app/redux/query/queryApi';

import {useNavigation} from '@react-navigation/native';
import {HOME_ROUTES} from '@navigation/routes';

import {
  wp,
  hp,
  normalizeFont,
} from '@utils/responsive';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DiscontinueVehicles() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // ---------------- API ----------------

  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useGetunAssignedVehiclesQuery(undefined, {
    pollingInterval: 30000,
  });

  console.log(vehiclesData, 'vehicles data');

  // ---------------- VEHICLE DATA ----------------

  const vehicles = useMemo(() => {
    return vehiclesData?.data || [];
  }, [vehiclesData]);

  // ---------------- FILTER ----------------

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) {
      return vehicles;
    }

    const searchText = search.toLowerCase().trim();

    return vehicles.filter((item: any) => {
      return (
        item?.VehicleNo?.toLowerCase()?.includes(searchText) ||
        item?.VehicleId?.toLowerCase()?.includes(searchText) ||
        item?.VehicleType?.toLowerCase()?.includes(searchText) ||
        item?.BodyType?.toLowerCase()?.includes(searchText)
      );
    });
  }, [vehicles, search]);

  // ---------------- REFRESH ----------------

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetchVehicles();
    } catch (error) {
      console.log('Refresh Error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchVehicles]);

  // ---------------- RENDER ITEM ----------------

  const renderItem = ({item}: any) => {
    const status = item?.IsActive ? 'Active' : 'Inactive';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate(
            HOME_ROUTES.VEHICLEDISCONTINUELIST,
            {
              vehicle: item,
            },
          )
        }>

        <View style={styles.card}>

          {/* ---------------- TOP ROW ---------------- */}

          <View style={styles.topRow}>

            {/* LEFT SIDE */}

            <View style={styles.leftSection}>

              {/* VEHICLE NUMBER */}

              <View style={styles.row}>

                <Icon
                  name="truck-outline"
                  size={18}
                  color="#000"
                />

                <Text style={styles.vehicleNo}>
                  {item?.VehicleNo || 'N/A'}
                </Text>

              </View>

              {/* VEHICLE TYPE */}

              <Text style={styles.vehicleInfo}>
                Vehicle Type : {item?.VehicleType || 'N/A'}
              </Text>

              {/* BODY TYPE */}

              <Text style={styles.vehicleInfo}>
                Body Type : {item?.BodyType || 'N/A'}
              </Text>

            </View>

            {/* RIGHT SIDE */}

            <View style={styles.rightSection}>

              <View style={styles.row}>

                <Ionicons
                  name="cube-outline"
                  size={18}
                  color="#000"
                />

                <Text style={styles.license}>
                  {item?.LoadingCapacity || '0'} KG
                </Text>

              </View>

            </View>

          </View>

          {/* ---------------- DIVIDER ---------------- */}

          <View style={styles.divider} />

          {/* ---------------- BOTTOM ROW ---------------- */}

          <View style={styles.bottomRow}>

            <Text style={styles.expiry}>
              Vehicle ID : {item?.VehicleId || 'N/A'}
            </Text>

            {/* STATUS */}

            <View style={styles.statusWrapper}>

              <View style={styles.checkCircle}>

                <Text style={styles.checkText}>
                  {item?.IsVerified ? '✓' : '!'}
                </Text>

              </View>

              <View
                style={[
                  styles.statusButton,
                  !item?.IsActive && styles.inactiveStatus,
                ]}>

                <Text style={styles.statusText}>
                  {status}
                </Text>

              </View>

            </View>

          </View>

        </View>

      </TouchableOpacity>
    );
  };

  // ---------------- LOADING ----------------

  if (vehiclesLoading) {
    return (
      <View style={commonstyles.container}>

        <AppHeader title="Discontinue Vehicle From App" />

        <View style={styles.loaderContainer}>

          <ActivityIndicator
            size="large"
          />

        </View>

      </View>
    );
  }

  // ---------------- ERROR ----------------

  if (vehiclesError) {
    return (
      <View style={commonstyles.container}>

        <AppHeader title="Discontinue Vehicle From App" />

        <View style={styles.loaderContainer}>

          <Text>
            Something went wrong
          </Text>

        </View>

      </View>
    );
  }

  // ---------------- UI ----------------

  return (
    <View style={commonstyles.container}>

      <AppHeader title="Discontinue Vehicle From App" />

      <View style={styles.container}>

        {/* SEARCH */}

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search Vehicle"
          containerStyle={styles.searchInput}
        />

        {/* LIST */}

        <CustomFlatList
          data={filteredVehicles}
          renderItem={renderItem}
          keyExtractor={(item: any) =>
            item?.VehicleId?.toString()
          }
          emptyMessage="No vehicles found 🚚"
          contentContainerStyle={{
            paddingBottom: hp(3),
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(2),
    paddingTop: hp(1),
  },

  searchInput: {
    marginBottom: hp(1.5),
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ---------------- CARD ----------------

  card: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#D9D9D9',

    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),

    marginBottom: hp(1.5),

    borderRadius: 8,
  },

  // ---------------- TOP ROW ----------------

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  leftSection: {
    flex: 1,
  },

  rightSection: {
    marginLeft: wp(2),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleNo: {
    marginLeft: wp(2),

    fontSize: normalizeFont(15),
    fontWeight: '700',

    color: '#2D2D2D',
  },

  vehicleInfo: {
    marginTop: hp(0.6),

    marginLeft: wp(7),

    fontSize: normalizeFont(12),

    color: '#777',
  },

  license: {
    marginLeft: wp(2),

    fontSize: normalizeFont(14),
    fontWeight: '600',

    color: '#2D2D2D',
  },

  // ---------------- DIVIDER ----------------

  divider: {
    height: 1,

    backgroundColor: '#E5E5E5',

    marginVertical: hp(1.8),
  },

  // ---------------- BOTTOM ROW ----------------

  bottomRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  expiry: {
    flex: 1,

    fontSize: normalizeFont(10),

    color: '#A5A5A5',

    marginRight: wp(2),
  },

  // ---------------- STATUS ----------------

  statusWrapper: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  checkCircle: {
    width: wp(8),

    height: wp(8),

    borderRadius: wp(4),

    borderWidth: 2,

    borderColor: '#3F5C8A',

    backgroundColor: '#fff',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: -wp(2),

    zIndex: 10,

    elevation: 5,
  },

  checkText: {
    color: '#3F5C8A',

    fontSize: normalizeFont(14),

    fontWeight: '700',
  },

  statusButton: {
    backgroundColor: '#3F5C8A',

    minWidth: wp(28),

    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: hp(0.8),

    borderRadius: 3,

    paddingLeft: wp(5),

    paddingRight: wp(4),
  },

  inactiveStatus: {
    backgroundColor: '#999',
  },

  statusText: {
    color: '#fff',

    fontSize: normalizeFont(12),

    fontWeight: '700',
  },
});