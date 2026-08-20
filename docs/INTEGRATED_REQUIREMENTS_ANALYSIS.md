# Full Integrated Requirements Analysis: Federated Aggregator Core

**Status:** Draft for product and architecture approval.  
**Product:** Federated Aggregator Core, with a future administrator portal.  
**Primary research context:** Federated breast-cancer model development across independent hospital sites.  
**Core promise:** The aggregator coordinates a governed model-update and model-release process without collecting raw hospital images, local training datasets, or patient identifiers.

## 0. Why this document exists

This is the primary requirements document for the aggregator product. It deliberately connects the **textual requirements**—research objective, stakeholder value, governance, adoption, risk, and evidence standards—with the **technical requirements**—identity, API, queue, worker, artifact, database, release ledger, and test requirements. It replaces the earlier shallow separation between a business/research summary and a technical overview.

The product is not defined by the existence of federated averaging alone. It must allow multiple institutions to contribute to a controlled research process, explain why an update was included or excluded, preserve model lineage, make release decisions reviewable, and prevent a prototype metric from being presented as a clinically validated finding. Healthcare federated-learning research remains largely prototype-oriented, while governance mechanisms tailored to federated learning remain limited.[1] [2]

## 1. Scope, boundaries, and non-goals

The core product is a **model-release control plane**. It registers participating sites, records immutable experiment protocols, opens and controls rounds, accepts verifiable update manifests, dispatches aggregation jobs, records candidate models, and publishes only approved releases.

| In scope | Out of scope for the core product | Why the boundary matters |
|---|---|---|
| Federation and participant administration | Hospital-facing clinical application | Hospital workflows require separate requirements, data governance, and UX research |
| Protocol, round, submission, and release governance | Raw-image upload, patient management, diagnosis, or clinical decision support | The core must not become a clinical system by accident |
| Weight/metrics artifacts and model lineage | Direct training-data access | Data locality is a central federation principle |
| FedAvg and FedProx-compatible aggregation jobs | Claiming FedProx automatically improves performance | Algorithm benefit must be measured under a controlled protocol |
| Research evidence, audit, export, and model release | Blockchain/IPFS as a mandatory first dependency | The audited central workflow must be proven before external coordination layers add complexity |

## 2. Technology position and traceability

| Requirement driver | System decision | Why it answers the driver |
|---|---|---|
| Research governance needs explicit human accountability | NestJS/TypeScript control plane owns policy, approvals, and audit | ML jobs cannot silently publish or alter business state |
| Existing FL experimentation is Python/PyTorch based | Python/PyTorch worker owns numerical validation and aggregation | Reuses the strongest existing scientific implementation surface |
| Model artifacts are large and need integrity evidence | S3-compatible object storage with immutable digest manifest | PostgreSQL stores accountable metadata, not model binaries |
| Rounds and validation are long-running/retryable | BullMQ + Redis control-job queue | Request handling stays short; failed work has defined recovery |
| Institutions and workloads differ from human operators | OIDC for humans, separate workload credentials for sites/workers | Browser sessions cannot be used as machine identities |
| Research outcomes require reconstruction | PostgreSQL model-release and audit ledgers are append-only | A later release, rejection, or rollback cannot erase prior evidence |

The stack is intentionally proposed, not assumed final: OIDC-compatible identity, NestJS/TypeScript, PostgreSQL, S3-compatible storage, BullMQ/Redis, Python/PyTorch, OpenAPI, and a later optional Flower adapter. Flower can help place Python workloads into a federated setting, but does not replace participant governance, artifact policy, release approval, or the evidence ledger.[3]

## 3. Stakeholders, roles, and required outcomes

| Stakeholder | Job to be done | Required outcome | Explicit protection |
|---|---|---|---|
| Research sponsor | Establish an academically defensible multi-site program | Sees protocol, evidence status, progress, and unresolved risks | No unqualified performance or clinical claims |
| Research administrator | Run a round and make an accountable release decision | Can create/close/cancel rounds, inspect submissions, resolve exceptions, and approve/reject release | No silent state changes or ambiguous ownership |
| Site administrator | Represent a participating hospital’s agreed involvement | Can activate/pause/withdraw the site workload and view its own receipts | Cannot see other sites’ private operational details by default |
| Site workload | Submit a local update under a declared protocol | Receives scoped upload intent, validation result, and permitted release access | Cannot impersonate a human administrator |
| ML operator | Investigate failed jobs and reproduce a candidate | Sees immutable commands, inputs, environment, warnings, and outputs | Cannot approve a release unless separately authorized |
| Auditor or thesis reviewer | Reconstruct a decision and scientific claim | Can trace protocol → round → submissions → job → candidate → approval/release | Exports are scoped and privacy-redacted |
| Future model consumer | Evaluate a released model locally | Receives model card, protocol, lineage, compatibility, limits, and release status | No implication of clinical suitability |

## 4. Governance, membership, and protocol requirements

Before any technical round is opened, a federation must have a purpose statement, owner organization, participant agreement, named release authority, withdrawal policy, artifact retention policy, and a declared evidence standard. A participant may be active, paused, withdrawn, or suspended. Withdrawal means the site cannot receive future invitations or submit new updates; it does not retroactively erase evidence already used in a completed release without an explicit governance decision.

Every scientific/operational protocol is versioned and immutable once a round references it. A protocol records model architecture, preprocessing declaration, label/task definition, training objective, algorithm (`fedavg` or `fedprox`), FedProx `mu`, local epochs, batch size, optimizer and learning rate, expected artifact schema, allowed participant count, aggregation threshold, BatchNorm policy, metric definitions, release criteria, and code/environment compatibility. A changed protocol means a new version and usually a new round—not an edit to history.

## 5. Identity, authentication, and authorization requirements

The identity provider has one responsibility: authenticate a human and issue a signed token. The NestJS control plane verifies the token, resolves the caller’s application membership and scope from PostgreSQL, and makes all authorization decisions. The application does not rely on hidden UI buttons or a provider’s optional custom role claims.

| Request stage | Required behavior | Failure behavior |
|---|---|---|
| Context | Create/accept correlation ID and validate request headers | Reject malformed request before domain handling |
| Credential verification | Verify human JWT or workload credential | Return a neutral authentication failure; never disclose account state |
| Hydration | Load role, organization, federation memberships, workload status, and revocation | Deny unknown, suspended, expired, or out-of-scope principal |
| Policy guard | Verify action + federation + round + organization scope | Deny cross-site or unauthorized release action by default |
| Idempotency | Bind write request to principal, route, key, and request hash | Return prior response or reject mismatched reuse |
| Abuse controls | Apply payload, rate, and storage-intent limits | Throttle or reject without advancing state |
| Audit context | Carry actor, request, correlation, and policy decision to domain event | Record security-relevant denials at an appropriate redaction level |

Human roles are `platform_admin`, `research_admin`, `site_admin`, `auditor`, and `research_reader`. Workloads are `site_workload` and `ml_worker`. A human release approver is a separate authorization capability that can be attached to a research administrator but must be auditable.

## 6. Participant onboarding and update-artifact workflow

The central service must never ask a site to upload raw patient data. A site workload first requests a short-lived upload intent for a specific permitted round. The core validates that the workload is active, is part of the federation, is invited to the round, and is using the declared protocol and architecture. It returns a constrained object-storage upload target.

The site uploads a checkpoint/weight artifact and a metrics artifact directly to object storage. It then posts a compact manifest: round ID, protocol version, architecture ID, base global-model version, sample count, model/metrics storage keys, SHA-256 digest, file size, local training parameters, local metrics, declared FedProx `mu`, local epochs, environment version, and local timestamp. No manifest field may contain direct patient identifiers or raw imaging paths.

The backend records the submission as `pending_validation`. A Node verification job checks storage existence, size, digest, content type, storage policy, deadline, duplicate request, and base-model lineage. A Python ML validation job checks state-dict keys, shapes, dtypes, finite tensors, and protocol/architecture compatibility. The result is `accepted`, `quarantined`, `rejected`, or `expired`, always with a reason code and an audit event.

## 7. Round lifecycle, exception handling, and release workflow

| State | Entry condition | Allowed actions | Exit condition |
|---|---|---|---|
| `draft` | Protocol and base model selected | edit permitted configuration; choose participants | administrator opens or cancels |
| `open` | Invitations visible | sites request upload intent | first valid intent/submission or cancellation |
| `collecting` | At least one active submission path | submit, validate, quarantine, pause site, extend deadline | threshold met, deadline reached, or cancellation |
| `validating` | Intake closed or threshold reached | resolve validation/quarantine evidence | required candidate set ready or failure/cancellation |
| `aggregating` | Immutable accepted-update list locked | dispatch/retry/cancel aggregation job | candidate result or terminal job failure |
| `evaluating` | Candidate artifact available | run declared evaluation and attach evidence | release criteria assessed |
| `awaiting_approval` | Evidence package complete | approve, reject, request re-evaluation | approval/rejection/cancellation |
| `published` | Authorized approval recorded | distribute release, monitor, deprecate, rollback | release superseded, deprecated, or rolled back |
| `failed` / `cancelled` | Explicit terminal decision | export evidence and create a new round if appropriate | terminal |

Exception handling is a product requirement. A late submission, checksum mismatch, unknown architecture, conflicting base model, failed evaluation, worker timeout, or participant withdrawal must display its impact, reason, owner, recovery choices, and audit trail. The system must not silently exclude a site or silently retry an aggregation that has produced an ambiguous side effect.

## 8. Job orchestration and Node.js ↔ Python worker contract

BullMQ/Redis supports durable control work; the Python worker does not directly mutate the Node.js domain database. The Node dispatcher submits a versioned, authenticated aggregation command to the worker; the worker sends a signed result callback. This boundary allows retries and testing without sharing business-state ownership.

| Queue | Input | Action | Success state | Terminal failure behavior |
|---|---|---|---|---|
| `aggregator:artifact-verify` | submission/manifest | Validate object integrity and policy | accepted or ML validation scheduled | quarantine with reason |
| `aggregator:ml-validate` | artifact descriptor + protocol | Check tensor and architecture compatibility | accepted | quarantine with numerical/compatibility reason |
| `aggregator:aggregate` | locked accepted-update set | Dispatch `AggregationJob` to Python | candidate artifact/result | round remains failed/recoverable; no candidate published |
| `aggregator:evaluate` | candidate + evaluation plan | Produce declared metrics/evidence bundle | awaiting approval | candidate blocked pending recovery/rejection |
| `aggregator:release-publish` | human approval + candidate | Assemble immutable release package and ledger event | published | approval remains recorded; publication failure visible/retryable |
| `aggregator:outbox` | transactional event | Notify portal/integration without coupling request transaction | delivered | retry then dead-letter and operator alert |

Each job is `queued → running → succeeded | retrying | failed | cancelled`. Retries are capped and exponential for transient errors only. Every command/result contains a schema version, job ID, correlation ID, input artifact identifiers/digests, protocol/round IDs, code version, deterministic-seed policy, deadline, and idempotency key.

## 9. Scientific and machine-learning requirements

FedAvg is the baseline aggregation policy. FedProx is a local-client training variant: the local objective adds a proximal penalty against the received global model. The aggregator records the declared `mu` and ensures submissions are compatible with the protocol, but it must not claim that server-side weight averaging itself is FedProx.[4]

| Requirement | Reason | Required evidence |
|---|---|---|
| Production model architecture is declared before the round | Prevents a mix of incompatible updates | Architecture ID, state-dict schema, model card |
| BatchNorm handling is an explicit testable policy | Naive state-dict averaging can corrupt non-trainable buffers | Unit/integration test on actual vision architecture and selected policy |
| Site-level and global metrics are kept distinct | A single pooled metric can hide harmful site variation | Metrics schema with source and aggregation labels |
| Local epoch and `mu` sensitivity is pre-declared | Prevents post-hoc hyperparameter storytelling | Protocol matrix and experiment run records |
| Reproducibility bundle accompanies every candidate | Research claims require code, data manifest, config, seed, and environment | Immutable evidence artifact referenced by candidate/release |
| Negative outcomes are retained | A neutral or failed FedProx comparison is evidence when reproducible | Failed/rejected run log and reasoned interpretation |

The existing Python `federated_core.py` is reusable only as a reference-tested library. It must be extended for artifact I/O, structured results, the selected BatchNorm policy, actual vision-model validation, device control, and reproducibility manifests. The earlier two-site matrix is software verification, not breast-cancer evidence.

## 10. Model registry, release ledger, and evidence package

`model_versions` materializes the current candidate/release state; `model_release_events` is append-only and records `candidate_created`, `evaluation_attached`, `approved`, `published`, `deprecated`, `rolled_back`, and `rejected`. No user may overwrite a release outcome. A corrected release is a new event and possibly a new model version.

A release package must include: global artifact and SHA-256, base model lineage, protocol version, accepted and excluded submission IDs/reasons, aggregation job output, evaluation bundle, metric definitions, model card, compatibility statement, known limits, approver identity, approval reason, release notes, software/environment version, and rollback pointer. Publication for research use is distinct from clinical readiness and thesis validation.

## 11. Persistence, artifact storage, and data model

PostgreSQL is authoritative for users, organizations, memberships, workloads, federations, participants, protocol versions, rounds, submissions, validation outcomes, aggregation jobs, artifacts, model versions, release events, audit events, outbox events, and idempotency records. Object storage holds weights, metrics bundles, manifests, and release packages only. Storage object keys must be opaque, versioned, scoped, and checksum-backed.

| Data class | System of record | Retention principle | Prohibited content |
|---|---|---|---|
| Identity/membership | PostgreSQL | Retain according to agreement and access policy | Plaintext passwords or unrelated clinical data |
| Protocol/round/release | PostgreSQL + audit ledger | Preserve scientific lineage and decision history | Silent edits to referenced protocol versions |
| Model/metrics artifacts | S3-compatible storage + PostgreSQL manifest | Retain per research/withdrawal agreement; delete through a recorded policy action | Raw images, patient identifiers, local dataset copies |
| Logs/traces | Central redacted observability store | Shorter operational retention with audit linkage | Raw model weights, secrets, authorization headers |

## 12. Security, privacy, and operational requirements

Federated learning reduces the need to move raw data, but it does not remove update-leakage, poisoning, model-extraction, misuse, access-control, or bias risks. The product must make this limitation explicit. Healthcare governance literature calls out ongoing privacy, ethics, misuse, and harm concerns even where federated approaches reduce data-sharing barriers.[1]

Security requirements include least-privilege roles, separate human/workload identities, short-lived scoped upload intents, digest verification, encrypted transport, secrets outside source control, append-only audit, rate limits, request-size limits, dependency scanning, and administrator action confirmation. The first threat model must include malicious/compromised site workload, altered artifact, replayed callback, unauthorized release attempt, lost worker credential, database compromise, and misleading research claim.

Operational requirements include health endpoints, structured logs, correlation IDs, queue depth/failure metrics, worker duration, validation rejection reason counts, audit-export monitoring, storage-integrity alerts, and a runbook for round cancellation, stuck jobs, quarantine resolution, release rollback, and credential revocation. A failed worker must not publish a model or silently advance a round.

## 13. API, documentation, and portal requirements

The API is versioned under `/api/v1`, uses OpenAPI 3.1, and treats schemas as release artifacts. Every write uses idempotency keys. Error responses are machine-readable and carry a non-sensitive reason code and correlation ID. Public documentation defaults to mock/local request examples; interactive production release actions must require explicit configured credentials and confirmation.

The documentation site is a required system component, not marketing material. Every product decision, protocol change, research finding, failed run, revised risk, or implementation milestone is added to the ledger. The administrator portal is a separate client over the same authenticated API; it cannot bypass server-side policy.

## 14. Testing, evaluation, and acceptance requirements

The first acceptance standard is not accuracy. It is a controlled end-to-end proof that a simulated multi-site round can be created; authorize two or more site workloads; submit valid and invalid manifests; quarantine an invalid update; aggregate only accepted updates; create a candidate; attach an evaluation bundle; require approval; publish a release; and reconstruct the complete audit/evidence path.

| Test layer | Must prove |
|---|---|
| Unit | State transitions, policy guards, idempotency, checksum/manifest validation, FedAvg/FedProx primitives, BatchNorm policy |
| Contract | Node command and Python result schemas remain compatible and versioned |
| Integration | PostgreSQL/object storage/Redis/worker complete the artifact → candidate → approval workflow |
| Security | Cross-site access denial, expired credential, replay, altered checksum, unauthorized release, redacted error/log behavior |
| Resilience | Worker timeout/retry/cancel cannot create duplicate candidate or release |
| Scientific software verification | Fixed-seed reference scenario produces expected reproducible output |
| Dataset experiment | Patient/group-aware split, data manifest, protocol, metrics, and code version are linked before thesis claims |

## 15. Decision gates before implementation

1. Approve the core product boundary: research model-release control plane, not a hospital clinical platform.
2. Approve the chosen stack: OIDC, NestJS/TypeScript, PostgreSQL, S3-compatible storage, BullMQ/Redis, Python/PyTorch, OpenAPI.
3. Approve identity separation: human JWTs versus scoped site/worker workload credentials.
4. Approve the manifest-first artifact policy and prohibition on raw-image/data intake.
5. Approve the round/release state machine and the required human approval for publication.
6. Approve that FedProx is local optimization and that BatchNorm, local epoch, `mu`, and site heterogeneity remain testable protocol choices.
7. Approve the evidence standard: no breast-cancer performance claim without a linked dataset manifest, split procedure, protocol, code revision, metrics, and review status.

## References

[1] Eden et al., [*A scoping review of the governance of federated learning in healthcare*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12246253/), *npj Digital Medicine*, 2025.

[2] Teo et al., [*Federated machine learning in healthcare: A systematic review on clinical applications and technical architecture*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10897620/), *Cell Reports Medicine*, 2024.

[3] Flower, [*Flower Framework documentation*](https://flower.ai/docs/framework/index.html).

[4] Li et al., [*Federated Optimization in Heterogeneous Networks*](https://proceedings.mlsys.org/paper/2020/hash/1f5fe83998a09396ebe6477d9475ba0c-Abstract.html), MLSys, 2020.
