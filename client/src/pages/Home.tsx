/**
 * Research Ledger design: the opening page reads as an accountable product brief,
 * with editorial hierarchy, decisive scope boundaries, and a visible evidence margin.
 */
import { ArrowUpRight, CheckCircle2, ChevronRight, CircleDot, GitBranch, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { StatusStamp } from "@/components/StatusStamp";

const chapters = [
  ["02", "Integrated requirements", "Connected research, stakeholder, governance, workflow, security, data, model, and technical requirements."],
  ["03", "System specification", "Authentication, backend middleware, artifact pipeline, queues, worker contract, and release ledger."],
  ["04", "Architecture", "Round state machine, artifact flow, validation, and release bundle."],
  ["05", "Workflow design", "Original Mermaid flows for protocol activation, round orchestration, update validation, aggregation, release approval, and recovery."],
  ["06", "Data management", "Mermaid schema groups, local-data boundary, artifact lineage, retention, and release evidence."],
  ["07", "API reference", "Versioned OpenAPI contract with safe mock/local request tooling."],
  ["LOG", "Research log", "Chronological decisions, failed runs, corrective actions, and accepted evidence."],
];

export default function Home() {
  return (
    <div className="doc-page home-page">
      <header className="doc-topbar">
        <p>FEDERATED AGGREGATOR CORE <span>·</span> DOCUMENTATION</p>
        <StatusStamp status="PROVISIONAL" />
      </header>

      <section className="hero-ledger">
        <div className="hero-copy">
          <div className="folio">01 / PRODUCT BRIEF</div>
          <h1>A global model is a release,<br /><i>not a score.</i></h1>
          <p className="hero-lede">A documentation-first research ledger for the central service that validates hospital updates, coordinates federated rounds, and publishes approved model versions with traceable evidence.</p>
          <div className="hero-actions">
            <Link href="/architecture" className="editorial-link">Read the architecture <ChevronRight size={17} /></Link>
            <Link href="/api" className="editorial-link muted">Inspect the API contract <ChevronRight size={17} /></Link>
          </div>
          <div className="hero-scope-strip">
            <div><span>CORE</span><strong>Aggregator control plane</strong></div>
            <div><span>BOUNDARY</span><strong>Raw data stays local</strong></div>
            <div><span>STATUS</span><strong>Research-only release</strong></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-topology"><span className="topology-node node-one" /><span className="topology-node node-two" /><span className="topology-node node-three" /><span className="topology-ring ring-one" /><span className="topology-ring ring-two" /><span className="topology-link link-one" /><span className="topology-link link-two" /><span className="topology-link link-three" /></div>
          <div className="hero-art-status"><span className="status-signal" />ROUND / VALIDATION READY</div>
          <div className="hero-art-caption"><CircleDot size={14} /> update validation → deterministic aggregation → approved release</div>
        </div>
      </section>

      <section className="evidence-callout">
        <div className="evidence-index">EVIDENCE / 001</div>
        <div>
          <h2>FedProx is a <em>client-side</em> local optimization rule.</h2>
          <p>Hospitals train against the received global parameters with a proximal penalty. The core service records the declared μ and validates compatible updates; it does not claim to apply the proximal term merely by averaging weights.</p>
        </div>
        <StatusStamp status="VALIDATED" />
      </section>

      <section className="reading-compass" aria-label="Documentation reading guidance">
        <div className="compass-mark"><GitBranch size={18} /></div>
        <div><span>START HERE</span><h2>Read the requirements before the interface contract.</h2></div>
        <p>The documentation is sequenced as a decision trail: purpose, integrated requirements, technical response, architecture, workflow controls, evidence data, then the public API contract.</p>
        <Link href="/requirements">Open requirements <ArrowUpRight size={16} /></Link>
      </section>

      <section className="reading-grid">
        <div className="chapter-list">
          <div className="section-heading"><span>CORE DOCUMENT INDEX</span><span>7 READING PATHS</span></div>
          {chapters.map(([index, title, description]) => (
            <Link href={title === "Integrated requirements" ? "/requirements" : title === "System specification" ? "/technical-requirements" : title === "Architecture" ? "/architecture" : title === "Workflow design" ? "/workflow-design" : title === "Data management" ? "/data-management" : title === "API reference" ? "/api" : title === "Research log" ? "/research-log" : "/"} className="chapter-row" key={index}>
              <span className="chapter-row-index">{index}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
        <aside className="right-margin">
          <div className="margin-constellation" aria-hidden="true" />
          <div className="margin-note">
            <span>WORKING SCOPE</span>
            <strong>Aggregator core + admin portal</strong>
            <p>Hospital products, live chain coordination, and clinical workflows remain outside this first product boundary.</p>
          </div>
        </aside>
      </section>

      <section className="principles-strip">
        <div><GitBranch size={18} /><span>Every accepted update has a manifest.</span></div>
        <div><ShieldCheck size={18} /><span>Every release has an approval record.</span></div>
        <div><CheckCircle2 size={18} /><span>Every research claim carries a status.</span></div>
      </section>
    </div>
  );
}
