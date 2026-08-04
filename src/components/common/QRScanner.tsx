import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

interface QRScannerProps {
  onScan?: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onClose,
}) => {
  const [isActive, setIsActive] = useState(true);

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39', 'code-93', 'codabar'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isActive) {
        const value = codes[0]?.value;

        if (value) {
          setIsActive(false); // stop multiple scans

          // send data to parent
          onScan?.(value);
        }
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.message}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />

      {/* Overlay UI only */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.frame} />

        <Text style={styles.instruction}>
          Position QR inside frame
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const frameSize = width * 0.7;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  message: { color: 'white', marginTop: 10 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  frame: {
    width: frameSize,
    height: frameSize,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
  },

  instruction: {
    color: 'white',
    marginTop: 20,
    fontSize: 14,
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },

  closeText: {
    color: 'white',
    fontSize: 20,
  },
});

export default QRScanner;