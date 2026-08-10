import { SOCKET_EVENTS } from './socket.events';
import socketService from './socket.service';

class VendorSocket {
  onboardDriver(driverId: string) {
    return new Promise((resolve, reject) => {
      socketService.emit(
        SOCKET_EVENTS.DRIVER_ONBOARDED_BY_VENDOR,
        { driverId },
        (response: any) => {
          if (response?.status === '00') {
            resolve(response);
          } else {
            reject(response);
          }
        },
      );
    });
  }
  offboardDriver(driverId: string) {
    return new Promise((resolve, reject) => {
      socketService.emit(
        SOCKET_EVENTS.DRIVER_OFFBOARDED_BY_VENDOR,
        { driverId },
        (response: any) => {
          if (response?.status === '00') {
            resolve(response);
          } else {
            reject(response);
          }
        },
      );
    });
  }
  vehicleAssignToDriver(driverId: string, vehicleId: string) {
    return new Promise((resolve, reject) => {
      socketService.emit(
        SOCKET_EVENTS.DRIVER_VEHICLE_ASSIGNED_BY_VENDOR,
        { driverId, vehicleId },
        (response: any) => {
          if (response?.status === '00') {
            resolve(response);
          } else {
            reject(response);
          }
        },
      );
    });
  }
  vehicleDeassignToDriver(driverId: string, vehicleId: string) {
    return new Promise((resolve, reject) => {
      socketService.emit(
        SOCKET_EVENTS.DRIVER_VEHICLE_DEASSIGNED_BY_VENDOR,
        { driverId, vehicleId },
        (response: any) => {
          if (response?.status === '00') {
            resolve(response);
          } else {
            reject(response);
          }
        },
      );
    });
  }
}

export default new VendorSocket();
