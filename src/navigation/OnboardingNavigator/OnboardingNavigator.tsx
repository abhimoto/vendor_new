import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TemporaryDashboard from '@modules/dashboard/TemporaryDashboard';
import AddVehicle from '@modules/vehicles/AddVehicle';
import ValidateVehicles from '@modules/vehicles/ValidateVehicles';
import Bankdetails from '@modules/payment/Bankdetails';
import VerifiedVehicles from '@modules/vehicles/VerifiedVehicles';
import { AUTH_ROUTES } from '@navigation/routes';
import VendorOnboarding from '@modules/user/onboarding/VendorOnboarding';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
   <Stack.Navigator screenOptions={{headerShown:false}}>
    
      <Stack.Screen
        name="TemporaryDashboard"
        component={TemporaryDashboard}
      />

      <Stack.Screen
        name="VehicleScreen"
        component={AddVehicle}
      />
      <Stack.Screen name='VerifiedVehicleDetails' component={VerifiedVehicles} />
      <Stack.Screen
        name="ValidateVehicles"
        component={ValidateVehicles}
      />

      <Stack.Screen
        name="AddBankdetails"
        component={Bankdetails}
      />
    </Stack.Navigator>
  );
}