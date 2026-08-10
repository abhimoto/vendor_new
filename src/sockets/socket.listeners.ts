import socketService from './socket.service';

import { SOCKET_EVENTS } from './socket.events';

export const registerSocketListeners = () => {
  const socket = socketService.getSocket();
  if (!socket) {
    return;
  }
  socket.onAny((event, offer) => {
    console.log('Socket Event:', event, offer);
  });
  socket.on('connect', () => {
    console.log('Socket Connected');
    console.log(socket.id);
  });

  socket.on(SOCKET_EVENTS.AUTHENTICATED, data => {
    console.log('Authenticated');
    console.log(data);
  });

  socket.on('disconnect', reason => {
    console.log('Disconnected');
    console.log(reason);
  });

  socket.on('connect_error', error => {
    console.log(error.message);
  });
};
