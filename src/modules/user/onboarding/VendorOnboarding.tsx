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
import {  setVendorOnboarded, updateUser } from '@app/redux/slices/AuthSlice';
import { wp, hp, moderateScale } from '@utils/responsive';
import { useOnboardingMutation } from '@app/redux/mutation/authApi';
import AppSnackbar from '@components/custumcomponents/AppSnackbar';
import { RootState, store } from '@app/redux';
import { useNavigation } from '@react-navigation/native';

const mapVendorPayload = (values: VendorFormValues) => {
  return {
    vendorName: values.companyName,
    organizationType: values.companyType,
    authorizedPerson:
      values.companyType === 'Self'
        ? values.companyName
        : values.ownerName,

    mobileNo: values.mobileNumber,
    building: values.building,
    area: values.area,
    pincode: values.pincode,
    state: values.state,
    district: values.district,
    town: values.town,

    gstNo: values.legaldocuments.gstnumber,
    panNo: values.legaldocuments.pannumber,

    // Use the user-entered company name
    organizationName: values.companyName,

    vehicles: values.legaldocuments.vehicles.map(vehicle => ({
      VehicleNo: vehicle.registrationNumber,
      LoadingCapacity: Number(vehicle.capacity),
    })),
  };
};
export default function VendorOnboarding() {
  const navigation = useNavigation<any>();
  const currentAuth = store.getState().auth;
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
    try {
      const payload = mapVendorPayload(values);
      const res = await onboarding(payload).unwrap();
      console.log('API Response:', res);

      if (res?.status === '00') {
        showSnackbar(
          res?.message || 'Vendor registered successfully',
          'success',
        );
        dispatch(
          updateUser({
            id: res.data.UserId,
            vendorId: res.data.VendorId || '',
            vendorCode: res.data.VendorCode,
            mobile: res.data.Mobile,
            role: res.data.Role,
          }),
        );
        dispatch(setVendorOnboarded(true));

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
