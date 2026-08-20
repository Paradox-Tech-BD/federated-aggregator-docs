/**
 * Research Ledger design: complete core wiring is presented as an accountable systems record—warm paper, deep ink, mineral teal, and explicit trust boundaries.
 */
import { BadgeCheck, Boxes, Database, FileCheck2, GitBranch, Network, ServerCog, ShieldCheck, Workflow } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { StatusStamp } from "@/components/StatusStamp";
import "./Architecture.css";

const contextMap = `flowchart LR
  Human[Authorized human\nOIDC session] --> API[API edge + NestJS\ncontrol-plane authority]
  Hospital[Hospital workload\nlocal data stays local] -->|machine credential + manifest| API
  Hospital -->|short-lived direct upload/download| Store[(S3-compatible storage\nmodel/evidence artifacts)]
  IdP[OIDC / workload\ncredential issuer] -. identity verification .-> API
  API --> DB[(PostgreSQL\nstate + audit + outbox)]
  API --> Redis[(Redis + BullMQ\ndurable control jobs)]
  Redis --> Dispatch[Node dispatch worker]
  Dispatch --> ML[Python ML worker\nPyTorch calculation boundary]
  ML --> Store
  ML -->|authenticated result callback| API
  classDef actor fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef core fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef worker fill:#22373a,stroke:#22373a,color:#fffdf8
  classDef data fill:#edf0ea,stroke:#788b84,color:#182c32
  class Human,Hospital,IdP actor
  class API,Dispatch core
  class ML worker
  class DB,Redis,Store data`;

const requestMap = `flowchart LR
  A[HTTPS request] --> B[Request + trace context]
  B --> C[Human OIDC or\nworkload credential check]
  C --> D[Hydrate local principal\norg + role + status]
  D --> E[Scope/policy guard\nfederation + round]
  E --> F[Idempotency guard\nfor write command]
  F --> G[Payload + rate guard]
  G --> H[Domain transaction\nstate + audit + outbox]
  H --> I[Safe response]\n  classDef safe fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef gate fill:#f6ead1,stroke:#af9140,color:#182c32
  class B,H,I safe
  class C,D,E,F,G gate`;

const artifactMap = `sequenceDiagram
  autonumber
  participant Site as Hospital workload
  participant API as Aggregator API
  participant DB as PostgreSQL
  participant Store as Object storage
  participant Dispatch as Dispatch worker
  participant ML as Python ML worker
  Site->>API: Request upload intent
  API->>DB: Verify active participant + round + protocol
  API-->>Site: Expiring, scoped upload target + checksum rule
  Site->>Store: Upload update + permitted evidence bundle
  Site->>API: Submit manifest and declared metadata
  API->>DB: Create pending-validation submission + outbox
  Dispatch->>Store: Verify object, size, checksum, immutable metadata
  Dispatch->>ML: Private tensor-compatibility command
  ML-->>API: Signed validation result
  alt every independent check passes
    API->>DB: accepted + validation evidence
  else any check fails
    API->>DB: quarantined + explicit reason code
  end`;

const workerMap = `flowchart TB
  A[Round reaches threshold\nor deadline] --> B[Lock round and freeze\naccepted submission IDs + checksums]
  B --> C[Create AggregationCommand\nwith digest + outbox row]
  C --> D[Queue deterministic job reference]
  D --> E[Node dispatcher reloads\ncanonical frozen command]
  E --> F[Python worker reads only\nlisted base/update artifacts]
  F --> G[Verify tensors + run\ndeclared aggregation policy]
  G --> H[Write candidate + evidence\nwith content digests]
  H --> I[WorkerResult callback\njob ID + command digest]
  I --> J{Expected job, attempt\nand exact digest?}
  J -- yes --> K[Create candidate lineage\nawait evidence/review]
  J -- no --> L[Record callback anomaly\nno candidate mutation]
  classDef safe fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef gate fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef failure fill:#f8e2dc,stroke:#a35b43,color:#4d2921
  class A,B,C,D,E,F,G,H,I,K safe
  class J gate
  class L failure`;

const releaseMap = `stateDiagram-v2
  [*] --> Draft
  Draft --> Collecting: protocol/base/participants locked
  Collecting --> Validating: submission arrives
  Validating --> Collecting: accepted
  Validating --> Quarantined: integrity or compatibility fails
  Collecting --> Aggregating: threshold/deadline freezes input set
  Aggregating --> Candidate: matching worker result
  Aggregating --> AggregationFailed: terminal classified failure
  Candidate --> Evaluating
  Evaluating --> AwaitingApproval: evidence complete
  Evaluating --> EvidenceInsufficient: criteria fail
  AwaitingApproval --> Published: accountable approval
  AwaitingApproval --> Rejected: accountable rejection
  Published --> RolledBack: later governed withdrawal
  Quarantined --> [*]
  Rejected --> [*]
  RolledBack --> [*]`;

const deploymentMap = `flowchart TB
  Ingress[Public ingress\nTLS + limits] --> API[API replicas\nNestJS]
  API --> PG[(Managed PostgreSQL)]
  API --> Redis[(Redis\nqueue-safe persistence)]
  API --> Store[(Private object storage)]
  Redis --> Dispatch[Dispatch-worker replicas]
  Dispatch --> Worker[Python ML-worker pool\nprivate only]
  Dispatch --> PG
  Dispatch --> Store
  Worker --> Store
  Worker -->|private callback| API
  API -. sanitized traces/metrics/logs .-> Otel[Telemetry collector]
  Dispatch -. sanitized traces/metrics/logs .-> Otel
  Worker -. sanitized traces/metrics/logs .-> Otel
  classDef edge fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef app fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef worker fill:#22373a,stroke:#22373a,color:#fffdf8
  classDef data fill:#edf0ea,stroke:#788b84,color:#182c32
  class Ingress edge
  class API,Dispatch app
  class Worker worker
  class PG,Redis,Store,Otel data`;

const components = [
  ["01", "Ingress & identity", "Verifies human and workload identity before NestJS hydrates organization, role, revocation, federation, and round scope."],
  ["02", "NestJS authority", "Owns commands, state transitions, artifact metadata, audit context, release policy, and OpenAPI contracts; it never performs tensor math."],
  ["03", "PostgreSQL ledger", "Stores domain truth, immutable decisions, idempotency records, and transactional outbox rows. Projections are rebuildable; history is not silently overwritten."],
  ["04", "Artifact boundary", "Issues constrained storage intents and records content address, checksum, size, producer, retention class, and lineage; the URI itself proves nothing."],
  ["05", "Queue & dispatcher", "Moves non-sensitive command references through Redis/BullMQ, applies bounded retry classification, and invokes the internal worker against frozen inputs."],
  ["06", "Python compute", "Validates compatible tensors, runs the declared aggregation/evaluation policy, writes candidate evidence, and returns one signed result—without a database credential."],
];

const faultRows = [
  ["Duplicate manifest", "Return the stored idempotent decision; never count one workload twice."],
  ["Checksum or size mismatch", "Quarantine before ML execution and retain a reason-coded validation event."],
  ["Tensor compatibility failure", "The Python worker returns a non-accepted result; no aggregation eligibility is created."],
  ["Queue or worker interruption", "Retry only a transient failure against the same frozen command; terminal failures cannot create a candidate."],
  ["Unknown worker callback", "Record the anomaly and refuse the mutation unless job, attempt, and command digest match exactly."],
  ["Post-release issue", "Append a governed rollback event, stop future distribution, and preserve the prior release evidence."],
];

export default function Architecture() {
  return (
    <div className="doc-page architecture-page">
      <header className="doc-topbar"><p>04 / FULL SYSTEM ARCHITECTURE</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title architecture-title"><p className="folio">04.0 / CORE WIRING, AUTHORITY, AND RECOVERY</p><h1>The core is a control plane,<br /><i>not a data lake.</i></h1><p>A complete research-stage architecture for the central service that authorizes federated work, verifies model-update artifacts, orchestrates Python aggregation, preserves scientific lineage, and releases only governed model versions.</p></section>

      <section className="architecture-charter"><div className="architecture-charter-icon"><Network size={26} /></div><div><span>ARCHITECTURE INVARIANT</span><h2>PostgreSQL decides what happened. Object storage holds bytes. The Python worker performs calculation. No single integration can create an approved release by itself.</h2></div><StatusStamp status="VALIDATED" /></section>

      <section className="architecture-section"><div className="section-heading"><span>01 / SYSTEM CONTEXT AND TRUST BOUNDARY</span><span>RAW DATA STAYS WITH THE HOSPITAL</span></div><MermaidDiagram chart={contextMap} label="System-context wiring: people and hospital workloads meet the NestJS control plane; object storage, queues, a dispatcher, and a Python worker remain inside the core boundary" /><div className="architecture-boundary-grid"><article><ShieldCheck size={20} /><h3>Three identities, never reused</h3><p>Human OIDC sessions, hospital workload credentials, and internal ML-worker credentials map to different principals and authorization paths.</p></article><article><Database size={20} /><h3>One domain authority</h3><p>Only the control plane commits round, candidate, approval, release, audit, and recovery transitions in PostgreSQL.</p></article><article><Boxes size={20} /><h3>Artifacts are evidence objects</h3><p>Weights and metrics bundles carry a checksum, immutable metadata, producer, retention class, and linked domain purpose before they can matter.</p></article></div></section>

      <section className="architecture-section"><div className="section-heading"><span>02 / COMPLETE CONTROL-PLANE WIRING</span><span>PUBLIC REQUEST → TRANSACTIONAL DECISION</span></div><MermaidDiagram chart={requestMap} label="Mandatory request chain: request context, authentication, local principal hydration, scope, idempotency, payload limits, domain transaction, audit, and outbox" /><div className="architecture-component-grid">{components.map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="architecture-section"><div className="section-heading"><span>03 / ARTIFACT INTAKE AND VALIDATION</span><span>DIRECT TRANSFER; INDEPENDENT VERIFICATION</span></div><MermaidDiagram chart={artifactMap} label="Artifact intake sequence: upload intent, direct object-storage transfer, manifest, transactional submission, storage verification, Python validation, and accepted/quarantined decision" /><div className="architecture-caption"><div><FileCheck2 size={20} /><span>VALIDATION RULE</span><strong>Checksum is necessary, not sufficient.</strong></div><p>The dispatcher confirms storage facts such as object presence, byte size, digest, and immutable metadata. The Python worker confirms tensor facts such as architecture identifier, state-dict keys, shapes, dtypes, and finite values. The control plane confirms who submitted the artifact and whether the submission is eligible for the exact frozen protocol and round.</p></div></section>

      <section className="architecture-section"><div className="section-heading"><span>04 / WORKER, OUTBOX, AND CANDIDATE PATH</span><span>FREEZE INPUTS BEFORE NUMERICAL WORK</span></div><MermaidDiagram chart={workerMap} label="Aggregation wiring: freeze accepted input set, persist command digest, enqueue deterministic job reference, invoke the private Python worker, and reconcile only an exact result callback" /><div className="architecture-worker-contract"><div><ServerCog size={23} /><span>WORKER CONTRACT</span><h2>Calculation can be isolated<br />without becoming unaccountable.</h2></div><div className="contract-lanes"><p><b>INPUT</b> Job/attempt identity, protocol/base snapshot, ordered accepted artifact descriptors, declared aggregation policy, environment/seed policy, deadline, and command digest.</p><p><b>OUTPUT</b> Terminal status, exact command digest, candidate/evidence descriptors, accepted/excluded updates, validation summary, environment manifest, warnings, and classified failure reason.</p><p><b>HARD LIMIT</b> The worker holds no PostgreSQL credential, cannot approve a release, and cannot mutate a candidate through a direct database write.</p></div><StatusStamp status="VALIDATED" /></div></section>

      <section className="architecture-section architecture-state-section"><div className="section-heading"><span>05 / CANDIDATE, RELEASE, AND ROLLBACK</span><span>MODEL FILE ≠ RELEASE DECISION</span></div><MermaidDiagram chart={releaseMap} label="Governed lifecycle: draft, collecting, validation, aggregation, candidate, evidence, approval, publication, rejection, rollback, and terminal failure paths" /><div className="architecture-release-grid"><article><GitBranch size={20} /><h3>Immutable lineage</h3><p>Every candidate links its base model, protocol version, frozen input checksums, worker environment, aggregate result, and evidence artifacts.</p></article><article><BadgeCheck size={20} /><h3>Approval is separate</h3><p>Evaluation evidence and accountable human authorization are separate gates. Candidate creation cannot silently publish a model.</p></article><article><Workflow size={20} /><h3>Rollback adds history</h3><p>A release withdrawal stops future distribution by adding an event. It does not erase the previously released model or decision record.</p></article></div></section>

      <section className="architecture-section"><div className="section-heading"><span>06 / DEPLOYMENT, ISOLATION, AND OBSERVABILITY</span><span>PRIVATE SERVICES, EXPLICIT ALLOW PATHS</span></div><MermaidDiagram chart={deploymentMap} label="Deployment wiring: public ingress reaches only API replicas; private PostgreSQL, Redis, storage, dispatch workers, Python workers, and telemetry communicate on explicit internal paths" /><div className="architecture-deployment-note"><div><span>NETWORK POSTURE</span><h2>Default deny, then name every connection.</h2></div><p>The production-candidate design uses private service networking: public ingress reaches the API only; the ML worker has no public ingress; network policy permits only the named API, database, queue, object-storage, worker callback, and telemetry paths. Liveness/readiness/startup probes manage process availability, while application-level heartbeats and deadlines govern actual work progress.</p></div></section>

      <section className="architecture-section"><div className="section-heading"><span>07 / FAILURE CONTAINMENT</span><span>NO RETRY MAY MUTATE SCIENTIFIC INPUTS</span></div><div className="architecture-fault-table">{faultRows.map(([event, response], index) => <article key={event}><span>{String(index + 1).padStart(2, "0")}</span><h3>{event}</h3><p>{response}</p></article>)}</div></section>

      <section className="architecture-gates"><div><span>IMPLEMENTATION GATES</span><h2>Approve the wires before building the services.</h2></div><ol><li>Approve the principal, workload, and scope model for each public and private endpoint.</li><li>Approve the artifact intent, manifest, verification, quarantine, and retention rules.</li><li>Approve the frozen aggregation command and signed worker-result schemas.</li><li>Approve the outbox/idempotency/retry classifications and recovery permissions.</li><li>Approve the candidate, evidence, release, and rollback event vocabulary before creating migrations.</li></ol></section>
    </div>
  );
}
