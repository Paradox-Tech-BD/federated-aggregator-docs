/**
 * Research Ledger design: the opening page reads as an accountable product brief,
 * with editorial hierarchy, decisive scope boundaries, and a visible evidence margin.
 */
import { ArrowUpRight, CheckCircle2, ChevronRight, CircleDot, GitBranch, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { StatusStamp } from "@/components/StatusStamp";

const chapters = [
  ["02", "Requirements analysis", "Stakeholder outcomes, business value, research gaps, risks, and the next decision gate."],
  ["03", "Federated-learning concepts", "FedAvg baseline, FedProx client optimization, and the limits of an aggregator claim."],
  ["04", "Architecture", "Round state machine, artifact flow, validation, and release bundle."],
  ["05", "API reference", "Versioned OpenAPI contract with safe mock/local request tooling."],
  ["12", "Research log", "Chronological decisions, failed runs, corrective actions, and accepted evidence."],
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
        </div>
        <div className="hero-art" aria-hidden="true">
          <img src="/manus-storage/aggregator-ledger-hero_0f9d5391.png" alt="" />
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

      <section className="reading-grid">
        <div className="chapter-list">
          <div className="section-heading"><span>DOCUMENT INDEX</span><span>5 STARTING CHAPTERS</span></div>
          {chapters.map(([index, title, description]) => (
            <Link href={title === "Requirements analysis" ? "/requirements" : title === "Architecture" ? "/architecture" : title === "API reference" ? "/api" : title === "Research log" ? "/research-log" : "/"} className="chapter-row" key={index}>
              <span className="chapter-row-index">{index}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
        <aside className="right-margin">
          <img src="/manus-storage/aggregator-ledger-margin_bc069bce.png" alt="" className="margin-texture" />
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
