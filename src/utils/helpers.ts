import { Alert } from 'react-native';

/**
 * ✅ Extract error message from API / JS error
 */
export const getErrorMessage = (error: any): string => {
  if (error?.data?.message) return error.data.message;
  if (error?.error) return error.error;
  if (error?.message) return error.message;
  return 'Something went wrong';
};

/**
 * ✅ Show Alert (fallback UI)
 */
export const showAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

/**
 * ✅ Validate Mobile Number (India)
 */
export const isValidMobile = (mobile: string): boolean => {
  return /^[6-9]\d{9}$/.test(mobile);
};

/**
 * ✅ Format OTP array → string
 */
export const formatOtp = (otp: string[]): string => {
  return otp.join('');
};

/**
 * ✅ Reset OTP array
 */
export const resetOtp = (length: number = 4): string[] => {
  return Array(length).fill('');
};

/**
 * ✅ Delay (useful for loaders, retry)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * ✅ Convert object to pretty JSON (debugging)
 */
export const prettyJson = (data: any): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * ✅ Check empty value
 */
export const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * ✅ Convert number → string safely
 */
export const toSafeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * ✅ Debounce (for search inputs)
 */
export const debounce = (func: Function, delay: number) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};
