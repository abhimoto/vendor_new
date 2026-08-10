import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(
      'http://192.168.1.112:5000',
      // 'https://stag.motohelpindia.com',
      {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      },
    );
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
  emit(event: string, data?: any, callback?: any) {
    this.socket?.emit(event, data, callback);
  }

  on(event: string, listener: any) {
    this.socket?.on(event, listener);
  }

  off(event: string, listener?: any) {
    this.socket?.off(event, listener);
  }

  once(event: string, listener: any) {
    this.socket?.once(event, listener);
  }
}

export default new SocketService();
