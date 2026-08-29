import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthNavigator from '@modules/auth/AuthNavigator';
import AppDrawer from './drawer/AppDrawer';
import OnboardingNavigator from './OnboardingNavigator/OnboardingNavigator';
import LoginMpin from '@modules/mpin/screens/LoginMpin';
import {useAppSelector} from '@app/hooks/hooks';
import socketService from './../sockets/socket.service';
import {registerSocketListeners} from './../sockets/socket.listeners';
import { AUTH_ROUTES } from './routes';
import VendorOnboarding from '@modules/user/onboarding/VendorOnboarding';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const {
    isAuthenticated,
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,
    isMpincreated,
    isMpinVerified,
    token,
  } = useAppSelector(state => state.auth);

  /**
   * ============================================
   * ONBOARDING STATUS
   * ============================================
   */

  const isVendorOnboarded = vendor_onboarded;

  console.log(isVendorOnboarded,'isvendoronboarded')

  const isVehicleAndKycCompleted =
    vehicle_verified && kyc_verified;

      console.log(isVehicleAndKycCompleted,'isvendorandkycompleted')

  const isOnboardingComplete =
    isVendorOnboarded &&
    isVehicleAndKycCompleted &&
    isMpincreated;

    
      console.log(isVehicleAndKycCompleted,'isvendorandkycompleted')

  /**
   * ============================================
   * SOCKET
   * ============================================
   */
console.log(token)
  useEffect(() => {
    if (isAuthenticated && token && isMpinVerified) {
      socketService.connect(token);
      registerSocketListeners();
    }

    return () => {
      if (!isMpinVerified) {
        socketService.disconnect?.();
      }
    };
  }, [
    isAuthenticated,
    token,
    isMpinVerified,
  ]);

  /**
   * ============================================
   * DEBUG
   * ============================================
   */

  console.log('ROOT NAVIGATION STATE', {
    isAuthenticated,
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,
    isMpincreated,
    isMpinVerified,

    isVendorOnboarded,
    isVehicleAndKycCompleted,
    isOnboardingComplete,
  });

  /**
   * ============================================
   * ROOT FLOW
   * ============================================
   */

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* ======================================
          NOT LOGGED IN
         ====================================== */}

      {!isAuthenticated ? (
        <Stack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
        />
      ) : !isVendorOnboarded ? (
        /**
         * ======================================
         * STEP 1
         * Vendor onboarding
         * ======================================
         */
         <Stack.Screen
        name={AUTH_ROUTES.VENDORONBOARDING}
        component={VendorOnboarding}
      />
      ) : !isVehicleAndKycCompleted ? (
        /**
         * ======================================
         * STEP 2
         * Vehicle / KYC
         * ======================================
         */
        <Stack.Screen
          name="OnboardingNavigator"
          component={OnboardingNavigator}
        />
      ) : !isMpincreated ? (
        /**
         * ======================================
         * STEP 3
         * Create MPIN
         * ======================================
         */
        <Stack.Screen
          name="OnboardingNavigator"
          component={OnboardingNavigator}
        />
      ) : !isMpinVerified ? (
        /**
         * ======================================
         * STEP 4
         * MPIN LOGIN
         * ======================================
         */
        <Stack.Screen
          name="LoginMpin"
          component={LoginMpin}
        />
      ) : (
        /**
         * ======================================
         * STEP 5
         * APPLICATION
         * ======================================
         */
        <Stack.Screen
          name="AppDrawer"
          component={AppDrawer}
        />
      )}
    </Stack.Navigator>
  );
}