# Vercel Deployment

This documentation product is a **Vite + React single-page application**. Vercel must serve the static `dist/public` build and rewrite client-side routes to `index.html`.

The repository includes `vercel.json`, which runs `pnpm vercel-build`, publishes `dist/public`, and supports direct requests to the documentation routes:

| Route | Purpose |
|---|---|
| `/` | Product brief |
| `/requirements` | Integrated requirements analysis |
| `/technical-requirements` | System specification |
| `/architecture` | Architecture |
| `/api` | API reference |
| `/research-log` | Research log |

`server/index.ts` is only the sandbox/Node fallback used by the local managed environment. It is not the Vercel entry point and is intentionally excluded from the Vercel build command.

The visual system uses self-contained CSS artwork rather than the managed storage proxy, so the deployed Vercel site does not require a `manus-storage` route or sandbox credentials.
