/**
 * Research Ledger design: technical architecture is presented as a readable decision record,
 * balancing a systems diagram with explicit operational constraints and evidence states.
 */
import { ArrowRight, Box, CheckCircle2, Database, FileCheck2, ShieldAlert } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const transitions = ["draft", "open", "collecting", "validating", "aggregating", "awaiting approval", "published", "closed"];

export default function Architecture() {
  return (
    <div className="doc-page">
      <header className="doc-topbar"><p>04 / ARCHITECTURE</p><StatusStamp status="VALIDATED" /></header>
      <section className="page-title"><p className="folio">04.1 / CONTEXT DIAGRAM</p><h1>The core never receives<br /><i>raw hospital images.</i></h1><p>It accepts only declared update artifacts and their evidence envelopes, then validates, aggregates, and releases a globally versioned model.</p></section>

      <section className="system-map">
        <div className="system-node remote"><span>SIMULATED HOSPITALS</span><strong>Local FedAvg / FedProx training</strong><small>update manifest + checksum</small></div>
        <ArrowRight className="system-arrow" />
        <div className="system-node central"><span>AGGREGATOR CORE</span><strong>Validate, quarantine, aggregate</strong><small>protocol + round + audit</small></div>
        <ArrowRight className="system-arrow" />
        <div className="system-node release"><span>MODEL RELEASE</span><strong>Approved global version</strong><small>manifest + model card</small></div>
      </section>

      <section className="architecture-columns">
        <div className="editorial-panel">
          <div className="panel-kicker"><FileCheck2 size={16} /> UPDATE INTAKE</div>
          <h2>Validate before any tensor is considered.</h2>
          <p>Every submission is checked against the active round, participant eligibility, base model version, architecture, preprocessing, sample count, artifact checksum, schema version, and finite-value rules. Invalid artifacts enter quarantine with an auditable reason.</p>
          <ul className="plain-list"><li>Duplicate or late submissions are rejected.</li><li>Incompatible model identifiers cannot aggregate.</li><li>Client-reported metrics are labeled separately from recomputed metrics.</li></ul>
        </div>
        <div className="editorial-panel dark-panel">
          <div className="panel-kicker"><Box size={16} /> RELEASE LIFECYCLE</div>
          <h2>Candidate is not published.</h2>
          <p>Global artifacts move through independent operational states. A release requires validation, approval, integrity data, compatibility information, and release notes before hospitals can consume it.</p>
          <div className="release-states"><span>candidate</span><span>validated</span><span>approved</span><span>published</span><span>rolled back</span></div>
        </div>
      </section>

      <section className="state-machine-card">
        <div className="section-heading"><span>04.2 / ROUND STATE MACHINE</span><span>STRICT TRANSITIONS ONLY</span></div>
        <div className="state-machine">{transitions.map((state, index) => <div className={index === 2 ? "round-state active" : "round-state"} key={state}><span>{String(index + 1).padStart(2, "0")}</span>{state}</div>)}</div>
        <div className="failure-note"><ShieldAlert size={18} /><p><strong>Failure paths are first-class:</strong> validation failed, aggregation failed, publication failed, rolled back, and cancelled. Files alone never determine the round state.</p></div>
      </section>

      <section className="storage-brief">
        <div><Database size={23} /><h2>PostgreSQL holds the state.<br />Artifacts live outside it.</h2></div>
        <p>Transactional metadata records participants, rounds, submissions, aggregation runs, model versions, releases, and audit events. Large checkpoints are accessed through a checksum-verified storage interface; a URI or CID is never treated as proof of integrity.</p>
        <StatusStamp status="BLOCKED" />
      </section>
    </div>
  );
}
