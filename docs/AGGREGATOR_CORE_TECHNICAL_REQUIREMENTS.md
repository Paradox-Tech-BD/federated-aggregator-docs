# Aggregator Core: Technical Requirements Analysis

**Status:** Draft for architecture gate 2.  
**Product scope:** Central federated-learning aggregator and administrator/research portal.  
**Preferred implementation split:** Node.js/TypeScript control plane; Python machine-learning worker plane.

## Technical position

The product should use a **modular Node.js/TypeScript control plane** for identities, authorization, protocol definitions, round lifecycle, update intake, validation records, audit, release approval, API contracts, and administration. A separate **Python ML worker plane** should own model loading, local-training simulation, FedAvg/FedProx execution, tensor validation, evaluation, checkpoint generation, and ML-specific metadata.

This is a boundary of responsibility, not an excuse for immediate microservice sprawl. The initial runtime should be a modular NestJS application with a separately deployable Python worker. NestJS supports both request-response and event-based communication over interchangeable transports, while Flower is designed to bring existing Python ML workloads into federated settings using strategy abstractions.[1] [2] The system should therefore start with explicit contracts and only introduce transport complexity when the controlled multi-worker workflow proves it necessary.

> The control plane decides **whether** an aggregation may occur. The Python worker decides **how** compatible tensors are aggregated under the declared algorithm.

## Reference architecture

| Plane | Technology direction | Owns | Must not own |
|---|---|---|---|
| Control plane | Node.js, TypeScript, NestJS, OpenAPI | Human and workload identity, role checks, round state, protocol, manifest validation, audit, release approval, database transactions, admin API | PyTorch tensors, optimizer state, client-side FedProx loss, clinical inference |
| ML worker plane | Python, PyTorch, FastAPI/gRPC boundary, optional Flower strategy adapter | Training/evaluation jobs, algorithm execution, numerical validation, artifact creation, model metadata extraction, metrics computation | User accounts, role policy, release approval, business-state mutation |
| Persistence plane | PostgreSQL plus object storage | Transactional domain records, append-only audit, immutable artifact references, migration history | Raw hospital images or training datasets |
| Integration plane | OpenAPI for synchronous requests; versioned event envelopes for long-running work | Command acceptance, job progress, result reporting, correlation, retries, idempotency | Undocumented direct database writes between services |
| Documentation plane | Static documentation, OpenAPI reference, decision ledger | Contracts, operating model, evidence status, research log, architecture decisions | Live production administration by default |

## Required components

### A. Node.js/TypeScript control plane

The first runtime repository should be **`paradox-tech-bd/federated-aggregator-core`**. It should use NestJS as a modular monolith, not a collection of separately deployed Node services. The control plane must expose a versioned REST API with an OpenAPI document generated and checked in CI. The documentation product consumes the checked-in OpenAPI contract, while the runtime treats the same contract as a release artifact.

The control plane must provide the following logical modules.

| Module | Required responsibility | Phase-1 decision |
|---|---|---|
| Identity and access | Authenticate users and workload clients; enforce role and site scope | Use external OIDC-compatible identity provider for humans; workload credentials are distinct from human sessions |
| Federation registry | Register institutions, participants, allowed architectures, and status | Keep a participant lifecycle with active, paused, withdrawn, and suspended states |
| Protocol registry | Version declared algorithm, model architecture, preprocessing, metric schema, privacy options, and release criteria | A round references an immutable protocol version; it cannot silently change mid-round |
| Round orchestration | Create, open, close, cancel, and recover rounds | Existing state-machine concept is reusable, but persistence and authorization must be rewritten |
| Update intake | Accept only manifests and artifact references, then create a validation record | Never proxy or persist raw images; use signed artifact upload paths rather than loading weights through the API server |
| Validation and quarantine | Record compatibility, integrity, duplicate, deadline, and policy decisions | Quarantine is a first-class state with a reason and resolution path |
| Job orchestration | Request a Python ML job and track execution | The control plane generates an immutable command; worker result is validated before domain state changes |
| Model registry and release | Maintain candidate/release lineage, approval, publication, deprecation, and rollback | Publishing requires a human approval record and a release bundle |
| Audit and evidence | Persist actor, timestamp, request/correlation ID, decision, reason, and object version | Domain audit is append-only; application logs do not substitute for it |
| Administration API | Support the future portal and integration scripts | API authorization is policy-based, not merely hidden UI controls |

### B. Python ML worker plane

The worker plane should begin as a dedicated Python package and service, **`federated-ml-worker`**, within the core program. It should use PyTorch and preserve the existing clean-room `federated_core.py` as a reference-tested library. The worker can add a Flower strategy adapter after the first end-to-end simulations pass, but Flower must not be treated as the system’s governance or model-registry layer.[2]

The worker must accept only a declared `AggregationJob` command with a protocol ID, verified artifact descriptors, architecture ID, algorithm configuration, and correlation ID. It must return a deterministic `AggregationResult` or `JobFailure` event. It must not write directly into the control-plane database.

FedProx is specifically a **local-training behavior**: the client worker computes the proximal term against the received global state. The aggregation worker receives compatible update artifacts and performs server-side sample-weighted aggregation according to the declared policy. The runtime must record `mu`, local epochs, optimizer configuration, base model version, and update schema in every manifest; it cannot infer FedProx merely from a server-side averaging call.[3]

### C. PostgreSQL and object storage

PostgreSQL should be the authoritative store for domain state. It should contain users/references, roles, sites, participants, protocol versions, rounds, submissions, validation outcomes, aggregation jobs, model versions, releases, approvals, audit events, and outbox events. The first version should choose a migration-first TypeScript ORM/query layer—**Drizzle ORM is preferred for explicit SQL and transparent migrations**—but domain logic must not be hidden inside ORM hooks.

Large model checkpoints, metrics bundles, and release packages belong in S3-compatible object storage. MinIO is appropriate for local development; a managed S3-compatible service can be selected later. Every artifact record must include content type, size, SHA-256, producer version, storage key, provenance, and retention policy. A URI alone is not evidence of integrity.

### D. Inter-service contract

The first integration is intentionally simple: the NestJS control plane sends an authenticated command to the Python worker over HTTPS in local development, then receives a signed result callback. The command and callback payloads are versioned JSON schemas. This establishes testable ownership without prematurely operating a message broker.

For multi-worker or long-running production operations, evolve the same contract to event delivery through **NATS JetStream** with an outbox relay. The choice is deferred until phase-1 load and recovery requirements are measured. No workflow may depend on an in-memory queue or process-local map after the first persistent slice.

| Contract property | Requirement |
|---|---|
| Versioning | Every command/event has `schema_version`, `event_type`, and compatibility policy |
| Identity | Sender and receiver have distinct workload identities; no shared administrator token |
| Correlation | Every request, job, artifact, audit record, and callback carries a correlation ID |
| Idempotency | Intake, job dispatch, and release publication accept idempotency keys and prevent duplicate side effects |
| Immutability | Submitted manifests and completed worker results are immutable; corrections are new versions/events |
| Time boundaries | Commands include issued-at, expiry, deadline, and round/protocol version constraints |
| Failure behavior | Worker failures are explicit results; timeouts do not silently advance round state |

## Technical requirements by quality attribute

| Quality attribute | Requirement | Verification evidence |
|---|---|---|
| Correctness | Only compatible, finite, checksum-verified artifacts reach aggregation | Unit tests, contract tests, adversarial manifest fixtures, worker validation reports |
| Determinism | Same declared inputs and fixed seed produce the same reference output where algorithmically feasible | Re-run comparison, artifact digest, environment manifest |
| Security | Role/scope checks, short-lived sessions, workload separation, signed artifact access, redacted logs | Threat-model review, negative authorization tests, secret scan |
| Privacy boundary | Control plane never stores raw images, patient identifiers, or local training datasets | Schema checks, integration tests, storage policy, audit samples |
| Availability and recovery | A worker failure or restart cannot create a false release or lose a state transition | Transaction/outbox tests, retry and cancellation tests, recovery rehearsal |
| Auditability | Every consequential decision can be reconstructed from durable records | Exportable audit trace for a test round |
| Observability | Human-readable dashboard plus correlation-linked metrics, structured logs, and traces | Controlled failure scenario with an operator recovery runbook |
| Maintainability | Public contracts, domain modules, migrations, typed clients, and test fixtures are versioned | CI contract checks, architecture decision records, code ownership review |
| Reproducibility | Each result links code revision, protocol, artifact inputs, environment, and seed | Evidence package attached to every candidate/release |

## API and data requirements

The external API should use resource-oriented, versioned paths. Examples include `POST /api/v1/protocols`, `POST /api/v1/rounds`, `POST /api/v1/rounds/{id}/submissions`, `GET /api/v1/rounds/{id}`, `POST /api/v1/aggregation-jobs/{id}/result`, and `POST /api/v1/releases/{id}/approve`. The API must use pagination, stable error envelopes, request IDs, idempotency keys for writes, and machine-readable reason codes.

The following identity and authorization roles are required at minimum: **platform administrator**, **research administrator**, **site administrator**, **site workload**, **auditor**, and **read-only researcher**. A user’s role is insufficient without scope: a site administrator must not control another site’s submission or view sensitive operational details that are not part of the agreed federation view. Standard authentication and REST-security guidance should shape session, token, rate-limit, and API error requirements.[4] [5] [6]

## Build, reuse, and defer assessment

| Earlier component | Current decision | Rationale |
|---|---|---|
| Express aggregator state machine | **Rewrite in NestJS; reuse transition concepts and test cases** | The existing in-memory `Map` and unauthenticated endpoints are valuable prototypes, but not durable domain services |
| In-memory coordination adapter | **Reuse interface; replace implementation** | The model-version identifier and checksum policy are useful; persistence, approval, artifact retention, and rollback need a real registry |
| Python `federated_core.py` | **Reuse and extend as reference library** | It has tested sample-weighted aggregation, finite checks, integer-buffer policy, and FedProx loss primitives; production needs artifact I/O, declared BatchNorm policy, device controls, and result envelopes |
| Deterministic two-site experiment/matrix | **Reuse as software-verification fixture** | It validates the pipeline only; it must not become a breast-cancer performance claim |
| Hospital/admin services and UIs | **Defer from this product** | The current product boundary is aggregator core plus future admin portal; hospital products will become separate repositories when their requirements are approved |
| Solidity registry scaffold | **Defer behind coordination adapter** | No blockchain runtime until the central audited workflow and its governance claims are tested without it |
| OpenAPI documentation site | **Reuse and extend** | It is the decision ledger and API-contract surface; generated reference must later consume the runtime OpenAPI artifact |

## Explicitly rejected or deferred options

An all-Node.js ML stack is rejected because the research stack, PyTorch ecosystem, existing tested FL reference, and future Flower compatibility are Python-native. An all-Python backend is rejected because TypeScript is preferred for the governance-heavy control plane, administrator-facing API, contract generation, and future portal integration.

Immediate Kubernetes, blockchain-backed release enforcement, multi-region deployment, full hospital integration, direct database access by the ML worker, and unrestricted “try it out” API documentation are deferred. They add operational surface before the controlled core workflow has been validated.

## Architecture gate 2: decisions required before implementation

1. Confirm **NestJS + TypeScript** for the control plane and **PyTorch + Python** for ML workers.
2. Confirm a modular monolith for the first Node.js runtime, with no early split into independent control-plane microservices.
3. Confirm PostgreSQL for domain state and S3-compatible storage for model artifacts.
4. Confirm external OIDC-compatible identity for humans and separate workload credentials for sites/workers.
5. Confirm HTTP plus versioned schemas for the first Node↔Python workflow; NATS JetStream remains a measured later upgrade.
6. Confirm the existing Python reference library is a reusable baseline, while in-memory Express and coordination prototypes are rewritten/replaced.
7. Confirm BatchNorm behavior is a formal protocol decision to test on the production vision architecture before real experiments.

## References

[1] NestJS, [*Microservices*](https://docs.nestjs.com/microservices/basics).

[2] Flower, [*Flower Framework documentation*](https://flower.ai/docs/framework/index.html).

[3] Li et al., [*Federated Optimization in Heterogeneous Networks*](https://proceedings.mlsys.org/paper/2020/hash/1f5fe83998a09396ebe6477d9475ba0c-Abstract.html), MLSys, 2020.

[4] OWASP, [*Authentication Cheat Sheet*](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

[5] OWASP, [*Session Management Cheat Sheet*](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

[6] OWASP, [*REST Security Cheat Sheet*](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html).
