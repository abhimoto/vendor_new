import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from '@modules/auth/AuthNavigator';
import AppDrawer from './drawer/AppDrawer';
import OnboardingNavigator from './OnboardingNavigator/OnboardingNavigator';

import { useAppSelector } from '@app/hooks/hooks';

import socketService from "./../sockets/socket.service"
import { registerSocketListeners } from './../sockets/socket.listeners';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const {
    isAuthenticated,
    user,
    vendor_onboarded,
    vehicle_verified,
    kyc_verified,
    token
  } = useAppSelector(state => state.auth);



  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
      registerSocketListeners();
    }
  }, [isAuthenticated, token]);

  

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