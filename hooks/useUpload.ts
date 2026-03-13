import { useState, useCallback } from 'react';
import { FileData, Message } from '../types';
import { API_URL } from '@/libs/constant';

interface UseUploadOptions {
  onSuccess: (data: FileData, message: Message) => void;
  onError: (message: Message) => void;
}

export function useUpload({ onSuccess, onError }: UseUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      setUploading(true);

      const form = new FormData();
      form.append('file', file);

      try {
        const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: form });
        const data: FileData & { error?: string } = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        const successMsg: Message = {
          role: 'ai',
          text:
            `✅ **${data.fileName}** loaded!\n\n` +
            `📊 **${data.totalRows.toLocaleString()} records** · **${data.totalCols} columns**\n` +
            `Columns: ${data.headers.slice(0, 5).join(', ')}${data.headers.length > 5 ? ` +${data.headers.length - 5} more` : ''}\n\n` +
            (data.missingCount > 0
              ? `⚠️ ${data.missingCount} empty cells detected.\n\n`
              : `✅ No missing values found.\n\n`) +
            `💬 Ask me anything — or tap a suggestion below!`,
        };

        onSuccess(data, successMsg);
      } catch (e: unknown) {
        onError({
          role: 'ai',
          text: `❌ Upload failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
        });
      } finally {
        setUploading(false);
      }
    },
    [onSuccess, onError]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  return { uploading, dragOver, setDragOver, handleFile, onDrop };
}