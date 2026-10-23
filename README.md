# BackTrack

## The investigation layer for every security camera.

Import recordings from different camera brands. Ask what happened. BackTrack builds a chronological incident timeline, links potentially related observations across cameras, highlights missing evidence, and lets users verify every finding against the original footage.

The defining feature: give BackTrack recordings from three unrelated camera systems and ask it to reconstruct one incident, with traceable evidence and explicit uncertainty.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. The default experience is an explicitly labeled deterministic demo, so it works without credentials. See [docs/demo-script.md](docs/demo-script.md).

## Status

- Implemented and tested: multi-source demo investigation workflow, normalization, ordering, duplicate handling, cross-camera correlation, report provenance UI, missing-recording handling, Ring API adapter boundary, Bedrock adapter boundary.
- Simulated: all data visible in the default browser flow is synthetic and labeled `DEMO MODE`.
- Not live-verified: Ring OAuth/account linking, webhooks, historical media downloads, and Bedrock invocation require external app registration and credentials.

See [docs/ring-integration.md](docs/ring-integration.md), [docs/aws-integration.md](docs/aws-integration.md), and [docs/implementation-plan.md](docs/implementation-plan.md).

## Submission links

- Live demo: https://backtrack-teal.vercel.app
- Open-source companion: https://github.com/axnav28/backtrack-timeline
