# Hackathon submission status

## Ring track

BackTrack has a server-side Ring Partner API adapter with the documented API base, bearer headers, device discovery path, and historical event path. The default demo is explicitly synthetic and does not claim live Ring data. Live OAuth, webhook verification, and media retrieval are external setup items pending Ring app credentials and device access.

## AWS Builder

`server/bedrock.ts` makes real AWS SDK v3 Bedrock Runtime `ConverseCommand` calls when `AWS_REGION` and `BEDROCK_MODEL_ID` are configured. Investigation reports use structured event evidence, while footage search samples four frames from the selected local MP4 and sends them as multimodal image content. Bedrock returns a validated matching timestamp and observations; the deterministic report and 17-second review fallback remain available when AWS is unavailable.

## Open Source mini challenge

Published companion project: https://github.com/axnav28/backtrack-timeline

It is an MIT-licensed TypeScript utility that de-duplicates and orders event streams, groups nearby observations with a configurable window, scores cross-camera event candidates, and preserves an explicit rationale that temporal proximity is not proof of common cause. It has deterministic tests and is intentionally separate from the BackTrack application.
