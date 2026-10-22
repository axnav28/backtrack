# Architecture

```text
React workspace → Express API → Ring adapter → Ring Partner API
                         ├── timeline engine → evidence report
                         └── Bedrock adapter (optional, server-only)
```

The browser never calls Ring or AWS directly. Demo fixtures are isolated from the Ring client and are labeled synthetic in the UI. The timeline engine de-duplicates and orders source events before any report provider sees them.
