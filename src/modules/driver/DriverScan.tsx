import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { IconButton, Surface, Card, Button } from 'react-native-paper';
import { HOME_ROUTES } from '@navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@utils/colors';
import QRScanner from '@components/common/QRScanner';
import AppHeader from '@components/custumcomponents/AppHeader';
import { moderateScale, wp, hp } from '@utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ScannedQRData {
  rawData: string;
  timestamp: string;
  type?: string;
}

export default function DriverScan() {
  const navigation = useNavigation<any>();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedQRData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleScan = useCallback((data: string) => {
    try {
      let parsedData: any = data;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = { rawData: data };
      }

      const qrData: ScannedQRData = {
        rawData: data,
        timestamp: new Date().toISOString(),
        type: parsedData.type || 'driver_qr',
      };

      setScannedData(qrData);
      setShowScanner(false);
      setVerificationError(null);
      

    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is invalid. Please try again.');
    }
  }, []);

  const handleVerify = useCallback(async () => {
    if (!scannedData?.rawData) {
      Alert.alert('No QR Code', 'Please scan a QR code first');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      // Simulate API call - Replace with actual verification logic
      const verificationResult = await verifyQRCode(scannedData.rawData);
      
      if (verificationResult.success) {
        console.log('Verification successful!', verificationResult);
        
        navigation.navigate(HOME_ROUTES.DRIVERINDEX, {
          scannedData: scannedData.rawData,
          verifiedData: verificationResult.data,
          timestamp: scannedData.timestamp,
        });
      } else {
        throw new Error(verificationResult.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationError(error.message || 'Failed to verify QR code');
      Alert.alert(
        'Verification Failed',
        error.message || 'Unable to verify QR code. Please try again or scan a different code.',
        [
          { text: 'Try Again', onPress: () => setVerificationError(null) },
          { text: 'Scan Again', onPress: handleRescan },
        ]
      );
    } finally {
      setIsVerifying(false);
    }
  }, [scannedData, navigation]);

  // Mock verification function - Replace with actual API call
  const verifyQRCode = async (qrData: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful verification
        if (qrData && qrData.length > 0) {
          resolve({
            success: true,
            data: {
              driverId: 'DRV123456',
              name: 'John Doe',
              verified: true,
            },
            message: 'QR code verified successfully',
          });
        } else {
          reject(new Error('Invalid QR code data'));
        }
      }, 1500);
    });
  };

  const handleRescan = useCallback(() => {
    setScannedData(null);
    setVerificationError(null);
    setShowScanner(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
    if (!scannedData) {
      navigation.goBack();
    }
  }, [scannedData, navigation]);

  const handleManualEntry = useCallback(() => {
    console.log('Manual entry option selected');
    Alert.alert(
      'Manual Entry',
      'Enter the driver code manually',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => {
            // Implement manual entry logic
            Alert.alert('Info', 'Manual entry functionality coming soon');
          },
        },
      ]
    );
  }, []);

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleScan}
        onClose={handleCloseScanner}
        showConsoleLog={__DEV__}
        cameraOptions={{
          ratio: '16:9',
          captureAudio: false,
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="QR Code"  />

      <View style={styles.contentContainer}>
        {scannedData ? (
          // Scanned Data View
          <Surface style={styles.scanSuccessContainer} elevation={2}>
            <IconButton
              icon="check-circle"
              size={moderateScale(80)}
              iconColor={colors.verify || '#4CAF50'}
              style={styles.successIcon}
            />
            
            <Text style={styles.scanSuccessTitle}>QR Code Scanned!</Text>
            
            {verificationError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{verificationError}</Text>
              </View>
            )}
            
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text style={styles.infoLabel}>Scan Time</Text>
                <Text style={styles.infoValue}>
                  {new Date(scannedData.timestamp).toLocaleString()}
                </Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.infoLabel}>QR Type</Text>
                <Text style={styles.infoValue}>
                  {scannedData.type?.toUpperCase() || 'DRIVER QR'}
                </Text>
              </Card.Content>
            </Card>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleVerify}
                loading={isVerifying}
                disabled={isVerifying}
                style={styles.verifyButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.verifyButtonText}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </Button>

              <Button
                mode="outlined"
                onPress={handleRescan}
                style={styles.rescanButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.rescanButtonText}
              >
                Scan Different Code
              </Button>
            </View>
          </Surface>
        ) : (
          // Initial Scan Prompt View
          <>
            <Surface style={styles.scanPromptContainer} elevation={2}>
              <IconButton
                icon="qrcode-scan"
                size={moderateScale(100)}
                iconColor={colors.primary}
                style={styles.scanIcon}
              />
              
              <Text style={styles.scanTitle}>Scan Driver QR Code</Text>
              
              <Text style={styles.scanSubtitle}>
                Position the QR code within the frame to scan
              </Text>
              
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <IconButton icon="check" size={16} iconColor={colors.verify} />
                  <Text style={styles.featureText}>Instant QR recognition</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconButton icon="check" size={16} iconColor={colors.verify} />
                  <Text style={styles.featureText}>Secure verification</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconButton icon="check" size={16} iconColor={colors.verify} />
                  <Text style={styles.featureText}>Fast processing</Text>
                </View>
              </View>
            </Surface>

            <Button
              mode="contained"
              onPress={() => setShowScanner(true)}
              style={styles.scanButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.verifyButtonText}
            >
              Start Scanning
            </Button>

            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={handleManualEntry}
            >
              <Text style={styles.manualEntryText}>Enter Code Manually</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  scanPromptContainer: {
    alignItems: 'center',
    padding: moderateScale(30),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFFFFF',
    marginBottom: hp(3),
    width: '100%',
  },
  scanIcon: {
    marginBottom: hp(2),
    backgroundColor: colors.primary + '10',
    borderRadius: moderateScale(50),
  },
  scanTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.primary,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: moderateScale(14),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp(3),
    lineHeight: moderateScale(20),
  },
  featureList: {
    width: '100%',
    marginTop: hp(2),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  featureText: {
    fontSize: moderateScale(14),
    color: '#555555',
    marginLeft: wp(-2),
  },
  scanSuccessContainer: {
    alignItems: 'center',
    padding: moderateScale(24),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  successIcon: {
    marginBottom: hp(2),
    backgroundColor: '#4CAF50' + '10',
    borderRadius: moderateScale(50),
  },
  scanSuccessTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.verify || '#4CAF50',
    marginBottom: hp(2),
  },
  infoCard: {
    width: '100%',
    marginVertical: hp(2),
    borderRadius: moderateScale(12),
    backgroundColor: '#F8F9FA',
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: '#888888',
    marginBottom: hp(0.5),
    fontWeight: '500',
  },
  infoValue: {
    fontSize: moderateScale(16),
    color: '#333333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: hp(1.5),
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginVertical: hp(1),
    width: '100%',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: hp(2),
  },
  scanButton: {
    width: SCREEN_WIDTH * 0.8,
    height: moderateScale(56),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    marginBottom: hp(1.5),
  },
  verifyButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    marginBottom: hp(1.5),
  },
  rescanButton: {
    width: '100%',
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: moderateScale(12),
  },
  buttonContent: {
    height: moderateScale(56),
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rescanButtonText: {
    color: colors.primary,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  manualEntryButton: {
    marginTop: hp(2),
    padding: moderateScale(10),
  },
  manualEntryText: {
    color: colors.primary,
    fontSize: moderateScale(14),
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});