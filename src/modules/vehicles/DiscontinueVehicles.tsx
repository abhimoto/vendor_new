import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
    RefreshControl,
} from 'react-native';
import React, { useMemo, useState ,  useCallback,} from 'react';

import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import { useGetunAssignedQuery } from '@app/redux/query/queryApi';
import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { HOME_ROUTES } from '@navigation/routes';

import {
  wp,
  hp,
  normalizeFont,
} from '@utils/responsive';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';

export default function DiscontinueVehicles() {
  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );
console.log(vendorid)
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
const [refreshing, setRefreshing] =
  useState(false);

  const {
    data: unAssignedData,
    isLoading,
    error,
    refetch,
  } = useGetunAssignedQuery(
    { vendorid },
    {
      skip: !vendorid,
    },
  );
useFocusEffect(
  useCallback(() => {
    if (vendorid) {
      refetch();
    }
  }, [vendorid]),
);
const onRefresh = useCallback(async () => {
  try {
    setRefreshing(true);

    await refetch();
  } catch (e) {
    console.log('Refresh Error:', e);
  } finally {
    setRefreshing(false);
  }
}, [refetch]);
  /* ---------------- FILTERED DATA ---------------- */

  const filteredVehicles = useMemo(() => {
    const vehicleList = unAssignedData?.data || [];

    if (!search.trim()) {
      return vehicleList;
    }

    return vehicleList.filter((item: any) => {
      const searchText = search.toLowerCase();

      return (
        item?.registration_no
          ?.toLowerCase()
          ?.includes(searchText) ||
        item?.full_name
          ?.toLowerCase()
          ?.includes(searchText) ||
        item?.contact_no
          ?.toLowerCase()
          ?.includes(searchText) ||
        item?.driver_id
          ?.toLowerCase()
          ?.includes(searchText)
      );
    });
  }, [unAssignedData, search]);

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate(
          HOME_ROUTES.VEHICLEDISCONTINUELIST,
          {
            vehicle: item,
          },
        )
      }
    >
      <View style={styles.card}>
        {/* ---------------- TOP ROW ---------------- */}

        <View style={styles.topRow}>
          {/* LEFT SIDE */}

          <View style={styles.leftSection}>
            <View style={styles.row}>
              <Icon
                name="truck-outline"
                size={18}
                color="#000"
              />

              <Text style={styles.vehicleNo}>
                {item?.registration_no}
              </Text>
            </View>

            <Text style={styles.phone}>
              {item?.contact_no}
            </Text>

            <Text style={styles.driverName}>
              {item?.full_name}
            </Text>
          </View>

          {/* RIGHT SIDE */}

          <View style={styles.rightSection}>
            <View style={styles.row}>
              <Ionicons
                name="card-outline"
                size={18}
                color="#000"
              />

              <Text style={styles.license}>
                {item?.driver_id}
              </Text>
            </View>
          </View>
        </View>

        {/* DIVIDER */}

        <View style={styles.divider} />

        {/* ---------------- BOTTOM ROW ---------------- */}

        <View style={styles.bottomRow}>
          <Text style={styles.expiry}>
            Vehicle ID : {item?.vehicleid}
          </Text>

          {/* STATUS */}

          <View style={styles.statusWrapper}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkText}>✓</Text>
            </View>

            <View style={styles.statusButton}>
              <Text style={styles.statusText}>
                {item?.Status || 'Active'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return (
      <View style={commonstyles.container}>
        <AppHeader title="Discontinue Vehicle From App" />

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <View style={commonstyles.container}>
        <AppHeader title="Discontinue Vehicle From App" />

        <View style={styles.loaderContainer}>
          <Text>Something went wrong</Text>
        </View>
      </View>
    );
  }

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
  keyExtractor={(item: any, index: number) =>
    item?.vehicleid?.toString() ||
    index.toString()
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

  /* ---------------- CARD ---------------- */

  card: {
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#D9D9D9',

    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),

    marginBottom: hp(1.5),
  },

  /* ---------------- TOP ROW ---------------- */

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

  phone: {
    marginTop: hp(0.4),
    marginLeft: wp(7),

    fontSize: normalizeFont(12),

    color: '#B0B0B0',
  },

  driverName: {
    marginTop: hp(0.5),
    marginLeft: wp(7),

    fontSize: normalizeFont(12),
    fontWeight: '600',

    color: '#2D2D2D',
  },

  license: {
    marginLeft: wp(2),

    fontSize: normalizeFont(14),
    fontWeight: '600',

    color: '#2D2D2D',
  },

  /* ---------------- DIVIDER ---------------- */

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',

    marginVertical: hp(1.8),
  },

  /* ---------------- BOTTOM ROW ---------------- */

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expiry: {
    fontSize: normalizeFont(12),
    color: '#A5A5A5',
  },

  /* ---------------- STATUS ---------------- */

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

  statusText: {
    color: '#fff',

    fontSize: normalizeFont(12),
    fontWeight: '700',
  },
});