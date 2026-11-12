import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TemporaryDashboard from '@modules/dashboard/TemporaryDashboard';
import AddVehicle from '@modules/vehicles/AddVehicle';
import ValidateVehicles from '@modules/vehicles/ValidateVehicles';
import Bankdetails from '@modules/payment/Bankdetails';
import VerifiedVehicles from '@modules/vehicles/VerifiedVehicles';
import CreateMpin from '@modules/mpin/screens/CreateMpin';
import VendorOnboarding from '@modules/user/onboarding/VendorOnboarding';

import {AUTH_ROUTES, HOME_ROUTES} from '@navigation/routes';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
    

      <Stack.Screen
        name={HOME_ROUTES.TEMP_DASHBOARD}
        component={TemporaryDashboard}
      />

      <Stack.Screen
        name="VehicleScreen"
        component={AddVehicle}
      />

      <Stack.Screen
        name={HOME_ROUTES.VERIFIEDVEHICLES_ONBOARD}
        component={VerifiedVehicles}
      />

      <Stack.Screen
        name={HOME_ROUTES.VALIDATE_VEHICLES}
        component={ValidateVehicles}
      />

      <Stack.Screen
        name={HOME_ROUTES.ADDBANK_DETAILS}
        component={Bankdetails}
      />

      <Stack.Screen
        name={AUTH_ROUTES.CREATE_MPIN}
        component={CreateMpin}
      />
    </Stack.Navigator>
  );
}