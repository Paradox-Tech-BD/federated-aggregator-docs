# Core — Hospital Node Workload Contract Design

**Status:** Additive Core lease boundary implemented and bounded Azure lease proof validated; artifact capability and submission boundaries remain proposed.
**Decision date:** 22 August 2026  
**Depends on:** the public Hospital Node Agent dossier and the current Core artifact, workload-identity, aggregation, and audit boundaries.

## 1. Decision and non-negotiable boundary

The Core will add a **distinct `hospital_node` workload API** for assigned local training. It will not repurpose the human artifact-intent/round routes or the internal `ml_worker` aggregation-result callback. A node receives a round-scoped immutable command, short-lived read/upload capabilities, and submits a descriptor only. The Core remains authority for federation eligibility, protocol, round lifecycle, artifact verification, aggregation, candidate, release, and audit.

> The Core receives no raw image, patient identifier, local path, free-form local log, token, storage credential, model/update byte stream in an HTTP body, or editable local training configuration.

The proposed contract preserves already-existing Core facts: `hospital_node` is already a distinct workload kind alongside `ml_worker`; federation participation relates a workload to a federation; and `model_update_archive` is already an artifact category. The current routes, however, are still not node-usable because their guards/audience/policy remain human-only or `ml_worker`-only. [1] [2]

## 2. Required Core additions

| Concern | Additive design | Explicit non-design |
|---|---|---|
| OIDC audience | New audience **`fedagg-hospital-node`** accepted only by a dedicated `HospitalNodeAuthGuard`. | Reusing the `fedagg-worker-callback` audience or `ml_worker` principal. |
| Principal policy | Require active workload, `workloadKind = hospital_node`, matching organization, active federation participant, assigned open round, and unexpired lease. | Treating a workload as a human membership or granting federation-wide access from a token alone. |
| Assignment | Core-created one-assignment-per-round-participant projection with immutable command digest and deadline. | A node selecting a round, algorithm, model, local epochs, or release. |
| Object transfer | Core service creates existing descriptor-only artifact/upload-intent records after a valid lease. Direct object transfer uses a short-lived capability outside the Core API body. | Returning an object key, long-lived storage credential, or model/update byte stream from a Core route. |
| Submission | Node submits assignment ID, command digest, artifact descriptor, safe summary, and idempotency key. Core verifies exact assignment, verified artifact, checksum, size, and round state. | Allowing an unverified upload, a stale command, or a duplicate submission to affect aggregation twice. |
| Incompatibility | Node may write one allowlisted terminal code with safe environment category. | Patient-data diagnostics, raw Python exception text, dataset paths, or automatic round cancellation. |

## 3. Additive persistence model

The existing `federation_participants`, `rounds`, `artifacts`, `upload_intents`, aggregation job, outbox, round-event, and audit structures remain authoritative. The new tables link to them; they do not duplicate protocol, artifact bytes, object locators, human memberships, or OIDC secrets.

```mermaid
erDiagram
  FEDERATION_PARTICIPANT ||--o{ HOSPITAL_NODE_ASSIGNMENT : receives
  ROUNDS ||--o{ HOSPITAL_NODE_ASSIGNMENT : scopes
  WORKLOADS ||--o{ HOSPITAL_NODE_ASSIGNMENT : owns
  HOSPITAL_NODE_ASSIGNMENT ||--o{ HOSPITAL_NODE_LEASE : permits
  HOSPITAL_NODE_ASSIGNMENT ||--o| HOSPITAL_NODE_SUBMISSION : reconciles
  HOSPITAL_NODE_SUBMISSION }o--|| ARTIFACTS : references
  HOSPITAL_NODE_ASSIGNMENT ||--o{ HOSPITAL_NODE_EVENT : audits

  HOSPITAL_NODE_ASSIGNMENT {
    uuid id PK
    uuid round_id FK
    uuid federation_participant_id FK
    uuid workload_id FK
    varchar command_digest
    timestamp deadline_at
    varchar state
  }
  HOSPITAL_NODE_LEASE {
    uuid id PK
    uuid assignment_id FK
    uuid workload_id FK
    varchar idempotency_key
    varchar command_digest
    timestamp expires_at
    varchar state
  }
  HOSPITAL_NODE_SUBMISSION {
    uuid id PK
    uuid assignment_id FK
    uuid artifact_id FK
    varchar idempotency_key
    varchar command_digest
    varchar state
  }
  HOSPITAL_NODE_EVENT {
    uuid id PK
    uuid assignment_id FK
    varchar event_type
    uuid correlation_id
    jsonb safe_details
  }
```

| Table | Core-owned fields | Critical constraints |
|---|---|---|
| `hospital_node_assignments` | round, participant, workload, immutable command digest, deadline, state, correlation ID. | Unique `(round_id, workload_id)`; active participant/workload must match at creation; no command JSON with data/local path fields. |
| `hospital_node_leases` | assignment, workload, idempotency key, command digest, issued/expiry/consumed/revoked state. | Unique `(assignment_id, idempotency_key)`; one active lease per assignment; expiry is enforced transactionally. |
| `hospital_node_submissions` | assignment, artifact ID, command digest, idempotency key, allowlisted summary, submission state. | Unique assignment and idempotency constraints; artifact must belong to assigned organization/round, have category `model_update_archive`, and be verified. |
| `hospital_node_events` | assignment event type, Core correlation ID, allowlisted reason/environment category, timestamp. | Append-only; safe-detail schema rejects unknown keys and all text blobs. |

## 4. Lifecycle and transaction rules

```mermaid
stateDiagram-v2
  [*] --> assigned: Core seals eligible round
  assigned --> leased: node has valid workload + idempotency key
  leased --> update_authorized: descriptor intent accepted
  update_authorized --> submitted: verified descriptor + exact command digest
  submitted --> accepted: Core reconciliation accepts one result
  submitted --> rejected: mismatch / closed round / invalid artifact
  assigned --> incompatible: node reports allowlisted terminal reason
  assigned --> expired: deadline passes
  leased --> expired: capability/lease deadline passes
  accepted --> [*]
  rejected --> [*]
  incompatible --> [*]
  expired --> [*]
```

The assignment is created by a Core round service only after a round has the required frozen protocol/base-model facts and the participant’s active `hospital_node` workload is eligible. Leasing must atomically confirm principal, assignment, participant, round, deadline, and idempotency conditions before returning the canonical command. Update intent must atomically bind the new artifact record to the assignment and current lease. Submission must atomically ensure that the artifact is verified, descriptor fields equal the stored expected values, the assignment command digest equals the node-provided digest, and no accepted/terminal duplicate exists. On success it records safe audit/event/outbox evidence; aggregation dispatch proceeds under the existing Core policy rather than from the node itself.

An unknown transport outcome is never treated as permission to retrain or duplicate-submit. The node reuses the idempotency key and the Core returns the prior safe result. A capability/lease expiry is terminal for that capability and may require a new lease only while the assignment deadline and round remain open.

## 5. Proposed HTTP surface

All routes require `HospitalNodeAuthGuard` and the `fedagg-hospital-node` audience. They return no raw model/update bytes, object locator, credential, raw audit details, protected human policy, or other workload’s assignment.

| Route | Request | Safe response | Invariants |
|---|---|---|---|
| `GET /v1/workloads/self/assignments?cursor=` | Cursor only. | Assigned ID, status, expiry/deadline, digest summary, opaque cursor. | Returns only active principal’s eligible assignments. |
| `POST /v1/workload-assignments/:assignmentId/lease` | Idempotency key. | Immutable command; time-bounded **read capability** response. | Exact principal/assignment/workload; canonical command digest; no route chooses training configuration. |
| `POST /v1/workload-assignments/:assignmentId/update-intents` | Lease/idempotency binding; content type; expected checksum and size; manifest digest. | Artifact ID and time-bounded **write capability** response. | Assignment must be leased/open; creates only `model_update_archive`; no storage locator in Core persistent/event response. |
| `POST /v1/workload-assignments/:assignmentId/submissions` | Artifact ID, checksum/size/manifest digest, command digest, bounded training summary, idempotency key. | Accepted/rejected/retry-safe status plus correlation ID. | Verified descriptor, exact assignment binding, exact digest, one terminal result. |
| `POST /v1/workload-assignments/:assignmentId/outcomes` | Allowlisted incompatibility code and bounded environment category; idempotency key. | Recorded terminal safe outcome and correlation ID. | Cannot update an accepted/expired assignment or include arbitrary diagnostics. |

## 6. Command, capability, and submission requirements

The established `hospital-node-command/v1` shape remains the input contract. The Core must calculate its canonical digest itself and return the immutable envelope only after lease authorization. It must reject a node-supplied different digest, unsupported schema, expired command, unknown preprocessing/model digest, non-positive byte count, or a training summary that exceeds protocol policy.

Capabilities are protected response objects rather than database records containing usable storage credentials. Their safe Core evidence contains only assignment ID, operation (`read_base_model` or `write_model_update`), resource digest, expiry, and a non-secret capability ID/digest. The actual transfer mechanism is a provider-issued time-bounded URL/header policy delivered only to the authenticated client; it is never logged, sent to the public docs, or stored in Core SQL.

The summary is an allowlisted object: completed local epochs, policy-approved coarsened sample-count value when enabled, environment fingerprint digest, dataset-declaration digest, and bounded duration/resource category. It has no free text, arrays of metrics, local paths, image/patient fields, host details, raw logs, or update bytes.

## 7. Authorization matrix

| Action | Required principal and state | Must deny |
|---|---|---|
| List or lease | Active `hospital_node`; current assignment workload/organization/participant; assigned and unexpired. | `ml_worker`, human user, inactive workload, another hospital node, expired/terminal assignment. |
| Create update intent | Same active leased hospital node; open round; exact lease/idempotency binding. | Arbitrary artifact intent; other artifact category; stale/consumed lease. |
| Submit update | Same principal; verified bound artifact; open submission state. | Raw bytes, unverified/mismatched artifact, changed command digest, duplicate terminal state, human/ML-worker token. |
| Report incompatibility | Same principal; nonterminal assignment; allowlisted code. | Arbitrary exception string, accepted assignment, another workload’s assignment. |
| Dispatch aggregation | Existing Core-only aggregation policy after valid accepted submissions. | Direct node-triggered aggregation. |

## 8. Required test and evidence sequence

| Layer | Required proof before the next layer |
|---|---|
| Domain/application | Assignment creation eligibility, lease uniqueness, deadline behavior, terminal immutability, digest equality, idempotent submission/outcome semantics. |
| PostgreSQL/migration | Additive migration; organization/participant/workload/round/artifact FK constraints; rollback-safe transaction tests; no secret/locator column. |
| HTTP/auth | New audience only; `hospital_node` kind required; human and `ml_worker` denial; cross-assignment and cross-organization denial; schema/unknown-field rejection. |
| Artifact | Intent binds assignment/lease; descriptor-only response; checksum/byte/manifest mismatch rejection; verified artifact required. |
| Audit/outbox | Safe event schema/snapshot; no capability/URL/token/bytes; exactly one correlation path for accepted/rejected/incompatible results. |
| Node/Core contract | Shared golden commands/submissions; fake Node adapter exercises capabilities and recovery; no new human-route use. |
| Bounded Azure lease proof | One separate `hospital-node-synthetic` client, one generated synthetic workload/assignment and canonical command, one guarded lease, descriptor-only response validation, and immediate assignment/lease expiry. |
| Future artifact/submission Azure proof | Only after the relevant contracts, schema, authority, capability, and reconciliation tests exist: a verified descriptor intent and submission through the new node-only route, with no object locator, credential, bytes, or clinical data exposed. |

## 9. Delivery order and non-claims

1. Add Core domain/application contracts plus additive schema and tests.
2. Add dedicated audience/guard and guarded workload controller with fake storage/identity integration tests.
3. Extend descriptor-intent/verification/reconciliation through the new assignment service only; retain existing human/worker routes unchanged.
4. Use shared Node/Core fixtures and a local simulated node before Azure.
5. Run one bounded Azure synthetic proof only after all contract gates pass; record safe states/digests/IDs, immediately restore default-disabled behavior, and do not describe it as hospital deployment.

This design does **not** authorize a real hospital, clinical trial, real patient data, BreaKHis image transfer, public node endpoint, data-mount on Azure, automatic retry, Redis Sentinel work, blockchain/IPFS, MetaMask/SIWE, or Core release policy change.

## 10. Implementation record — first policy slice

Core commit `79bdcee` implements the first delivery-order item only: shared assignment/lease vocabulary; an explicit Core domain state-transition matrix; a lease-eligibility rule requiring active `hospital_node` kind, active participant, open round, assigned state, and unexpired deadline; an application repository port; and three deterministic application tests. It deliberately has **no** PostgreSQL migration, persistence adapter, Nest controller, OIDC audience/guard, Keycloak client, artifact capability, submission path, Node-to-Core request, or Azure synthetic node.

The full Core suite passed locally with 46 TypeScript tests (including database integration coverage) and 9 Python tests. GitHub Core Quality Gates completed successfully in 1 minute 32 seconds; the protected Azure deployment also completed successfully for `79bdcee4d336fb0b587e31310b2c341cf220c2ea`. Public liveness and strict dependency readiness both returned HTTP 200 after that policy-only rollout. The existing worker remains default-disabled; no worker profile, environment example, workload credential, or runtime activation change is part of this commit.

## 11. Implementation record — additive persistence slice

Core commit `31e7588` adds reviewed migration `0010_hospital_node_assignments.sql` and matching Drizzle declarations for Core-owned assignment, lease, and append-only safe-event records. The schema constrains every record through existing federation participant, round, and workload foreign keys; makes `(round_id, workload_id)` unique for assignments; makes `(assignment_id, idempotency_key)` unique for leases; and stores only digest, deadline/state, correlation, safe event type, and a scalar-only safe-details object. It contains no data field, path, token, capability, signed URL, object key, artifact byte, or remote response column.

The full local Core suite again passed with 46 TypeScript tests and 9 Python tests, including migration/integration execution. Core Quality Gates completed successfully in 1 minute 36 seconds and the protected Azure deployment completed successfully for `31e7588f0c57e5f14597e1927b75c5c903a87828`. Public liveness and strict dependency readiness returned HTTP 200 after the migration rollout. The deployment refreshed the existing containers but did not expose or call a hospital-node route; there is still no persistence adapter, controller, audience/guard, Keycloak client, update capability, submission path, real node, hospital data, or worker-gate change.

## 12. Implementation record — distinct identity guard

Core commit `92c6c53` adds `HospitalNodeAuthGuard` as a separate Nest provider. It verifies only the `fedagg-hospital-node` audience, hydrates an active local workload principal, and rejects any principal whose local workload kind is not `hospital_node`. Its tests prove that a correct active hospital-node identity is attached to the workload request and that an active `ml_worker` is refused. The existing `WorkloadAuthGuard` remains bound to the internal `fedagg-worker-callback` audience and is unchanged; no controller currently uses the new guard.

The full local suite passed with 48 TypeScript tests and 9 Python tests, including migration/integration execution. Core Quality Gates completed successfully in 1 minute 42 seconds; the protected Azure deployment completed successfully for `92c6c53a2a690390450c7b7da4ea95ea7b33ef57`; and public liveness/readiness returned HTTP 200. No Keycloak hospital-node client, route, token, capability, assignment persistence adapter, submission path, Node request, hospital data, or worker-gate change was added. The Azure worker still logs its explicit default-disabled state.

## 13. Implementation record — lease repository and migration execution

Core commit `263e596` adds `PostgresHospitalNodeAssignmentRepository` and a migrated-database integration test. The repository returns a lease context only when assignment/workload/participant records agree; recovers an existing `(assignment_id, idempotency_key)` lease; refuses a second active lease; advances the assignment from `assigned` to `leased` only when assignment, workload, digest, and current state all match; and appends one scalar-only `lease_issued` event. The migration journal was updated so migration `0010` executes in automated and deployed databases, and a partial unique index now enforces one active lease per assignment at the database boundary.

The full local suite passed with 49 TypeScript tests and 9 Python tests, including the new migrated-database lease test. Core Quality Gates completed successfully in 1 minute 37 seconds; the protected Azure deployment completed successfully in 2 minutes 49 seconds for `263e596a8e00dd77af476f4310c4c6a0de891839`; and public liveness/readiness returned HTTP 200. This still exposes no controller or route, Keycloak node client, capability, immutable command payload, artifact update intent, submission/reconciliation path, real node, hospital data, or worker-gate change.

## 14. Decision before route exposure — canonical command payload

The implemented Core protocol-version table currently contains the algorithm, architecture identifier, and immutable configuration digest, but it does not contain the exact fields that the already-tested Agent command validator requires: proximal coefficient, local epochs, model/preprocessing digests, and base-model checksum/size. A digest alone is insufficient to reconstruct or safely serve a command. Therefore, Core must add a **canonical descriptor-only command payload** to the assignment lifecycle before a lease route is exposed.

The new payload is strictly the `hospital-node-command/v1` value already validated by the Agent: assignment/correlation/federation/round IDs; expiry; algorithm/proximal coefficient/local epochs/model and preprocessing digests; and base-model checksum/byte size. It must exclude a provider URL, object key, credential, model byte, local data information, path, free text, or patient field. Core calculates the stored digest from that canonical payload at assignment creation and a lease route later returns the stored payload only after the existing assignment/participant/workload checks pass. This is an additive assignment column plus creation-policy work; it does not authorize a human route to hand-craft commands or allow a node to change any command field.

## 15. Implementation record — guarded lease endpoint

Core commit `0fd4e4b` adds the first dedicated hospital-node HTTP route: `POST /v1/workload-assignments/:assignmentId/lease`. It is guarded only by `HospitalNodeAuthGuard`, reads the workload ID from the verified workload principal rather than the request body, requires a UUID idempotency key, and delegates to the existing assignment/lease policy. Its successful response is deliberately limited to a lease receipt plus the already persisted canonical `hospital-node-command/v1` payload. It cannot return an object locator, provider URL, capability, credential, model byte, local data reference, or free-form diagnostic.

The controller test proves principal-derived workload binding and checks that the response serialization has neither `objectKey` nor `credential`. Full local CI passed with 50 TypeScript tests and 9 Python tests, including migration/integration execution. Core Quality Gates completed successfully in 1 minute 38 seconds; the protected Azure deployment completed successfully in 2 minutes 44 seconds for `0fd4e4b853fc46fa6afc3ef33a2ba8835e208c2f`; and public liveness/readiness returned HTTP 200. The route was not invoked against Azure because no hospital-node Keycloak client or pre-created assignment exists yet. There is still no assignment-creation route, Keycloak node client, base-model/update capability, artifact transfer, update submission/reconciliation route, real node connection, hospital data, or worker-gate change.

## 16. Decision before bounded endpoint proof — synthetic node identity and assignment fixture

The first endpoint proof will use one new **private Keycloak service client**, `hospital-node-synthetic`, with the `fedagg-hospital-node` audience and fixed `hospital_node` workload-kind claim. It will have its own Docker secret and host-side protected secret file; it will never reuse the `ml-worker` client, secret, audience, callback route, or workload mapping. Its token request, workload registration, synthetic federation/participant/round/assignment creation, and `POST /v1/workload-assignments/:assignmentId/lease` call will run only inside an opt-in bounded validation profile on the Core network.

The fixture will write only synthetic organization/federation/round metadata, a generated canonical command, digest/checksum/size descriptors, and allowlisted safe events. The profile must terminate after one expected lease response; the created assignment must be expired or otherwise made non-reusable immediately afterward, and the normal aggregation worker must remain default-disabled throughout. This proves audience separation, principal binding, canonical command retrieval, and idempotent lease behavior—not object transfer, training, update submission, clinical use, or a continuously operating hospital node.

## 17. Implementation record — bounded Azure hospital-node lease proof

Core commit `7d9218c` adds the deliberately opt-in `hospital-node-validation` Compose profile, a separate private `hospital-node-synthetic` Keycloak service client, an independent protected secret mount, and the one-shot `bounded-hospital-node-lease.mjs` runner. The normal deployment path does not start that profile. The client has the distinct `fedagg-hospital-node` audience and `hospital_node` workload claim; it does not reuse the ML-worker client, secret, audience, callback, or workload mapping. [5] [6]

The protected Azure deployment completed successfully after Core Quality Gates passed in 1 minute 37 seconds. Before the proof, the private client-credentials check succeeded without revealing its token or secret. The profile then ran **once**. It created generated synthetic Core facts only, mapped the separate workload identity, persisted one canonical descriptor-only command and its Core-computed digest, and called only `POST /v1/workload-assignments/:assignmentId/lease`. The runner accepted the response only when the assignment and digest matched and when the serialized response contained neither `objectKey` nor `credential`; it printed the safe success outcome only. No human route, ML-worker callback, object transfer, model training, update submission, real node, or hospital data path was invoked.

Post-run aggregate evidence recorded one expired synthetic assignment, zero active synthetic assignments, zero active synthetic leases, and one `bounded_validation_closed` safe event. The ephemeral runner was absent after completion, while Azure public liveness and readiness both returned HTTP 200. The aggregation worker remained configured as disabled and continued to log its default-disabled state. This is proof of a narrowly scoped Core lease boundary only; it is not a model-transfer, training, submission, reconciliation, hospital-integration, or clinical-use proof.

## 18. Next documented delivery gate — bounded assignment-creation authority

The next work is design-first, not a capability or submission implementation. The Core needs a narrowly privileged **synthetic assignment-creation authority** that can create an assignment only from eligible, already-frozen Core round and participant facts plus one Core-owned canonical command. It must not become a human self-service route, permit a node to select a round or training configuration, reuse the ML-worker identity, or create a general administrative bypass.

Before any code for this gate, the ledger must define the authority principal, input boundary, frozen-fact checks, idempotency and audit rules, terminal/expiry behavior, and the exact tests that prove denial for human, `ml_worker`, stale, cross-organization, and non-frozen inputs. Only after that authority is accepted should the design progress to safe base-model read capability, update-intent creation, verified artifact reconciliation, and node-only update submission. The successful lease proof does not authorize those later boundaries.

## 19. Increment A design — synthetic assignment-creation authority

### 19.1 Scope and authority boundary

This increment creates **no HTTP endpoint** and grants no human, hospital-node, or ML-worker principal the power to create an assignment. The authority is a private Core application service used only by a profile-gated, generated-fixture validation workflow. Its caller is a trusted Core process, not an OIDC subject. The service may create one initial `assigned` record from already persisted, generated Core facts and one Core-owned `hospital-node-command/v1` envelope; it cannot lease, issue a capability, transfer an object, train, submit an update, dispatch aggregation, or release a model.

> A synthetic creation authority is a bounded test-control capability, not a participant-facing API and not a general administrative bypass.

| Decision | Increment A rule | Explicit denial |
|---|---|---|
| Caller | Private synthetic-validation workflow invokes the application service directly. | Every browser, human API, hospital-node token, ML-worker token, callback, queue consumer, or public route. |
| Authority input | One UUID assignment identity, one UUID correlation identity, one existing participant/round/workload relationship, one future deadline, and one descriptor-only command. | Node-selected round, organization, algorithm, local epoch count, base-model locator, local path, bytes, free text, credential, or patient field. |
| Initial state | Persist exactly `assigned`; the existing lease service remains the only path to `leased`. | Direct creation of a lease, update authorization, submission, acceptance, or terminal success. |
| Evidence | Append one scalar-safe `assignment_created` hospital-node event in the same database transaction. No dispatch occurs, so this increment creates no outbox event. | Raw request payload, token, storage capability, URL, locator, bytes, environment details, or a fabricated operational audit trail. |
| Runtime | Source and tests deploy with the ordinary Core release; the authority executes only when a future explicit validation profile is enabled. | Re-running the completed lease proof, enabling the aggregation worker, or leaving a continuously active creation service. |

### 19.2 Required inputs and frozen-fact checks

The application service receives a fully specified `CreateSyntheticHospitalNodeAssignment` value from the private workflow. It reconstructs no clinical configuration and accepts no arbitrary JSON. Before repository mutation, it must load and verify that the existing workload is active and `hospital_node`; the active federation participant references that same workload and organization; the participant belongs to the supplied federation; the round belongs to that federation, is `open`, and references an existing protocol version; and the command names the same assignment, correlation, federation, round, and exact future deadline.

The command stays Core-owned: the service calculates `hospitalNodeCommandDigest(command)` itself and persists that result. Its algorithm must equal the round protocol algorithm, and its expiry must equal the assignment deadline. The source must reject a malformed schema version, non-positive base-model byte size, non-future expiry, mismatched identifiers, changed digest, inactive/suspended/revoked workload or participant, non-`hospital_node` workload, cross-federation round, or a non-open round. Protocol fields not currently represented in the Core protocol-version record remain fixed generated fixture facts in this increment; no human or node may supply them.

### 19.3 Persistence, replay, and terminal behavior

No schema migration is required for this increment. The current `hospital_node_assignments` primary key, `(round_id, workload_id)` uniqueness rule, one-to-one `hospital_node_commands` record, and append-only `hospital_node_events` table are sufficient. The repository must perform all of the following atomically: check context; calculate/compare the canonical command digest; insert the assignment with state `assigned`; insert exactly one matching command record; and append one `assignment_created` event with a scalar-safe source label such as `synthetic_validation`.

Creation replay identity is the Core-generated assignment UUID. A retried call with the same UUID must return the existing safe assignment receipt only if workload, participant, round, correlation, deadline, command, and canonical digest all match exactly. A changed replay must fail. A different UUID for the same `(round, workload)` must fail the existing unique boundary. This increment does not expire assignments automatically; the existing bounded validation teardown or a later explicit lifecycle job remains responsible for terminal expiry. No creation call can resurrect a terminal assignment.

```mermaid
sequenceDiagram
  participant V as Private validation profile
  participant S as Creation application service
  participant R as Assignment repository
  participant D as PostgreSQL

  V->>S: generated IDs + existing facts + command
  S->>S: validate context, deadline, identifiers, algorithm, digest
  S->>R: create only initial assignment
  R->>D: transaction: assignment + command + safe event
  alt exact replay
    D-->>R: existing immutable receipt
  else new eligible assignment
    D-->>R: persisted assigned receipt
  else mismatch or duplicate scope
    D-->>R: deny without mutation
  end
  R-->>S: descriptor-only assignment receipt
  S-->>V: no lease, capability, object, bytes, or token
```

### 19.4 Application and persistence surface

The new application port will expose a create method separate from the current lease method. Its safe result contains assignment ID, participant ID, workload ID, round ID, correlation ID, command digest, deadline, and `assigned` state only. It does not return the command body to the caller unless a later workflow requires it; lease remains the command-disclosure boundary. The Postgres adapter will extend the existing assignment repository rather than create a parallel data path, preserving the current canonical-command verification performed during a lease. [7]

| Layer | Additive responsibility | Must not do |
|---|---|---|
| Domain | Validate initial-state eligibility and immutable command-to-context consistency. | Know SQL, OIDC, HTTP, storage, or generated data content. |
| Application | Coordinate time, canonical digest, context validation, safe replay semantics, and repository call. | Accept a human principal, dispatch work, or widen the lease service. |
| Postgres adapter | Atomically persist assignment, command, and scalar-safe event; return a receipt or exact replay. | Store URLs, credentials, object keys, bytes, local path/data fields, or arbitrary diagnostics. |
| Validation profile | Generate the synthetic prerequisite facts and call the service only when explicitly enabled. | Become a daemon, public client, normal deployment dependency, or evidence of hospital operation. |

### 19.5 Required tests and acceptance evidence

| Test layer | Required evidence |
|---|---|
| Domain unit | Reject wrong workload kind/status, participant status, non-open/cross-federation round, identifier mismatch, past deadline, non-positive size, algorithm mismatch, and any attempt to begin outside `assigned`. |
| Application unit | Prove Core-calculated canonical digest, exact replay return, changed-replay refusal, and that creation returns a safe receipt without invoking lease, capability, dispatch, or submission behavior. |
| PostgreSQL integration | Prove atomic insertion of one assignment, one command, and one safe event; exact replay produces no duplicate rows; competing assignment for `(round, workload)` fails; mismatch rolls back all writes. |
| Regression | Preserve existing lease behavior: only an authenticated active hospital-node workload can transition the newly created record from `assigned` to `leased`; `ml_worker` and human routes remain denied. |
| Deployment | Pass Core Quality Gates and the protected Azure release; verify liveness/readiness HTTP 200 and the default-disabled aggregation-worker log. No runtime profile is invoked as part of this increment. |

The next code change may implement only these described domain, application, port, Postgres, and tests. Any capability, transfer, update intent, verification, submission, or new Azure execution must begin with its own design record.

## 20. Implementation record — private synthetic assignment authority

Core commit `a0f423b` implements Increment A without adding a controller, route, guard exception, OIDC client, profile invocation, migration, or runtime worker change. It adds a framework-free `SyntheticHospitalNodeAssignmentCreationService`, a separate repository port, an explicit domain eligibility policy, and a Postgres adapter extension. The service has no principal parameter and is not registered as an API provider; only a future private validation composition may instantiate it.

The service loads persisted workload, participant, round, and protocol facts; requires active `hospital_node` and participant state, same organization/federation binding, an open round, and algorithm/identifier/expiry/descriptor consistency; calculates the canonical command digest itself; and creates only an initial `assigned` receipt. The adapter atomically writes one assignment, one one-to-one canonical command record, and one scalar-safe `assignment_created` event. An exact assignment-UUID replay returns the existing receipt only when every immutable fact and canonical command match; a changed replay or a second assignment for the same `(round, workload)` fails. No storage locator, capability, credential, token, bytes, data field, path, free-text diagnostic, lease, outbox event, dispatch, or submission is written.

Local quality passed with 60 TypeScript tests and 9 Python tests, including four domain-eligibility tests, three application-service tests, and three migrated PostgreSQL creation tests in addition to existing regression coverage. GitHub Core Quality Gates completed successfully in 1 minute 41 seconds, and the protected Azure deployment completed successfully in 3 minutes 1 second. The deployed release returned public liveness/readiness HTTP 200, while the aggregation worker remained configured as disabled and logged its default-disabled state. No profile was run for this increment, so this is deployment evidence for the code boundary—not proof of a new assignment-creation execution.

## 21. Next documented delivery gate — bounded creation-only composition proof

The next increment must prove that the private service is composed and used by a controlled generated-fixture workflow before any model-read capability design begins. The current lease runner used direct SQL to build its synthetic assignment fixture because the authority did not yet exist. A **new creation-only validation runner** must instead seed only the already-established generated prerequisite facts, invoke `SyntheticHospitalNodeAssignmentCreationService` for the assignment/command/event write, assert the descriptor-only receipt and exact-replay behavior, expire the fixture, and append a single scalar-safe closure event.

This runner must be a new opt-in Compose profile with no public port, no human endpoint, no hospital-node token requirement, no ML-worker identity, no aggregation-worker enablement, no object storage, and no lease call. It may depend on migrated PostgreSQL but it must not be a normal deployment dependency or a daemon. Its safe output must say only whether the private creation authority accepted the generated facts, persisted one immutable assigned record and one command/event, recovered an exact replay, and closed the assignment. No record IDs, command body, token, secret, provider response, database URL, object locator, bytes, or local path may be emitted.

| Required proof step | Allowed evidence | Must remain absent |
|---|---|---|
| Generated prerequisites | Safe count/category that Core-side generated facts were seeded. | Any hospital, patient, image, path, dataset, or clinical field. |
| Service composition | Safe assertion that the private application service calculated the canonical digest and returned `assigned`. | Direct assignment insert for the created record, HTTP request, OIDC token, or a human principal. |
| Exact replay | One safe statement that replay returned the same descriptor-only receipt. | A second assignment/command/event, a new lease, or changed command acceptance. |
| Closure | Aggregate terminal state and one safe closure event. | Active assignment, active lease, capability, transfer, submission, job, or worker enablement. |

The runner, Compose profile, tests, and its bounded Azure execution require their own implementation record. Only after this creation-only proof is complete should the next design consider a time-bounded base-model read capability.

## 22. Implementation and evidence record — bounded creation-only composition proof

Core commit `0b48aeb` adds the new opt-in `hospital-node-assignment-creation-validation` Compose profile and its one-shot `bounded-hospital-node-assignment-creation.mjs` runner. The profile has no public port, no API, Keycloak, OIDC, storage, MinIO, aggregation-worker, dispatch-worker, or lease dependency. It depends only on completed migrations and receives the ordinary private database runtime configuration. The source runner is syntax-checked, and local full quality passed with 60 TypeScript tests and 9 Python tests. Core Quality Gates completed in 1 minute 48 seconds; protected Azure deployment completed in 2 minutes 46 seconds. [9] [6]

The first operator invocation stopped during Compose interpolation before a container was created because the general Compose topology requires protected secret-file references even though this profile consumes neither identity nor secret. It was rerun with only non-secret file references necessary to resolve the existing topology; no secret value was read or emitted. The validation container then built and ran **once**. It inserted generated prerequisite organizations, workload, federation, participant, protocol, and round facts only. The assignment itself was created exclusively by `SyntheticHospitalNodeAssignmentCreationService`, which computed the canonical command digest, returned an `assigned` descriptor-only receipt, and recovered one exact replay. Direct database access in the runner was limited to allowed prerequisite seeding, safe evidence assertions, and terminal cleanup—not the assignment/command/event creation under proof.

The runner accepted success only if the receipt matched the generated assignment and Core-computed digest, the receipt contained neither `objectKey` nor `credential`, exactly one `assignment_created` event and one canonical command existed, and exact replay returned the same receipt. It then expired the fixture and wrote one `bounded_assignment_creation_closed` safe event. Aggregate post-run evidence was **one closure event, one expired synthetic assignment, and zero active synthetic assigned/leased records**. The ephemeral runner had zero remaining instances. Azure public liveness and readiness both returned HTTP 200, and the aggregation worker remained configured as disabled with its default-disabled log state.

This proves the private creation service is actually composable and bounded for generated facts. It does **not** prove model access, object transfer, storage capability issuance, node download, training, update creation, update submission, aggregation, clinical integration, or hospital operation. No human route, `ml_worker` identity, hospital-node token, lease call, storage locator, credential, byte stream, data record, or model artifact was used.

## 23. Next documented delivery gate — descriptor-only base-model-read intent

The next increment is a design-only **base-model-read intent** boundary. It will not authorize a download or mint a signed URL. Its purpose is to give an already authenticated, active `hospital_node` workload an idempotent Core-owned record that a specific active lease is eligible to request base-model access later, while retaining every locator, credential, provider response, and model byte outside both API and PostgreSQL.

| Boundary decision | Required rule | Explicitly not provided |
|---|---|---|
| Caller | Only the existing `HospitalNodeAuthGuard` may reach a new node-only intent endpoint; workload ID is derived from its verified `fedagg-hospital-node` principal. | Human/admin route, `ml_worker` callback, reused secret, arbitrary workload header, public page, or browser portal. |
| Preconditions | Assignment and lease must match the principal workload, be `leased`/`active`, unexpired, and bound to the unmodified canonical command digest. The round remains in its permitted state. | Intent for an `assigned`, expired, consumed, revoked, cross-workload, cross-round, or changed-command lease. |
| Base-model evidence | Core must resolve a verified, Core-owned artifact reference from the frozen base-model version and preserve only immutable descriptor identity, checksum/digest, size, assignment, lease, and expiry. | Object key, URL, bucket, storage provider response, credential, byte range, model bytes, preprocessing payload, or patient field. |
| Persistence | Additive `hospital_node_base_model_read_intents` record with exact request idempotency, one active intent per lease, state (`issued`, `expired`, `revoked`), expiry, descriptor digest, and scalar-safe events. | A general capability table that permits upload, update submission, model release, queue dispatch, or a bearer credential. |
| Response | Descriptor-only intent receipt: IDs, command/base-model digest, size, expiry, and state. | Download link, credential, locator, bytes, opaque provider token, or an assertion that data has been read. |
| Later resolution | A separately designed private storage adapter may consume a live intent only after its own contract and proof exist. | Any object lookup, presigned URL, storage call, or Agent download in this increment. |

### 23.1 Required contract, flow, and tests before code

The contract must introduce a versioned `hospital-node-base-model-read-intent/v1` receipt with no expandable free-form payload. The request contains only an assignment identifier and UUID idempotency key; all workload, lease, model, round, protocol, and descriptor binding comes from Core records. Domain policy must reject every non-active/context-mismatched lease before persistence. The application service must calculate the descriptor digest from Core-held immutable facts, not accept it from the node. The Postgres transaction must return only an exact replay, refuse competing active intent, append a scalar-safe `base_model_read_intent_issued` event, and emit no work-dispatch outbox event.

Before implementation, the data design must identify the authoritative mapping from a round’s `baseModelVersionId` to a verified artifact descriptor. If the existing Core schema cannot represent that mapping without a locator in the boundary, the mapping itself is a prerequisite design change; it must not be simulated by accepting a node-supplied checksum or storage reference. The endpoint must serialize a receipt through an explicit redaction test that asserts the absence of object keys, URLs, credentials, bytes, and provider response fields.

The test sequence must include domain denials for human/ML-worker principal paths, wrong workload, lease state, expiry, command digest, round, and model binding; application idempotency and redaction tests; migrated PostgreSQL atomicity/replay/one-active-intent tests; controller guard/principal tests; and a future creation-only Azure proof that issues then expires an intent without storage access. The current creation-only proof does not authorize that future proof or any object transfer.

## 24. Prerequisite design — Core-owned verified base-model descriptor mapping

### 24.1 Discovery and decision

The Core schema confirms that `rounds.baseModelVersionId` is an opaque string. It has no foreign-keyed, verified descriptor mapping, while the current `artifact_category` enum has no base-model archive category. Therefore the string cannot safely authorize a Hospital Node read intent: neither a node nor a service may infer checksum, byte size, model digest, preprocessing digest, or artifact identity from it. The read-intent gate is consequently blocked until this separate Core-owned mapping is available. [4]

The next implementation will add a **private verified base-model descriptor registry**, not a retrieval API. It establishes immutable Core facts from an already verified artifact so later Hospital Node policy can prove that the command, round version, and selected base model agree. It will not resolve an object, call storage, issue a capability, return a locator, or let a node choose a model.

### 24.2 Additive schema and descriptor shape

Migration `0012_hospital_node_base_model_descriptors` will add the `base_model_archive` artifact category and the following registry. The existing internal `artifacts.objectKey` remains confined to existing Core storage code; this registry, application service, API, event data, tests, and public documentation must not copy or serialize it.

| Field | Purpose | Boundary rule |
|---|---|---|
| `id` | Opaque Core descriptor identity. | Never a provider/object identity. |
| `federation_id` | Binds the base-model version to its federation. | Must equal the round federation. |
| `base_model_version_id` | Freezes the existing round string as a Core lookup key. | Unique within federation; never node-selected for an active assignment. |
| `artifact_id` | References one existing `verified` `base_model_archive` artifact. | Storage locator remains in the artifact repository only. |
| `model_digest`, `preprocessing_digest` | Immutable training-compatibility facts. | Must match the canonical command before any later intent. |
| `checksum_sha256`, `byte_size` | Frozen descriptor evidence copied from the verified artifact. | Positive and equal to the verified artifact; no bytes. |
| `descriptor_digest` | Canonical Base64 SHA-256 digest over the registry’s descriptor-only values. | Calculated by Core, never supplied by a node. |
| `state` | `active` or `revoked`, with time/audit fields. | Revocation prevents future intents; no replacement mutation. |
| `hospital_node_base_model_descriptor_events` | Append-only registry evidence: descriptor ID, `base_model_descriptor_registered` or `base_model_descriptor_revoked`, correlation ID, and scalar-safe details. | No assignment dependency, object key, URL, provider response, token, bytes, or free text. |

The registry will have unique constraints on `(federation_id, base_model_version_id)`, `artifact_id`, and `descriptor_digest`. No update can replace its artifact or descriptor values. A revocation is an additive state transition with a scalar-safe event, not a deletion. The existing round string deliberately stays unchanged in this increment; the mapping gives it authoritative meaning without a breaking round migration.

### 24.3 Authority, workflow, and receipt

Only a private synthetic-validation application service may register a generated descriptor during this first mapping slice. It receives a Core-held artifact identity and registry facts, loads the artifact and federation, and rejects it unless the artifact is `verified`, category `base_model_archive`, federation-bound, positive-size, and checksum-consistent. It computes `descriptor_digest`, writes the immutable registry record, and appends one scalar-safe `base_model_descriptor_registered` registry event in the same transaction. It creates no assignment, lease, intent, OIDC principal, capability, storage call, dispatch, or outbox event.

The safe registration receipt contains only registry ID, federation ID, base-model version ID, artifact ID, model/preprocessing/descriptor digests, checksum, size, state, and timestamp. It contains no `objectKey`, `objectVersion`, bucket, URL, credential, provider response, content, bytes, local path, patient field, or free-text diagnostic. Exact registration replay returns the same receipt only when all immutable values agree; a changed replay, wrong federation, non-verified artifact, incorrect category, checksum/size mismatch, duplicate version, or duplicate artifact/digest fails without partial writes.

```mermaid
sequenceDiagram
  participant V as Private generated-fixture workflow
  participant S as Descriptor registry service
  participant R as Descriptor repository
  participant D as PostgreSQL

  V->>S: Core artifact identity + version + immutable descriptor facts
  S->>R: load verified base-model archive
  R->>D: artifact/federation lookup only
  S->>S: validate and compute descriptor digest
  S->>R: register immutable descriptor
  R->>D: transaction: descriptor + scalar-safe event
  D-->>R: one receipt or exact replay
  R-->>S: descriptor-only receipt
  S-->>V: no storage resolution or transfer
```

### 24.4 Required tests and proof sequence

| Layer | Required evidence | Prohibited behavior |
|---|---|---|
| Contract/domain | Canonical digest is deterministic; category/status/federation/size/checksum/revocation rules reject invalid facts. | Accepting node-supplied locator, bytes, provider data, or arbitrary JSON. |
| Application | Core resolves the artifact itself, returns a redacted receipt, and permits only exact replay. | HTTP, OIDC, lease, intent, capability, storage adapter, or dispatch invocation. |
| PostgreSQL | Migration and constraints prevent conflicting version/artifact/digest records; atomic registration writes one safe registry event. | Copying `object_key` into the registry/event/receipt. |
| Azure deployment | Core Quality Gates, protected release, liveness/readiness, and disabled worker must pass. | Any profile execution before the deployment gate passes. |
| Bounded future proof | One private generated registry record is registered, replayed exactly, revoked or otherwise closed, and observed only through aggregate-safe facts. | Model download, storage resolution, lease call, read intent, training, update, submission, aggregation, or real hospital data. |

Only after this registry is implemented, deployed, and evidenced may the previously documented base-model-read intent boundary begin. The later intent will consume the registry digest and immutable facts; it will not rediscover or expose an artifact location.

## 25. Implementation record — verified base-model descriptor registry

Core commit `9fce888` implements migration `0012_hospital_node_base_model_descriptors`, which adds the private `base_model_archive` artifact category, `hospital_node_base_model_descriptors` registry, independent scalar-safe registry-event table, and an `active`/`revoked` state vocabulary. The registry has unique federation/version, artifact, and canonical descriptor-digest constraints; it stores federation, version, artifact identity, model/preprocessing digest, checksum, byte size, state, and correlation only. It does not copy `artifacts.objectKey`, object version, bucket, URL, credential, provider response, bytes, local path, patient field, or free text into its table, event, or safe receipt. [11]

The framework-free private service loads artifact facts itself, requires a verified same-federation `base_model_archive`, computes a canonical descriptor digest, persists one immutable active descriptor and one `base_model_descriptor_registered` event atomically, and recovers only an exact replay. Domain tests reject invalid status/category/federation/checksum/size before a repository write; application tests assert Core digest calculation and receipt redaction; migrated PostgreSQL tests prove one descriptor/event, exact replay, and conflicting-version refusal. The mapping is not an HTTP endpoint and has no OIDC principal, lease, read intent, capability, storage adapter, object lookup, download, dispatch, update, submission, or aggregation behavior.

Local full quality passed with **68 TypeScript tests and 9 Python tests**. Core Quality Gates completed successfully in **1 minute 44 seconds**; protected Azure deployment completed successfully in **2 minutes 45 seconds**. Azure public liveness/readiness returned HTTP 200, and the aggregation worker remained configured as disabled with its default-disabled log state. No bounded mapping runtime profile was added or run, so this is deployment and persistence evidence only—not proof of descriptor registration against a deployed artifact and not a model-access proof.

## 26. Resumed delivery gate — descriptor-only base-model-read intent implementation

The mapping prerequisite is complete. The next code increment may now implement the previously documented `hospital-node-base-model-read-intent/v1` issuance boundary, but only as a guarded descriptor-only receipt. It must consume the active registry’s immutable digest and facts, not any storage location. Before code, its exact domain/application/persistence/controller test set and migration must remain aligned to Section 23; before a future Azure run, the route must be deployed, liveness/readiness and the disabled worker must be verified, and its separate proof must issue then expire an intent without storage access.

## References

[1] [Hospital Node Agent Engineering and API Design](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/HOSPITAL_NODE_AGENT_ENGINEERING_AND_API.md)

[2] [Hospital Node Agent Data and Schema Design](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/HOSPITAL_NODE_AGENT_DATA_AND_SCHEMA.md)

[3] [Core workload identity port](https://github.com/hstu-research/federated-aggregator-core/blob/main/packages/application/src/ports/identity.ts)

[4] [Core persistence schema](https://github.com/hstu-research/federated-aggregator-core/blob/main/packages/persistence-postgres/src/schema.ts)

[5] [Bounded hospital-node lease runner](https://github.com/hstu-research/federated-aggregator-core/blob/main/infra/validation/bounded-hospital-node-lease.mjs)

[6] [Core Compose validation profile](https://github.com/hstu-research/federated-aggregator-core/blob/main/infra/deploy/compose.core.yaml)

[7] [Current Postgres hospital-node assignment repository](https://github.com/hstu-research/federated-aggregator-core/blob/main/packages/persistence-postgres/src/hospital-node-assignment-repository.ts)

[8] [Private assignment-creation application service](https://github.com/hstu-research/federated-aggregator-core/blob/main/packages/application/src/hospital-node-assignment-creation-service.ts)

[9] [Bounded assignment-creation validation runner](https://github.com/hstu-research/federated-aggregator-core/blob/main/infra/validation/bounded-hospital-node-assignment-creation.mjs)

[10] [Core round and artifact schema](https://github.com/hstu-research/federated-aggregator-core/blob/main/packages/persistence-postgres/src/schema.ts)

[11] [Verified base-model descriptor registry](https://github.com/hstu-research/federated-aggregator-core/blob/main/packages/persistence-postgres/src/hospital-node-base-model-descriptor-repository.ts)
