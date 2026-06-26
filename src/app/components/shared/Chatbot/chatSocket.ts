// // src/lib/chatSocket.ts
// import { io, Socket } from 'socket.io-client';

// let socket: Socket | null = null;

// export function getChatSocket(token: string): Socket {
//   if (!socket) {
//     socket = io(`${import.meta.env.VITE_API_URL}/chat`, {
//       auth: { token },
//       transports: ['websocket'],
//     });
//   }
//   return socket;
// }

// export function disconnectChatSocket() {
//   socket?.disconnect();
//   socket = null;
// }