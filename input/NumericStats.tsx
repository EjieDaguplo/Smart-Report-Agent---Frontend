'use client';
import { FileData } from '../types';

interface NumericStatsProps {
  fileData: FileData;
}

const COLUMNS = ['Column', 'Total', 'Average', 'Min', 'Max', 'Count'];

export default function NumericStats({ fileData }: NumericStatsProps) {
  const entries = Object.entries(fileData.numericStats ?? {});

  if (!entries.length) {
    return <p className="p-6 text-sm text-slate-500">No numeric columns detected.</p>;
  }

  return (
    <div className="overflow-auto max-h-[440px]">
      <table className="w-full text-sm">
        <thead>
          <tr className="sticky top-0 bg-slate-900/90 backdrop-blur">
            {COLUMNS.map(h => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold border-b border-slate-700/50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(([col, s]) => (
            <tr key={col} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 font-semibold text-cyan-300">{col}</td>
              <td className="px-4 py-3 text-slate-300">{s.sum?.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-300">{s.avg?.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-400">{s.min?.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-400">{s.max?.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-500">{s.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}