import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

import CustomDropdown from '@components/dropdown/CustomDropdown';
import CustomButton from '@components/buttons/CustomButton';
import CustomInput from '@components/Inputs/CustomInput';
import AppSnackbar from '@components/custumcomponents/AppSnackbar';

import { VendorFormValues } from './types';
import { companyTypes } from '@utils/constants';
import { colors } from '@utils/colors';
import { debounce } from '@utils/helpers';
import SecondaryButton from '@components/buttons/SecondaryButton';
import { useLazyGetPincodeQuery } from '@app/redux/query/queryApi';

type Props = {
  onNext: () => void;
};

export default function VendorForm({ onNext }: Props) {
  const { setFieldValue, values } = useFormikContext<VendorFormValues>();

const [getPincode] = useLazyGetPincodeQuery();

  const [snackbar, setSnackbar] = React.useState({
    visible: false,
    message: '',
    type: 'success',
  });
  const isSelf = values.companyType === 'Self';

const handlePincode = React.useCallback(async (value: string) => {
  if (!/^\d{6}$/.test(value)) return;

  try {
    const res = await getPincode({ pincode: value }).unwrap();

    const pincodeData = res?.data;

    setFieldValue('state', pincodeData?.state || '');
    setFieldValue('district', pincodeData?.district || '');
    setFieldValue('town', pincodeData?.office || '');
  } catch (err) {
    setFieldValue('state', '');
    setFieldValue('district', '');
    setFieldValue('town', '');
  }
}, [getPincode, setFieldValue]);

const debouncedPincode = useMemo(
  () => debounce(handlePincode, 500),
  [handlePincode]
);

  return (
    <View>
      {/* Vendor Name */}
      <CustomInput name="companyName" label="Vendor Name" />

      {/* Organization Type */}
      <CustomDropdown
        placeholder="Organization Type"
        data={companyTypes}
        value={values.companyType}
        onSelect={item =>
          setFieldValue('companyType', item.value)
        }
      
      />

      {!isSelf && (
        <CustomInput
          name="ownerName"
          label="Authorizes Person Name"
        />
      )}

      <CustomInput
        name="mobileNumber"
        label="Mobile Number"
        keyboardType="phone-pad"
      />

      <CustomInput name="building" label="Building / Apartment / Plot No" />
      <CustomInput name="area" label="Area / Street / Sector / Village" />

      <View style={styles.row}>
        <View style={styles.flex1}>
          <CustomInput
            name="pincode"
            label="Pincode"
            keyboardType="numeric"
            onChangeText={(value: string) => {
              setFieldValue('pincode', value);
              debouncedPincode(value);
            }}
          />
        </View>

        <View style={styles.flex1}>
          <CustomDropdown
            data={
              values.state
                ? [{ label: values.state, value: values.state }]
                : []
            }
            value={values.state}
            placeholder="State"
            onSelect={item =>
              setFieldValue('state', item.value)
            }
          />
        </View>
      </View>

      {/* District + Town */}
      <View style={styles.row}>
        <View style={styles.flex1}>
          <CustomDropdown
            placeholder="District"
            data={
              values.district
                ? [{ label: values.district, value: values.district }]
                : []
            }
            value={values.district}
            onSelect={item =>
              setFieldValue('district', item.value)
            }
          />
        </View>

        <View style={styles.flex1}>
          <CustomDropdown
            placeholder="Town / Tahsil"
            data={
              values.town
                ? [{ label: values.town, value: values.town }]
                : []
            }
            value={values.town}
            onSelect={item =>
              setFieldValue('town', item.value)
            }
          />
        </View>
      </View>

      {/* Next Button */}
      {/* <CustomButton
    
     
        style={styles.button}
        textStyle={styles.nextText}
      /> */}
      <SecondaryButton     onPress={onNext}     title="Next"/>

      {/* Snackbar */}
      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() =>
          setSnackbar(prev => ({ ...prev, visible: false }))
        }
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    width: 231,
    height: 56,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'center',
  },
  nextText: {
    fontSize: 24,
  },
});