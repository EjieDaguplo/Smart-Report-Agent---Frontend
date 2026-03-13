export interface NumericStat {
  sum: number;
  avg: number;
  min: number;
  max: number;
  count: number;
}

export interface FileData {
  success: boolean;
  fileName: string;
  sheetName: string;
  totalRows: number;
  totalCols: number;
  headers: string[];
  numericCols: string[];
  numericStats: Record<string, NumericStat>;
  missingCount: number;
  preview: Record<string, string | number>[];
  allData: Record<string, string | number>[];
}

export interface Message {
  role: 'ai' | 'user';
  text: string;
}

export type ActiveTab = 'chat' | 'preview' | 'stats';