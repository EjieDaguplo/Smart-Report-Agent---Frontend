export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
      @keyframes fade-up   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin-fast { to{transform:rotate(360deg)} }
      .anim-pulse  { animation: pulse-dot 2s ease-in-out infinite; }
      .anim-fadeup { animation: fade-up .25s ease forwards; }
      .anim-spin   { animation: spin-fast .7s linear infinite; }
      ::-webkit-scrollbar       { width:4px; height:4px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:#334155; border-radius:4px; }
    `}</style>
  );
}