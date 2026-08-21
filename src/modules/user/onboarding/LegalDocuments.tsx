import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFormikContext } from 'formik';
import CustomButton from '@components/buttons/CustomButton';
import { colors } from '@utils/colors';
import { VendorFormValues } from './types';
import CustomInput from '@components/Inputs/CustomInput';
import commonstyles from '@utils/commonstyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useGstverifyMutation } from '@app/redux/mutation/authApi';
import { useGetpancardMutation } from '@app/redux/query/queryApi';
import { Checkbox } from 'react-native-paper';
import { GST_REGEX, PAN_REGEX } from '@utils/constants';
import { moderateScale, normalizeFont, wp } from '@utils/responsive';
import { useLazyCheckDuplicateVehicleQuery } from '@app/redux/query/queryApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
type Props = {
  onPrev: () => void;
};

export default function LegalDocuments({ onPrev }: Props) {
  const { values, handleSubmit, setFieldValue } =
    useFormikContext<VendorFormValues>();
  const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const [gstStatus, setGstStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [panStatus, setPanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [checkDuplicateVehicleApi] = useLazyCheckDuplicateVehicleQuery();
  const [gstError, setGstError] = useState('');
  const [panError, setPanError] = useState('');
  const [vehicleErrors, setVehicleErrors] = useState<Record<number, string>>({});
  const [gstverify] = useGstverifyMutation();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const debounceRef = useRef<any>(null);
  const [gstname, setGstname] = useState('');
  const [panName, setPanName] = useState('');
  const [getPancard] = useGetpancardMutation();
  const currentStatus = checked ? panStatus : gstStatus;
  const currentError = checked ? panError : gstError;
  const currentName = checked ? panName : gstname;
  const vehicleDebounceRef = useRef<Record<number, any>>({});

  const isVerified = checked
    ? panStatus === 'success'
    : gstStatus === 'success';
  // ✅ Extract PAN from GST
  const extractPanFromGst = (gst: string) => {
    if (gst.length === 15) {
      return gst.substring(2, 12);
    }
    return '';
  };


  const isLocked = checked
    ? panStatus === 'success'
    : gstStatus === 'success';

  // ✅ Auto-fill PAN
  useEffect(() => {
    const gst = values.legaldocuments.gstnumber;

    if (gst?.length === 15) {
      const pan = extractPanFromGst(gst);
      setFieldValue('legaldocuments.pannumber', pan);
    }
  }, [values.legaldocuments.gstnumber]);

  const checkDuplicateVehicle = async (
    registrationNumber: string,
    index: number,
  ) => {
    try {
      const response = await checkDuplicateVehicleApi(registrationNumber).unwrap();

      if (response?.data?.isDuplicate) {
        setVehicleErrors(prev => ({
          ...prev,
          [index]: 'Vehicle already exists',
        }));
      } else {
        setVehicleErrors(prev => ({
          ...prev,
          [index]: '',
        }));
      }
    } catch (error) {
      console.log('Duplicate Vehicle API Error', error);
    }
  };



  // ✅ GST Verify API
  const handleValidate = async (gstValue?: string) => {
    try {
      const gst = (
        gstValue || values.legaldocuments.gstnumber
      )?.toUpperCase();

      if (!GST_REGEX.test(gst)) {
        setGstStatus('error');
        setGstError('Invalid GST format');
        return;
      }

      setLoading(true);
      setGstStatus('loading');
      setGstError('');

      const resp = await gstverify({
        gstin: gst,
      }).unwrap();

      if (resp?.status === '00') {
        setGstStatus('success');

        // Correct nested GST data
        const gstData = resp.data?.data;

        const companyName =
          gstData?.tradeNam ||
          gstData?.lgnm ||
          'GST Verified';

        setGstname(companyName);

        // Company name
        setFieldValue(
          'legaldocuments.companyName',
          companyName,
        );

        // Full address
        const addr = gstData?.pradr?.addr;

        const fullAddress = [
          addr?.bno,
          addr?.flno,
          addr?.bnm,
          addr?.st,
          addr?.locality,
          addr?.loc,
        ]
          .filter(Boolean)
          .join(', ');

        setFieldValue(
          'legaldocuments.address',
          fullAddress,
        );

        // Optional: fill additional address fields
        setFieldValue(
          'legaldocuments.pincode',
          addr?.pncd || '',
        );

        setFieldValue(
          'legaldocuments.district',
          addr?.dst || '',
        );

        setFieldValue(
          'legaldocuments.state',
          addr?.stcd || '',
        );
      } else {
        setGstStatus('error');
        setGstError(
          resp?.message || 'GST verification failed',
        );
      }
    } catch (error: any) {
      console.log('GST Verify Error:', error);

      setGstStatus('error');
      setGstError(
        error?.data?.message ||
        'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePanValidate = async () => {
    try {
      const pan = values.legaldocuments.pannumber?.toUpperCase();

      if (!pan || pan.length !== 10) {
        setPanStatus('error');
        setPanError('Invalid PAN format');
        return;
      }

      setLoading(true);
      setPanStatus('loading');
      setPanError('');

      const resp = await getPancard({
        pan: pan,
      }).unwrap();

      if (resp?.status === '00') {
        setPanStatus('success');

        // Correct nested PAN data
        const panData = resp.data?.data;

        const name =
          panData?.name_information?.pan_name_cleaned ||
          panData?.full_name ||
          'PAN Verified';

        setPanName(name);

        // Auto-fill company / owner name
        setFieldValue(
          'legaldocuments.companyName',
          name,
        );
      } else {
        setPanStatus('error');
        setPanError(
          resp?.message || 'PAN verification failed',
        );
      }
    } catch (error: any) {
      console.log('PAN Verify Error:', error);

      setPanStatus('error');
      setPanError(
        error?.data?.message ||
        'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!values.legaldocuments.vehicles.length) {
      setFieldValue('legaldocuments.vehicles', [
        { registrationNumber: '', capacity: '' },
      ]);
    }
  }, []);
  useEffect(() => {
    if (checked) {
      setGstStatus('idle');
      setGstname('');
      setGstError('');
    }
  }, [values.legaldocuments.pannumber]);


  useEffect(() => {
    if (checked) {
      // PAN mode
      setGstStatus('idle');
      setGstError('');
      setGstname('');
    } else {
      // GST mode
      setPanStatus('idle');
      setPanError('');
      setPanName('');
    }
  }, [checked]);
  useEffect(() => {
    if (gstStatus === 'success' && values.legaldocuments.gstnumber) {
      setGstStatus('idle');
      setGstError('');
    }
  }, [values.legaldocuments.gstnumber]);
  useEffect(() => {
    if (panStatus === 'success' && values.legaldocuments.pannumber) {
      setPanStatus('idle');
      setPanError('');
    }
  }, [values.legaldocuments.pannumber]);
  // const addNewVehicle = () => {
  //   const newVehicle = {
  //     registrationNumber: '',
  //     capacity: '',
  //   };

  //   setFieldValue('legaldocuments.vehicles', [
  //     ...values.legaldocuments.vehicles,
  //     newVehicle,
  //   ]);
  // };
  const addNewVehicle = () => {
    const lastVehicle = values.legaldocuments.vehicles.at(-1);

    if (!lastVehicle?.registrationNumber || !lastVehicle?.capacity) {
      Alert.alert('Please fill vehicle details first');
      return;
    }

    setFieldValue('legaldocuments.vehicles', [
      ...values.legaldocuments.vehicles,
      { registrationNumber: '', capacity: '' },
    ]);
  };
  const removeVehicle = (index: number) => {
    const updated = values.legaldocuments.vehicles.filter(
      (_, i) => i !== index,
    );
    setFieldValue('legaldocuments.vehicles', updated);
  };

  return (
    <View style={[commonstyles.flex1]}>
      <Text style={styles.header}>Kyc Validation</Text>

      <ScrollView showsVerticalScrollIndicator={false}>


        <View style={styles.fieldRow}>
          <View style={styles.labelBox}>
            <Text style={styles.labelText}>GST Number</Text>
          </View>

          <View style={styles.inputBox}>
            <CustomInput
              label=""
              name="legaldocuments.gstnumber"
              autoCapitalize="characters"
              maxLength={15}
              editable={!checked}
              status={gstStatus}
              customError={gstError}
              placeholder='Type GST Number'
              style={[
                {
                  textTransform: 'uppercase',
                  height: moderateScale(42),
                  width: '100%',
                },
                gstStatus === 'success'
                  ? { borderColor: colors.verify }
                  : undefined,
              ]}

              onChangeText={(text: string) => {
                const formatted = text
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 15);

                setFieldValue(
                  'legaldocuments.gstnumber',
                  formatted,
                );

                setGstError('');
                setGstname('');

                if (!formatted) {
                  setGstStatus('idle');
                  return;
                }

                if (formatted.length < 15) {
                  setGstStatus('error');
                  setGstError('GST must be 15 characters');
                  return;
                }

                // ✅ PATTERN VALIDATION
                if (!GST_REGEX.test(formatted)) {
                  setGstStatus('error');
                  setGstError('Invalid GST format');
                  return;
                }

                // ✅ SUCCESS
                setGstStatus('success');
              }}
            />
          </View>
        </View>

        {!values.legaldocuments.gstnumber && (
          <View style={styles.checkboxRow}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                const newValue = !checked;
                setChecked(newValue);

                if (newValue) {
                  setFieldValue('legaldocuments.gstnumber', '');
                  setFieldValue('legaldocuments.pannumber', '');

                  setGstStatus('idle');
                  setGstError('');
                  setGstname('');

                  setPanStatus('idle');
                  setPanError('');
                  setPanName('');
                }
              }}
            />

            <Text style={styles.GST}>No GST Registeration</Text>
          </View>
        )}

        {/* PAN */}
        <View style={styles.fieldRow}>
          <View style={styles.labelBox}>
            <Text style={styles.labelText}>PAN Number</Text>
          </View>

          <View style={styles.inputBox}>
            <CustomInput
              label=""
              name="legaldocuments.pannumber"
              autoCapitalize="characters"
              placeholder='Type PAN Number'
              maxLength={10}
              editable={(!values.legaldocuments.gstnumber || checked) && !isLocked}
              status={panStatus}
              customError={panError}

              style={[
                {
                  textTransform: 'uppercase',
                  height: moderateScale(42),
                  width: '100%',
                },
                gstStatus === 'success'
                  ? { borderColor: colors.verify }
                  : undefined,
              ]}
              onChangeText={(text: string) => {
                const formatted = text
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 10);

                setFieldValue(
                  'legaldocuments.pannumber',
                  formatted,
                );

                setPanError('');
                setPanName('');
                if (!formatted) {
                  setPanStatus('idle');
                  return;
                }

                if (formatted.length < 10) {
                  setPanStatus('error');
                  setPanError('PAN must be 10 characters');
                  return;
                }

                // ✅ PATTERN
                if (!PAN_REGEX.test(formatted)) {
                  setPanStatus('error');
                  setPanError('Invalid PAN format');
                  return;
                }

                // ✅ SUCCESS
                setPanStatus('success');
              }}
            />
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            borderColor:
              currentStatus === 'error'
                ? 'red'
                : currentStatus === 'success'
                  ? 'green'
                  : 'transparent',
            borderWidth: 1,
            backgroundColor: '#E9EAED',
            height: 56,
            borderRadius: 12,
            overflow: 'hidden',
            alignSelf: 'stretch', // ✅ important
          }}
        >
          <Text
            style={[
              styles.CompanyName,
              {
                color: currentStatus === 'error'
                  ? 'red'
                  : '#2A2A2A',
              },
            ]}
          >
            {currentName}
          </Text>
        </View>

        {/* Validate Button */}
        {/* <CustomButton
            onPress={() => handleValidate()}
            style={styles.validatebtn}
            title={loading ? 'Validating...' : 'Validate'}
          /> */}

        <CustomButton
          onPress={() => (checked ? handlePanValidate() : handleValidate())}
          style={styles.validatebtn}
          title={
            isVerified
              ? 'Verified'
              : loading
                ? 'Validating...'
                : 'Validate'
          }
          textStyle={styles.validatetext}
          disabled={isVerified}
        />

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Add Vehicles</Text>
        {/* Vehicles */}
        {/* Show label only once */}
        <View style={[commonstyles.row, styles.labelRow]}>
          <Text style={[commonstyles.flex1, styles.tableLabel]}>
            Registration Number
          </Text>
          <Text style={[commonstyles.flex1, styles.tableLabel]}>
            Loading Capacity
          </Text>
          <View style={{ width: 50 }} />
        </View>

        {values.legaldocuments.vehicles.map((_, index) => {
          const isLast = index === values.legaldocuments.vehicles.length - 1;

          return (
            <View key={index} style={styles.rowContainer}>

              <View style={{ flex: 1, width: 136, height: 56 }}>
                <CustomInput
                label=''
                  name={`legaldocuments.vehicles[${index}].registrationNumber`}
                  placeholder="eg MH02J123"
                  forceUppercase
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoComplete="off"
                  importantForAutofill="no"
                  keyboardType="default"
                  customError={vehicleErrors[index]}
                  onChangeText={(text: string) => {
                    const formatted = text
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '');

                    setFieldValue(
                      `legaldocuments.vehicles[${index}].registrationNumber`,
                      formatted,
                    );

                    setVehicleErrors(prev => ({
                      ...prev,
                      [index]: '',
                    }));

                    if (vehicleDebounceRef.current[index]) {
                      clearTimeout(vehicleDebounceRef.current[index]);
                    }

                    if (formatted.length >= 6) {
                      vehicleDebounceRef.current[index] = setTimeout(() => {
                        checkDuplicateVehicle(formatted, index);
                      }, 700);
                    }
                  }}
                />
              </View>

              <View style={{ flex: 1, width: 136, height: 56 }}>
                <CustomInput
                label=''
                  name={`legaldocuments.vehicles[${index}].capacity`}
                  placeholder="2000KG"
                  keyboardType="numeric"
                />
              </View>

              {/* Add / Remove Button */}
              <View >
                {isLast ? (
                  <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={addNewVehicle}
                  >
                    <MaterialIcons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => removeVehicle(index)}
                  >
                    <MaterialIcons name="delete" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonRow}>
        <CustomButton
          title="Back"
          onPress={onPrev}
          style={styles.backBtn}
          textStyle={styles.backBtnText}
          icon={
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.primary}
            />
          }
          iconPosition="left"
        />
        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          style={styles.submitBtn}
          textStyle={styles.submitbuttontext}

        // disabled={gstStatus || panStatus !== 'success'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: normalizeFont(18),
    fontWeight: '600',
    color: colors.primary,
    marginBottom: moderateScale(20),
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
  },

  backBtn: {
    flex: 1,
    marginRight: moderateScale(10),
    backgroundColor: '#FFFFFF',
    width: wp(44),
    height: moderateScale(56),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: moderateScale(8),
  },

  backBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: normalizeFont(18),
  },

  submitBtn: {
    flex: 1,
    marginLeft: moderateScale(10),
    width: wp(44),
    height: moderateScale(56),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(8),
  },

  submitbuttontext: {
    fontSize: normalizeFont(18),
    color: colors.background,
    fontWeight: '600',
  },

  validatebtn: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: moderateScale(50),
    width: wp(40),
    backgroundColor: colors.background,
    marginVertical: moderateScale(16),
    borderRadius: moderateScale(10),
  },

  validatetext: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
  },

  vehicleCard: {
    marginTop: moderateScale(16),
    paddingTop: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  cardTitle: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    color: colors.primary,
    marginBottom: moderateScale(12),
  },

  inputContainer: {
    position: 'relative',
  },

  cancelIcon: {
    position: 'absolute',
    top: moderateScale(-10),
    right: moderateScale(-10),
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: moderateScale(20),
    padding: moderateScale(2),
    elevation: 4,
  },

  GST: {
    marginVertical: moderateScale(7),
    textAlign: 'center',
    color: '#2A2A2A',
    fontSize: normalizeFont(14),
    fontWeight: '500',
  },

  /**
   * Form Row
   */
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(14),
  },

  /**
   * Fixed width prevents labels from pushing inputs down
   */

  labelBox: {
    width: wp(35), // 35–40% depending on your longest label
    justifyContent: 'center',
  },

  /**
   * Input takes remaining width
   */

  inputBox: {
    flex: 1,
    marginLeft: moderateScale(12),
  },

  labelText: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    color: colors.text,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },

  sectionTitle: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    marginVertical: moderateScale(10),
    color: colors.primary,
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: moderateScale(10),
  },

  labelRow: {
    marginBottom: moderateScale(8),
  },

  tableLabel: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#000000',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
    gap: moderateScale(20),
  },

  input: {
    height: moderateScale(40),
  },

  addBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(6),
  },

  removeBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(6),
  },

  plus: {
    fontSize: normalizeFont(20),
    color: colors.primary,
    fontWeight: 'bold',
  },

  CompanyName: {
    fontSize: normalizeFont(16),
    fontWeight: '500',
    textAlign: 'center',
  },

  iconWrapper: {
    width: moderateScale(40),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(5),
    borderColor: colors.primary,
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(8),
  },
});
