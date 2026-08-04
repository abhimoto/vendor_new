import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import commonstyles from '@utils/commonstyles';
import CustomCard from '@components/cards/CustomCard';
import CustomButton from '@components/buttons/CustomButton';
import { wp, hp, moderateScale, normalizeFont } from '@utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { HOME_ROUTES } from '@navigation/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@navigation/types';
import { useAppSelector } from '@app/hooks/hooks';
import AppHeader from '@components/custumcomponents/AppHeader';
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function TemporaryDashboard() {
  const {
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,
  } = useAppSelector(state => state.auth);

  const navigation = useNavigation<NavigationProp>();
  const steps = [
  {
    title: 'Registration',
    subtitle: 'Registration Completed Successfully',
    status: vendor_onboarded,
  },
  {
    title: 'Validate Vehicle',
    subtitle: 'Validate at least 1 vehicle to proceed',
    status: vehicle_verified,
  },
  {
    title: 'KYC Verification',
    subtitle: 'KYC unlocks after adding 1 vehicle',
    status: kyc_verified,
  },
];

  return (
    <View style={commonstyles.flex1}>
      <AppHeader title='Temporary Dashboard' />
      <View
        style={[commonstyles.container, commonstyles.p20]} >
        {steps.map((step, index) => {
          const isCompleted = step.status === true;
          const isLast = index === steps.length - 1;

          return (
            <View key={index} style={styles.stepRow}>
              {/* LEFT INDICATOR */}
              <View style={styles.leftSection}>
                {isCompleted ? (
                  <View style={styles.completedCircle}>
                    <MaterialIcons name="check" size={18} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.circle}>
                    <Text style={styles.number}>{index + 1}</Text>
                  </View>
                )}

                {!isLast && <View style={styles.dottedLine} />}
              </View>

              {/* STEP TEXT */}
              <View style={styles.textSection}>
                <Text style={styles.title}>{step.title}</Text>
                <Text style={styles.subtitle}>{step.subtitle}</Text>
              </View>
            </View>
          );
        })}

        {/* ACTION CARDS */}
       <View style={styles.cardRow}>
  {/* VEHICLE CARD */}
  <CustomCard style={styles.vehicleCard}>
    <MaterialIcons name="local-shipping" size={35} />
    <Text style={styles.cardTitle}>Validate Vehicle</Text>

    <Text style={styles.smallText}>
      {vendor_onboarded
        ? 'Ready to add vehicle'
        : 'Complete onboarding first'}
    </Text>

  <CustomButton
  title="Add"
  onPress={() =>
    navigation.navigate(
      HOME_ROUTES.VEHICLE_SCREEN,
      {
        from: 'temporary_dashboard',
      },
    )
  }
  style={{width:117,height:45,borderRadius:12}}
  disabled={!vendor_onboarded}
/>
  </CustomCard>

  {/* KYC CARD */}
  <CustomCard style={styles.bankCard}>
    <MaterialIcons name="account-balance" size={35} />
    <Text style={styles.cardTitle}>KYC Verification</Text>

    <Text style={styles.locked}>
      {vehicle_verified ? 'Unlocked' : 'Locked'}
    </Text>

    <CustomButton
      title="Unlock"
      onPress={() => navigation.navigate(HOME_ROUTES.ADDBANK_DETAILS)}
      disabled={!vehicle_verified}
      style={{width:117,height:45,borderRadius:12}}
    />
  </CustomCard>
</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },

  leftSection: {
    alignItems: 'center',
    marginRight: 15,
  },

  completedCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circle: {
    width: 40,
    height: hp(5),
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  number: {
    fontWeight: '600',
  },

  dottedLine: {
    width: 2,
    height: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    marginTop: 4,
  },

  textSection: {
    flex: 1,
  },

  title: {
    fontSize: normalizeFont(15),
    fontWeight: '600',
  },

  subtitle: {
    fontSize: normalizeFont(12),
    color: '#888',
    marginTop: 3,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  vehicleCard: {
    width: '48%',
    marginRight: '4%', // 👈 ADD THIS
    backgroundColor: '#E8EEF8',
    alignItems: 'center',
    padding: moderateScale(20),
  },

  bankCard: {
    width: '48%',
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    padding: moderateScale(20),
  },

  cardTitle: {
    marginTop: 10,
    fontWeight: '600',
  },

  smallText: {
    fontSize: 12,
    color: '#777',
  },

  locked: {
    color: 'red',
    fontSize: 12,
  },

  addBtn: {
    marginTop: 10,
    borderRadius: 20,
  },

  unlockBtn: {
    borderRadius: 20,
    marginTop: 10,
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
  },
});
