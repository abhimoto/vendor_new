import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AppHeader from '@components/custumcomponents/AppHeader';
import CustomCard from '@components/cards/CustomCard';
import CustomDropdown from '@components/dropdown/CustomDropdown';
import commonstyles from '@utils/commonstyles';
import { colors } from '@utils/colors';
import spacing from '@utils/spacing';
import { truckBodyTypes, vehicleWeightRanges } from '@utils/constants';
import LocalInput from '@components/Inputs/LocalInput';
import { VehicleForm } from './types';
import CustomImagePicker from '@components/imagepicker/ImagePicker';
import CustomButton from '@components/buttons/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setVehicleAdded } from '@app/redux/slices/onboardingSlice';
import { useAppDispatch } from '@app/hooks/hooks';
import { wp, hp, moderateScale } from '@utils/responsive';
import { useVehicleverifyMutation } from '@app/redux/mutation/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';
import { vehicleSegments } from '@utils/constants';
import { setVehicleVerified } from '@app/redux/slices/AuthSlice';
import { Alert } from 'react-native';
import { HOME_ROUTES } from '@navigation/routes';

type RouteParams = {
  item: {
    vehicleid: string;
    number: string;
    status: string;
  };
  from?: 'temporary_dashboard' | 'dashboard';
};

export default function ValidateVehicles() {
  const vendorid = useSelector((state: RootState) => state.auth.user?.id);

  const dispatch = useAppDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { item, from } = route.params as RouteParams;
  const [validated, setValidated] = useState(false);
  const [vehicleverify] = useVehicleverifyMutation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const headerTitle = from === 'dashboard'
    ? 'Add / Verified'
    : 'Validate Vehicles'

  const [values, setValues] = useState<VehicleForm>({
    vehicleid: item?.fullData?.vehicleId || '',
    vendorid: vendorid || '',
    vehicleDetails: {
      registrationNo: item?.number || '',
      bodyType: '',
    },
    VehicleTypesDetails: {
      VehicleWeight: item?.fullData?.vehicleDetails?.vehicle_weight
        ? Number(item.fullData.vehicleDetails.vehicle_weight)
        : 0,
      vehicleType: '',
      height: '',
      width: '',
      length: '',
    },
    vehiclePhotos: {
      front_img: '',
      back_img: '',
      right_img: '',
      left_img: '',
    },
  });

  useEffect(() => {
    if (values.VehicleTypesDetails.VehicleWeight) {
      const type = getVehicleTypeByWeight(
        values.VehicleTypesDetails.VehicleWeight
      );

      setValues(prev => ({
        ...prev,
        VehicleTypesDetails: {
          ...prev.VehicleTypesDetails,
          vehicleType: type,
        },
      }));
    }
  }, []);

  const payload = {
    vendorid: values.vendorid,
    vehicleid: values.vehicleid,
    vehicleDetails: {
      registrationNo: values.vehicleDetails.registrationNo,
      bodyType: values.vehicleDetails.bodyType,
    },
    VehicleTypesDetails: {
      VehicleWeight: values.VehicleTypesDetails.VehicleWeight,
      vehicleType: values.VehicleTypesDetails.vehicleType,
      height: values.VehicleTypesDetails.height,
      width: values.VehicleTypesDetails.width,
      length: values.VehicleTypesDetails.length,
    },
    vehiclePhotos: {
      front_img: values.vehiclePhotos.front_img,
      back_img: values.vehiclePhotos.back_img,
      right_img: values.vehiclePhotos.right_img,
      left_img: values.vehiclePhotos.left_img,
    }
  };

  const getVehicleTypeByWeight = (weight: any) => {
    const w = Number(weight);

    const match = vehicleWeightRanges.find(
      item => w >= item.min && w <= item.max,
    );

    return match?.vehicleType || '';
  };
  // vehicle details
  const handleVehicleDetailsChange =
    (key: keyof VehicleForm['vehicleDetails']) => (value: string) => {
      setValues(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [key]: value,
        },
      }));
    };


  // vehicle type details
  const handleVehicleTypeChange =
    (key: keyof VehicleForm['VehicleTypesDetails']) => (value: string) => {
      setValues(prev => {
        const updated = {
          ...prev,
          VehicleTypesDetails: {
            ...prev.VehicleTypesDetails,
            [key]: key === 'VehicleWeight' ? Number(value) : value,
          },
        };

        if (key === 'VehicleWeight') {
          const type = getVehicleTypeByWeight(value);
          updated.VehicleTypesDetails.vehicleType = type;
        }

        return updated;
      });
    };

  const handleVehiclePhotoChange =
    (key: keyof VehicleForm['vehiclePhotos']) => (value: string) => {
      setValues(prev => ({
        ...prev,
        vehiclePhotos: {
          ...prev.vehiclePhotos,
          [key]: value,
        },
      }));
    };


  const handleSubmit = async () => {

    try {
      const images = [
        values.vehiclePhotos.front_img,
        values.vehiclePhotos.back_img,
        values.vehiclePhotos.right_img,
        values.vehiclePhotos.left_img,
      ];
      const uploadedImages = images.filter(
        img => img && img.trim() !== '',
      );
      if (uploadedImages.length < 2) {
        Alert.alert(
          'Validation',
          'Please upload at least 2 vehicle images',
        );

        return;
      }
      setLoading(true);
      setStatus('idle');
      console.log(payload)
      const resp = await vehicleverify(payload);

      if (resp?.data?.status === '00') {
        setStatus('success');

        dispatch(setVehicleVerified(true));
        Alert.alert(
          'Success',
          'Vehicle verified successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                if (from === 'temporary_dashboard') {
                  navigation.goBack();
                } else if (from === 'dashboard') {
                  navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                  });
                }
              },
            }
          ],
        );

      } else {
        setStatus('error');

        Alert.alert(
          'Verification Failed',
          resp?.data?.message || 'Unable to verify vehicle',
        );

        console.log('Vehicle Verify Error:', resp?.data?.message);
      }
    } catch (error) {
      setStatus('error');

      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
      );

      console.log('Vehicle Verify Exception:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[commonstyles.flex1, styles.validateconatiner]}>
      <AppHeader title={headerTitle} />


      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={commonstyles.center}>
          <CustomCard style={styles.formcontainer}>
            {/* Row 1 */}
            <View style={styles.row}>
              <View style={styles.fieldBox}>
                <Text style={styles.text}>Vehicle No:{values?.vehicleDetails.registrationNo}</Text>
              </View>

              <View style={styles.fieldBox}>
                <CustomDropdown
                  data={truckBodyTypes}
                  value={values.vehicleDetails.bodyType}
                  placeholder="Body Type"
                  onSelect={item =>
                    handleVehicleDetailsChange('bodyType')(item.value)
                  }


                />
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <View style={styles.fieldBox}>
                <LocalInput
                  label="Loading Capacity (Weight)"
                  value={String(values.VehicleTypesDetails.VehicleWeight)}
                  onChangeText={handleVehicleTypeChange('VehicleWeight')}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.fieldBox}>
                <LocalInput
                  label="Segment"
                  value={values.VehicleTypesDetails.vehicleType}
                  onChangeText={handleVehicleTypeChange('vehicleType')}
                  editable={!values.VehicleTypesDetails.VehicleWeight}

                />


              </View>
            </View>

            {/* Row 3 */}
            <View style={styles.dimensionRow}>
              <View style={styles.smallField}>
                <LocalInput
                  label="Dhala Length"
                  value={values.VehicleTypesDetails.length}
                  onChangeText={handleVehicleTypeChange('length')}
                  keyboardType="number-pad"
                  placeholder="Length"
                  // labelStyle={{
                  //   fontSize: moderateScale(13),
                  //   fontWeight: '600',
                  // }}
                />
              </View>

              <View style={styles.smallField}>
                <LocalInput
                  label=" Dhala Width"
                  value={values.VehicleTypesDetails.width}
                  onChangeText={handleVehicleTypeChange('width')}
                  keyboardType="number-pad"
                  placeholder="Width"
                  // labelStyle={{
                  //   fontSize: moderateScale(13),
                  //   fontWeight: '600',
                  // }}
                />
              </View>

              <View style={styles.smallField}>
                <LocalInput
                  label="Dhala Height"
                  value={values.VehicleTypesDetails.height}
                  onChangeText={handleVehicleTypeChange('height')}
                  keyboardType="number-pad"
                  placeholder="Height"
                  // labelStyle={{
                  //   fontSize: moderateScale(13),
                  //   fontWeight: '600',
                  // }}
                />
              </View>
            </View>

            {/* Image Section */}
            <Text style={styles.imageTitle}>Add Real Image Of Vehicle</Text>

            <View style={styles.column}>
              <CustomImagePicker
                label="Front Image"
                onImageSelected={handleVehiclePhotoChange('front_img')}
                containerStyle={{
                  height: hp(5),
                  marginBottom: moderateScale(8),
                }}
              />

              <CustomImagePicker
                label="Back Image"
                onImageSelected={handleVehiclePhotoChange('back_img')}
                containerStyle={{
                  height: hp(5),
                  marginBottom: moderateScale(8),
                }}
              />

              <CustomImagePicker
                label="Right Image"
                onImageSelected={handleVehiclePhotoChange('right_img')}
                containerStyle={{
                  height: hp(5),
                  marginBottom: moderateScale(8),
                }}
              />

              <CustomImagePicker
                label="Left Image"
                onImageSelected={handleVehiclePhotoChange('left_img')}

                containerStyle={{
                  height: hp(5),
                  marginBottom: moderateScale(8),
                }}
              />
            </View>

            {/* Validate Button */}
            <CustomButton
              title={
                loading
                  ? 'Validating...'
                  : status === 'success'
                    ? 'Verified'
                    : 'Validate'
              }
              textStyle={styles.buttontext}
              onPress={handleSubmit}
              style={[
                styles.button,
                status === 'success' && { backgroundColor: 'green' },
              ]}
              disabled={loading || status === 'success'}
            />
          </CustomCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  validateconatiner: {
    backgroundColor: colors.background,
  },

  text: {
    color: colors.primary,
    fontWeight: '700',
    marginTop: moderateScale(14),
    fontSize: moderateScale(14),
    // borderWidth: 1,
    padding: wp(2.5),
    // borderColor: colors.border,
    borderRadius: 6,
  },
  formcontainer: {
    width: wp(92),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(12),
    gap: moderateScale(8)
  },

  fieldBox: {
    flex: 1,
    marginVertical: moderateScale(8),
  },

  smallField: {
    flex: 1,
    marginHorizontal: moderateScale(2), // Add spacing between fields
  },

  imageTitle: {
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  button: {
    width: 213,
    height: 56,
    marginTop: hp(2),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  column: {
    width: '100%',
  },
  buttontext: {
    fontSize: 24
  },
  dimensionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(12),
    gap: moderateScale(6),
  },
});
