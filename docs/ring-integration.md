# Ring integration

BackTrack follows the current Ring Partner API documentation: server-to-server OAuth 2.0, `https://api.amazonvision.com`, bearer authorization, `User-Agent`, and `Hardware_Id` headers. The adapter currently implements documented device discovery and event-history request paths in `server/ring.ts`.

The server now exposes `/api/ring/token`, `/api/ring/link`, `/api/ring/webhook`, `/api/ring/diagnostics`, `/api/ring/devices`, and a server-mediated video download route. Token exchange calls Ring's documented `oauth.ring.com/oauth/token` endpoint; webhook requests are checked against the raw request body and `X-Signature` HMAC header; documented nested webhook events are normalized into BackTrack evidence; account-link nonces are HMAC-checked and expire after 10 minutes; diagnostics and media calls use a server-only `RING_ACCESS_TOKEN`. Media redirects are allowlisted to Ring/Amazon HTTPS hosts. Token storage is intentionally in-memory for this prototype and must be replaced with encrypted persistent storage before production.

Live verification requires a Ring developer application, fresh client credentials, an approved account-linking flow, a stable hardware ID, and either a Ring device or the Ring Playground. No credentials are stored in this repository. The UI therefore reports `DEMO MODE` and never presents synthetic events as live data.

Remaining external milestone: complete the registered app's sign-in-backed account-claim page and move exchanged tokens/webhook idempotency records to encrypted persistent storage. Ring credentials and callback URLs are configured in Vercel; a physical Ring camera is not required when using Ring Playground.
