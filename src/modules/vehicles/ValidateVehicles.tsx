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
import { useAppDispatch } from '@app/hooks/hooks';
import { wp, hp, moderateScale } from '@utils/responsive';
import { useVehicleverifyMutation } from '@app/redux/mutation/authApi';
import { setVehicleVerified } from '@app/redux/slices/AuthSlice';
import { Alert } from 'react-native';
import SecondaryButton from '@components/buttons/SecondaryButton';

type RouteParams = {
  item: {
    vehicleid: string;
    number: string;
    status: string;
  };
  from?: 'temporary_dashboard' | 'dashboard';
};

export default function ValidateVehicles() {

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

  const [values, setValues] = useState<any>({
    vehicleid: item?.VehicleId || '',

    vehicleDetails: {
      registrationNo: item?.VehicleNo || '',
      bodyType: '',
    },

    VehicleTypesDetails: {
      VehicleWeight: item?.LoadingCapacity
        ? Number(item.LoadingCapacity)
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
    (key: keyof VehicleForm['vehiclePhotos']) =>
      (image: any) => {
        setValues(prev => ({
          ...prev,
          vehiclePhotos: {
            ...prev.vehiclePhotos,
            [key]: image,
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
        img => img && img.uri,
      );
      console.log(values.vehiclePhotos);
      if (uploadedImages.length < 1) {
        Alert.alert(
          'Validation',
          'Please upload at least 1 vehicle image',
        );
        return;
      }



      setLoading(true);
      setStatus('idle');

      const formData = new FormData();

      formData.append(
        'rc_number',
        values.vehicleDetails.registrationNo,
      );

      formData.append(
        'LoadingCapacity',
        String(values.VehicleTypesDetails.VehicleWeight),
      );

      formData.append(
        'BodyType',
        values.vehicleDetails.bodyType,
      );

      formData.append(
        'DhalaLength',
        String(values.VehicleTypesDetails.length),
      );

      formData.append(
        'DhalaWidth',
        String(values.VehicleTypesDetails.width),
      );

      formData.append(
        'DhalaHeight',
        String(values.VehicleTypesDetails.height),
      );


      // Images

      const appendImage = (key: string, image: any) => {
        if (!image?.uri) return;

        formData.append(key, {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `${key}.jpg`,
        } as any);
      };


      appendImage(
        'FrontImage',
        values.vehiclePhotos.front_img,
      );

      appendImage(
        'BackImage',
        values.vehiclePhotos.back_img,
      );

      appendImage(
        'LeftImage',
        values.vehiclePhotos.left_img,
      );

      appendImage(
        'RightImage',
        values.vehiclePhotos.right_img,
      );


      // RTK Query unwrap
      const resp = await vehicleverify(formData).unwrap();




      console.log(
        'Vehicle Verify Response:',
        resp,
      );


      if (resp?.status === '00') {

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

                }
                else if (from === 'dashboard') {

                  navigation.getParent()?.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'Dashboard',
                      },
                    ],
                  });

                }

              },
            },
          ],
        );

      }


    } catch (error: any) {

      setStatus('error');


      console.log(
        'Vehicle Verify Error:',
        error,
      );


      Alert.alert(
        'Verification Failed',
        error?.data?.message ||
        error?.message ||
        'Unable to verify vehicle',
      );


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
                <LocalInput
                  label="Vehicle No"
                  value={values?.vehicleDetails.registrationNo}
                  editable={false}
                  style={{
                    backgroundColor: '#F5F5F5',
                    color: '#666',
                  }}
                />
             
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


           {/* ================= IMAGE SECTION ================= */}

<Text style={styles.imageTitle}>
  Add Real Image Of Vehicle
</Text>

<View style={styles.imageGrid}>

  {/* ROW 1 */}
  <View style={styles.imageRow}>

    <View style={styles.imageItem}>
      <CustomImagePicker
        label="Front Image"
        returnType="uri"
        onImageSelected={image =>
          handleVehiclePhotoChange('front_img')(image)
        }
        containerStyle={styles.imagePicker}
      />
    </View>

    <View style={styles.imageItem}>
      <CustomImagePicker
        label="Back Image"
        returnType="uri"
        onImageSelected={image =>
          handleVehiclePhotoChange('back_img')(image)
        }
        containerStyle={styles.imagePicker}
      />
    </View>

  </View>

  {/* ROW 2 */}
  <View style={styles.imageRow}>

    <View style={styles.imageItem}>
      <CustomImagePicker
        label="Right Image"
        returnType="uri"
        onImageSelected={image =>
          handleVehiclePhotoChange('right_img')(image)
        }
        containerStyle={styles.imagePicker}
      />
    </View>

    <View style={styles.imageItem}>
      <CustomImagePicker
        label="Left Image"
        returnType="uri"
        onImageSelected={image =>
          handleVehiclePhotoChange('left_img')(image)
        }
        containerStyle={styles.imagePicker}
      />
    </View>

  </View>

</View>

            {/* Validate Button */}


          </CustomCard>
          <SecondaryButton title={
            loading
              ? 'Validating...'
              : status === 'success'
                ? 'Verified'
                : 'Validate'
          }
            onPress={handleSubmit}
            textStyle={styles.buttontext}

            style={[
              status === 'success' && { backgroundColor: 'green' },
            ]}
            disabled={loading || status === 'success'}
          />
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
    marginHorizontal: moderateScale(2), 
  },

imageTitle: {
  color: colors.primary,
  fontWeight: '600',
  fontSize: moderateScale(13),
  marginBottom: moderateScale(5),
},
imageGrid: {
  width: '100%',
},
imageRow: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  marginBottom: moderateScale(5),

  gap: moderateScale(8),
},
imageItem: {
  flex: 1,
  minWidth: 0,
},

imagePicker: {
  width: '100%',
  height: moderateScale(27),
  marginBottom: 0,
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
