import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {styles} from './OtpVerification.styles';

interface OtpVerificationProps {
  otpLength?: number;
  expirySeconds?: number;
  onSubmit?: (otp: string) => void;
  onResend?: () => void;
}

const OtpVerification = ({
  otpLength = 4,
  expirySeconds = 120,
  onSubmit,
  onResend,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [timer, setTimer] = useState(expirySeconds);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');

    if (!numericValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericValue.slice(-1);

    setOtp(newOtp);

    // Move to next input
    if (index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== otpLength) {
      return;
    }

    onSubmit?.(enteredOtp);
  };

  const handleResend = () => {
    setOtp(Array(otpLength).fill(''));
    setTimer(expirySeconds);

    inputRefs.current[0]?.focus();

    onResend?.();
  };

  const formatTime = (seconds: number) => {
    return `${seconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        Check your SMS For OTP
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={value => handleChange(value, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            style={[
              styles.otpInput,
              digit ? styles.otpInputFilled : undefined,
            ]}
          />
        ))}
      </View>

      {/* Timer */}
      <Text style={styles.timerText}>
        Your OTP will expire in{' '}
        <Text style={styles.timerValue}>
          {formatTime(timer)}
        </Text>{' '}
        seconds.
      </Text>

      {/* Submit */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.submitButton,
          otp.join('').length !== otpLength &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={otp.join('').length !== otpLength}>
        <Text style={styles.submitText}>
          Submit
        </Text>
      </TouchableOpacity>

      {/* Resend */}
      {timer === 0 && (
        <TouchableOpacity
          onPress={handleResend}
          style={styles.resendButton}>
          <Text style={styles.resendText}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OtpVerification;