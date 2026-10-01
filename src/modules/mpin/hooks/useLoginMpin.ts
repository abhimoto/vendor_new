import {useState} from 'react';
import {MPIN_LENGTH} from './useMpin';

const useLoginMpin = () => {
  const [mpin, setMpin] = useState('');

  const isMpinComplete = mpin.length === MPIN_LENGTH;

  const setMpinValue = (value: string) => {
    setMpin(
      value.replace(/[^0-9]/g, '').slice(0, MPIN_LENGTH),
    );
  };

  const validate = () => {
    if (!isMpinComplete) {
      return {
        valid: false,
        message: `Please enter your ${MPIN_LENGTH}-digit MPIN.`,
      };
    }

    return {
      valid: true,
      message: '',
    };
  };

  const reset = () => {
    setMpin('');
  };

  return {
    mpin,
    setMpinValue,
    validate,
    reset,
    isMpinComplete,
  };
};

export default useLoginMpin;