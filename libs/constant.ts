export const API_URL = process.env.NEXT_PUBLIC_API_URL; // || 'http://localhost:4000'


export const SUGGESTIONS: string[] = [
  '📈 Summarize this dataset',
  '🔍 Find anomalies or errors',
  '📊 Generate a full report',
  '⚠️ What needs immediate attention?',
  '💡 Give recommendations',
  '📋 Describe all columns',
];

export const STAT_ACCENTS: string[] = [
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-400 to-orange-400',
  'from-rose-500 to-pink-500',
];

export const STAT_TEXT_COLORS: string[] = [
  'text-cyan-400',
  'text-emerald-400',
  'text-amber-400',
  'text-rose-400',
];

export const WELCOME_MESSAGE = {
  role: 'ai' as const,
  text: "👋 Hello! I'm your **LGU Report Agent**. Upload an Excel or CSV file with your government records and I'll analyze it, find issues, and answer your questions instantly.",
};