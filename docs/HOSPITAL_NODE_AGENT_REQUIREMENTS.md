# Hospital Node Agent — Integrated Requirements Analysis

**Status:** Drafted for implementation handoff  
**Scope:** Research-only local federated-training workload for histopathology experiments  
**Out of scope:** Hospital information system, patient portal, image repository, clinical decision support, automatic diagnosis, blockchain, IPFS, wallet identity, and direct database access to the Core.

## 1. Non-technical requirements

### 1.1 Product purpose

The Hospital Node Agent enables an institution to participate in a federated research round without centralizing its local study data. It operationalizes the thesis workflow in which heterogeneous sites train an EfficientNet-B0/coordinate-attention classifier locally for three epochs, apply the protocol’s FedProx coefficient, and contribute an update for server aggregation.[1] The Agent is a **research workload**: it creates reproducible local training evidence and an accountable update submission, not a diagnosis or a clinical action.

Healthcare FL is valuable precisely because data are siloed by ethical, privacy, logistical, and legal constraints; however, a federated update is not automatically private or clinically ready.[2] [3] The first product therefore prioritizes data locality, explicit scope, reproducibility, and controlled failure over user growth, inference throughput, or hospital-system integration.

### 1.2 Stakeholders and outcomes

| Stakeholder | Needed outcome | Agent commitment | Explicit non-commitment |
|---|---|---|---|
| Site research operator | Start, inspect, and recover a locally approved research run. | Clear local status, bounded diagnostic code, idempotent retry. | No browser workflow for patient records or diagnosis. |
| Site data steward | Keep local files and identifiers within the institution. | No raw-data HTTP route; allowlisted local adapter; redacted evidence only. | No claim that FL alone eliminates model-update leakage risk. |
| Core research administrator | Obtain compatible updates from active, scoped workloads. | Immutable command validation and descriptor-only submission. | No ability to browse the site filesystem or read local records. |
| ML researcher | Reproduce local optimization conditions across simulated sites. | Versioned configuration, code/model/environment fingerprints, deterministic fixtures. | No unqualified generalization or clinical-performance claim. |
| Auditor | Trace why a local run was accepted, rejected, or retried. | Append-only local run/event history and safe Core correlation references. | No raw exception payload, credentials, filenames, or patient data export. |

### 1.3 Research value and success measures

The thesis explicitly models label skew, quantity skew, and domain shift across three simulated sites.[1] The Agent must make those assumptions inspectable as **non-identifying local declarations** rather than attempting to copy data into the Core. Its research value is a repeatable station-level proof: the same frozen command, local configuration, seeded test corpus, and code version yield a compatible update or a clearly classified failure.

| Outcome | First-release measure | Evidence boundary |
|---|---|---|
| Locality | No raw sample, image, label, record ID, path, or dataset byte crosses the Agent/Core API boundary. | Contract tests and redacted run export. |
| Compatibility | Unsupported schema/model/preprocess/FedProx configuration fails before training. | Safe reason code and command digest only. |
| Reproducibility | Synthetic fixture reproduces deterministic one-epoch FedAvg (`μ=0`) and FedProx (`μ>0`) outcomes. | Version/digest/metric summary; no training examples. |
| Controlled participation | Only an active Core-scoped workload identity can fetch/submit for its assigned federation/round. | Auth decision, correlation ID, and safe status. |
| Recovery | Restart cannot create a second local run for an idempotency key or silently resubmit a terminal artifact. | Local state transition and Core idempotency evidence. |

### 1.4 Risk and governance requirements

Model updates can leak information, so “raw data stayed local” is necessary but insufficient as a privacy conclusion.[3] The first release must label its privacy posture accurately: direct data transport is prohibited; formal differential privacy, secure aggregation, encryption of model values beyond transport/storage safeguards, and clinical threat-model approval are future protocol choices—not implied safeguards.

| Risk | Required response in v1 | Deferred decision |
|---|---|---|
| Mismatched model or preprocessing | Block before training; require immutable protocol compatibility. | Automated migration of model/preprocessing contracts. |
| Unstable local compute | Enforce operator-configured resource/time ceilings, checkpoint only safe run state, and classify interruption. | Cluster/GPU scheduling integration. |
| Local data drift or quality uncertainty | Run local-only preflight checks and emit non-identifying declaration categories. | Cross-site statistical sharing and fairness policy. |
| Update privacy leakage | Emit only agreed descriptor/metric fields and document residual risk. | Differential privacy, secure aggregation, and formal attack evaluation. |
| Clinical misuse | Research-only labels, no inference service, no patient-facing routes, no automatic deployment. | Approved clinical evaluation and regulatory pathway. |

## 2. Technical requirements

### 2.1 System boundary and principles

The Node Agent is a separately deployable composition with a TypeScript control process and Python training process. It consumes Core APIs and object-storage capabilities; it never connects to Core PostgreSQL, Redis, BullMQ, MinIO administration, Keycloak administration, or the administrator portal.

> **Core commands authority; the Agent decides only whether it can safely execute a compatible command on local data.**

The design follows evidence that local FL clients need explicit packaging, versioning, authentication, monitoring, and recovery design rather than being treated as a thin model script.[4] Reproducible medical FL additionally needs traceability of experiment, method, and local dataset version without centralizing sensitive records.[5]

### 2.2 Functional requirements

| ID | Requirement | Acceptance condition |
|---|---|---|
| HNA-FR-01 | Validate typed local configuration before accepting work. | Missing identity, data-adapter, resource-limit, or Core endpoint configuration prevents startup. |
| HNA-FR-02 | Authenticate as a workload, never as a human browser session. | Wrong issuer/audience/scope/expired token is rejected with a safe reason. |
| HNA-FR-03 | Acquire immutable assigned commands only. | Command schema, federation, workload, round, deadline, protocol, base-model digest, and canonical digest all validate. |
| HNA-FR-04 | Resolve only a configured local data adapter. | Adapter reports a non-identifying compatibility declaration; no enumeration or upload route exists. |
| HNA-FR-05 | Execute declared FedAvg/FedProx local optimization. | `μ=0` yields baseline semantics; `μ>0` adds the proximal objective against frozen global parameters. |
| HNA-FR-06 | Submit an update through short-lived scoped artifact intent and descriptor manifest. | Bytes go direct to permitted storage; Core receives only descriptor/manifest fields. |
| HNA-FR-07 | Persist local lifecycle and idempotency state. | Restart resumes safe steps or rejects duplicates; terminal state cannot be overwritten. |
| HNA-FR-08 | Expose a local, authenticated operator status surface. | Status contains only lifecycle, timestamps, resource category, correlation ID, and bounded reason code. |
| HNA-FR-09 | Export a redacted reproducibility record. | Includes protocol/model/code/environment/data-version *digest* and metrics summary, never raw data or paths. |

### 2.3 Non-functional requirements

| Concern | Requirement |
|---|---|
| Privacy boundary | No raw patient data, images, labels, identifiers, local paths, unredacted exception values, credentials, or continuous logs leave the site. |
| Compatibility | Versioned JSON Schema/contract fixtures must validate in TypeScript and Python before a command is executable. |
| Availability | A network interruption cannot alter local scientific input; failed remote steps are classified as retryable/non-retryable with exponential bounded retry. |
| Auditability | Local state transitions are append-only and correlate to a Core command/result without storing remote secrets. |
| Performance | All training controls are configurable caps: CPU/GPU policy, worker count, batch size, local epochs, wall-clock deadline, and disk quota. No default assumes GPU availability. |
| Maintainability | Ports/adapters isolate Core client, token source, storage capability, local dataset adapter, trainer, and local state store. |
| Testing | Synthetic tensor fixtures are default; no test suite uses public-dataset image bytes, patient data, or real hospital credentials. |

### 2.4 First-release exclusion and decision gates

The Agent will not implement an upload patient API, local patient database, UI portal, DICOM/EHR/PACS connector, blockchain contract, IPFS client, wallet login, general-purpose job runner, real hospital pilot, or clinical inference endpoint. Dataset-specific adapters will begin with generated tensors and explicitly simulated BreaKHis/Kaggle metadata profiles; real image adapters require a separate evidence, rights, and local-operations gate.

The implementation may start once the next documents define the logical schema, normal/exception flows, architecture, engineering standards, Core API contract mapping, and AI implementation handoff. A test-only deployment may use the existing Azure Core for synthetic round proofs, but it will not mount or receive hospital data.

## References

[1] [Thesis FedProx Methodology](https://github.com/hstu-research/thesis_breast_cancer/blob/main/result/fedprox-result/paper_sections/methodology.md)

[2] [Zhang et al., *Recent Methodological Advances in Federated Learning for Healthcare*](https://pmc.ncbi.nlm.nih.gov/articles/PMC11240178/)

[3] [Topaloglu et al., *In the Pursuit of Privacy*](https://pmc.ncbi.nlm.nih.gov/articles/PMC8528445/)

[4] [OpenMined, *Design a Federated Learning System in Seven Steps*](https://openmined.org/blog/design-a-federated-learning-system-in-seven-steps/)

[5] [Elwes et al., *TrainTracks*](https://pmc.ncbi.nlm.nih.gov/articles/PMC13195871/)
