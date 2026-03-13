'use client';
import { RefObject } from 'react';
import { Message, FileData } from '../types';
import { SUGGESTIONS } from '@/libs/constant';
import { renderText } from '../utils/RenderText';
import { SendIcon } from '@/components/Icon';

interface ChatPanelProps {
  messages: Message[];
  input: string;
  loading: boolean;
  chatRef: RefObject<HTMLDivElement | null>;
  fileData: FileData;
  onInputChange: (value: string) => void;
  onSend: (override?: string) => void;
}

export default function ChatPanel({
  messages,
  input,
  loading,
  chatRef,
  fileData,
  onInputChange,
  onSend,
}: ChatPanelProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl overflow-hidden">

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-slate-800/60 bg-slate-900/30">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onSend(s)}
            className="text-xs font-medium text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-900/50 hover:border-cyan-700/60 px-3 py-1.5 rounded-full transition-all hover:-translate-y-px"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={chatRef} className="h-[380px] overflow-y-auto flex flex-col gap-3 p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 anim-fadeup ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border
                ${m.role === 'ai'
                  ? 'bg-gradient-to-br from-cyan-700 to-blue-700 border-cyan-700/50'
                  : 'bg-gradient-to-br from-violet-700 to-purple-800 border-violet-600/50'}`}
            >
              {m.role === 'ai' ? '🤖' : '👤'}
            </div>
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${m.role === 'ai'
                  ? 'bg-slate-800/80 border border-slate-700/60 rounded-tl-sm text-slate-200'
                  : 'bg-cyan-950/40 border border-cyan-800/40 rounded-tr-sm text-slate-200'}`}
              dangerouslySetInnerHTML={{ __html: renderText(m.text) }}
            />
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 anim-fadeup">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-700 to-blue-700 border border-cyan-700/50 flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
              <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-cyan-400 rounded-full anim-spin inline-block" />
              Analyzing your data…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-4 border-t border-slate-800/60 bg-slate-900/30">
        <input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && !e.shiftKey && onSend()
          }
          placeholder="Ask about your data…"
          className="flex-1 bg-slate-800/70 border border-slate-700/70 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-600/80 focus:bg-slate-800 transition-colors"
        />
        <button
          type="button"
          onClick={() => onSend()}
          disabled={loading || !input.trim()}
          className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-cyan-950/60"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}