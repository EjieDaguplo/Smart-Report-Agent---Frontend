'use client';
import { FileData } from '../types';
import { STAT_ACCENTS, STAT_TEXT_COLORS } from '@/libs/constant';

interface StatItem {
  label: string;
  value: string | number;
  sub: string;
}

function buildStatsData(fileData: FileData): StatItem[] {
  return [
    { label: 'Total Records',  value: fileData.totalRows.toLocaleString(), sub: 'rows in dataset' },
    { label: 'Columns',        value: fileData.totalCols,                  sub: 'data fields' },
    { label: 'Numeric Fields', value: fileData.numericCols.length,         sub: 'analyzable columns' },
    { label: 'Missing Values', value: fileData.missingCount,               sub: 'empty cells found' },
  ];
}

interface StatsGridProps {
  fileData: FileData;
}

export default function StatsGrid({ fileData }: StatsGridProps) {
  const stats = buildStatsData(fileData);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="relative bg-slate-900/70 border border-slate-800/70 rounded-2xl p-5 overflow-hidden hover:-translate-y-0.5 transition-transform duration-200"
        >
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${STAT_ACCENTS[i]}`} />
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">{s.label}</p>
          <p
            className={`text-3xl font-bold leading-none mb-1 ${STAT_TEXT_COLORS[i]}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {s.value}
          </p>
          <p className="text-xs text-slate-600">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}