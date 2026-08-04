import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
    RefreshControl,
} from 'react-native';

import React, { useCallback, useMemo, useState } from 'react';

import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';

import { HOME_ROUTES } from '@navigation/routes';

import {
  wp,
  hp,
  normalizeFont,
} from '@utils/responsive';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetunAssignedDriversQuery } from '@app/redux/query/queryApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';
import { useFocusEffect } from '@react-navigation/native';

/* ---------------- DUMMY DATA ---------------- */



export default function DriverDiscontinueList({
  navigation,
}: any) {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] =
  useState(false);

  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );

  /* ---------------- API ---------------- */

  const {
    data: unassignedDrivers,
    isLoading,
    error,
    refetch
  } = useGetunAssignedDriversQuery(
    { vendorid },
    {
      skip: !vendorid,
    },
  );

console.log(unassignedDrivers)

  /* ---------------- MERGE API + DUMMY DATA ---------------- */

 const allDrivers = useMemo(() => {
  return unassignedDrivers?.data || [];
}, [unassignedDrivers]);

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
  /* ---------------- FILTER DATA ---------------- */

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return allDrivers;
    }

    return allDrivers.filter((item: any) => {
      const searchText =
        search.toLowerCase();

      return (
        item?.full_name
          ?.toLowerCase()
          ?.includes(searchText) ||
        item?.contact_no?.includes(
          searchText,
        ) ||
        item?.driver_id
          ?.toLowerCase()
          ?.includes(searchText) ||
        item?.license_no
          ?.toLowerCase()
          ?.includes(searchText)
      );
    });
  }, [allDrivers, search]);

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate(
            HOME_ROUTES.DISCONTINUEDRIVER,
            { item },
          );
        }}
      >
        <View style={styles.card}>
          {/* ---------------- TOP ROW ---------------- */}

          <View style={styles.topRow}>
            {/* LEFT SIDE */}

            <View style={styles.leftSection}>
              <View style={styles.row}>
                <MaterialIcons
                  name="person-outline"
                  size={18}
                  color="#000"
                />

                <Text style={styles.name}>
                  {item?.full_name}
                </Text>
              </View>

              <Text style={styles.phone}>
                {item?.contact_no}
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
              License :{' '}
              {item?.driving_license_no || 'N/A'}
            </Text>

            {/* STATUS */}

            <View style={styles.statusWrapper}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkText}>
                  ✓
                </Text>
              </View>

              <View style={styles.statusButton}>
                <Text style={styles.statusText}>
                  {item?.Status ||
                    'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return (
      <View style={commonstyles.container}>
        <AppHeader title="Driver Discontinue List" />

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
        <AppHeader title="Driver Discontinue List" />

        <View style={styles.loaderContainer}>
          <Text>
            Something went wrong
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={commonstyles.container}>
      <AppHeader title="Driver Discontinue List" />

      <View style={styles.container}>
        {/* SEARCH */}

        <SearchInput
          placeholder="Search driver..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchInput}
        />

        {/* LIST */}

   <CustomFlatList
  data={filteredData}
  renderItem={renderItem}
  keyExtractor={(
    item: any,
    index: number,
  ) =>
    item?.driver_id?.toString() ||
    index.toString()
  }
  emptyMessage="No drivers found 🚚"
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

  name: {
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