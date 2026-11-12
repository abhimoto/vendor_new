import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import LoginComponent from './../components/LoginComponent';

import {
  useLoginMpinMutation,
} from '@app/redux/mutation/authApi';

import {
  useAppDispatch,
  useAppSelector,
} from '@app/hooks/hooks';

import {
  setAuthData,
  setMpinVerified,
} from '@app/redux/slices/AuthSlice';

const LoginMpin = () => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector(
    state => state.auth.user?.id,
  );

  const existingUser = useAppSelector(
    state => state.auth.user,
  );

  const [loginMpin, {isLoading}] =
    useLoginMpinMutation();

  const handleLogin = async (mpin: string) => {
    if (!userId) {
      Alert.alert(
        'Login',
        'User information not found. Please login again.',
      );

      return;
    }

    try {
      const response = await loginMpin({
        userId,
        mpin,
      }).unwrap();

      console.log(
        'LOGIN MPIN RESPONSE:',
        response,
      );

      if (response?.status !== '00') {
        Alert.alert(
          'MPIN',
          response?.message ||
            'Invalid MPIN',
        );

        return;
      }

      const data = response.data;

      /**
       * Update complete authenticated session.
       */
      dispatch(
        setAuthData({
          token: data.accessToken,

          refreshToken:
            data.refreshToken,

          user: {
            id: data.userId,
            mobile: data.mobile,
            role: data.role,

            vendorId:
              data.vendorId,

            vendorCode:
              data.vendorCode,
          },

          vendor_onboarded:
            data.isVendorProfileCreated,

          vehicle_verified:
            data.isVehicleVerified,

          kyc_verified:
            data.isKycVerified,

          isMpincreated:
            data.isMpincreated,

          isMpinVerified: true,
        }),
      );

      /**
       * DO NOT NAVIGATE.
       *
       * RootNavigator will automatically
       * render AppDrawer because:
       *
       * isAuthenticated = true
       * onboarding complete = true
       * isMpinVerified = true
       */
    } catch (error: any) {
      console.log(
        'LOGIN MPIN ERROR:',
        error,
      );

      Alert.alert(
        'MPIN',
        error?.data?.message ||
          error?.message ||
          'Unable to login with MPIN',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LoginComponent
          onLogin={handleLogin}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginMpin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});