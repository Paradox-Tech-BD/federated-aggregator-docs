/**
 * Research Ledger design: full system specification page, styled like a field manual rather than a dashboard.
 * It keeps Node.js control responsibilities and Python ML responsibilities visibly separate.
 */
import { ArrowRight, BadgeCheck, Boxes, Braces, Database, FileCheck2, LockKeyhole, ServerCog, ShieldCheck, Workflow } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const stack = [
  ["AUTH", "OIDC provider", "JWT issuer only; the core backend owns membership, roles, and federation scope."],
  ["BACKEND", "NestJS / Node.js", "Policy, round lifecycle, release governance, audit, OpenAPI, and administration."],
  ["DATABASE", "PostgreSQL", "Authoritative state, protocol records, model lineage, ledger events, and idempotency."],
  ["ARTIFACTS", "S3-compatible storage", "Digest-verified model, metrics, manifest, and release-package objects."],
  ["CONTROL JOBS", "BullMQ + Redis", "Verification, dispatch, release publication, audit export, retries, and outbox work."],
  ["ML WORKER", "Python / PyTorch", "Tensor checks, FedAvg/FedProx-compatible aggregation, candidate evaluation, artifacts."],
];

const middleware = [
  ["01", "Request context", "Correlation ID, request metadata, and malformed-header rejection."],
  ["02", "Credential verification", "Human OIDC JWT or separate workload credential; never one shared administrator token."],
  ["03", "Hydration", "Load membership, site/workload status, role, and permitted federation scope from PostgreSQL."],
  ["04", "Policy + idempotency", "Deny cross-site actions by default; writes cannot repeat side effects."],
  ["05", "Rate + audit", "Constrain payload and request rates, then record actor, action, object, and correlation."],
];

const queues = [
  ["artifact-verify", "New manifest", "Object integrity and ML compatibility", "accepted / quarantined"],
  ["aggregate", "Threshold or deadline", "Dispatch immutable Python aggregation command", "candidate / failed"],
  ["evaluate", "Candidate created", "Run declared reference or candidate evaluation", "evidence bundle"],
  ["release-publish", "Human approval", "Assemble immutable release package and ledger event", "published / failed"],
];

const tables = [
  ["memberships", "user, organization, role, status", "Policy is owned by the core, not the identity provider."],
  ["protocol_versions", "architecture, algorithm, config, criteria", "Immutable scientific/operational method record."],
  ["rounds", "protocol, base model, state, threshold, deadline", "Controlled federation lifecycle."],
  ["update_submissions", "manifest, artifact, status, reason", "Every update has an acceptance or quarantine explanation."],
  ["aggregation_jobs", "command, result, status, attempts", "Durable Node ↔ Python execution handoff."],
  ["model_release_events", "candidate, approval, publish, rollback", "Append-only model lifecycle ledger."],
];

export default function TechnicalRequirements() {
  return (
    <div className="doc-page specification-page">
      <header className="doc-topbar"><p>03 / SYSTEM SPECIFICATION</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title"><p className="folio">03.0 / TECHNICAL RESPONSE TO REQUIREMENTS</p><h1>Own the policy.<br /><i>Isolate the math.</i></h1><p>This chapter is the technical response to the preceding Requirements Analysis. It specifies how the aggregator core can meet the project’s federated research and governance needs; it does not replace the non-technical requirements chapter.</p></section>

      <section className="spec-intent"><div><ServerCog size={22} /><span>CORE CONTRACT</span></div><h2>The core accepts verifiable update manifests, coordinates compatible aggregation work, and releases approved models. It never collects raw hospital images or local training data.</h2><StatusStamp status="VALIDATED" /></section>

      <section className="spec-section"><div className="section-heading"><span>TECHNOLOGY STACK</span><span>PROPOSED FOR APPROVAL</span></div><div className="stack-grid">{stack.map(([tag, title, detail]) => <article key={tag}><span>{tag}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></section>

      <section className="spec-section"><div className="section-heading"><span>01 / AUTHENTICATION AND SESSION ARCHITECTURE</span><span>HUMANS ≠ WORKLOADS</span></div><div className="auth-spec"><article><LockKeyhole size={19} /><h2>Human requests</h2><p>An OIDC provider issues a signed JWT after login. NestJS verifies it, then hydrates the caller’s own federation membership and role from PostgreSQL. The browser never decides permissions.</p></article><article><Boxes size={19} /><h2>Hospital and ML-worker requests</h2><p>Workloads use separate short-lived machine credentials. A hospital site workload or Python worker cannot act through an administrator’s browser session, and no raw clinical data enters the core API.</p></article></div><div className="middleware-list">{middleware.map(([index, title, text]) => <article key={index}><span>{index}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section className="spec-section"><div className="section-heading"><span>02 / BACKEND ROUTE RESPONSIBILITIES</span><span>MODULAR NESTJS MONOLITH</span></div><div className="route-grid"><article><code>/federations · /participants · /protocols</code><p>Identity, federation membership, protocol version, architecture declaration, algorithm parameters, release criteria.</p></article><article><code>/rounds · /submissions · /aggregation-jobs</code><p>Round state, signed artifact-upload intent, manifest intake, validation records, dispatch and recovery.</p></article><article><code>/model-versions · /releases · /audit</code><p>Candidate lineage, human approval, publication/rollback events, scoped audit and evidence exports.</p></article></div></section>

      <section className="spec-section"><div className="section-heading"><span>03 / UPDATE INTAKE AND FEDERATED ROUND</span><span>MANIFEST-FIRST, NOT RAW-DATA INTAKE</span></div><div className="round-flow"><div><b>1</b><h3>Request intent</h3><p>Active site asks for a short-lived upload target for one round/protocol.</p></div><ArrowRight /><div><b>2</b><h3>Upload artifact</h3><p>Weights and metrics go directly to object storage; the API receives no raw images.</p></div><ArrowRight /><div><b>3</b><h3>Submit manifest</h3><p>Digest, base model, sample count, local metadata, and declared FedProx settings arrive.</p></div><ArrowRight /><div><b>4</b><h3>Validate + aggregate</h3><p>Node verifies governance; Python verifies tensors and produces a candidate only from accepted updates.</p></div><ArrowRight /><div><b>5</b><h3>Approve release</h3><p>A human publishes, rejects, deprecates, or rolls back through the append-only ledger.</p></div></div></section>

      <section className="spec-section spec-columns"><article><div className="section-heading"><span>04 / JOB QUEUE</span><span>BULLMQ + REDIS</span></div><div className="queue-table">{queues.map(([name, trigger, work, result]) => <div key={name}><code>aggregator:{name}</code><p><b>Trigger:</b> {trigger}</p><p><b>Work:</b> {work}</p><span>{result}</span></div>)}</div></article><article className="worker-contract"><div className="section-heading"><span>05 / PYTHON WORKER</span><span>AUTHENTICATED JOB CONTRACT</span></div><h2>FedProx is local optimization—not server-side averaging.</h2><p>The central worker receives an immutable aggregation command: verified update descriptors, protocol version, base-model lineage, aggregation policy, correlation ID, and deadline. It returns one signed result or explicit failure callback; it never writes business state to PostgreSQL.</p><div className="contract-lines"><span>AggregationJob → schema version + inputs + policy + deadline</span><span>JobResult → candidate digest + validation summary + evidence + warnings</span></div></article></section>

      <section className="spec-section"><div className="section-heading"><span>06 / POSTGRESQL AND RELEASE LEDGER</span><span>THE DECISION SYSTEM OF RECORD</span></div><div className="schema-table">{tables.map(([name, fields, meaning]) => <article key={name}><code>{name}</code><p>{fields}</p><span>{meaning}</span></article>)}</div></section>

      <section className="spec-check"><div><FileCheck2 size={20} /><span>WHAT IMPROVES ON EARLIER WORK</span><h2>Keep the tested FedProx core.<br />Replace prototype control logic.</h2></div><ul><li><b>Reuse:</b> Python finite-state/tensor validation and FedAvg/FedProx reference tests.</li><li><b>Rebuild:</b> In-memory Express round logic as persistent NestJS modules with authorization, audit, object storage, and domain transactions.</li><li><b>Defer:</b> Hospital portals, blockchain/IPFS enforcement, and independent microservices until the controlled core workflow proves the need.</li></ul></section>
    </div>
  );
}
