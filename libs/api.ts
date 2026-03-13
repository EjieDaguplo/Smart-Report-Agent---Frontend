import { API_URL } from './constant';
import type { FileData } from '@/types';

/**
 * Uploads an Excel/CSV file to the backend and returns parsed FileData.
 */
export async function uploadFile(file: File): Promise<FileData> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: form,
  });

  const data: FileData & { error?: string } = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

/**
 * Sends a chat question with file context to the AI backend.
 * Returns the AI reply string and the model name used.
 */
export async function sendChat(
  question: string,
  fileContext: FileData
): Promise<{ reply: string; model?: string }> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, fileContext }),
  });

  const data: { reply?: string; model?: string; error?: string } = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat request failed');

  return {
    reply: data.reply ?? '',
    model: data.model,
  };
}