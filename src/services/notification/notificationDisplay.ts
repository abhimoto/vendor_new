// import notifee, {
//   AndroidImportance,
// } from '@notifee/react-native';

// import {
//   DEFAULT_CHANNEL_ID,
// } from './notificationChannel';

// interface NotificationData {
//   title?: string;
//   body?: string;
// }

// export const displayLocalNotification = async ({
//   title,
//   body,
// }: NotificationData) => {
//   try {
//     await notifee.displayNotification({
//       title: title || 'MotoHelp Test',
//       body: body || 'Test notification',

//       android: {
//         channelId: DEFAULT_CHANNEL_ID,

//         importance: AndroidImportance.HIGH,

//         sound: 'default',

//         pressAction: {
//           id: 'default',
//         },
//       },
//     });

//     console.log('Local notification displayed');
//   } catch (error) {
//     console.error(
//       'Local notification error:',
//       error,
//     );
//   }
// };