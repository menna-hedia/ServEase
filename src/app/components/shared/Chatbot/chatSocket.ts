// src/lib/chatSocket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getChatSocket(token: string): Socket {
  if (!socket) {
    console.log(import.meta.env);
console.log(import.meta.env.VITE_SOCKET_URL);
    socket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
  auth: { token },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connect Error:", err);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

  }
  return socket;
}

export function disconnectChatSocket() {
  socket?.disconnect();
  socket = null;
}