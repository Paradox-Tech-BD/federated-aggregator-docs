/**
 * Research Ledger design: API reference treats safety and operational effect as first-class metadata,
 * using a calm terminal-like panel rather than a generic developer portal.
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Check, Clipboard, Code2, LockKeyhole, Play, Server } from "lucide-react";
import { StatusStamp } from "@/components/StatusStamp";

type Endpoint = { method: string; path: string; title: string; safety: "read" | "write" | "restricted"; description: string; request: string; response: string; audit: string };
const endpoints: Endpoint[] = [
  { method: "GET", path: "/api/v1/rounds/{roundId}", title: "Inspect a round", safety: "read", description: "Returns the current lifecycle state, protocol metadata, and accepted update count.", request: "GET /api/v1/rounds/rnd_2026_001\nAuthorization: Bearer <short-lived-token>", response: '{\n  "id": "rnd_2026_001",\n  "state": "collecting",\n  "algorithm": "fedprox",\n  "mu": 0.1,\n  "accepted_updates": 2\n}', audit: "Read event only; no round mutation." },
  { method: "POST", path: "/api/v1/rounds/{roundId}/updates", title: "Submit update manifest", safety: "write", description: "Registers a participant update for validation. The artifact is referenced by checksum; raw images are not accepted.", request: 'POST /api/v1/rounds/rnd_2026_001/updates\nContent-Type: application/json\nIdempotency-Key: local-demo-001\n\n{\n  "participant_id": "sim-hospital-a",\n  "sample_count": 240,\n  "artifact_sha256": "a4f2…9b7c",\n  "architecture_id": "reference-v0"\n}', response: '{\n  "submission_id": "upd_0042",\n  "status": "queued-for-validation",\n  "request_id": "req_mock_008"\n}', audit: "Creates update-submitted event; artifact remains subject to validation." },
  { method: "POST", path: "/api/v1/releases/{releaseId}/publish", title: "Publish approved release", safety: "restricted", description: "Transitions an approved candidate to published. Disabled in public documentation and requires an explicit local/staging confirmation.", request: "POST /api/v1/releases/rel_0007/publish\nAuthorization: Bearer <research-admin-token>", response: '{\n  "release_id": "rel_0007",\n  "status": "published",\n  "model_version": "v0.4.0"\n}', audit: "Creates a release-published audit event and requires a reason." },
];

export default function ApiReference() {
  const [selected, setSelected] = useState(0);
  const [environment, setEnvironment] = useState("Mock");
  const [responseShown, setResponseShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const endpoint = endpoints[selected];
  const isRestricted = endpoint.safety === "restricted";
  const displayResponse = useMemo(() => responseShown ? endpoint.response : "// Select ‘Run mock request’ to view a safe, deterministic response.", [endpoint.response, responseShown]);

  const copyRequest = async () => { await navigator.clipboard?.writeText(endpoint.request); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };

  return (
    <div className="doc-page api-page">
      <header className="doc-topbar"><p>05 / API REFERENCE</p><StatusStamp status="MOCK MODE" /></header>
      <section className="page-title api-title"><p className="folio">05.0 / OPENAPI-DRIVEN REFERENCE</p><h1>Test the contract<br /><i>without risking a release.</i></h1><p>Every endpoint is described by a versioned OpenAPI contract. The reference defaults to deterministic mock responses; live requests require an explicit safe environment selection.</p></section>

      <section className="api-safety-banner"><LockKeyhole size={18} /><div><strong>Safe API-calling rules.</strong><span>Mock is the default. Tokens are never persisted. Publish and rollback operations are disabled in public documentation.</span></div></section>

      <section className="api-layout">
        <aside className="endpoint-index">
          <div className="section-heading"><span>ENDPOINTS</span><span>V1</span></div>
          {endpoints.map((item, index) => <button onClick={() => { setSelected(index); setResponseShown(false); }} className={`endpoint-item ${selected === index ? "active" : ""}`} key={item.path}><span className={`method method-${item.method.toLowerCase()}`}>{item.method}</span><span>{item.path.replace("/api/v1", "")}</span></button>)}
        </aside>
        <div className="endpoint-detail">
          <div className="endpoint-title-row"><div><span className={`method method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span><code>{endpoint.path}</code></div><span className={`endpoint-safety ${endpoint.safety}`}>{endpoint.safety === "read" ? "READ ONLY" : endpoint.safety === "write" ? "AUDITED WRITE" : "RESTRICTED"}</span></div>
          <h2>{endpoint.title}</h2><p className="endpoint-description">{endpoint.description}</p>
          <div className="environment-control"><Server size={16} /><span>Server</span><div className="server-switcher">{["Mock", "Local", "Staging"].map((option) => <button key={option} className={environment === option ? "selected" : ""} onClick={() => setEnvironment(option)}>{option}</button>)}</div><small>{environment === "Mock" ? "No network call" : "Explicit environment required"}</small></div>
          <div className="code-grid"><div className="code-block"><div className="code-label"><span>REQUEST</span><button onClick={copyRequest}>{copied ? <Check size={14} /> : <Clipboard size={14} />}{copied ? "Copied" : "Copy"}</button></div><pre>{endpoint.request}</pre></div><div className="code-block response"><div className="code-label"><span>RESPONSE / 200</span><Code2 size={15} /></div><pre>{displayResponse}</pre></div></div>
          <div className="api-action-row"><button className="run-button" disabled={isRestricted || environment !== "Mock"} onClick={() => setResponseShown(true)}><Play size={15} />{isRestricted ? "Restricted in documentation" : environment === "Mock" ? "Run mock request" : "Local/Staging hookup pending"}</button>{isRestricted && <span className="restricted-note"><AlertTriangle size={15} />Publication remains disabled outside the secured admin portal.</span>}</div>
          <div className="audit-effect"><span>AUDIT EFFECT</span><p>{endpoint.audit}</p></div>
        </div>
      </section>
    </div>
  );
}
