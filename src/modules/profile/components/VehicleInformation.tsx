import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LocalInput from '@components/Inputs/LocalInput';
import commonstyles from '@utils/commonstyles';

import {
  Vehicle,
} from '../types/profileTypes';

import {profileStyles} from '../styles/profileStyles';

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

  const addVehicle = () => {

    const lastVehicle =
      vehicles[vehicles.length - 1];

    if (
      !lastVehicle.registrationNo ||
      !lastVehicle.vehicleWeight
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
        vehicleid:
          `VEH00${prev.length + 1}`,

        vendorid,

        vehicleWeight: '',

        registrationNo: '',
      },
    ]);
  };

  const removeVehicle = (
    index: number,
  ) => {

    if (vehicles.length === 1) {

      Alert.alert(
        'Vehicle',
        'At least one vehicle is required.',
      );

      return;
    }

    setVehicles(prev =>
      prev.filter(
        (_, i) => i !== index,
      ),
    );
  };

  const updateVehicle = (
    index: number,
    key: keyof Vehicle,
    value: string,
  ) => {

    setVehicles(prev =>
      prev.map(
        (vehicle, i) =>
          i === index
            ? {
                ...vehicle,
                [key]: value,
              }
            : vehicle,
      ),
    );
  };

  const handleUpdate = () => {

    console.log(
      'Vehicle Update:',
      vehicles,
    );

    Alert.alert(
      'Success',
      'Vehicles Updated Successfully',
    );
  };

  return (
    <View
      style={[
        commonstyles.container,
        commonstyles.p20,
      ]}>

      {/* HEADER */}

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

      {/* VEHICLES */}

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
                      text.toUpperCase(),
                    )
                  }
                />

              </View>

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
                      text,
                    )
                  }
                />

              </View>

              <View
                style={
                  profileStyles.iconWrapper
                }>

                {isLast ? (

                  <TouchableOpacity
                    onPress={addVehicle}>

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

      {/* UPDATE */}

      <TouchableOpacity
        style={
          profileStyles.updateButton
        }
        onPress={handleUpdate}>

        <Text
          style={
            profileStyles.updateButtonText
          }>
          Update Vehicles
        </Text>

      </TouchableOpacity>

    </View>
  );
}