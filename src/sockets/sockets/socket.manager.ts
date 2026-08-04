import socket from './socket.instance';

export const initSocket = (vendorId: string) => {
  if (!vendorId) return;

  if (!socket.connected) {
    socket.connect();
  }

  socket.once('connect', () => {
    console.log('🟢 vendor joined socket:', vendorId);

    socket.emit('vendor_join', {
      vendorId,
    });
  });
};