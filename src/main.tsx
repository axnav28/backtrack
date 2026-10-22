import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, LoaderCircle, Play, Search } from 'lucide-react';
import { createLiveSession, loadDemo, loadLive } from './api';
import './styles.css';
import './minimal.css';

type Focus = { label: string; x: number; y: number; scale: number };
const focusFor = (query: string): Focus => {
  const q = query.toLowerCase();
  if (q.includes('package') || q.includes('door')) return { label: 'FRONT DOOR', x: -12, y: 10, scale: 1.75 };
  if (q.includes('car') || q.includes('vehicle') || q.includes('drive')) return { label: 'DRIVEWAY', x: 16, y: 4, scale: 1.65 };
  if (q.includes('person') || q.includes('motion')) return { label: 'MOTION EVENT', x: 3, y: -8, scale: 1.55 };
  return { label: 'WIDE VIEW', x: 0, y: 0, scale: 1 };
};

function App() {
  const [query, setQuery] = useState('What happened at the front door?');
  const [focus, setFocus] = useState<Focus>(focusFor('front door'));
  const [cameraName, setCameraName] = useState('Ring Playground');
  const [connected, setConnected] = useState(false);
  const [starting, setStarting] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    let cancelled = false;
    const connect = async () => {
      try {
        const live = await loadLive();
        if (cancelled || !live.cameras[0]) return;
        setCameraName(live.cameras[0].name);
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        peerRef.current = pc;
        pc.ontrack = event => { if (videoRef.current) { videoRef.current.srcObject = event.streams[0] ?? new MediaStream([event.track]); void videoRef.current.play(); } };
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await new Promise<void>(resolve => { if (pc.iceGatheringState === 'complete') resolve(); else pc.addEventListener('icegatheringstatechange', () => pc.iceGatheringState === 'complete' && resolve()); });
        const answer = await createLiveSession(live.cameras[0].id, pc.localDescription?.sdp ?? '');
        await pc.setRemoteDescription({ type: 'answer', sdp: answer.answerSdp });
        if (!cancelled) setConnected(true);
      } catch {
        try { const demo = await loadDemo(); if (!cancelled) setCameraName(demo.cameras[0]?.name ?? 'Demo camera'); } catch { /* visual fallback remains */ }
      } finally { if (!cancelled) setStarting(false); }
    };
    void connect();
    return () => { cancelled = true; peerRef.current?.close(); };
  }, []);

  const investigate = (event?: React.FormEvent) => { event?.preventDefault(); setFocus(focusFor(query)); };
  return <main className="minimal-portal"><header className="minimal-header"><div className="minimal-brand"><span>BACKTRACK</span><small>RING EVIDENCE</small></div><div className="connection-status"><i className={connected ? 'connected' : ''}/>{connected ? 'LIVE' : starting ? 'CONNECTING' : 'SIMULATOR'}</div></header><section className="minimal-stage"><div className="footage-frame"><div className="footage-viewport" style={{ '--focus-x': `${focus.x}%`, '--focus-y': `${focus.y}%`, '--focus-scale': focus.scale } as React.CSSProperties}>{!connected && <div className="simulated-footage"><div className="sim-grid"/><div className="sim-house"/><div className="sim-person"/><div className="sim-package"/><div className="sim-scan"/></div>}<video ref={videoRef} className="ring-footage" muted playsInline loop/><div className="footage-vignette"/><div className="footage-topline"><span>{cameraName}</span><span>● 00:42:18</span></div><div className="footage-bottomline"><span>{focus.label}</span><span>{connected ? 'RING WHEP' : 'SIMULATION'}</span></div></div>{starting && <div className="footage-loading"><LoaderCircle size={18}/> Connecting to footage</div>}</div><div className="focus-caption"><span>FOCUS</span><strong>{focus.label}</strong><small>Query-driven view</small></div><form className="query-bar" onSubmit={investigate}><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask what happened…"/><button type="submit" aria-label="Investigate"><ArrowUpRight size={18}/></button></form><p className="hint">Try “What happened at the front door?” or “Was there a vehicle in the driveway?”</p></section><footer className="minimal-footer"><span><Play size={13} fill="currentColor"/> Footage loops continuously</span><span>Evidence-first investigation</span></footer></main>;
}

createRoot(document.getElementById('root')!).render(<App/>);
