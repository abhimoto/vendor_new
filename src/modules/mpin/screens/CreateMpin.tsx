import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MpinInput from './../components/MpinInput';
import useMpin from './../hooks/useMpin';

import {
  wp,
  verticalScale,
  moderateScale,
  normalizeFont,
} from '@utils/responsive';
import { AUTH_ROUTES } from '@navigation/routes';
import { useCreateMpinMutation } from '@app/redux/mutation/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';
import { useAppDispatch } from '@app/hooks/hooks';
import { setMpinCreated } from '@app/redux/slices/AuthSlice';

interface CreateMpinProps {
  navigation: any;
}

const CreateMpin = ({navigation}: CreateMpinProps) => {
      const dispatch = useAppDispatch();
  const userId  = useSelector((state: RootState) => state.auth.user?.id);

  const {
    mpin,
    confirmMpin,
    setMpinValue,
    setConfirmMpinValue,
    validate,
  } = useMpin();
const [createMpin, {isLoading}] = useCreateMpinMutation();

const handleSubmit = async () => {
  const result = validate();

  if (!result.valid) {
    Alert.alert('MPIN', result.message);
    return;
  }

  if (!userId) {
    Alert.alert(
      'MPIN',
      'User information not found. Please login again.',
    );
    return;
  }

  try {
    const response = await createMpin({
      userId,
      mpin,
    }).unwrap();

    console.log('Create MPIN Response:', response);

    if (response?.Status === '00') {
      dispatch(setMpinCreated(true));

      Alert.alert(
        'MPIN',
        response?.Message || 'MPIN created successfully',
      );

      return;
    }

    if (response?.Status === '02') {
      Alert.alert(
        'MPIN',
        response?.Message || 'MPIN already created',
      );
      return;
    }

    Alert.alert(
      'MPIN',
      response?.Message || 'Failed to create MPIN',
    );
  } catch (error: any) {
    console.log('Create MPIN Error:', error);

    Alert.alert(
      'MPIN',
      error?.data?.Message ||
        error?.data?.message ||
        error?.message ||
        'Failed to create MPIN',
    );
  }
};

  const handleSkip = () => {
 Alert.alert('under process')
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Set MPIN</Text>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>
            Enter your 6 - digit security MPIN
          </Text>

          <MpinInput
            value={mpin}
            onChangeText={setMpinValue}
          />

          <Text style={styles.confirmLabel}>
            Confirm your 6 - digit security MPIN
          </Text>

          <MpinInput
            value={confirmMpin}
            onChangeText={setConfirmMpinValue}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
          
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.skipButton}
              onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateMpin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },

  title: {
    fontSize: normalizeFont(17),
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginTop: verticalScale(8),
  },

  form: {
    marginTop: verticalScale(24),
  },

  label: {
    fontSize: normalizeFont(12),
    color: '#222',
    marginBottom: verticalScale(9),
  },

  confirmLabel: {
    fontSize: normalizeFont(12),
    color: '#222',
    marginTop: verticalScale(22),
    marginBottom: verticalScale(9),
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(42),
  },

  skipButton: {
    width: wp(36),
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: '#315F9F',
    borderRadius: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  skipText: {
    color: '#315F9F',
    fontSize: normalizeFont(21),
    fontWeight: '700',
  },

  submitButton: {
    width: wp(36),
    height: verticalScale(40),
    backgroundColor: '#315F9F',
    borderRadius: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitText: {
    color: '#FFF',
    fontSize: normalizeFont(21),
    fontWeight: '700',
  },
});