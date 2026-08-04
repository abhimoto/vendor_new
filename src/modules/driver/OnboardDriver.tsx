
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import React, {
  useState,
  useCallback,
  useRef,
} from 'react';

import commonstyles from '@utils/commonstyles';
import { colors } from '@utils/colors';

import AppHeader from '@components/custumcomponents/AppHeader';
import CustomButton from '@components/buttons/CustomButton';
import CustomModal from '@components/modal/CustomModal';
import QRScanner from '@components/common/QRScanner';
import { SOCKET_EVENTS } from '@socket';

import spacing from '@utils/spacing';

import {
  moderateScale,
  wp,
  hp,
} from '@utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { HOME_ROUTES } from '@navigation/routes';
import { useGetdriverdatabyscanMutation } from '@app/redux/query/queryApi';
import {
  IconButton,
  Surface,
  HelperText,
} from 'react-native-paper';
// import socket from '@redux/sockets/sockets/socket.instance';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';

interface DriverData {
  driver_id: string;
  driver_name?: string;
}

export default function OnboardDriver() {
  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );
  const navigation = useNavigation<any>();

  const [visible, setVisible] = useState(false);

  const [userId, setUserId] = useState('');

  const [userIdError, setUserIdError] =
    useState('');

  const [showScanner, setShowScanner] =
    useState(false);

  const [getDriverDataByScan, { isLoading }] =
    useGetdriverdatabyscanMutation();

  const inputRef = useRef<TextInput>(null);

  const scanningRef = useRef(false);

  /* ---------------- VALIDATION ---------------- */

  const validateUserId = useCallback(
    (id: string): boolean => {
      if (!id.trim()) {
        setUserIdError('User ID is required');

        return false;
      }

      if (id.trim().length < 3) {
        setUserIdError(
          'User ID must be at least 3 characters',
        );

        return false;
      }

      setUserIdError('');

      return true;
    },
    [],
  );

  /* ---------------- INPUT CHANGE ---------------- */

  const handleUserIdChange = useCallback(
    (text: string) => {
      setUserId(text);

      if (userIdError) {
        validateUserId(text);
      }
    },
    [userIdError, validateUserId],
  );

  /* ---------------- MANUAL SUBMIT ---------------- */

  const handleSubmit = useCallback(async () => {
    if (!validateUserId(userId)) {
      inputRef.current?.focus();

      return;
    }

    try {
      const response =
        await getDriverDataByScan({
          onboard_id: userId.trim(),
        }).unwrap();
      console.log('data of manual entry', response)
      if (response?.status === '00') {
        const driverData: DriverData =
          response?.data?.[0];
        console.log('this is driver details', driverData)
       
        if (!driverData?.driver_id) {
          Alert.alert(
            'Driver Not Found',
            'No driver found with the provided User ID.',
            [
              {
                text: 'OK',
                onPress: () =>
                  inputRef.current?.focus(),
              },
            ],
          );

          return;
        }


        setVisible(false);

        setUserId('');

        navigation.navigate(
          HOME_ROUTES.DRIVERINDEX,
          {
            scannedData: JSON.stringify({
              driver_id:
                driverData.driver_id,

              driver_name:
                driverData.driver_name,

              timestamp:
                new Date().toISOString(),
            }),
          },
        );
      } else {
        Alert.alert(
          'Error',
          response?.message ||
          'Failed to fetch driver data',
        );
      }
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        'Error',
        error?.message ||
        'Something went wrong',
      );
    }
  }, [
    userId,
    validateUserId,
    getDriverDataByScan,
    navigation,
  ]);

  /* ---------------- OPEN SCANNER ---------------- */

  const handleQRCodeScan = useCallback(() => {
    setShowScanner(true);
  }, []);

  /* ---------------- HANDLE QR SCAN ---------------- */

  const handleScan = useCallback(
    async (data: string) => {
      if (scanningRef.current) return;

      scanningRef.current = true;

      try {
        console.log('RAW QR DATA =>', data);

        let onboardId = data;

        try {
          const parsedData = JSON.parse(data);

          onboardId =
            parsedData?.onboard_id ||
            parsedData?.user_id ||
            parsedData?.driver_id ||
            data;
        } catch {
          onboardId = data;
        }

        const cleanData = onboardId
          ?.replace(/[\r\n\t]/g, '')
          ?.trim();

        const response =
          await getDriverDataByScan({
            driver_id: cleanData,
          }).unwrap();


        if (
          String(response?.status) === '00'
        ) {
          const driverData =
            response?.data?.[0];

          if (!driverData?.driver_id) {
            Alert.alert(
              'Driver Not Found',
              'No driver found for this QR code',
            );

            return;
          }
      
          setShowScanner(false);

          navigation.navigate(
            HOME_ROUTES.DRIVERINDEX,
            {
              scannedData: JSON.stringify({
                driver_id:
                  driverData.driver_id,

                driver_name:
                  driverData.driver_name,

                timestamp:
                  new Date().toISOString(),
              }),
            },
          );
        } else {
          Alert.alert(
            'Error',
            response?.message ||
            'Failed to fetch driver',
          );
        }
      } catch (error: any) {

        Alert.alert(
          'Error',
          error?.message ||
          'QR verification failed',
        );
      } finally {
        scanningRef.current = false;
      }
    },
    [getDriverDataByScan, navigation],
  );

  /* ---------------- CLOSE MODAL ---------------- */

  const handleCloseModal = useCallback(() => {
    setVisible(false);

    setUserId('');

    setUserIdError('');
  }, []);

  /* ---------------- OPEN MANUAL ENTRY ---------------- */

  const handleManualEntry = useCallback(() => {
    setVisible(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  /* ---------------- QR SCANNER ---------------- */

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleScan}
        onClose={() =>
          setShowScanner(false)
        }
        showConsoleLog={__DEV__}
        cameraOptions={{
          ratio: '16:9',
          captureAudio: false,
        }}
      />
    );
  }

  return (
    <View
      style={[
        commonstyles.container,
        styles.container,
      ]}
    >
      <AppHeader title="On board driver" />

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Surface
          style={styles.content}
          elevation={2}
        >
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleQRCodeScan}
              title="Scan QR Code"
              style={styles.qrButton}
              textStyle={styles.buttonText}
              icon="qrcode-scan"
            />

            <View style={styles.divider}>
              <View
                style={styles.dividerLine}
              />

              <Text
                style={styles.dividerText}
              >
                OR
              </Text>

              <View
                style={styles.dividerLine}
              />
            </View>

            <CustomButton
              onPress={handleManualEntry}
              title="Enter User ID"
              style={styles.userIdButton}
              textStyle={
                styles.userIdButtonText
              }
              icon="account-plus"
            />
          </View>
        </Surface>
      </ScrollView>

      <CustomModal
        visible={visible}
        onClose={handleCloseModal}
        animationType="slide"
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Enter User ID
              </Text>

              {/* <IconButton
                icon="close"
                size={20}
                onPress={handleCloseModal}
                style={styles.closeIcon}
              /> */}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                placeholder="Enter User ID"
                value={userId}
                onChangeText={
                  handleUserIdChange
                }
                style={[
                  styles.input,
                  userIdError &&
                  styles.inputError,
                ]}
                placeholderTextColor="#999"
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={
                  handleSubmit
                }
              />

              {userIdError && (
                <HelperText
                  type="error"
                  visible={!!userIdError}
                  style={styles.errorText}
                >
                  {userIdError}
                </HelperText>
              )}
            </View>

            <CustomButton
              title={
                isLoading
                  ? 'Verifying...'
                  : 'Submit'
              }
              onPress={handleSubmit}
              disabled={isLoading}
              style={styles.modalButton}
              textStyle={
                styles.modalButtonText
              }
            />
          </View>
        </KeyboardAvoidingView>
      </CustomModal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background || '#F5F5F5',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },

  content: {
    padding: moderateScale(24),
    borderRadius: moderateScale(16),
    backgroundColor: '#FFFFFF',
  },

  buttonContainer: {
    marginTop: hp(1),
  },

  qrButton: {
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
  },

  userIdButton: {
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },

  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },

  userIdButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.primary,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  dividerText: {
    marginHorizontal: wp(3),
    fontSize: moderateScale(12),
    color: '#999',
  },

  modalContainer: {
    width: '100%',
  },

  modalContent: {
    width: '100%',
    padding: moderateScale(20),
    gap: spacing.lg,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
  },

  closeIcon: {
    margin: 0,
  },

  inputContainer: {
    width: '100%',
  },

  input: {
    height: moderateScale(50),
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(10),
    paddingHorizontal: spacing.md,
    fontSize: moderateScale(14),
    backgroundColor: '#FFFFFF',
    color: colors.text,
    width: 250,
  },

  inputError: {
    borderColor: '#D32F2F',
  },

  errorText: {
    fontSize: moderateScale(12),
  },

  modalButton: {
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    backgroundColor: colors.primary,
  },

  modalButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

