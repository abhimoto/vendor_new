import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AppHeader from '@components/custumcomponents/AppHeader';
import CustomCard from '@components/cards/CustomCard';
import CustomDropdown from '@components/dropdown/CustomDropdown';
import commonstyles from '@utils/commonstyles';
import { colors } from '@utils/colors';
import { segmentoptions, vehicleWeightRanges } from '@utils/constants';
import LocalInput from '@components/Inputs/LocalInput';
import { VehicleForm } from './types';
import CustomImagePicker from '@components/imagepicker/ImagePicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch } from '@app/hooks/hooks';
import { wp, hp, moderateScale, normalizeFont } from '@utils/responsive';
import { useVehicleverifyMutation } from '@app/redux/mutation/authApi';
import { useVehicletypedetailswithcapacityQuery } from '@app/redux/query/queryApi';
import { setVehicleVerified } from '@app/redux/slices/AuthSlice';
import { Alert } from 'react-native';
import SecondaryButton from '@components/buttons/SecondaryButton';
import ENV from './../../config/index'
import Config from 'react-native-config';


type RouteParams = {
  item: {
    VehicleId: string;
    LoadingCapacity: string;
    VehicleNo: string;
    status: string;
  };
  from?: 'temporary_dashboard' | 'dashboard';
};

export default function ValidateVehicles() {
  console.log(ENV.IMAGE_BASE_URL, Config, 'environment')

  const dispatch = useAppDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { item, from } = route.params as RouteParams;
  const [vehicleverify] = useVehicleverifyMutation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  console.log(item)
  const {
    data,
    isFetching,
    error,
  } = useVehicletypedetailswithcapacityQuery({
    LoadingCapacity: item.LoadingCapacity,
  });



  const headerTitle = from === 'dashboard'
    ? 'Add / Verified'
    : 'Validate Vehicles'

  const [values, setValues] = useState<any>({
    vehicleid: item?.VehicleId || '',

    vehicleDetails: {
      registrationNo: item?.VehicleNo || '',
      bodyType: '',
      segment: '',
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
  const bodyTypes = data?.data || [];
  useEffect(() => {
    if (bodyTypes.length > 0) {
      setValues(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          segment: bodyTypes[0].vehiclesegment,
        },
      }));
    }
  }, [bodyTypes]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return '';
    }

    const baseUrl = ENV?.IMAGE_BASE_URL || '';

    return `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(
      /^\//,
      '',
    )}`;
  };
  const handleBodyTypeSelect = (bodyType: any) => {
    setValues(prev => ({
      ...prev,
      vehicleDetails: {
        ...prev.vehicleDetails,
        bodyType: bodyType.bodytype,
        segment: bodyType.vehiclesegment,
      },
    }));
  };




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
        'Segment',
        values.vehicleDetails.segment,
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

      console.log(formData, '=--')


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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainContainer}>
          <CustomCard style={styles.formcontainer}>

            {/* VEHICLE NUMBER */}
            <Text style={styles.vehicleNumber}>
              Vehicle No : {values?.vehicleDetails.registrationNo}
            </Text>

            {/* ================= TOP ROW ================= */}
            <View style={styles.topRow}>

              {/* Loading Capacity */}
              <View style={styles.topField}>
                <Text style={styles.topLabel}>
                  Loading Capacity
                  <Text style={styles.weightText}> (Weight)</Text>
                </Text>

                <Text
                  style={styles.topValue}
                  numberOfLines={1}
                >
                  {values.VehicleTypesDetails.VehicleWeight || ''}
                </Text>
              </View>

              {/* Segment */}
              <View style={styles.topField}>
                {/* <CustomDropdown
                data={truckBodyTypes}
                value={values.vehicleDetails.bodyType}
                placeholder="Segment"
                onSelect={item =>
                  handleVehicleDetailsChange('bodyType')(item.value)
                }
              /> */}
                <LocalInput
                  label="Dhala Length"
                  value={values.vehicleDetails.segment}
                  onChangeText={handleVehicleTypeChange('length')}
                  keyboardType="number-pad"
                  placeholder=""
                />
                {/* <CustomDropdown
                  data={segmentoptions}
                  value={values.vehicleDetails.segment}
                  placeholder="Segment"
                  onSelect={item =>
                    setValues(prev => ({
                      ...prev,
                      vehicleDetails: {
                        ...prev.vehicleDetails,
                        segment: item.value,
                        bodyType: '', 
                      },
                    }))
                  }
                /> */}
              </View>
            </View>

            {/* ================= BODY TYPE ================= */}
            <Text style={styles.sectionLabel}>
              Body Type
            </Text>

            <View style={styles.bodyTypeGrid}>
              {isFetching ? (
                <Text>
                  Loading body types...
                </Text>
              ) : error ? (
                <Text>
                  Unable to load body types
                </Text>
              ) : bodyTypes.length ? (
                bodyTypes.map(
                  (bodyType: any) => {
                    const selected =
                      values.vehicleDetails
                        .bodyType ===
                      bodyType.bodytype;

                    return (
                      <TouchableOpacity
                        key={`${bodyType.bodytype}-${bodyType.vehiclesegment}`}
                        style={[
                          styles.bodyTypeCard,
                          selected &&
                          styles.selectedBodyTypeCard,
                        ]}
                        onPress={() =>
                          handleBodyTypeSelect(
                            bodyType,
                          )
                        }>
                        <Image
                          source={{
                            uri: getImageUrl(
                              bodyType.front_image_url,
                            ),
                          }}
                          style={
                            styles.bodyTypeImage
                          }
                          resizeMode="cover"
                        />

                        <View
                          style={
                            styles.bodyTypeLabel
                          }>
                          <Text
                            style={
                              styles.bodyTypeLabelText
                            }>
                            {
                              bodyType.bodytype
                            }
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  },
                )
              ) : (
                <Text>
                  No body types found
                </Text>
              )}
            </View>

            {/* ================= DIVIDER ================= */}
            <View style={styles.divider} />

            {/* ================= DIMENSIONS ================= */}
            <View style={styles.dimensionRow}>

              <View style={styles.dimensionBox}>
                <LocalInput
                  label="Dhala Length"
                  value={values.VehicleTypesDetails.length}
                  onChangeText={handleVehicleTypeChange('length')}
                  keyboardType="number-pad"
                  placeholder=""
                />
              </View>

              <View style={styles.dimensionBox}>
                <LocalInput
                  label="Dhala Width"
                  value={values.VehicleTypesDetails.width}
                  onChangeText={handleVehicleTypeChange('width')}
                  keyboardType="number-pad"
                  placeholder=""
                />
              </View>

              <View style={styles.dimensionBox}>
                <LocalInput
                  label="Dhala Height"
                  value={values.VehicleTypesDetails.height}
                  onChangeText={handleVehicleTypeChange('height')}
                  keyboardType="number-pad"
                  placeholder=""
                />
              </View>

            </View>

            {/* ================= REAL IMAGES ================= */}
            <Text style={styles.imageTitle}>
              Add Real Image Of Vehicle
            </Text>

            <View style={styles.imageGrid}>

              {/* FRONT */}
              <View style={styles.imageItem}>
                <CustomImagePicker
                  label="Add Front Side Image"
                  returnType="uri"
                  onImageSelected={image =>
                    handleVehiclePhotoChange('front_img')(image)
                  }
                  containerStyle={styles.imagePicker}
                />
              </View>

              {/* BACK */}
              <View style={styles.imageItem}>
                <CustomImagePicker
                  label="Add Back Side Image"
                  returnType="uri"
                  onImageSelected={image =>
                    handleVehiclePhotoChange('back_img')(image)
                  }
                  containerStyle={styles.imagePicker}
                />
              </View>

              {/* RIGHT */}
              <View style={styles.imageItem}>
                <CustomImagePicker
                  label="Add Right Side Image"
                  returnType="uri"
                  onImageSelected={image =>
                    handleVehiclePhotoChange('right_img')(image)
                  }
                  containerStyle={styles.imagePicker}
                />
              </View>

              {/* LEFT */}
              <View style={styles.imageItem}>
                <CustomImagePicker
                  label="Add Left Side Image"
                  returnType="uri"
                  onImageSelected={image =>
                    handleVehiclePhotoChange('left_img')(image)
                  }
                  containerStyle={styles.imagePicker}
                />
              </View>

            </View>

          </CustomCard>

          {/* ================= VALIDATE BUTTON ================= */}
          <SecondaryButton
            title={
              loading
                ? 'Validating...'
                : status === 'success'
                  ? 'Verified'
                  : 'Validate'
            }
            onPress={handleSubmit}
            textStyle={styles.buttontext}
            style={[
              styles.validateButton,
              status === 'success' && styles.successButton,
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
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(30),
  },
  selectedBodyTypeCard: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
  },

  formcontainer: {
    width: wp(92),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },

  vehicleNumber: {
    color: colors.primary,
    fontSize: moderateScale(12),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: moderateScale(10),
  },

  topRow: {
    flexDirection: 'row',
    width: '100%',
    gap: moderateScale(8),
    marginBottom: moderateScale(12),
  },

  topField: {
    flex: 1,
    minHeight: moderateScale(55),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    backgroundColor: '#FFFFFF',
  },

  topLabel: {
    color: '#222222',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },

  weightText: {
    fontSize: moderateScale(8),
    fontWeight: '400',
  },

  topValue: {
    color: '#333333',
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginTop: moderateScale(4),
  },

  sectionLabel: {
    color: '#222222',
    fontSize: moderateScale(12),
    fontWeight: '700',
    marginBottom: moderateScale(7),
  },

  bodyTypeGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: moderateScale(8),
  },

  bodyTypeCard: {
    width: '48.5%',
    height: moderateScale(80),
    borderWidth: 1,
    borderColor: '#6D8EBA',
    borderRadius: moderateScale(6),
    overflow: 'hidden',
  },

  bodyTypeImage: {
    width: '100%',
    height: '100%',
  },

  bodyTypeLabel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: moderateScale(4),
  },

  bodyTypeLabelText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10),
    textAlign: 'center',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E2E2',
    width: '90%',
    alignSelf: 'center',
    marginVertical: moderateScale(12),
  },

  dimensionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: moderateScale(7),
    marginBottom: moderateScale(10),
  },

  dimensionBox: {
    flex: 1,
    minHeight: moderateScale(52),
  },

  imageTitle: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: moderateScale(12),
    marginBottom: moderateScale(7),
  },

  imageGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: moderateScale(8),
  },

  imageItem: {
    width: '48.5%',
    minWidth: 0,
  },

  imagePicker: {
    width: '100%',
    height: moderateScale(38),
    marginBottom: 0,
  },

  validateButton: {
    marginTop: moderateScale(16),
    width: wp(80),
    minHeight: moderateScale(45),
    borderRadius: moderateScale(9),
    alignSelf: 'center',
  },

  successButton: {
    backgroundColor: 'green',
  },

  buttontext: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
});