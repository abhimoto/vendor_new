import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';

import DriverRegister from './DriverRegister';
import DriverDocument from './DriverDocument';
import AppHeader from '@components/custumcomponents/AppHeader';
import { HOME_ROUTES } from '@navigation/routes';

import { moderateScale, normalizeFont, wp } from '@utils/responsive';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';
import SecondaryButton from '@components/buttons/SecondaryButton';

export interface FormValues {
  licenseNumber?: string;
  dateofbirth: string;
  licensefront: string;
  licenseback: string;
  mobileno: string;
  fullname: string;
  nickname: string;
  email: string;
  building?: string;
  street?: string;
  pincode?: string;
  taluka?: string;
  state?: string;
  district?: string;
  aadharNumber?: string;
  aadharfront?: string;
  aadharback?: string;
  referenceName?: string;
  referencePhone?: string;
  relation?: string;
}

const initialValues: FormValues = {
  licenseNumber: '',
  dateofbirth: '',
  licensefront: '',
  licenseback: '',
  mobileno: '',
  fullname: '',
  nickname: '',
  email: '',
  building: '',
  street: '',
  pincode: '',
  taluka: '',
  state: '',
  district: '',
  aadharNumber: '',
  aadharfront: '',
  aadharback: '',
  referenceName: '',
  referencePhone: '',
  relation: '',
};

const TABS = [
  { key: 'register', label: 'Personal Information' },
  { key: 'document', label: 'Address & Details' },
];

export default function DriverIndex() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [activeTab, setActiveTab] = useState<'register' | 'document'>(
    'register',
  );

  const driver = route.params?.driverData || null;

  // ✅ Map API → Form
  const mappedValues: FormValues = useMemo(() => {
    if (!driver) return initialValues;

    return {
      licenseNumber: driver.DrivingLicenseNo || '',
      dateofbirth: driver.DOB || '',
      mobileno: driver.Mobile || '',
      fullname: driver.FullName || '',
      nickname: driver.NickName || '',
      email: driver.EmailId || '',

      building: driver.Building || '',
      street: driver.Area || '',
      pincode: driver.Pincode || '',
      taluka: driver.Tahsil || '',
      state: driver.State || '',
      district: driver.District || '',

      aadharNumber: driver.AadharNo || '',

      referenceName: driver.ReferredPersonName || '',
      referencePhone: driver.ReferredPersonContactNo || '',
      relation: driver.Relation || '',

      licensefront: driver.LicenseFrontImage || '',
      licenseback: driver.LicenseBackImage || '',
      aadharfront: driver.AadharFrontImage || '',
      aadharback: driver.AadharBackImage || '',
    };
  }, [driver]);

  console.log(mappedValues, 'mappedvalues')
  const submit = (values: FormValues) => {
    navigation.navigate(HOME_ROUTES.LICENSEADD, {
      driverData: values,
      driverId: driver?.UserId,
      driverCode: driver?.DriverCode,
      driverProfileId: driver?.DriverProfileId,
    });
  };



  return (
    <View style={styles.container}>
      <AppHeader title="Onboard Driver" />
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'register' && styles.activeTabBtn,
          ]}
          onPress={() => setActiveTab('register')}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'register' && styles.activeTabText,
            ]}
          >
            Personal Information
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'document' && styles.activeTabBtn,
          ]}
          onPress={() => setActiveTab('document')}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'document' && styles.activeTabText,
            ]}
          >
            Address &  Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {/* <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(tab.key as 'register' | 'document')
            }
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeText,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Form */}
      <Formik
        initialValues={mappedValues}
        enableReinitialize
        onSubmit={submit}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <View style={styles.content}>

            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {activeTab === 'register' ? (
                <DriverRegister
                  values={values}
                  setFieldValue={setFieldValue}
                />
              ) : (
                <DriverDocument
                  values={values}
                  setFieldValue={setFieldValue}
                />
              )}
            </ScrollView>

            <View style={styles.bottomButtonContainer}>
              <SecondaryButton
                title={activeTab === 'register' ? 'Next' : 'Submit'}
                onPress={() => {
                  if (activeTab === 'register') {
                    setActiveTab('document');
                  } else {
                    handleSubmit();
                  }
                }}
                textStyle={styles.buttonText}
              />
            </View>

          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    borderRadius: moderateScale(12),
    padding: spacing.xs,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // 👈 ensures vertical center
    paddingVertical: spacing.sm, // 👈 reduce height pressure
    borderRadius: moderateScale(10),
  },

  activeTab: { backgroundColor: '#fff' },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalizeFont(12), // 👈 slightly smaller for safety
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20
  },

  activeText: { color: '#0D47A1' },

  content: {
    flex: 1,
  },

  Submitbutton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    marginBottom: wp(10),
    height: 56,
    width: 213
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
scrollContent: {
  paddingHorizontal: spacing.xl,
  paddingBottom: moderateScale(30),
},

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalizeFont(16),
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },


  activeTabBtn: {
    backgroundColor: colors.primary,
  },

  tabBtnText: {
    color: colors.primary,
    fontSize: normalizeFont(12),
    fontWeight: 'semibold',
    textAlign: 'center',
  },

  activeTabText: {
    color: '#fff',
  },
  tabBtn: {
    flex: 1,
    marginHorizontal: 6,
    width: 160,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
bottomButtonContainer: {
  width: '100%',
  paddingHorizontal: spacing.xl,
  paddingTop: moderateScale(10),
  paddingBottom: moderateScale(20),
  backgroundColor: '#fff',
  alignItems: 'center',
},
  formScroll: {
    flex: 1,
  },
});