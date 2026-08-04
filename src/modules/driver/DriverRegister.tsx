import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import CustomInput from '@components/Inputs/CustomInput';
import CustomImagePicker from '@components/imagepicker/ImagePicker';
import { moderateScale } from '@utils/responsive';
import spacing from '@utils/spacing';
import CustomDatePicker from '@components/datepicker/CustomDatePicker';
type Props = {
  values: any;
  setFieldValue: (field: string, value: any) => void;
};

export default function DriverRegister({ values, setFieldValue }: Props) {


  return (
    <View style={styles.container}>
      {/* License Number */}
      <CustomInput name="licenseNumber" label="License Number" editable={false} />
      {/* <CustomInput
        name="dateofbirth"
        label="Date Of Birth (DD / MM / YYYY)"
        keyboardType="numeric"
      /> */}
      <CustomDatePicker
        label="Date of Birth"
        value={values.dateofbirth ? new Date(values.dateofbirth) : null}
        onChange={date => setFieldValue('dateofbirth', date)}
      />

      {/* License Upload Row */}
   {/* License Upload Row */}
<View style={styles.row}>
  {/* Front */}
  <View style={styles.card}>
    <Text style={styles.label}>
      License Front
    </Text>

    {values?.licensefront ? (
      <Image
        source={{
          uri: values.licensefront,
        }}
        style={styles.image}
        resizeMode="cover"
      />
    ) : null}

    {/* <CustomImagePicker
      label="License Front"
      onImageSelected={base64 =>
        setFieldValue(
          'licensefront',
          base64,
        )
      }
    /> */}
  </View>

  {/* Back */}
  <View style={styles.card}>
    <Text style={styles.label}>
      License Back
    </Text>

    {values?.licenseback ? (
      <Image
        source={{
          uri: values.licenseback,
        }}
        style={styles.image}
        resizeMode="cover"
      />
    ) : null}

    {/* <CustomImagePicker
      label="License Back"
      onImageSelected={base64 =>
        setFieldValue(
          'licenseback',
          base64,
        )
      }
    /> */}
  </View>
</View>

      {/* Other Fields */}

      <CustomInput
        name="mobileno"
        label="Phone Number"
        keyboardType="phone-pad"
        editable={false}
      />

      <CustomInput name="fullname" label="Full Name As Per DL"  editable={false}/>

      <CustomInput name="nickname" label="Nick Name" editable={false} />

      <CustomInput
        name="email"
        label="Type Email Id"
        keyboardType="email-address"
        editable={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(20),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },

  card: {
    flex: 1,
  },

  label: {
    fontSize: moderateScale(12),
    marginBottom: spacing.xs,
    color: '#000',
    fontWeight: '500',
  },

  image: {
    width: '100%',
    height: moderateScale(90),
    borderRadius: moderateScale(10),
  },
});
