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
console.log('vehicle from edit',vehicle)
const [registration, setRegistration] = useState(
  vehicle?.VehicleNo || ''
);

const [capacity, setCapacity] = useState(
  String(vehicle?.LoadingCapacity || '')
);


const handleSubmit = async () => {
  try {
    const payload = {
      VehicleId: vehicle.VehicleId,
      VehicleNo: registration,
      LoadingCapacity: Number(capacity),
    };

    const response = await editVehicle(payload).unwrap();

    const result = response?.[0];

    if (result?.Status === '00') {
      Alert.alert(
        'Success',
        result.Message,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess(); // Refresh list
              onClose();   // Close modal
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Error',
        result?.Message || 'Failed to update vehicle.',
      );
    }
  } catch (error: any) {
    Alert.alert(
      'Error',
      error?.data?.message ||
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