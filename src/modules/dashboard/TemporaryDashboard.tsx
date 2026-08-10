import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomButton from '@components/buttons/CustomButton';
import AppHeader from '@components/custumcomponents/AppHeader';

import {
  wp,
  hp,
  moderateScale,
  normalizeFont,
} from '@utils/responsive';

import { HOME_ROUTES } from '@navigation/routes';
import { useAppSelector } from '@app/hooks/hooks';
import { useGetCountsQuery } from '@app/redux/query/queryApi';
import { colors } from '@utils/colors';

type NavigationProp =
  NativeStackNavigationProp<any>;

export default function TemporaryDashboard() {
  const navigation = useNavigation<NavigationProp>();

  const {
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,
  } = useAppSelector(state => state.auth);

  const {
    data: countsData,
    isLoading,
    refetch,
  } = useGetCountsQuery();

  console.log(countsData)

  const totalVehicles =
    countsData?.data?.totalVehicles ?? 0;

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
    <View style={styles.container}>

      {/* ================= HEADER ================= */}
      {/* Your existing header - NOT changed */}
      <AppHeader title="Temporary Dashboard" />


      {/* ================= ACTION SECTION ================= */}

      <View style={styles.actionContainer}>

        {/* ---------- VALIDATE VEHICLE ---------- */}

        <View style={styles.actionSection}>
          <Text style={styles.actionHeading}>
            Validate Vehicle
          </Text>

          <View style={styles.actionCard}>

            {/* Vehicle Icon */}
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="local-shipping"
                size={moderateScale(30)}
                color="#111"
              />
            </View>

            {/* Count */}
            <View style={styles.middleContent}>
              <Text style={styles.addedText}>
                {isLoading
                  ? 'Loading...'
                  : `${totalVehicles} Added`}
              </Text>
            </View>

            {/* Validate */}
            <CustomButton
              title="Validate"
              onPress={() =>
                navigation.navigate(
                  HOME_ROUTES.VEHICLE_SCREEN,
                  {
                    from: 'temporary_dashboard',
                  },
                )
              }
              disabled={!vendor_onboarded}
              style={styles.actionButton}
                      textStyle={{color:colors.background}}
            />
          </View>
        </View>


        {/* ---------- BANK DETAILS ---------- */}

        <View style={styles.actionSection}>
          <Text style={styles.actionHeading}>
            Bank Details
          </Text>

          <View style={styles.actionCard}>

            {/* Bank Icon */}
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="account-balance"
                size={moderateScale(30)}
                color="#111"
              />
            </View>

            {/* Status */}
            <View style={styles.middleContent}>
              <Text
                style={[
                  styles.bankStatus,
                  vehicle_verified
                    ? styles.unlocked
                    : styles.locked,
                ]}
              >
                {vehicle_verified
                  ? 'Unlocked'
                  : 'Locked'}
              </Text>
            </View>

            {/* Unlock */}
        <CustomButton
  title="Unlock"
  onPress={() =>
    navigation.navigate(HOME_ROUTES.ADDBANK_DETAILS)
  }
  disabled={!vehicle_verified}
  style={[
    styles.actionButton,
    {
      backgroundColor: vehicle_verified
        ? '#FFFFFF'
        : colors.primary,
    },
  ]}
  textStyle={{
    color: vehicle_verified
      ? colors.primary
      : colors.background,
  }}
/>
          </View>
        </View>

      </View>


      {/* ================= VERIFICATION STEPPER ================= */}

      <View style={styles.stepsContainer}>

        {steps.map((step, index) => {
          const isCompleted = step.status === true;
          const isLast =
            index === steps.length - 1;

          return (
            <View
              key={index}
              style={styles.stepRow}
            >

              {/* LEFT INDICATOR */}
              <View style={styles.indicatorColumn}>

                {isCompleted ? (
                  <View style={styles.completedCircle}>
                    <MaterialIcons
                      name="check"
                      size={moderateScale(28)}
                      color="#FFFFFF"
                    />
                  </View>
                ) : (
                  <View style={styles.pendingCircle}>
                    <Text style={styles.number}>
                      {index + 1}
                    </Text>
                  </View>
                )}

                {/* DOTTED CONNECTOR */}
                {!isLast && (
                  <View style={styles.dottedLine} />
                )}
              </View>


              {/* RIGHT CONTENT */}
              <View style={styles.stepContent}>

                <Text style={styles.stepTitle}>
                  {step.title}
                </Text>

                <Text style={styles.stepSubtitle}>
                  {step.subtitle}
                </Text>

              </View>

            </View>
          );
        })}

      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* =========================================
     ACTION AREA
  ========================================= */

  actionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: hp(3),
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
  },

  actionSection: {
    width: '100%',
    marginBottom: hp(1.5),
padding:hp(0.5)
  },

  actionHeading: {
    textAlign: 'center',
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: hp(1),
  },

  actionCard: {
    width: '100%',
    height: moderateScale(75),
    backgroundColor: '#EAF1FE',
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
  },

  /* =========================================
     ICON
  ========================================= */

  iconWrapper: {
    width: wp(14),

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,
  },

  /* =========================================
     CENTER CONTENT
  ========================================= */

  middleContent: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    minWidth: 0,
  },

  addedText: {
    fontSize: normalizeFont(16),

    color: '#A5A5A5',

    fontWeight: '500',
  },

  bankStatus: {
    fontSize: normalizeFont(16),

    fontWeight: '500',
  },

  locked: {
    color: '#FF3B30',
  },

  unlocked: {
    color: '#4CAF50',
  },

  /* =========================================
     BUTTON
  ========================================= */

  actionButton: {
    width: wp(26),
    minWidth: moderateScale(76),
    maxWidth: moderateScale(88),
    height: moderateScale(30),
    borderRadius: moderateScale(10),
    backgroundColor:colors.primary
  },

  /* =========================================
     STEPPER
  ========================================= */

  stepsContainer: {
    width: '90%',
    alignSelf: 'center',
     marginTop: hp(5),
     padding:wp(2)

  },

  stepRow: {
    flexDirection: 'row',

    width: '100%',

    minHeight: moderateScale(100),
  },

  /* =========================================
     LEFT INDICATOR
  ========================================= */

  indicatorColumn: {
    width: moderateScale(42),

    alignItems: 'center',

    position: 'relative',
  },

  completedCircle: {
    width: moderateScale(40),
    height: moderateScale(40),

    borderRadius: moderateScale(20),

    backgroundColor: '#4CAF50',

    alignItems: 'center',
    justifyContent: 'center',
  },

  pendingCircle: {
    width: moderateScale(40),
    height: moderateScale(40),

    borderRadius: moderateScale(20),

    backgroundColor: '#D9D9DF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    fontSize: normalizeFont(17),

    fontWeight: '600',

    color: '#FFFFFF',
  },

  /* =========================================
     DOTTED LINE
  ========================================= */

  dottedLine: {
    flex: 1,

    width: 1,

    borderLeftWidth: 1,

    borderStyle: 'dotted',

    borderColor: '#BDBDBD',

    marginTop: moderateScale(2),
  },

  /* =========================================
     STEP CONTENT
  ========================================= */

  stepContent: {
    flex: 1,

    paddingLeft: wp(5),

    paddingTop: moderateScale(1),

    paddingRight: wp(2),

    minWidth: 0,
  },

  stepTitle: {
    fontSize: normalizeFont(16),

    fontWeight: 'semibold',

    color: '#000000',

    marginBottom: moderateScale(5),
  },

  stepSubtitle: {
    fontSize: normalizeFont(16),

    fontWeight: '400',

    color: '#000000',

    lineHeight: normalizeFont(17),

    flexShrink: 1,
  },
});