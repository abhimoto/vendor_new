import { io } from 'socket.io-client';
import ENV from './../../config/index';

const socket = io(ENV.SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
});

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', reason => {
  console.log('❌ Socket disconnected:', reason);
});

socket.on('connect_error', err => {
  console.log('⚠️ Socket error:', err.message);
});

export default socket;