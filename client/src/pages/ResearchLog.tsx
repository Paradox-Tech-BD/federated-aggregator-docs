/**
 * Research Ledger design: chronological research entries preserve uncertainty in an editorial ledger,
 * with explicit evidence stamps rather than retrospective cleanup.
 */
import { ArrowUpRight, CalendarDays, FileWarning, GitCommitHorizontal, Lightbulb } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const entries = [
  { date: "20 AUG 2026", title: "One product first: aggregation core and admin portal", status: "VALIDATED" as const, icon: Lightbulb, body: "Hospital nodes, hospital portals, and external coordination layers are separated from the first product. The immediate concern is a trustworthy model-release control plane." },
  { date: "20 AUG 2026", title: "Terminology correction: FedProx does not change the server’s basic role", status: "VALIDATED" as const, icon: GitCommitHorizontal, body: "The proximal penalty is applied during local client optimization. The aggregator validates and combines declared client updates, records μ, and publishes the next compatible global model." },
  { date: "19 AUG 2026", title: "Legacy low-specificity / high-sensitivity result is retained as a diagnostic", status: "PROVISIONAL" as const, icon: FileWarning, body: "The pattern is not a thesis claim. It remains a debugging signal pending a corrected aggregation implementation, grouped data split, reproducible configuration, and independent metric recalculation." },
];

export default function ResearchLog() {
  return (
    <div className="doc-page research-page">
      <header className="doc-topbar"><p>12 / RESEARCH LOG</p><span className="topbar-meta"><CalendarDays size={15} />GMT+6 chronology</span></header>
      <section className="page-title"><p className="folio">12.0 / DECISIONS OVER TIME</p><h1>Keep the failed runs.<br /><i>They are evidence too.</i></h1><p>Every consequential change records its context, evidence, decision, consequence, status, and next action. The log is chronological by design.</p></section>
      <section className="log-ledger">{entries.map((entry, index) => { const Icon = entry.icon; return <article className="log-entry" key={entry.title}><div className="log-marker"><span>{String(index + 1).padStart(2, "0")}</span></div><div className="log-date">{entry.date}</div><div className="log-content"><div className="log-title-row"><h2>{entry.title}</h2><StatusStamp status={entry.status} /></div><p>{entry.body}</p><a href="#open-decisions">Evidence and decision record <ArrowUpRight size={15} /></a></div><Icon className="log-icon" size={21} /></article>; })}</section>
      <section id="open-decisions" className="open-questions"><div><span>OPEN DECISION / 008</span><h2>Which normalization policy belongs in the production vision model?</h2></div><p>Before the actual vision architecture enters a federated round, document whether BatchNorm buffers are aggregated, retained locally, frozen, or replaced. The answer must be tested on that architecture, not inferred from the earlier MLP simulation.</p><StatusStamp status="BLOCKED" /></section>
    </div>
  );
}
