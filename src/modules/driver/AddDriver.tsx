import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import { wp, hp, moderateScale } from '@utils/responsive';
import { colors } from '@utils/colors';
import { useNavigation } from '@react-navigation/native';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetdriverdetailsMutation } from '@app/redux/query/queryApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';

export default function AddDriver() {
  const vendorId = useSelector((state: RootState) => state.auth.user?.id);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [getDriverDetails, { isLoading }] =
    useGetdriverdetailsMutation();
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setError(null);

      const response = await getDriverDetails({
        vendorid: vendorId,
      }).unwrap();

      const apiData = response?.data || [];

      const formatted = apiData.map((item: any, index: number) => {

        const driver = item?.DriverDetails;

        return {
          id: item?.driver_id ?? index.toString(),
          name: driver?.full_name ?? 'N/A',
          phone: driver?.contact_no ?? 'N/A',
          license: driver?.driving_license_no ?? 'N/A',
          expiryDate: driver?.insert_date
            ? new Date(driver.insert_date).toLocaleDateString('en-GB')
            : 'N/A',
          status: driver?.status ?? 'inactive',
        };
      });

      setDrivers(formatted);
    } catch (err) {
      console.log('Fetch error:', err);
      setError('Failed to load drivers');
    }
  };

  // ✅ Search filtering (optimized)
  const filteredDrivers = useMemo(() => {
    if (!search) return drivers;

    return drivers.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search),
    );
  }, [search, drivers]);

  // ✅ Empty UI
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('@assets/images/emptytruck.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>No drivers found</Text>
    </View>
  );

  // ✅ Render Item
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <View style={styles.rowWithIcon}>
            <Ionicons
              name="person-outline"
              size={moderateScale(16)}
              color={colors.primary}
            />
            <Text style={styles.name}>{item.name}</Text>
          </View>

          <View style={styles.rowWithIcon}>
            <Ionicons
              name="call-outline"
              size={moderateScale(14)}
              color="#666"
            />
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        </View>

        <Text style={styles.id}>{item.license}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.rowWithIcon}>
          <Ionicons
            name="calendar-outline"
            size={moderateScale(14)}
            color="#777"
          />
          <Text style={styles.expiry}>
            Expires: {item.expiryDate}
          </Text>
        </View>

        {/* ✅ Dynamic Status */}
        <View
          style={[
            styles.statusBox,
            {
              backgroundColor:
                item.status === 'active' ? '#4CAF50' : '#F44336',
            },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[commonstyles.flex1, styles.container]}>
      <AppHeader title="Add Driver" />

      <SearchInput
        value={search}
        onChangeText={setSearch}
        containerStyle={styles.searchbar}
        placeholder='Search Driver By Name'
      />

      {/* ✅ Loading */}
      {isLoading && (
        <Text style={{ padding: 20 }}>Loading drivers...</Text>
      )}

      {/* ✅ Error */}
      {error && (
        <Text style={{ padding: 20, color: 'red' }}>{error}</Text>
      )}

      {/* ✅ List */}
      {!isLoading && !error && (
        <CustomFlatList
          data={filteredDrivers}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  searchbar: {
    marginHorizontal: wp(1),
    marginTop: hp(0),
  },

  emptyContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
    backgroundColor: colors.background,
  },

  emptyImage: {
    width: wp(50),
    height: hp(30),
    marginBottom: moderateScale(20),
  },

  emptyText: {
    fontSize: moderateScale(14),
    color: '#777',
  },

  listContainer: {
    padding: wp(5),
  },

  card: {
    padding: moderateScale(15),
    backgroundColor: colors.background,
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(12),
    elevation: 2,
  },

  name: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },

  phone: {
    fontSize: moderateScale(12),
    color: '#666',
    marginTop: 4,
  },
  btn: {
    marginBottom: wp(10),
  },
  //   card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   marginHorizontal: wp(3),
  //   marginVertical: moderateScale(8),
  //   padding: moderateScale(12),
  //   elevation: 2,
  // },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSection: {},

  rightSection: {
    alignItems: 'flex-end',
  },

  // name: {
  //   fontSize: moderateScale(14),
  //   fontWeight: '600',
  //   color: '#000',
  // },

  // phone: {
  //   fontSize: moderateScale(12),
  //   color: '#777',
  //   marginTop: 2,
  // },

  id: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: moderateScale(10),
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expiry: {
    fontSize: moderateScale(12),
    color: '#777',
  },

  statusBox: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  rowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: moderateScale(6),
  },
});
