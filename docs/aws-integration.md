# AWS / Bedrock integration

`server/bedrock.ts` uses the official AWS SDK v3 `BedrockRuntimeClient` and `ConverseCommand` to request a low-temperature, evidence-grounded report from the configured model. Set `AWS_REGION` and `BEDROCK_MODEL_ID`; deployed environments should use an IAM role or the standard AWS credential provider chain.

If configuration is absent or the request fails, the API returns the deterministic, validated demo report and logs only the provider error class/message. No AWS credentials are sent to the browser.
