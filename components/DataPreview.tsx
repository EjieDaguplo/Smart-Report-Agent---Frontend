'use client';
import { FileData } from '../types';

interface DataPreviewProps {
  fileData: FileData;
}

export default function DataPreview({ fileData }: DataPreviewProps) {
  if (!fileData.preview?.length) {
    return <p className="p-6 text-sm text-slate-500">No data loaded.</p>;
  }

  return (
    <div className="overflow-auto max-h-[440px]">
      <table className="w-full text-sm">
        <thead>
          <tr className="sticky top-0 bg-slate-900/90 backdrop-blur">
            {fileData.headers.map((h: string) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold border-b border-slate-700/50 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fileData.preview.slice(0, 50).map((row, i: number) => (
            <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors">
              {fileData.headers.map((h: string) => (
                <td
                  key={h}
                  className={`px-4 py-2.5 whitespace-nowrap ${
                    row[h] === '' ? 'text-rose-400 italic' : 'text-slate-300'
                  }`}
                >
                  {row[h] === '' ? '—' : String(row[h])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}