# Ring integration

BackTrack follows the current Ring Partner API documentation: server-to-server OAuth 2.0, `https://api.amazonvision.com`, bearer authorization, `User-Agent`, and `Hardware_Id` headers. The adapter currently implements documented device discovery and event-history request paths in `server/ring.ts`.

Live verification requires a Ring developer application, client credentials, an approved account-linking flow, a stable hardware ID, and a Ring device. No credentials are stored in this repository. The UI therefore reports `DEMO MODE` and never presents synthetic events as live data.

Next live milestone: implement the registered app's exact OAuth redirect/nonce flow, encrypted server-side token storage, webhook HMAC verification, and validated media-clip retrieval after the app's scopes and callback URL are configured in the Ring Developer Console.
