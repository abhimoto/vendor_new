import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Expense from '@modules/expense/Expense';
import Payments from '@modules/payment/Payments';
import Profile from '@modules/profile/Profile';
import CustomTabBar from '@components/tabbar/CustumTab';
import NewLoad from '@modules/loads/NewLoad';
import HomeStack from '@navigation/stacks/StackNavigator';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Expense" component={Expense} />
      <Tab.Screen name="Load" component={NewLoad} />
      <Tab.Screen name="Payments" component={Payments} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
