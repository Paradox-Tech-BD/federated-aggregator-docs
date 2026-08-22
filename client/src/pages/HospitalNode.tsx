/** Research Ledger design: institutional dossier with a ruled evidence margin for the separate hospital-local workload boundary. */
import { ArrowUpRight, CheckCircle2, FileText, ShieldCheck, Workflow } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

const documents = [
  { title: "Product selection", description: "Why a local training workload is next, and why legacy patient-upload/blockchain routes are excluded.", file: "HOSPITAL_NODE_AGENT_PRODUCT_SELECTION.md" },
  { title: "Requirements analysis", description: "Non-technical and technical requirements, explicit privacy boundary, research value, and measurable acceptance signals.", file: "HOSPITAL_NODE_AGENT_REQUIREMENTS.md" },
  { title: "Schema and workflow", description: "Local SQLite control state, append-only events, normal and exception flows, and no patient-data persistence.", file: "HOSPITAL_NODE_AGENT_DATA_AND_SCHEMA.md" },
  { title: "Architecture and API", description: "TypeScript/Python split, simulated deployment topology, existing Core limitations, and proposed workload contract.", file: "HOSPITAL_NODE_AGENT_ENGINEERING_AND_API.md" },
  { title: "Core workload contract", description: "Additive Core authorization, assignment, lease, descriptor, audit, and verified bounded Azure lease evidence before later integration boundaries.", file: "CORE_HOSPITAL_NODE_WORKLOAD_CONTRACT.md" },
  { title: "Implementation handoff", description: "Repository map, delivery slices, test gates, contract policy, and autonomous decision rules.", file: "HOSPITAL_NODE_AGENT_IMPLEMENTATION_HANDOFF.md" }
];

export default function HospitalNode() {
  return (
    <div className="doc-page node-dossier">
      <header className="doc-topbar"><p>10 / LOCAL WORKLOAD</p><span className="topbar-meta"><ShieldCheck size={15} />synthetic-first boundary</span></header>
      <section className="page-title"><p className="folio">10.0 / HOSPITAL NODE AGENT</p><h1>Send the work<br /><i>to the data.</i></h1><p>A separate, locally operated training workload now carries the research system beyond a proven Core callback—without turning the Core into a hospital system or moving raw study data across the boundary.</p></section>
      <section className="node-charter">
        <div className="node-charter-symbol"><Workflow size={29} /></div>
        <div><span>ACCEPTED PRODUCT BOUNDARY</span><h2>Local optimization is an accountable workload, not an API upload.</h2><p>The Agent validates a frozen command, trains only against its configured local adapter, and submits a descriptor-backed update through a scoped capability. It does not host patient records, diagnosis routes, a browser portal, blockchain coordination, or Core database access.</p></div>
        <StatusStamp status="VALIDATED" />
      </section>
      <div className="node-ledger-layout">
        <div className="node-ledger-main">
          <section className="node-proof-grid">
            <article><span>RESEARCH BASIS</span><h2>FedProx is local.</h2><p>The thesis’ heterogeneity assumptions and proximal objective are now treated as frozen local-training inputs. Server aggregation remains Core authority.</p></article>
            <article><span>IMPLEMENTED BASELINE</span><h2>One synthetic slice.</h2><p>The private repository proves canonical command validation, one-run local state transitions, deterministic FedAvg/FedProx primitives, and descriptor-only fake submission.</p></article>
            <article><span>RETAINED LIMIT</span><h2>No hospital claim.</h2><p>Only generated values and tiny tensors are accepted today. Real images, patient data, institution integration, and clinical use remain explicitly out of scope.</p></article>
          </section>
          <section className="node-evidence-row"><div><span>REPOSITORY / COMMIT</span><strong>hstu-research / <i>cfcf1dc</i></strong></div><p>Hospital Node Quality Gates #1 completed successfully for formatting, strict TypeScript, four synthetic execution tests, and four Python optimization tests.</p><a className="editorial-link" href="https://github.com/hstu-research/federated-aggregator-hospital-node" target="_blank" rel="noreferrer">Inspect repository <ArrowUpRight size={15} /></a></section>
          <section className="node-documents"><div className="section-heading"><span>DOCUMENTED DELIVERY RECORD</span><span>six design artifacts</span></div>{documents.map((document, index) => <a key={document.file} className="node-document" href={`https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/${document.file}`} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{document.title}</h2><p>{document.description}</p></div><FileText size={19} /><ArrowUpRight size={17} /></a>)}</section>
          <section className="node-next"><div><span>NEXT DESIGN GATE</span><h2>Define narrow Core assignment-creation authority before any capability or submission work.</h2></div><p>The separate private identity and generated assignment now proved one guarded Azure lease and were immediately expired. Next, the ledger must define a bounded synthetic authority that creates an assignment only from frozen eligible Core facts; safe base-model read, update intent, verification, and submission remain unimplemented. No human route, ML-worker identity, transfer, training, or hospital data is permitted.</p><CheckCircle2 size={24} /></section>
        </div>
        <aside className="node-provenance" aria-label="Bounded Azure proof provenance">
          <span>PROOF / 001</span>
          <h2>Lease<br />evidence</h2>
          <StatusStamp status="VALIDATED" />
          <div><span>RELEASE</span><strong>7d9218c</strong></div>
          <div><span>IDENTITY</span><strong>separate client</strong></div>
          <div><span>BOUND</span><strong>one lease</strong></div>
          <div><span>CLOSURE</span><strong>expired</strong></div>
          <p>Generated synthetic control facts only. No transfer, training, submission, or hospital data.</p>
        </aside>
      </div>
    </div>
  );
}
