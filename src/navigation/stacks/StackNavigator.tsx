import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeController from '@modules/dashboard/HomeController';
import TemporaryDashboard from '@modules/dashboard/TemporaryDashboard';
import AddVehicle from '@modules/vehicles/AddVehicle';
import ValidateVehicles from '@modules/vehicles/ValidateVehicles';
import VerifiedVehicles from '@modules/vehicles/VerifiedVehicles';
import OnboardDriver from '@modules/driver/OnboardDriver';
import DriverScan from '@modules/driver/DriverScan';
import DriverIndex from '@modules/driver/DriverIndex';
import DriverDiscontinue from '@modules/driver/DriverDiscontinue';
import AddDriver from '@modules/driver/AddDriver';
import LicenseAdd from '@modules/driver/documents/LicenseAdd';
import AssignVehicle from '@modules/vehicles/AssignVehicle';
import DiscontinueVehicles from '@modules/vehicles/DiscontinueVehicles';
import VehicleDiscontinueList from '@modules/vehicles/VehicleDiscontinueList';
import VehicleExpiry from '@modules/vehicles/VehicleExpiry';
import Tracking from '@modules/tracking/Tracking';
import DriverDiscontinueList from '@modules/driver/DriverDiscontinueList';
import Bankdetails from '@modules/payment/Bankdetails';
import EditVehicles from '@modules/vehicles/EditVehicles';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
   <Stack.Navigator
  initialRouteName="HomeController"
  screenOptions={{ headerShown: false }}
>
      <Stack.Screen name="HomeController" component={HomeController} />
      {/* <Stack.Screen name="TemporaryDashboard" component={TemporaryDashboard} /> */}
      <Stack.Screen name="VehicleScreen" component={AddVehicle} />
      <Stack.Screen name="ValidateVehicles" component={ValidateVehicles} />
      <Stack.Screen name="VerifiedVehicles" component={VerifiedVehicles} />
      {/* <Stack.Screen name="AddBankdetails" component={Bankdetails} /> */}
      <Stack.Screen name="OnboardScreen" component={OnboardDriver} />
      <Stack.Screen name="DriverScan" component={DriverScan} />
      <Stack.Screen name="DriverIndex" component={DriverIndex} />
      <Stack.Screen name="DiscontinueDriver" component={DriverDiscontinue} />
      <Stack.Screen
        name="DriverDiscontinueList"
        component={DriverDiscontinueList}
      />
      <Stack.Screen name="AddDriver" component={AddDriver} />
      <Stack.Screen name="LicenseAdd" component={LicenseAdd} />
      <Stack.Screen name="AssignVehicle" component={AssignVehicle} />
      <Stack.Screen
        name="DiscontinueVehicles"
        component={DiscontinueVehicles}
      />
      <Stack.Screen
        name="VehicleDiscontinueList"
        component={VehicleDiscontinueList}
      />
      <Stack.Screen name="VehicleExpiry" component={VehicleExpiry} />
      <Stack.Screen name="Tracking" component={Tracking} />
      <Stack.Screen name='EditVehicles' component={EditVehicles}/>
    </Stack.Navigator>
  );
}
