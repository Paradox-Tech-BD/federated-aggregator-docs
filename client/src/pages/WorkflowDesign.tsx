/**
 * Research Ledger design: workflow is rendered as accountable evidence flow—warm paper, deep ink, mineral teal, and explicit decision states.
 */
import { Activity, BadgeCheck, FileCheck2, GitFork, ShieldAlert, TimerReset, Workflow } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { StatusStamp } from "@/components/StatusStamp";

const actorFlow = `flowchart LR
  A[Research Admin] -->|protocol + round command| B[Aggregator API]
  B --> C[(PostgreSQL\nstate + audit)]
  B --> D[Job coordinator]
  D --> E[Python ML worker]
  E --> F[(Artifact store\nchecksum-addressed)]
  H[Hospital node\nlocal data stays local] -->|update artifact + manifest| B
  F -->|approved base / release artifacts| H
  E -->|candidate + evidence| B
  G[Release authority] -->|approval / rejection / rollback| B
  classDef core fill:#eef5f2,stroke:#0d7c78,color:#182c32
  classDef actor fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef boundary fill:#22373a,stroke:#22373a,color:#fffdf8
  class A,G actor
  class B,C,D,E,F core
  class H boundary`;

const roundFlow = `sequenceDiagram
  autonumber
  participant Admin as Research Admin
  participant API as Aggregator API
  participant DB as PostgreSQL
  participant Store as Artifact Store
  participant Node as Eligible Hospital Node
  Admin->>API: Create round with protocol + base model
  API->>DB: Lock immutable protocol/base snapshot
  API->>DB: Verify node eligibility
  alt selection conflicts with eligibility
    API-->>Admin: 409 correct participant set
  else selection is valid
    API->>DB: Create draft round and invitation records
    Admin->>API: Open round with idempotency key
    API->>DB: Transition draft to collecting
    API->>Store: Constrain access to base artifact
    API-->>Node: Manifest, checksum, deadline, model access
  end`;

const intakeFlow = `flowchart TD
  A[Submission received] --> B[Verify workload identity]
  B --> C{Eligible for frozen protocol?}
  C -- no --> C1[Reject\neligibility reason + audit]
  C -- yes --> D{Round collecting\nbefore deadline?}
  D -- no --> D1[Reject\nlate or closed round]
  D -- yes --> E{Accepted contribution exists\nfor this node and round?}
  E -- yes --> E1[Return prior idempotent decision]
  E -- no --> F[Check manifest, base, architecture, preprocessing]
  F --> G{Compatible?}
  G -- no --> G1[Quarantine\nprotocol mismatch]
  G -- yes --> H[Recalculate checksum + byte size]
  H --> I{Integrity matches?}
  I -- no --> I1[Quarantine\nintegrity mismatch]
  I -- yes --> J[Python worker validates allowed tensor structure + finite values]
  J --> K{Numerically valid?}
  K -- no --> K1[Quarantine\nunsafe or malformed update]
  K -- yes --> L[Accept submission\nfreeze validation report]
  L --> M[Count only this accepted contribution]
  classDef accepted fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef decision fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef failure fill:#f8e2dc,stroke:#a35b43,color:#4d2921
  class L,M accepted
  class C,D,E,G,I,K decision
  class C1,D1,E1,G1,I1,K1 failure`;

const aggregationFlow = `sequenceDiagram
  autonumber
  participant API as Aggregator API
  participant DB as PostgreSQL
  participant Queue as Job Coordinator
  participant Worker as Python ML Worker
  participant Store as Artifact Store
  API->>DB: Seal accepted input set and enter aggregating
  API->>DB: Create aggregation run with frozen checksums
  API->>Queue: Enqueue aggregate job
  Queue->>Worker: Deliver immutable command
  Worker->>Store: Fetch base + verified update artifacts
  Worker->>Worker: Re-verify inputs and run declared aggregation
  alt validation or worker failure
    Worker->>DB: Mark run failed and record reason
  else output created
    Worker->>Store: Write immutable candidate artifact
    Worker->>DB: Save candidate lineage + output checksum
    Worker->>DB: Transition round to awaiting approval
  end`;

const releaseFlow = `flowchart LR
  A[Candidate model] --> B[Evidence completeness check]
  B --> C{Integrity, lineage,\nevaluation and notes complete?}
  C -- no --> D[Blocked candidate\nmissing-evidence record]
  C -- yes --> E[Release authority review]
  E --> F{Decision}
  F -- reject --> G[Rejected candidate\nrationale retained]
  F -- changes --> H[Return to evidence work]
  F -- approve --> I[Immutable release manifest\nmodel card + compatibility]
  I --> J[Published research release]
  J --> K{Post-release issue?}
  K -- no --> L[Retain published state]
  K -- yes --> M[Authorized rollback\nstop future distribution]
  classDef evidence fill:#eef5f2,stroke:#0d7c78,color:#182c32
  classDef decision fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef failure fill:#f8e2dc,stroke:#a35b43,color:#4d2921
  classDef release fill:#22373a,stroke:#22373a,color:#fffdf8
  class A,B,E,I evidence
  class C,F,K decision
  class D,G,H,M failure
  class J,L release`;

const recoveryFlow = `flowchart TD
  A[Durable job begins] --> B{Terminal idempotency record exists?}
  B -- yes --> C[Return stored result]
  B -- no --> D[Work only against frozen input snapshot]
  D --> E{Succeeded before output commit?}
  E -- yes --> F[Atomically commit output + terminal state]
  E -- no --> G[Record failure reason + attempt metadata]
  G --> H{Retryable infrastructure failure\nand attempts remain?}
  H -- yes --> I[Bounded backoff retry\nsame input snapshot]
  I --> D
  H -- no --> J[Terminal failed\nnotify authorized operator]
  F --> K[Append audit event]
  J --> K
  classDef safe fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef decision fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef failure fill:#f8e2dc,stroke:#a35b43,color:#4d2921
  class C,F,K safe
  class B,E,H decision
  class G,J failure`;

const controls = [
  ["01", "Data minimization", "The core stores verified model artifacts and permitted evidence envelopes. It has no workflow step for raw images, local datasets, or patient identifiers."],
  ["02", "Scientific provenance", "The immutable protocol records the client-local strategy. FedProx μ is declared provenance, not a property inferred from server averaging."],
  ["03", "Reproducible computation", "Aggregation freezes accepted update identifiers, input checksums, protocol version, base model, and aggregation command before numerical work begins."],
  ["04", "Governed publication", "Candidate creation, evaluation evidence, accountable approval, publication, and rollback are separate transitions with distinct durable records."],
];

const exceptionRows = [
  ["Duplicate submission", "Return the original result from the idempotency record; never count a node twice."],
  ["Deadline or insufficient set", "Seal collection; aggregate only if the frozen protocol threshold is met, otherwise close with a reason."],
  ["Integrity or compatibility failure", "Quarantine and exclude the artifact; permit corrected resubmission only while collection remains open."],
  ["Worker failure", "Retry only against the same frozen input set; terminal failure never creates a partial candidate."],
  ["Published-model issue", "Authorize rollback to stop future distribution while preserving the original decision and evidence."],
];

export default function WorkflowDesign() {
  return (
    <div className="doc-page workflow-page">
      <header className="doc-topbar"><p>05 / WORKFLOW DESIGN</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title"><p className="folio">05.0 / GOVERNED ROUND-TO-RELEASE ORCHESTRATION</p><h1>Make every transition<br /><i>answerable to evidence.</i></h1><p>The Aggregator Core coordinates a research release from protocol activation through accepted update artifacts, deterministic aggregation, review, publication, and recovery—without becoming a hospital-data repository.</p></section>

      <section className="workflow-charter"><div className="workflow-charter-icon"><Workflow size={25} /></div><div><span>WORKFLOW PRINCIPLE</span><h2>A model file is not a release. A release is a versioned decision supported by compatible inputs, verifiable computation, evaluation evidence, and accountable approval.</h2></div><StatusStamp status="VALIDATED" /></section>

      <section className="workflow-section"><div className="section-heading"><span>01 / ACTOR AND DATA BOUNDARY</span><span>CONTROL PLANE ≠ LOCAL DATA PLANE</span></div><MermaidDiagram chart={actorFlow} label="Workflow actor map: research admin, aggregator API, database, coordinator, Python worker, artifact store, hospital node, and release authority" /><div className="workflow-boundary"><div><ShieldAlert size={19} /><h3>Hospital data stays local</h3><p>External nodes train and evaluate in their institutional boundary. They submit only a permitted artifact and evidence manifest.</p></div><div><GitFork size={19} /><h3>FedProx stays client-side</h3><p>The protocol records declared local strategy and μ. The server validates provenance, then runs its declared aggregation rule.</p></div><div><FileCheck2 size={19} /><h3>Evidence remains durable</h3><p>Protocol versions, checksums, validation reports, aggregation runs, evaluation records, approvals, and rollbacks form the release trail.</p></div></div></section>

      <section className="workflow-section"><div className="section-heading"><span>02 / ROUND OPENING</span><span>FROZEN PROTOCOL + BASE MODEL + ELIGIBLE NODES</span></div><MermaidDiagram chart={roundFlow} label="Round-opening sequence: lock protocol and base model, verify participants, record invitations, then provide constrained access" /><div className="workflow-caption"><span>ROUND CONTRACT</span><p>Each invitation points to one immutable protocol version and base model checksum, constrains artifact access to the selected node, and carries a deadline. Any protocol change produces a new version; a running round never shifts beneath a hospital node.</p></div></section>

      <section className="workflow-section"><div className="section-heading"><span>03 / UPDATE INTAKE AND QUARANTINE</span><span>VALIDATE BEFORE A WEIGHT CAN COUNT</span></div><MermaidDiagram chart={intakeFlow} label="Submission validation workflow: authorization, round state, deduplication, compatibility, checksum, numeric validation, acceptance, rejection, and quarantine" /><div className="workflow-intake-grid"><article><BadgeCheck size={19} /><h3>Accepted once</h3><p>Only one validated contribution can become accepted for a node/round pair. Duplicate retries return the existing decision rather than increasing aggregation weight.</p></article><article><ShieldAlert size={19} /><h3>Quarantine with reason</h3><p>Checksum mismatches, incompatible model/preprocessing contracts, or non-finite numeric values cannot enter aggregation. They receive auditable reason codes.</p></article><article><Activity size={19} /><h3>Metrics are labeled</h3><p>Hospital-reported metrics remain distinct from aggregator-controlled evaluation. Neither is silently promoted into a clinical-performance claim.</p></article></div></section>

      <section className="workflow-section"><div className="section-heading"><span>04 / AGGREGATION AND CANDIDATE LINEAGE</span><span>IMMUTABLE INPUT SET, REPEATABLE COMMAND</span></div><MermaidDiagram chart={aggregationFlow} label="Aggregation sequence: seal accepted set, run durable job, verify inputs, write candidate model, and retain full lineage" /><div className="workflow-provenance"><div><span>SERVER BASELINE</span><strong>Weighted FedAvg when the frozen protocol permits it.</strong></div><p>The worker snapshots accepted submissions, verified checksums, the base model, and the aggregation configuration before it computes. Declared FedProx settings travel as client-side provenance and do not alter the meaning of the server aggregation rule.</p><StatusStamp status="VALIDATED" /></div></section>

      <section className="workflow-section"><div className="section-heading"><span>05 / EVALUATION, APPROVAL, AND RELEASE</span><span>CANDIDATE IS NOT PUBLISHED</span></div><MermaidDiagram chart={releaseFlow} label="Release workflow: evidence completeness, review decision, immutable release manifest, publication, and rollback" /><div className="workflow-evidence-grid">{controls.map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="workflow-section"><div className="section-heading"><span>06 / FAILURE, RETRY, AND CONTAINMENT</span><span>SAFE RECOVERY NEVER MUTATES SCIENTIFIC INPUTS</span></div><MermaidDiagram chart={recoveryFlow} label="Recovery workflow: idempotency, frozen-input retry, atomic commit, terminal failure, and audit event" /><div className="workflow-exceptions">{exceptionRows.map(([event, response]) => <article key={event}><TimerReset size={16} /><div><h3>{event}</h3><p>{response}</p></div></article>)}</div></section>

      <section className="workflow-gates"><div><span>WORKFLOW DECISION GATES</span><h2>Approve the operating rules before writing the orchestration service.</h2></div><ol><li>Confirm the protocol schema, client-side FedProx declaration, and eligibility requirements.</li><li>Confirm accepted-submission threshold, deadline policy, and artifact representation.</li><li>Confirm evaluation evidence labels and accountable release-approval authority.</li><li>Confirm retention, audit-export, rollback, and participant-withdrawal behavior.</li></ol></section>
    </div>
  );
}
