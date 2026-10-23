import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronLeft, Pause, Play, Search as SearchIcon, Upload, X } from 'lucide-react';
import './brand-ad.css';
import './cinematic-ui.css';

const query = 'Show me suspicious activity around 7:00 AM';
const shots = Array.from({ length: 16 }, (_, index) => ({ id: index + 1, time: `06:${String(54 + index % 14).padStart(2, '0')}:${String((index * 13) % 60).padStart(2, '0')}`, name: ['NORTH PERIMETER', 'DRIVEWAY EAST', 'SIDE ENTRY', 'GARAGE APPROACH', 'FRONT WALK', 'FRONT DOOR', 'PORCH WIDE', 'DRIVEWAY WEST', 'REAR GATE', 'PATIO', 'NORTH PATH', 'MAILBOX', 'SOUTH GATE', 'BACK LOT', 'SERVICE ENTRY', 'ROOFTOP WIDE'][index] }));
type Phase = 'idle' | 'typing' | 'submitted' | 'zooming' | 'player';

function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [searchOpen, setSearchOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [enterFlash, setEnterFlash] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startSearch = () => {
    if (phase !== 'idle') return;
    setSearchOpen(true); setPhase('typing'); setTyped('');
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1; setTyped(query.slice(0, index));
      if (index >= query.length) {
        window.clearInterval(interval); setPhase('submitted'); setEnterFlash(true);
        window.setTimeout(() => { setEnterFlash(false); setSearchOpen(false); setPhase('zooming'); }, 620);
        window.setTimeout(() => { setPhase('player'); setProgress(31); }, 1550);
      }
    }, 40);
  };
  const reset = () => { setPhase('idle'); setSearchOpen(false); setTyped(''); setProgress(0); };
  const isFocus = phase === 'zooming' || phase === 'player';
  return <main className={`cinematic-app phase-${phase} ${isFocus ? 'focus-mode' : ''}`}>
    <header className="top-nav"><button className="brand-word" onClick={reset}>BACKTRACK</button><nav><button>REALTIME</button><button>UPLOAD</button><button>LIBRARY</button><button className={`nav-search ${searchOpen ? 'active' : ''}`} onClick={startSearch}><SearchIcon size={14}/> SEARCH</button></nav><div className="nav-signal"><i/> SYSTEM ONLINE</div></header>
    <section className="montage-stage"><div className="montage-heading"><span>AI EVIDENCE RECONSTRUCTION</span><span>16 CAMERAS / SYNCHRONIZED</span></div><div className="shot-grid">{shots.map(shot => <article key={shot.id} className={`empty-shot ${shot.id === 6 && isFocus ? 'target-shot' : ''} ${isFocus && shot.id !== 6 ? 'dim-shot' : ''}`}><div className="empty-frame"><span>FOOTAGE {String(shot.id).padStart(2, '0')}</span><b>DROP SOURCE</b><em/></div><div className="shot-footer"><span>CAM / {String(shot.id).padStart(2, '0')}</span><time>{shot.time}</time></div><small>{shot.name}</small></article>)}</div><div className="stage-note">{isFocus ? 'TARGET ACQUIRED  /  CAM 06  /  FRONT DOOR' : 'SOURCE LIBRARY  /  AWAITING INVESTIGATION'}</div></section>
    <button className="search-launcher" onClick={startSearch}><SearchIcon size={17}/><span>{phase === 'idle' ? 'Ask BackTrack to find a moment…' : typed || query}</span><kbd>⌘ K</kbd></button>
    {searchOpen && <div className={`search-overlay ${enterFlash ? 'enter-flash' : ''}`}><div className="overlay-grid"/><button className="overlay-close" onClick={reset}><X size={18}/><span>ESC</span></button><div className="command-center"><div className="command-kicker"><i/> BACKTRACK / SEARCH INTELLIGENCE <small>LIVE QUERY ENGINE</small></div><div className="command-input"><span className="command-arrow">›</span><span>{typed}</span><i className="typing-caret"/><span className="command-enter">{phase === 'submitted' ? 'ENTERED' : 'ENTER ↵'}</span></div><div className="command-subtitle">{phase === 'submitted' ? 'TRANSLATING NATURAL LANGUAGE INTO EVIDENCE LOCATIONS' : 'TYPE A QUESTION TO SEARCH THE SOURCE LIBRARY'}</div></div><div className="enter-ripple"/></div>}
    {phase === 'player' && <section className="cinema-player"><div className="player-back" onClick={reset}><ChevronLeft size={17}/> ALL SOURCES</div><div className="player-head"><div><span>CAM / 06</span><h1>FRONT DOOR</h1></div><div className="player-live"><i/> REVIEWING EVIDENCE</div></div><div className="player-screen"><div className="player-placeholder"><span className="player-empty">FOOTAGE 06<br/><small>DROP SOURCE</small></span><div className="player-subject"/><div className="player-light"/></div><div className="player-overlay"/><div className="player-corner top-left"/><div className="player-corner top-right"/><div className="player-corner bottom-left"/><div className="player-corner bottom-right"/><div className="player-caption"><span>SUSPICIOUS ACTIVITY</span><b>07:00 AM</b></div></div><div className="player-controls"><button onClick={() => setPaused(!paused)}>{paused ? <Play size={17} fill="currentColor"/> : <Pause size={17} fill="currentColor"/>}</button><div className="timecode">00:{String(Math.round(18 + progress / 10)).padStart(2, '0')} <span>/ 01:12</span></div><input aria-label="Footage position" type="range" min="0" max="100" value={progress} onChange={event => setProgress(Number(event.target.value))}/><span className="control-label">TARGET 00:18—00:24</span></div><div className="player-query"><span>QUERY</span> “{query}”</div></section>}
    <footer className="bottom-line"><span>BACKTRACK / AI EVIDENCE SYSTEM</span><span>SIMULATION MODE · SOURCE SLOTS READY</span><span>{phase === 'player' ? 'FOCUS LOCKED' : 'READY'}</span></footer>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App/>);
