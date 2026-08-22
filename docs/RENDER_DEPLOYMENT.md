# Render Static-Site Deployment

This documentation portal is a Vite single-page application. It must be deployed on Render as a **Static Site**, rather than as the historical Express compatibility entry point. The reproducible configuration is committed in [`render.yaml`](../render.yaml).

| Setting | Value | Rationale |
|---|---|---|
| Repository | `hstu-research/federated-aggregator-docs` | The public documentation decision ledger. |
| Branch | `main` | Each merged documentation decision becomes deployable. |
| Build command | `pnpm install --frozen-lockfile && pnpm vercel-build` | Uses the committed dependency lockfile and the static Vite build already verified for Vercel. |
| Publish directory | `./dist/public` | The portal’s Vite configuration explicitly emits the static application under `dist/public`. |
| Routing | `/*` → `/index.html` rewrite | Preserves deep links for the client-side Wouter router. |

## Deployment boundary

The Render deployment serves only the static documentation portal. It does not host the Core control plane, Python ML worker, Redis, PostgreSQL, hospital nodes, model bytes, artifact bytes, patient data, or clinical images. The existing managed documentation deployment remains active as an independent fallback while the Render endpoint is validated.

## Validation evidence

| Evidence item | Recorded result |
|---|---|
| Public endpoint | [`https://federated-aggregator-docs.onrender.com`](https://federated-aggregator-docs.onrender.com) |
| Deployment source | Public `main` branch at `a198ceb` (`Record phase 14 validation harness milestone`) |
| Render build | Succeeded with `pnpm install --frozen-lockfile && pnpm vercel-build` |
| Root route | Opened successfully on 21 August 2026 |
| Deep-link route | `/research-log` opened successfully after the `/*` → `/index.html` Rewrite was saved |
| Managed fallback | The existing managed documentation deployment remains active |

### Reproducibility follow-up

The repository-local `render.yaml`, this guide, and the associated roadmap updates are committed locally as `407a368`, but the sandbox GitHub credential rejected the push. This means the remote `main` branch remains at `a198ceb` until authentication is restored; the live Render settings are configured in the Render dashboard and must be kept synchronized with the committed configuration after that recovery. No Core API, worker, hospital, patient, artifact, or model-serving component is hosted by this service.
