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
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';

type HomeStackParamList = {
  ValidateVehicles: { vehicleno: string };
};

export default function AddVehicle() {
  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );
  const route = useRoute<any>();
  const from = route?.params?.from;
  console.log(from)
  const navigation = useNavigation<any>();
  const [skippedVehicles, setSkippedVehicles] = useState<string[]>([]);
  const [search, setsearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  /* ---------------- API ---------------- */

  const [getVehicle, { data: validationData, isLoading, isError }] =
    useGetvehicleMutation();

useFocusEffect(
  useCallback(() => {
    if (vendorid) {
      getVehicle({ vendorid });
    }
  }, [vendorid])
);

  /* ---------------- VEHICLE DATA ---------------- */

  const vehicleData = useMemo(() => {
    if (
      !validationData?.data ||
      !Array.isArray(validationData.data)
    ) {
      return [];
    }

    return validationData.data.map(
      (item: any, index: number) => ({
        id: `${item?.vehicleId || 'vehicle'}-${index}`,

        number:
          item?.vehicleDetails?.registration_no || '',

        status:
          item?.vehicleDetails?.verify_flag === 'Y'
            ? 'verified'
            : 'pending',

        fullData: item,
      }),
    );
  }, [validationData]);

useEffect(() => {
  if (from !== 'temporary_dashboard') return;

  const pendingVehicles = vehicleData.filter(
    vehicle => vehicle.status !== 'verified'
  );

  const allSkipped =
    pendingVehicles.length > 0 &&
    pendingVehicles.every(vehicle =>
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

    return vehicleData.every(vehicle => {
      const isVerified = vehicle.status === 'verified';
      const isSkipped = skippedVehicles.includes(vehicle.id);

      return isVerified || isSkipped;
    });
  }, [vehicleData, skippedVehicles]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // useEffect(() => {
  //   if (!allCompleted) {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //       timeoutRef.current = null;
  //     }
  //     return;
  //   }

  //   timeoutRef.current = setTimeout(() => {
  //     if (navigation.canGoBack()) {
  //       navigation.goBack();
  //     }
  //   }, 2000);

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [allCompleted, navigation]);

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

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredVehicles = useMemo(() => {
    return vehicleData.filter((vehicle: { number: string }) =>
      vehicle.number
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, vehicleData]);

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
        {/* SEARCH */}
        <SearchInput
          value={search}
          containerStyle={styles.seachinput}
          onChangeText={setsearch}
          placeholder="Enter Vehicle Number"
        />

        {/* LIST */}
        <CustomFlatList
          data={filteredVehicles}
          loading={isLoading}
          keyExtractor={(item) => item?.id.toString()}
          renderItem={({ item }: any) => {

            const isSkipped = skippedVehicles.includes(item.id);
            const verified = item.status === 'verified';

            return (
              <View style={styles.card}>
                {!verified && (
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setSelectedVehicle(item);
                      setModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="edit" size={18} color="#3E5B93" />
                  </TouchableOpacity>
                )}
                {/* LEFT SECTION */}
                <View style={styles.leftContainer}>
                  <Text style={styles.vehicleNumber}>
                    {item.number}
                  </Text>

                  <Text style={styles.subtitle}>
                    {verified
                      ? 'Vehicle Verified Successfully'
                      : isSkipped
                        ? 'Vehicle skipped'
                        : 'Vehicle needs to be validated'}
                  </Text>
                </View>

                {/* RIGHT SECTION */}
                {verified ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.verifiedContainer}
                    onPress={() =>
                      navigation.navigate(
                        from === 'temporary_dashboard'
                          ? HOME_ROUTES.VERIFIEDVEHICLES_ONBOARD
                          : HOME_ROUTES.VERIFIES_VEHICLES,
                        { vehicle: item }
                      )
                    }
                  >
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkText}>
                        ✓
                      </Text>
                    </View>

                    <View style={styles.verifiedButton}>
                      <Text style={styles.statusText}>
                        Verified
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.pendingContainer}>
                    {/* VALIDATE BUTTON */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.validateButton,

                      ]}
                      disabled={isSkipped}
                      onPress={() => {
                        navigation.navigate(
                          HOME_ROUTES.VALIDATE_VEHICLES,
                          {
                            item,
                            from,
                          },
                        );
                      }}
                    >
                      <Text style={styles.statusText}>
                        Validate
                      </Text>
                    </TouchableOpacity>

                    {/* SHOW SKIP ONLY FOR TEMP DASHBOARD */}
                    {from === 'temporary_dashboard' && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.skipButton,
                          isSkipped && styles.skippedButtonStyle
                        ]}
                        disabled={isSkipped}
                        onPress={() => handleSkip(item.id)}
                      >
                        <Text style={[
                          styles.skipText,
                          isSkipped && styles.skippedTextStyle
                        ]}>
                          {isSkipped ? 'Skipped' : 'Skip'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <EditVehicles
          vehicle={selectedVehicle}
          onClose={() => setModalVisible(false)}
          onSuccess={() => {
            getVehicle({ vendorid });
          }}
        />
      </CustomModal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#F7F7F7',

    paddingVertical: hp(2),
    paddingHorizontal: wp(4),

    marginBottom: hp(1.5),

    borderWidth: 1,
    borderColor: '#DCDCDC',

    position: 'relative',
  },

  leftContainer: {
    flex: 1,
    paddingRight: wp(3),
  },

  vehicleNumber: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    color: '#3E5B93',
  },

  subtitle: {
    marginTop: hp(0.5),
    fontSize: normalizeFont(11),
    color: '#A0A0A0',
  },

  /* ---------------- VERIFIED ---------------- */

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
    width:114,
    height:25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------------- PENDING ---------------- */

  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  validateButton: {
    backgroundColor: '#3E5B93',
    borderRadius: 3,
    width: 101, // Reduced width to match skip button
    height: 25, // Increased height for better visibility
    alignItems: 'center',
    justifyContent: 'center', // Added for vertical centering
    marginRight: wp(2),
  },

  skipButton: {
    backgroundColor: '#A7A7A7',
    width: 90,
    height: 25, // Increased height for better visibility
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center', // Added for vertical centering
  },

  skippedButtonStyle: {
    backgroundColor: '#888888', // Darker gray for skipped state
    borderWidth: 1,
    borderColor: '#888888',
  },

  statusText: {
    color: '#fff',
    fontSize: normalizeFont(13), // Slightly reduced to fit better
    fontWeight: 'semibold',
  },

  skipText: {
    color: '#fff',
    fontSize: normalizeFont(13), // Consistent size
    fontWeight: 'semibold',
  },

  skippedTextStyle: {
    color: '#ffffff', // Lighter text for skipped state
  },

  disabledButton: {
    opacity: 0.6,
  },

  editIcon: {
    position: 'absolute',
    top: -2,
    right: -3,
    zIndex: 10,
  },
});