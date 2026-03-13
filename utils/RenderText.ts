/**
 * Converts lightweight markdown (**bold**, _italic_, newlines) to HTML.
 * Used for rendering chat messages.
 */
export function renderText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>')
    .replace(/_(.*?)_/g, '<em class="text-slate-400 text-xs">$1</em>')
    .replace(/\n/g, '<br/>');
}