
import React, { useEffect, useState, useRef } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import AppHeader from '@components/custumcomponents/AppHeader';
import CustomCard from '@components/cards/CustomCard';
import commonstyles from '@utils/commonstyles';
import { colors } from '@utils/colors';
import { vehicleWeightRanges } from '@utils/constants';
import LocalInput from '@components/Inputs/LocalInput';
import { VehicleForm } from './types';
import CustomImagePicker from '@components/imagepicker/ImagePicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch } from '@app/hooks/hooks';
import { wp, moderateScale } from '@utils/responsive';
import { useVehicleverifyMutation } from '@app/redux/mutation/authApi';
import { useVehicletypedetailswithcapacityQuery } from '@app/redux/query/queryApi';
import { setVehicleVerified } from '@app/redux/slices/AuthSlice';
import SecondaryButton from '@components/buttons/SecondaryButton';
import ENV from './../../config/index';


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { item, from } = route.params as RouteParams;
  const [vehicleverify] = useVehicleverifyMutation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasSelectedBodyType, setHasSelectedBodyType] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { data, isFetching, error } =
    useVehicletypedetailswithcapacityQuery({
      LoadingCapacity: item.LoadingCapacity,
    });


  const headerTitle =
    from === 'dashboard' ? 'Add / Verified' : 'Validate Vehicles';

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
      dhfl_img: '',
      extra_img: '',
    },
  });

  const bodyTypes = data?.data || [];

  // Vehicle image URL
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    ) {
      return imagePath;
    }

    const baseUrl = ENV?.IMAGE_BASE_URL || '';

    return `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
  };

  // Vehicle type based on loading capacity
  const getVehicleTypeByWeight = (weight: any) => {
    const w = Number(weight);

    const match = vehicleWeightRanges.find(
      range => w >= range.min && w <= range.max,
    );

    return match?.vehicleType || '';
  };

  useEffect(() => {
    if (values.VehicleTypesDetails.VehicleWeight) {
      const type = getVehicleTypeByWeight(
        values.VehicleTypesDetails.VehicleWeight,
      );

      setValues((prev: any) => ({
        ...prev,
        VehicleTypesDetails: {
          ...prev.VehicleTypesDetails,
          vehicleType: type,
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!bodyTypes.length) return;

    const segment = bodyTypes[0].vehiclesegment || '';

    setValues((prev: any) => ({
      ...prev,
      vehicleDetails: {
        ...prev.vehicleDetails,
        segment,
      },
    }));
  }, [bodyTypes]);
  // Select body type with animation
  const handleBodyTypeSelect = (bodyType: any) => {
    LayoutAnimation.configureNext({
      duration: 350,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    setValues((prev: any) => ({
      ...prev,
      vehicleDetails: {
        ...prev.vehicleDetails,
        bodyType: bodyType.bodytype,
        segment: bodyType.vehiclesegment || '',
      },
    }));

    setHasSelectedBodyType(true);

    // Reset animation
    scaleAnim.setValue(0.85);
    fadeAnim.setValue(0);

    // Start animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Return to all body types
  const handleChangeBodyType = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut,
    );

    setHasSelectedBodyType(false);
  };

  // Selected body type
  const selectedBodyType = bodyTypes.find(
    (bodyType: any) =>
      bodyType.bodytype === values.vehicleDetails.bodyType,
  );

  // Dimensions change
  const handleVehicleTypeChange =
    (key: keyof VehicleForm['VehicleTypesDetails']) =>
      (value: string) => {
        setValues((prev: any) => ({
          ...prev,
          VehicleTypesDetails: {
            ...prev.VehicleTypesDetails,
            [key]: key === 'VehicleWeight' ? Number(value) : value,
          },
        }));
      };

  // Vehicle photos change
  const handleVehiclePhotoChange =
    (key: keyof VehicleForm['vehiclePhotos']) => (image: any) => {
      setValues((prev: any) => ({
        ...prev,
        vehiclePhotos: {
          ...prev.vehiclePhotos,
          [key]: image,
        },
      }));
    };

  // Submit vehicle verification
  const handleSubmit = async () => {
    try {
      if (!values.vehicleDetails.bodyType) {
        Alert.alert('Validation', 'Please select a body type');
        return;
      }

      const images = [
        values.vehiclePhotos.front_img,
        values.vehiclePhotos.back_img,
        values.vehiclePhotos.right_img,
        values.vehiclePhotos.left_img,
        values.vehiclePhotos.dhfl_img,
        values.vehiclePhotos.extra_img,
      ];

      const uploadedImages = images.filter(
        img => img && img.uri,
      );

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

      const appendImage = (key: string, image: any) => {
        if (!image?.uri) return;

        formData.append(
          key,
          {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.fileName || `${key}.jpg`,
          } as any,
        );
      };

      appendImage('FrontImage', values.vehiclePhotos.front_img);
      appendImage('BackImage', values.vehiclePhotos.back_img);
      appendImage('LeftImage', values.vehiclePhotos.left_img);
      appendImage('RightImage', values.vehiclePhotos.right_img);
      appendImage('DhalaFlaring', values.vehiclePhotos.dhfl_img);
      appendImage('ExtraImage', values.vehiclePhotos.extra_img);

      const resp = await vehicleverify(formData).unwrap();

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
                } else if (from === 'dashboard') {
                  navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                  });
                }
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Verification Failed',
          resp?.message || 'Unable to verify vehicle',
        );
      }
    } catch (err: any) {
      setStatus('error');

      Alert.alert(
        'Verification Failed',
        err?.data?.message ||
        err?.message ||
        'Unable to verify vehicle',
      );
    } finally {
      setLoading(false);
    }
  };

  // Image picker
  const renderImagePicker = (
    label: string,
    key: keyof VehicleForm['vehiclePhotos'],
  ) => (
    <View style={styles.imageItem}>
      <CustomImagePicker
        label={label}
        returnType="uri"
        onImageSelected={image =>
          handleVehiclePhotoChange(key)(image)
        }
        containerStyle={styles.imagePicker}
      />
    </View>
  );

  return (
    <View style={[commonstyles.flex1, styles.validateContainer]}>
      <AppHeader title={headerTitle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.vehicleNumber}>
          Vehicle No : {values.vehicleDetails.registrationNo}
        </Text>
        <View style={styles.mainContainer}>
          <CustomCard style={styles.formContainer}>

            {/* Vehicle Registration Number */}



            {/* Loading Capacity and Segment */}

            <View style={styles.topRow}>
              <View style={styles.topInfoBox}>
                <Text style={styles.topInfoText} numberOfLines={1}>
                  Loading Capacity :{' '}
                  {values.VehicleTypesDetails.VehicleWeight} kg
                </Text>
              </View>

              <View style={styles.topInfoBox}>
                <Text style={styles.topInfoText} numberOfLines={1}>
                  Segment : {values.vehicleDetails.segment || '-'}
                </Text>
              </View>
            </View>

            {/* Body Type Selection */}

            <Text style={styles.sectionLabel}>
              {hasSelectedBodyType
                ? 'Your Select Body Type'
                : 'Select Body Type'}
            </Text>

            {isFetching ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : error ? (
              <Text style={styles.stateText}>
                Unable to load body types
              </Text>
            ) : bodyTypes.length > 0 ? (
              <>
                {!hasSelectedBodyType ? (
                  // Initial state: All body types
                  <View style={styles.bodyTypeGrid}>
                    {bodyTypes.map((bodyType: any, index: number) => (
                      <TouchableOpacity
                        key={`${bodyType.bodytype}-${index}`}
                        activeOpacity={0.8}
                        style={styles.bodyTypeCard}
                        onPress={() =>
                          handleBodyTypeSelect(bodyType)
                        }
                      >
                        <Image
                          source={{
                            uri: getImageUrl(bodyType.front_image_url),
                          }}
                          style={styles.bodyTypeImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  // Selected state: Large preview + thumbnails
                  <>
                    {selectedBodyType && (
                      <Animated.View
                        style={[
                          styles.selectedBodyContainer,
                          {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                          },
                        ]}
                      >
                        <Image
                          source={{
                            uri: getImageUrl(
                              selectedBodyType.front_image_url,
                            ),
                          }}
                          style={styles.selectedBodyImage}
                          resizeMode="contain"
                        />
                      </Animated.View>
                    )}

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.changeBodyButton}
                      onPress={handleChangeBodyType}
                    >
                      <Text style={styles.changeBodyText}>
                        Click Here To Change The Body Type
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.bodyThumbnailContainer}>
                      {bodyTypes
                        .filter(
                          (bodyType: any) =>
                            bodyType.bodytype !==
                            values.vehicleDetails.bodyType,
                        )
                        .map((bodyType: any, index: number) => (
                          <TouchableOpacity
                            key={`${bodyType.bodytype}-${index}`}
                            activeOpacity={0.8}
                            style={styles.bodyThumbnailCard}
                            onPress={() =>
                              handleBodyTypeSelect(bodyType)
                            }
                          >
                            <Image
                              source={{
                                uri: getImageUrl(
                                  bodyType.front_image_url,
                                ),
                              }}
                              style={styles.bodyThumbnailImage}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ))}
                    </View>
                  </>
                )}
              </>
            ) : (
              <Text style={styles.stateText}>
                No body types found
              </Text>
            )}

            {/* Dhala Dimensions */}
            <Text style={styles.dimensionTitle}>
              Vehicle Dhala ( Tray ) Size
            </Text>
            <View style={styles.dimensionRow}>
              <View style={styles.dimensionBox}>
                <LocalInput
                  label="Length (IN FT)"
                  value={values.VehicleTypesDetails.length}
                  onChangeText={handleVehicleTypeChange('length')}
                  keyboardType="decimal-pad"
                  placeholder=""
                />
                {/* <Text style={styles.dimensionUnit}>( IN FT )</Text> */}
              </View>

              <View style={styles.dimensionBox}>
                <LocalInput
                  label="Width (IN FT)"
                  value={values.VehicleTypesDetails.width}
                  onChangeText={handleVehicleTypeChange('width')}
                  keyboardType="decimal-pad"
                  placeholder=""
                />
                {/* <Text style={styles.dimensionUnit}>( IN FT )</Text> */}
              </View>

              <View style={styles.dimensionBox}>
                <LocalInput
                  label="Height (IN FT)"
                  value={values.VehicleTypesDetails.height}
                  onChangeText={handleVehicleTypeChange('height')}
                  keyboardType="decimal-pad"
                  placeholder=""
                />
                {/* <Text style={styles.dimensionUnit}>( IN FT )</Text> */}
              </View>
            </View>

            {/* Vehicle Image Upload */}

            <Text style={styles.imageTitle}>
              Add Real Image Of Vehicle
            </Text>

            <View style={styles.imageGrid}>
              {renderImagePicker('Add Front Side Image', 'front_img')}
              {renderImagePicker('Add Back Side Image', 'back_img')}
              {renderImagePicker('Add Right Side Image', 'right_img')}
              {renderImagePicker('Add Left Side Image', 'left_img')}
              {renderImagePicker('Add Dhala Image', 'dhfl_img')}
              {renderImagePicker('Add Extra Image', 'extra_img')}
            </View>
          </CustomCard>

          {/* Validate Button */}

          <SecondaryButton
            title={
              loading
                ? 'Validating...'
                : status === 'success'
                  ? 'Verified'
                  : 'Validate'
            }
            onPress={handleSubmit}
            textStyle={styles.buttonText}
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
  validateContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: moderateScale(2),
    paddingBottom: moderateScale(24),
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: wp(92),
    borderWidth: 1,
    borderColor: '#5576A8',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(9),
    paddingVertical: moderateScale(9),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  vehicleNumber: {
    color: colors.primary,
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    gap: moderateScale(3),
    marginBottom: moderateScale(12),
  },

  topInfoBox: {
    flex: 1,
    minHeight: moderateScale(27),
    backgroundColor: '#6C89B5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(3),
  },

  topInfoText: {
    color: '#FFFFFF',
    fontSize: moderateScale(9),
    fontWeight: '600',
    textAlign: 'center',
  },
  dimensionTitle:{
    color: colors.primary,
    fontWeight: '700',
    fontSize: moderateScale(14),
    marginTop: moderateScale(12)

  },

  sectionLabel: {
    color: '#222222',
    fontSize: moderateScale(11),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: moderateScale(5),
    marginBottom: moderateScale(10),
  },

  // Initial body type grid
  bodyTypeGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: moderateScale(5),
  },

  bodyTypeCard: {
    width: '48.5%',
    height: moderateScale(85),
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: moderateScale(5),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyTypeImage: {
    width: '95%',
    height: '95%',
  },

  // Selected large preview
  selectedBodyContainer: {
    width: '75%',
    height: moderateScale(113),
    borderWidth: 2,
    borderColor: '#365F9B',
    borderRadius: moderateScale(5),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedBodyImage: {
    width: '95%',
    height: '95%',
  },

  // Change body type
  changeBodyButton: {
    alignSelf: 'center',
    marginTop: moderateScale(10),
    marginBottom: moderateScale(17),
    borderBottomWidth: 1,
    borderBottomColor: '#365F9B',
    paddingBottom: moderateScale(2),
  },

  changeBodyText: {
    color: '#365F9B',
    fontSize: moderateScale(11),
    fontStyle: 'italic',
    fontWeight: '500',
  },

  // Other body type thumbnails
  bodyThumbnailContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: moderateScale(6),
  },

  bodyThumbnailCard: {
    width: '31.5%',
    height: moderateScale(79),
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: moderateScale(5),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  bodyThumbnailImage: {
    width: '95%',
    height: '95%',
  },

  stateContainer: {
    width: '100%',
    paddingVertical: moderateScale(15),
    alignItems: 'center',
  },

  stateText: {
    width: '100%',
    textAlign: 'center',
    color: '#777777',
    fontSize: moderateScale(11),
    paddingVertical: moderateScale(12),
  },

  // Dimensions
  dimensionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: moderateScale(5),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(8),
  },

  dimensionBox: {
    flex: 1,
    minWidth: 0,
    minHeight: moderateScale(52),
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: moderateScale(9),
    paddingHorizontal: moderateScale(3),
    paddingTop: moderateScale(3),
    justifyContent: 'center',
  },

  dimensionUnit: {
    textAlign: 'center',
    color: '#555555',
    fontSize: moderateScale(8),
    marginTop: moderateScale(-3),
    marginBottom: moderateScale(3),
  },

  // Image upload
  imageTitle: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: moderateScale(10),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(7),
  },

  imageGrid: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(2),
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: moderateScale(4),
  },

  imageItem: {
    width: '48.5%',
    minWidth: 0,
    height: moderateScale(50),
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: moderateScale(9),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePicker: {
    width: '100%',
    height: moderateScale(50),
    marginBottom: 0,
  },

  // Validate button
  validateButton: {
    marginTop: moderateScale(13),
    width: wp(84),
    minHeight: moderateScale(43),
    borderRadius: moderateScale(6),
    alignSelf: 'center',
    backgroundColor: '#365F9B',
  },

  successButton: {
    backgroundColor: 'green',
  },

  buttonText: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
