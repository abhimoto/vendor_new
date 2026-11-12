import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MpinInput from './../components/MpinInput';

import {
  wp,
  verticalScale,
  moderateScale,
  normalizeFont,
} from '@utils/responsive';

interface LoginComponentProps {
  onLogin: (mpin: string) => void;
  loading?: boolean;
}

const LoginComponent = ({
  onLogin,
  loading = false,
}: LoginComponentProps) => {
  const [mpin, setMpin] = useState('');

  const handleLogin = () => {
    if (mpin.length !== 6) {
      return;
    }

    onLogin(mpin);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Login</Text>

      <Text style={styles.subtitle}>
        Login With Your MPIN
      </Text>

      {/* MPIN */}
      <View style={styles.mpinContainer}>
        <MpinInput
          value={mpin}
          onChangeText={setMpin}
        />
      </View>

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Enter the 6-digit MPIN
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.loginButton,
          mpin.length !== 6 && styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={loading || mpin.length !== 6}>
        <Text style={styles.loginText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },

  title: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
    color: '#111',
    marginTop: verticalScale(30),
  },

  subtitle: {
    fontSize: normalizeFont(12),
    color: '#333',
    marginTop: verticalScale(5),
  },

  mpinContainer: {
    marginTop: verticalScale(38),
    alignItems: 'center',
  },

  helperText: {
    fontSize: normalizeFont(11),
    color: '#333',
    textAlign: 'center',
    marginTop: verticalScale(10),
  },

  loginButton: {
    width: '100%',
    height: verticalScale(44),
    backgroundColor: '#315F9F',
    borderRadius: moderateScale(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(30),
  },

  disabledButton: {
    backgroundColor: '#8095B5',
  },

  loginText: {
    color: '#FFF',
    fontSize: normalizeFont(13),
    fontWeight: '700',
  },
});