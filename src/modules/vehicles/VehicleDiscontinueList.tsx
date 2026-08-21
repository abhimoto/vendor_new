import CustomButton from '@components/buttons/CustomButton';
import AppHeader from '@components/custumcomponents/AppHeader';
import CustomInput from '@components/Inputs/CustomInput';

import {useNavigation, useRoute} from '@react-navigation/native';

import {colors} from '@utils/colors';
import commonstyles from '@utils/commonstyles';

import {
  hp,
  moderateScale,
  normalizeFont,
  wp,
} from '@utils/responsive';

import {Formik} from 'formik';

import {
  Alert,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import {Rating} from 'react-native-ratings';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import React, {useState} from 'react';

import {useDeletevehicleMutation} from '@app/redux/mutation/authApi';

export default function VehicleDiscontinueList() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const vehicle = route.params?.vehicle;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteVehicle] = useDeletevehicleMutation();


  return (
    <View style={commonstyles.container}>

      <AppHeader title="Discontinue Vehicle" />

      <Formik
        initialValues={{
          vehcleno: vehicle?.VehicleNo || '',
          reason: '',
          rating: 0,
        }}

        onSubmit={async values => {
          try {
            setIsSubmitting(true);

            // --------------------------------
            // API Payload
            // --------------------------------

            const payload = {
              VehicleId: vehicle?.VehicleId || '',
              Remark: values.reason || '',
              RatingValue: values.rating || 0,
            };

            console.log(
              'Discontinue Vehicle Payload:',
              payload,
            );

            const response =
              await deleteVehicle(payload).unwrap();

            // --------------------------------
            // Success
            // --------------------------------

            if (response?.status === '00') {
              Alert.alert(
                'Success',
                response?.message ||
                  'Vehicle discontinued successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ],
              );

              return;
            }

            // --------------------------------
            // Failed
            // --------------------------------

            Alert.alert(
              'Failed',
              response?.message ||
                'Unable to discontinue vehicle.',
            );

          } catch (error: any) {

            console.log(
              'Discontinue Vehicle Error:',
              error,
            );

            Alert.alert(
              'Error',
              error?.data?.message ||
                error?.message ||
                'Something went wrong.',
            );

          } finally {
            setIsSubmitting(false);
          }
        }}>

        {({
          handleSubmit,
          setFieldValue,
          values,
        }) => (
          <View style={commonstyles.p20}>

            {/* VEHICLE NUMBER */}

            <CustomInput
              name="vehcleno"
              label="Vehicle Number"
              editable={false}
            />

            {/* ARROW */}

            <View style={styles.icon}>
              <MaterialIcons
                name="open-in-full"
                size={30}
                color="#000"
              />
            </View>

            {/* VEHICLE DETAILS */}

            <View style={styles.vehicleInfo}>

              <Text style={styles.vehicleInfoText}>
                Vehicle ID: {vehicle?.VehicleId || '-'}
              </Text>

              <Text style={styles.vehicleInfoText}>
                Vehicle Type: {vehicle?.VehicleType || '-'}
              </Text>

              <Text style={styles.vehicleInfoText}>
                Body Type: {vehicle?.BodyType || '-'}
              </Text>

              <Text style={styles.vehicleInfoText}>
                Loading Capacity:{' '}
                {vehicle?.LoadingCapacity || '-'}
              </Text>

            </View>

            {/* REASON */}

            <CustomInput
              name="reason"
              label="Reason"
              style={styles.input}
            />

            {/* ⭐ Rating */}

            <Text style={styles.label}>
              Vehicle Rating
            </Text>

            <View style={styles.ratingCard}>

              <Rating
                type="star"
                ratingCount={5}
                imageSize={moderateScale(26)}
                startingValue={values.rating}
                onFinishRating={(rating: number) =>
                  setFieldValue('rating', rating)
                }
              />

              <Text style={styles.ratingText}>
                {values.rating} / 5
              </Text>

            </View>

            {/* SUBMIT */}

            <CustomButton
              title={
                isSubmitting
                  ? 'Submitting...'
                  : 'Submit'
              }
              style={styles.button}
              textStyle={styles.submit}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            />

          </View>
        )}

      </Formik>

    </View>
  );
}

const styles = StyleSheet.create({

  vehicleInfo: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  vehicleInfoText: {
    fontSize: normalizeFont(12),
    color: '#555',
    marginVertical: hp(0.4),
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: moderateScale(1),
    borderColor: colors.border,
    borderRadius: moderateScale(10),
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },

  ratingText: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: '#444',
  },

  label: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    marginBottom: hp(0.8),
    color: colors.text,
  },

  input: {
    minHeight: hp(7),
  },

  icon: {
    alignItems: 'center',
    transform: [{rotate: '-45deg'}],
    paddingVertical: wp(2),
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 213,
    height: 56,
  },

  submit: {
    fontSize: 24,
  },

});