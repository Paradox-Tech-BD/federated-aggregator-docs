# Aggregator Core: Non-Technical Requirements Analysis

**Status:** Draft for architecture gate 1.  
**Scope:** Central federated-learning aggregator and future administrator/research portal.  
**Out of scope:** Hospital-local clinical workflows, raw-image ingestion, hospital portals, external blockchain/IPFS deployment, and clinical decision support.

## Executive framing

The product is a **model-release control plane for a federated research network**. Its job is not merely to combine model weights. It must give participating institutions a credible, understandable, and auditable way to contribute updates, understand whether those updates were accepted, review the resulting global model, and decide whether a candidate model is fit to release for the next research round.

The underlying research opportunity is substantial: federated learning enables multiple institutions to learn from distributed data while retaining local custody of raw data. However, current healthcare federated-learning work remains dominated by prototypes rather than real-world applications, and governance mechanisms tailored to federated learning remain underdeveloped.[1] [2] The product should therefore compete on **trustworthy process**, not on a claim that federated learning automatically makes models private, clinically valid, or superior.

> “While FL minimises data-sharing challenges, concerns surrounding ethics, privacy, maleficent use, and harm remain.” — Eden et al.[1]

## Stakeholders and jobs to be done

| Stakeholder | Core need | Product outcome required |
|---|---|---|
| Research sponsor or product owner | Establish a credible multi-site research program | Clear scope, evidence status, progress visibility, and accountable release governance |
| Research administrator | Run rounds and make release decisions without hidden system behavior | An understandable workflow for participants, protocol review, update validation, approvals, and rollback |
| Aggregator operator | Resolve incomplete, incompatible, or suspicious submissions | Actionable exception handling with a visible reason, owner, next action, and audit trail |
| Participating institution | Retain local data custody while contributing fairly | Transparent participation rules, a clear update receipt, reliable model-release access, and visibility into acceptance/exclusion |
| Auditor or governance reviewer | Determine who did what, when, and under which protocol | Immutable decision history, protocol versions, release records, and evidence links |
| Thesis/research author | Make defensible scientific claims | Reproducible experiment records, separated provisional/validated evidence, and preservation of negative results |
| Future model consumer | Understand whether a release is appropriate to evaluate locally | Model card, scope, compatibility, known limitations, provenance, and rollback status |

## Product vision and value proposition

The aggregator should become the **shared evidence ledger** of a federation. It should make the following promise:

> A participating site can understand what it is contributing, a research administrator can understand why a release exists, and an auditor can reconstruct the path from a declared protocol to a published global model.

The business value is not restricted to model performance. The product reduces coordination friction across organizations, gives institutions a structured alternative to ad-hoc file exchange, creates an auditable record for collaborative research, and makes it possible to compare model candidates without silently changing protocol or data conditions. In a field where only a small share of reviewed healthcare federated-learning studies had real-life applications, a practical release-and-governance workflow is itself a meaningful product differentiator.[2]

## Non-technical product requirements

### 1. Trust, transparency, and accountability

Every consequential event must be understandable to a non-developer reviewer. The product must make explicit the active protocol, participating institutions, declared algorithm, candidate status, accepted or rejected updates, release approver, and reason for each exceptional decision. No participant should infer whether an update was used from a missing dashboard item or an unexplained metric change.

The product must preserve the difference between a **client-reported metric**, a **server-recomputed metric**, and a **thesis-validated result**. It must retain failed or rejected runs in the research chronology instead of overwriting them. This requirement responds directly to the research gap between conceptual governance principles and operational mechanisms.[1]

### 2. Institutional autonomy and fair participation

Institutions need confidence that their local data remains local and that their participation is neither invisible nor arbitrary. The core product must offer clear participation eligibility, transparent round invitation and deadline policies, a receipt for submitted update evidence, and a visible explanation when an update is excluded. It should disclose the declared contribution rule—such as sample weighting—without interpreting that rule as a clinical-quality judgment.

The first product must not establish incentives, payments, or institution rankings. Those are separate governance decisions with potential equity and conflict-of-interest consequences.

### 3. Controlled model-release governance

A global model must move through legible states: candidate, validated, approved, published, deprecated, or rolled back. The product must require human approval before publication and must make the basis for approval visible: protocol identity, update inclusion/exclusion, integrity record, evaluation evidence, compatibility, limitations, and release notes.

Operational publication and scientific validation are separate requirements. A model can be released for a controlled research round without being thesis-validated or clinically appropriate. Conversely, a high metric cannot bypass provenance, governance, or release review.

### 4. Evidence-led research workflow

The product should turn research discipline into normal work rather than extra paperwork. Every round needs a declared question, protocol version, algorithm setting, planned participants, stopping condition, and expected evidence. Every release needs a traceable connection to the round and to its review decision.

The system must support neutral and negative outcomes. FedProx should be presented as a testable strategy for heterogeneity, not as a promised improvement. The user interface and documentation must clearly state that the proximal term belongs to local client training; the aggregator records and validates the declared method before combining compatible updates.[3]

### 5. Human-centered exception handling

Real federations include late submissions, incomplete rounds, unavailable sites, incompatible model versions, uncertain metrics, and failed validation. The system must make each exception visible in terms of impact, owner, evidence, and available choices. A research administrator should be able to defer, quarantine, reject, retry, or cancel without relying on informal chat messages or undocumented database changes.

### 6. Privacy, safety, and honest claims

The core product must state what it protects and what it does not. It helps keep raw training data at participating sites, but model updates and artifacts can still present privacy and security risks. The product must not claim compliance, privacy preservation, clinical safety, or bias mitigation merely because it uses federated learning. Medical-imaging reviews continue to identify security and data issues as major concerns, and healthcare governance literature identifies concerns about privacy, bias, misuse, and harm.[1] [4]

### 7. Documentation as a product capability

Documentation is not a separate afterthought. It must provide a readable record of purpose, boundaries, terms, decisions, APIs, roles, release criteria, research logs, open questions, and sources. It must update whenever the scope, protocol, risk position, product decision, or evidence status changes. The interactive API reference must default to mock/local environments and cannot act as an unrestricted production control surface.

## Required product capabilities, stated as outcomes

| Capability area | Required outcome | Explicit non-goal in phase 1 |
|---|---|---|
| Participant governance | Administrators can register, assess, activate, pause, and explain participant eligibility | Automatic institutional credentialing |
| Round management | Every round has a purpose, declared protocol, state, timeline, and accountable owner | Autonomous execution without human review |
| Update accountability | Each received update has a receipt, validation outcome, and inclusion/exclusion reason | Raw-data inspection by the aggregator |
| Model registry | Every candidate/release has identity, lineage, status, limitations, and release notes | Claiming clinical certification |
| Approval and rollback | Authorized reviewers can approve, publish, deprecate, or roll back with a reason | Irreversible publication without review |
| Evidence record | Research claims link to protocol, code, data manifest, metrics, and review status | Replacing formal ethics or regulatory review |
| Documentation and API reference | Stakeholders can understand contracts and safely explore mock/local requests | Storing user tokens or enabling public destructive API calls |
| Audit and review | A reviewer can reconstruct a decision path without relying on personal memory | Surveillance beyond documented governance needs |

## Business and collaboration requirements

The product should initially target research consortia, academic collaborations, and early-stage multi-institution model-development programs rather than positioning itself as a clinical production platform. Its commercial or organizational value lies in reducing the overhead of coordinating model updates and providing an evidence-ready governance layer that collaborators can trust.

Collaboration agreements must define ownership of local data, permitted purposes, participation and withdrawal rules, model-artifact ownership, authorship and publication expectations, breach/incident communication, retention periods, dispute resolution, and who may approve releases. The product can make these agreements visible and enforce their operational consequences, but it cannot replace legal, institutional-review, or regulatory processes.

The most important adoption requirement is a low-friction first use. A participating institution should be able to understand the project’s purpose, its data boundary, its expected contribution, and what it receives in return before integrating any local training worker. The first live demonstration should use simulated hospitals and synthetic/reference artifacts to prove the workflow before exposing any sensitive dataset.

## Research requirements and gaps

| Research gap | Why it matters | Requirement for this product |
|---|---|---|
| Prototype-to-practice gap | Real-life FL application remains uncommon in the reviewed healthcare literature.[2] | Prioritize auditability, role clarity, repeatable workflows, and documented exceptions over visual claims of maturity |
| Governance-operationalization gap | Healthcare FL governance literature identifies limited tailored mechanisms.[1] | Encode protocol, approval, participant, monitoring, and model-registration decisions as visible workflows |
| Heterogeneity evidence gap | Different institutions may have unequal data, hardware, labels, and distributions.[4] | Preserve per-site context and make FedAvg/FedProx comparisons protocol-controlled rather than headline-driven |
| Privacy-overclaim gap | Keeping raw data local does not eliminate update leakage, poisoning, or misuse risk.[1] [2] | Use precise claims, risk disclosures, quarantine/approval controls, and future privacy-extension decision records |
| Reproducibility gap | Research results can drift when data, code, settings, and thresholds are not linked | Treat a model release and a thesis result as traceable evidence packages, not dashboard values |
| Model-release accountability gap | A global checkpoint alone provides weak context for reuse | Require release notes, model card, compatibility statement, integrity data, and rollback history |

## Opportunities

The aggregator can become a high-value research product by turning often-hidden coordination work into reusable organizational memory. It can enable a consortium to compare different aggregation strategies under the same declared conditions, make the consequences of client heterogeneity visible, preserve rejected hypotheses, and support publication-quality traceability.

The documentation-first approach is a second opportunity. A living record of decisions and contracts builds shared vocabulary between researchers, developers, reviewers, and institutions before a complex backend exists. Interactive API documentation can shorten integration time later, provided that it remains safely mock-first and does not become an uncontrolled administrative console.

## Risks and guardrails

| Risk | Guardrail |
|---|---|
| Treating federated learning as an automatic privacy or compliance solution | Keep privacy claims scoped; document residual risks and required governance review |
| Optimizing for a single global accuracy number | Require site-level evidence, balanced metrics, protocol context, and result status |
| Hiding exclusions or failures | Preserve quarantine, rejection, cancellation, and rollback reasons in the audit and research log |
| Confusing research release with clinical deployment | Maintain separate operational-release and thesis-validation statuses; declare clinical use out of scope |
| Governance added too late | Make role, approval, participant, and documentation requirements part of the first product |
| API docs becoming a risky control plane | Default to mock/local, disable destructive public calls, and never persist tokens |
| Documentation drift | Update the ledger whenever a decision, scope, protocol, or evidence state changes; link docs to versioned contracts |

## Acceptance criteria for the next architecture gate

The product may move from non-technical analysis into architecture only after the following points are accepted:

1. The primary customer is confirmed as a research consortium or multi-institution research program, not a clinical production buyer.
2. The first release is confirmed as a controlled research model release, not a clinical decision-support release.
3. The role/approval model and ownership of release decisions are agreed.
4. The participation and withdrawal policy is described in business terms.
5. The evidence standard for a `validated` research result is defined.
6. The team accepts that FedProx may yield a neutral or negative result and that this outcome remains publishable evidence if reproducible.
7. The documentation site is accepted as the ongoing decision ledger.

## References

[1] Eden et al., [*A scoping review of the governance of federated learning in healthcare*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12246253/), *npj Digital Medicine*, 2025.

[2] Teo et al., [*Federated machine learning in healthcare: A systematic review on clinical applications and technical architecture*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10897620/), *Cell Reports Medicine*, 2024.

[3] Li et al., [*Federated Optimization in Heterogeneous Networks*](https://proceedings.mlsys.org/paper/2020/hash/1f5fe83998a09396ebe6477d9475ba0c-Abstract.html), MLSys, 2020.

[4] Sandhu et al., [*Medical Imaging Applications of Federated Learning*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10572559/), *Diagnostics*, 2023.
