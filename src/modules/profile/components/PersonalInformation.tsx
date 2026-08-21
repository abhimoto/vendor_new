import React, {useMemo} from 'react';
import {
  Text,
  View,
} from 'react-native';

import LocalInput from '@components/Inputs/LocalInput';
import CustomDropdown from '@components/dropdown/CustomDropdown';

import {companyTypes} from '@utils/constants';
import commonstyles from '@utils/commonstyles';
import {debounce} from '@utils/helpers';

import {
  ProfileValues,
} from '../types/profileTypes';

import {profileStyles} from '../styles/profileStyles';
import SecondaryButton from '@components/buttons/SecondaryButton';

interface Props {
  values: ProfileValues;

  onChange: (
    key: keyof ProfileValues,
    value: string,
  ) => void;

  handleUpdateProfile: () => Promise<any>;

  isUpdating: boolean;
}

export default function PersonalInformation({
  values,
  onChange,
  handleUpdateProfile,
  isUpdating,
}: Props) {

  // ==========================================
  // PINCODE
  // ==========================================

  const handlePincode = async (
    value: string,
  ) => {

    if (value.length !== 6) {
      return;
    }

    if (value === '400086') {

      onChange(
        'state',
        'Maharashtra',
      );

      onChange(
        'district',
        'Mumbai Suburban',
      );

      onChange(
        'town',
        'Ghatkopar',
      );

    } else {

      onChange(
        'state',
        'Maharashtra',
      );

      onChange(
        'district',
        'Mumbai',
      );

      onChange(
        'town',
        'Mumbai',
      );
    }
  };

  const debouncedPincode = useMemo(
    () =>
      debounce(
        handlePincode,
        500,
      ),
    [],
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <View
      style={[
        commonstyles.container,
        commonstyles.p20,
      ]}
    >

      {/* Vendor Name */}

      <LocalInput
        label="Vendor Name"
        value={values.vendorName}
        onChangeText={text =>
          onChange(
            'vendorName',
            text,
          )
        }
      />

      {/* Organization Type */}

      <CustomDropdown
        data={companyTypes}
        label="Organization Type"
        value={values.organizationType}
        onSelect={(item: any) =>
          onChange(
            'organizationType',
            item?.value ||
              item?.label ||
              '',
          )
        }
      />

      {/* Authorized Person */}

      <LocalInput
        label="Authorized Person"
        value={values.authorizedPerson}
        onChangeText={text =>
          onChange(
            'authorizedPerson',
            text,
          )
        }
      />

      {/* Mobile */}

      <LocalInput
        label="Mobile Number"
        keyboardType="number-pad"
        value={values.mobileNumber}
        onChangeText={text =>
          onChange(
            'mobileNumber',
            text,
          )
        }
      />

      {/* Building */}

      <LocalInput
        label="Building"
        value={values.building}
        onChangeText={text =>
          onChange(
            'building',
            text,
          )
        }
      />

      {/* Area */}

      <LocalInput
        label="Area"
        value={values.area}
        onChangeText={text =>
          onChange(
            'area',
            text,
          )
        }
      />

      {/* Pincode */}

      <LocalInput
        label="Pincode"
        keyboardType="number-pad"
        value={values.pincode}
        maxLength={6}
        onChangeText={text => {

          onChange(
            'pincode',
            text,
          );

          debouncedPincode(
            text,
          );
        }}
      />

      {/* State + District */}

      <View
        style={commonstyles.row}
      >

        <View
          style={commonstyles.flex1}
        >

          <CustomDropdown
            label="State"
            data={
              values.state
                ? [
                    {
                      label: values.state,
                      value: values.state,
                    },
                  ]
                : []
            }
            value={values.state}
          />

        </View>

        <View
          style={commonstyles.flex1}
        >

          <CustomDropdown
            label="District"
            data={
              values.district
                ? [
                    {
                      label:
                        values.district,
                      value:
                        values.district,
                    },
                  ]
                : []
            }
            value={values.district}
          />

        </View>

      </View>

      {/* Town */}

      <CustomDropdown
        label="Town"
        data={
          values.town
            ? [
                {
                  label: values.town,
                  value: values.town,
                },
              ]
            : []
        }
        value={values.town}
      />

      {/* UPDATE BUTTON */}

      <SecondaryButton
        title={
          isUpdating
            ? 'Updating...'
            : 'Update Profile'
        }
        onPress={
          handleUpdateProfile
        }
        disabled={isUpdating}
      />

    </View>
  );
}