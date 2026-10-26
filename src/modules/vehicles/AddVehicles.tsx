import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LocalInput from '@components/Inputs/LocalInput';
import CustomButton from '@components/buttons/CustomButton';

import spacing from '@utils/spacing';
import { colors } from '@utils/colors';

import {
  normalizeFont,
  moderateScale,
} from '@utils/responsive';

import { useAddvehicleMutation } from '@app/redux/mutation/authApi';

interface Vehicle {
  registrationNumber: string;
  capacity: string;
}

interface AddVehiclesProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddVehicles: React.FC<AddVehiclesProps> = ({
  onClose,
  onSuccess,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      registrationNumber: '',
      capacity: '',
    },
  ]);

  const [addVehicle, { isLoading }] = useAddvehicleMutation();

  /* =========================================================
     ADD NEW VEHICLE
  ========================================================= */

  const addNewVehicle = () => {
    const last = vehicles[vehicles.length - 1];

    if (
      !last.registrationNumber.trim() ||
      !last.capacity.trim()
    ) {
      Alert.alert(
        'Validation',
        'Please fill vehicle details first.',
      );
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

  /* =========================================================
     REMOVE VEHICLE
  ========================================================= */

  const removeVehicle = (index: number) => {
    setVehicles(prev =>
      prev.filter((_, i) => i !== index),
    );
  };

  /* =========================================================
     UPDATE REGISTRATION NUMBER
  ========================================================= */

  const updateRegistration = (
    text: string,
    index: number,
  ) => {
    const formatted = text
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    setVehicles(prev =>
      prev.map((vehicle, i) =>
        i === index
          ? {
              ...vehicle,
              registrationNumber: formatted,
            }
          : vehicle,
      ),
    );
  };

  /* =========================================================
     UPDATE CAPACITY
  ========================================================= */

  const updateCapacity = (
    text: string,
    index: number,
  ) => {
    const formatted = text.replace(/[^0-9]/g, '');

    setVehicles(prev =>
      prev.map((vehicle, i) =>
        i === index
          ? {
              ...vehicle,
              capacity: formatted,
            }
          : vehicle,
      ),
    );
  };

  /* =========================================================
     SUBMIT VEHICLES
  ========================================================= */

  const handleAddVehicles = async () => {
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

    const hasInvalidCapacity = vehicles.some(
      vehicle =>
        !Number.isFinite(Number(vehicle.capacity)) ||
        Number(vehicle.capacity) <= 0,
    );

    if (hasInvalidCapacity) {
      Alert.alert(
        'Validation',
        'Please enter a valid loading capacity.',
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
        Alert.alert(
          'Success',
          response.message,
        );

        onSuccess();
        onClose();
      } else {
        Alert.alert(
          'Error',
          response.message,
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message ||
          'Something went wrong.',
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <View style={styles.container}>

      {/* =====================================================
          TITLE
      ===================================================== */}

      <Text style={styles.title}>
        Add Vehicle
      </Text>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.labelRow}>

        {/* REGISTRATION HEADER */}

        <View style={styles.registrationContainer}>
          <Text style={styles.label}>
           Vehicle Number
          </Text>
        </View>

        {/* CAPACITY HEADER */}

        <View style={styles.capacityContainer}>
          <Text style={styles.label}>
            Loading Capacity
          </Text>
        </View>

        {/* ICON SPACE */}

        <View style={styles.iconSpace} />

      </View>

      {/* =====================================================
          VEHICLE ROWS
      ===================================================== */}

      {vehicles.map((item, index) => {
        const isLast =
          index === vehicles.length - 1;

        return (
          <View
            key={index}
            style={styles.rowContainer}
          >

            {/* =================================================
                REGISTRATION NUMBER
            ================================================= */}

            <View style={styles.registrationContainer}>

              <LocalInput
                value={item.registrationNumber}
                placeholder="MH02JM2623"
                importantForAutofill="no"
                autoCapitalize="characters"
                onChangeText={text =>
                  updateRegistration(
                    text,
                    index,
                  )
                }
                style={styles.input}
              />

            </View>

            {/* =================================================
                LOADING CAPACITY
            ================================================= */}

            <View style={styles.capacityContainer}>

              <LocalInput
                value={item.capacity}
                placeholder="20000 KG"
                keyboardType="numeric"
                onChangeText={text =>
                  updateCapacity(
                    text,
                    index,
                  )
                }
                style={styles.input}
              />

            </View>

            {/* =================================================
                ADD / DELETE BUTTON
            ================================================= */}

            {/* <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.iconWrapper,
                !isLast &&
                  styles.deleteIconWrapper,
              ]}
              onPress={
                isLast
                  ? addNewVehicle
                  : () =>
                      removeVehicle(index)
              }
            >

              <MaterialIcons
                name={
                  isLast
                    ? 'add'
                    : 'delete'
                }
                size={22}
                color={
                  isLast
                    ? colors.primary
                    : '#FF4444'
                }
              />

            </TouchableOpacity> */}

          </View>
        );
      })}

      {/* =====================================================
          SUBMIT BUTTON
      ===================================================== */}

      <CustomButton
        title="Save"
        style={styles.submitBtn}
        onPress={handleAddVehicles}
        textStyle={styles.buttonText}
        loading={isLoading}
      />

    </View>
  );
};

export default AddVehicles;

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({

  /* ==========================================================
     MAIN CONTAINER
  ========================================================== */

  container: {
    width: '50%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: 12,
  },

  /* ==========================================================
     TITLE
  ========================================================== */

  title: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  /* ==========================================================
     HEADER ROW
  ========================================================== */

  labelRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },

  label: {
    fontSize: normalizeFont(12),
    fontWeight: '700',
    color: '#000000',
  },

  /* ==========================================================
     REGISTRATION COLUMN

     48% of available width
  ========================================================== */

  registrationContainer: {
    width: '48%',
    marginRight: moderateScale(6),
  },

  /* ==========================================================
     CAPACITY COLUMN

     38% of available width
  ========================================================== */

  capacityContainer: {
    width: '38%',
    marginRight: moderateScale(6),
  },

  /* ==========================================================
     INPUT
  ========================================================== */

  input: {
    width: '100%',
    alignSelf: 'stretch',
  },

  /* ==========================================================
     VEHICLE ROW
  ========================================================== */

  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },

  /* ==========================================================
     ICON SPACE
  ========================================================== */

  iconSpace: {
    width: moderateScale(32),
  },

  /* ==========================================================
     ADD / DELETE BUTTON
  ========================================================== */

  iconWrapper: {
    width: moderateScale(32),
    height: moderateScale(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 8,
  },

  deleteIconWrapper: {
    borderColor: '#FF4444',
  },

  /* ==========================================================
     SUBMIT
  ========================================================== */

  submitBtn: {
    backgroundColor: colors.primary,
    marginTop: 20,
    alignSelf: 'center',
    width: 166,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: normalizeFont(16),
    fontWeight: '700',
  },

});