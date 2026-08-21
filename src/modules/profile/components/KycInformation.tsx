import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LocalInput from '@components/Inputs/LocalInput';
import commonstyles from '@utils/commonstyles';

import {
  ProfileValues,
} from '../types/profileTypes';

import {profileStyles} from '../styles/profileStyles';

interface Props {
  values: ProfileValues;
  onChange: (
    key: keyof ProfileValues,
    value: string,
  ) => void;
}

export default function KycInformation({
  values,
  onChange,
}: Props) {

  const handleUpdate = () => {

    console.log(
      'KYC Update:',
      {
        gstNo: values.gstNumber,
        panNo: values.panNumber,
      },
    );

    Alert.alert(
      'Success',
      'KYC Updated Successfully',
    );
  };

  return (
    <View
      style={[
        commonstyles.container,
        commonstyles.p20,
      ]}>

      <LocalInput
        label="GST Number"
        value={values.gstNumber}
        autoCapitalize="characters"
        maxLength={15}
        onChangeText={text =>
          onChange(
            'gstNumber',
            text.toUpperCase(),
          )
        }
      />

      <LocalInput
        label="PAN Number"
        value={values.panNumber}
        autoCapitalize="characters"
        maxLength={10}
        onChangeText={text =>
          onChange(
            'panNumber',
            text.toUpperCase(),
          )
        }
      />

      <TouchableOpacity
        style={profileStyles.updateButton}
        onPress={handleUpdate}>

        <Text
          style={
            profileStyles.updateButtonText
          }>
          Update KYC
        </Text>

      </TouchableOpacity>

    </View>
  );
}