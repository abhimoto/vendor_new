// import notifee, {
//   AndroidImportance,
// } from '@notifee/react-native';

// export const DEFAULT_CHANNEL_ID =
//   'moto_vendor_default';

// export const createNotificationChannel = async () => {
//   try {
//     const channelId =
//       await notifee.createChannel({
//         id: DEFAULT_CHANNEL_ID,

//         name: 'MotoHelp Notifications',

//         importance: AndroidImportance.HIGH,

//         sound: 'default',

//         vibration: true,
//       });

//     console.log(
//       'Notification channel:',
//       channelId,
//     );

//     return channelId;
//   } catch (error) {
//     console.error(
//       'Channel creation error:',
//       error,
//     );

//     return DEFAULT_CHANNEL_ID;
//   }
// };