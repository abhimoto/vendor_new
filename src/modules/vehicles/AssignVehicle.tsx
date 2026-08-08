import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import AppHeader from '@components/custumcomponents/AppHeader';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import { colors } from '@utils/colors';
import spacing from '@utils/spacing';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import  { DropdownItem } from '@components/dropdown/SearchableDropdown';
import {
  useGetassigneddetailsQuery,
  useGetunAssignedDriversQuery,
  useGetunAssignedVehiclesQuery
} from '@app/redux/query/queryApi';
import {
  useAssignVehicleMutation,
  useDessignVehicleMutation

} from '@app/redux/mutation/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';
import SearchInput from '@components/custumcomponents/SearchInput';
import { Dropdown } from 'react-native-element-dropdown';


type Vehicle = {
  id: string;
  tripId: string;
  date: string;
  vehicleNumber: string;
  driverName: string;
  driverId: string;
  vehicleId: string;
  status: string;
  type: 'assign' | 'deassign';
};

export default function AssignVehicle() {
  const [searchVehicle, setSearchVehicle] = useState<DropdownItem | null>(null);
  const [searchDriver, setSearchDriver] = useState<DropdownItem | null>(null);
  const [selectedTab, setSelectedTab] = useState<'assign' | 'deassign'>('assign');
  const [searchText, setSearchText] = useState('');
  const [vehicleFocus, setVehicleFocus] = useState(false);
  const [driverFocus, setDriverFocus] = useState(false);

  // Refs for dropdowns to clear input values
  const vehicleDropdownRef = useRef<any>(null);
  const driverDropdownRef = useRef<any>(null);

  // Mutations
  const [assignVehicle, { isLoading: isAssigning }] = useAssignVehicleMutation();
  const [deassign, { isLoading: isdeassigning }] = useDessignVehicleMutation()


  // Queries
  const {
    data: driversData,
    isLoading: driversLoading,
    error: driversError,
    refetch: refetchDrivers
  } = useGetunAssignedDriversQuery(undefined, {
    pollingInterval: 30000,
  });

  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles
  } = useGetunAssignedVehiclesQuery(undefined, {
    pollingInterval: 30000,
  })

  const {
    data: assignedData,
    isLoading: assignedLoading,
    isFetching: isFetchingAssigned,
    error: assignedError,
    refetch: refetchAssigned,
  } = useGetassigneddetailsQuery(undefined, {
    pollingInterval: 30000,
  });
const refreshAll = useCallback(() => {
  refetchAssigned();
  refetchDrivers();
  refetchVehicles();
}, [refetchAssigned, refetchDrivers, refetchVehicles]);
  // const drivers = useMemo(() => {
  //   if (!driversData?.data) return [];

  //   return driversData.data.map((d: any) => ({
  //     label: `${d.DriverName} (${d.MobileNo})`,
  //     value: d.DriverProfileId,
  //     driverName: d.DriverName,
  //     mobileNo: d.MobileNo,
  //     driverCode: d.DriverCode,
  //     isVerified: d.IsVerified,
  //     isActive: d.IsActive,
  //   }));
  // }, [driversData]);
const drivers = useMemo(
  () =>
    driversData?.data?.map((d: any) => ({
      label: `${d.DriverName} (${d.MobileNo})`,
      value: d.DriverProfileId,
    })) ?? [],
  [driversData]
);
  // const vehicles = useMemo(() => {
  //   if (!vehiclesData?.data) return [];

  //   return vehiclesData.data
  //     .filter((v: any) => v.IsVerified) // optional: only verified vehicles
  //     .map((v: any) => ({
  //       label: `${v.VehicleNo} (${v.BodyType || 'Vehicle'})`,
  //       value: v.VehicleId,
  //       vehicleNo: v.VehicleNo,
  //       loadingCapacity: v.LoadingCapacity,
  //       vehicleType: v.VehicleType,
  //       bodyType: v.BodyType,
  //       isVerified: v.IsVerified,
  //       isActive: v.IsActive,
  //     }));
  // }, [vehiclesData]);



  const vehicles = useMemo(
  () =>
    vehiclesData?.data
      ?.filter((v: any) => v.IsVerified)
      .map((v: any) => ({
        label: `${v.VehicleNo} (${v.BodyType || 'Vehicle'})`,
        value: v.VehicleId,
      })) ?? [],
  [vehiclesData]
);
  const assignedList = useMemo(() => {
    if (assignedError || !assignedData?.data) return [];

    return assignedData.data.map((item: any) => ({
      id: item.AssignmentId,
      tripId: item.AssignmentId,
      vehicleNumber: item.VehicleNo || 'N/A',
      driverName: item.DriverName || 'N/A',
      driverId: item.DriverProfileId,
      vehicleId: item.VehicleId,
      date: item.AssignedAt
        ? new Date(item.AssignedAt).toLocaleDateString()
        : 'N/A',
      status: item.IsActive ? 'Active' : 'Inactive',
      type:
        item.IsActive
          ? 'assign'
          : 'deassign',
    }));
  }, [assignedData, assignedError]);

  const filteredList = useMemo(() => {
    const query = searchText.toLowerCase().trim();

    const tabData = assignedList.filter(item =>
      selectedTab === 'assign'
        ? item.status === 'Active'
        : item.status === 'Inactive'
    );

    if (!query) return tabData;

    return tabData.filter(item =>
      item.vehicleNumber
        ?.toLowerCase()
        .includes(query) ||
      item.driverName
        ?.toLowerCase()
        .includes(query)
    );
  }, [searchText, assignedList, selectedTab]);


  const clearDropdownSelections = () => {
    setSearchVehicle(null);
    setSearchDriver(null);
    if (vehicleDropdownRef.current?.clearInput) {
      vehicleDropdownRef.current.clearInput();
    }
    if (driverDropdownRef.current?.clearInput) {
      driverDropdownRef.current.clearInput();
    }
  };

  const handleAssign = async () => {
    if (!searchVehicle || !searchDriver) {
      Alert.alert('Validation Error', 'Please select both vehicle and driver');
      return;
    }

    try {
      const payload = {
        DriverProfileId: searchDriver.value,
        VehicleId: searchVehicle.value,
      };

      console.log('Assign Payload:', payload);

      const response = await assignVehicle(payload).unwrap();

      if (response?.status === '00') {
        Alert.alert('Success', 'Vehicle assigned successfully');


    clearDropdownSelections();
    refreshAll();
      } else {
        Alert.alert('Assignment Failed', response?.message || 'Something went wrong');
      }
    } catch (err: any) {
      console.error('Assign Error:', err);
      Alert.alert(
        'Error',
        err?.data?.message || err?.message || 'Failed to assign vehicle'
      );
    }
  };

  const handleDeassign = async (item: Vehicle) => {
    try {
      const payload = {
        DriverProfileId: item.driverId,
        VehicleId: item.vehicleId,
      };

      const response = await deassign(payload).unwrap();

      if (response?.status === '00') {
        Alert.alert(
          'Success',
          `Vehicle ${item.vehicleNumber} has been deassigned successfully`
        );

        // Refresh lists
        refetchAssigned();
        refetchDrivers();
        refetchVehicles();
      } else {
        Alert.alert(
          'Deassignment Failed',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err: any) {
      console.error('Deassign Error:', err);

      Alert.alert(
        'Error',
        err?.data?.message ||
        err?.message ||
        'Failed to deassign vehicle. Please try again.'
      );
    }
  };

  const handleUpdate = async (item: Vehicle) => {
  Alert.alert(
    'Update Assignment',
    `Update assignment for ${item.vehicleNumber}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Update',
        onPress: async () => {
          try {
            const payload = {
              DriverProfileId: item.driverId,
              VehicleId: item.vehicleId,
            };

            console.log('Update Payload:', payload);

            const response = await deassign(payload).unwrap();

            if (response?.status === '00') {
              Alert.alert(
                'Success',
                'Vehicle assignment updated successfully'
              );

             refreshAll()
            } else {
              Alert.alert(
                'Update Failed',
                response?.message || 'Something went wrong'
              );
            }
          } catch (err: any) {
            console.error('Update Error:', err);

            Alert.alert(
              'Error',
              err?.data?.message ||
                err?.message ||
                'Failed to update assignment'
            );
          }
        },
      },
    ]
  );
};


  const confirmDeassign = (item: Vehicle) => {
    Alert.alert(
      'Confirm Deassignment',
      `Are you sure you want to deassign?\n\nVehicle: ${item.vehicleNumber}\nDriver: ${item.driverName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Deassign',
          style: 'destructive',
          onPress: () => handleDeassign(item),
        },
      ]
    );
  };

  // Render list item
  const renderItem = useCallback(({ item }: { item: Vehicle }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>ID: {item.tripId}</Text>
        </View>
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailColumn}>
          <Text style={styles.label}>Vehicle Number</Text>
          <Text style={styles.value}>{item.vehicleNumber}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.label}>Driver Name</Text>
          <Text style={styles.value}>{item.driverName}</Text>
        </View>
      </View>

      <View style={styles.rowBetween}>
        <View style={[styles.status, item.status === 'Active' ? styles.activeStatus : styles.inactiveStatus]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        {selectedTab === 'deassign' ? (
          <TouchableOpacity
            onPress={() => confirmDeassign(item)}
            style={styles.deleteButton}
            activeOpacity={0.7}
            disabled={isdeassigning}
          >
            {isdeassigning ? (
              <ActivityIndicator size="small" color="#FF4444" />
            ) : (
              <FontAwesome name="trash-o" size={22} color="#FF4444" />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleUpdate(item)}
            style={styles.editButton}
            activeOpacity={0.7}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#3F5C8A" />
            ) : (
              <MaterialIcons name="edit" size={22} color="#3F5C8A" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  ), [selectedTab]);
  const keyExtractor = useCallback((item: Vehicle) => item.id, []);
  const onRefresh = useCallback(() => {
    refetchAssigned();
    refetchDrivers();
    refetchVehicles();
  }, [refetchAssigned, refetchDrivers, refetchVehicles]);

  // Loading state
  const isLoading = assignedLoading && assignedList.length === 0;
  const isRefreshing = isFetchingAssigned && assignedList.length > 0;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Assign / Deassigned" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <AppHeader title="Assign / Deassigned" />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'assign' && styles.activeMainTab]}
          onPress={() => setSelectedTab('assign')}
          activeOpacity={0.7}
        >
          <Text style={selectedTab === 'assign' ? styles.activeMainTabText : styles.inactiveMainTabText}>
            Assign Vehicle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'deassign' && styles.activeMainTab]}
          onPress={() => setSelectedTab('deassign')}
          activeOpacity={0.7}
        >
          <Text style={selectedTab === 'deassign' ? styles.activeMainTabText : styles.inactiveMainTabText}>
            Deassigned Driver
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'assign' && (
        <View style={styles.searchBox}>

          {/* Vehicle Dropdown */}
          <View style={{ marginBottom: 16 }}>
            {(vehicleFocus || searchVehicle) && (
              <Text
                style={{
                  position: 'absolute',
                  top: -10,
                  left: 12,
                  backgroundColor: '#fff',
                  paddingHorizontal: 4,
                  zIndex: 999,
                  color: colors.primary,
                  fontSize: 12,
                }}>
                Vehicle Number
              </Text>
            )}

            <Dropdown
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: vehicleFocus ? colors.primary : '#ddd',
                borderRadius: 8,
                paddingHorizontal: 12,
              }}
              data={vehicles}
              search
              labelField="label"
              valueField="value"
              placeholder={!vehicleFocus ? 'Select Vehicle' : ''}
              searchPlaceholder="Search Vehicle..."
              value={searchVehicle?.value}
              onFocus={() => setVehicleFocus(true)}
              onBlur={() => setVehicleFocus(false)}
              onChange={item => {
                setSearchVehicle(item);
                setVehicleFocus(false);
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            {(driverFocus || searchDriver) && (
              <Text
                style={{
                  position: 'absolute',
                  top: -10,
                  left: 12,
                  backgroundColor: '#fff',
                  paddingHorizontal: 4,
                  zIndex: 999,
                  color: colors.primary,
                  fontSize: 12,
                }}>
                Driver
              </Text>
            )}

            <Dropdown
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: driverFocus ? colors.primary : '#ddd',
                borderRadius: 8,
                paddingHorizontal: 12,
              }}
              data={drivers}
              search
              labelField="label"
              valueField="value"
              placeholder={!driverFocus ? 'Select Driver' : ''}
              searchPlaceholder="Search Driver..."
              value={searchDriver?.value}
              onFocus={() => setDriverFocus(true)}
              onBlur={() => setDriverFocus(false)}
              onChange={item => {
                setSearchDriver(item);
                setDriverFocus(false);
              }}
            />
          </View>

          {(driversError || vehiclesError) && (
            <Text style={styles.warningText}>
              Unable to load some data. Pull to refresh.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!searchVehicle || !searchDriver || isAssigning) &&
              styles.submitBtnDisabled,
            ]}
            onPress={handleAssign}
            disabled={!searchVehicle || !searchDriver || isAssigning}>
            {isAssigning ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>

        </View>
      )}

      {filteredList.length > 0 && (
        <SearchInput
          placeholder="Search Driver / Vehicle Number"
          onChangeText={setSearchText}
          value={searchText}
        />
      )}
      <CustomFlatList
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>
              {searchText
                ? 'No matching results found'
                : selectedTab === 'assign'
                  ? 'No assigned vehicles found'
                  : 'No deassigned records found'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  warningText: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: -8,
    marginBottom: 8,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 10,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  activeMainTab: {
    backgroundColor: colors.primary,
  },
  activeMainTabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveMainTabText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  searchBox: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownInput: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 14,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  submitBtn: {
    marginTop: spacing.md,
    backgroundColor: '#385380',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: 213,
    height: 56
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBadge: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
  },
  topBadgeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailColumn: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  activeStatus: {
    backgroundColor: '#4CAF50',
  },
  inactiveStatus: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
});