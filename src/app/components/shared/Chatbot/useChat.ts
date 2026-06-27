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

    socket.on('chat:response', ({ answer }: { answer: string }) => {
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
      setLoading(false);
    });

    socket.on('chat:history', (history: ChatMessage[]) => setMessages(history));

    socket.on('chat:error', ({ message }: { message: string }) => {
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