import React, {
  useState,
} from 'react';

import {
  Image,
  ScrollView,
  View,
} from 'react-native';

import AppHeader from '@components/custumcomponents/AppHeader';
import CustomAccordion from '@components/custumcomponents/CustomAccordion';
import CustomCard from '@components/cards/CustomCard';
import commonstyles from '@utils/commonstyles';

import PersonalInformation from '../components/PersonalInformation';
import KycInformation from '../components/KycInformation';
import VehicleInformation from '../components/VehicleInformation';

import useProfile from '../hooks/useProfile';

import {
  DUMMY_VENDOR_ID,
} from '../data/profileData';

import {
  ProfileSection,
  ProfileValues,
} from '../types/profileTypes';

export default function Profile() {
  const {
    values,
    setValues,
    vehicles,
    setVehicles,
    handleUpdateProfile,
    isUpdating,
  } = useProfile();

  const vendorid = DUMMY_VENDOR_ID;

  const [
    activeAccordion,
    setActiveAccordion,
  ] = useState<ProfileSection>('personal');

  console.log(values, 'values from profile');
  console.log(vehicles, 'vehicles from profile');

  // ==========================================
  // HANDLE PROFILE CHANGE
  // ==========================================

  const handleChange = (
    key: keyof ProfileValues,
    value: string,
  ) => {
    setValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // ==========================================
  // CONTENT
  // ==========================================

  const renderContent = () => {
    switch (activeAccordion) {
      case 'personal':
        return (
          <PersonalInformation
            values={values}
            onChange={handleChange}
            handleUpdateProfile={
              handleUpdateProfile
            }
            isUpdating={isUpdating}
          />
        );

      case 'kyc':
        return (
          <KycInformation
            values={values}
            onChange={handleChange}
          />
        );

      case 'vehicle':
        return (
          <VehicleInformation
            vehicles={vehicles}
            setVehicles={setVehicles}
            vendorid={vendorid}
          />
        );

      default:
        return null;
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={commonstyles.flex1}>

      <AppHeader title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        <CustomCard>

          {/* PERSONAL INFORMATION */}

          <CustomAccordion
            title="Personal Information"
            icon={
              <Image
                source={require(
                  './../../../assets/icons/profile.png'
                )}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: '#111827',
                }}
                resizeMode="contain"
              />
            }
            expanded={
              activeAccordion === 'personal'
            }
            onPress={() =>
              setActiveAccordion('personal')
            }
          />

          {/* KYC */}

          <CustomAccordion
            title="KYC Validation"
            icon={
              <Image
                source={require(
                  './../../../assets/icons/kyc.png'
                )}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: '#111827',
                }}
                resizeMode="contain"
              />
            }
            expanded={
              activeAccordion === 'kyc'
            }
            onPress={() =>
              setActiveAccordion('kyc')
            }
          />

          {/* VEHICLES */}

          <CustomAccordion
            title="Add Vehicles"
            icon={
              <Image
                source={require(
                  './../../../assets/icons/vehicle.png'
                )}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: '#111827',
                }}
                resizeMode="contain"
              />
            }
            expanded={
              activeAccordion === 'vehicle'
            }
            onPress={() =>
              setActiveAccordion('vehicle')
            }
          />

        </CustomCard>

        {renderContent()}

      </ScrollView>

    </View>
  );
}