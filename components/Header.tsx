'use client';
import { FileData } from '../types';
import { FileIcon } from '@/components/Icon';

interface HeaderProps {
  fileData: FileData | null;
}

export default function Header({ fileData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/70 px-5 sm:px-8 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img
            src="/srlogo.png"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
      <div>
        <h1
          className="text-[15px] font-bold leading-tight tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Smart Report
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
          AI-Powered Data Analysis
        </p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {fileData && (
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 text-cyan-400 text-xs px-3 py-1.5 rounded-full max-w-[200px] truncate">
            <FileIcon />
            <span className="truncate">{fileData.fileName}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[11px] font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 anim-pulse" />
          LIVE
        </div>
      </div>
    </header>
  );
}