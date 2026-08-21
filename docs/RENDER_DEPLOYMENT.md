# Render Static-Site Deployment

This documentation portal is a Vite single-page application. It must be deployed on Render as a **Static Site**, rather than as the historical Express compatibility entry point. The reproducible configuration is committed in [`render.yaml`](../render.yaml).

| Setting | Value | Rationale |
|---|---|---|
| Repository | `paradox-tech-bd/federated-aggregator-docs` | The public documentation decision ledger. |
| Branch | `main` | Each merged documentation decision becomes deployable. |
| Build command | `pnpm install --frozen-lockfile && pnpm vercel-build` | Uses the committed dependency lockfile and the static Vite build already verified for Vercel. |
| Publish directory | `./dist/public` | The portal’s Vite configuration explicitly emits the static application under `dist/public`. |
| Routing | `/*` → `/index.html` rewrite | Preserves deep links for the client-side Wouter router. |

## Deployment boundary

The Render deployment serves only the static documentation portal. It does not host the Core control plane, Python ML worker, Redis, PostgreSQL, hospital nodes, model bytes, artifact bytes, patient data, or clinical images. The existing managed documentation deployment remains active as an independent fallback while the Render endpoint is validated.

## Validation evidence

Before a Render deployment is accepted, the service must complete the static build from `main`, serve the home route, and return the SPA shell for at least one documented deep link. The eventual public Render URL and deployment timestamp are to be recorded in this file and the research chronology after validation.
