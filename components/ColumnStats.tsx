import type { FileData } from '@/types';

interface ColumnStatsProps {
  fileData: FileData;
}

export default function ColumnStats({ fileData }: ColumnStatsProps) {
  const entries = Object.entries(fileData.numericStats ?? {});

  return (
    <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/40">
        <span className="text-sm font-medium text-slate-300">Numeric Column Statistics</span>
        <span className="text-xs text-slate-600">{fileData.numericCols.length} numeric columns</span>
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">No numeric columns detected.</p>
      ) : (
        <div className="overflow-auto max-h-[440px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 bg-slate-900/90 backdrop-blur">
                {['Column', 'Total', 'Average', 'Min', 'Max', 'Count'].map((h) => (
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
      )}
    </div>
  );
}