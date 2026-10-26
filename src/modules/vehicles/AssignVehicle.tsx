
import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import AppHeader from '@components/custumcomponents/AppHeader';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import { colors } from '@utils/colors';
import spacing from '@utils/spacing';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { DropdownItem } from '@components/dropdown/SearchableDropdown';

import {
  useGetassigneddetailsQuery,
  useGetunAssignedDriversQuery,
  useGetunAssignedVehiclesQuery,
} from '@app/redux/query/queryApi';

import {
  useAssignVehicleMutation,
  useDessignVehicleMutation,
} from '@app/redux/mutation/authApi';

import SearchInput from '@components/custumcomponents/SearchInput';
import { Dropdown } from 'react-native-element-dropdown';

import VendorSocket from './../../sockets/VendorSocket';


type DriverDropdownItem = DropdownItem & {
  driverUserId: string;
  driverName: string;
};

type VehicleDropdownItem = DropdownItem & {
  vehicleNo: string;
};

type Vehicle = {
  id: string;
  tripId: string;
  date: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverLicenseNo: string;
  driverUserId: string;
  driverId: string;
  vehicleId: string;
  status: string;
  type: 'assign' | 'deassign';
};


export default function AssignVehicle() {

  const [searchVehicle, setSearchVehicle] =
    useState<VehicleDropdownItem | null>(null);

  const [searchDriver, setSearchDriver] =
    useState<DriverDropdownItem | null>(null);

  const [selectedTab, setSelectedTab] =
    useState<'assign' | 'deassign'>('assign');

  const [searchText, setSearchText] = useState('');

  const [vehicleFocus, setVehicleFocus] = useState(false);

  const [driverFocus, setDriverFocus] = useState(false);


  // Mutations

  const [assignVehicle, { isLoading: isAssigning }] =
    useAssignVehicleMutation();

  const [deassign, { isLoading: isDeassigning }] =
    useDessignVehicleMutation();


  // ==========================================
  // API QUERIES
  // ==========================================

  const {
    data: driversData,
    isLoading: driversLoading,
    error: driversError,
    refetch: refetchDrivers,
  } = useGetunAssignedDriversQuery(undefined, {
    pollingInterval: 30000,
  });


  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useGetunAssignedVehiclesQuery(undefined, {
    pollingInterval: 30000,
  });


  const {
    data: assignedData,
    isLoading: assignedLoading,
    isFetching: isFetchingAssigned,
    error: assignedError,
    refetch: refetchAssigned,
  } = useGetassigneddetailsQuery(undefined, {
    pollingInterval: 30000,
  });


  // ==========================================
  // REFRESH ALL DATA
  // ==========================================

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchAssigned(),
      refetchDrivers(),
      refetchVehicles(),
    ]);
  }, [
    refetchAssigned,
    refetchDrivers,
    refetchVehicles,
  ]);


  // ==========================================
  // DRIVER DROPDOWN DATA
  // ==========================================

  const drivers = useMemo<DriverDropdownItem[]>(
    () =>
      driversData?.data?.map((d: any) => ({
        label: `${d.DriverName} (${d.MobileNo})`,
        value: d.DriverProfileId,
        driverUserId: d.DriverUserId,
        driverName: d.DriverName,
      })) ?? [],
    [driversData],
  );


  // ==========================================
  // VEHICLE DROPDOWN DATA
  // ==========================================

  const vehicles = useMemo<VehicleDropdownItem[]>(
    () =>
      vehiclesData?.data
        ?.filter((v: any) => v.IsVerified)
        .map((v: any) => ({
          label: `${v.VehicleNo} (${v.BodyType || 'Vehicle'})`,
          value: v.VehicleId,
          vehicleNo: v.VehicleNo,
        })) ?? [],
    [vehiclesData],
  );


  // ==========================================
  // ASSIGNED / DEASSIGNED LIST
  // ==========================================

  const assignedList = useMemo<Vehicle[]>(() => {

    if (assignedError || !assignedData?.data) {
      return [];
    }

    return assignedData.data.map((item: any) => ({

      id: item.AssignmentId,

      tripId: item.AssignmentId,

      vehicleNumber: item.VehicleNo || 'N/A',

      vehicleType:
        item.VehicleType ||
        item.BodyType ||
        'Goods carrier',

      driverName: item.DriverName || 'N/A',

      driverLicenseNo:
        item.license_number || 'N/A',

      driverId: item.DriverProfileId,

      driverUserId: item.DriverUserId,

      vehicleId: item.VehicleId,

      date: item.AssignedAt
        ? new Date(item.AssignedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'N/A',

      status: item.IsActive ? 'Active' : 'Inactive',

      type: item.IsActive ? 'assign' : 'deassign',

    }));

  }, [assignedData, assignedError]);


  // ==========================================
  // FILTER DATA
  // ==========================================

  const filteredList = useMemo(() => {

    const query = searchText.toLowerCase().trim();

    const tabData = assignedList.filter(item =>
      selectedTab === 'assign'
        ? item.status === 'Active'
        : item.status === 'Inactive',
    );

    if (!query) {
      return tabData;
    }

    return tabData.filter(item =>
      item.vehicleNumber?.toLowerCase().includes(query) ||
      item.driverName?.toLowerCase().includes(query),
    );

  }, [searchText, assignedList, selectedTab]);


  // ==========================================
  // CLEAR DROPDOWNS
  // ==========================================

  const clearDropdownSelections = () => {

    setSearchVehicle(null);

    setSearchDriver(null);

    setVehicleFocus(false);

    setDriverFocus(false);

  };


  // ==========================================
  // ASSIGN VEHICLE
  // ==========================================

  const handleAssign = async () => {

    if (!searchVehicle || !searchDriver) {

      Alert.alert(
        'Validation Error',
        'Please select both vehicle and driver',
      );

      return;
    }

    try {

      const payload = {
        DriverProfileId: searchDriver.value,
        VehicleId: searchVehicle.value,
      };

      const response = await assignVehicle(payload).unwrap();

      if (response?.status === '00') {

        await VendorSocket.vehicleAssignToDriver(
          searchDriver.driverUserId,
          searchVehicle.vehicleNo,
        );

        Alert.alert(
          'Success',
          'Vehicle assigned successfully',
        );

        clearDropdownSelections();

        await refreshAll();

      } else {

        Alert.alert(
          'Assignment Failed',
          response?.message || 'Something went wrong',
        );

      }

    } catch (err: any) {

      console.error('Assign Error:', err);

      Alert.alert(
        'Error',
        err?.data?.message ||
        err?.message ||
        'Failed to assign vehicle',
      );

    }
  };


  // ==========================================
  // DEASSIGN VEHICLE
  // ==========================================

  const handleDeassign = async (item: Vehicle) => {

    try {

      if (!item.driverUserId) {

        Alert.alert(
          'Error',
          'Driver User ID is missing. Please refresh the list.',
        );

        return;
      }

      const payload = {
        DriverProfileId: item.driverId,
        VehicleId: item.vehicleId,
      };

      const response = await deassign(payload).unwrap();

      if (response?.status === '00') {

        await VendorSocket.vehicleDeassignToDriver(
          item.driverUserId,
          item.vehicleNumber,
        );

        Alert.alert(
          'Success',
          `Vehicle ${item.vehicleNumber} has been deassigned successfully`,
        );

        await refreshAll();

      } else {

        Alert.alert(
          'Deassignment Failed',
          response?.message || 'Something went wrong',
        );

      }

    } catch (err: any) {

      console.error('Deassign Error:', err);

      Alert.alert(
        'Error',
        err?.data?.message ||
        err?.message ||
        'Failed to deassign vehicle. Please try again.',
      );

    }
  };


  // ==========================================
  // CONFIRM DEASSIGN
  // ==========================================

  const confirmDeassign = (item: Vehicle) => {

    Alert.alert(
      'Confirm Deassignment',

      `Are you sure you want to deassign?\n\nVehicle: ${item.vehicleNumber}\nDriver: ${item.driverName}`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Deassign',
          style: 'destructive',
          onPress: () => handleDeassign(item),
        },
      ],
    );

  };


  // ==========================================
  // RENDER LIST ITEM
  // ==========================================

  const renderItem = useCallback(
    ({ item }: { item: Vehicle }) => (

      <View style={styles.assignmentCard}>

        {/* TOP ROW */}

        <View style={styles.topRow}>

          <View style={styles.assignmentBadge}>

            <Text
              style={styles.assignmentText}
              numberOfLines={1}
            >
              Assign {item.tripId}
            </Text>

          </View>

          <View style={styles.dateBadge}>

            <Text
              style={styles.dateText}
              numberOfLines={1}
            >
              {item.date}
            </Text>

          </View>

        </View>


        {/* VEHICLE + DRIVER */}

        <View style={styles.infoRow}>

          {/* VEHICLE */}

          <View style={styles.infoSection}>

            <View style={styles.iconCircle}>

              <MaterialIcons
                name="local-shipping"
                size={18}
                color={colors.primary}
              />

            </View>

            <View style={styles.infoContent}>

              <Text style={styles.infoLabel}>
                Vehicle Number
              </Text>

              <Text
                style={styles.vehicleNumber}
                numberOfLines={1}
              >
                {item.vehicleNumber}
              </Text>

              <Text
                style={styles.vehicleType}
                numberOfLines={1}
              >
                {item.vehicleType}
              </Text>

            </View>

          </View>


          <View style={styles.verticalDivider} />


          {/* DRIVER */}

          <View style={styles.infoSection}>

            <View style={styles.iconCircle}>

              <MaterialIcons
                name="person-outline"
                size={19}
                color={colors.primary}
              />

            </View>

            <View style={styles.infoContent}>

              <Text style={styles.infoLabel}>
                Driver Name
              </Text>

              <Text
                style={styles.driverName}
                numberOfLines={1}
              >
                {item.driverName}
              </Text>

              <Text
                style={styles.driverLicense}
                numberOfLines={1}
              >
                {item.driverLicenseNo}
              </Text>

            </View>

          </View>

        </View>


        {/* DOTTED DIVIDER */}

        <View style={styles.dottedDivider} />


        {/* BOTTOM ROW */}

        <View style={styles.bottomRow}>

          {/* STATUS */}

          <View
            style={[
              styles.statusBadge,
              item.status === 'Active'
                ? styles.activeStatus
                : styles.inactiveStatus,
            ]}
          >

            <MaterialIcons
              name={
                item.status === 'Active'
                  ? 'check-circle-outline'
                  : 'cancel'
              }
              size={14}
              color={
                item.status === 'Active'
                  ? '#20A464'
                  : '#777'
              }
            />

            <Text
              style={[
                styles.statusText,
                item.status === 'Active'
                  ? styles.activeStatusText
                  : styles.inactiveStatusText,
              ]}
            >
              {item.status}
            </Text>

          </View>


          {/* DELETE */}

          <TouchableOpacity
            onPress={() => confirmDeassign(item)}
            style={styles.deleteButton}
            activeOpacity={0.7}
            disabled={isDeassigning}
          >

            {isDeassigning ? (

              <ActivityIndicator
                size="small"
                color="#FF3B30"
              />

            ) : (

              <>
                <MaterialIcons
                  name="delete-outline"
                  size={17}
                  color="#FF3B30"
                />

                <Text style={styles.deleteText}>
                  Delete
                </Text>
              </>

            )}

          </TouchableOpacity>

        </View>

      </View>

    ),
    [isDeassigning],
  );


  const keyExtractor = useCallback(
    (item: Vehicle) => item.id,
    [],
  );


  const onRefresh = useCallback(() => {

    refreshAll();

  }, [refreshAll]);


  const isLoading = assignedLoading && !assignedData;

  const isRefreshing =
    isFetchingAssigned && !assignedLoading;


  return (

    <View style={styles.container}>

      <AppHeader title="Assign / Deassigned" />


      {/* ======================================
          TABS
      ====================================== */}

      <View style={styles.tabContainer}>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            selectedTab === 'assign' && styles.activeMainTab,
          ]}
          onPress={() => {
            setSelectedTab('assign');
            setSearchText('');
          }}
          activeOpacity={0.7}
        >

          <Text
            style={
              selectedTab === 'assign'
                ? styles.activeMainTabText
                : styles.inactiveMainTabText
            }
          >
            Assign Vehicle
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.tabBtn,
            selectedTab === 'deassign' && styles.activeMainTab,
          ]}
          onPress={() => {
            setSelectedTab('deassign');
            setSearchText('');
          }}
          activeOpacity={0.7}
        >

          <Text
            style={
              selectedTab === 'deassign'
                ? styles.activeMainTabText
                : styles.inactiveMainTabText
            }
          >
            Deassigned Driver
          </Text>

        </TouchableOpacity>

      </View>


      {/* ======================================
          ASSIGN FORM
      ====================================== */}

      {selectedTab === 'assign' && (

        <View style={styles.searchBox}>


          {/* VEHICLE DROPDOWN */}

          {/* <View style={styles.dropdownContainer}>

            {(vehicleFocus || searchVehicle) && (

              <Text style={styles.floatingLabel}>
                Vehicle Number
              </Text>

            )}

            <Dropdown
              style={[
                styles.dropdown,
                {
                  borderColor: vehicleFocus
                    ? colors.primary
                    : '#ddd',
                },
              ]}
              data={vehicles}
              search
              labelField="label"
              valueField="value"
              placeholder={
                !vehicleFocus ? 'Select Vehicle' : ''
              }
              searchPlaceholder="Search Vehicle..."
              value={searchVehicle?.value}
              onFocus={() => setVehicleFocus(true)}
              onBlur={() => setVehicleFocus(false)}
              onChange={item => {
                setSearchVehicle(item as VehicleDropdownItem);
                setVehicleFocus(false);
              }}
            />

            {vehiclesLoading && (
              <View style={styles.dropdownLoader}>
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />
              </View>
            )}

          </View> */}

{/* VEHICLE DROPDOWN */}
{vehicles.length > 0 && (
  <View style={styles.dropdownContainer}>
    {(vehicleFocus || searchVehicle) && (
      <Text style={styles.floatingLabel}>
        Vehicle Number
      </Text>
    )}

    <Dropdown
      style={[
        styles.dropdown,
        {
          borderColor: vehicleFocus
            ? colors.primary
            : '#ddd',
        },
      ]}
      data={vehicles}
      search
      labelField="label"
      valueField="value"
      placeholder={
        !vehicleFocus ? 'Select Vehicle' : ''
      }
      searchPlaceholder="Search Vehicle..."
      value={searchVehicle?.value}
      onFocus={() => setVehicleFocus(true)}
      onBlur={() => setVehicleFocus(false)}
      onChange={item => {
        setSearchVehicle(item as VehicleDropdownItem);
        setVehicleFocus(false);
      }}
    />

    {vehiclesLoading && (
      <View style={styles.dropdownLoader}>
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      </View>
    )}
  </View>
)}
          {/* DRIVER DROPDOWN */}

          {/* <View style={styles.dropdownContainer}>

            {(driverFocus || searchDriver) && (

              <Text style={styles.floatingLabel}>
                Driver
              </Text>

            )}

            <Dropdown
              style={[
                styles.dropdown,
                {
                  borderColor: driverFocus
                    ? colors.primary
                    : '#ddd',
                },
              ]}
              data={drivers}
              search
              labelField="label"
              valueField="value"
              placeholder={
                !driverFocus ? 'Select Driver' : ''
              }
              searchPlaceholder="Search Driver..."
              value={searchDriver?.value}
              onFocus={() => setDriverFocus(true)}
              onBlur={() => setDriverFocus(false)}
              onChange={item => {
                setSearchDriver(item as DriverDropdownItem);
                setDriverFocus(false);
              }}
            />

            {driversLoading && (
              <View style={styles.dropdownLoader}>
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />
              </View>
            )}

          </View> */}

{/* DRIVER DROPDOWN */}
{drivers.length > 0 && (
  <View style={styles.dropdownContainer}>
    {(driverFocus || searchDriver) && (
      <Text style={styles.floatingLabel}>
        Driver
      </Text>
    )}

    <Dropdown
      style={[
        styles.dropdown,
        {
          borderColor: driverFocus
            ? colors.primary
            : '#ddd',
        },
      ]}
      data={drivers}
      search
      labelField="label"
      valueField="value"
      placeholder={
        !driverFocus ? 'Select Driver' : ''
      }
      searchPlaceholder="Search Driver..."
      value={searchDriver?.value}
      onFocus={() => setDriverFocus(true)}
      onBlur={() => setDriverFocus(false)}
      onChange={item => {
        setSearchDriver(item as DriverDropdownItem);
        setDriverFocus(false);
      }}
    />

    {driversLoading && (
      <View style={styles.dropdownLoader}>
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      </View>
    )}
  </View>
)}
          {/* API ERROR */}

          {(driversError || vehiclesError) && (

            <Text style={styles.warningText}>
              Unable to load some data. Pull to refresh.
            </Text>

          )}


          {/* SUBMIT BUTTON */}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!searchVehicle ||
                !searchDriver ||
                isAssigning) &&
                styles.submitBtnDisabled,
            ]}
            onPress={handleAssign}
            disabled={
              !searchVehicle ||
              !searchDriver ||
              isAssigning
            }
          >

            {isAssigning ? (

              <ActivityIndicator
                size="small"
                color="#fff"
              />

            ) : (

              <Text style={styles.submitText}>
                Submit
              </Text>

            )}

          </TouchableOpacity>

        </View>

      )}


      {/* ======================================
          SEARCH INPUT
      ====================================== */}

      {filteredList.length > 0 && (

        <SearchInput
          placeholder="Search Driver / Vehicle Number"
          onChangeText={setSearchText}
          value={searchText}
        />

      )}


      {/* ======================================
          ASSIGNED / DEASSIGNED LIST LOADER
      ====================================== */}

      {isLoading ? (

        <View style={styles.listLoader}>

          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading {
              selectedTab === 'assign'
                ? 'assigned'
                : 'deassigned'
            } data...
          </Text>

        </View>

      ) : (

        <CustomFlatList
          data={filteredList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}

          ListEmptyComponent={

            <View style={styles.emptyContainer}>

              <MaterialIcons
                name="info-outline"
                size={48}
                color="#999"
              />

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

      )}

    </View>

  );

}


// ==========================================
// STYLES
// ==========================================

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

  listLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: '#666',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  dropdownContainer: {
    marginBottom: 16,
    position: 'relative',
  },

  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 999,
    color: colors.primary,
    fontSize: 12,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  dropdownLoader: {
    position: 'absolute',
    right: 40,
    top: 15,
  },

  warningText: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: -8,
    marginBottom: 8,
    textAlign: 'center',
  },

  submitBtn: {
    marginTop: spacing.md,
    backgroundColor: '#385380',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: 213,
    height: 56,
    justifyContent: 'center',
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

  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  assignmentBadge: {
    flex: 1,
    height: 31,
    backgroundColor: '#F0F3FB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  dateBadge: {
    flex: 1,
    height: 31,
    backgroundColor: '#F0F3FB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  assignmentText: {
    color: '#3F5C8A',
    fontSize: 12,
    fontWeight: '700',
  },

  dateText: {
    color: '#3F5C8A',
    fontSize: 12,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    minHeight: 52,
  },

  infoSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
  },

  infoLabel: {
    fontSize: 10,
    color: '#222',
    fontWeight: '500',
    marginBottom: 2,
  },

  vehicleNumber: {
    fontSize: 12,
    color: '#333',
    fontWeight: '700',
  },

  vehicleType: {
    fontSize: 10,
    color: '#333',
    marginTop: 1,
  },

  driverName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '700',
  },

  driverLicense: {
    fontSize: 10,
    color: '#333',
    marginTop: 1,
  },

  verticalDivider: {
    width: 1,
    height: 47,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
  },

  dottedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D8D8D8',
    marginTop: 8,
    marginBottom: 8,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },

  activeStatus: {
    backgroundColor: '#E9F8F0',
  },

  inactiveStatus: {
    backgroundColor: '#F0F0F0',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },

  activeStatusText: {
    color: '#20A464',
  },

  inactiveStatusText: {
    color: '#777',
  },

  deleteButton: {
    height: 27,
    minWidth: 65,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    color: '#FF3B30',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
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
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 20,
    flexGrow: 1,
  },

});
