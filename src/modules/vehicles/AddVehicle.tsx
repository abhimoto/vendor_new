import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';

import AppHeader from '@components/custumcomponents/AppHeader';
import SearchInput from '@components/custumcomponents/SearchInput';
import commonstyles from '@utils/commonstyles';
import CustomFlatList from '@components/custumcomponents/CustomFlatList';
import CustomModal from '@components/modal/CustomModal';
import { useRef } from 'react';
import {
  wp,
  hp,
  moderateScale,
  normalizeFont,
  verticalScale,
} from '@utils/responsive';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';

import { useNavigation, useRoute } from '@react-navigation/native';
import { HOME_ROUTES } from '@navigation/routes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useGetvehicleMutation } from '@app/redux/query/queryApi';
import EditVehicles from './EditVehicles';
import CustomButton from '@components/buttons/CustomButton';
import LocalInput from '@components/Inputs/LocalInput';
import { useAddvehicleMutation } from '@app/redux/mutation/authApi';
import OtpVerification from '@components/otpverification/OtpVerification';




type HomeStackParamList = {
  ValidateVehicles: { vehicleno: string };
};

export default function AddVehicle() {
  const route = useRoute<any>();
  const from = route?.params?.from;
  console.log(from)
  const navigation = useNavigation<any>();
  const [skippedVehicles, setSkippedVehicles] = useState<string[]>([]);
  const [search, setsearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [otpvisible,setotpvisible] = useState(false)
  const [vehicles, setVehicles] = useState([
    {
      registrationNumber: '',
      capacity: '',
    },
  ]);

  const [vehicleErrors, setVehicleErrors] = useState<Record<number, string>>({});
  const [addVehicle, { isLoading: isaddded }] = useAddvehicleMutation();
  const vehicleDebounceRef = useRef<Record<number, any>>({});
  const [filter, setFilter] = useState<
    'verified' | 'pending' | 'all'
  >('pending');
  /* ---------------- API ---------------- */
 const handleverify = (vehicle: any) => {
  setSelectedVehicle(vehicle);
  setotpvisible(true);
};

const handlevehiclesubmit = (otp: string) => {
  console.log('OTP:', otp);
  navigation.navigate(HOME_ROUTES.VALIDATE_VEHICLES, {
    item: selectedVehicle,
    from,
    otp,
  });
};
  const addNewVehicle = () => {
    const last = vehicles[vehicles.length - 1];

    if (!last.registrationNumber || !last.capacity) {
      Alert.alert('Please fill vehicle details first');
      return;
    }

    setVehicles(prev => [
      ...prev,
      {
        registrationNumber: '',
        capacity: '',
      },
    ]);
  };

  const removeVehicle = (index: number) => {
    setVehicles(prev => prev.filter((_, i) => i !== index));
  };

  const updateRegistration = (text: string, index: number) => {
    const formatted = text
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    const updated = [...vehicles];
    updated[index].registrationNumber = formatted;

    setVehicles(updated);

    setVehicleErrors(prev => ({
      ...prev,
      [index]: '',
    }));

    if (vehicleDebounceRef.current[index]) {
      clearTimeout(vehicleDebounceRef.current[index]);
    }


  };

  const updateCapacity = (text: string, index: number) => {
    const updated = [...vehicles];
    updated[index].capacity = text;
    setVehicles(updated);
  };
  const [getVehicle, { data: validationData, isLoading, isError }] =
    useGetvehicleMutation();



  useFocusEffect(
    useCallback(() => {
      getVehicle();
    }, [])
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



  useEffect(() => {
    if (from !== 'temporary_dashboard') return;

    const pendingVehicles = vehicleData.filter(
      (vehicle: { IsVerified: any; }) => !vehicle.IsVerified
    );

    const allSkipped =
      pendingVehicles.length > 0 &&
      pendingVehicles.every((vehicle: { id: string; }) =>
        skippedVehicles.includes(vehicle.id)
      );

    if (allSkipped) {
      Alert.alert(
        'Completed',
        'All pending vehicles are skipped'
      );
    }
  }, [skippedVehicles, vehicleData, from]);

  const allCompleted = useMemo(() => {
    if (vehicleData.length === 0) return false;

    return vehicleData.every((vehicle: { IsVerified: any; id: string; }) => {
      const isVerified = vehicle.IsVerified;
      const isSkipped = skippedVehicles.includes(vehicle.id);

      return isVerified || isSkipped;
    });
  }, [vehicleData, skippedVehicles]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBackPress = () => {
    if (!allCompleted && from === 'temporary_dashboard') {
      Alert.alert(
        'Action Required',
        'Please verify or skip all vehicles before continuing.'
      );
      return;
    }

    navigation.goBack();
  };
  const handleSkip = (id: string) => {
    setSkippedVehicles(prev => [...prev, id]);
  };

  const handleAddVehicles = async () => {
    // Validation
    const hasEmptyFields = vehicles.some(
      vehicle =>
        !vehicle.registrationNumber.trim() ||
        !vehicle.capacity.trim(),
    );

    if (hasEmptyFields) {
      Alert.alert(
        'Validation',
        'Please fill all vehicle details.',
      );
      return;
    }

    try {
      const payload = {
        Vehicles: vehicles.map(vehicle => ({
          VehicleNo: vehicle.registrationNumber,
          LoadingCapacity: Number(vehicle.capacity),
        })),
      };

      const response = await addVehicle(payload).unwrap();

      if (response.status === '00') {
        Alert.alert('Success', response.message);

        // Refresh vehicle list
        getVehicle();

        // Clear form
        setVehicles([
          {
            registrationNumber: '',
            capacity: '',
          },
        ]);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Something went wrong',
      );
    }
  };
  /* ---------------- SEARCH FILTER ---------------- */

  const filteredVehicles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return vehicleData.filter((vehicle: { number: string; IsVerified: boolean; }) => {
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

  return (
    <>
      <AppHeader
        title="Validate Vehicles"
        onBackPress={handleBackPress}
      />

      <View
        style={[
          commonstyles.container,
          styles.vehiclecontainer,
        ]}
      >


        <View style={[commonstyles.row, styles.labelRow]}>
          <Text style={[commonstyles.flex1, styles.tableLabel, styles.registrationLabel]}>
            Registration Number
          </Text>

          <Text style={[commonstyles.flex1, styles.tableLabel, styles.capacityLabel]}>
            Loading Capacity
          </Text>

          <View style={{ width: 50 }} />
        </View>

        {vehicles.map((item, index) => {
          const isLast = index === vehicles.length - 1;
          const showError = vehicleErrors[index] || false;

          return (
            <View
              key={index}
              style={styles.rowContainer}
            >
              <View
                style={{
                  flex: 1,
                  width: 136,
                  height: 56,
                }}
              >
                <LocalInput
                  value={item.registrationNumber}
                  placeholder="eg MH02JM2623"
                  importantForAutofill="no"
                  onChangeText={text =>
                    updateRegistration(text, index)
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,
                  width: 136,
                  height: 56,
                }}
              >
                <LocalInput
                  value={item.capacity}
                  placeholder="20,000.000 KG"
                  keyboardType="numeric"
                  onChangeText={text =>
                    updateCapacity(text, index)
                  }
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.iconWrapper,
                  !isLast && styles.deleteIconWrapper
                ]}
                onPress={isLast ? addNewVehicle : () => removeVehicle(index)}
              >
                <MaterialIcons
                  name={isLast ? "add" : "delete"}
                  size={24}
                  color={isLast ? colors.primary : "#FF4444"}
                />
              </TouchableOpacity>
            </View>
          );
        })}

        <CustomButton
          title="Submit"
          style={styles.submitBtn}
          onPress={handleAddVehicles}
          textStyle={styles.text}
        />

<View style={styles.vehicleSecondContainer}>
        <Text style={styles.heading}>
          Validate Vehicle
        </Text>

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

              <Text style={styles.radioLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEARCH */}
        <SearchInput
          value={search}
          containerStyle={styles.seachinput}
          onChangeText={setsearch}
          placeholder="Search Vehicle By Number"
        />

        {/* LIST */}
        <CustomFlatList
          data={filteredVehicles}
          loading={isLoading}
          keyExtractor={(item) => item?.id.toString()}
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

  {/* STATUS - CENTER */}
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

  {/* ACTION */}
  {verified ? (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.verifiedButton}
      onPress={() =>
        navigation.navigate(
          from === 'temporary_dashboard'
            ? HOME_ROUTES.VERIFIEDVEHICLES_ONBOARD
            : HOME_ROUTES.VERIFIES_VEHICLES,
          {vehicle: item},
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

      {from === 'temporary_dashboard' && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.skipButton,
            isSkipped && styles.skippedButtonStyle,
          ]}
          disabled={isSkipped}
          onPress={() => handleSkip(item.id)}
        >
          <Text
            style={[
              styles.skipText,
              isSkipped && styles.skippedTextStyle,
            ]}
          >
            {isSkipped ? 'Skipped' : 'Skip'}
          </Text>
        </TouchableOpacity>
      )}

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

        <CustomModal visible={otpvisible} onClose={()=>setotpvisible(false)}>
        <OtpVerification  expirySeconds={120} otpLength={4} onSubmit={handlevehiclesubmit} />
        </CustomModal>
      </View>
      </View>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  vehiclecontainer: {
    backgroundColor: colors.background,
    marginTop: hp(2),
    padding: spacing.lg,
  },

  seachinput: {
    marginBottom: spacing.lg,
  },

  /* ---------------- CARD ---------------- */
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
vehicleInfo: {
  flex: 1,
  justifyContent: 'center',
  marginRight: 10,
},


  leftContainer: {
    flex: 1
  },

vehicleNumber: {
  fontSize: normalizeFont(18),
  fontWeight: '700',
  color: '#000000',
},



  /* ---------------- VERIFIED ---------------- */
  text: {
    fontSize: normalizeFont(24),
    fontWeight: '700'
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkCircle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    borderWidth: 2,
    borderColor: '#46B955',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: -wp(1.5),
    zIndex: 10,
    elevation: 5,
  },

  checkText: {
    color: '#46B955',
    fontSize: normalizeFont(14),
    fontWeight: 'semibold',
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

  skipButton: {
    backgroundColor: '#A7A7A7',
    width: 90,
    height: 25,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  skippedButtonStyle: {
    backgroundColor: '#CAB059',
    borderWidth: 1,
    borderColor: '#CAB059',
  },

  statusText: {
    color: '#2E5A99',
    fontSize: normalizeFont(13),
    fontWeight: 'semibold',
  },

  skipText: {
    color: '#fff',
    fontSize: normalizeFont(13),
    fontWeight: 'semibold',
  },

  skippedTextStyle: {
    color: '#fff',
  },

  disabledButton: {
    opacity: 0.6,
  },

  editIcon: {
    flex:1
    // position: 'absolute',
    // top: -2,
    // right: -3,
    // zIndex: 10,
  },

  addCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 15,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  addIcon: {
    marginLeft: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitBtn: {
    marginTop: 20,
    alignSelf: 'center',
    width: 166
  },
editButton: {
  width: 35,
  height: 35,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 5,
},
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 15,
    paddingHorizontal: spacing.lg,
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

  iconWrapper: {
    width: moderateScale(40),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(5),
    borderColor: colors.primary,
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(8),
  },

  deleteIconWrapper: {
    borderColor: '#FF4444',
  },

  labelRow: {
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateScale(2),
  },

  tableLabel: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#000000',
  },

  registrationLabel: {
    flex: 1,
    textAlign: 'left',
  },

  capacityLabel: {
    flex: 1,
    textAlign: 'left',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
    gap: moderateScale(20),
  },
  vehicleSecondContainer:{
    marginTop:verticalScale(35)
  }
});