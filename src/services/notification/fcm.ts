import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

export const getFCMToken = async (): Promise<
  string | null
> => {
  try {
    const messaging = getMessaging();

    const token = await getToken(messaging);

    console.log('================================');
    console.log('FCM TOKEN:', token);
    console.log('================================');

    return token;
  } catch (error) {
    console.error(
      'FCM TOKEN ERROR:',
      error,
    );

    return null;
  }
};

export const listenForTokenRefresh = (
  callback: (token: string) => void,
) => {
  const messaging = getMessaging();

  return onTokenRefresh(
    messaging,
    token => {
      console.log(
        'FCM TOKEN REFRESHED:',
        token,
      );

      callback(token);
    },
  );
};