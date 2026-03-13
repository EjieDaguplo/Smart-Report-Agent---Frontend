'use client';
import { useState } from 'react';

import { FileData, ActiveTab } from '@/types';
import { useUpload } from '@/hooks/useUpload';
import { useChat } from '@/hooks/useChat';

import GlobalStyles  from '@/components/GlobalStyle';
import Header        from '@/components/Header';
import UploadZone    from '@/components/Uploadzone';
import StatsGrid     from '@/components/Statsgrid';
import TabBar        from '@/components/Tabbar';
import ChatPanel     from '@/components/Chatpanel';
import DataPreview   from '@/components/DataPreview';
import NumericStats  from '@/input/NumericStats';
import Footer from '@/components/Footer';
import SystemFlow from '@/components/SystemFlow';

export default function Home() {
  const [fileData,   setFileData]   = useState<FileData | null>(null);
  const [activeTab,  setActiveTab]  = useState<ActiveTab>('chat');

  const { messages, input, setInput, loading, chatRef, addMsg, sendMessage, resetMessages } = useChat();

  const { uploading, dragOver, setDragOver, handleFile, onDrop } = useUpload({
    onSuccess: (data, message) => {
      setFileData(data);
      setActiveTab('chat');
      addMsg(message.role, message.text);
    },
    onError: (message) => addMsg(message.role, message.text),
  });

  const handleNewFile = () => {
    setFileData(null);
    resetMessages();
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <GlobalStyles />
      <Header fileData={fileData} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Upload */}
        {!fileData && (
          <UploadZone
            uploading={uploading}
            dragOver={dragOver}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onFileChange={handleFile}
          />
        )}

        {/* Stats + Tabs + Tab content */}
        {fileData && (
          <>
            <StatsGrid fileData={fileData} />

            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onNewFile={handleNewFile}
            />

            {activeTab === 'chat' && (
              <ChatPanel
                messages={messages}
                input={input}
                loading={loading}
                chatRef={chatRef}
                fileData={fileData}
                onInputChange={setInput}
                onSend={(override) => sendMessage(fileData, override)}
              />
            )}

            {activeTab === 'preview' && (
              <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/40">
                  <span className="text-sm font-medium text-slate-300">
                    Showing first 50 of{' '}
                    <span className="text-cyan-400">{fileData.totalRows.toLocaleString()}</span> rows
                  </span>
                  <span className="text-xs text-slate-600">{fileData.fileName}</span>
                </div>
                <DataPreview fileData={fileData} />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/40">
                  <span className="text-sm font-medium text-slate-300">Numeric Column Statistics</span>
                  <span className="text-xs text-slate-600">{fileData.numericCols.length} numeric columns</span>
                </div>
                <NumericStats fileData={fileData} />
              </div>
            )}
          </>
        )}
      </main>

      {/* <footer className="border-t border-slate-800/60 bg-slate-900/50 px-6 py-3.5 flex items-center gap-2 text-xs text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-pulse" />
        LGU Report Agent · Free AI · Next.js + Tailwind + Express · Vercel + Render
      </footer> */}
      <SystemFlow/>
      <Footer/>
    </div>
  );
}