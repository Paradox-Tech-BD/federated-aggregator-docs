/**
 * Research Ledger design: requirements read as an evidence-led product record,
 * pairing stakeholder outcomes with visible gaps and explicit architecture gates.
 */
import { Building2, CircleCheck, FileText, Lightbulb, ShieldAlert, UsersRound } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const stakeholders = [
  ["Research sponsor", "Establish a credible multi-site program", "Evidence status, accountable release governance, and visible progress"],
  ["Research administrator", "Run rounds without hidden system behavior", "Understandable participant, protocol, validation, approval, and rollback workflow"],
  ["Participating institution", "Contribute without surrendering data custody", "Transparent eligibility, receipts, acceptance reasons, and compatible release access"],
  ["Auditor", "Reconstruct decisions without personal memory", "Protocol, approval, exception, and release history"],
];

const gaps = [
  ["Prototype-to-practice", "Most reviewed healthcare FL work remains prototype-focused.", "Make workflows, exceptions, evidence states, and approvals visible from the first product."],
  ["Governance operationalization", "Broad principles exist, but tailored operational mechanisms remain limited.", "Treat participant rules, protocol versions, model registration, and monitoring as product capabilities."],
  ["Privacy overclaim", "Local raw data custody does not eliminate update leakage or misuse risk.", "State residual risk; do not turn FL into a compliance or safety promise."],
  ["Release accountability", "A checkpoint alone does not explain suitability for reuse.", "Publish a release bundle with lineage, limitations, integrity, review, and rollback history."],
];

export default function Requirements() {
  return (
    <div className="doc-page requirements-page">
      <header className="doc-topbar"><p>02 / REQUIREMENTS</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title"><p className="folio">02.0 / BEFORE ARCHITECTURE</p><h1>Build the process<br /><i>before the platform.</i></h1><p>This is the project’s non-technical Requirements Analysis: it captures stakeholder needs, governance, business value, research gaps, risks, and acceptance criteria before choosing implementation details. The next chapter translates these needs into a technical system specification.</p></section>

      <section className="requirements-manifesto"><div className="manifest-icon"><FileText size={23} /></div><div><span>PRODUCT PROMISE</span><h2>A site can understand what it contributed. An administrator can explain why a model exists. An auditor can reconstruct the path from protocol to release.</h2></div><StatusStamp status="VALIDATED" /></section>

      <section className="requirements-section"><div className="section-heading"><span>STAKEHOLDERS AND OUTCOMES</span><span>WHO THIS PRODUCT SERVES</span></div><div className="stakeholder-table"><div className="stakeholder-head"><span>Stakeholder</span><span>Core need</span><span>Required outcome</span></div>{stakeholders.map(([role, need, outcome]) => <div className="stakeholder-row" key={role}><strong>{role}</strong><p>{need}</p><p>{outcome}</p></div>)}</div></section>

      <section className="requirements-two-column"><article><div className="panel-kicker"><Building2 size={16} /> BUSINESS AND COLLABORATION</div><h2>Coordinate research without turning it into opaque file exchange.</h2><p>The first customer is a research consortium or multi-institution model-development program, not a clinical production buyer. The value proposition is accountable coordination: agreed participation, understandable release decisions, and reusable organizational memory.</p><p>Collaboration agreements must define permitted purpose, withdrawal, artifact ownership, publication expectations, retention, incident communication, and who approves a release. The product can make these decisions visible; it cannot replace legal, ethics, or regulatory review.</p></article><article className="dark-panel requirements-dark"><div className="panel-kicker"><UsersRound size={16} /> FEDERATION PRINCIPLE</div><h2>Institutional autonomy is a product requirement.</h2><p>Participants need clear data boundaries, round invitations, deadline rules, receipts, and exclusion reasons. The core product cannot receive raw hospital images, rank institutions, or silently omit a contribution.</p><StatusStamp status="VALIDATED" /></article></section>

      <section className="requirements-section"><div className="section-heading"><span>RESEARCH GAPS → PRODUCT RESPONSE</span><span>WHY THE CORE EXISTS</span></div><div className="gap-list">{gaps.map(([gap, problem, response], index) => <article className="gap-row" key={gap}><span className="gap-index">0{index + 1}</span><div><h3>{gap}</h3><p>{problem}</p></div><div className="gap-response"><Lightbulb size={17} /><p>{response}</p></div></article>)}</div></section>

      <section className="requirements-two-column risk-row"><article className="risk-panel"><div className="panel-kicker"><ShieldAlert size={16} /> CLAIM BOUNDARY</div><h2>Federated learning is not an automatic privacy, compliance, clinical-safety, or performance guarantee.</h2><p>The documentation, portal, and future release bundle must distinguish data locality from formal privacy protection; model publication from clinical validation; and a promising metric from a thesis-validated result.</p></article><article className="gate-panel"><div className="panel-kicker"><CircleCheck size={16} /> NEXT DECISION GATE</div><h2>Accept the operating assumptions before designing internals.</h2><ol><li>Research consortium is the primary customer.</li><li>First releases are controlled research releases.</li><li>Role and approval ownership are explicit.</li><li>FedProx may produce neutral or negative evidence.</li><li>Documentation remains the ongoing decision ledger.</li></ol></article></section>
    </div>
  );
}
