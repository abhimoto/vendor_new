import {useState} from 'react';

export const MPIN_LENGTH = 6;

const useMpin = () => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');

  const isMpinComplete = mpin.length === MPIN_LENGTH;
  const isConfirmComplete = confirmMpin.length === MPIN_LENGTH;

  const isMatch =
    isMpinComplete &&
    isConfirmComplete &&
    mpin === confirmMpin;

  const setMpinValue = (value: string) => {
    setMpin(
      value.replace(/[^0-9]/g, '').slice(0, MPIN_LENGTH),
    );
  };

  const setConfirmMpinValue = (value: string) => {
    setConfirmMpin(
      value.replace(/[^0-9]/g, '').slice(0, MPIN_LENGTH),
    );
  };

  const validate = () => {
    if (!isMpinComplete) {
      return {
        valid: false,
        message: `Please enter a ${MPIN_LENGTH}-digit MPIN.`,
      };
    }

    if (!isConfirmComplete) {
      return {
        valid: false,
        message: `Please confirm your ${MPIN_LENGTH}-digit MPIN.`,
      };
    }

    if (mpin !== confirmMpin) {
      return {
        valid: false,
        message: 'MPIN and Confirm MPIN do not match.',
      };
    }

    return {
      valid: true,
      message: '',
    };
  };

  const reset = () => {
    setMpin('');
    setConfirmMpin('');
  };

  return {
    mpin,
    confirmMpin,
    setMpinValue,
    setConfirmMpinValue,
    validate,
    reset,
    isMpinComplete,
    isConfirmComplete,
    isMatch,
  };
};

export default useMpin;