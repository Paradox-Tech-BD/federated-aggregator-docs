/**
 * Research Ledger design: this is the primary integrated requirements chapter.
 * It connects research/governance needs to explicit operational and technical controls.
 */
import { ArrowRight, BadgeCheck, BookOpenCheck, Boxes, Database, FileCheck2, FlaskConical, Gauge, KeyRound, Layers3, LockKeyhole, ShieldAlert, UsersRound } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const traceability = [
  ["Research governance", "Node.js control plane owns participant policy, protocol versions, approval, and audit."],
  ["Local data custody", "Manifest-first update intake and direct constrained artifact upload—never raw clinical-data intake."],
  ["Scientific correctness", "Python/PyTorch worker owns tensor checks and declared FedAvg/FedProx execution."],
  ["Reproducibility", "Protocol, code, environment, inputs, metrics, and review status become a candidate/release evidence package."],
];

const roles = [
  ["Research sponsor", "A defensible multi-site research program", "Protocol, evidence status, risks, and progress without unsupported claims."],
  ["Research administrator", "Control a round and release decision", "Explicit state transitions, exceptions, evidence, approval/rejection, and rollback."],
  ["Site administrator", "Represent a hospital's agreed participation", "Scoped status, workload activation, receipts, withdrawal, and local boundaries."],
  ["Site workload", "Send a local update correctly", "Short-lived upload intent, manifest validation, and acceptance/quarantine result."],
  ["Auditor / thesis reviewer", "Reconstruct a research claim", "Protocol → round → submissions → job → candidate → release audit path."],
];

const steps = [
  ["01", "Protocol", "A versioned method declares architecture, task, FedProx μ, epochs, BatchNorm policy, metrics, and release criteria."],
  ["02", "Invite", "Active, scoped site workloads are invited to a declared round with threshold and deadline."],
  ["03", "Manifest", "Weights/metrics upload directly to constrained storage; the core receives digest, lineage, and local metadata only."],
  ["04", "Validate", "Node verifies governance/integrity; Python verifies state-dict/numerical compatibility. Failures quarantine with reason."],
  ["05", "Aggregate", "Only locked accepted updates reach one immutable Python aggregation job; no worker result writes business state directly."],
  ["06", "Evaluate", "Candidate evidence records global and site-aware metrics, environment, code, and warning conditions."],
  ["07", "Release", "An authorized human approves, rejects, publishes, deprecates, or rolls back through an append-only ledger."],
];

const queues = [
  ["artifact-verify", "storage digest + policy", "accepted / quarantined"],
  ["ml-validate", "tensor and architecture compatibility", "accepted / quarantined"],
  ["aggregate", "immutable accepted-update set", "candidate / failed"],
  ["evaluate", "candidate + declared plan", "evidence bundle"],
  ["release-publish", "approval + candidate", "published / retryable failure"],
];

const controls = [
  ["Identity", "OIDC human JWTs; distinct short-lived site/worker credentials; PostgreSQL-backed role and federation scope."],
  ["Integrity", "SHA-256, object size/type, base-model lineage, idempotency key, immutable manifests, signed job results."],
  ["Privacy", "No raw images, patient identifiers, or local datasets in core database, object storage, logs, or audit exports."],
  ["Recovery", "Bounded retries; explicit cancellation/quarantine; timeout cannot publish or silently advance a round."],
  ["Evidence", "Append-only audit/release events, correlation IDs, model card, protocol, code/environment, and metric provenance."],
];

export default function Requirements() {
  return (
    <div className="doc-page integrated-requirements-page">
      <header className="doc-topbar"><p>02 / INTEGRATED REQUIREMENTS</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title"><p className="folio">02.0 / FULL SYSTEM REQUIREMENTS ANALYSIS</p><h1>Make the research<br /><i>auditable by design.</i></h1><p>The aggregator is not just a weight-combining server. It is the controlled, evidence-bearing process through which independent hospitals contribute compatible model updates and publish research releases without moving raw clinical data.</p></section>

      <section className="requirements-charter"><div className="charter-symbol"><BookOpenCheck size={23} /></div><div><span>PRIMARY REQUIREMENTS CHAPTER</span><h2>This page connects the project’s stakeholder, research, governance, workflow, data, security, and technical requirements. The following System Specification is its implementation-level continuation—not a replacement.</h2></div><StatusStamp status="VALIDATED" /></section>

      <section className="requirements-section"><div className="section-heading"><span>01 / PRODUCT SCOPE AND RESEARCH POSITION</span><span>WHAT THE CORE IS FOR</span></div><div className="scope-split"><article><h2>A model-release control plane for federated research.</h2><p>It records participation, locks a protocol, accepts verifiable update manifests, dispatches compatible aggregation work, preserves candidate lineage, and requires human review before publishing a research model release.</p><p>It does not become a hospital application, raw-dataset repository, diagnosis tool, or clinical decision-support product. A released research model is not a clinical validation claim.</p></article><article className="scope-dark"><FlaskConical size={20} /><h2>Research gap it addresses</h2><p>Healthcare federated learning has many prototypes but limited real-life application and incomplete tailored governance. The first value of this product is therefore a trustworthy, reproducible process—not an unqualified accuracy claim.</p><span>RESEARCH FIRST · CLINICAL USE OUT OF SCOPE</span></article></div></section>

      <section className="requirements-section"><div className="section-heading"><span>02 / REQUIREMENT TRACEABILITY</span><span>WHY EACH SYSTEM CONTROL EXISTS</span></div><div className="trace-grid">{traceability.map(([driver, response], index) => <article key={driver}><span>0{index + 1}</span><h3>{driver}</h3><p>{response}</p></article>)}</div></section>

      <section className="requirements-section"><div className="section-heading"><span>03 / STAKEHOLDERS, ROLES, AND OUTCOMES</span><span>WHO MUST TRUST THE PROCESS</span></div><div className="integrated-role-table"><div className="integrated-role-head"><span>Stakeholder</span><span>Job to be done</span><span>Required outcome</span></div>{roles.map(([role, need, outcome]) => <div className="integrated-role-row" key={role}><strong>{role}</strong><p>{need}</p><p>{outcome}</p></div>)}</div></section>

      <section className="requirements-section"><div className="section-heading"><span>04 / FEDERATION OPERATING MODEL</span><span>THE COMPLETE ROUND, NOT A SINGLE API CALL</span></div><div className="integrated-flow">{steps.map(([index, title, detail], indexPosition) => <div className="integrated-flow-unit" key={title}><article><span>{index}</span><h3>{title}</h3><p>{detail}</p></article>{indexPosition < steps.length - 1 && <ArrowRight className="integrated-flow-arrow" size={18} />}</div>)}</div></section>

      <section className="requirements-columns"><article><div className="section-heading"><span>05 / IDENTITY AND MEMBERSHIP</span><span>HUMANS ≠ WORKLOADS</span></div><KeyRound size={20} /><h2>One authenticated request path, two identity types.</h2><p>OIDC issues human tokens only. The NestJS core verifies a token, hydrates organization/federation membership from PostgreSQL, enforces role and site scope, applies idempotency and abuse controls, then writes an audit context. Hospital workloads and Python workers use separate short-lived machine credentials.</p><div className="inline-requirements"><span>correlation ID</span><span>scope guard</span><span>idempotency</span><span>rate limits</span><span>audit actor</span></div></article><article className="requirements-worker"><div className="section-heading"><span>06 / NODE ↔ PYTHON CONTRACT</span><span>POLICY ≠ MATH</span></div><Boxes size={20} /><h2>Node governs. Python calculates.</h2><p>Node.js owns membership, protocol, round state, manifest policy, queue control, audit, candidate registration, and release approval. Python owns state-dict checks, FedAvg/FedProx-compatible aggregation, model evaluation, and result artifacts. The worker returns a versioned result; it never writes core business state.</p><div className="contract-block">AggregationJob → protocol + verified artifacts + policy + deadline<br /><br />JobResult → candidate digest + validation + metrics + evidence + warnings</div></article></section>

      <section className="requirements-section"><div className="section-heading"><span>07 / ASYNCHRONOUS JOBS AND FAILURE PATHS</span><span>BULLMQ + REDIS CONTROL WORK</span></div><div className="integrated-queue-table">{queues.map(([name, work, result]) => <article key={name}><code>aggregator:{name}</code><p>{work}</p><span>{result}</span></article>)}</div><p className="queue-note">Every job carries a schema version, correlation ID, artifact digest, protocol/round identity, code/environment record, deadline, and idempotency key. Retries are capped and only transient failures retry. A timeout cannot manufacture a candidate or release.</p></section>

      <section className="requirements-section"><div className="section-heading"><span>08 / SCIENTIFIC, DATA, AND MODEL REQUIREMENTS</span><span>FEDPROX IS A HYPOTHESIS, NOT A MARKETING CLAIM</span></div><div className="science-grid"><article><Gauge size={19} /><h3>Algorithm declaration</h3><p>Protocol locks FedAvg/FedProx, μ, local epochs, optimizer, batch size, architecture, preprocessing, metric schema, and release criteria before collection begins.</p></article><article><Layers3 size={19} /><h3>BatchNorm policy</h3><p>Buffers are a formal test requirement on the actual vision model; naïve state-dict averaging is not accepted as a production policy.</p></article><article><Database size={19} /><h3>Data boundary</h3><p>Core storage holds only weight/metric artifacts plus manifests. It rejects raw image, patient identifier, and local-dataset fields.</p></article><article><FileCheck2 size={19} /><h3>Evidence bundle</h3><p>Every candidate links code revision, protocol, inputs, environment, seed policy, global and site-aware metrics, and review status.</p></article></div></section>

      <section className="requirements-section"><div className="section-heading"><span>09 / SECURITY, PRIVACY, OPERATIONS, AND AUDIT</span><span>THE CORE MUST EXPLAIN ITS DECISIONS</span></div><div className="control-grid">{controls.map(([title, detail], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></section>

      <section className="evidence-release-band"><div><ShieldAlert size={21} /><span>RELEASE STANDARD</span><h2>Accuracy is not enough to publish a model.</h2></div><p>A research release requires a candidate artifact with verified digest, immutable protocol version, accepted/excluded submission record, aggregation job result, evaluation evidence, model card, known limitations, human approval reason, and rollback pointer. A thesis result requires the same lineage plus verified dataset manifest and split procedure.</p><StatusStamp status="PROVISIONAL" /></section>

      <section className="integrated-gates"><div><BadgeCheck size={20} /><span>ARCHITECTURE DECISION GATES</span><h2>Approve the operating model before implementation.</h2></div><ol><li>Confirm the product is a research model-release control plane, not a clinical platform.</li><li>Approve Node.js/TypeScript control, Python/PyTorch ML, PostgreSQL, object storage, BullMQ/Redis, and OpenAPI.</li><li>Approve human/workload identity separation and manifest-first data boundaries.</li><li>Approve the round/release state machine and human approval requirement.</li><li>Approve the evidence standard for FedProx, BatchNorm, datasets, and thesis claims.</li></ol></section>
    </div>
  );
}
