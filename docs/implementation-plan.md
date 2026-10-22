# BackTrack implementation plan

1. Establish a small TypeScript/React workspace with a server boundary for sensitive integrations.
2. Implement deterministic Ring-shaped demo data and the explainable event normalization/timeline engine.
3. Add a documented Ring Partner API adapter using the current server-side OAuth/API contract; live credentials remain external setup.
4. Add Bedrock Runtime through an isolated adapter with a deterministic fallback when AWS is not configured.
5. Build the investigation workspace: report, timeline, evidence viewer, provenance, and onboarding modal.
6. Add tests and submission documentation, then verify build and local demo flow.

Current scope: the demo path is runnable now; live Ring OAuth callback, persistence, media proxy, and webhook verification remain the next integration milestone because no Ring developer credentials are present in this workspace.
