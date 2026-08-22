# Active Work

- [x] Configure the documentation and future core repositories to use the user's Git name and email for all new commits.
- [x] Add the documentation-ledger convention to the project governance record.
- [x] Research stakeholders, governance context, federated-learning practice, and model-release needs.
- [x] Write the non-technical aggregator-core requirements analysis: user, business, research, governance, risk, and opportunity requirements.
- [x] Add the requirements analysis, decision record, research-log entry, and open questions to the documentation site.
- [ ] Commit and push the documentation update using the user's configured Git identity.
- [ ] Deliver the analysis and identify the next architecture decision gate.

## GitHub Organization Migration to hstu-research

- [x] Inventory every organization-bound reference across the Core, documentation, administrator portal, thesis, Git remotes, GitHub Actions, deployment workflows, and hosted-service configuration.
- [x] Transfer `federated-aggregator-core`, `federated-aggregator-docs`, `federated-aggregator-admin-portal`, and `thesis_breast_cancer` to `hstu-research` while preserving repository visibility, history, and default branches.
- [x] Update local repository remotes, active source metadata, CI/CD and deployment documentation, Render source settings, and documentation links to make `hstu-research` authoritative. The Azure workflow remains repository-local, so no Azure source URL rewrite was required.
- [x] Verify the transferred repository URLs, GitHub Actions visibility, Azure deployment source path, Core Quality Gates run 31, protected Azure deployment run 16, and the Render documentation build from `hstu-research/federated-aggregator-docs` commit `3a8e65b`; record the result in the public research chronology and publish a documentation checkpoint.

## Bounded Aggregation Callback and Redis Resilience Evidence

- [x] Read the current public decision ledger and Core contracts to define one synthetic federation, protocol, round, verified descriptor set, aggregation job, callback, and evidence query. Synthetic archive bytes remained worker-local/object-storage-only; no patient data, clinical images, credentials, bearer tokens, raw provider responses, or storage locators entered the ledger.
- [x] Add the profile-gated `bounded-aggregation-validation` Azure harness and operator runbook. The runner creates synthetic control-plane records, dispatches one job through the real outbox path, waits for descriptor-only reconciliation, and emits only safe identifiers, lifecycle states, digests, checksum, and byte-size evidence.
- [x] Temporarily set `AGGREGATION_WORKER_ENABLED=true` only for the bounded synthetic test, repair the missing private callback URL and non-root OIDC-secret handoff found during the first controlled attempt, verify the real worker result as `succeeded|candidate_ready|enqueued|accepted`, then immediately restore the default disabled gate and its explicit log state.
- [x] Run a separate disposable Redis primary/two-replica/three-Sentinel fault-injection exercise. It observed primary loss and a final `subjectively_down` state but no promotion during the bounded window; the test topology was removed and the current direct-URL Core path remains explicitly non-Sentinel-aware.
- [x] Record the bounded callback and Sentinel evidence in the public chronology, keep all secrets and raw provider responses out of the ledger, apply the indexed-archive presentation refinements, and publish a documentation checkpoint.

## Next Federated System: Documentation-First Autonomous Delivery

- [x] Review the completed Core ledger, existing administrator portal, thesis materials, and supplied research sources to select the separate Hospital Node Agent boundary without duplicating the Core control plane.
- [x] Publish an in-depth non-technical requirements analysis covering users, hospital operating model, research value, clinical-data boundary, governance, risks, and measurable outcomes for the Hospital Node Agent.
- [x] Publish the matching technical requirements analysis, logical schema, lifecycle and exception flows, system architecture, modular engineering standards, workflow design, proposed workload API contract reference, and AI-ready implementation handoff.
- [x] Create `hstu-research/federated-aggregator-hospital-node`, establish its tested synthetic baseline at `cfcf1dc`, and retain integration exclusively through the Core’s proposed descriptor, command, and workload-identity boundaries.
- [x] Add restart-safe local SQLite run state at `2468f4b` with unique assignment/idempotency identity, append-only event labels, terminal-run recovery, and in-process fake Core adapters; Hospital Node Quality Gates #2 passed in 18 seconds. No local status route, data path, token, object locator, artifact byte, patient field, or Core network integration was added.
- [x] Add in-memory scoped capability, checksum, token, remote-outcome, and fake storage guards at `deee8a6` and `1dcff80`; Hospital Node Quality Gates #3 and #4 passed. The work proves only synthetic contract behavior—no Azure/Core call, capability URL, automatic retry, persistent credential, raw byte API, or hospital data path was introduced.
- [x] Add the opt-in localhost-only synthetic status read and static Compose test profile at `e11d661`; Quality Gates #5 passed in 20 seconds. The direct loopback response is tested; Docker is unavailable in this sandbox, so no container runtime proof or public deployment is claimed.
- [x] Specify the additive Core hospital-node workload contract before integration: distinct audience/guard, participation-gated assignment and lease lifecycle, descriptor-only artifact intent/submission, safe event/audit schema, test sequence, and bounded Azure synthetic proof. Existing human and `ml_worker` routes remain prohibited.
- [x] Implement and deploy the first Core policy-only slice at `79bdcee`: hospital-node assignment/lease vocabulary, state transitions, lease eligibility, repository port, and deterministic denials. Full local CI, Core Quality Gates, Azure deployment, and public liveness/readiness passed; no migration, HTTP route, capability, credential, node call, or worker activation was added.
- [x] Implement and deploy the additive Core persistence foundation at `31e7588`: constrained assignment/lease/safe-event schema plus migration `0010`, unique assignment/idempotency controls, and descriptor-only columns. Full local CI, Core Quality Gates, Azure deployment, and public liveness/readiness passed; no adapter, API route, capability, Keycloak client, node call, hospital data, or worker activation was added.
- [x] Implement and deploy `HospitalNodeAuthGuard` at `92c6c53`: distinct `fedagg-hospital-node` audience, active workload hydration, and hospital-node-kind enforcement with ML-worker denial. Full local CI, Core Quality Gates, Azure deployment, and public liveness/readiness passed; no controller, Keycloak client, token, route, capability, node call, hospital data, or worker activation was added.
- [x] Implement and deploy `PostgresHospitalNodeAssignmentRepository` at `263e596`: exact workload/participant context, idempotent lease recovery, one-active-lease database index, assigned-to-leased compare-and-set, and scalar-only lease event. Full local CI, Core Quality Gates, Azure deployment, and public liveness/readiness passed; no controller, Keycloak client, immutable command, capability, update/submission route, node call, hospital data, or worker activation was added.
- [x] Document the canonical-command prerequisite before lease-route work: Core must persist the Agent-validated descriptor-only `hospital-node-command/v1` payload plus Core-computed digest because existing protocol digest metadata cannot reconstruct it. The future payload excludes locators, credentials, bytes, paths, free text, and patient data.
- [x] Implement and deploy the first dedicated hospital-node lease route at `0fd4e4b`: `HospitalNodeAuthGuard` only, principal-derived workload binding, UUID idempotency key, and lease receipt plus stored descriptor-only command. Full local CI, Core Quality Gates, Azure deployment, and public liveness/readiness passed; the route was not invoked because no node Keycloak client or assignment exists, and no capability, artifact transfer, submission, data, or worker change was added.
- [x] Design the bounded endpoint proof before configuration: a distinct private `hospital-node-synthetic` OIDC client/secret/audience/claim, opt-in Core-network profile, generated synthetic assignment/command, one lease call, and immediate fixture non-reuse. ML-worker identity and aggregation-worker activation remain prohibited.
- [x] Validate the initial slice against the Core test environment and record the bounded lease evidence in the public ledger: Core `7d9218c` deployed successfully; the separate private synthetic client acquired a token; one generated assignment received one descriptor-only lease; the fixture closed as one expired assignment, zero active assignments/leases, and one safe closure event; Azure liveness/readiness remained HTTP 200 and the aggregation worker stayed disabled.
- [x] Document the next Core gate before implementation: a narrowly privileged synthetic assignment-creation authority, including frozen-fact eligibility, idempotency, audit, expiry, and denial tests. Do not implement model-read capability, update intent, artifact transfer, or submission until that design is accepted.
- [x] Increment A — Publish the assignment-creation authority contract: explicit principal, input shape, frozen-fact source, canonical-command ownership, idempotency, safe event/outbox evidence, expiry/terminal handling, and denial matrix.
- [x] Increment B — Implement only the documented synthetic assignment-creation authority with deterministic domain/application/persistence tests; retain every human route, ML-worker identity, artifact capability, transfer, training, and submission path as unavailable. Core `a0f423b` added the private service/port/domain/adapter boundary and 10 new TypeScript tests.
- [x] Increment C — Pass Core quality gates and protected Azure deployment; verify liveness/readiness and the default-disabled aggregation worker before any bounded runtime exercise. Quality passed in 1 minute 41 seconds; protected Azure deployment passed in 3 minutes 1 second; liveness/readiness were HTTP 200 and the worker stayed disabled.
- [x] Increment D — Record deployment evidence and define the next safe boundary before any new implementation work.
- [x] Increment E — Publish the bounded creation-only composition-proof contract: a new private profile/runner must compose the service for generated facts, prove exact replay, and close the fixture without token, endpoint, lease, capability, transfer, submission, dispatch, or worker activation.
- [x] Increment F — Implement the documented creation-only profile, runner, and deterministic tests; deploy `0b48aeb`, then run it once only after Azure health and default-disabled worker verification. The proof closed as one expired synthetic assignment, zero active assigned/leased records, one closure event, and zero remaining runners.
- [x] Increment G — Publish the descriptor-only base-model-read intent contract: lease-bound node-only issuance, Core-owned model descriptor mapping prerequisite, additive receipt/state/event design, exact replay, redaction, and no-storage-access proof requirements.
- [x] Increment H0 — Publish the missing Core-owned verified base-model descriptor mapping contract and additive schema prerequisite. The current `rounds.baseModelVersionId` is an opaque string and the current artifact categories do not represent a verified base-model archive, so it cannot safely support a node read-intent yet.
- [x] Increment H1 — Implement and deploy only the documented verified base-model descriptor mapping plus persistence tests. Core `9fce888` added migration `0012`, immutable descriptor/event persistence, exact replay/conflict tests, and a private service; 68 TypeScript and 9 Python tests, quality/deployment, Azure health, and the disabled-worker gate passed. No mapping runtime profile ran.
- [x] Increment H2 — Resume the documented base-model-read intent boundary only after H1 mapping evidence is recorded and accepted.
- [x] Increment I — Implement only the documented lease-bound, HospitalNodeAuthGuard-only descriptor receipt for base-model-read intent issuance plus its migration, redaction, atomicity, and guard tests. Core `d9b55fc` added migration `0013`, the guarded receipt route, domain/application/persistence/controller coverage, and 77 TypeScript plus 9 Python tests. Quality/deployment, Azure health, and disabled-worker checks passed; no runtime intent request occurred.
- [x] Increment J0 — Publish the one-shot descriptor-intent issuance-and-expiry proof profile contract before implementation. It must use generated facts only, issue one intent through the guarded Core route, assert redaction, expire the intent/lease/assignment, append safe closure evidence, and never contact storage or enable the aggregation worker.
- [ ] Increment J1 — Implement and deploy the documented opt-in descriptor-intent proof profile/runner. Do not execute it in Azure until its own quality/deployment and current health/default-disabled-worker checks pass.

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

- [x] Establish the private `hstu-research/federated-aggregator-core` repository with the user's Git identity and a clear Phase 0–1 README/ADR index.
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
- [x] Maintain private `hstu-research/federated-aggregator-admin-portal` with React, TypeScript, Vite, a clinical instrument-panel design, source-only repository hygiene, and validated production build.
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
- [x] Verify the Azure VPS resize: 2 vCPUs, approximately 3.8 GiB RAM, 62 GiB disk, active 2 GiB swap, healthy Docker/Fail2ban/unattended-upgrades, and no running application containers.
- [ ] Verify Azure NSG restriction, owner recovery access, required protected secrets, reverse proxy/TLS configuration, and the Python aggregation-worker runtime gate before starting Core services.
- [ ] Deploy and validate eligible private Core services after all production gates are satisfied.

## Azure Test-Environment CI/CD

- [x] Define the automatic deployment boundary: Core-only, `main`-branch trigger after CI success, SSH transport, and public HTTPS for the test API only; keep database, Redis, workers, telemetry, and management ports private.
- [x] Add reproducible host-side release scripts and a CI workflow that packages only committed Core source, validates it, and deploys atomically over SSH.
- [x] Configure the protected `azure-test` repository deployment environment with host, user, host-key, and dedicated deployment-key secrets; keep Core runtime configuration separate on the VPS.
- [x] Configure the Azure-assigned hostname, host firewall TCP 80/443, and automated TLS; the public test API is available at `https://nirog.koreacentral.cloudapp.azure.com`.
- [x] Execute and observe a test deployment, including internal liveness/readiness and HTTPS health verification.
- [x] Validate the `main`-triggered GitHub Actions release path: Core Quality Gates and the protected SSH deployment completed for commit `25c7073`; public liveness and private container state were verified.
- [ ] Replace synthetic test configuration only after real protected storage/OIDC inputs, the Python aggregation-worker runtime, and workload-identity validation are implemented.

## Render Core Test Hosting

- [ ] Create one public Core API web service on Render’s free tier; retain PostgreSQL, Redis, and Cloudflare R2-compatible storage as external managed dependencies.
- [x] Retain the continuous dispatch worker and complete Core CI/CD topology on Azure because the Render free tier cannot host the required always-on background worker.
- [x] Select the Render free API tier after the paid Starter flow requested billing; it provides 512 MB RAM and 0.1 CPU, with spin-down after inactivity; do not create a paid service or request payment details.
- [x] Create the free `federated-aggregator-core-api-test` web service at `https://federated-aggregator-core-api-test.onrender.com`; its initial build uses Core commit `daaf132` and remains pending health verification.
- [x] Confirm the initial Docker build completed and Render began the free API instance; it is waiting for a successful internal `/health/ready` response and is not yet an accepted deployment.
- [x] Confirm the Render process registered the Core HTTP routes and started the Nest application; the platform health check remains pending, and the provider emitted a non-fatal PostgreSQL SSL-mode compatibility warning for later remediation.
- [x] Confirm the configured custom R2-compatible endpoint is reachable over IPv4 but returns HTTP 404 for both its root and the Core adapter’s path-style bucket route; treat object storage as the current readiness blocker until the true S3 API endpoint or compatible bucket addressing is supplied.
- [x] Set the protected Render `S3_REGION` value to Cloudflare R2’s required S3-compatible `auto` region after replacing the custom domain with the official API endpoint, then trigger a free-tier API redeployment.
- [ ] Verify that the revised Render deployment receives a successful `/health/ready` response; the Core process starts but the platform health probe remains pending.
- [x] Record that Render Shell is unavailable on the free instance, preventing an in-container readiness diagnostic without upgrading.
- [x] Change the free Render service’s platform health path from strict `/health/ready` to `/health/live` solely for test-environment admission; public liveness now returns HTTP 200.
- [x] Confirm strict `/health/ready` remains HTTP 503 after the official R2 endpoint and `auto` region correction; the free Render API is hosted for liveness testing but is not operationally ready for federated workflows.

## Azure-First Operational Boundary

- [x] Designate the Azure VPS deployment as the authoritative Core control-plane and execution environment for all current federated workflows.
- [x] Retain the Render free API and Cloudflare-managed backup components as a non-primary continuity path only; they must not become the source of operational state, dispatch ownership, or release authority.
- [ ] Implement and validate the missing Python aggregation-worker runtime against the Azure-first queue, storage, workload-identity, and callback boundary.
- [x] Implement the descriptor-only Python aggregation runtime with official BullMQ Python consumption, deterministic bounded archive adapters, worker-only S3 access, authenticated callback support, and an explicit disabled-by-default consumption gate.
- [x] Pass the full Core quality gate after the worker addition: 43 TypeScript tests and 8 Python tests.
- [x] Publish Core commit `351ee6f` to the protected main branch; the existing Azure quality-gate and deployment workflows have been triggered for the aggregation-worker runtime.
- [x] Confirm Core Quality Gates run 23 completed successfully for `351ee6f`; Azure deployment run 8 is in progress.
- [x] Confirm Azure deployment run 8 completed successfully for `351ee6f`; the aggregation-worker container is running but remains intentionally idle until a real workload credential enables queue consumption.
- [x] Publish follow-up Core commit `9b9b5ff` so the disabled worker explicitly logs its safety-gate state on the next automated Azure rollout.
- [x] Verify Azure deployment run 9 and Core Quality Gates run 24 both completed successfully for `9b9b5ff`.
- [x] Validate the Python worker image and disabled Azure Compose service directly on the VPS: release `9b9b5ff59d5901e33e65d610c59fa3b87115f6b1` runs the container and logs its explicit identity-gated disabled state.
- [x] Deploy the private Keycloak issuer/JWKS path, protected client-credentials source, active local `ml_worker` mapping, and image/runtime corrections on Azure; Core Quality Gates run 30 and protected deployment run 15 completed for `d35bebc`.
- [ ] Keep `AGGREGATION_WORKER_ENABLED=false` until a bounded synthetic queue and authenticated descriptor-only callback exercise is designed and verified; only that separate proof can justify a temporary explicit enablement.

## Azure Test Workload Identity

- [x] Define and deploy a private test-only Keycloak issuer/JWKS path within the Azure Core topology; no identity-management interface is public and it is not a production human-auth provider.
- [x] Register an active local `ml_worker` workload identity from the private client-credentials subject, with the callback audience and `workload_kind` claim mapper required by the Core callback guard.
- [x] Provision the worker’s protected client-credentials token path and gate worker startup on successful identity bootstrap; the worker remains explicitly disabled after start.
- [ ] Enable queue consumption only for a bounded synthetic test and verify an authenticated descriptor-only callback before treating the worker as operational.

## Verified Azure Private Workload-Identity Rollout

- [x] Repair release-helper drift by synchronizing the committed activation script before every SSH release activation; the helper self-provisions the protected test client-secret file when absent and exports it to Compose without placing its value in source control or the public ledger.
- [x] Repair the Node image to include the one-shot workload bootstrap, make the PostgreSQL client a direct root runtime dependency, and repair the Python image file permissions so the non-root worker can import its package.
- [x] Repair the PostgreSQL type inference issue in the test bootstrap organization query; bootstrap logs now confirm the active mapping.
- [x] Verify Azure release `d35bebca16e7ef50e691c76e074cbdbd957359ab`: Keycloak and API are healthy, bootstrap exited successfully, `ml_worker|active` is present in PostgreSQL, the worker logs its disabled safety gate, and public `/health/live` and `/health/ready` both return HTTP 200.
- [ ] Add a bounded end-to-end synthetic aggregation/callback exercise before any worker enablement or operational claim.

## Redis Sentinel Revalidation on Azure

- [x] Run the disposable, isolated Redis primary/replica/Sentinel topology on the resized Azure VPS without altering the live Core Redis container or its persisted state.
- [x] Confirm initial master recognition at the disposable primary and two healthy replicas before a controlled primary loss.
- [x] Record the bounded failover outcome: all Sentinels reached objective down detection, but repeated Sentinel `+tilt` intervals and `-failover-abort-no-good-slave` prevented a replacement-primary election.
- [x] Remove all disposable validation containers, network, and volumes; confirm the live Core Redis container remains healthy.
- [x] Keep the Core on its direct Redis URL for the Azure test environment. Do not introduce Sentinel-aware application connections until a stable, repeatable promotion is proven in an isolated topology.
- [ ] Investigate the recurring Sentinel tilt/no-good-slave behavior in a future dedicated resilience pass before considering Redis Sentinel as a Core availability dependency.
- [ ] Configure Docker build/start settings, health/readiness checks, non-secret configuration validation, and explicit separation from the existing Azure test deployment for each Render service.
- [ ] Update the Render GitHub App installation to grant access only to `hstu-research/federated-aggregator-core`, then revalidate the separate API service’s `main` branch and tested `infra/deploy/Dockerfile.node` build path.
- [x] Stage the API service’s protected runtime variables in Render, including explicit test-only OIDC placeholders; Render masks variable values in the service form, and the selected Starter instance requires active Render billing before service creation can complete.
- [x] Configure the staged API service with `/health/ready`, Docker command `node apps/api/dist/main.js`, and a pre-deploy compiled migration command; no persistent disk or registry credential is configured.
- [ ] Complete Render’s final free-tier service-form validation and create the API; free-tier controls cleared the pre-deploy migration field, so migrations must be run separately through the approved database path.
- [x] Receive protected Neon PostgreSQL, Upstash Redis, and Cloudflare R2-compatible storage configuration for Render service settings; never copy these values into source control, the ledger, browser evidence, or deploy logs.
- [ ] Configure the Render services with the supplied protected PostgreSQL, Redis, and Cloudflare R2 variables, using test-only placeholder OIDC values until the human identity provider is selected and configured.
- [ ] Select and configure a real OIDC issuer, audience, and JWKS endpoint before any authenticated user, hospital, or release-management workflow is enabled on Render.
- [ ] Deploy and verify the Render HTTPS API and private worker topology without exposing database, Redis, storage credentials, worker callbacks, telemetry, or management ports.
