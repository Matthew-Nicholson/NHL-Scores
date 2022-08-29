import { io } from 'socket.io-client';

export const useSocketIO = () => {
  const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
  return socket;
};
