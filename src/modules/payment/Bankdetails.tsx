import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import commonstyles from '@utils/commonstyles';
import AppHeader from '@components/custumcomponents/AppHeader';
import CustomCard from '@components/cards/CustomCard';
import { colors } from '@utils/colors';
import spacing from '@utils/spacing';
import LocalInput from '@components/Inputs/LocalInput';
import CustomButton from '@components/buttons/CustomButton';
import {
  setBankAdded,
  setVehicleAdded,
} from '@app/redux/slices/onboardingSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/hooks';
import { useNavigation } from '@react-navigation/native';
import CustomImagePicker from '@components/imagepicker/ImagePicker';
import { wp } from '@utils/responsive';
import FormContainer from '@components/custumcomponents/FormContainer';
import { useBankdetailsMutation } from '@app/redux/mutation/authApi';
import CustomDropdown from '@components/dropdown/CustomDropdown';
import { Accounttypes, bankOptions } from '@utils/constants';
import { setKycVerified } from '@app/redux/slices/AuthSlice';

export default function Bankdetails() {
  const [errors, setErrors] = useState<any>({});
  const { user } = useAppSelector(state => state.auth);
  const vendorid = user?.id;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [bankdetails] = useBankdetailsMutation();

  const [values, setValues] = useState({
    vendorid: vendorid,
    bank_ac_holder_name: '',
    account_type: '',
    bank_ac_number: '',
    bank_ac_number_verify: '',
    ifsc_code: '',
    bank_name: '',
    // branch_name: '',
    cheque_img: '',
  });
  const validate = () => {
    let newErrors: any = {};

    if (!values.bank_ac_number) {
      newErrors.bank_ac_number = 'Account number is required';
    }

    if (!values.bank_ac_number_verify) {
      newErrors.bank_ac_number_verify = 'Please confirm account number';
    }

    if (
      values.bank_ac_number &&
      values.bank_ac_number_verify &&
      values.bank_ac_number !== values.bank_ac_number_verify
    ) {
      newErrors.bank_ac_number_verify = 'Account numbers do not match';
    }

    return newErrors;
  };
  const handleChange = (key: string) => (value: string) => {
    setValues(prev => ({
      ...prev,
      [key]: value,
    }));

    // clear error when user types
    setErrors((prev: any) => ({
      ...prev,
      [key]: '',
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const resp = await bankdetails(values).unwrap();


      if (resp.status === '00') {
        dispatch(setKycVerified(true));

        Alert.alert('Success', 'KYC Updated Successfully');

        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeController' }],
        });
      } else {
        Alert.alert('Error', 'Error Occurred on Server');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message ||
        error?.message ||
        'Something went wrong',
      );
    }
  };

  return (
    <View style={commonstyles.container}>
      <AppHeader title="Banks detail" />
      <FormContainer disableTopSafeArea containerStyle={{padding:20}}>
      
          <LocalInput
            label="IFSC Code"
            value={values.ifsc_code}
            onChangeText={handleChange('ifsc_code')}
          />
             <LocalInput
            label="Bank Name & Branch"
            value={values.bank_name}
            onChangeText={handleChange('bank_name')}
          />
          {/* Account Holder */}
          {/* <CustomDropdown
            data={bankOptions}
            placeholder="Select Bank Options"
            value={values.bank_name}
            onSelect={item => {
              handleChange('bank_name')(item.value);
              handleChange('ifsc_code')(item.ifsc);
            }}
          /> */}

          {/* Account Number */}
          <LocalInput
            label="Account Number"
            value={values.bank_ac_number}
            onChangeText={handleChange('bank_ac_number')}
            keyboardType="number-pad"
            error={!!errors.bank_ac_number}
            errorMessage={errors.bank_ac_number}
          />

          {/* Confirm Account Number */}
          <LocalInput
            label="Confirm Account Number"
            value={values.bank_ac_number_verify}
            onChangeText={handleChange('bank_ac_number_verify')}
            keyboardType="number-pad"
            error={!!errors.bank_ac_number_verify}
            errorMessage={errors.bank_ac_number_verify}
          />
          <LocalInput
            label="Account Holder Name"
            value={values.bank_ac_holder_name}
            onChangeText={handleChange('bank_ac_holder_name')}
          />
          {/* Account Type */}
          {/* <Text style={styles.label}>Account Type</Text> */}
          <CustomDropdown
            label="Account Type"
            data={Accounttypes}
            value={values.account_type}
            onSelect={item => {
              handleChange('account_type')(item.value);
            }}
          />
          {/* 
          <View style={styles.accountTypeRow}>
            <TouchableOpacity
              style={[
                styles.accountTypeBtn,
                values.account_type === 'saving' && styles.activeBtn,
              ]}
              onPress={() => handleChange('account_type')('saving')}
            >
              <Text
                style={[
                  styles.accountTypeText,
                  values.account_type === 'saving' && styles.activeText,
                ]}
              >
                Saving
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.accountTypeBtn,
                values.account_type === 'current' && styles.activeBtn,
              ]}
              onPress={() => handleChange('account_type')('current')}
            >
              <Text
                style={[
                  styles.accountTypeText,
                  values.account_type === 'current' && styles.activeText,
                ]}
              >
                Current
              </Text>
            </TouchableOpacity>
          </View> */}



          {/* IFSC */}


          {/* Bank Name */}
          {/* <LocalInput
            label="Bank Name"
            value={values.bank_name}
            onChangeText={handleChange('bank_name')}
          /> */}

          {/* Branch */}
          {/* <LocalInput
            label="Branch"
            value={values.branch_name}
            onChangeText={handleChange('branch_name')}
          /> */}

          {/* Upload Image */}
          <View style={styles.uploadBox}>
            <CustomImagePicker
              label=" Add Your Passbook / cheque photo"
              containerStyle={{ height: wp(15) }}
              onImageSelected={img =>
                handleChange('cheque_img')(img?.uri || img)
              }
            />
            {values.cheque_img ? (
              <Text style={{ marginTop: 8, fontSize: 12 }}>
                Image Selected ✅
              </Text>
            ) : null}
          </View>

          {/* Save Button */}
          <CustomButton
            title="Save"
            onPress={handleSubmit}
            style={styles.saveBtn}
          />
      
      </FormContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.lg,
    padding: spacing.lg,
  },

  label: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },

  accountTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  accountTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },

  activeBtn: {
    backgroundColor: colors.primary,
  },

  accountTypeText: {
    color: colors.primary,
    fontWeight: '600',
  },

  activeText: {
    color: '#fff',
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: spacing.sm,
    padding: spacing.xl,
    marginTop: spacing.md,
    alignItems: 'center',
  },

  uploadText: {
    color: '#777',
  },

  saveBtn: {
    marginTop: spacing.xl,
    color: colors.primary,
    justifyContent:'center',
    alignSelf:'center',
    height:56,
    width:213
  },
});
