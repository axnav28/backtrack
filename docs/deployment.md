# Deployment

Deploy the frontend and Express server as one Node service or as separate services with `/api` routed to the Express process. Set the variables in `.env.example` through the platform secret manager. Use HTTPS for any Ring callback, keep Ring tokens server-side, and configure the Vite proxy only for local development.

The current demo does not require external services. Live Ring verification additionally requires the Ring Developer Console application and callback configuration; Bedrock requires an IAM role with model invocation permission.
