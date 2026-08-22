# Hospital Node Agent — Engineering Standards and API Contract Design

## 1. Engineering architecture

```text
federated-aggregator-hospital-node/
├── apps/
│   └── agent/                         # TypeScript composition root and localhost status API
├── packages/
│   ├── contracts/                     # Versioned Node/Core + Node/Python schemas and fixtures
│   ├── domain/                        # Local run/assignment values, states, events, errors
│   ├── application/                   # Execute-assignment use cases and ports
│   ├── core-client/                   # Typed workload API and capability client
│   ├── local-state-sqlite/            # SQLite repositories, migrations, transaction/outbox-like event append
│   ├── identity-oidc/                 # Workload client-credentials token source
│   ├── observability/                 # Allowlisted logs/metrics/redacted export
│   └── testkit/                       # Fake Core/storage/trainer/adapters/controlled clock
├── python/packages/
│   ├── hospital_node_ml_core/          # Pure model/checkpoint/training computations
│   └── hospital_node_trainer/          # Command adapter, dataset port, local result writer
├── infra/
│   ├── compose/                       # Simulated-node test profile only
│   └── fixtures/                      # Tiny tensors and non-sensitive commands
├── docs/
└── tests/{contract,integration,e2e,fixtures}/
```

### Implemented local-state evidence

The first persistence increment is deliberately narrower than a deployed node service. `SqliteLocalRunRepository` owns a composite unique identity of assignment and idempotency key, performs state update plus event append inside a SQLite transaction, and exposes only event labels to its test fixture. `FakeCoreSubmissionSink` and `FakeCoreAssignmentSource` are in-process contract adapters; they do not mint tokens, construct URLs, or accept artifact bytes. The application returns a recovered terminal run before invoking validation, trainer, or submission ports. This prevents a controlled restart from duplicating an already accepted synthetic submission without asserting recovery for an interrupted nonterminal operation.

### Implemented capability and retry evidence

Commits `deee8a6` and `1dcff80` complete the next in-memory adapter boundary. A scoped capability guard requires exact assignment and read/write operation plus an unexpired lease. `FakeScopedObjectStore` accepts a generated update only after that capability check and a constant-time SHA-256 checksum match; it returns a descriptor only and carries neither URL, object key, credential, remote request, nor persisted byte record. `FakeWorkloadTokenSource` returns a synthetic token from process memory only when audience and expiry match. Remote outcomes are classified as accepted, retryable (`temporary_unavailable` or `transport_timeout`), or terminal (`deadline_closed`, invalid descriptor, forbidden scope); classification is evidence only and does not automatically resubmit. Hospital Node Quality Gates #3 and #4 each passed remotely, with the final suite containing ten TypeScript tests and four Python ML tests.

### Rules

| Rule | Enforcement |
|---|---|
| Frameworks are adapters. | Domain/application packages contain no Nest/Express/ORM/Boto/PyTorch network imports. |
| Local data is a port. | Trainer receives a `LocalDatasetAdapter`, never a raw path from Core. |
| Commands are immutable. | Canonical command digest validated in both languages before training. |
| State is explicit. | Each mutation appends an event in the same SQLite transaction. |
| Node/Python interface is versioned. | JSON Schema, golden fixtures, canonical serialization, and backward-incompatibility review. |
| Diagnostics are safe by construction. | Reason codes and allowlisted dimensions only; no raw exception object logging. |

## 2. API documentation readout

### Existing Core endpoints — not valid for node use

| Implemented Core endpoint | Authentication | Reason the node must not call it |
|---|---|---|
| `POST /v1/federations/:federationId/artifact-intents` | Human-only local membership guard. | A workload is not a human and cannot self-authorize artifact intent. |
| `POST /v1/artifacts/:artifactId/verify` | Human-only local membership guard. | Verification remains a Core governed operation, not a node control. |
| `POST /v1/rounds/:roundId/aggregation` | Human-only local membership guard. | A node cannot start server aggregation. |
| `POST /v1/worker-results/:jobId` | Separate internal ML-worker workload identity. | Hospital local training is a distinct workload kind and result contract. |

### Proposed Core workload API — required before Agent integration

These routes are **proposed contracts**, not implemented Core endpoints. They require a new `hospital_node` workload policy and must be added to the Core before a real integration claim.

| Operation | Proposed route | Request/response boundary | Required policy |
|---|---|---|---|
| Pull assignment | `GET /v1/workloads/self/assignments?cursor=` | Assignment ID, command digest, expiry, summary only. | Active `hospital_node`, federation participation. |
| Lease command | `POST /v1/workload-assignments/:id/lease` | Idempotency key → immutable command and short-lived read capability. | Assigned active workload and deadline. |
| Update intent | `POST /v1/workload-assignments/:id/update-intents` | Manifest metadata/checksum/size → scoped direct-upload capability. | Valid lease, category `model_update_archive`. |
| Submit update | `POST /v1/workload-assignments/:id/submissions` | Descriptor/checksum/manifest/summary and idempotency key. | Verified upload, exact command digest, open round. |
| Report terminal incompatibility | `POST /v1/workload-assignments/:id/outcomes` | Allowlisted reason code and safe environment category. | Valid lease; no raw logs/data. |

### Proposed command envelope

```json
{
  "schemaVersion": "hospital-node-command/v1",
  "assignmentId": "uuid",
  "correlationId": "uuid",
  "commandDigest": "base64-sha256",
  "federationId": "uuid",
  "roundId": "uuid",
  "protocol": {
    "versionId": "uuid",
    "modelDigest": "base64-sha256",
    "preprocessingDigest": "base64-sha256",
    "algorithm": "fedprox",
    "proximalMu": 0.01,
    "localEpochs": 3
  },
  "baseModel": { "checksumSha256": "base64-sha256", "byteSize": 0 },
  "expiresAt": "2026-08-22T00:00:00.000Z"
}
```

The envelope deliberately excludes patient data, dataset path, sample IDs, raw class counts, object key, signed URL, long-lived secret, or Core-internal command payload. The actual model-read capability is delivered only in a short-lived protected response after lease verification.

### Proposed submission envelope

```json
{
  "schemaVersion": "hospital-node-submission/v1",
  "assignmentId": "uuid",
  "commandDigest": "base64-sha256",
  "artifact": {
    "checksumSha256": "base64-sha256",
    "byteSize": 0,
    "manifestDigest": "base64-sha256"
  },
  "trainingSummary": {
    "localEpochsCompleted": 3,
    "sampleCountPolicyValue": 0,
    "environmentFingerprint": "base64-sha256",
    "datasetDeclarationDigest": "base64-sha256"
  },
  "idempotencyKey": "uuid"
}
```

The `sampleCountPolicyValue` field is included only when the immutable protocol permits its release. It is not a promise to reveal exact counts in every research configuration.

## 3. Test and quality gates

| Layer | Required proof |
|---|---|
| Pure domain | Assignment state matrix, deadline handling, one-run idempotency, safe reason codes. |
| Python ML | FedAvg/FedProx one-epoch fixture, `μ=0` equivalence, invalid checkpoint/key/NaN rejection. |
| Contract | Command/submission schema fixtures validate in TypeScript and Python; canonical digest round trips. |
| Local persistence | SQLite crash/restart, event append atomicity, accepted terminal state immutability. |
| Adapter | Wrong scope/token, expired capability, checksum mismatch, retriable vs terminal Core responses. |
| E2E | One simulated node runs an authorized synthetic assignment against Azure Core once workload routes exist. |
| Negative safety | Assert no route accepts raw image/patient payload; snapshot redacted export/log output. |
