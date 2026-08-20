/**
 * Research Ledger design: schema chapter groups data by governance, scientific lineage, operations, and release evidence.
 */
import { ArchiveRestore, Database, FileLock2, GitFork, HardDrive, ShieldCheck, Workflow } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { StatusStamp } from "@/components/StatusStamp";

const governanceEr = `erDiagram
  USERS ||--o{ MEMBERSHIPS : holds
  ORGANIZATIONS ||--o{ MEMBERSHIPS : includes
  ORGANIZATIONS ||--o{ WORKLOADS : owns
  FEDERATIONS ||--o{ FEDERATION_PARTICIPANTS : invites
  ORGANIZATIONS ||--o{ FEDERATION_PARTICIPANTS : joins
  WORKLOADS ||--o{ FEDERATION_PARTICIPANTS : operates
  FEDERATIONS ||--o{ PROTOCOL_VERSIONS : defines
  USERS ||--o{ AUDIT_EVENTS : performs
  USERS {
    uuid id PK
    string oidc_subject UK
    string email
    string status
    timestamptz created_at
  }
  ORGANIZATIONS {
    uuid id PK
    string name
    string status
  }
  MEMBERSHIPS {
    uuid id PK
    uuid user_id FK
    uuid organization_id FK
    string role
    string status
  }
  WORKLOADS {
    uuid id PK
    uuid organization_id FK
    string credential_subject UK
    string workload_kind
    string status
  }
  FEDERATIONS {
    uuid id PK
    uuid owner_organization_id FK
    string name
    string status
  }
  FEDERATION_PARTICIPANTS {
    uuid id PK
    uuid federation_id FK
    uuid organization_id FK
    uuid workload_id FK
    string participation_status
  }
  PROTOCOL_VERSIONS {
    uuid id PK
    uuid federation_id FK
    integer version
    string algorithm
    jsonb immutable_config
  }
  AUDIT_EVENTS {
    uuid id PK
    uuid actor_id FK
    string action
    string correlation_id
    timestamptz occurred_at
  }`;

const scienceEr = `erDiagram
  PROTOCOL_VERSIONS ||--o{ ROUNDS : governs
  MODEL_VERSIONS ||--o{ ROUNDS : starts
  ROUNDS ||--o{ UPDATE_SUBMISSIONS : receives
  ARTIFACTS ||--o{ UPDATE_SUBMISSIONS : describes
  ROUNDS ||--o{ AGGREGATION_JOBS : dispatches
  AGGREGATION_JOBS ||--|| MODEL_VERSIONS : creates
  MODEL_VERSIONS ||--o{ EVALUATION_RUNS : assessed_by
  MODEL_VERSIONS ||--o{ MODEL_RELEASE_EVENTS : transitions
  ARTIFACTS {
    uuid id PK
    string storage_key UK
    string sha256 UK
    bigint byte_size
    string artifact_kind
    string retention_class
  }
  ROUNDS {
    uuid id PK
    uuid protocol_version_id FK
    uuid base_model_version_id FK
    string state
    timestamptz deadline_at
  }
  UPDATE_SUBMISSIONS {
    uuid id PK
    uuid round_id FK
    uuid workload_id FK
    uuid artifact_id FK
    string validation_status
    string reason_code
    jsonb manifest
  }
  AGGREGATION_JOBS {
    uuid id PK
    uuid round_id FK
    string status
    jsonb immutable_command
    uuid result_artifact_id FK
  }
  MODEL_VERSIONS {
    uuid id PK
    uuid round_id FK
    uuid artifact_id FK
    string state
    string lineage_digest
  }
  EVALUATION_RUNS {
    uuid id PK
    uuid model_version_id FK
    string status
    uuid evidence_artifact_id FK
    jsonb metric_summary
  }
  MODEL_RELEASE_EVENTS {
    uuid id PK
    uuid model_version_id FK
    string event_type
    uuid actor_id FK
    jsonb evidence_refs
  }`;

const lineageFlow = `flowchart LR
  P[Protocol version\nimmutable method] --> R[Round\nthreshold + deadline]
  R --> M[Update manifest\nno raw data]
  M --> V{Validation}
  V -->|accepted| J[Aggregation job\nimmutable command]
  V -->|failed| Q[Quarantine record\nreason + owner]
  J --> C[Candidate model\ndigest + lineage]
  C --> E[Evaluation evidence\nmetrics + environment]
  E --> A{Human approval}
  A -->|approved| L[Published release\nmodel card + rollback]
  A -->|rejected| X[Rejected candidate\nretained evidence]
  classDef source fill:#eef5f2,stroke:#0d7c78,color:#182c32
  classDef decision fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef failure fill:#f8e6df,stroke:#a35b43,color:#4d2921
  classDef release fill:#22373a,stroke:#22373a,color:#fffdf8
  class P,R,M,J,C,E source
  class V,A decision
  class Q,X failure
  class L release`;

const groups = [
  ["01", "Identity and federation governance", "users, organizations, memberships, workloads, federations, federation_participants, participation_agreements, protocol_versions", "Represents who may act, which institution operates a workload, and which immutable protocol governs a round."],
  ["02", "Artifact and submission management", "artifacts, artifact_retention_rules, artifact_deletion_events, update_submissions, submission_validation_events", "Stores digest-backed metadata and validation evidence for weights and metrics—not raw images, patient identifiers, or local datasets."],
  ["03", "Round, job, and scientific lineage", "rounds, round_events, aggregation_jobs, worker_attempts, evaluation_runs, experiment_evidence", "Reconstructs exactly how a protocol produced a candidate, including retry, timeout, environment, and seed policy."],
  ["04", "Model registry and release ledger", "model_versions, model_release_events, model_cards, release_approvals, rollback_links", "Preserves candidate, approved, published, deprecated, rejected, and rolled-back statuses as append-only events."],
  ["05", "Operations and security evidence", "audit_events, outbox_events, api_idempotency, security_incidents, access_reviews", "Provides accountable recovery, redacted operational traceability, and prevention of duplicate side effects."],
];

export default function DataManagement() {
  return (
    <div className="doc-page data-page">
      <header className="doc-topbar"><p>07 / DATA MANAGEMENT</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title"><p className="folio">07.0 / DATA, ARTIFACT, AND EVIDENCE LINEAGE</p><h1>Store the proof.<br /><i>Not the patient data.</i></h1><p>The aggregator needs enough durable information to reconstruct a research release, resolve failures, and govern access—while never becoming a centralized hospital-data repository.</p></section>

      <section className="data-charter"><div><Database size={22} /><span>DATA MANAGEMENT PRINCIPLE</span></div><h2>Patient data remains under institutional control. The core stores governance facts, immutable protocol records, verified artifact descriptors, scientific lineage, and release evidence.</h2><StatusStamp status="VALIDATED" /></section>

      <section className="data-boundary-grid"><article><HardDrive size={19} /><h3>Stored in the core</h3><p>Identifiers for organizations/workloads, protocol/round records, model and metrics artifacts, SHA-256 digests, manifests, validation results, approvals, audit events, and retention decisions.</p></article><article><FileLock2 size={19} /><h3>Never stored in the core</h3><p>Raw breast images, patient identifiers, local dataset copies, direct clinical records, plaintext workload credentials, authorization headers, or unredacted incident payloads.</p></article><article><ArchiveRestore size={19} /><h3>Retained as evidence</h3><p>Rejected/quarantined submissions, cancelled rounds, negative FedProx results, and release rollbacks remain traceable. Corrections create new events; they do not erase history.</p></article></section>

      <section className="data-section"><div className="section-heading"><span>01 / GOVERNANCE RELATIONSHIPS</span><span>WHO MAY PARTICIPATE AND UNDER WHICH PROTOCOL</span></div><MermaidDiagram chart={governanceEr} label="Governance ERD — identity, institution, workload, federation, protocol, and audit relationships" /></section>

      <section className="data-section"><div className="section-heading"><span>02 / SCIENTIFIC AND ARTIFACT LINEAGE</span><span>WHAT PRODUCED A CANDIDATE MODEL</span></div><MermaidDiagram chart={scienceEr} label="Scientific ERD — protocol, round, submission, artifact, aggregation, evaluation, model, and release relationships" /></section>

      <section className="data-section"><div className="section-heading"><span>03 / CANDIDATE-TO-RELEASE EVIDENCE FLOW</span><span>WHY A CHECKPOINT IS NEVER ENOUGH</span></div><MermaidDiagram chart={lineageFlow} label="Evidence flow — immutable records from protocol to published or rejected outcome" /></section>

      <section className="data-section"><div className="section-heading"><span>04 / SCHEMA GROUPS</span><span>DATA MODEL BY RESPONSIBILITY</span></div><div className="data-group-list">{groups.map(([index, title, entities, purpose]) => <article key={index}><span>{index}</span><div><h3>{title}</h3><code>{entities}</code><p>{purpose}</p></div></article>)}</div></section>

      <section className="data-columns"><article><div className="panel-kicker"><GitFork size={16} /> INTEGRITY AND LINEAGE</div><h2>Every artifact is a versioned evidence object.</h2><p>An artifact record has an opaque storage key, SHA-256, size, content type, producer/code version, source job, retention class, and lineage reference. A URI alone is never accepted as proof. Manifests, commands, and results are immutable once a job or release references them.</p><ul><li>Direct site upload uses short-lived, round-scoped intent.</li><li>Artifact validation checks digest, type, size, protocol, and base-model lineage.</li><li>Deletion/retention actions create audit events and never silently remove evidence.</li></ul></article><article className="data-dark"><div className="panel-kicker"><ShieldCheck size={16} /> RETENTION AND PRIVACY</div><h2>Keep only what governance and reproducibility require.</h2><p>Protocol, model-lineage, approval, and release evidence are retained according to the federation agreement. Operational logs use shorter retention and redaction. The system has no schema field for patient-level records or raw imaging paths.</p><div className="retention-states"><span>ACTIVE</span><span>LEGAL HOLD</span><span>RETENTION DUE</span><span>DELETION RECORDED</span></div></article></section>

      <section className="data-gates"><div><Workflow size={21} /><span>SCHEMA DECISION GATES</span><h2>Approve the records before building tables.</h2></div><ol><li>Confirm the core stores only artifact metadata and research evidence, never raw hospital data.</li><li>Confirm append-only release/audit events and immutable referenced protocol versions.</li><li>Confirm retention, legal-hold, and deletion decisions are explicit records.</li><li>Confirm data model first, then generate migrations and OpenAPI schemas from the approved entities.</li></ol></section>
    </div>
  );
}
