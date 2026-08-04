import { SOCKET_EVENTS } from './socket.events';
import socket from './socket.instance';

const emitWithConnection = (socket: any, callback: () => void) => {
  if (socket.connected) {
    callback();
  } else {
    socket.connect();
    socket.once('connect', callback);
  }
};