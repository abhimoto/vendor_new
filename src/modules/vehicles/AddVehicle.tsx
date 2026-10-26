import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import CustomModal from '@components/modal/CustomModal';
import CustomButton from '@components/buttons/CustomButton';
import OtpVerification from '@components/otpverification/OtpVerification';

import commonstyles from '@utils/commonstyles';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';

import {
  wp,
  hp,
  moderateScale,
  normalizeFont,
  verticalScale,
} from '@utils/responsive';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { HOME_ROUTES } from '@navigation/routes';

import { useGetvehicleMutation } from '@app/redux/query/queryApi';

import EditVehicles from './EditVehicles';
import AddVehicles from './AddVehicles';

export default function AddVehicle() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const from = route?.params?.from;

  const [skippedVehicles, setSkippedVehicles] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [addvehiclevisible, setAddvehiclevisible] = useState(false);
  const [otpvisible, setOtpvisible] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const [filter, setFilter] = useState<
    'verified' | 'pending' | 'all'
  >('pending');

  /* ---------------- API ---------------- */

  const [
    getVehicle,
    {
      data: validationData,
      isLoading,
      isError,
    },
  ] = useGetvehicleMutation();

  /* ---------------- OTP VERIFICATION ---------------- */

  const handleverify = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setOtpvisible(true);
  };

  const handlevehiclesubmit = (otp: string) => {
    setOtpvisible(false);

    navigation.navigate(HOME_ROUTES.VALIDATE_VEHICLES, {
      item: selectedVehicle,
      from,
      otp,
    });
  };

  /* ---------------- FETCH VEHICLES ---------------- */

  useFocusEffect(
    useCallback(() => {
      setOtpvisible(false);
      getVehicle();
    }, [getVehicle]),
  );

  /* ---------------- VEHICLE DATA ---------------- */

  const vehicleData = useMemo(() => {
    if (!Array.isArray(validationData?.data)) {
      return [];
    }

    return validationData.data.map((item: any, index: number) => ({
      id: `${item.VehicleId}-${index}`,
      VehicleId: item.VehicleId,
      number: item.VehicleNo,
      VehicleNo: item.VehicleNo,
      IsVerified: item.IsVerified === true,
      LoadingCapacity: Number(item.LoadingCapacity),
    }));
  }, [validationData]);

  /* ---------------- SKIP VALIDATION ---------------- */

  useEffect(() => {
    if (from !== 'temporary_dashboard') return;

    const pendingVehicles = vehicleData.filter(
      (vehicle: any) => !vehicle.IsVerified,
    );

    const allSkipped =
      pendingVehicles.length > 0 &&
      pendingVehicles.every((vehicle: any) =>
        skippedVehicles.includes(vehicle.id),
      );

    if (allSkipped) {
      Alert.alert(
        'Completed',
        'All pending vehicles are skipped',
      );
    }
  }, [skippedVehicles, vehicleData, from]);

  const allCompleted = useMemo(() => {
    if (vehicleData.length === 0) return false;

    return vehicleData.every((vehicle: any) => {
      const isVerified = vehicle.IsVerified;
      const isSkipped = skippedVehicles.includes(vehicle.id);

      return isVerified || isSkipped;
    });
  }, [vehicleData, skippedVehicles]);

  const handleBackPress = () => {
    if (!allCompleted && from === 'temporary_dashboard') {
      Alert.alert(
        'Action Required',
        'Please verify or skip all vehicles before continuing.',
      );
      return;
    }

    navigation.goBack();
  };

  const handleSkip = (id: string) => {
    setSkippedVehicles(prev => [...prev, id]);
  };

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredVehicles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return vehicleData.filter((vehicle: any) => {
      const matchesSearch = vehicle.number
        .toLowerCase()
        .includes(searchText);

      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'verified'
            ? vehicle.IsVerified === true
            : vehicle.IsVerified !== true;

      return matchesSearch && matchesFilter;
    });
  }, [vehicleData, search, filter]);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <AppHeader
        title="Validate Vehicles"
        // onBackPress={handleBackPress}
      />

      <View
        style={[
          commonstyles.container,
          styles.vehiclecontainer,
        ]}
      >

        {/* ADD VEHICLE BUTTON */}

   <TouchableOpacity
  onPress={() => setAddvehiclevisible(true)}
  style={styles.addVehicleButton}
>
  <MaterialIcons name="add" size={20} color="#2E5A99" />
  <Text style={styles.addVehicleText}>Add Vehicle</Text>
</TouchableOpacity>



        <View style={styles.vehicleSecondContainer}>

          {/* <Text style={styles.heading}>
            Validate Vehicle
          </Text> */}

          {/* FILTER OPTIONS */}

          <View style={styles.filterRow}>
            {[
              {
                label: 'Verified',
                value: 'verified',
              },
              {
                label: 'Unverified',
                value: 'pending',
              },
              {
                label: 'All',
                value: 'all',
              },
            ].map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.radioItem}
                onPress={() =>
                  setFilter(item.value as any)
                }
              >
                <View
                  style={[
                    styles.radioOuter,
                    filter === item.value &&
                      styles.radioOuterActive,
                  ]}
                >
                  {filter === item.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>

                <Text style={styles.radioLabel}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SEARCH */}

          <SearchInput
            value={search}
            containerStyle={styles.seachinput}
            onChangeText={setSearch}
            placeholder="Search Vehicle By Number"
          />

          {/* VEHICLE LIST */}

          <CustomFlatList
            data={filteredVehicles}
            loading={isLoading}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }: any) => {
              const isSkipped = skippedVehicles.includes(item.id);
              const verified = item.IsVerified;

              return (
                <View style={styles.card}>

                  {/* VEHICLE NUMBER */}

                  <View style={styles.vehicleColumn}>
                    <Text style={styles.vehicleNumber}>
                      {item.number}
                    </Text>
                  </View>

                  {/* VEHICLE STATUS */}

                  <View style={styles.statusColumn}>
                    <Text
                      style={[
                        styles.subtitle,
                        verified && styles.verifiedSubtitle,
                      ]}
                    >
                      {verified
                        ? '(Verified Successfully)'
                        : '(needs to be validated)'}
                    </Text>
                  </View>

                  {/* ACTION BUTTONS */}

                  {verified ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.verifiedButton}
                      onPress={() =>
                        navigation.navigate(
                          from === 'temporary_dashboard'
                            ? HOME_ROUTES.VERIFIEDVEHICLES_ONBOARD
                            : HOME_ROUTES.VERIFIES_VEHICLES,
                          {
                            vehicle: item,
                          },
                        )
                      }
                    >
                      <Text style={styles.verifiedButtonText}>
                        Preview
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.pendingContainer}>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.validateButton,
                          isSkipped && styles.disabledButton,
                        ]}
                        disabled={isSkipped}
                        onPress={() => handleverify(item)}
                      >
                        <Text style={styles.statusText}>
                          Validate
                        </Text>
                      </TouchableOpacity>

                      {/* SKIP BUTTON */}

                      {/* {from === 'temporary_dashboard' && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[
                            styles.skipButton,
                            isSkipped && styles.skippedButtonStyle,
                          ]}
                          disabled={isSkipped}
                          onPress={() => handleSkip(item.id)}
                        >
                          <Text style={styles.skipText}>
                            {isSkipped ? 'Skipped' : 'Skip'}
                          </Text>
                        </TouchableOpacity>
                      )} */}

                      {/* EDIT BUTTON */}

                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          setSelectedVehicle(item);
                          setModalVisible(true);
                        }}
                      >
                        <MaterialIcons
                          name="edit"
                          size={18}
                          color="#2E5A99"
                        />
                      </TouchableOpacity>

                    </View>
                  )}

                </View>
              );
            }}
          />

        </View>

        {/* EDIT VEHICLE MODAL */}

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <EditVehicles
            vehicle={selectedVehicle}
            onClose={() => setModalVisible(false)}
            onSuccess={() => {
              getVehicle();
            }}
          />
        </CustomModal>

        {/* ADD VEHICLE MODAL */}

        <CustomModal
          visible={addvehiclevisible}
          onClose={() => setAddvehiclevisible(false)}
        >
          <AddVehicles
            onClose={() => setAddvehiclevisible(false)}
            onSuccess={() => {
              getVehicle();
            }}
          />
        </CustomModal>

        {/* OTP MODAL */}

        <CustomModal
          visible={otpvisible}
          onClose={() => setOtpvisible(false)}
        >
          <OtpVerification
            expirySeconds={120}
            otpLength={4}
            onSubmit={handlevehiclesubmit}
          />
        </CustomModal>

      </View>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  vehiclecontainer: {
    marginTop: hp(2),
    padding: spacing.lg,
  },

  seachinput: {
    marginBottom: spacing.lg,
  },

  /* VEHICLE CARD */

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginBottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleColumn: {
    width: 120,
    justifyContent: 'center',
  },

  statusColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: normalizeFont(12),
    color: '#FF0814',
    textAlign: 'center',
  },

  verifiedSubtitle: {
    color: '#46B955',
  },

  vehicleNumber: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    color: '#000000',
  },

  verifiedButton: {
    backgroundColor: '#46B955',
    paddingLeft: wp(6),
    paddingRight: wp(4),
    borderRadius: 4,
    width: 114,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifiedButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  validateButton: {
    backgroundColor: '#DEE5F7',
    borderRadius: 3,
    width: 101,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },

  statusText: {
    color: '#2E5A99',
    fontSize: normalizeFont(13),
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.6,
  },

  editButton: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },

  /* ADD VEHICLE BUTTON */

  submitBtn: {
    marginTop: 5,
    alignSelf: 'flex-end',
    width: 166,
  },

  /* VALIDATION SECTION */

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 15,
    paddingHorizontal: spacing.lg,
  },

  vehicleSecondContainer: {
    marginTop: verticalScale(25),
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: spacing.lg,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A7A7A7',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  radioLabel: {
    fontSize: normalizeFont(14),
    color: '#333',
  },
  addVehicleButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8,
  gap: 6,
},

addVehicleText: {
  color: '#000000',
  fontSize: 14,
  fontWeight: '600',
},
});
