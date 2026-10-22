import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Play, Search } from 'lucide-react';
import './styles.css';
import './minimal.css';
import './demo-overrides.css';

const VIDEO_ID = 'TfTFu8lGrwk';
const focusFor = (query: string) => query.toLowerCase().includes('suspicious') || query.toLowerCase().includes('activity')
  ? { label: 'SUSPICIOUS ACTIVITY · 00:18–00:24', x: 0, y: -4, scale: 1.55, start: 18, end: 24 }
  : { label: 'WIDE VIEW', x: 0, y: 0, scale: 1, start: 0, end: 6 };

function App() {
  const [query, setQuery] = useState('Show me suspicious activity around 7:00 AM');
  const [focus, setFocus] = useState(focusFor('suspicious activity'));
  const [playing, setPlaying] = useState(true);
  const frame = useRef<HTMLIFrameElement>(null);
  const send = (func: string, args: unknown[] = []) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  const investigate = (event: React.FormEvent) => { event.preventDefault(); const next = focusFor(query); setFocus(next); setPlaying(true); window.setTimeout(() => { send('seekTo', [next.start, true]); send('playVideo'); }, 350); };
  return <main className="minimal-portal"><header className="minimal-header"><div className="minimal-brand"><span>BACKTRACK</span><small>VIDEO INVESTIGATION</small></div><div className="connection-status"><i className="connected"/> DEMO READY</div></header><section className="minimal-stage"><div className="footage-frame"><div className="footage-viewport" style={{ '--focus-x': `${focus.x}%`, '--focus-y': `${focus.y}%`, '--focus-scale': focus.scale } as React.CSSProperties}><iframe ref={frame} className="ring-footage" title="BackTrack investigation footage" src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${VIDEO_ID}&enablejsapi=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture"/><div className="footage-vignette"/><div className="footage-topline"><span>CAMERA 01 · DEMO SOURCE</span><span>● LOOPING</span></div><div className="footage-bottomline"><span>{focus.label}</span><span>QUERY FOCUS</span></div></div></div><div className="focus-caption"><span>FOCUS</span><strong>{focus.label}</strong><small>Animated evidence search</small></div><form className="query-bar" onSubmit={investigate}><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask what happened…"/><button type="submit" aria-label="Investigate"><ArrowUpRight size={18}/></button></form><p className="hint">Try “Show me suspicious activity around 7:00 AM” to jump to 00:18–00:24.</p></section><footer className="minimal-footer"><button className="minimal-play" onClick={() => { setPlaying(!playing); send(playing ? 'pauseVideo' : 'playVideo'); }}><Play size={13} fill="currentColor"/> {playing ? 'Playing' : 'Paused'}</button><span>Query-driven video investigation</span></footer></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
