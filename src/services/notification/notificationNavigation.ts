// import {navigate} from '@navigation/NavigationService';

// export const handleNotificationNavigation = (
//   data: any,
// ) => {
//   if (!data?.type) {
//     return;
//   }

//   console.log(
//     'Notification navigation:',
//     data,
//   );

//   switch (data.type) {
//     case 'LOAD_ASSIGNED':

//       navigate('LoadDetails', {
//         loadId: data.loadId,
//       });

//       break;

//     case 'VEHICLE_ASSIGNED':

//       navigate('VehicleDetails', {
//         vehicleId: data.vehicleId,
//       });

//       break;

//     case 'DRIVER_ASSIGNED':

//       navigate('DriverDetails', {
//         driverId: data.driverId,
//       });

//       break;

//     case 'PAYMENT_RECEIVED':

//       navigate('PaymentDetails', {
//         paymentId: data.paymentId,
//       });

//       break;

//     default:

//       console.log(
//         'Unknown notification type:',
//         data.type,
//       );
//   }
// };