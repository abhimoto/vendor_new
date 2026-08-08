import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splashscreen from './Splashscreen';
import Login from './Login';
import Signup from './Signup';
import { AUTH_ROUTES } from '@navigation/routes';
import { AuthStackParamList } from '@navigation/types';
import VendorOnboarding from '@modules/user/onboarding/VendorOnboarding';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_ROUTES.SPLASH} component={Splashscreen} />
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={AUTH_ROUTES.SIGNUP} component={Signup} />
         <Stack.Screen
        name={AUTH_ROUTES.VENDORONBOARDING}
        component={VendorOnboarding}
      />
     

    </Stack.Navigator>
  );
}
