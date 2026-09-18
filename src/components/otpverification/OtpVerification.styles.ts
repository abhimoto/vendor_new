import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,

    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',

    marginBottom: 18,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 16,

    marginBottom: 14,
  },

  otpInput: {
    width: 48,
    height: 48,

    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    borderRadius: 11,

    backgroundColor: '#FFFFFF',

    fontSize: 16,
    color: '#333333',

    padding: 0,
  },

  otpInputFilled: {
    borderColor: '#2F5FA7',
  },

  timerText: {
    fontSize: 13,
    color: '#999999',

    marginBottom: 14,
  },

  timerValue: {
    color: '#174EA6',
    fontWeight: '700',
  },

  submitButton: {
    width: 132,
    height: 44,

    borderRadius: 9,

    backgroundColor: '#315F9E',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 2,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  resendButton: {
    marginTop: 12,
  },

  resendText: {
    color: '#315F9E',
    fontSize: 14,
    fontWeight: '600',
  },
});