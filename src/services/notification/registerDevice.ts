import {getFCMToken} from './fcm';

export const registerFCMDevice = async (
  registerToken: (
    data: {
      fcmToken: string;
      deviceType: string;
    },
  ) => Promise<any>,
) => {
  try {
    const token = await getFCMToken();

    if (!token) {
      return;
    }

    await registerToken({
      fcmToken: token,
      deviceType: 'ANDROID',
    });

    console.log('FCM token registered successfully');
  } catch (error) {
    console.error(
      'FCM registration error:',
      error,
    );
  }
};