# Ring integration

BackTrack follows the current Ring Partner API documentation: server-to-server OAuth 2.0, `https://api.amazonvision.com`, bearer authorization, `User-Agent`, and `Hardware_Id` headers. The adapter currently implements documented device discovery and event-history request paths in `server/ring.ts`.

The server now exposes `/api/ring/token`, `/api/ring/link`, `/api/ring/webhook`, and `/api/ring/diagnostics`. Token exchange calls Ring's documented `oauth.ring.com/oauth/token` endpoint; webhook requests are checked against the raw request body and `X-Signature` HMAC header; diagnostics calls `/v1/users/me` and device discovery when `RING_ACCESS_TOKEN` is set. Token storage is intentionally in-memory for this prototype and must be replaced with encrypted persistent storage before production.

Live verification requires a Ring developer application, fresh client credentials, an approved account-linking flow, a stable hardware ID, and either a Ring device or the Ring Playground. No credentials are stored in this repository. The UI therefore reports `DEMO MODE` and never presents synthetic events as live data.

Next live milestone: implement the registered app's exact OAuth redirect/nonce flow, encrypted server-side token storage, webhook HMAC verification, and validated media-clip retrieval after the app's scopes and callback URL are configured in the Ring Developer Console.
