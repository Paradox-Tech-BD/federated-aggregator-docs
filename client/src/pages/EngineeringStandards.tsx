/**
 * Research Ledger design: engineering standards are rendered as an auditable build plan—modular boundaries, typed contracts, deterministic computation, and testable delivery.
 */
import { BadgeCheck, Boxes, Braces, Code2, FlaskConical, Layers3, ShieldCheck, TestTube2, Workflow } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { StatusStamp } from "@/components/StatusStamp";
import "./EngineeringStandards.css";

const repoMap = `flowchart TB
  Root[federated-aggregator-core\none reviewable monorepo] --> Apps[apps/\nAPI + dispatch worker]
  Root --> Packages[packages/\ncontracts, domain, application, adapters]
  Root --> Python[python/\nML core + ML worker]
  Root --> Infra[infra/\ncompose, migrations, telemetry]
  Root --> Tests[tests/\ncontract, E2E, resilience, fixtures]
  Root --> Docs[docs/\nADRs, runbooks, evidence]
  Apps --> API[NestJS API\ncontrol-plane composition]
  Apps --> Dispatch[Node dispatch worker\noutbox + queue runners]
  Python --> Core[Pure PyTorch ML core]
  Python --> Worker[Worker command/result adapter]
  classDef core fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef edge fill:#22373a,stroke:#22373a,color:#fffdf8
  classDef support fill:#f6ead1,stroke:#af9140,color:#182c32
  class Root,Packages,Core core
  class API,Dispatch,Worker edge
  class Infra,Tests,Docs support`;

const dependencyMap = `flowchart TB
  Contracts[contracts\nversioned schemas + fixtures] --> Domain[domain\nvalues, aggregates, events]
  Domain --> Application[application\nuse cases, ports, policy]
  Contracts --> Application
  Application --> Api[API composition\nNest controllers/guards]
  Application --> Dispatch[Dispatch composition\noutbox/job runners]
  Contracts --> Worker[Python worker\ncommand/result adapter]
  Worker --> MlCore[Python ML core\nvalidation + aggregation]
  Api --> Adapters[Postgres · S3 · OIDC · OTel]
  Dispatch --> Adapters2[Postgres · S3 · BullMQ · OTel]
  Worker --> Adapters3[Artifact port · telemetry]
  classDef inward fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef edge fill:#22373a,stroke:#22373a,color:#fffdf8
  classDef adapter fill:#edf0ea,stroke:#788b84,color:#182c32
  class Contracts,Domain,Application,MlCore inward
  class Api,Dispatch,Worker edge
  class Adapters,Adapters2,Adapters3 adapter`;

const contractMap = `sequenceDiagram
  autonumber
  participant API as NestJS API
  participant DB as PostgreSQL
  participant D as Dispatch worker
  participant W as Python worker
  API->>DB: Persist frozen AggregationCommand + digest
  DB-->>D: Outbox reference only
  D->>DB: Reload canonical command
  D->>W: Versioned JSON command + trace context
  W->>W: Schema/digest + tensor validation
  W-->>API: Versioned WorkerResult + same digest
  API->>DB: Match job/attempt/digest before mutation
  alt exact match
    API->>DB: Candidate/evidence lineage
  else mismatch or stale result
    API->>DB: Callback anomaly only
  end`;

const testMap = `flowchart BT
  Unit[Fast unit + domain tests\nmost cases] --> Module[Module/application tests\nports overridden]
  Module --> Adapter[Real adapter integration\nPostgres/Redis/MinIO]
  Adapter --> Contract[Node/Python/public contract fixtures]
  Contract --> E2E[Two-node E2E simulation]
  E2E --> Resilience[Controlled interruption\nreconciliation + security]
  classDef base fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef mid fill:#f6ead1,stroke:#af9140,color:#182c32
  classDef top fill:#22373a,stroke:#22373a,color:#fffdf8
  class Unit,Module base
  class Adapter,Contract mid
  class E2E,Resilience top`;

const serviceMap = `flowchart LR
  Dev[Developer / CI] --> Local[Compose or testcontainers]
  Local --> API[NestJS API]
  Local --> Dispatch[Dispatch worker]
  Local --> ML[Python ML worker]
  API --> PG[(PostgreSQL)]
  API --> S3[(MinIO / S3)]
  Dispatch --> PG
  Dispatch --> Redis[(Redis)]
  Dispatch --> S3
  ML --> S3
  API -. safe signals .-> OTel[OTel Collector]
  Dispatch -. safe signals .-> OTel
  ML -. safe signals .-> OTel
  Issuer[OIDC test issuer\nJWKS fixture] -. test tokens .-> API
  classDef app fill:#e2efed,stroke:#0d7c78,color:#182c32
  classDef state fill:#edf0ea,stroke:#788b84,color:#182c32
  classDef test fill:#f6ead1,stroke:#af9140,color:#182c32
  class Dev,Local,Issuer test
  class API,Dispatch,ML app
  class PG,S3,Redis,OTel state`;

const principles = [
  ["01", "Own a capability", "A round rule belongs to the round module. No generic helper, controller, SQL trigger, or queue consumer gets to quietly own it."],
  ["02", "Depend inward", "Domain and use cases consume ports. NestJS, SQL, Redis, S3, OIDC, telemetry, and HTTP remain adapter/composition details."],
  ["03", "Freeze the evidence", "Commands, input descriptors, digests, environment manifests, decision events, and worker results make a scientific outcome explainable."],
  ["04", "Test the boundary", "Most tests are small and deterministic; each external boundary earns a focused integration, contract, or controlled-failure test."],
];

const capabilityRows = [
  ["Identity & access", "Principal hydration, workload status, memberships, scopes", "IdP administration, UI sessions"],
  ["Protocol & rounds", "Immutable protocol, base-model/participant snapshot, round and submission transitions", "Tensor deserialization or SQL shortcuts"],
  ["Artifacts & aggregation", "Intent records, validation facts, frozen command, job reconciliation", "Bucket-wide access or numerical policy"],
  ["Model & release", "Candidate lineage, evidence completeness, approval/rejection/rollback events", "Local training or opaque automatic release"],
  ["Audit & operations", "Audit/export/recovery facts, reconciliation policy, incident linkage", "Silent history rewrite"],
];

const reuseRows = [
  ["FedAvg/FedProx primitives", "ADAPT", "Preserve behavioral tests in a new pure Python package; add serialization, evidence, limits, and architecture-policy checks."],
  ["Clean-room ML tests", "REUSE AS FIXTURES", "Carry forward hand-computable aggregation and FedProx boundary assertions, then expand the negative test corpus."],
  ["Express aggregator shell", "REFERENCE ONLY", "Use its valid/invalid state examples, not its in-memory state or transport implementation."],
  ["Hospital/admin shells", "OUT OF SCOPE", "Keep as research reference; no product-core dependency."],
  ["Blockchain/IPFS adapter", "DEFER", "Keep no dependency in the first release path."],
];

const qualityRows = [
  ["Types and names", "Strict TypeScript/Python typing, specific domain names, parsed `unknown` boundaries, no broad `any` escape hatch."],
  ["Errors and outcomes", "Typed reason codes for expected domain failure; technical faults mapped only at the boundary; no catch-all success/failure booleans."],
  ["Time and randomness", "Injected clocks/ID generators, declared seeds, canonical command serialization, deterministic order policy."],
  ["Configuration and secrets", "Validated typed config at startup, namespaced injection, ignored real `.env`, short-lived least-privilege credentials."],
  ["Audit and observability", "Structured redacted logs, correlation IDs, traces/metrics, durable audit events distinct from diagnostic logs."],
];

export default function EngineeringStandards() {
  return (
    <div className="doc-page engineering-page">
      <header className="doc-topbar"><p>05 / ENGINEERING STANDARDS</p><StatusStamp status="PROVISIONAL" /></header>
      <section className="page-title engineering-title"><p className="folio">05.0 / MODULAR CODEBASE, CLEAN CODE, AND TESTED DELIVERY</p><h1>Build the core so every<br /><i>boundary can be proved.</i></h1><p>The Aggregator Core will be one modular monorepo: a NestJS control plane, a Node dispatcher, and an isolated Python/PyTorch worker linked by versioned contracts, evidence-preserving state, and layered tests.</p></section>

      <section className="engineering-charter"><div className="engineering-charter-icon"><Layers3 size={26} /></div><div><span>ENGINEERING DECISION</span><h2>Clean code means capability ownership, explicit interfaces, isolated side effects, deterministic computation, and tests that state behavior. It does not mean microservices by default or abstractions with no decision behind them.</h2></div><StatusStamp status="VALIDATED" /></section>

      <section className="engineering-section"><div className="section-heading"><span>01 / ONE REPOSITORY, THREE DEPLOYABLE PROCESSES</span><span>MODULAR MONOREPO; NOT A DISTRIBUTED MONOLITH</span></div><MermaidDiagram chart={repoMap} label="Repository topology: TypeScript deployables and libraries, independent Python packages, infrastructure, tests, fixtures, and engineering evidence" /><div className="engineering-principles">{principles.map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section className="engineering-section"><div className="section-heading"><span>02 / DEPENDENCY DIRECTION AND MODULE OWNERSHIP</span><span>DOMAIN + APPLICATION NEVER IMPORT THE EDGE</span></div><MermaidDiagram chart={dependencyMap} label="Dependency direction: versioned contracts, pure domain and application layers, framework composition roots, and isolated adapter integrations" /><div className="engineering-capability-table"><div className="engineering-capability-head"><span>MODULE</span><span>OWNS</span><span>EXCLUDES</span></div>{capabilityRows.map(([name, owns, excludes]) => <article key={name}><h3>{name}</h3><p>{owns}</p><p>{excludes}</p></article>)}</div></section>

      <section className="engineering-section"><div className="section-heading"><span>03 / CONTRACT-FIRST NODE–PYTHON WIRING</span><span>SCHEMA + DIGEST; NEVER A CROSS-LANGUAGE IMPORT</span></div><MermaidDiagram chart={contractMap} label="Internal aggregation contract: frozen command, outbox reference, canonical reload, Python validation, versioned result, and exact digest reconciliation" /><div className="engineering-contract-note"><Braces size={21} /><div><span>THE CRITICAL SEAM</span><h2>OpenAPI and JSON Schema define the wire. Golden fixtures prove both languages mean the same thing.</h2></div><p>The Aggregation Command, Worker Result, evidence manifest, error-code registry, and domain-event envelope receive semantic versions. Breaking changes increment the contract version, update fixtures, and require API, dispatcher, worker, and compatibility tests in one review.</p></div></section>

      <section className="engineering-section"><div className="section-heading"><span>04 / REUSE WITHOUT ACCIDENTAL COUPLING</span><span>PRESERVE VERIFIED BEHAVIOR; REBUILD PRODUCT BOUNDARIES</span></div><div className="engineering-reuse-list">{reuseRows.map(([asset, decision, action]) => <article key={asset}><span className={`reuse-tag ${decision.toLowerCase().replaceAll(" ", "-")}`}>{decision}</span><h3>{asset}</h3><p>{action}</p></article>)}</div></section>

      <section className="engineering-section"><div className="section-heading"><span>05 / TESTING AND SCIENTIFIC VERIFICATION LADDER</span><span>FAST, DETERMINISTIC TESTS FORM THE BASE</span></div><MermaidDiagram chart={testMap} label="Layered verification: unit/domain, module, real adapter, contract, two-node end-to-end, and resilience/security tests" /><div className="engineering-test-grid"><article><TestTube2 size={20} /><h3>Pure and deterministic</h3><p>Round transitions, idempotency, policy, error codes, command digests, weighted averages, one-client identity, FedProx μ=0, and malformed tensors run without network, system clock, or clinical data.</p></article><article><FlaskConical size={20} /><h3>Real boundaries, narrow scope</h3><p>Ephemeral PostgreSQL, Redis, MinIO, and an OIDC fixture prove migration, repository, upload-intent, queue, callback, and authorization adapters without a production account.</p></article><article><BadgeCheck size={20} /><h3>Few high-value simulations</h3><p>Two simulated hospital nodes prove the complete release path. Controlled interruptions prove retries cannot duplicate, lose, or mutate the frozen scientific input set.</p></article></div></section>

      <section className="engineering-section"><div className="section-heading"><span>06 / SUPPLEMENTARY SERVICES AND DEVELOPER ENVIRONMENT</span><span>FAITHFUL BOUNDARY TESTS, NOT PLATFORM ACCUMULATION</span></div><MermaidDiagram chart={serviceMap} label="Local engineering topology: API, dispatch, and Python worker against ephemeral stateful services, OIDC fixture, telemetry collector, and simulated nodes" /><div className="engineering-service-strip"><div><Boxes size={22} /><span>REQUIRED FIRST</span><h2>PostgreSQL, Redis, MinIO, OIDC fixture, and OpenTelemetry Collector.</h2></div><p>Docker Compose or testcontainers provides the reproducible local/CI boundary. Prometheus/Grafana, Toxiproxy, and a Flower adapter remain purposeful additions for later slices—not initial dependencies. Raw patient data, production credentials, and hospital backends do not belong in this environment.</p><StatusStamp status="VALIDATED" /></div></section>

      <section className="engineering-section"><div className="section-heading"><span>07 / CODE-QUALITY RULES THAT AUTOMATION CAN ENFORCE</span><span>READABLE, REVIEWABLE, AND SAFE BY DEFAULT</span></div><div className="engineering-quality-list">{qualityRows.map(([name, standard], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{standard}</p></article>)}</div></section>

      <section className="engineering-gates"><div><Code2 size={22} /><span>SCaffold approval gates</span><h2>Approve the rules before creating the repository.</h2></div><ol><li>Confirm the new product-core repository and the reference-only status of the clean-room platform.</li><li>Confirm packages, capability ownership, dependency rules, and the three deployable processes.</li><li>Confirm the canonical command/result schema, versioning, and golden-fixture contract process.</li><li>Confirm the quality gates, fixture/data policy, and first supplementary services.</li><li>Choose the Postgres migration/ORM tool and Python dependency-lock/type-checking tools through a short proof of concept.</li></ol><ShieldCheck size={31} /></section>
    </div>
  );
}
