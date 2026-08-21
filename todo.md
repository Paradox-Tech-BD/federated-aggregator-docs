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
