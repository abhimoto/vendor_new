import { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
} from 'react-native';

export const useCurrentLocation = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS !== 'android') {
        setHasPermission(true);
        setLoading(false);
        return true;
      }

      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (alreadyGranted) {
        console.log('Location permission already granted');
        setHasPermission(true);
        setLoading(false);
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs your location to show your current position on the map.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        setHasPermission(true);
        setLoading(false);
        return true;
      }

      console.log('Location permission denied');

      setHasPermission(false);
      setLoading(false);

      return false;
    } catch (error) {
      console.error('Location permission error:', error);

      setHasPermission(false);
      setLoading(false);

      return false;
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return {
    hasPermission,
    loading,
    requestLocationPermission,
  };
};