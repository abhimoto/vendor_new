import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import commonstyles from '@utils/commonstyles';
import CustomButton from '@components/buttons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@utils/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';
import { AUTH_ROUTES, HOME_ROUTES } from '@navigation/routes';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@app/redux/mutation/authApi';
import AppSnackbar from '@components/custumcomponents/AppSnackbar';
import {
  setAuthData,
  setMobile as setMobileRedux,
} from '@app/redux/slices/AuthSlice';
import { useAppDispatch } from '@app/hooks/hooks';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Login() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const inputRefs = useRef<TextInput[]>([]);

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'default' as 'default' | 'success' | 'error' | 'warning',
  });

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const showSnackbar = (
    message: string,
    type: 'default' | 'success' | 'error' | 'warning' = 'default',
  ) => {
    setSnackbar({
      visible: true,
      message,
      type,
    });
  };

  // ✅ Timer logic (fixed)
  useEffect(() => {
    if (!otpSent) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent]);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      showSnackbar(
        'Enter valid mobile number',
        'error',
      );
      return;
    }

    dispatch(setMobileRedux(mobile));

    try {
      const res = await sendOtp({
        mobile_number: mobile,
      }).unwrap();

      if (res.status === '00') {
        setOtpSent(true);

        // ✅ reset timer
        setTimer(60);

        // ✅ clear old otp
        setOtp(['', '', '', '']);

        showSnackbar(
          'OTP sent successfully',
          'success',
        );
      } else {
        showSnackbar(
          res?.message || 'Failed to send OTP',
          'error',
        );
      }
    } catch (err: any) {
      showSnackbar(
        err?.data?.message ||
        'Failed to send OTP',
        'error',
      );
    }
  };

  // ✅ OTP change handler
  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ✅ Backspace handler
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      showSnackbar('Enter valid OTP', 'error');
      return;
    }

    try {
      const res = await verifyOtp({
        mobile_number: mobile,
        otp: enteredOtp,
      }).unwrap();

      console.log('Verify Response:', res);

      if (res?.status === '00') {
        const userDetails = res?.userDetails;
        if (userDetails?.status === '01') {
          showSnackbar(
            res?.message || 'OTP verified successfully',
            'success',
          );

          navigation.navigate(
            AUTH_ROUTES.VENDORONBOARDING,
          );

          return;
        }

        // ✅ Existing Vendor Login
        dispatch(
          setAuthData({
            token: '',
            refreshToken: null,

            user: {
              id: userDetails?.vendorid || '',
              companyName:
                userDetails?.companyName || '',
              mobile:
                userDetails?.mobileNo || '',
            },

            vendor_onboarded:
              userDetails?.vendor_onboarded ||
              false,

            kyc_verified:
              userDetails?.kyc_verify || false,

            vehicle_verified:
              userDetails?.vehicle_verify_flag ===
              'Y',
          }),
        );

        showSnackbar(
          res?.message || 'Login successful',
          'success',
        );
      } else {
        showSnackbar(
          res?.message || 'Login failed',
          'error',
        );
      }
    } catch (err: any) {
      console.log('Verify Error:', err);

      showSnackbar(
        err?.data?.message || 'Invalid OTP',
        'error',
      );
    }
  };

  return (
    <View
      style={[
        commonstyles.container,
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Title */}
      <Text style={[commonstyles.textCenter, styles.title, commonstyles.m10]}>
        Hi, Welcome To{'\n'}
        <Text>Motohelp</Text>
      </Text>

      {/* Mobile Number */}
      <Text style={styles.label}>Enter Mobile number for verification</Text>

      <View style={styles.mobileRow}>
        <View style={styles.countryBox}>
          <Text>🇮🇳 +91</Text>
        </View>

        <TextInput
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
          style={styles.mobileInput}
          placeholder="Enter mobile"
          maxLength={10}
        />
      </View>

      {/* Send OTP */}
      <CustomButton
        onPress={handleSendOtp}
        title={sending ? 'Sending...' : 'Send OTP'}
        style={styles.loginbtn}
        textStyle={styles.VerifyText}
        disabled={sending || mobile.length !== 10}
      />
      <View style={styles.otpcontainer}>
        {/* OTP Section */}
        {otpSent && (
          <>
            <Text style={styles.label}>Check your SMS For OTP</Text>

            <View style={styles.otpRow}>
              {otp.map((item, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref!)}
                  value={item}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.otpBox}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                />
              ))}
            </View>

            {/* Timer / Resend */}
            {timer > 0 ? (
              <Text style={styles.expireText}>OTP expires in {timer} sec</Text>
            ) : (
              <Text
                style={[styles.expireText, { color: colors.primary }]}
                onPress={handleSendOtp}
              >
                Resend OTP
              </Text>
            )}

            {/* Verify */}
            <CustomButton
              onPress={handleVerify}
              title={verifying ? 'Verifying...' : 'Verify'}
              style={styles.loginbtn}
              textStyle={styles.VerifyText}
              disabled={verifying || otp.join('').length !== 4}
            />
          </>
        )}
      </View>
      {/* Snackbar */}
      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
  },

  label: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 25,
    fontSize: 14,
  },

  mobileRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  countryBox: {
    borderWidth: 1,
    borderColor: '#1B4AA5',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
  },

  mobileInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1B4AA5',
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  otpRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  otpBox: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#1B4AA5',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    marginRight: 10,
  },

  expireText: {
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
  },
  loginbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginTop: 15,
    width: 213,
    height: 56,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10
  },
  otpcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  VerifyText: {
    fontSize: 24
  }
});
