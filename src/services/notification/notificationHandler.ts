import {
  getMessaging,
  onMessage,
} from '@react-native-firebase/messaging';

export const initializeNotificationListeners = () => {
  const messaging = getMessaging();

  const unsubscribeMessage = onMessage(
    messaging,
    async remoteMessage => {
      console.log('====================================');
      console.log('FCM FOREGROUND MESSAGE:', remoteMessage);
      console.log('====================================');

      const title =
        remoteMessage.notification?.title ||
        'Test Notification';

      const body =
        remoteMessage.notification?.body ||
        'This is a test notification';

      console.log('FCM TITLE:', title);
      console.log('FCM BODY:', body);
    },
  );

  return unsubscribeMessage;
};