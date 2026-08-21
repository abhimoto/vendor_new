import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '@components/Inputs/CustomInput';
import spacing from '@utils/spacing';
import { moderateScale } from '@utils/responsive';
type Props = {
  values: any;
  setFieldValue: (field: string, value: any) => void;
};


export default function DriverDocument({ values, setFieldValue }: Props) {
  const aadharFront = `https://stag.motohelpindia.com${values?.aadharfront || ''}`;
const aadharBack = `https://stag.motohelpindia.com${values?.aadharback || ''}`;
console.log(aadharFront,aadharBack)

  return (
    <View style={styles.container}>
      {/* Address Fields */}
      <CustomInput name="building" label="Building , Apartment" editable={false} />
      <CustomInput name="street" label="Street , Area" editable={false} />

      {/* Row - Pin + Town */}
      <View style={styles.row}>
        <View style={styles.half}>
          <CustomInput name="pincode" label="Pin code" keyboardType="numeric" editable={false} />
        </View>
        <View style={styles.half}>
          <CustomInput name="taluka" label="Town / Tahsil" editable={false} />
        </View>
      </View>

      {/* Row - State + District */}
      <View style={styles.row}>
        <View style={styles.half}>
          <CustomInput name="state" label="State" editable={false} />
        </View>
        <View style={styles.half}>
          <CustomInput name="district" label="District" editable={false} />
        </View>
      </View>

      {/* Aadhaar Number */}
      <CustomInput
        name="aadharNumber"
        label="Aadhaar Card Number"
        keyboardType="numeric"
        editable={false}
        formatType="aadhaar"

      />

      {/* Aadhaar Upload */}
      {/* Aadhaar Upload */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>
            Aadhaar Card Front
          </Text>

          {values?.aadharfront ? (
              <Image
              source={{
                uri: aadharFront,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}

          {/* <CustomImagePicker
      label="Upload Front"
      onImageSelected={base64 =>
        setFieldValue(
          'aadharfront',
          base64,
        )
      }
    /> */}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Aadhaar Card Back
          </Text>

          {values?.aadharback ? (
              <Image
              source={{
                uri: aadharBack,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}

          {/* <CustomImagePicker
      label="Upload Back"
      onImageSelected={base64 =>
        setFieldValue(
          'aadharback',
          base64,
        )
      }
    /> */}
        </View>
      </View>

      {/* Reference */}
      <CustomInput
        name="referenceName"
        label="Name of family member / Reference"
        editable={false}
      />

      {/* Row - Phone + Relation */}
      <View style={styles.row}>
        <View style={styles.half}>
          <CustomInput
            name="referencePhone"
            label="Phone Number"
            keyboardType="phone-pad"
            editable={false}
          />
        </View>

        <View style={styles.half}>
          <CustomInput name="relation" label="Relation" editable={false} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(20),
    paddingBottom: spacing.xl,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  half: {
    flex: 1,
  },

  card: {
    flex: 1,
  },

  label: {
    fontSize: moderateScale(12),
    marginBottom: spacing.xs,
    fontWeight: '500',
    color: '#000',
  },

  image: {
    width: '100%',
    height: moderateScale(90),
    borderRadius: moderateScale(10),
  },
});
