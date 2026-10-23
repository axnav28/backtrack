import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './brand-ad.css';

type Phase = 'boot' | 'typing' | 'searching' | 'focused' | 'complete';
type Shot = { id: number; camera: string; time: string; zone: string; tint: string; src?: string };

const query = 'Show me suspicious activity around 7:00 AM';
const shots: Shot[] = [
  { id: 1, camera: 'NORTH PERIMETER', time: '06:54:12', zone: 'CAM / 01', tint: '#5e8290' },
  { id: 2, camera: 'DRIVEWAY EAST', time: '06:57:48', zone: 'CAM / 02', tint: '#a17057' },
  { id: 3, camera: 'SIDE ENTRY', time: '06:58:31', zone: 'CAM / 03', tint: '#6a806d' },
  { id: 4, camera: 'GARAGE APPROACH', time: '06:59:04', zone: 'CAM / 04', tint: '#786985' },
  { id: 5, camera: 'FRONT WALK', time: '06:59:41', zone: 'CAM / 05', tint: '#8b7657' },
  { id: 6, camera: 'FRONT DOOR', time: '07:00:18', zone: 'CAM / 06', tint: '#c28b4e' },
  { id: 7, camera: 'PORCH WIDE', time: '07:00:24', zone: 'CAM / 07', tint: '#667c88' },
  { id: 8, camera: 'DRIVEWAY WEST', time: '07:01:02', zone: 'CAM / 08', tint: '#82785f' },
  { id: 9, camera: 'REAR GATE', time: '07:01:19', zone: 'CAM / 09', tint: '#59766f' },
  { id: 10, camera: 'PATIO', time: '07:02:07', zone: 'CAM / 10', tint: '#896e69' },
  { id: 11, camera: 'NORTH PATH', time: '07:02:41', zone: 'CAM / 11', tint: '#6b7d8c' },
  { id: 12, camera: 'MAILBOX', time: '07:03:15', zone: 'CAM / 12', tint: '#96815d' },
  { id: 13, camera: 'SOUTH GATE', time: '07:04:09', zone: 'CAM / 13', tint: '#657b67' },
  { id: 14, camera: 'BACK LOT', time: '07:05:32', zone: 'CAM / 14', tint: '#6e6c84' },
  { id: 15, camera: 'SERVICE ENTRY', time: '07:06:11', zone: 'CAM / 15', tint: '#94705d' },
  { id: 16, camera: 'ROOFTOP WIDE', time: '07:07:02', zone: 'CAM / 16', tint: '#58717b' },
];

function App() {
  const [phase, setPhase] = useState<Phase>('boot');
  const [typed, setTyped] = useState('');
  const [replay, setReplay] = useState(0);
  const focused = phase === 'focused' || phase === 'complete';

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;
    setTyped(''); setPhase('boot');
    timer = setTimeout(() => {
      if (cancelled) return;
      setPhase('typing');
      let index = 0;
      interval = setInterval(() => {
        index += 1; setTyped(query.slice(0, index));
        if (index === query.length) {
          if (interval) clearInterval(interval);
          timer = setTimeout(() => { setPhase('searching'); timer = setTimeout(() => { setPhase('focused'); timer = setTimeout(() => setPhase('complete'), 1800); }, 900); }, 500);
        }
      }, 42);
    }, 900);
    return () => { cancelled = true; if (timer) clearTimeout(timer); if (interval) clearInterval(interval); };
  }, [replay]);

  const status = useMemo(() => phase === 'boot' ? 'INITIALIZING EVIDENCE ENGINE' : phase === 'typing' ? 'LISTENING FOR INTENT' : phase === 'searching' ? 'CORRELATING 16 CAMERA SOURCES' : 'ANOMALY LOCATED', [phase]);
  return <main className={`brand-film ${focused ? 'is-focused' : ''} phase-${phase}`}>
    <div className="film-noise"/><div className="film-scanlines"/>
    <header className="film-header"><div className="film-logo"><span className="logo-mark">B</span><div><strong>BACKTRACK</strong><small>AI EVIDENCE SYSTEM</small></div></div><div className="film-status"><i/> {status}</div><div className="film-index">SYS / 026<br/><span>LOCAL SIMULATION</span></div></header>
    <section className="film-stage"><div className="eyebrow-line"><span>CASE FILE 07:00</span><span>16 SOURCES · SYNCHRONIZED</span></div><div className="montage">{shots.map((shot, index) => <article className={`shot shot-${shot.id} ${focused && shot.id !== 6 ? 'shot-dim' : ''} ${focused && shot.id === 6 ? 'shot-target' : ''}`} style={{ '--shot-tint': shot.tint } as React.CSSProperties} key={shot.id}><div className="shot-image">{shot.src ? <video src={shot.src} autoPlay muted loop/> : <><div className="empty-source">SOURCE<br/>EMPTY</div><div className="ghost-subject"/><div className="ghost-light"/></>}</div><div className="shot-meta"><span>{shot.zone}</span><time>{shot.time}</time></div><div className="shot-name">{shot.camera}</div>{focused && shot.id === 6 && <div className="target-reticle"><b/><b/><b/><b/></div>}</article>)}</div><div className="signal-beam"><span/><i/></div><div className="lock-message">{focused ? <><span className="alert-dot"/> TARGET ACQUIRED <strong>CAM / 06</strong><small>00:18 — 00:24</small></> : <><span className="signal-dot"/> {phase === 'searching' ? 'SEARCHING' : 'STANDBY'}<small>AWAITING QUERY</small></>}</div></section>
    <section className="ai-command"><div className="command-label"><span className="command-dot"/> BACKTRACK AI <small>QUERY INTERFACE</small></div><div className="command-line"><span className="prompt">›</span><span className="typed-query">{typed}</span><span className="caret"/><span className="enter-key">ENTER ↵</span></div><div className="command-result">{focused ? 'FOCUSING ON THE MOMENT THAT MATTERS.' : 'ASK A QUESTION. THE SYSTEM WILL FIND THE MOMENT.'}</div></section>
    <footer className="film-footer"><span>FOOTAGE PLACEHOLDERS READY</span><span className="replay" onClick={() => setReplay(value => value + 1)}>↻ REPLAY EXPERIENCE</span><span>BACKTRACK / 2026</span></footer>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App/>);
