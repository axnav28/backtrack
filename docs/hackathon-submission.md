# Hackathon submission status

## Ring track

BackTrack has a server-side Ring Partner API adapter with the documented API base, bearer headers, device discovery path, and historical event path. The default demo is explicitly synthetic and does not claim live Ring data. Live OAuth, webhook verification, and media retrieval are external setup items pending Ring app credentials and device access.

## AWS Builder

`server/bedrock.ts` makes a real AWS SDK v3 Bedrock Runtime `ConverseCommand` call when `AWS_REGION` and `BEDROCK_MODEL_ID` are configured. The deterministic report remains available when AWS is unavailable.

## Open Source mini challenge

Not yet published. A separate eligible companion project or public contribution must be created and its URL recorded here before submission; the BackTrack repository alone is not claimed as satisfying this challenge.
