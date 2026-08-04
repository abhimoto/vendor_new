import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { colors } from '@utils/colors';
import { hp, wp } from '@utils/responsive';
import LocalInput from '@components/Inputs/LocalInput';
import { useVehicleeditMutation } from '@app/redux/mutation/authApi';

type Props = {
  vehicle: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditVehicles({
  vehicle,
  onClose,
  onSuccess,
}: Props) {
  // ✅ RTK Mutation
  const [editVehicle, { isLoading }] =
    useVehicleeditMutation();

  const [registration, setRegistration] = useState(
    vehicle?.number ||
    vehicle?.fullData?.vehicleDetails
      ?.registration_no ||
    '',
  );

  const [capacity, setCapacity] = useState(
    vehicle?.fullData?.vehicleDetails
      ?.vehicle_weight || '',
  );


const handleSubmit = async () => {
  try {
    const payload = {
      vendorid: vehicle?.fullData?.vendorid,
      vehicles: [
        {
          vehicleid:
            vehicle?.fullData?.vehicleId,
          vehicleWeight: capacity,
          registrationNo: registration,
        },
      ],
    };

    const response = await editVehicle(
      payload,
    ).unwrap();
console.log(response)
    if (response.status === '00') {
      Alert.alert(
        'Success',
        response.message,
      );
    }

    onSuccess();
    onClose();
  } catch (error: any) {
    Alert.alert(
      'Error',
      error?.message ||
        'Something went wrong',
    );
  }
};
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <LocalInput
          label="Vehicle Registration Number"
          value={registration}
          onChangeText={(text: string) =>
            setRegistration(text.toUpperCase())
          }
        />
      </View>

      <View style={styles.inputWrapper}>
        <LocalInput
          label="Loading Capacity"
          value={capacity}
          keyboardType="numeric"
          onChangeText={(text: string) =>
            setCapacity(text)
          }
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Updating...' : 'Done'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    gap: hp(2),
    alignItems: 'center',
  },

  inputWrapper: {
    width: wp(90),
  },

  button: {
    marginTop: hp(4),
    alignSelf: 'center',
    backgroundColor: colors.primary,
    width: wp(40),
    height: hp(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});