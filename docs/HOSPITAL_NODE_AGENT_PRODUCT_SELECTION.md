# Next-System Selection — Hospital Node Agent

**Decision date:** 22 August 2026  
**Decision status:** Accepted for documentation-first delivery  
**Selected repository:** `hstu-research/federated-aggregator-hospital-node`  
**Relationship to the Core:** Separate local workload product; never a Core module or an administrator-portal feature.

## Decision

The next product is a **Hospital Node Agent**: a deployable, locally operated Node.js/TypeScript control agent with a Python/PyTorch training runtime. It receives an approved, immutable training command from the Aggregator Core, uses only a hospital-local configured dataset, trains a compatible model with the frozen FedProx or FedAvg parameters, and submits only a verified model-update descriptor through the Core’s established artifact-intent and workload-identity boundaries.

This decision follows the completed Core ledger rather than the legacy hospital-backend prototype. The Core handoff deliberately excluded a hospital portal and local trainer because they carry distinct clinical-data residency, usability, deployment, and operational requirements; it reserved a versioned workload API and artifact-intent contract as their integration boundary.[1] The thesis methodology confirms that the research question’s FedProx contribution belongs at local optimization: each site retains non-IID data, trains locally, and uses the global model and declared proximal coefficient as round inputs.[2] [3]

## Why this is the next system

| Evidence | Consequence for product sequencing |
|---|---|
| The Core has now proven one synthetic end-to-end descriptor-only worker callback, but it still uses internal synthetic worker input rather than a hospital-local trainer. | A simulated but separately deployable local node is the smallest missing end-to-end boundary. |
| The thesis study defines three heterogeneous sites, local epochs, a shared model contract, and a FedProx coefficient. | The next product must own local configuration validation, local training, update packaging, and participation reporting—not server aggregation. |
| Healthcare FL literature stresses local data quality, class imbalance, constrained compute, heterogeneous data sources, and practical local optimization. [4] | The node must support explicit dataset declarations, local validation, bounded resource reporting, and recoverable execution; it must not claim that training remains private merely because no image upload route exists. |
| A federated client must solve packaging, versioning, authentication, monitoring, and training recovery independently of the centralized service. [5] | The node needs its own repository, release lifecycle, local state store, operator-facing status, and test harness. |

## What the legacy hospital backend contributes—and what it does not

The earlier prototype provides useful scientific context: it documented histopathology classification, an EfficientNet-B0/coordinate-attention model family, and a Python FedProx local training routine. It does **not** define the new product architecture. Its public patient-upload API, MongoDB patient records, blockchain-mediated coordination, IPFS model exchange, wallet-based machine access, and externally exposed inference routes conflict with the accepted Core boundary and are excluded.

| Reuse as research reference | Rewrite as the new node | Explicitly exclude |
|---|---|---|
| Model-contract evidence, data heterogeneity assumptions, local FedProx objective, reproducibility questions. | Local dataset adapter, training-run lifecycle, workload authentication, Core command/result adapters, artifact-capability client, safe local diagnostics, offline recovery. | Patient upload/list/classification APIs, raw image transport, blockchain, IPFS, wallet identity, direct Core database access, browser administration UI, automatic clinical inference or deployment. |

## Product boundary

> **The Hospital Node Agent is a local research workload, not a hospital information system, patient application, image repository, or clinical decision support tool.**

The Agent must run where an institution controls its local files and compute. It accepts an administrator-provisioned local dataset adapter and a Core-issued workload identity. It may read a globally released model descriptor and round command, but the only cross-boundary outputs are allowlisted declarations, status transitions, model-update artifacts uploaded directly through a short-lived scoped capability, checksums, sample-count policy values when the protocol allows them, and bounded training/evaluation summaries. It never sends raw patient data, images, identifiers, local file paths, source records, labels, batch examples, model internals beyond the agreed update artifact, or reusable storage credentials to the Core or public documentation ledger.

## First release responsibilities

| Capability | Node responsibility | Core responsibility | First-release evidence |
|---|---|---|---|
| Enrollment | Store an operator-provisioned workload binding and prove active scope. | Register, activate, revoke, and authorize the workload. | Revoked or wrong-scope node cannot fetch/submit. |
| Round acquisition | Poll or receive a versioned immutable command; validate its schema, federation, deadline, base-model digest, and local compatibility. | Freeze and dispatch the command. | Unsupported/expired command is rejected locally and reported safely. |
| Local data preparation | Resolve an allowlisted local dataset adapter and perform local-only integrity/eligibility checks. | Hold only non-identifying data-declaration policy. | No local path, record, or image bytes are emitted. |
| Training | Download the scoped base model, execute the declared FedProx/FedAvg-compatible training recipe, and record reproducibility facts. | Declare protocol and accept/reject final result. | Deterministic synthetic fixture proves local epoch and proximal-loss semantics. |
| Update submission | Produce/update a local artifact, upload through a scoped intent, then submit descriptor/manifest. | Verify artifact metadata and reconcile the result. | No artifact byte flows through API or database. |
| Recovery | Persist idempotent local run state; retry safe fetch/upload/submit steps and quarantine non-retryable faults. | Preserve round/job audit and state authority. | Restart cannot silently repeat or alter a sealed round. |

## First-release technology direction

The implementation will preserve the project’s accepted language split: **Node.js/TypeScript** owns node enrollment, Core API client, idempotent run coordination, typed local configuration, state/audit summaries, and operator-facing local status; **Python** owns the PyTorch model adapter, data adapter protocol, deterministic local FedProx/FedAvg training, and update serialization. A private local SQLite state store is provisionally selected for the test node because it supplies restart-safe idempotency without becoming a patient database; its schema and retention limits require validation in the technical-design phase.

The first node will run only against anonymous public-dataset fixtures or generated tensors. No real hospital onboarding, EHR/PACS integration, DICOM path, clinical account, production model, or patient image is implied by this selection.

## Documentation-first delivery gates

The new system will not begin coding until the public ledger contains the following, in order: non-technical requirements analysis; technical requirements analysis; local-only schema; normal and exception workflow design; full architecture; modular engineering standards; API and Core-contract documentation; and an AI-ready implementation handoff. The initial code slice must then prove synthetic enrollment, immutable command validation, deterministic local one-epoch FedProx behavior, scoped update submission, restart-safe idempotency, and safe rejection of invalid commands.

## References

[1] [Aggregator Core Handoff Implementation Plan](https://github.com/hstu-research/federated-aggregator-docs/blob/main/docs/AGGREGATOR_CORE_HANDOFF_IMPLEMENTATION_PLAN.md)

[2] [Thesis FedProx Methodology](https://github.com/hstu-research/thesis_breast_cancer/blob/main/result/fedprox-result/paper_sections/methodology.md)

[3] [Li et al., *Federated Optimization in Heterogeneous Networks*](https://proceedings.mlsys.org/paper_files/paper/2020/file/38af86134b65d0f10fe33d30dd76442e-Paper.pdf)

[4] [Zhang et al., *Recent Methodological Advances in Federated Learning for Healthcare*](https://pmc.ncbi.nlm.nih.gov/articles/PMC11240178/)

[5] [OpenMined, *Design a Federated Learning System in Seven Steps*](https://openmined.org/blog/design-a-federated-learning-system-in-seven-steps/)
