import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '@components/custumcomponents/AppHeader';
import LocalInput from '@components/Inputs/LocalInput';
import { columns, formatDate, licensedata } from '@utils/constants';
import commonstyles from '@utils/commonstyles';
import spacing from '@utils/spacing';
import CustomDatePicker from '@components/datepicker/CustomDatePicker';
import { normalizeFont, wp } from '@utils/responsive';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLicenseverifyMutation } from '@app/redux/mutation/authApi';
import { useDriver_verificationMutation } from '@app/redux/mutation/authApi';
import VendorSocket from '../../../sockets/VendorSocket';
import SecondaryButton from '@components/buttons/SecondaryButton';

export default function LicenseAdd() {
  const navigation = useNavigation<any>();
  const [isVerified, setIsVerified] = useState(false);
  const route = useRoute<any>();
  const driverData = route.params?.driverData;
  const licenseNo = driverData?.licenseNumber || '';
  const driverCode = route.params?.driverCode;
  const dobString = driverData?.dateofbirth; // string from API
  const driverName = driverData?.fullname || '';
  const driverAddress =
    `${driverData?.building || ''} ${driverData?.district || ''} ${driverData?.taluka || ''
      } ${driverData?.street || ''} ${driverData?.state || ''}`.trim();
  const parsedDOB = dobString ? new Date(dobString) : null;
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [values, setValues] = useState({
    licenseNo: licenseNo,
    dob: parsedDOB,
    name: '',
    address: '',
  });
  const [tableData, setTableData] = useState<any[]>([]);

// const createDriverPayload = (
//   form: any,
//   verifiedData: any,
// ) => {
//   return {
//     DriverCode: driverCode || 'DRV001',

//     LicenseNumber: 'MH1220231234567',
//     DOB: '1995-01-15',
//     FullName: 'REHMAT ALI',

//     RelativeName: 'MOHAMMED ALI',
//     Address: 'Room No. 12, Ghatkopar West, Mumbai, Maharashtra - 400086',

//     IssuingRTO: 'MH01',
//     IssueDate: '2023-01-10',

//     // Non Transport Validity
//     NTValidityFrom: '2023-01-10',
//     NTValidityTo: '2043-01-09',

//     // Transport Validity
//     TValidityFrom: '2023-01-10',
//     TValidityTo: '2028-01-09',

//     // Vehicle Class Details
//     VehicleClassCodes: ['MCWG', 'LMV', 'TRANS'],
//     VehicleClassIssueDates: [
//       '2023-01-10',
//       '2023-01-10',
//       '2023-01-10',
//     ],
//     VehicleClassExpiryDates: [
//       '2028-01-09',
//       '2028-01-09',
//       '2028-01-09',
//     ],
//   };
// };

  const createDriverPayload = (
    form: any,
    verifiedData: any,
  ) => {

    return {

      DriverCode: driverCode || '',
      LicenseNumber:
        verifiedData?.licenseNumber ||
        form.licenseNo,


      DOB:
        verifiedData?.dateOfBirth ||
        (
          form.dob
            ? new Date(form.dob)
              .toISOString()
              .split('T')[0]
            : ''
        ),


      FullName:
        verifiedData?.fullName ||
        form.name,


      RelativeName:
        verifiedData?.holder?.relativeName ||
        '',


      Address:
        verifiedData?.address ||
        form.address,


      IssuingRTO:
        verifiedData?.issuingRTO ||
        '',


      IssueDate:
        verifiedData?.issueDate ||
        '',



      // Non Transport Validity
      NTValidityFrom:
        verifiedData?.validity?.nonTransport?.from ||
        '',


      NTValidityTo:
        verifiedData?.validity?.nonTransport?.to ||
        '',



      // Transport Validity
      TValidityFrom:
        verifiedData?.validity?.transport?.from ||
        '',


      TValidityTo:
        verifiedData?.validity?.transport?.to ||
        '',



      // Vehicle Class Details
      VehicleClassCodes:
        verifiedData?.vehicleClasses?.map(
          (item: any) => item.class
        ) || [],



      VehicleClassIssueDates:
        verifiedData?.vehicleClasses?.map(
          (item: any) =>
            item.issueDate ||
            verifiedData?.issueDate ||
            ''
        ) || [],



      VehicleClassExpiryDates:
        verifiedData?.vehicleClasses?.map(
          (item: any) =>
            verifiedData?.validity?.transport?.to ||
            verifiedData?.validity?.nonTransport?.to ||
            ''
        ) || [],

    };
  };

  const handleChange = (key: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const [licenseverify,
    { isLoading }
  ] = useLicenseverifyMutation();

  const [driver_verification,
    { isLoading: isDriverVerificationLoading }
  ] = useDriver_verificationMutation();

  const handleSubmit = async () => {
    try {
      const payload = createDriverPayload(values, verifiedData);

      console.log('ONBOARD DRIVER PAYLOAD', payload);

      const resp = await driver_verification(payload).unwrap();

      if (resp?.status === '00') {
        VendorSocket.onboardDriver(resp?.data?.DriverUserId || '')
          .then((response: any) => {
            Alert.alert(response?.message || 'Driver onboarded successfully')
            // console.log('Driver onboarded successfully:', response);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Dashboard',
                },
              ],
            });
          })
          .catch((error: any) => {
            console.error('Error onboarding driver:', error);
          });
      } else {
        Alert.alert('Error', resp?.message || 'Something went wrong');
      }
    } catch (error: any) {
      console.log('Onboarding error:', error);

      // RTK Query error handling
      const message =
        error?.data?.message || error?.message || 'Failed to onboard driver';

      Alert.alert('Error', message);
    }
  };
  
  // const handleSubmit = async () => {

  //   try {

  //     const payload = createDriverPayload(
  //       values,
  //       verifiedData
  //     );

  //     console.log(
  //       "ONBOARD DRIVER PAYLOAD",
  //       payload
  //     );


  //     const resp = await driver_verification(payload).unwrap();


  //     if (resp?.status === '00') {
  //  VendorSocket.onboardDriver(resp?.data?.DriverUserId || '')
  //         .then((response: any) => {
  //           console.log('Driver onboarded successfully:', response);


  //       navigation.reset({
  //         index: 0,
  //         routes: [
  //           {
  //             name: 'Dashboard',
  //           }
  //         ]
  //       });

  //     }
  //     else {

  //       Alert.alert(
  //         "Error",
  //         resp?.message || "Something went wrong"
  //       );

  //     }


  //   } catch (error: any) {

  //     console.log(
  //       "Onboarding error:",
  //       error
  //     );


  //     // RTK Query error handling
  //     const message =
  //       error?.data?.message ||
  //       error?.message ||
  //       "Failed to onboard driver";


  //     Alert.alert(
  //       "Error",
  //       message
  //     );

  //   }

  // };


  // 🔹 Handle verify button
 
 
 
  const handleVerify = async () => {
    if (!values.licenseNo || !values.dob) {
      Alert.alert(
        'Please enter license number and DOB',
      );
      return;
    }

    try {
      const resp = await licenseverify({
        dl_number: values.licenseNo,
        dob: formatDate(values.dob),
      }).unwrap();

      if (
        resp?.status === '00' &&
        resp?.data?.verified
      ) {
        const data = resp.data;

        setVerifiedData(data);

        setValues(prev => ({
          ...prev,
          name: data.fullName || '',
          address: data.address || '',
        }));

        const formattedTable =
          (data.vehicleClasses || [])
            .map((item: any, index: number) => ({

              id: index.toString(),

              cov: item.class,

              issueDate:
                item.issueDate ||
                data.issueDate ||
                '',

              expiryDate:
                data.validity?.transport?.to ||
                data.validity?.nonTransport?.to ||
                ''

            }));

        setTableData(formattedTable);
        setIsVerified(true);

        Alert.alert(
          'Success',
          'Driving license verified successfully',
        );
      } else {
        Alert.alert(
          'Verification Failed',
          resp?.message ||
          'Unable to verify license',
        );
      }
    } catch (error) {
      console.log(
        'License verify error:',
        error,
      );
      Alert.alert(
        'Verification Failed',
        'Failed to verify license',
      );
    }
  };

  return (
    <View style={commonstyles.container}>
      {/* Header */}
      <AppHeader title="On board driver" />

      {/* Form Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.flexItem}>
            <LocalInput
              label="Enter License No"
              value={values.licenseNo}
              onChangeText={text => handleChange('licenseNo', text)}
            />
          </View>

          <View style={styles.flexItem}>
            <CustomDatePicker
              value={values.dob}
              onChange={date => handleChange('dob', date)}
            />
          </View>
        </View>


        <SecondaryButton title={
          isLoading
            ? 'Verifying...'
            : isVerified
              ? 'Verified'
              : 'Verify License'
        }
          onPress={handleVerify} style={styles.verify} />

      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={[commonstyles.semiBold, styles.title]}>
          Information as per Driving License
        </Text>

        <LocalInput
          label="Full Name As Per DL"
          value={values.name}
          editable={false}
        //   onChangeText={text => handleChange('name', text)}
        />

        <LocalInput
          label="Address as per driving license"
          value={values.address}
          editable={false}
          multiline
        // numberOfLines={5}
        //   onChangeText={text => handleChange('address', text)}
        />
      </View>

      {/* Table Section */}
      <View style={styles.tableContainer}>
        <View style={styles.table}>

          {/* Header */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText]}>Code</Text>
            <Text style={[styles.cell, styles.headerText]}>Date of Issue</Text>
            <Text style={[styles.cell, styles.headerText]}>Date of Expire</Text>
          </View>

          {/* Rows */}
          {tableData?.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item?.cov}</Text>
              <Text style={styles.cell}>{item?.issueDate}</Text>
              <Text style={styles.cell}>{item?.expiryDate}</Text>
            </View>
          ))}

        </View>
        <SecondaryButton
        title={isDriverVerificationLoading ? 'Submitting...' : 'Submit'}
        onPress={handleSubmit} style={{alignSelf:'center'}} />
        {/* <Custumtable
          columns={columns}
          data={tableData}
          keyExtractor={item => item.id}
        /> */}
      </View>
      
      {/* <CustomButton
      
        // disabled={isDriverVerificationLoading}
        style={styles.submit}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  title: {
    marginBottom: spacing.sm,
  },

  button: {
    marginTop: spacing.sm,
    height: 56,
    width: 213,
    alignSelf: 'center',
    fontSize: normalizeFont(24)
  },
  verify: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  tableContainer: {
    flex: 1,
    marginTop: spacing.md,
  },
  submit: {
    marginBottom: wp(15),
    marginHorizontal: spacing.lg,
    height: 56,
    width: 213,
    alignSelf: 'center',
    fontSize: normalizeFont(24)
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm, // or use margin if gap not supported
    alignItems: 'flex-end',
  },

  flexItem: {
    flex: 1,
  },
  //====
  table: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 8,
    overflow: 'hidden',
  },



  header: {
    backgroundColor: '#F2F2F2',
  },

  cell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#CFCFCF',
  },

  headerText: {
    fontWeight: '600',
  },

  // remove last column border
  lastCell: {
    borderRightWidth: 0,
  },
});
