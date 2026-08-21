# Active Work

- [x] Configure the documentation and future core repositories to use the user's Git name and email for all new commits.
- [x] Add the documentation-ledger convention to the project governance record.
- [x] Research stakeholders, governance context, federated-learning practice, and model-release needs.
- [x] Write the non-technical aggregator-core requirements analysis: user, business, research, governance, risk, and opportunity requirements.
- [x] Add the requirements analysis, decision record, research-log entry, and open questions to the documentation site.
- [ ] Commit and push the documentation update using the user's configured Git identity.
- [ ] Deliver the analysis and identify the next architecture decision gate.

## Technical Requirements Analysis

- [x] Inventory the earlier clean-room Node.js services, Python ML core, documentation product, tests, and contracts.
- [x] Compare earlier implementation components against the accepted aggregator-core requirements.
- [x] Research current Node.js/TypeScript control-plane and Python federated-worker integration patterns.
- [x] Define API, event, artifact, authentication, persistence, model-registry, observability, and deployment requirements.
- [x] Specify the Node.js control-plane and Python ML-worker contract, including FedProx responsibilities.
- [x] Record reuse, rewrite, and defer decisions with technical rationale.
- [x] Publish the technical requirements chapter and architecture-gate questions in the documentation ledger.
- [ ] Build, verify, commit, and push the documentation update using the user's Git identity.

## Clarified Technical Analysis and Navigation Revision

- [x] Inspect the attached technical-requirements example and identify its exact section pattern.
- [x] Reframe the aggregator analysis in the example's requirements-specification format.
- [x] Replace redundant navigation groups with a single responsive chapter index and contextual page controls.
- [ ] Verify the revised technical page at desktop and mobile breakpoints.
- [ ] Commit and push the revised documentation update using the user's Git identity.

## Requirements Analysis Route Correction

- [x] Audit the visible requirements and system-specification chapters for cross-project example content.
- [x] Restore the federated-aggregator Requirements Analysis as a visible primary route.
- [x] Make the distinction between project requirements analysis and technical system specification explicit in the navigation and chapter introductions.
- [ ] Verify direct links and mobile navigation for both chapters.
- [ ] Commit and push the corrected documentation route using the user's Git identity.

## Deep Integrated Requirements Analysis

- [x] Map the supplied example’s structural depth to federated-aggregator-specific concerns without reusing its unrelated content.
- [x] Expand the project requirements into connected stakeholder, governance, research, workflow, data, artifact, security, operations, observability, and acceptance requirements.
- [x] Consolidate the business/research and technical requirements so that each technical decision traces to a project need or research risk.
- [x] Reorganize the documentation reading path around the single comprehensive requirements specification.
- [ ] Verify the revised requirements chapter and navigation at desktop and mobile widths.
- [ ] Commit and push the expanded requirements-analysis documentation using the user's Git identity.

## Vercel Static Deployment

- [x] Inspect the current Vite output and existing Vercel configuration.
- [x] Add Vercel static-build settings and SPA deep-link rewrites.
- [x] Build and verify the configured static output for all documentation routes.
- [ ] Commit and push the Vercel deployment configuration using the user's Git identity.

## Documentation Interface Refresh

- [x] Review the deployed documentation shell and identify visual regressions from the earlier design.
- [x] Define a refined modern documentation system with improved hierarchy, navigation, and reading rhythm.
- [x] Refresh the shell, home page, and core chapter presentation without reintroducing deployment-dependent assets.
- [x] Verify the refreshed desktop and mobile layouts plus Vercel static build output.
- [ ] Commit and push the documentation interface refresh using the user's Git identity.

## Data Management and Schema Design

- [x] Extract the structural depth of the supplied schema example without reusing its unrelated entities or content.
- [x] Research federated-healthcare data lineage, artifact governance, privacy boundaries, and schema requirements.
- [x] Define original schema groups for identity, federation governance, protocol/rounds, artifacts, aggregation jobs, release ledger, audit, and retention.
- [x] Create original Mermaid ERD, artifact-flow, and retention/lineage diagrams.
- [x] Add the detailed data-management chapter and diagrams to the Vercel-hosted documentation site.
- [x] Verify Mermaid rendering, mobile layout, and Vercel static build, then commit and push the update using the user's Git identity.

## Workflow Design and Orchestration

- [x] Extract the supplied workflow example’s structural depth without reusing its unrelated actors, routes, or flows.
- [x] Research federated round lifecycle, FedProx provenance, local-versus-central evaluation, and hospital-local data boundaries.
- [x] Write the original workflow specification with protocol activation, round launch, submission validation, aggregation, release, rollback, and recovery semantics.
- [x] Add the Workflow Design chapter, six original Mermaid diagrams, responsive navigation, research sources, and chronology entry.
- [x] Verify desktop/mobile rendering, type-checking, and Vercel static output without storage-proxy references.
- [x] Commit, push, and checkpoint the workflow-design documentation update using the user's Git identity.

## Full Aggregator Core System Architecture and Wiring

- [x] Analyze the supplied architecture demo for structural depth and exclude unrelated client, billing, content-generation, and product concerns.
- [x] Reconcile all current requirements, workflow, data-management, API, and prior core-repository decisions into one explicit architecture boundary.
- [x] Research authoritative patterns for OIDC/workload identity, NestJS control planes, durable jobs, artifact integrity, Python ML workers, PostgreSQL, Redis, and observability.
- [x] Define the complete component inventory, trust boundaries, interfaces, service dependencies, data flows, failure paths, and deployment topology.
- [x] Write original Mermaid system, sequence, deployment, trust-boundary, and event-flow diagrams plus an in-depth implementation specification.
- [x] Add or expand the responsive documentation chapter and update the Notion/research ledgers.
- [x] Verify diagrams, mobile layout, TypeScript, Vercel static output, then commit, push, and checkpoint under the user's Git identity.

## Modular Codebase Architecture and Engineering Standards

- [x] Analyze the clean-room repository, prior implementation decisions, and the supplied system scope to separate reusable references from new production modules.
- [x] Research comparable federated-learning/control-plane repositories plus authoritative TypeScript, Python, modular-monolith, clean-code, and testing guidance.
- [x] Define the monorepo folders, package ownership, dependency direction, public interfaces, shared libraries, adapters, supplementary services, and explicit non-dependencies.
- [x] Specify coding rules, naming, error/result strategy, configuration/secrets discipline, data contracts, observability, review criteria, and enforceable quality gates.
- [x] Specify a layered test strategy for unit, integration, contract, property, deterministic ML, security, migration, end-to-end, and resilience tests.
- [x] Add the responsive engineering-standards chapter, original Mermaid diagrams, research/source register, and chronological/Notion decisions.
- [x] Verify, commit, push, and checkpoint the update under the user Git identity.

## Handoff Implementation Plan and Identity Scope

- [x] Reconcile the approved governance, schema, workflow, system-wiring, and engineering-standards decisions into an explicit first-release feature inventory.
- [x] Research supported OIDC/Clerk patterns and the security/product implications of MetaMask or SIWE for an institution-governed research control plane.
- [x] Decide whether the first core requires a human user subsystem, workload identity subsystem, Clerk, wallet authentication, or a deliberately deferred wallet feature.
- [x] Write the phased product-core implementation plan with modules, schema/migrations, APIs, worker contracts, tests, dependencies, acceptance criteria, and handoff sequence.
- [x] Add the plan and identity decision to the documentation/Notion research ledgers.
- [x] Verify, commit, push, and checkpoint the handoff documentation update under the user Git identity.

## Product-Core Phase 0–1 Implementation Kickoff

- [x] Create the private `paradox-tech-bd/federated-aggregator-core` repository with the user's Git identity and a clear Phase 0–1 README/ADR index.
- [x] Establish pnpm and Python workspace roots, strict lint/type/format/testing configuration, local dependency definitions, CI, secret policy, and synthetic-fixture policy.
- [x] Create framework-free TypeScript contracts, domain, application-port, test-kit, and configuration packages with enforced dependency direction.
- [x] Implement local user, organization, membership, workload, federation, protocol, and round domain types/invariants with explicit OIDC/Clerk-ready and workload-identity ports.
- [x] Create deterministic unit tests for membership authorization, workload separation, protocol immutability, and core round transition rules.
- [x] Run all baseline quality gates, record the milestone in the research ledgers, then commit and push the implementation foundation under the user Git identity.

## Product-Core Phase 2 Persistence and API Foundation

- [x] Select Drizzle/PostgreSQL with generated reviewed SQL migrations while preserving application/domain port boundaries.
- [x] Implement governance, audit, idempotency, transactional-outbox, participation, and append-only round-history schema records.
- [x] Implement remote-JWKS OIDC verification, local principal hydration, separate workload vocabulary, controlled health/readiness, and a scoped federation read.
- [x] Verify migration execution on PostgreSQL 16, transactional commit/rollback, OIDC claims, guard denial, HTTP behavior, and 17 test cases.
- [x] Record the milestone in Notion and the public research chronology, then commit and push under the user Git identity.

## Product-Core Phase 3 Descriptor-Only Artifact Intake

- [x] Research and define direct-upload, SHA-256 integrity, generated-key, descriptor-only, and quarantine constraints.
- [x] Implement S3-compatible presigned intent/storage contracts and additive PostgreSQL artifact, upload-intent, and verification/quarantine records.
- [x] Implement local-membership/federation-scoped descriptor intent and storage-metadata verification workflows with atomic audit/outbox evidence.
- [x] Verify PostgreSQL migration, integrity mismatch quarantine, descriptor-only HTTP behavior, authorization, storage signing, and 24 test cases.
- [x] Record the milestone in the public research chronology and queue the Notion ledger record for retry after the connector timeout.

## Product-Core Phase 4 Verified Aggregation Dispatch

- [x] Research transactional-outbox, idempotent queue, and versioned Node–Python worker-contract constraints for verified federated aggregation.
- [x] Implement immutable aggregation jobs, frozen verified inputs, dispatch attempts, worker-result evidence, queue leases, and PostgreSQL reconciliation records.
- [x] Implement descriptor-only command/result contracts, verified-artifact-only BullMQ dispatch, deterministic Python FedAvg/FedProx-compatible averaging, and separate ML-worker callback authentication.
- [x] Verify canonical TypeScript/Python fixtures, duplicate delivery, dispatch identity, deterministic aggregation, malformed input rejection, stale callback rejection, candidate-ready transition, migration execution, and the 31 TypeScript plus 4 Python test evidence set.
- [x] Commit and push the core implementation and public chronology updates under the user Git identity.
- [ ] Retry the matching Notion ledger entry when Notion connector/browser transport is reachable; current attempts failed at connector initialization and network timeout.
- [ ] Checkpoint the documentation site under the user Git identity.

## Product-Core Phase 5 Candidate and Release Governance

- [x] Research and define bounded, evidence-backed, accountable, reversible, and retention-aware governance constraints for federated research-model releases.
- [x] Implement immutable candidates, evaluation-evidence descriptors, separated human approvals, release envelopes, safe rollbacks, review-only retention, audits, outbox records, and protected human routes.
- [x] Verify candidate provenance, self-approval denial, evidence and approval thresholds, descriptor integrity, idempotent publication/rollback, migration execution, and the complete 32 TypeScript plus 4 Python test evidence set.
- [ ] Record the milestone in Notion, commit/push the core and public chronology changes, and checkpoint the documentation site under the user Git identity.

## Product-Core Phase 6 Operational Resilience

- [x] Research and define bounded retry, dead-letter, dependency readiness, correlation visibility, and review-only retention constraints.
- [x] Implement delivery-state records, operator intervention evidence, protected operations read/control routes, PostgreSQL/Redis/object-storage readiness, and pending-only publisher guards.
- [x] Verify readiness failure isolation, platform-admin authorization, retry/dead-letter idempotency, migration execution, audit visibility, and the complete 36 TypeScript plus 4 Python test evidence set.
- [ ] Record the milestone in Notion, commit/push the core and public chronology changes, and checkpoint the documentation site under the user Git identity.

## Product-Core Phase 7 Human Administrator Portal

- [x] Research an administrator portal as a separate human-facing product, defining platform-admin and federation-owner boundaries, safe read models, explicit confirmation, accessibility, and preview-state constraints.
- [x] Create private `paradox-tech-bd/federated-aggregator-admin-portal` with React, TypeScript, Vite, a clinical instrument-panel design, source-only repository hygiene, and validated production build.
- [x] Add Core candidate/release governance summaries and federation-owner-protected API reads without returning artifact/model bytes, raw event payloads, patient data, evidence payloads, release envelopes, or policy internals.
- [x] Implement safe delivery, lineage, and review-only retention surfaces; require a named target, non-empty reason, explicit consequence, and submitted state for retry/dead-letter actions.
- [x] Verify Core CI (36 TypeScript plus 4 Python tests), PostgreSQL portal-read integration coverage, and portal production build; commit and push both private repositories with the user Git identity.
- [x] Record the milestone in the public research chronology and checkpoint the documentation site.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

## Product-Core Phase 8 Observability and Controlled Disposal

- [x] Research OpenTelemetry Collector resilience, endpoint-sensitive API resource controls, and media-sanitization boundaries to define a bounded control-plane hardening scope.[1] [2] [3]
- [x] Add a best-effort OTLP metrics adapter, no-op default, explicit telemetry configuration, local Collector health/memory/batch pipelines, and allowlisted telemetry contract.
- [x] Add per-principal operation-class privileged throttling before retry/dead-letter/disposal mutations, with HTTP 429 and `Retry-After` behavior for blocked commands.
- [x] Add additive reviewed disposal request, distinct federation-owner approvals, platform-admin execution, version-aware storage adapter command, immutable outcomes, and retained governance/release/audit lineage.
- [x] Validate full CI: formatting, lint, TypeScript, PostgreSQL migration/integration execution, 39 TypeScript tests, and 4 Python tests; build the portal and preserve its review-only disposal boundary until a safe Core summary exists.
- [x] Commit/push Core and portal milestones under the user Git identity, record the public chronology, and checkpoint the documentation site.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[1] [OpenTelemetry Collector Resiliency](https://opentelemetry.io/docs/collector/resiliency/)

[2] [OWASP API4:2023 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)

[3] [NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization](https://doi.org/10.6028/NIST.SP.800-88r2)

## Product-Core Phase 9 Shared Controls and Safe Disposal View

- [x] Research and record Redis atomic rate-limit semantics and Collector self-observability constraints; keep storage-retention/sanitization claims explicitly deployment-bound.[4] [5]
- [x] Add a Redis-backed atomic limiter selected when the configured Core has Redis, while retaining the prior process-local implementation only for no-Redis development.
- [x] Add a federation-owner-authorized, redacted disposal lifecycle endpoint that returns only safe summary fields and excludes locators, versions, reasons, descriptors, and raw evidence.
- [x] Add Collector self-metrics configuration and portable alert-rule templates without committing a telemetry vendor, alert receiver, paging integration, or production secret.
- [x] Extend the portal with the safe summary and a reason-required owner approval confirmation; do not expose a browser storage-execution control.
- [x] Validate Core CI (39 TypeScript plus 4 Python tests), PostgreSQL integration/migration execution, and portal production build; record that Docker runtime validation is unavailable in this sandbox.
- [x] Commit/push Core and portal changes under the user Git identity, record the public chronology, and checkpoint the documentation ledger.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[4] [Redis, Rate Limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)

[5] [OpenTelemetry Collector Internal Telemetry](https://opentelemetry.io/docs/collector/internal-telemetry/)

## Product-Core Phase 10 Stale Disposal Recovery

- [x] Research idempotent outbox recovery and preserve the rule that an unknown storage outcome must be recorded, not automatically retried.[6]
- [x] Add the `recovery_pending_verification` lifecycle state, an additive immutable recovery-evidence table, a fixed minimum age, platform-admin authorization, required reason, and protected Core command.
- [x] Keep recovery redacted in the portal lifecycle summary; do not add a browser recovery or storage execution control.
- [x] Validate Core CI: formatting, lint, type checking, recovery service tests, PostgreSQL migration/integration execution, 40 TypeScript tests, and 4 Python tests; validate the portal production build.
- [x] Commit/push Core and portal changes under the user Git identity, record the public chronology, and checkpoint the documentation ledger.
- [ ] Phase 11: Add a deployment-attestation record/workflow for storage/telemetry infrastructure, provider-backed verification for recovery-pending disposal outcomes, and Redis/Collector runtime testing in a real multi-instance topology.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[6] [Microservices.io, Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)

## Product-Core Phase 11 Deployment Attestations

- [x] Research deployment-attestation and distributed rate-limit validation constraints while treating provider evidence as a controlled reference rather than a live-cloud claim.[7]
- [x] Add a Core schema, migration, application service, PostgreSQL adapter, platform-admin record path, federation-owner safe-summary read, audit/outbox evidence, and protected API routes.
- [x] Keep the public/browser-safe summary limited to scope, assurance label, evidence digest, and review time; exclude raw provider configuration, credentials, evidence references, artifact/model bytes, and patient data.
- [x] Extend the portal with a protected deployment-evidence count only; do not add a browser recording control.
- [x] Validate full Core CI (42 TypeScript plus 4 Python tests), PostgreSQL migration/integration execution, and portal production build; commit/push with the user Git identity.
- [x] Record the chronology and checkpoint the documentation ledger.
- [ ] Phase 12: Add provider-backed recovery-resolution evidence, an attestation review/expiry policy, real multi-instance Redis-unavailable testing, and deployed Collector/backend/alert-receiver validation.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[7] [Redis, Rate Limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)

## Product-Core Phase 12 Provider-Verification Resolution

- [x] Research bounded provider verification and retain the distinction between an observed object state and a sanitization/compliance conclusion.[8] [9]
- [x] Add immutable resolution evidence for recovery-pending disposal with the only permitted outcome categories: `object_absent`, `object_present`, and `provider_unavailable`.
- [x] Require platform-admin authorization, a bounded reference/digest, correlation evidence, and privileged-operation throttling; do not invoke storage, retry deletion, or reuse old approvals from the resolution path.
- [x] Extend the portal only to recognize redacted verification lifecycle states; do not expose evidence references, provider responses, locators, versions, or a browser resolution control.
- [x] Validate Core CI (43 TypeScript plus 4 Python tests), PostgreSQL migration/integration execution, and portal production build; commit/push Core and portal updates under the user Git identity.
- [x] Record the chronology and checkpoint the documentation ledger.
- [ ] Phase 13: Add attestation review/expiry policy, real multi-instance Redis-unavailable validation, and deployed Collector/backend/alert-receiver testing while retaining the no-automatic-retry rule.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[8] [NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization](https://csrc.nist.gov/pubs/sp/800/88/r2/final)

[9] [OpenTelemetry Collector Configuration](https://opentelemetry.io/docs/collector/configuration/)

## Product-Core Phase 13 Attestation Freshness Policy

- [x] Research bounded attestation review/expiry policy and distributed Redis/Collector validation requirements.[10] [11]
- [x] Add a fixed 90-day expiry to every deployment attestation, including a migration backfill, protected safe-summary field, and portal-safe type.
- [x] Preserve the interpretation boundary: expiry marks review freshness only; it does not diagnose deployment configuration or imply a compliance result.
- [x] Validate full Core CI (43 TypeScript plus 4 Python tests), PostgreSQL migration/integration execution, and portal production build; commit/push Core and portal milestones with the user Git identity.
- [x] Record the chronology and checkpoint the documentation ledger.
- [ ] Phase 14: Build a real multi-instance Redis outage/failover test harness and deployed Collector/backend/alert-receiver validation record; retain the no-automatic-retry rule for provider-unavailable verification.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[10] [Redis Sentinel High Availability](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)

[11] [OpenTelemetry Collector Configuration](https://opentelemetry.io/docs/collector/configuration/)

## Product-Core Phase 14 Reproducible Infrastructure Validation

- [x] Research Redis Sentinel distributed-failure and Collector configuration-validation constraints.[12] [13]
- [x] Add a disposable Redis primary/replica/three-Sentinel compose topology, Sentinel configuration, controlled runbook, and a Collector `validate` command artifact.
- [x] Run static whitespace, format, lint, type, and test checks; record accurately that Docker is unavailable in this sandbox and no topology/failover/Collector/backend/alert runtime evidence exists yet.
- [x] Preserve the boundary that a topology artifact is not proof of Sentinel-aware Core support or production high availability.
- [x] Commit/push the Core validation artifacts under the user Git identity, record the chronology, and checkpoint the documentation ledger.
- [ ] Phase 15: Execute the validation topology in a disposable Docker-capable environment, record bounded deployment evidence, and decide whether the limiter needs explicit Sentinel-aware discovery support.
- [ ] Queue the matching Notion ledger update for retry after the unavailable connector/browser transport recovers.

### References

[12] [Redis Sentinel High Availability](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)

[13] [OpenTelemetry Collector Configuration](https://opentelemetry.io/docs/collector/configuration/)

## External Render Hosting

- [x] Confirm the user’s Render browser session and determine whether the documentation site will be created as a static site from the existing GitHub repository.
- [x] Verify the Render build command, publish directory, SPA routing behavior, and environment requirements against the existing Vercel-compatible static build.
- [x] Create and configure the Render Static Site, verify its public root and direct research-log route, and retain the current managed documentation domain as a fallback.
- [x] Record the external-hosting URL, settings, validation evidence, and GitHub-authentication limitation in the research ledger and deployment guide.
- [ ] Restore sandbox GitHub authentication and push the committed `render.yaml`/ledger changes so the remote main branch reproduces the running Render configuration.

## Azure VPS Production Hosting Preparation

- [x] Define the hosted production boundary for the Core API, dispatch worker, Python ML worker, PostgreSQL, Redis/Sentinel, object storage integration, administrator portal, documentation mirror, and future project applications.
- [x] Specify Azure Network Security Group ingress and egress rules using least privilege, including SSH source restriction, public TLS endpoints, private service ports, and managed-service dependencies.
- [ ] Prepare a VPS bootstrap and deployment runbook covering a non-root operator account, SSH key-only access, firewall, container runtime, secrets, backups, TLS, monitoring, and recovery evidence.
- [x] Receive initial Azure VPS SSH access for bootstrap; do not retain password-based administration after a key-only operator path is established.
- [x] Complete the initial VPS bootstrap: key-based operator access, updated Ubuntu baseline, SSH-only host firewall, Fail2ban, unattended updates, Docker/Compose, bounded Docker logs, swap, and source staging.
- [x] Run the Docker Collector configuration validator and start the disposable Redis Sentinel topology on Azure; correct the harness’s Docker-DNS startup race and record the incomplete primary-loss failover result without claiming high availability.
- [x] Add a private-by-default Core deployment definition and a supervised durable dispatch process entry point; retain explicit gates for capacity, secrets, reverse proxy/TLS, Azure NSG, owner recovery access, and the missing Python aggregation-worker runtime.
- [ ] Resize the VPS or split services before deploying the complete Core topology; the observed 891 MiB RAM baseline is not accepted for its private dependencies and future applications.
- [ ] Deploy and validate services after Azure NSG restriction, owner recovery access, appropriate capacity, required secrets, and executable runtime entry points are verified.
