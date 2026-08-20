/**
 * Research Ledger design: the technical chapter treats architecture as a set of durable ownership
 * decisions, making Node.js control and Python ML boundaries clear before code is written.
 */
import { BadgeCheck, Boxes, Braces, Database, LockKeyhole, Network, RefreshCcw, Scale, ServerCog, Sparkles } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const requirements = [
  ["01", "Control plane", "NestJS + TypeScript owns people, policy, round state, audit, approval, and the public contract."],
  ["02", "ML worker", "Python + PyTorch owns FedAvg/FedProx execution, numerical checks, evaluation, and model artifacts."],
  ["03", "Persistence", "PostgreSQL is authoritative for decisions; object storage holds checksum-verified artifacts."],
  ["04", "Integration", "Versioned commands and results carry identity, correlation, idempotency, deadline, and schema version."],
];

const reuse = [
  ["Express state machine", "REWRITE", "Keep transition concepts and tests; replace the in-memory, unauthenticated runtime."],
  ["Coordination adapter", "ADAPT", "Keep its checksum/model-version interface; replace in-memory storage with registry, approval, and rollback records."],
  ["Python FL core", "REUSE + EXTEND", "Keep tested FedAvg/FedProx primitives; add artifact I/O, declared BatchNorm policy, and worker envelopes."],
  ["Two-site experiment", "REUSE AS FIXTURE", "Software verification only—not a breast-cancer result or clinical claim."],
  ["Hospital/admin products", "DEFER", "Separate repositories after their own requirements gates are accepted."],
];

export default function TechnicalRequirements() {
  return (
    <div className="doc-page tech-page">
      <header className="doc-topbar"><p>03 / TECHNICAL REQUIREMENTS</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title"><p className="folio">03.0 / OWNERSHIP BEFORE IMPLEMENTATION</p><h1>One control plane.<br /><i>One ML worker plane.</i></h1><p>The system is deliberately split by responsibility: Node.js governs the federation, while Python executes the declared machine-learning work. Neither layer may silently own the other’s decisions.</p></section>

      <section className="plane-diagram"><div className="plane control"><div className="plane-icon"><ServerCog size={21} /></div><span>NODE.JS / TYPESCRIPT</span><h2>Control plane</h2><p>Identity · protocol · round state · manifests · audit · approval · administration</p></div><div className="plane-link"><Network size={21} /><span>versioned command / result</span></div><div className="plane worker"><div className="plane-icon"><Sparkles size={21} /></div><span>PYTHON / PYTORCH</span><h2>ML worker plane</h2><p>FedAvg/FedProx · tensor checks · evaluation · checkpoints · model metadata</p></div></section>

      <section className="requirements-section"><div className="section-heading"><span>TECHNICAL OUTCOMES</span><span>PHASE-1 FOUNDATION</span></div><div className="technical-requirements-grid">{requirements.map(([index, title, text]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="tech-two-column"><article className="control-details"><div className="panel-kicker"><Braces size={16} /> NODE.JS CONTROL PLANE</div><h2>The round lifecycle is a policy decision, not a worker side effect.</h2><p>The Node.js runtime issues immutable aggregation commands after compatible submissions are recorded. It remains authoritative for protocol version, participant eligibility, validation/quarantine, release approval, and audit events.</p><div className="tech-tags"><span>OpenAPI v1</span><span>OIDC identities</span><span>RBAC + scope</span><span>Idempotency</span><span>Audit ledger</span></div></article><article className="worker-details"><div className="panel-kicker"><Boxes size={16} /> PYTHON ML WORKER</div><h2>FedProx belongs in local optimization.</h2><p>The worker receives a declared job and emits a verified result. It does not create users, set release state, or write directly to the control-plane database. A future Flower adapter remains an ML integration option—not an operating-governance system.</p><div className="tech-tags"><span>PyTorch</span><span>FedAvg</span><span>FedProx</span><span>Numerical checks</span><span>Artifact manifest</span></div></article></section>

      <section className="persistence-strip"><div><Database size={22} /><h2>PostgreSQL owns decisions.<br />Object storage owns artifacts.</h2></div><p>Domain records, approvals, and audit events stay transactional. Checkpoints and evidence bundles are stored separately with digest, producer version, provenance, and retention details. A URI never proves integrity by itself.</p><StatusStamp status="VALIDATED" /></section>

      <section className="requirements-section"><div className="section-heading"><span>REUSE / REWRITE / DEFER</span><span>EARLIER CLEAN-ROOM WORK</span></div><div className="reuse-table">{reuse.map(([component, decision, rationale]) => <article key={component}><h3>{component}</h3><span className={`reuse-decision ${decision.toLowerCase().replaceAll(" ", "-").replace("+", "")}`}>{decision}</span><p>{rationale}</p></article>)}</div></section>

      <section className="quality-grid"><article><BadgeCheck size={19} /><h3>Correctness</h3><p>Only compatible, finite, checksum-verified artifacts are eligible for aggregation.</p></article><article><LockKeyhole size={19} /><h3>Privacy boundary</h3><p>The core never persists raw images, local datasets, or patient identifiers.</p></article><article><RefreshCcw size={19} /><h3>Recovery</h3><p>A timeout or worker restart cannot publish a model or silently advance a round.</p></article><article><Scale size={19} /><h3>Reproducibility</h3><p>Every candidate links code revision, protocol, artifacts, environment, and seed.</p></article></section>

      <section className="tech-gate"><div><span>ARCHITECTURE GATE 2</span><h2>Confirm the foundations before backend implementation.</h2></div><ol><li>NestJS + TypeScript for control; PyTorch + Python for workers.</li><li>Modular monolith first; no early control-plane microservices.</li><li>PostgreSQL + S3-compatible artifacts.</li><li>OIDC for humans; distinct workload credentials.</li><li>HTTP + versioned schemas first; message broker only when measured.</li><li>BatchNorm strategy is tested on the vision model before real experiments.</li></ol></section>
    </div>
  );
}
