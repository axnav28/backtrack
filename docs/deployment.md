# Deployment

The production server serves both the built frontend and `/api`. Deploy as one Node service with build command `npm ci && npm run build` and start command `npm start`. Set the variables in `.env.example` through the platform secret manager. Use HTTPS for any Ring callback, keep Ring tokens server-side, and configure the Vite proxy only for local development.

Vercel can deploy the exported Express app using `vercel.json`; use `npm run build` as the build command. Render uses `npm ci && npm run build` and `npm start` as a web service.

The current demo does not require external services. Live Ring verification additionally requires the Ring Developer Console application and callback configuration; Bedrock requires an IAM role with model invocation permission.
