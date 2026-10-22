# Hackathon submission status

## Ring track

BackTrack has a server-side Ring Partner API adapter with the documented API base, bearer headers, device discovery path, and historical event path. The default demo is explicitly synthetic and does not claim live Ring data. Live OAuth, webhook verification, and media retrieval are external setup items pending Ring app credentials and device access.

## AWS Builder

`server/bedrock.ts` makes a real AWS SDK v3 Bedrock Runtime `ConverseCommand` call when `AWS_REGION` and `BEDROCK_MODEL_ID` are configured. The deterministic report remains available when AWS is unavailable.

## Open Source mini challenge

Published companion project: https://github.com/axnav28/backtrack-timeline

It is an MIT-licensed TypeScript utility that de-duplicates and orders event streams, groups nearby observations with a configurable window, and preserves an explicit rationale that temporal proximity is not proof of common cause. It has deterministic tests and is intentionally separate from the BackTrack application.
