// navigation/drawer/AppDrawer.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';
import BottomTabs from '@navigation/tabs/BottomTabs';
import CustomDrawerContent from '@components/common/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent props={props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width * 0.8,
          backgroundColor: '#FFFFFF',
        },
        drawerType: 'front',
        drawerPosition: 'left',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      
      }}
    >
      <Drawer.Screen name='Dashboard' component={BottomTabs} />

    </Drawer.Navigator>
  );
}