import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LocalInput from '@components/Inputs/LocalInput';
import commonstyles from '@utils/commonstyles';

import {Vehicle} from '../types/profileTypes';
import {profileStyles} from '../styles/profileStyles';
import {useVehicleActions} from '../hooks/useVehicleActions';

interface Props {
  vehicles: Vehicle[];

  setVehicles: React.Dispatch<
    React.SetStateAction<Vehicle[]>
  >;

  vendorid: string;
}

export default function VehicleInformation({
  vehicles,
  setVehicles,
  vendorid,
}: Props) {
  const {
    addVehicles,
    isAddingVehicle,
  } = useVehicleActions();

  /* ---------------- ADD VEHICLE ROW ---------------- */

  const addVehicle = () => {
    const lastVehicle =
      vehicles[vehicles.length - 1];

    if (
      !lastVehicle.registrationNo?.trim() ||
      !lastVehicle.vehicleWeight?.trim()
    ) {
      Alert.alert(
        'Validation',
        'Please enter vehicle details first.',
      );

      return;
    }

    setVehicles(prev => [
      ...prev,
      {
        vehicleid: `VEH00${prev.length + 1}`,
        vendorid,
        vehicleWeight: '',
        registrationNo: '',
      },
    ]);
  };

  /* ---------------- REMOVE VEHICLE ---------------- */

  const removeVehicle = (index: number) => {
    if (vehicles.length === 1) {
      Alert.alert(
        'Vehicle',
        'At least one vehicle is required.',
      );

      return;
    }

    setVehicles(prev =>
      prev.filter((_, i) => i !== index),
    );
  };

  /* ---------------- UPDATE VEHICLE ---------------- */

  const updateVehicle = (
    index: number,
    key: keyof Vehicle,
    value: string,
  ) => {
    setVehicles(prev =>
      prev.map((vehicle, i) =>
        i === index
          ? {
              ...vehicle,
              [key]: value,
            }
          : vehicle,
      ),
    );
  };

  /* ---------------- UPDATE API ---------------- */

  const handleUpdate = async () => {
    /*
     * Validate empty fields
     */
    const hasEmptyVehicle = vehicles.some(
      vehicle =>
        !vehicle.registrationNo?.trim() ||
        !vehicle.vehicleWeight?.trim(),
    );

    if (hasEmptyVehicle) {
      Alert.alert(
        'Validation',
        'Please enter registration number and loading capacity for all vehicles.',
      );

      return;
    }

    /*
     * Validate loading capacity
     */
    const hasInvalidCapacity = vehicles.some(
      vehicle => {
        const capacity = Number(
          vehicle.vehicleWeight,
        );

        return (
          !Number.isFinite(capacity) ||
          capacity <= 0
        );
      },
    );

    if (hasInvalidCapacity) {
      Alert.alert(
        'Validation',
        'Please enter a valid loading capacity.',
      );

      return;
    }

    /*
     * Call custom hook
     */
    const result = await addVehicles(
      vehicles,
    );

    /*
     * API success
     */
    if (result.success) {
      Alert.alert(
        'Success',
        result.data?.message ||
          'Vehicles added successfully.',
      );

      /*
       * Reset form
       */
      setVehicles([
        {
          vehicleid: 'VEH001',
          vendorid,
          vehicleWeight: '',
          registrationNo: '',
        },
      ]);

      return;
    }

    /*
     * API error
     */
    Alert.alert(
      'Error',
      result.error ||
        'Unable to add vehicles.',
    );
  };

  return (
    <View
      style={[
        commonstyles.container,
        commonstyles.p20,
      ]}>

      {/* ---------------- HEADER ---------------- */}

      <View
        style={[
          commonstyles.row,
          profileStyles.labelRow,
        ]}>

        <Text
          style={[
            commonstyles.flex1,
            profileStyles.tableLabel,
          ]}>
          Registration Number
        </Text>

        <Text
          style={[
            commonstyles.flex1,
            profileStyles.tableLabel,
          ]}>
          Loading Capacity
        </Text>

        <View
          style={{
            width: 40,
          }}
        />

      </View>

      {/* ---------------- VEHICLES ---------------- */}

      {vehicles.map(
        (vehicle, index) => {
          const isLast =
            index ===
            vehicles.length - 1;

          return (
            <View
              key={
                vehicle.vehicleid ||
                index
              }
              style={
                profileStyles.row
              }>

              {/* REGISTRATION NUMBER */}

              <View
                style={
                  profileStyles.flexInput
                }>

                <LocalInput
                  label=""
                  value={
                    vehicle.registrationNo
                  }
                  placeholder="MH02AB1234"
                  onChangeText={text =>
                    updateVehicle(
                      index,
                      'registrationNo',
                      text
                        .toUpperCase()
                        .replace(
                          /[^A-Z0-9]/g,
                          '',
                        ),
                    )
                  }
                />

              </View>

              {/* LOADING CAPACITY */}

              <View
                style={
                  profileStyles.flexInput
                }>

                <LocalInput
                  label=""
                  value={
                    vehicle.vehicleWeight
                  }
                  placeholder="12000 KG"
                  keyboardType="numeric"
                  onChangeText={text =>
                    updateVehicle(
                      index,
                      'vehicleWeight',
                      text.replace(
                        /[^0-9.]/g,
                        '',
                      ),
                    )
                  }
                />

              </View>

              {/* ADD / DELETE */}

              <View
                style={
                  profileStyles.iconWrapper
                }>

                {isLast ? (
                  <TouchableOpacity
                    onPress={addVehicle}
                    disabled={
                      isAddingVehicle
                    }>

                    <Text
                      style={
                        profileStyles.addIcon
                      }>
                      ＋
                    </Text>

                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      removeVehicle(
                        index,
                      )
                    }
                    disabled={
                      isAddingVehicle
                    }>

                    <Text
                      style={
                        profileStyles.deleteIcon
                      }>
                      ✕
                    </Text>

                  </TouchableOpacity>
                )}

              </View>

            </View>
          );
        },
      )}

      {/* ---------------- UPDATE ---------------- */}

      <TouchableOpacity
        style={[
          profileStyles.updateButton,
          isAddingVehicle && {
            opacity: 0.6,
          },
        ]}
        onPress={handleUpdate}
        disabled={isAddingVehicle}>

        <Text
          style={
            profileStyles.updateButtonText
          }>
          {isAddingVehicle
            ? 'Adding Vehicles...'
            : 'Update Vehicles'}
        </Text>

      </TouchableOpacity>

    </View>
  );
}