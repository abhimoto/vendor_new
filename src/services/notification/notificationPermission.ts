import {getMessaging, requestPermission} from '@react-native-firebase/messaging';

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const messaging = getMessaging();

    const authStatus = await requestPermission(messaging);

    console.log('FCM notification permission:', authStatus);

    return (
      authStatus === 1 || // AUTHORIZED
      authStatus === 2    // PROVISIONAL
    );
  } catch (error) {
    console.error('FCM notification permission error:', error);
    return false;
  }
};