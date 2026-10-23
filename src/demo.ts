import type { Camera, EvidenceEvent, Investigation } from './types';

export const demoCameras: Camera[] = [
  { id: 'cam-driveway', name: 'Driveway', location: 'North perimeter', status: 'online', mode: 'demo' },
  { id: 'cam-front-door', name: 'Front Door', location: 'Main entrance', status: 'online', mode: 'demo' },
  { id: 'cam-side-entry', name: 'Side Entrance', location: 'East side', status: 'online', mode: 'demo' },
];

const at = (hour: number, minute: number) => `2026-10-22T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+05:30`;
export const demoEvents: EvidenceEvent[] = [
  { id: 'evt-0712-drive', deviceId: 'cam-driveway', cameraName: 'Driveway', kind: 'motion', label: 'Motion detected', timestamp: at(19, 12), endTimestamp: at(19, 13), hasRecording: true, mode: 'demo', sourceSystem: 'Driveway view', notes: 'Synthetic event; clip available.' },
  { id: 'evt-0714-door', deviceId: 'cam-front-door', cameraName: 'Front Door', kind: 'package', label: 'Package visible near door', timestamp: at(19, 14), endTimestamp: at(19, 15), hasRecording: true, mode: 'demo', sourceSystem: 'Front entry view', },
  { id: 'evt-0718-door', deviceId: 'cam-front-door', cameraName: 'Front Door', kind: 'person', label: 'Person detected', timestamp: at(19, 18), endTimestamp: at(19, 20), hasRecording: true, mode: 'demo', sourceSystem: 'Front entry view' },
  { id: 'evt-0719-drive', deviceId: 'cam-driveway', cameraName: 'Driveway', kind: 'person', label: 'Person detected at driveway edge', timestamp: at(19, 19), endTimestamp: at(19, 20), hasRecording: true, mode: 'demo', sourceSystem: 'Driveway view' },
  { id: 'evt-0721-side', deviceId: 'cam-side-entry', cameraName: 'Side Entrance', kind: 'motion', label: 'Motion detected', timestamp: at(19, 21), endTimestamp: at(19, 22), hasRecording: false, mode: 'demo', sourceSystem: 'Side entrance view', notes: 'Recording unavailable in fixture.' },
  { id: 'evt-0724-door', deviceId: 'cam-front-door', cameraName: 'Front Door', kind: 'motion', label: 'Motion detected; package no longer visible', timestamp: at(19, 24), endTimestamp: at(19, 25), hasRecording: true, mode: 'demo', sourceSystem: 'Front entry view', notes: 'Absence is not proof of removal.' },
  { id: 'evt-0731-drive', deviceId: 'cam-driveway', cameraName: 'Driveway', kind: 'motion', label: 'Motion detected', timestamp: at(19, 31), endTimestamp: at(19, 32), hasRecording: true, mode: 'demo', sourceSystem: 'Driveway view' },
];

export const demoInvestigation: Investigation = {
  id: 'demo-investigation', question: 'What happened at my front entrance between 7 PM and 8 PM?', start: at(19, 0), end: at(20, 0), cameras: demoCameras.map(c => c.id), events: demoEvents, mode: 'demo', provider: 'deterministic',
  summary: 'A sequence of motion and person detections occurred across the driveway and front door between 7:12 PM and 7:24 PM. A package was visible before the person detection and is not visible in a later event, but the available evidence does not establish what happened to it.',
  facts: ['Motion was detected at the driveway at 7:12 PM.', 'A package was visible near the front door at 7:14 PM.', 'Person detections occurred at the front door at 7:18 PM and driveway at 7:19 PM.', 'Side entrance motion at 7:21 PM has no available recording.'],
  inferences: ['The front-door and driveway events are temporally adjacent and are grouped as one candidate incident; temporal proximity alone does not prove they involve the same person.'],
  uncertainties: ['The 7:21 PM side-entrance event cannot be visually inspected.', 'The later absence of the package is not evidence of theft or removal by a particular person.'],
};
