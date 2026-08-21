import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Rating } from 'react-native-ratings';
import LocalInput from '@components/Inputs/LocalInput';
import { useRoute } from '@react-navigation/native';
import { wp, hp, moderateScale } from '@utils/responsive';
import { colors } from '@utils/colors';
import AppHeader from '@components/custumcomponents/AppHeader';
import { useDiscontinueDriverMutation } from '@app/redux/mutation/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';

interface FormValues {
  drivername: string;
  mobileno: string;
  reason: string;
  rating: number;
  licenseno: string;
}

interface Props {
  navigation: any;
}

export default function DriverDiscontinue({ navigation }: Props) {
   const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );
  const route = useRoute();

  const { item } = route.params as any;

 const [values, setValues] = useState({
  drivername: item?.DriverName || '',
  mobileno: item?.MobileNo || '',
  licenseno: item?.LicenseNumber || '',
  reason: '',
  rating: 0,
});
const [discontinueDriver, { isLoading }] =
  useDiscontinueDriverMutation();

  const handleChange = (
    field: keyof FormValues,
    value: string | number,
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
    const payload = {
  DriverProfileId: item?.DriverProfileId,
  Remark: values.reason,
  RatingValue: values.rating,
};

      const response = await discontinueDriver(payload).unwrap();

      if(response.status ==='00')
        Alert.alert(response.message)
  
       navigation.goBack();
  
    } catch (error) {
      Alert.alert(error);
    }
  };

 
  return (
    <View style={styles.container}>
      <AppHeader title="DriverDiscontinue" />

      <View style={styles.content}>
        <LocalInput
          label="Driver Name"
          value={values.drivername}
          onChangeText={text => handleChange('drivername', text)}
        />

        <LocalInput
          label="Mobile Number"
          value={values.mobileno}
          onChangeText={text => handleChange('mobileno', text)}
          keyboardType="phone-pad"
        />

        <LocalInput
          label="License No"
          value={values.licenseno}
          onChangeText={text => handleChange('licenseno', text)}
        />

        <LocalInput
          label="Reason"
          value={values.reason}
          onChangeText={text => handleChange('reason', text)}
          multiline
          numberOfLines={4}
          style={styles.reasonInput}
        />

        <Text style={styles.label}>Driver Rating</Text>

        <View style={styles.ratingCard}>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={34}
            startingValue={values.rating}
            onFinishRating={(rating: number) =>
              handleChange('rating', rating)
            }
          />

          <Text style={styles.ratingText}>
            {values.rating} / 5
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}>
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },

  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: hp(1),
  },

  reasonInput: {
    minHeight: hp(12),
  },

  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: moderateScale(10),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },

  ratingText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#444',
  },

  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    width: 213,
    height: 56,

    marginHorizontal: wp(5),
    marginTop: hp(3),

    backgroundColor: colors.primary,

    borderRadius: moderateScale(10),

    elevation: 3,
  },

  submitButtonText: {
    color: '#fff',

    fontWeight: '700',

    fontSize: moderateScale(18),

    lineHeight: moderateScale(22),

    textAlign: 'center',

    includeFontPadding: false,
  },
});