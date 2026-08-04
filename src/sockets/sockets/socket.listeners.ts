import socket from './socket.instance';
import { SOCKET_EVENTS } from './socket.events';
import { store } from '@app/redux';

export const registerVendorSocketListeners = () => {
  console.log('🔥 registerVendorSocketListeners CALLED');

  if (!socket.connected) {
    console.log('⚠️ Socket not connected yet');
    socket.connect();
  }

  socket.on('connect', () => {
    console.log('🔗 Vendor Connected:', socket.id);

    socket.emit(SOCKET_EVENTS.VENDOR_JOIN, {
      userId: store.getState()?.auth?.user?.id,
      role: 'vendor',
    });
  });

  socket.onAny((event, data) => {
    console.log('📡 VENDOR SOCKET:', event, data);
  });

  socket.on(
    SOCKET_EVENTS.VENDOR_ONBOARD_DRIVER_RESPONSE,
    data => {
      console.log('✅ ONBOARD RESPONSE:', data);
    }
  );

  socket.on(
    SOCKET_EVENTS.VENDOR_ASSIGN_DRIVER_RESPONSE,
    data => {
      console.log('✅ ASSIGN RESPONSE:', data);
    }
  );
};