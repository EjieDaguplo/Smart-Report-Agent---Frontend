'use client';
import { useEffect, useRef, useState } from 'react';

//Types
interface FlowNode {
  id: string; icon: string; label: string; sublabel: string;
  color: string; glow: string; tags?: string[];
}
interface TrustPillar {
  icon: string; title: string; body: string; accent: string;
}

//Data
const NODES: FlowNode[] = [
  { id: 'upload',   icon: '📂', label: 'File Upload',         sublabel: 'Your .xlsx / .csv is received',          color: '#38bdf8', glow: 'rgba(56,189,248,0.25)',  tags: ['Local Processing', 'No Cloud Storage'] },
  { id: 'parse',    icon: '🔬', label: 'Data Parsing',         sublabel: 'Rows, columns & types extracted',        color: '#34d399', glow: 'rgba(52,211,153,0.25)',  tags: ['Type Detection', 'Missing Value Scan'] },
  { id: 'stats',    icon: '📐', label: 'Statistical Analysis', sublabel: 'Sum, avg, min, max computed',            color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',  tags: ['Numeric Stats', 'Anomaly Flags'] },
  { id: 'context',  icon: '🧠', label: 'AI Context Build',     sublabel: 'Structured summary sent to Claude',     color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', tags: ['Metadata Only', 'No Raw PII'] },
  { id: 'response', icon: '💬', label: 'AI Response',          sublabel: 'Insights, errors & recommendations',    color: '#f472b6', glow: 'rgba(244,114,182,0.25)', tags: ['Claude Sonnet', 'Contextual Reply'] },
  { id: 'output',   icon: '✅', label: 'You See Results',      sublabel: 'Clean, actionable government insights', color: '#4ade80', glow: 'rgba(74,222,128,0.25)',  tags: ['Real-time', 'Exportable'] },
];

const TRUST_PILLARS: TrustPillar[] = [
  { icon: '🔒', title: 'Your File Never Leaves', accent: '#38bdf8', body: 'Raw data is parsed in-memory on the server and never written to disk or third-party storage. Only statistical metadata is forwarded to the AI.' },
  { icon: '🛡️', title: 'No PII Forwarded',       accent: '#34d399', body: 'Names, IDs, and sensitive fields stay on your end. The AI receives column names, aggregated statistics, and row counts — never the raw cell values.' },
  { icon: '⚡', title: 'Deterministic Parsing',  accent: '#fbbf24', body: 'Statistical computations (sum, avg, min, max) are run by pure math functions — not the AI. The AI only interprets the numbers, it never calculates them.' },
  { icon: '🔎', title: 'Transparent Reasoning',  accent: '#f472b6', body: "Every AI response is grounded in the metadata we show you in the Stats tab. You can verify any figure the agent quotes — it's all traceable." },
];

const LEGEND = [
  { dot: '#38bdf8', label: 'File Handling' },
  { dot: '#fbbf24', label: 'Math Engine' },
  { dot: '#a78bfa', label: 'AI Layer' },
  { dot: '#4ade80', label: 'Output' },
];

const BADGES = [
  { icon: '🇵🇭', text: 'Built for Philippine LGUs' },
  { icon: '', text: 'Excel & CSV Native' },
  { icon: '🤖', text: 'Powered by Claude AI' },
];

//Hooks
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useIsMobile(bp = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return isMobile;
}

function useIsDesktop(bp = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return isDesktop;
}

//Connectors
function HConnector({ color, delay, inView, desktop }: { color: string; delay: number; inView: boolean; desktop?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 2px' }}>
      <div style={{ position: 'relative', width: desktop ? '56px' : '44px', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,transparent,${color},transparent)`, transform: inView ? 'translateX(0)' : 'translateX(-100%)', transition: `transform 0.7s ease ${delay}ms`, opacity: inView ? 1 : 0 }} />
        <div style={{ position: 'absolute', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, animation: inView ? `h-dot 1.8s linear ${delay}ms infinite` : 'none' }} />
      </div>
      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${color}`, opacity: inView ? 0.7 : 0, transition: `opacity 0.4s ease ${delay + 400}ms`, flexShrink: 0 }} />
    </div>
  );
}

function VConnector({ color, delay, inView }: { color: string; delay: number; inView: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: '2px', height: '28px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg,transparent,${color},transparent)`, transform: inView ? 'translateY(0)' : 'translateY(-100%)', transition: `transform 0.7s ease ${delay}ms`, opacity: inView ? 1 : 0 }} />
        <div style={{ position: 'absolute', left: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, animation: inView ? `v-dot 1.8s linear ${delay}ms infinite` : 'none' }} />
      </div>
      <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `7px solid ${color}`, opacity: inView ? 0.7 : 0, transition: `opacity 0.4s ease ${delay + 400}ms` }} />
    </div>
  );
}

//Node Card
function NodeCard({ node, index, inView, mobile, desktop }: { node: FlowNode; index: number; inView: boolean; mobile: boolean; desktop?: boolean }) {
  const [hov, setHov] = useState(false);
  const d = index * 100;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        // On mobile: full width. On desktop: flex-grow so card fills the grid cell.
        width: mobile ? '100%' : undefined,
        flex: mobile ? undefined : '1 1 0',
        minWidth: 0,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${d}ms, transform 0.5s ease ${d}ms`,
        cursor: 'default',
      }}
    >
      <div style={{
        position: 'relative',
        background: hov ? 'linear-gradient(145deg,rgba(15,23,42,0.95),rgba(15,23,42,0.85))' : 'rgba(15,23,42,0.7)',
        border: `1px solid ${hov ? node.color : 'rgba(255,255,255,0.07)'}`,
        borderRadius: desktop ? '22px' : '18px',
        padding: mobile ? '14px 16px' : desktop ? '28px 20px' : '20px 16px',
        display: mobile ? 'flex' : 'block',
        alignItems: mobile ? 'flex-start' : undefined,
        gap: mobile ? '14px' : undefined,
        textAlign: mobile ? 'left' : 'center',
        boxShadow: hov ? `0 0 36px ${node.glow},0 12px 40px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        height: '100%',
      }}>
        {/* accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: desktop ? '4px' : '3px', background: `linear-gradient(90deg,transparent,${node.color},transparent)`, opacity: hov ? 1 : 0.4, transition: 'opacity 0.3s' }} />
        {/* step number */}
        <div style={{ position: 'absolute', top: '12px', right: '14px', fontSize: desktop ? '11px' : '10px', fontWeight: 700, color: node.color, fontFamily: 'monospace', opacity: 0.6 }}>{String(index + 1).padStart(2, '0')}</div>
        {/* icon */}
        <div style={{ fontSize: mobile ? '24px' : desktop ? '36px' : '28px', marginBottom: mobile ? 0 : desktop ? '14px' : '10px', marginTop: mobile ? '2px' : 0, flexShrink: 0, display: 'inline-block', filter: hov ? `drop-shadow(0 0 10px ${node.color})` : 'none', transform: hov ? 'scale(1.12)' : 'scale(1)', transition: 'filter 0.3s,transform 0.3s' }}>{node.icon}</div>
        {/* text */}
        <div style={{ flex: mobile ? 1 : undefined }}>
          <div style={{ fontSize: desktop ? '14px' : '12px', fontWeight: 700, color: '#f1f5f9', fontFamily: "'Figtree', sans-serif", marginBottom: '5px', lineHeight: 1.3 }}>{node.label}</div>
          <div style={{ fontSize: desktop ? '12px' : '11px', color: '#64748b', lineHeight: 1.5, marginBottom: '10px' }}>{node.sublabel}</div>
          {node.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: mobile ? 'flex-start' : 'center' }}>
              {node.tags.map(t => (
                <span key={t} style={{ fontSize: desktop ? '10px' : '9px', fontWeight: 600, background: `${node.color}18`, border: `1px solid ${node.color}40`, color: node.color, borderRadius: '6px', padding: desktop ? '3px 8px' : '2px 6px', fontFamily: 'monospace', letterSpacing: '0.03em' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//Trust Card
function TrustCard({ pillar, index, inView, desktop }: { pillar: TrustPillar; index: number; inView: boolean; desktop?: boolean }) {
  const [hov, setHov] = useState(false);
  const d = 150 + index * 100;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: desktop ? '1 1 240px' : '1 1 200px',
        minWidth: desktop ? '220px' : '160px',
        maxWidth: desktop ? '320px' : '260px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${d}ms,transform 0.5s ease ${d}ms`,
      }}
    >
      <div style={{ background: hov ? 'rgba(15,23,42,0.9)' : 'rgba(15,23,42,0.6)', border: `1px solid ${hov ? pillar.accent + '60' : 'rgba(255,255,255,0.06)'}`, borderRadius: desktop ? '20px' : '16px', padding: desktop ? '32px 28px' : '22px 18px', height: '100%', boxShadow: hov ? `0 0 32px ${pillar.accent}28` : 'none', transition: 'all 0.3s ease', backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: desktop ? '80px' : '60px', height: desktop ? '80px' : '60px', background: `radial-gradient(circle at bottom right,${pillar.accent}18,transparent 70%)` }} />
        <div style={{ fontSize: desktop ? '32px' : '24px', marginBottom: desktop ? '14px' : '10px' }}>{pillar.icon}</div>
        <div style={{ fontSize: desktop ? '15px' : '13px', fontWeight: 700, color: '#e2e8f0', fontFamily: "'Figtree', sans-serif", marginBottom: desktop ? '10px' : '7px' }}>{pillar.title}</div>
        <div style={{ fontSize: desktop ? '13px' : '12px', color: '#64748b', lineHeight: 1.7 }}>{pillar.body}</div>
      </div>
    </div>
  );
}

//Main 
export default function AgentFlowSection() {
  const { ref: headRef,  inView: headInView  } = useInView();
  const { ref: flowRef,  inView: flowInView  } = useInView();
  const { ref: trustRef, inView: trustInView } = useInView();
  const isMobile  = useIsMobile(640);
  const isDesktop = useIsDesktop(1024);

  return (
    <>
      <section className="flow-wrap" style={{
        background: 'linear-gradient(180deg,rgba(2,6,23,0) 0%,rgba(2,6,23,0.85) 12%,rgba(2,6,23,0.85) 88%,rgba(2,6,23,0) 100%)',
        padding: isMobile ? '48px 0 40px' : isDesktop ? '100px 0 80px' : '80px 0 64px',
        position: 'relative', overflow: 'visible',
      }}>
        {/* bg grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* radial glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 50% at 50% 40%,rgba(56,189,248,0.04),transparent)' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 28px' }}>

          {/* ── HEADER ── */}
          <div ref={headRef} style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '64px' }}>
            {/* pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px', padding: '6px 14px', marginBottom: '14px', opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.5s,transform 0.5s' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse-glow 2s ease infinite', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Figtree', sans-serif" }}>How It Works</span>
            </div>
            {/* heading */}
            <h2 style={{ fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? '22px' : 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#f8fafc', lineHeight: 1.15, marginBottom: '12px', opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.55s ease 80ms,transform 0.55s ease 80ms' }}>
              From Raw File to{' '}
              <span style={{ background: 'linear-gradient(90deg,#38bdf8,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verified Insight</span>
            </h2>
            {/* sub */}
            <p style={{ fontSize: isMobile ? '13px' : '15px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.55s ease 160ms,transform 0.55s ease 160ms' }}>
              Every step of the analysis pipeline is transparent, deterministic, and secure. Your data is never stored — only understood.
            </p>
          </div>

          {/* ── FLOW DIAGRAM ── */}
          <div ref={flowRef}>
            {isMobile ? (
              /* MOBILE — vertical single column */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '420px', margin: '0 auto' }}>
                {NODES.map((node, i) => (
                  <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <NodeCard node={node} index={i} inView={flowInView} mobile />
                    {i < NODES.length - 1 && <VConnector color={NODES[i + 1].color} delay={i * 90 + 180} inView={flowInView} />}
                  </div>
                ))}
              </div>
            ) : (
              /* DESKTOP — 3-col grid, cards fill their cell */
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: isDesktop ? '36px' : '28px', maxWidth: isDesktop ? '1060px' : '900px', margin: '0 auto' }}>
                  {NODES.map((node, i) => {
                    const rowEnd = i === 2 || i === 5;
                    const last   = i === NODES.length - 1;
                    // Each grid cell: card + inline connector (except at row end)
                    return (
                      <div key={node.id} style={{ display: 'flex', alignItems: 'stretch' }}>
                        <NodeCard node={node} index={i} inView={flowInView} mobile={false} desktop={isDesktop} />
                        {!rowEnd && !last && (
                          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <HConnector color={NODES[i + 1].color} delay={i * 120 + 300} inView={flowInView} desktop={isDesktop} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* row-wrap down arrow */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: isDesktop ? '1060px' : '900px', margin: '-14px auto 0', paddingRight: 'calc(100%/6)', opacity: flowInView ? 1 : 0, transition: 'opacity 0.6s ease 700ms' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ width: '2px', height: '18px', background: 'linear-gradient(180deg,#a78bfa,#f472b6)', borderRadius: '2px' }} />
                    <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid #f472b6' }} />
                  </div>
                </div>
              </>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '14px' : '28px', flexWrap: 'wrap', marginTop: isMobile ? '22px' : '32px', marginBottom: '12px', opacity: flowInView ? 1 : 0, transition: 'opacity 0.6s ease 800ms' }}>
              {LEGEND.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.dot, display: 'inline-block', boxShadow: `0 0 6px ${item.dot}`, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ margin: isMobile ? '32px auto' : '52px auto', maxWidth: '500px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(56,189,248,0.2),transparent)' }} />

          {/* ── TRUST PILLARS ── */}
          <div ref={trustRef}>
            {/* header */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px', opacity: trustInView ? 1 : 0, transform: trustInView ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.5s,transform 0.5s' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '100px', padding: '6px 14px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px' }}>🔒</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Figtree', sans-serif" }}>Data Safety Guarantees</span>
              </div>
              <h3 style={{ fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? '18px' : 'clamp(20px,3vw,28px)', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>Accurate. Private. Transparent.</h3>
              <p style={{ fontSize: '13px', color: '#475569', maxWidth: '440px', margin: '0 auto', lineHeight: 1.65 }}>Built for government records — we take integrity seriously.</p>
            </div>

            {/* cards */}
            <div className="trust-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: isDesktop ? '20px' : '12px', justifyContent: 'center' }}>
              {TRUST_PILLARS.map((p, i) => <TrustCard key={p.title} pillar={p} index={i} inView={trustInView} desktop={isDesktop} />)}
            </div>

            {/* badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: isMobile ? '24px' : '40px', opacity: trustInView ? 1 : 0, transition: 'opacity 0.6s ease 600ms' }}>
              {BADGES.map((b, i) => (
                <div key={b.text} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '100px', padding: isMobile ? '5px 10px' : '6px 13px', fontSize: isMobile ? '11px' : '12px', color: '#475569', fontWeight: 500, animation: 'float-b 3s ease-in-out infinite', animationDelay: `${i * 0.28}s` }}>
                  <span>{b.icon}</span><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}