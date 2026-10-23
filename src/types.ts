export type EvidenceMode = 'demo' | 'live';
export type EventKind = 'motion' | 'person' | 'package' | 'doorbell' | 'unknown';
export interface Camera { id: string; name: string; location: string; status: 'online' | 'offline' | 'unknown'; mode: EvidenceMode; }
export interface EvidenceEvent { id: string; deviceId: string; cameraName: string; kind: EventKind; label: string; timestamp: string; endTimestamp: string; hasRecording: boolean; mode: EvidenceMode; sourceSystem?: string; rawType?: string; notes?: string; }
export interface Investigation { id: string; question: string; start: string; end: string; cameras: string[]; events: EvidenceEvent[]; summary: string; facts: string[]; inferences: string[]; uncertainties: string[]; provider: 'deterministic' | 'bedrock'; mode: EvidenceMode; }
