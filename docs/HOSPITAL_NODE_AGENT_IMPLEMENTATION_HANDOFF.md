# Hospital Node Agent — AI Implementation Handoff

**Repository:** `hstu-research/federated-aggregator-hospital-node` (private)  
**Primary languages:** Node.js/TypeScript for local control; Python for local ML execution  
**Default target:** Synthetic site only; existing Azure Core test environment is authoritative  
**Authoring identity:** `S. HASAN <hasanshahriar32@gmail.com>`  
**Non-negotiable boundary:** Raw patient data, images, identifiers, paths, model bytes in API bodies, and Core/database credentials never enter the Node Agent’s API, logs, public documentation, or Git history.

## 1. Mission and first implementation slice

Build one separately deployable workload that proves the local half of a federated round without impersonating the Core. The first slice must ingest a synthetic immutable assignment from a fake Core adapter, validate it, run deterministic Python local optimization with FedAvg/FedProx semantics, serialize an update descriptor, persist restart-safe local state, and expose a redacted status read. It does **not** wait for new production hospital onboarding or real workload endpoints before proving the internal architecture.

## 2. Repository bootstrap

```text
federated-aggregator-hospital-node/
├── .github/workflows/ci.yml
├── apps/agent/src/{main,composition,local-status}/
├── packages/{contracts,domain,application,core-client,local-state-sqlite,identity-oidc,observability,testkit}/src/
├── python/packages/{hospital_node_ml_core,hospital_node_trainer}/src/
├── infra/{compose,fixtures}/
├── docs/
├── package.json
├── pnpm-workspace.yaml
├── pyproject.toml
└── README.md
```

The repository begins with strict formatter, linter, TypeScript, Python type/test, Markdown, secret-ignore, and dependency-lock policies. A clean clone must complete static checks and synthetic tests without Docker, GPU, cloud credentials, or external Core availability.

## 3. Delivery slices

| Phase | Deliverable | Required tests | Exit gate |
|---:|---|---|---|
| 0 | Workspace, quality tooling, ADR/readme, CI, testkit. | Clean checkout/lint/format/type test. | No runtime feature claimed. |
| 1 | Domain state machine and local-safe schemas. | Assignment/run transition and idempotency matrix. | Terminal run cannot reopen. |
| 2 | Python ML core with tiny tensors. | `μ=0` baseline; `μ>0` proximal penalty; invalid tensor/checkpoint rejection. | Cross-language fixture digests match. |
| 3 | SQLite local state and redacted status projection. | Migration, crash/restart, append-only event, redaction snapshot. | Restart cannot duplicate successful run. **Persistence portion implemented at `2468f4b`; local status/redaction projection remains open.** |
| 4 | Fake Core/storage/token adapters and execute-assignment use case. | Expiry, wrong scope, checksum, retry classification. | Bytes never enter Node API or database. **Implemented with in-process fakes at `deee8a6` and `1dcff80`; no HTTP client or automatic retry is implied.** |
| 5 | Local localhost status service and Compose simulated node. | End-to-end synthetic assignment to accepted fake submission. | No public listener by default. **Status endpoint and static Compose profile implemented at `e11d661`; direct loopback proof passed, but Docker runtime execution remains unavailable in this sandbox.** |
| 6 | Core workload-contract proposal implementation, then Azure synthetic integration. | Contract/e2e against private Core test routes. | One synthetic node result accepted by Core. |

## 4. Interfaces to implement first

| Port | Required method | Invariant |
|---|---|---|
| `AssignmentSource` | `listAssignments`, `leaseAssignment` | Returned command must be canonical-digest verified. |
| `LocalDatasetAdapter` | `preflight`, `openTrainingData` | Never returns path/identifier in diagnostics. |
| `Trainer` | `execute(command, datasetHandle)` | Receives frozen protocol; cannot select algorithm/round. |
| `ArtifactCapability` | `downloadBaseModel`, `uploadUpdate` | Scoped/short-lived capability only; no bucket credential persistence. |
| `SubmissionSink` | `submit`, `reportIncompatible` | Idempotency key required; terminal accepted/rejected behavior. |
| `LocalRunRepository` | `begin`, `appendEvent`, `complete`, `recover` | State/event change is atomic. |
| `WorkloadTokenSource` | `getAccessToken` | Token stays in memory; no SQLite/log persistence. |

## 5. Contract and compatibility policy

All cross-language commands/results use versioned JSON Schema plus canonical serialization. The same golden fixtures must validate in TypeScript and Python. Any change to model format, preprocessing, optimizer semantics, `μ`, local epochs, metric policy, artifact archive format, or response schema requires a successor `schemaVersion`; the Agent rejects a version it does not implement.

The Core’s current artifact-intent, round-start, and internal worker-result endpoints are human/internal paths. Phase 6 may add the **proposed** workload endpoints only after Core authorization, data model, audit, and integration tests are extended. Until then, the Agent uses fakes and documents the contract gap rather than using a human credential as a shortcut. The completed fakes prove guard behavior only: scoped assignment/operation/expiry, constant-time checksum comparison, audience/expiry token lookup, and outcome classification. They do not contact Azure, create a bearer token, retry an upload, or send a model byte to the Core.

## 6. Autonomous decisions

The implementation agent may choose ordinary libraries, test fixture names, module boundaries, and local default caps that satisfy this handoff. It must record any change that affects data boundary, Core authority, workload identity, protocol semantics, byte transport, or public deployment in the decision ledger before implementing it. It must not add blockchain, IPFS, MetaMask/SIWE, patient upload, EHR/PACS integration, public status endpoints, real hospital assets, or clinical inference without a new requirements/design sequence.

## 7. Definition of done for the first repository milestone

The milestone is complete only when CI proves the strict workspace checks; the Agent accepts one valid synthetic command and rejects malformed/expired/wrong-scope commands; Python reproducibly demonstrates FedAvg/FedProx local-training semantics; SQLite survives a controlled restart without duplicate terminal work; a direct artifact adapter test verifies checksum/descriptor handling without object locators in logs; and the redacted status snapshot contains no protected content. Commit `2468f4b` has verified the SQLite terminal-restart subset in Hospital Node Quality Gates #2 (18 seconds); it has **not** yet supplied wrong-scope/capability, checksum, retry, or status-projection proof. The public ledger must identify this as **local synthetic validation**, not hospital deployment or clinical readiness.

## 8. References

[1] [Hospital Node Agent Requirements](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/HOSPITAL_NODE_AGENT_REQUIREMENTS.md)

[2] [Hospital Node Agent Data and Schema](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/HOSPITAL_NODE_AGENT_DATA_AND_SCHEMA.md)

[3] [Hospital Node Agent Workflow and Architecture](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/HOSPITAL_NODE_AGENT_WORKFLOW_AND_ARCHITECTURE.md)

[4] [Hospital Node Agent Engineering and API](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/HOSPITAL_NODE_AGENT_ENGINEERING_AND_API.md)
