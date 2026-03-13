import { useState, useRef, useCallback } from 'react';
import { FileData, Message } from '../types';
import { API_URL, WELCOME_MESSAGE } from '@/libs/constant';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 60);
  }, []);

  const addMsg = useCallback(
    (role: 'ai' | 'user', text: string) => {
      setMessages(prev => [...prev, { role, text }]);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  const sendMessage = useCallback(
    async (fileData: FileData | null, override?: string) => {
      const q = override || input.trim();
      if (!q) return;

      if (!fileData) {
        addMsg('ai', '⚠️ Please upload an Excel file first!');
        return;
      }

      setInput('');
      addMsg('user', q);
      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q, fileContext: fileData }),
        });
        const data: { reply?: string; model?: string; error?: string } = await res.json();
        if (!res.ok) throw new Error(data.error);
        addMsg('ai', (data.reply ?? '') + (data.model ? `\n\n_— ${data.model}_` : ''));
      } catch (e: unknown) {
        addMsg('ai', `❌ Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    },
    [input, addMsg]
  );

  const resetMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return {
    messages,
    input,
    setInput,
    loading,
    chatRef,
    addMsg,
    sendMessage,
    resetMessages,
  };
}