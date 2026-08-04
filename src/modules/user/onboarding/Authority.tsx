import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormikContext } from 'formik';
import CustomCard from '@components/cards/CustomCard';
import CustomButton from '@components/buttons/CustomButton';
import { colors } from '@utils/colors';
import { VendorFormValues, Authorities } from './types';
import commonstyles from '@utils/commonstyles';

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function Authority({ onNext, onPrev }: Props) {
  const { values, setFieldValue } = useFormikContext<VendorFormValues>();

  const handleNumberChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    setFieldValue('Numberofauthrity', numeric);
  };

  useEffect(() => {
    const target = parseInt(values.Numberofauthrity, 10) || 1; // convert to number, default 0
    const current = values.Authority.length;

    if (target > current) {
      const newOnes: Authorities[] = Array(target - current).fill({
        designation: '',
        fullname: '',
        mobileno: '',
        email: '',
      });
      setFieldValue('Authority', [...values.Authority, ...newOnes]);
    } else if (target < current) {
      setFieldValue('Authority', values.Authority.slice(0, target));
    }
  }, [values.Numberofauthrity]);

  return (
    <View style={commonstyles.flex1}>
      <CustomCard>
        <Text style={styles.title}>Operating Authority Other Than User</Text>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Maximum Authority</Text>
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            value={values.Numberofauthrity}
            onChangeText={handleNumberChange}
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
          />
        </View>

        <Text style={styles.subtitle}>
          Authorize another user to access this app on their mobile using the
          same credentials.
        </Text>

        <View style={styles.buttonRow}>
          <CustomButton
            title="Skip"
            style={styles.skipBtn}
            textStyle={{ color: colors.primary }}
            onPress={onPrev}
          />
          <CustomButton title="Next" style={styles.nextBtn} onPress={onNext} />
        </View>
      </CustomCard>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 20,
  },
  inputBox: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: '#555',
  },
  input: {
    width: 80,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipBtn: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  nextBtn: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: colors.primary,
  },
});
