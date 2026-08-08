import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from '@modules/auth/AuthNavigator';
import AppDrawer from './drawer/AppDrawer';
import OnboardingNavigator from './OnboardingNavigator/OnboardingNavigator';

import { useAppSelector } from '@app/hooks/hooks';

import { initSocket } from './../sockets/sockets/socket.manager';
import { registerVendorSocketListeners } from './../sockets/sockets/socket.listeners';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const {
    isAuthenticated,
    user,
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,
  } = useAppSelector(state => state.auth);
console.log(  isAuthenticated,
    user,
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,'=========================================')



  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initSocket(user.id);
      registerVendorSocketListeners();
    }
  }, [isAuthenticated, user?.id]);

 return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!isAuthenticated || !vendor_onboarded ? (
      <Stack.Screen
        name="AuthNavigator"
        component={AuthNavigator}
      />
    ) : !vehicle_verified || !kyc_verified ? (
      <Stack.Screen
        name="OnboardingNavigator"
        component={OnboardingNavigator}
      />
    ) : (
      <Stack.Screen
        name="AppDrawer"
        component={AppDrawer}
      />
    )}
  </Stack.Navigator>
);
}