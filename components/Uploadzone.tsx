'use client';
import { useRef, useEffect, useState } from 'react';

interface UploadZoneProps {
  uploading: boolean;
  dragOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (file: File | null | undefined) => void;
}

const TYPEWRITER_LINES = [
  "Let's analyze your data — feel free to upload it here.",
  "I'll find patterns, anomalies, and insights instantly.",
  "Budget reports, population data, permits — I handle it all.",
  "Drop your file and let me do the heavy lifting.",
];

function useTypewriter(lines: string[], speed = 38, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [lineIdx, setLineIdx]     = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx(i => (i + 1) % lines.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx, lines, speed, pause]);

  return displayed;
}

// Floating particle
function Particle({ style }: { style: React.CSSProperties }) {
  return <span className="upload-particle" style={style} />;
}

export default function UploadZone({
  uploading,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const text = useTypewriter(TYPEWRITER_LINES);

  // Generate stable particle positions
  const particles = Array.from({ length: 18 }, (_, i) => ({
    left:     `${(i * 37 + 11) % 95}%`,
    top:      `${(i * 53 + 7)  % 90}%`,
    width:    `${2 + (i % 3)}px`,
    height:   `${2 + (i % 3)}px`,
    animationDelay:    `${(i * 0.4).toFixed(1)}s`,
    animationDuration: `${3 + (i % 4)}s`,
    opacity:  0.15 + (i % 5) * 0.06,
  }));

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0)   scale(1);   opacity: var(--op, 0.2); }
          50%  { transform: translateY(-18px) scale(1.3); opacity: calc(var(--op, 0.2) * 1.6); }
          100% { transform: translateY(0)   scale(1);   opacity: var(--op, 0.2); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg)   translateX(38px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(0deg)    translateX(58px) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(58px) rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,211,238,0.25); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(34,211,238,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,211,238,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes blink-cursor {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes bounce-arrow {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .upload-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(34,211,238,0.7);
          animation: float-up var(--dur, 4s) ease-in-out infinite;
          pointer-events: none;
        }
        .upload-zone-root .icon-ring-1 {
          animation: orbit 6s linear infinite;
        }
        .upload-zone-root .icon-ring-2 {
          animation: orbit-reverse 9s linear infinite;
        }
        .upload-zone-root .pulse-icon {
          animation: pulse-ring 2.4s ease-out infinite;
        }
        .upload-zone-root .shimmer-btn {
          background: linear-gradient(90deg,
            #0891b2 0%, #06b6d4 30%, #67e8f9 50%, #06b6d4 70%, #0891b2 100%);
          background-size: 200% auto;
          animation: shimmer 2.8s linear infinite;
        }
        .upload-zone-root .bounce-arrow {
          animation: bounce-arrow 1.4s ease-in-out infinite;
        }
        .upload-zone-root .spin-loader {
          animation: spin-slow 0.8s linear infinite;
        }
        .cursor-blink {
          animation: blink-cursor 0.9s step-end infinite;
        }
        .fadeInUp { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

      <div
        className="upload-zone-root"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{ position: 'relative', cursor: 'pointer', userSelect: 'none' }}
      >
        {/* Outer shell */}
        <div
          className="fadeInUp"
          style={{
            borderRadius: '24px',
            border: `2px dashed ${dragOver ? '#22d3ee' : 'rgba(100,116,139,0.5)'}`,
            background: dragOver
              ? 'rgba(8,145,178,0.08)'
              : 'rgba(15,23,42,0.6)',
            boxShadow: dragOver
              ? '0 0 60px rgba(34,211,238,0.12), inset 0 0 40px rgba(34,211,238,0.04)'
              : '0 4px 40px rgba(0,0,0,0.3)',
            padding: '56px 48px 48px',
            textAlign: 'center',
            overflow: 'hidden',
            transition: 'all 0.35s ease',
          }}
        >
          {/* Floating particles */}
          {particles.map((p, i) => (
            <Particle
              key={i}
              style={{
                left: p.left,
                top: p.top,
                width: p.width,
                height: p.height,
                '--op': p.opacity,
                '--dur': p.animationDuration,
                animationDelay: p.animationDelay,
              } as React.CSSProperties}
            />
          ))}

          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '36px 36px',
          }} />

          {/* Radial gradient */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 40%, rgba(34,211,238,0.06), transparent 65%)',
          }} />

          {/* ── Icon cluster ── */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
            {/* Orbiting dot 1 */}
            <div className="icon-ring-1" style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
            {/* Orbiting dot 2 */}
            <div className="icon-ring-2" style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 6px #818cf8' }} />
            {/* Center icon */}
            <div className="pulse-icon" style={{
            width: '72px', height: '72px', borderRadius: '20px',
            border: '1px solid rgba(34,211,238,0.3)',
            position: 'relative', zIndex: 1,
            overflow: 'hidden',
            }}>
            <img
                src="/srlogo.png"
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            </div>
          </div>

          {/* ── Heading ── */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '12px',
            position: 'relative',
          }}>
            Upload Your LGU Data File
          </h2>

          {/* ── Typewriter line ── */}
          <p style={{
            fontSize: '14px',
            color: '#94a3b8',
            minHeight: '22px',
            marginBottom: '6px',
            position: 'relative',
            letterSpacing: '0.01em',
          }}>
            {text}
            <span className="cursor-blink" style={{ color: '#22d3ee', fontWeight: 700, marginLeft: '1px' }}>|</span>
          </p>

          {/* ── Supported formats ── */}
          <p style={{ fontSize: '12px', color: '#475569', marginBottom: '36px', position: 'relative' }}>
            Supports&nbsp;
            {['.xlsx', '.xls', '.csv'].map(ext => (
              <span key={ext} style={{
                display: 'inline-block', background: 'rgba(34,211,238,0.08)',
                border: '1px solid rgba(34,211,238,0.18)', borderRadius: '6px',
                padding: '1px 7px', marginRight: '4px', color: '#67e8f9',
                fontSize: '11px', fontFamily: 'monospace',
              }}>{ext}</span>
            ))}
            &nbsp;— Budget, Population, Health, Permits…
          </p>

          {/* ── CTA ── */}
          {uploading ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.4)',
              padding: '12px 28px', borderRadius: '14px', fontSize: '14px', color: '#94a3b8',
              position: 'relative',
            }}>
              <svg className="spin-loader" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Processing your file…
            </div>
          ) : (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                className="shimmer-btn"
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  color: '#fff', fontWeight: 700, fontSize: '14px',
                  padding: '13px 36px', borderRadius: '14px', border: 'none',
                  cursor: 'pointer', position: 'relative', zIndex: 1,
                  boxShadow: '0 8px 28px rgba(8,145,178,0.35)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 36px rgba(8,145,178,0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(8,145,178,0.35)';
                }}
              >
                📁 Choose File
              </button>
            </div>
          )}

          {/* ── Bounce arrow hint ── */}
          {!uploading && (
            <div className="bounce-arrow" style={{
              marginTop: '24px', color: '#334155', fontSize: '20px',
              lineHeight: 1, position: 'relative',
            }}>
              ↓
            </div>
          )}

          {/* ── Drag hint strip at bottom ── */}
          {!uploading && (
            <p style={{ fontSize: '11px', color: '#334155', marginTop: '10px', position: 'relative' }}>
              or drag & drop anywhere in this area
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            style={{ display: 'none' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFileChange(e.target.files?.[0])}
          />
        </div>
      </div>
    </>
  );
}