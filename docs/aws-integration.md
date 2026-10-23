# AWS / Bedrock integration

`server/bedrock.ts` uses the official AWS SDK v3 `BedrockRuntimeClient` and `ConverseCommand` to request a low-temperature, evidence-grounded report from the configured model. Set `AWS_REGION` and `BEDROCK_MODEL_ID`; deployed environments should use an IAM role or the standard AWS credential provider chain.

The response is schema-validated before it can replace the deterministic report. If Bedrock is unavailable or returns malformed/non-JSON output, BackTrack keeps the evidence-backed deterministic report and does not label it as AI-generated. The deployed Vercel environment has been smoke-tested against Bedrock successfully; the current model response is being rejected by the schema guard until it returns the requested JSON shape.

If configuration is absent or the request fails, the API returns the deterministic, validated demo report and logs only the provider error class/message. No AWS credentials are sent to the browser.

## Video vision search

When the user starts a footage search, the browser samples four frames from the selected 30-second MP4 at 0, 10, 20, and 29 seconds. It sends those JPEG frames and the question to `/api/video-search`. The Bedrock Converse request uses multimodal image content and returns a validated `matchSeconds` value plus visible observations. The player seeks to that returned moment. If Bedrock is not configured or the response is invalid, the demo falls back to the preset 17-second review point.
