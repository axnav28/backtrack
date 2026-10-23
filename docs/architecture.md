# Architecture

```text
React workspace → Express API → camera-system adapters → source recordings
                         ├── timeline engine → incident reconstruction
                         └── Bedrock adapter (optional, server-only)
```

The browser never calls camera providers or AWS directly. Demo recordings are labeled synthetic in the UI. The timeline engine de-duplicates, orders, and relates observations before any report provider sees them.
