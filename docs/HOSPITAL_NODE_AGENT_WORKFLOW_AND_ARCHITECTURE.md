# Hospital Node Agent — Workflow and Architecture Design

## 1. Normal operation workflow

```mermaid
sequenceDiagram
  autonumber
  participant O as Site Operator
  participant A as Node Agent (TS)
  participant C as Aggregator Core
  participant S as Scoped Object Storage
  participant T as Local Python Trainer
  participant D as Local Dataset Adapter

  O->>A: provision binding + local configuration
  A->>C: authenticate workload / pull assignment
  C-->>A: immutable command + digest + deadline
  A->>A: validate schema, scope, protocol, model compatibility
  A->>D: run local-only preflight declaration
  D-->>A: compatible / bounded safe declaration
  A->>C: obtain scoped model-read + update-upload capabilities
  A->>S: download base model directly
  A->>T: execute frozen local recipe (μ, epochs, seed policy)
  T->>D: read local samples only
  T-->>A: update bytes + bounded training summary
  A->>S: upload update bytes directly
  A->>C: submit descriptor, checksum, manifest, idempotency key
  C-->>A: accepted / rejected / retryable
  A->>A: append redacted local evidence
```

The Core is not authorized to initiate a local shell command, browse local data, or pull bytes from the Agent. The Agent does not choose an aggregation rule, alter a sealed command, approve a candidate, or publish a model. The design supports the thesis FedProx configuration by treating `μ`, local epochs, optimizer, model version, and preprocessing version as frozen command inputs.[1]

## 2. Exception workflow

```mermaid
flowchart TD
  A[Assignment received] --> B{Binding, scope, schema, deadline valid?}
  B -- no --> R[Reject locally with safe reason]
  B -- yes --> C{Dataset declaration compatible?}
  C -- no --> Q[Quarantine assignment; submit bounded incompatibility]
  C -- yes --> D{Training completes within cap?}
  D -- no --> I[Persist interrupted/failed run; no artifact submission]
  D -- yes --> E{Upload and checksum verified?}
  E -- no --> U[Classify retryability; renew capability only when allowed]
  E -- yes --> F{Core submission outcome}
  F -- accepted --> G[Terminal accepted evidence]
  F -- retryable --> U
  F -- rejected --> H[Terminal rejected evidence; do not retrain]
  U --> J{Retry budget and deadline valid?}
  J -- yes --> E
  J -- no --> I
```

## 3. Architecture

```mermaid
flowchart LR
  subgraph Site[Institution-controlled boundary]
    OP[Local operator]
    subgraph Agent[Hospital Node Agent]
      TS[TypeScript control service]
      DB[(Local SQLite control state)]
      PY[Python trainer]
      AD[Allowlisted dataset adapter]
      WS[Ephemeral model workspace]
    end
    DATA[(Local research dataset)]
    OP --> TS
    TS <--> DB
    TS --> PY
    PY --> AD --> DATA
    PY --> WS
  end
  subgraph CoreBoundary[Aggregator Core boundary]
    API[Workload API]
    ID[Workload identity verifier]
    OBJ[Scoped object storage]
    CTRL[Round / protocol authority]
  end
  TS <--> API
  TS --> ID
  TS <--> CTRL
  WS <--> OBJ
```

The local adapter is a strict port, not a filesystem endpoint. In v1, it supports only generated tensors and an explicit simulated public-dataset profile. Future adapters for real institutional systems must be added independently behind the same interface and cannot receive implicit network access.

## 4. Deployment topology

| Component | Network exposure | Persistent state | Lifecycle |
|---|---|---|---|
| TypeScript agent | Outbound HTTPS to the Core only; operator status bound to localhost/test private network. | SQLite control database. | Long-lived local service. |
| Python trainer | No inbound network listener. | Ephemeral workspace; optional local-safe checkpoint policy. | Spawned per validated assignment. |
| Dataset adapter | No network requirement. | Existing institution-controlled files or generated fixture. | Invoked by trainer only. |
| Object transfer | Direct signed/capability request to allowed object path. | External artifact bytes. | Time-limited capability. |

No Azure deployment is implied for the future real hospital node. The first test deployment is a **simulated site** placed in a separate Docker Compose profile, connected only to the existing private Azure Core boundary and synthetic fixtures.

## References

[1] [Thesis FedProx Methodology](https://github.com/hstu-research/thesis_breast_cancer/blob/main/result/fedprox-result/paper_sections/methodology.md)
