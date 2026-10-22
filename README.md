# BackTrack

**Hours of footage. One clear story.**

BackTrack is an evidence-first home security investigation workspace. It reconstructs a chronological story across authorized Ring cameras, keeps every factual finding tied to a source event, and makes missing evidence visible.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. The default experience is an explicitly labeled deterministic demo, so it works without credentials. See [docs/demo-script.md](docs/demo-script.md).

## Status

- Implemented and tested: demo investigation workflow, normalization, ordering, duplicate handling, report provenance UI, missing-recording handling, Ring API adapter boundary, Bedrock adapter boundary.
- Simulated: all data visible in the default browser flow is synthetic and labeled `DEMO MODE`.
- Not live-verified: Ring OAuth/account linking, webhooks, historical media downloads, and Bedrock invocation require external app registration and credentials.

See [docs/ring-integration.md](docs/ring-integration.md), [docs/aws-integration.md](docs/aws-integration.md), and [docs/implementation-plan.md](docs/implementation-plan.md).
