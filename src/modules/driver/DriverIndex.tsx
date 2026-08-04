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
import { useGetdriverdatabyscanMutation } from '@app/redux/query/queryApi';

import { moderateScale, normalizeFont, wp } from '@utils/responsive';
import spacing from '@utils/spacing';
import { colors } from '@utils/colors';
import commonstyles from '@utils/commonstyles';

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

  const scannedData = route.params?.scannedData || null;

  const driverid = useMemo(() => {
    try {
      const parsed = scannedData ? JSON.parse(scannedData) : null;
      return parsed?.driver_id || null;
    } catch {
      return null;
    }
  }, [scannedData]);

  // ✅ API
  const [getDriverData, { data, isLoading, isError }] =
    useGetdriverdatabyscanMutation();

  useEffect(() => {
    if (driverid) {
      getDriverData({ driver_id: driverid });
    }
  }, [driverid]);

  // ✅ Extract driver
  const driver = data?.data?.[0];

  // ✅ Map API → Form
  const mappedValues: FormValues = useMemo(() => {
    if (!driver) return initialValues;

    // ✅ helper function
    const getDocument = (type: string) => {
      return (
        driver?.documents?.find(
          (item: any) => item.photo_type === type,
        )?.photo_url || ''
      );
    };

    return {
      licenseNumber: driver.driving_license_no || '',
      dateofbirth: driver.DOB || '',
      mobileno: driver.contact_no || '',
      fullname: driver.full_name || '',
      nickname: driver.nick_name || '',
      email: driver.email_id || '',
      building: driver.building || '',
      street: driver.area || '',
      pincode: driver.pincode || '',
      taluka: driver.tahsil || '',
      state: driver.state || '',
      district: driver.district || '',
      aadharNumber: driver.aadhar_no || '',
      referenceName: driver.referred_person_name || '',
      referencePhone: driver.referred_person_no || '',
      relation: driver.relation || '',

      // ✅ DOCUMENT IMAGES
      licensefront: getDocument('license_front'),
      licenseback: getDocument('license_back'),
      aadharfront: getDocument('aadhar_front'),
      aadharback: getDocument('aadhar_back'),
    };
  }, [driver]);

  const submit = (values: FormValues) => {
    navigation.navigate(HOME_ROUTES.LICENSEADD, {
      driverData: values, // ✅ full form data
      driverId: driverid, // ✅ optional (good practice)
    });
  };

  if (isLoading) {
    return <Text style={{ padding: 20 }}>Loading driver data...</Text>;
  }

  if (isError) {
    return <Text style={{ padding: 20 }}>Failed to fetch driver data</Text>;
  }

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
        enableReinitialize={true}
        onSubmit={submit}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <View style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false}>
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

            <TouchableOpacity
              style={styles.Submitbutton}
              onPress={() => {
                if (activeTab === 'register') {
                  setActiveTab('document');
                } else {
                  handleSubmit();
                }
              }}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
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
    paddingHorizontal: spacing.xl,
  },

  Submitbutton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    marginBottom: wp(10),
    height:56,
    width:213
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.text,
    paddingHorizontal:8,
    paddingVertical:5
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalizeFont(24),
    alignSelf:'center'
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
  width:160,
  height: 38,
  borderRadius:10,
  borderWidth: 2,
  borderColor: colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},
});