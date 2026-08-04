import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '@components/progressbars/ProgressBar';
import { VendorFormValues } from './types';
import VendorForm from './Registeration';
import LegalDocuments from './LegalDocuments';
import { colors } from '@utils/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthData, setVendorOnboarded } from '@app/redux/slices/AuthSlice';
import { wp, hp, moderateScale } from '@utils/responsive';
import { useOnboardingMutation } from '@app/redux/mutation/authApi';
import AppSnackbar from '@components/custumcomponents/AppSnackbar';
import { RootState } from '@app/redux';
import { useNavigation } from '@react-navigation/native';
import { HOME_ROUTES } from '@navigation/routes';

const mapVendorPayload = (values: VendorFormValues) => {
  return {
    VendorDetails: {
      companyType: values.companyType,
      companyName: values.companyName,
      owner_name: values.ownerName,
      Building: values.building,
      Area: values.area,
      // landMark: '',
      mobileNo: values.mobileNumber,
      pincode: values.pincode,
      district: values.district,
      Tahsil: values.town,
      state: values.state,
      // City: values.town,
      // vehicle_count: values.legaldocuments.numberofvehicles?.toString(),
      // employee_count: '1',
    },

    // VendorEmployeeDetails: [
    //   {
    //     full_name: '',
    //     designation: '',
    //     contact_No: '',
    //     alternate_No: '',
    //     emailAddress: '',
    //     website: '',
    //     username: '',
    //     password: '',
    //   },
    // ],

    VehicleDetails: values.legaldocuments.vehicles.map(v => ({
      vehicle_number: v.registrationNumber,
      vehicle_weight: v.capacity,
    })),

    kycDetails: {
      gstNo: values.legaldocuments.gstnumber,
      cinNo: '',
      panNo: values.legaldocuments.pannumber,
      aadharNo: '',
    },
  };
};
export default function VendorOnboarding() {
  const navigation = useNavigation<any>();
  const mobile = useSelector((state: RootState) => state.auth.user?.mobile);
  const initialValues: VendorFormValues = {
    companyName: '',
    companyType: '',
    ownerName: '',
    mobileNumber: mobile || '',
    building: '',
    area: '',
    pincode: '',
    state: '',
    district: '',
    town: '',
    legaldocuments: {
      gstnumber: '',
      pannumber: '',
      numberofvehicles: 0,
      vehicles: [],
    },
  };
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [onboarding, { isLoading }] = useOnboardingMutation();
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    type?: 'default' | 'success' | 'error' | 'warning';
  }>({
    visible: false,
    message: '',
    type: 'default',
  });

  const showSnackbar = (
    message: string,
    type: 'default' | 'success' | 'error' | 'warning' = 'default',
  ) => {
    setSnackbar({
      visible: true,
      message,
      type,
    });
  };

  const handleFinalSubmit = async (values: VendorFormValues) => {
    // navigation.navigate(HOME_ROUTES.VALIDATE_VEHICLES);
    try {
      const payload = mapVendorPayload(values);
      console.log('Payload:', payload);

      const res = await onboarding(payload).unwrap();
      console.log('API Response:', res);

      if (res?.status === '00') {
        showSnackbar(
          res?.message || 'Vendor registered successfully',
          'success',
        );
         dispatch(setVendorOnboarded(true));
          // navigation.replace(HOME_ROUTES.TEMP_DASHBOARD);
        dispatch(
          setAuthData({
            token: '',
            refreshToken: null,
            user: {
              id: res?.userDetails?.vendorid,
              name: res?.userDetails?.companyName,
              email: '',
              mobile: res?.userDetails?.mobileNo,
            },
            vendor_onboarded: true, // Set to true after successful onboarding
            kyc_verified: false,     // Set based on API response
            vehicle_verified: false,
          }),
        );
      } else {
        showSnackbar(res?.message || 'Registration failed', 'error');
      }
    } catch (error: any) {
      console.log('Onboarding Error:', error);

      showSnackbar(
        error?.data?.message?.message ||
        error?.data?.message ||
        'Registration failed',
        'error',
      );
    }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <VendorForm onNext={handleNext} />;
      case 2:
        return <LegalDocuments onPrev={handlePrev} />;
      default:
        return null;
    }
  };

  return (
    <Formik<VendorFormValues>
      initialValues={initialValues}
      onSubmit={handleFinalSubmit}
    >
      {() => (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={hp(2)} // responsive offset
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <Text style={styles.title}>Vendor Onboarding</Text>

                <ProgressBar currentStep={step} />

                {renderStep()}
              </View>
              <AppSnackbar
                visible={snackbar.visible}
                message={snackbar.message}
                type={snackbar.type}
                onDismiss={() =>
                  setSnackbar(prev => ({ ...prev, visible: false }))
                }
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flex: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(4),
  },

  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },

  title: {
    color: colors.primary,
    fontSize: moderateScale(18),
    fontWeight: '700',
    marginBottom: hp(1.5),
  },
});
