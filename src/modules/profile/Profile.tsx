import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import AppHeader from '@components/custumcomponents/AppHeader';
import LocalInput from '@components/Inputs/LocalInput';
import CustomDropdown from '@components/dropdown/CustomDropdown';
import CustomAccordion from '@components/custumcomponents/CustomAccordion';
import { useGetPincodeMutation, useUpdatevendordetailsMutation, useUpdatevendorkycMutation, useVehicleeditMutation } from '@app/redux/mutation/authApi';
import { useGetvendordetailsQuery, useGetvendorkycQuery } from '@app/redux/query/queryApi';
import { companyTypes } from '@utils/constants';
import commonstyles from '@utils/commonstyles';
import { debounce } from '@utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';
import { colors } from '@utils/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';
import CustomCard from '@components/cards/CustomCard';

export default function Profile() {
  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );
  const [activeAccordion, setActiveAccordion] =
    useState('personal');

  const [getPincode] =
    useGetPincodeMutation();
const {
  data: vendorDetails,
  isLoading: vendorLoading,
  refetch: refetchVendorDetails,
} = useGetvendordetailsQuery({
  vendorid: vendorid,
});

const {
  data: vendorKyc,
  isLoading: kycLoading,
  refetch: refetchVendorKyc,
} = useGetvendorkycQuery({
  vendorid: vendorid,
});
  const [updatevendor] = useUpdatevendordetailsMutation()
  const [updatekyc] = useUpdatevendorkycMutation()
  const [insertvehicle] = useVehicleeditMutation()
  console.log(vendorDetails)
  console.log(vendorKyc)

  const [values, setValues] = useState({
    vendorName: '',
    organizationType: '',
    authorizedPerson: '',
    mobileNumber: '',
    building: '',
    area: '',
    pincode: '',
    state: '',
    district: '',
    town: '',
    gstNumber: '',
    panNumber: '',
  });

  const [vehicles, setVehicles] = useState([
    {
      vehicleid: '',
      vendorid: vendorid || '',
      vehicleWeight: '',
      registrationNo: '',
    },
  ]);

  useEffect(() => {

    const vendor =
      vendorDetails?.data?.Vendor_Details?.[0];

    if (vendor) {

      setValues(prev => ({
        ...prev,

        vendorName:
          vendor?.companyName || '',

        organizationType:
          vendor?.companyType || '',

        authorizedPerson:
          vendor?.owner_name || '',

        mobileNumber:
          vendor?.mobileNo || '',

        building:
          vendor?.Building || '',

        area:
          vendor?.Area || '',

        pincode:
          vendor?.pincode || '',

        state:
          vendor?.state || '',

        district:
          vendor?.district || '',

        town:
          vendor?.Tahsil || '',
      }));
    }

  }, [vendorDetails]);
  useEffect(() => {

    const kyc =
      vendorKyc?.data?.[0];

    if (kyc) {

      setValues(prev => ({
        ...prev,

        gstNumber:
          kyc?.gstNo || '',

        panNumber:
          kyc?.panNo || '',
      }));
    }

  }, [vendorKyc]);
  const handleChange = (
    key: string,
    value: string,
  ) => {

    setValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePincode = async (
    value: string,
  ) => {

    if (value.length !== 6) {
      return;
    }

    try {

      const res = await getPincode({
        pincode: value,
      }).unwrap();

      const pincodeData = res?.data;
      console.log(pincodeData)

      handleChange(
        'state',
        pincodeData?.State || '',
      );

      handleChange(
        'district',
        pincodeData?.District || '',
      );

      handleChange(
        'town',
        pincodeData?.Name || '',
      );

    } catch (error) {

      console.log(
        'Pincode Error:',
        error,
      );
    }
  };

  const debouncedPincode =
    useMemo(
      () =>
        debounce(
          handlePincode,
          500,
        ),
      [],
    );

  const addVehicle = () => {

    const lastVehicle =
      vehicles[vehicles.length - 1];

    if (
      !lastVehicle.registrationNo ||
      !lastVehicle.vehicleWeight
    ) {
      return;
    }

    setVehicles([
      ...vehicles,
      {
        vehicleid: '',
        vendorid: vendorid || '',
        vehicleWeight: '',
        registrationNo: '',
      },
    ]);
  };

  const removeVehicle = (
    index: number,
  ) => {

    const updated = vehicles.filter(
      (_, i) => i !== index,
    );

    setVehicles(updated);
  };

  const handlePersonalUpdate =
    async () => {

      try {

        const payload = {
          vendorid: vendorid,

          companyName:
            values.vendorName,

          companyType:
            values.organizationType,

          owner_name:
            values.authorizedPerson,

          mobileNo:
            values.mobileNumber,

          Building:
            values.building,

          Area:
            values.area,

          pincode:
            values.pincode,

          state:
            values.state,

          district:
            values.district,

          Tahsil:
            values.town,
        };

        const response =
          await updatevendor(
            payload,
          ).unwrap();
        if (response.status =='00') {
           await refetchVendorDetails();
           Alert.alert(
    'Success',
    'Vendor Updated Successfully'
  );
        }
        console.log(
          'Vendor Updated:',
          response,
        );

      } catch (error) {

        console.log(
          'Vendor Update Error:',
          error,
        );
      }
    };


  const handleKycUpdate =
    async () => {

      console.log('clicked');

      try {

        const payload = {
          vendorid: vendorid,

          gstNo:
            values.gstNumber,

          panNo:
            values.panNumber,
        };

        const response =
          await updatekyc(
            payload,
          ).unwrap();
        if (response.status = '00') {
           await refetchVendorKyc();
           Alert.alert(
    'Success',
    'KYC Updated Successfully'
  );
        }


      } catch (error) {

        console.log(
          'KYC Update Error:',
          error,
        );
      }
    };

  const handleVehicleUpdate =
    async () => {

      try {

        const payload = {
          vendorid: vendorid,

          vehicles: vehicles.map(
            (item, index) => ({
              vehicleid: ''
              ,

              vehicleWeight:
                item.vehicleWeight,

              registrationNo:
                item.registrationNo,
            }),
          ),
        };

        console.log(
          'Vehicle Payload:',
          JSON.stringify(
            payload,
            null,
            2,
          ),
        );

        const response =
          await insertvehicle(
            payload,
          ).unwrap();

        if (response.status === '00') {

          Alert.alert(
            'Vehicle Inserted Successfully',
          );
        }

        console.log(
          'Vehicle Updated:',
          response,
        );

      } catch (error) {

        console.log(
          'Vehicle Update Error:',
          error,
        );
      }
    };


  const renderButton = (
    title: string,
    onPress: () => void,
  ) => {

    return (
      <TouchableOpacity
        style={styles.updateButton}
        onPress={onPress}>

        <Text
          style={
            styles.updateButtonText
          }>
          {title}
        </Text>

      </TouchableOpacity>
    );
  };

  const renderContent = () => {

    switch (activeAccordion) {

      case 'personal':

        return (

          <View
            style={[
              commonstyles.container,
              commonstyles.p20,
            ]}>

            <LocalInput
              label='Vendor Name'
              value={values.vendorName}
              onChangeText={text =>
                handleChange(
                  'vendorName',
                  text,
                )
              }
            />

            <CustomDropdown
              data={companyTypes}
              label='Organization Type'
              value={
                values.organizationType
              }
              onSelect={(item: any) =>
                handleChange(
                  'organizationType',
                  item?.value ||
                  item?.label,
                )
              }
            />

            <LocalInput
              label='Authorized Person'
              value={
                values.authorizedPerson
              }
              onChangeText={text =>
                handleChange(
                  'authorizedPerson',
                  text,
                )
              }
            />

            <LocalInput
              label='Mobile Number'
              keyboardType='number-pad'
              value={
                values.mobileNumber
              }
              onChangeText={text =>
                handleChange(
                  'mobileNumber',
                  text,
                )
              }
            />

            <LocalInput
              label='Pincode'
              keyboardType='number-pad'
              value={values.pincode}
              maxLength={6}
              onChangeText={text => {

                handleChange(
                  'pincode',
                  text,
                );

                debouncedPincode(
                  text,
                );
              }}
            />

            <View
              style={
                commonstyles.row
              }>

              <View
                style={
                  commonstyles.flex1
                }>

                <CustomDropdown
                  label='State'
                  data={
                    values.state
                      ? [
                        {
                          label:
                            values.state,
                          value:
                            values.state,
                        },
                      ]
                      : []
                  }
                  value={values.state}
                />

              </View>

              <View
                style={
                  commonstyles.flex1
                }>

                <CustomDropdown
                  label='District'
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
                  value={
                    values.district
                  }
                />

              </View>

            </View>

            <CustomDropdown
              label='Town'
              data={
                values.town
                  ? [
                    {
                      label:
                        values.town,
                      value:
                        values.town,
                    },
                  ]
                  : []
              }
              value={values.town}
            />

            {renderButton(
              'Update Profile',
              handlePersonalUpdate,
            )}

          </View>
        );

      case 'kyc':

        return (

          <View
            style={[
              commonstyles.container,
              commonstyles.p20,
            ]}>

            <LocalInput
              label='GST Number'
              value={
                values.gstNumber
              }
              autoCapitalize='characters'
              maxLength={15}
              onChangeText={text =>
                handleChange(
                  'gstNumber',
                  text.toUpperCase(),
                )
              }
            />

            <LocalInput
              label='PAN Number'
              value={
                values.panNumber
              }
              autoCapitalize='characters'
              maxLength={10}
              onChangeText={text =>
                handleChange(
                  'panNumber',
                  text.toUpperCase(),
                )
              }
            />

            {renderButton(
              'Update KYC',
              handleKycUpdate,
            )}

          </View>
        );

      case 'vehicle':

        return (

          <View
            style={[
              commonstyles.container,
              commonstyles.p20,
            ]}>

            <View
              style={[
                commonstyles.row,
                styles.labelRow,
              ]}>

              <Text
                style={[
                  commonstyles.flex1,
                  styles.tableLabel,
                ]}>
                Registration Number
              </Text>

              <Text
                style={[
                  commonstyles.flex1,
                  styles.tableLabel,
                ]}>
               Loading Capacity
              </Text>

              <View
                style={{
                  width: 40,
                }}
              />

            </View>

            {vehicles.map(
              (item, index) => {

                const isLast =
                  index ===
                  vehicles.length - 1;

                return (

                  <View
                    key={index}
                    style={
                      styles.rowContainer
                    }>

                    <View
                      style={{
                        flex: 1,
                      }}>

                      <LocalInput
                        label=''
                        value={
                          item.registrationNo
                        }
                        placeholder='MH02AB1234'
                        onChangeText={text => {

                          const updated =
                            [...vehicles];

                          updated[
                            index
                          ].registrationNo =
                            text.toUpperCase();

                          setVehicles(
                            updated,
                          );
                        }}
                      />

                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}>

                      <LocalInput
                        label=''
                        value={
                          item.vehicleWeight?.toString()
                        }
                        placeholder='12000 KG'
                        keyboardType='numeric'
                        onChangeText={text => {

                          const updated =
                            [...vehicles];

                          updated[
                            index
                          ].vehicleWeight =
                            text;

                          setVehicles(
                            updated,
                          );
                        }}
                      />

                    </View>

                    <View
                      style={
                        styles.iconWrapper
                      }>

                      {isLast ? (

                        <TouchableOpacity
                          onPress={
                            addVehicle
                          }>

                          <Text
                            style={
                              styles.addIcon
                            }>
                            ＋
                          </Text>

                        </TouchableOpacity>

                      ) : (

                        <TouchableOpacity
                          onPress={() =>
                            removeVehicle(
                              index,
                            )
                          }>

                          <Text
                            style={
                              styles.deleteIcon
                            }>
                            ✕
                          </Text>

                        </TouchableOpacity>

                      )}

                    </View>

                  </View>
                );
              },
            )}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() =>
                handleVehicleUpdate(
                  vehicles[0],
                )
              }>

              <Text
                style={
                  styles.updateButtonText
                }>
                Update Vehicles
              </Text>

            </TouchableOpacity>

          </View>
        );
      default:
        return null;
    }
  };

  return (

    <View
      style={
        commonstyles.flex1
      }>

      <AppHeader title='Profile' />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}>
<CustomCard>
 <CustomAccordion
  title="Personal Information"
  icon={
    <Image
      source={require('./../../assets/icons/profile.png')}
      style={{ width: 40, height: 40, tintColor: '#111827' }}
      resizeMode="contain"
    />
  }
  expanded={activeAccordion === 'personal'}
  onPress={() => setActiveAccordion('personal')}
/>

 <CustomAccordion
  title="KYC Validation"
  icon={
    <Image
      source={require('./../../assets/icons/kyc.png')}
      style={{ width: 40, height: 40, tintColor: '#111827' }}
      resizeMode="contain"
    />
  }
  expanded={activeAccordion === 'kyc'}
  onPress={() => setActiveAccordion('kyc')}
/>

 <CustomAccordion
  title="Add Vehicles"
  icon={
    <Image
      source={require('@assets/icons/vehicle.png')}
      style={{ width: 40, height: 40, tintColor: '#111827' }}
      resizeMode="contain"
    />
  }
  expanded={activeAccordion === 'vehicle'}
  onPress={() => setActiveAccordion('vehicle')}
/>
</CustomCard>
        {renderContent()}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelBox: {
    flex: 3,
  },

  inputBox: {
    flex: 7,
  },

  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  labelRow: {
    marginBottom: 10,
  },

  tableLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },

  iconWrapper: {
    width: 40,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderColor: colors.primary,
    borderWidth: 2, // required
    borderRadius: 8, // optional
  },
  addIcon: {
    fontSize: 24,
    color: '#2563EB',
    fontWeight: '700',
  },

  deleteIcon: {
    fontSize: 20,
    color: 'red',
    fontWeight: '700',
  },

  updateButton: {
    width: 213,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  updateButtonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});