/**
 * Research Ledger design: the handoff chapter makes build scope and deferred complexity inspectable before the first production repository is scaffolded.
 */
import { BadgeCheck, Blocks, Bot, CheckCircle2, ClipboardList, KeyRound, LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { StatusStamp } from "@/components/StatusStamp";
import "./ImplementationPlan.css";

const scopeFlow = `flowchart LR
  Human[Human administrator\nOIDC / Clerk optional] --> LocalUser[Local user + membership\nscoped policy]
  LocalUser --> Core[Aggregator Core\nresearch-release control plane]
  Workload[Hospital node / ML worker\nshort-lived workload credential] --> LocalWorkload[Local workload record\nstatus + federation scope]
  LocalWorkload --> Core
  Core --> Evidence[Protocol · round · artifact descriptor\njob · evidence · release ledger]
  Core -. never accepts .-> Raw[Raw images · patient IDs\nlocal datasets]
  Wallet[MetaMask / SIWE\noptional future human factor] -. deferred in v1 .-> Core
  classDef auth fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef core fill:#22373a,stroke:#22373a,color:#fffdf8
  classDef evidence fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef denied fill:#f8e6df,stroke:#a35b43,color:#4d2921
  class Human,LocalUser,Workload,LocalWorkload auth
  class Core core
  class Evidence,Wallet evidence
  class Raw denied`;

const migrationMap = `flowchart TB
  M1[001 Foundation\nconstraints + migration ledger] --> M2[002 Identity + organization\nuser, membership, workload]
  M2 --> M3[003 Federation + protocol + round\nimmutable method and transitions]
  M3 --> M4[004 Artifact + submission\nintent, manifest, validation]
  M4 --> M5[005 Jobs + evidence\nfrozen command + worker attempt]
  M5 --> M6[006 Model + release\ncandidate, approval, rollback]
  M6 --> M7[007 Operations + retention\naudit, outbox, idempotency]
  classDef phase fill:#e2efed,stroke:#0d7c78,color:#182c32
  class M1,M2,M3,M4,M5,M6,M7 phase`;

const phases = [
  ["0", "Foundation", "Private repository, workspace roots, strict lint/type/format rules, CI, secrets policy, fixture policy, and local dependency compose.", "Static quality suite passes on a clean checkout."],
  ["1", "Identity, governance, and pure domain", "Local users/memberships/workloads; OIDC verifier port; federation/protocol/round aggregates; scoped policies; audit context.", "Authorization and transition matrices pass without NestJS or a database."],
  ["2", "API and transactional state", "NestJS composition, strict DTO validation, PostgreSQL repositories/migrations, idempotency, audit/outbox transaction, health/readiness.", "A real database proves state, audit, and outbox are atomic."],
  ["3", "Artifact and submission pipeline", "MinIO/S3 intent, manifest intake, node-side verification, Python compatibility outcome, quarantine records.", "Invalid scope, digest, deadline, and base-model cases remain durable and idempotent."],
  ["4", "Worker contract and numerical baseline", "Node/Python schemas and fixtures, dispatcher, Python ML core/worker, callback reconciliation, deterministic FedAvg/FedProx-compatible validation.", "Synthetic job produces a checked candidate; stale/malformed results cannot mutate the ledger."],
  ["5", "Candidate and release governance", "Evaluation evidence, model card, approval, publish/deprecate/rollback, release package.", "No release occurs without evidence and scoped human authorization."],
  ["6", "Resilience and operations", "Telemetry, replay/recovery controls, access review, audit export, retention records, incident pathway.", "Controlled outage cannot silently alter frozen scientific input or duplicate a release."],
  ["7", "Administrator portal", "Separate React portal using Clerk/OIDC if selected; session, admin workflows, operator accessibility/browser tests.", "Backend local authorization defeats any client-only display state."],
];

const schemaGroups = [
  ["01", "Human, organization, and workload governance", "users · organizations · memberships · workloads · workload_credential_bindings", "A local human profile/membership is required. A workload is an explicitly separate non-human principal."],
  ["02", "Federation and scientific method", "federations · federation_participants · participation_agreements · protocol_versions · local_data_declarations · rounds · round_events", "Records who collaborates, the immutable method, and every governed state transition."],
  ["03", "Artifact and update evidence", "artifacts · artifact_upload_intents · update_submissions · submission_validation_events · artifact_deletion_events", "Stores descriptors, digests, metadata, and evidence—never raw breast images or patient records."],
  ["04", "Jobs, candidate lineage, and releases", "aggregation_jobs · worker_attempts · evaluation_runs · experiment_evidence · model_versions · model_cards · model_release_events · release_approvals · rollback_links", "Makes numerical input, environment, evaluation, approval, publication, and rollback reconstructable."],
  ["05", "Operations and retention", "audit_events · api_idempotency · outbox_events · security_incidents · access_reviews · retention_policies", "Provides durable accountability, safe retry, recovery, security response, and deletion governance."],
];

const decisionRows = [
  ["Human sign-in", "Required", "OIDC-compatible provider. Clerk is the preferred managed option for the later admin portal; Keycloak remains the self-hosted alternative."],
  ["Local user/membership records", "Required", "PostgreSQL remains the authorization and audit truth for federation scope, roles, revocation, and release approval."],
  ["Hospital/worker workload identity", "Required", "Separate short-lived credential plus narrow audience/scope. Browser session tokens must never be reused as machine credentials."],
  ["Clerk Organizations/SSO", "Optional managed UX", "Useful for human sign-in, MFA, invitation, and enterprise SSO. Its context may be synchronized, never treated as final core policy."],
  ["MetaMask / SIWE", "Deferred", "No v1 requirement for wallet identity, on-chain action, or self-custody. Later only as an optional human factor with separate privacy/threat review."],
];

export default function ImplementationPlan() {
  return (
    <div className="doc-page implementation-page">
      <header className="doc-topbar"><p>09 / IMPLEMENTATION HANDOFF</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title implementation-title"><p className="folio">09.0 / PRODUCT-CORE BUILD SEQUENCE AND IDENTITY DECISION</p><h1>Handoff the rules.<br /><i>Then build the release path.</i></h1><p>This plan converts the approved requirements, architecture, workflow, data model, and engineering standards into bounded implementation slices. It defines exactly what the first core owns, what schema it needs, and what identity complexity is deliberately deferred.</p></section>

      <section className="implementation-decision"><div className="decision-icon"><KeyRound size={26} /></div><div><span>IDENTITY DECISION — V1</span><h2>Use OIDC for humans, local PostgreSQL policy for authority, and distinct short-lived credentials for workloads.</h2><p>Clerk is a supported managed human-auth choice for the future administrator portal. MetaMask is technically compatible with Clerk, but remains disabled: a wallet does not satisfy institution membership, release authority, workload identity, or the core’s privacy boundary.</p></div><StatusStamp status="VALIDATED" /></section>

      <section className="implementation-section"><div className="section-heading"><span>01 / WHAT THE CORE ACTUALLY OWNS</span><span>RESEARCH-RELEASE CONTROL PLANE; NOT A HOSPITAL DATA PLATFORM</span></div><MermaidDiagram chart={scopeFlow} label="First-release scope: separate human and workload identity records flow to the core, which owns research evidence and rejects raw data; wallet sign-in is deferred" /><div className="implementation-feature-grid"><article><Blocks size={20} /><h3>Govern collaboration</h3><p>Federations, institutions, memberships, workloads, agreements, immutable protocols, participant snapshots, rounds, and scope checks.</p></article><article><Bot size={20} /><h3>Coordinate computation</h3><p>Artifact intents/manifests, validation/quarantine, frozen worker commands, dispatch, callback reconciliation, and reproducibility evidence.</p></article><article><ShieldCheck size={20} /><h3>Govern release</h3><p>Candidate lineage, evaluation evidence, human approval, publication, deprecation, rollback, audit, retention, and recovery.</p></article><article><LockKeyhole size={20} /><h3>Exclude by design</h3><p>Raw images, patient IDs, local datasets, hospital UI/backend products, wallet-required access, blockchain/IPFS, and automatic clinical deployment.</p></article></div></section>

      <section className="implementation-section"><div className="section-heading"><span>02 / INCLUDED POSTGRESQL SCHEMA</span><span>THE MINIMUM DURABLE RECORD FOR GOVERNANCE AND REPRODUCIBILITY</span></div><div className="implementation-schema-list">{schemaGroups.map(([index, title, entities, copy]) => <article key={index}><span>{index}</span><div><h3>{title}</h3><code>{entities}</code><p>{copy}</p></div></article>)}</div></section>

      <section className="implementation-section"><div className="section-heading"><span>03 / USER SUBSYSTEM, CLERK, AND METAMASK</span><span>AUTHENTICATION IS NOT AUTHORIZATION</span></div><div className="implementation-decision-table"><div><span>CONCERN</span><span>V1 STATUS</span><span>IMPLEMENTATION BOUNDARY</span></div>{decisionRows.map(([concern, status, detail]) => <article key={concern}><h3>{concern}</h3><b className={status.toLowerCase().replaceAll(" ", "-")}>{status}</b><p>{detail}</p></article>)}</div><div className="implementation-clerk-note"><BadgeCheck size={21} /><div><span>IF CLERK IS SELECTED</span><h2>Let Clerk prove a human sign-in. Let the core prove the permission.</h2></div><p>NestJS verifies issuer, audience, signature/JWKS, and token time bounds; then it maps immutable `iss + sub` to local `users`. Clerk webhooks may reconcile profile state but cannot self-grant a role. Clerk Organization context supports portal UX/enterprise SSO, while local memberships govern every consequential backend action.</p></div><div className="implementation-wallet-note"><WalletCards size={21} /><div><span>WHY METAMASK IS DEFERRED</span><h2>Web3 sign-in is a future authentication factor—not v1 research governance.</h2></div><p>SIWE requires nonce, domain/origin, chain, expiry, signature, session, consent, and revocation handling. It exposes a stable public identifier and offers no required benefit to hospital aggregation or model release. There is no wallet schema in the first migration set.</p></div></section>

      <section className="implementation-section"><div className="section-heading"><span>04 / MIGRATION ORDER</span><span>BUILD THE RECORD BEFORE BUILDING THE JOB</span></div><MermaidDiagram chart={migrationMap} label="PostgreSQL migration sequence from foundation and identity through governed operation and retention" /><div className="implementation-migration-grid"><article><span>001–002</span><h3>Foundation + identity</h3><p>Constraints, migration ledger, local user/organization/membership/workload records, short-lived credential binding metadata.</p></article><article><span>003–004</span><h3>Method + intake</h3><p>Federation/protocol/round state, then artifact intent, manifest, submission, validation, and deletion evidence.</p></article><article><span>005–007</span><h3>Results + operations</h3><p>Jobs/evidence, model/release ledger, then audit/idempotency/outbox/retention and security operations.</p></article></div></section>

      <section className="implementation-section"><div className="section-heading"><span>05 / PHASED IMPLEMENTATION BACKLOG</span><span>BUILD ONLY THE NEXT PROVABLE SLICE</span></div><div className="implementation-phase-list">{phases.map(([number, title, deliverables, gate]) => <article key={number}><span className="phase-number">{number}</span><div><h3>{title}</h3><p>{deliverables}</p></div><aside><span>EXIT GATE</span><p>{gate}</p></aside></article>)}</div></section>

      <section className="implementation-handoff"><div><ClipboardList size={23} /><span>HANDOFF APPROVAL GATES</span><h2>Five decisions unlock repository creation.</h2></div><ol><li>Approve the core-only product boundary and explicit exclusions.</li><li>Approve the local human/membership/workload schema and OIDC/Clerk boundary.</li><li>Approve deferring MetaMask/SIWE until a distinct non-clinical requirement and security review exist.</li><li>Authorize a short persistence and Python-toolchain proof of concept before fixing adapters.</li><li>Authorize the private `hstu-research/federated-aggregator-core` repository and execution of the approved phases only.</li></ol><CheckCircle2 size={31} /></section>
    </div>
  );
}
