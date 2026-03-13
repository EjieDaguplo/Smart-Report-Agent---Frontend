'use client';
import { ActiveTab } from '../types';

interface Tab {
  id: ActiveTab;
  label: string;
}

const TABS: Tab[] = [
  { id: 'chat',    label: '🤖 AI Agent' },
  { id: 'preview', label: '📋 Data Preview' },
  { id: 'stats',   label: '📊 Column Stats' },
];

interface TabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNewFile: () => void;
}

export default function TabBar({ activeTab, onTabChange, onNewFile }: TabBarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b border-slate-800">
      {TABS.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onTabChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-150
            ${activeTab === t.id
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          {t.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onNewFile}
        className="ml-auto mb-1 text-xs text-slate-500 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-lg transition-all"
      >
        ↑ New File
      </button>
    </div>
  );
}