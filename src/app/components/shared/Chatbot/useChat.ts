// src/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import { getChatSocket } from './chatSocket';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}

export function useChat(token: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef(getChatSocket(token));

useEffect(() => {
  const socket = socketRef.current;

  socket.on('chat:response', (data: { answer: string }) => {
    console.log('chat:response raw payload:', data);
    setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
    setLoading(false);
  });

  socket.on('chat:history', (history: ChatMessage[]) => {
    console.log('chat:history payload:', history);
    setMessages(history);
  });

  socket.on('chat:error', ({ message }: { message: string }) => {
    console.log('chat:error payload:', message);
    setError(message);
    setLoading(false);
  });

  socket.emit('chat:history');

  return () => {
    socket.off('chat:response');
    socket.off('chat:history');
    socket.off('chat:error');
  };
}, []);

  const sendMessage = (text: string) => {
    if (!text.trim() || text.length > 2000) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    setError(null);
    socketRef.current.emit('chat:message', { message: text });
  };

  return { messages, sendMessage, loading, error };
}