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
import { useUploadDocumentMutation } from '@app/redux/mutation/authApi';

export default function Bankdetails() {
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [bankdetails] = useBankdetailsMutation();
  const [uploadDocument] = useUploadDocumentMutation();
  const [values, setValues] = useState({
    AccountHolderName: '',
    BankName: '',
    BranchName: '',
    AccountNumber: '',
    ConfirmAccountNumber: '',
    IFSCCode: '',
    AccountType: '',
    PassbookPhoto: null as any,
  });
  const validate = () => {
    let newErrors: any = {};

    if (!values.AccountNumber) {
      newErrors.AccountNumber = 'Account number is required';
    }

    if (!values.ConfirmAccountNumber) {
      newErrors.ConfirmAccountNumber =
        'Please confirm account number';
    }

    if (
      values.AccountNumber &&
      values.ConfirmAccountNumber &&
      values.AccountNumber !== values.ConfirmAccountNumber
    ) {
      newErrors.ConfirmAccountNumber =
        'Account numbers do not match';
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
      let uploadedPath = '';

      if (values.PassbookPhoto?.uri) {
        const uploadResp = await uploadDocument({
          documentType: 'PROFILE',
          file: values.PassbookPhoto,
        }).unwrap();

        if (uploadResp.status !== '00') {
          Alert.alert(
            'Error',
            uploadResp.message || 'Document upload failed'
          );
          return;
        }

        uploadedPath = uploadResp.data.fileUrl; // use the uploaded file URL
      }

      const payload = {
        AccountHolderName: values.AccountHolderName,
        BankName: values.BankName,
        BranchName: values.BranchName,
        AccountNumber: values.AccountNumber,
        ConfirmAccountNumber: values.ConfirmAccountNumber,
        IFSCCode: values.IFSCCode,
        AccountType: values.AccountType,
        PassbookPhoto: uploadedPath,
      };

      const resp = await bankdetails(payload).unwrap();

      if (resp.status === '00') {
        dispatch(setKycVerified(true));

        Alert.alert('Success', 'KYC Updated Successfully');

        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeController' }],
        });
      } else {
        Alert.alert(
          'Error',
          resp.message || 'Error Occurred on Server'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message ||
        error?.message ||
        'Something went wrong'
      );
    }
  };
  return (
    <View style={commonstyles.container}>
      <AppHeader title="Banks detail" />
      <FormContainer disableTopSafeArea containerStyle={{ padding: 20 }}>

        <LocalInput
          label="IFSC Code"
          value={values.IFSCCode}
          onChangeText={handleChange('IFSCCode')}
        />
        <LocalInput
          label="Bank Name"
          value={values.BankName}
          onChangeText={handleChange('BankName')}
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
          value={values.AccountNumber}
          onChangeText={handleChange('AccountNumber')}
          keyboardType="number-pad"
          error={!!errors.AccountNumber}
          errorMessage={errors.AccountNumber}
        />

        {/* Confirm Account Number */}
        <LocalInput
          label="Confirm Account Number"
          value={values.ConfirmAccountNumber}
          onChangeText={handleChange('ConfirmAccountNumber')}
          keyboardType="number-pad"
          error={!!errors.ConfirmAccountNumber}
          errorMessage={errors.ConfirmAccountNumber}
        />
        <LocalInput
          label="Account Holder Name"
          value={values.AccountHolderName}
          onChangeText={handleChange('AccountHolderName')}
        />
        {/* Account Type */}
        {/* <Text style={styles.label}>Account Type</Text> */}
        <CustomDropdown
          label="Account Type"
          data={Accounttypes}
          value={values.AccountType}
          onSelect={item => {
            handleChange('AccountType')(item.value);
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
            label="Add Your Passbook / Cheque Photo"
            containerStyle={{ height: wp(15) }}
            onImageSelected={img =>
              setValues(prev => ({
                ...prev,
                PassbookPhoto: img,
              }))
            }
          />

          {values.PassbookPhoto ? (
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
    justifyContent: 'center',
    alignSelf: 'center',
    height: 56,
    width: 213
  },
});
