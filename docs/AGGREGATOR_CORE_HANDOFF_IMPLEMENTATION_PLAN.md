# Aggregator Core — Handoff Implementation Plan

**Plan status:** Ready for product-core repository handoff; no production backend has been scaffolded under this plan.  
**Target repository:** `hstu-research/federated-aggregator-core`  
**First product boundary:** Federated Aggregator Core control plane and its future administrator portal.  
**Explicitly out of scope:** Hospital backend/frontend products, clinical workflow integrations, raw patient data, blockchain/IPFS, cryptocurrency, wallet-required access, model marketplace/billing, and automatic clinical deployment.

## 1. Direct answers to the identity question

### Is a user schema and user subsystem required?

**Yes.** The core has consequential human actions: create a federation, approve a protocol, pause a hospital workload, open/cancel a round, review evidence, publish/roll back a release, export audit records, and manage a security incident. Those actions require durable, organization-scoped, auditable authorization. The minimum human-governance schema is therefore **not optional**:

| Record | Why it is required | What it must not store |
|---|---|---|
| `users` | Stable local reference for a signed-in human and audit actor. | Passwords, OAuth refresh tokens, provider session cookies, wallet private keys. |
| `organizations` | Institution/consortium boundary; not a browser “team” label. | Patient data or raw hospital infrastructure configuration. |
| `memberships` | Scoped role assignment with activation/revocation/expiry; never a global `is_admin`. | External provider role as the final authority. |
| `federations` | Research collaboration boundary that determines which organizations and users can act. | A copy of a hospital dataset. |
| `workloads` | Separate hospital-node and ML-worker identity records. | Browser user tokens or long-lived plaintext secrets. |

This is a **thin user subsystem**: authentication remains with an identity provider, while the core maintains the local policy and evidence records it needs to operate safely. The backend reads an immutable external subject from a verified token and maps it to `users.id`; it does not implement password reset, password storage, social-login flows, or a credential vault.

### Is Clerk required?

**No; an OIDC-compatible provider is required. Clerk is the recommended managed-provider option if the future administrator portal needs fast human sign-in, MFA, organization UX, invitations, and enterprise SSO.** Keycloak remains the self-hosted alternative. The core implementation will expose an `IdentityTokenVerifier` port so the authentication provider is swappable.

If Clerk is selected, it authenticates a human and issues a token. The core still owns authorization, federation scope, workload ownership, approval rights, revocation, and audit. Clerk’s organization context is helpful portal context, but never the sole decision source: Clerk notes that browser cookie organization context can be wrong for a background request in another browser tab; the backend must receive and verify an explicit access token.[1]

### Should Clerk’s MetaMask option be enabled now?

**No for the first production release.** It may be implemented as a deliberately disabled, human-only extension after the first governed release path is proven. Clerk can support MetaMask as a Web3 sign-in provider and attach a wallet to an existing account.[2] [3] That is authentication capability—not organization membership, medical-research approval, machine identity, or release authorization.

If a later product requirement mandates wallet sign-in, use Clerk Web3 or a standards-compliant SIWE implementation behind `WalletAuthenticationProvider`. Require an approved privacy/threat-model update first. SIWE/ ERC-4361 requires a scoped signed message, domain, URI, chain ID, server nonce, issue time, and signature validation; it does not define authorization to server resources.[4] MetaMask’s SIWE domain mismatch warning can be bypassed by the user, so the server must enforce origin/domain and replay protections itself.[5]

> **V1 identity decision:** Enable **Clerk/OIDC for human administrator authentication** when the portal is built; require **local PostgreSQL authorization records**; require **separate short-lived workload identity** for hospital nodes and the Python worker; leave **MetaMask/Web3 disabled and schema-free** until a specific non-clinical business requirement is approved.

## 2. What the first core product includes

The core is a **research-release control plane**, not a federated-learning platform that runs hospital data. It registers who may participate, freezes what scientific method governs a round, receives verified update descriptors, coordinates numerical work, preserves evidence, and releases only approved candidate models.

| Product capability | First-release behavior | Primary actors | Acceptance signal |
|---|---|---|---|
| Human/organization governance | Authenticate a human, map to an organization-scoped membership, enforce local role/status/revocation. | Platform admin, research admin, site admin, auditor, reader. | A disabled/expired membership is denied even with a valid provider token. |
| Workload governance | Register and activate a site node or ML worker as a non-human principal with narrow scope. | Site workload, internal worker. | A browser/user token cannot invoke workload routes; a workload cannot approve a release. |
| Federation administration | Create a research collaboration and record participating organizations/workloads and agreement evidence. | Research/platform admin. | An inactive or withdrawn participant cannot submit. |
| Protocol registry | Version immutable task/model/preprocessing/algorithm/threshold/evaluation/release rules. | Research admin. | Referenced protocol cannot be edited; a successor version is required. |
| Round orchestration | Draft, open, collect, seal/cancel/recover a round with an immutable participant/base-model snapshot. | Research admin, readers. | Late or duplicate submission cannot alter a sealed input set. |
| Artifact intake | Issue short-lived upload intent, accept compact manifest, verify metadata/digest, and quarantine failures. | Site workload. | Core never receives raw imaging data through its API. |
| Worker dispatch | Persist a frozen aggregation/evaluation command, deliver it through Node dispatch, reconcile a signed/versioned callback. | Dispatch worker, Python worker. | Stale/mismatched result produces an anomaly record, not a model mutation. |
| Candidate/evidence registry | Link candidate artifact, accepted/excluded updates, environment, metrics, and evaluation evidence. | Research admin, reader. | No candidate is releasable without required evidence. |
| Release governance | Require authorized human approval/reason, publish release bundle, deprecate/roll back by later append-only event. | Release approver. | Rollback preserves original release history. |
| Audit/recovery operations | Durable audit events, idempotency, transactional outbox, quarantine/retry/reconciliation/export. | Auditor, administrator. | A transient failure may retry; a terminal failure never advances scientific state. |

## 3. First-release scope that is intentionally excluded

| Exclusion | Reason for exclusion | Future integration boundary |
|---|---|---|
| Hospital portal and local trainer UI | Separate product with clinical, data-residency, usability, and deployment requirements. | Versioned workload API and artifact-intent contract. |
| Raw datasets/patient images/identifiers | Violates the control-plane privacy boundary. | None; core should never accept them. |
| Wallet-required access, on-chain approval, IPFS | No approved first-release research or operational requirement; adds public identifier, custody, privacy, and governance complexity. | Optional human `WalletAuthenticationProvider` and later independent ledger adapter. |
| Multi-cloud external workload federation | Needs environment-specific trust onboarding. | `WorkloadTokenVerifier` and workload credential binding port. |
| Flower as the governing runtime | The core must prove its own contracts before adopting a framework adapter. | Python worker `AggregationEngine` adapter. |
| Real hospital/network pilot | Requires approved agreement, security test, operations runbook, and synthetic pre-pilot evidence. | Simulated nodes first; controlled pilot later. |

## 4. Canonical schema and migration plan

PostgreSQL is the authoritative source for domain state. Object storage holds model/evidence objects, never raw hospital data; Redis holds coordination state and jobs, not authoritative scientific history. Every migration is forward-only, reviewed, tested on both an empty database and a database upgraded from the prior release, and linked to the evidence decision it realizes.

### 4.1 Schema groups

| Group | Tables | Essential relationships and rules |
|---|---|---|
| Identity and organization | `users`, `organizations`, `memberships`, `workloads`, `workload_credential_bindings` | `users` is unique on `(oidc_issuer, oidc_subject)`; membership is organization-scoped and time/status bounded; workload identity is separate from user identity. |
| Federation and participation | `federations`, `federation_participants`, `participation_agreements`, `access_reviews` | Federation belongs to an owner organization; participant references organization/workload; agreement evidence is artifact-backed. |
| Protocol and data declaration | `protocol_versions`, `local_data_declarations`, `rounds`, `round_events` | Protocol is immutable after referenced; data declaration is non-identifying; round snapshots threshold/deadline/base model/eligible participants. |
| Artifact and submission | `artifacts`, `artifact_upload_intents`, `update_submissions`, `submission_validation_events`, `artifact_deletion_events` | Artifact is descriptor + digest + retention metadata; update submission has one append-only outcome path; short-lived upload intent is round/workload/kind scoped. |
| Jobs and reproducibility | `aggregation_jobs`, `worker_attempts`, `evaluation_runs`, `experiment_evidence` | Immutable command digest links ordered accepted inputs; attempt holds environment/code version/resource summary; callback is reconciled by job/attempt/digest. |
| Model and release | `model_versions`, `model_cards`, `model_release_events`, `release_approvals`, `rollback_links` | Current state is a projection; source history is event-backed and immutable after append. |
| Operations and security | `audit_events`, `api_idempotency`, `outbox_events`, `security_incidents`, `retention_policies` | Request writes are idempotent; state/audit/outbox share a transaction; operational data is redacted and retention governed. |

### 4.2 Required first migration sequence

| Migration | Delivers | Minimum invariants/tests |
|---:|---|---|
| `001_foundation` | UUID/time extensions, migration ledger, transaction helper, constrained enums/checks, database roles. | Empty database boot and migration checksum verification. |
| `002_identity_organizations` | `users`, `organizations`, `memberships`, `workloads`, credential-binding metadata. | Unique immutable subject; membership role/status/expiry rules; no password/token column. |
| `003_federations_protocols_rounds` | Federation, agreement, participant, protocol, local declaration, round/event records. | A referenced protocol rejects update; round transition matrix holds. |
| `004_artifacts_submissions` | Artifact metadata, upload intent, submission, validation/deletion event records. | Scoped single-use intent; invalid digest/state recorded as quarantine. |
| `005_jobs_evidence` | Aggregation job, worker attempt, evaluation/evidence records, outbox. | Frozen command transactionally creates outbox; callback uniqueness/digest check. |
| `006_models_releases` | Model versions/cards/releases/approvals/rollback links. | Release needs candidate + required evidence + authorized approval; rollback appends history. |
| `007_operations_retention` | Idempotency, audit, incidents, access reviews, retention rules. | Retried write returns original outcome; audit preserved; retention action emits deletion record. |

### 4.3 Human-identity schema boundary

```text
Verified Clerk/OIDC JWT
  └── iss + sub ──> users(oidc_issuer, oidc_subject)
                       └── memberships(org, role, status, expiry)
                             └── federation/policy scope decision

Workload credential / mTLS identity
  └── subject + audience ──> workloads(credential_subject, kind, status)
                                └── federation_participants(scope, status)
```

No `wallet_address`, `chain_id`, SIWE nonce, wallet session, blockchain transaction hash, or wallet signature table appears in the first migration set. If wallet authentication is approved later, introduce it through a separate ADR and migration (`wallet_identities`, one-way verified link to a human user, nonce/session lifecycle, consent/revocation), never by overloading `users.oidc_subject` or `workloads.credential_subject`.

## 5. Identity implementation plan

### 5.1 Required interfaces

| Port/interface | Implemented first | Responsibility |
|---|---|---|
| `IdentityTokenVerifier` | `OidcJwtVerifier` / optional `ClerkJwtVerifier` configuration | Verify issuer, audience, signature/JWKS, token time bounds, and extract immutable `iss`/`sub`. |
| `PrincipalHydrator` | `PostgresPrincipalHydrator` | Map verified subject to local user/workload and load active scoped state. |
| `AuthorizationPolicy` | `PostgresAuthorizationPolicy` | Evaluate action + organization + federation + resource scope. |
| `WorkloadTokenVerifier` | Internal OIDC/client-credential/mTLS adapter | Validate workload-only token/credential/audience, never a browser session. |
| `IdentityLifecycleSink` | Provider webhook reconciler | Mark local identity profile/sync state without self-granting membership or role. |
| `WalletAuthenticationProvider` | **Not implemented in v1** | Reserved future extension; no runtime registration. |

### 5.2 Clerk decision path

| Option | When to choose | Implementation position | Constraints |
|---|---|---|---|
| **Clerk-managed human auth** | Fast portal delivery, managed sign-in/MFA, possible enterprise SSO, future Web3 optionality. | Recommended managed option. Portal uses Clerk; NestJS verifies JWT; local DB authorizes. | Do not treat Clerk roles/org context as final release authority; explicit token, JWKS validation, webhook reconciliation, local membership activation required. |
| **Keycloak/self-hosted OIDC** | Institution/self-hosting policy requires provider control. | Supported alternative through same JWT verifier port. | Requires operational ownership of IdP HA, patching, backups, MFA/SSO config. |
| **Custom password auth** | Never. | Unsupported. | Increases credential and recovery security surface without product benefit. |
| **MetaMask/SIWE auth** | Approved later only if a real human self-custody requirement exists. | Optional additional human factor, never a workload credential. | Must have nonce/domain/chain/expiry/session/revocation controls and privacy review. |

### 5.3 Clerk implementation requirements, if selected

1. Create a Clerk application with only human-administrator methods enabled: email/passkey/enterprise SSO according to organization policy, MFA required for privileged roles, and explicit production domains.
2. Configure a versioned JWT template/audience for the NestJS API. Implement JWKS caching/key rotation, issuer/audience/time validation, correlation-aware auth failure logging, and strict Bearer-token extraction.
3. On a verified first sign-in, create a local `users` row in **pending** status through a controlled provisioning use case. Do not grant organization membership from frontend claims.
4. Create/activate the organization/membership in the core through a platform/research-admin action. If Clerk Organizations are used for SSO UX, store an external organization link and reconcile it, but keep local membership roles and federation scope authoritative.
5. Subscribe to selected Clerk lifecycle webhooks using signature verification and idempotency. A provider event may synchronize profile/status evidence; it never automatically grants research-admin/release-approver rights.
6. Require MFA plus fresh authentication/step-up policy for publish, rollback, credential change, membership/role change, and audit export actions.
7. Keep MetaMask disabled. A later switch may add it only to the sign-in UI after the wallet ADR, threat model, and schema are approved.

## 6. Repository and module implementation map

```text
federated-aggregator-core/
├── apps/
│   ├── api/                              # NestJS HTTP/API composition root
│   │   └── src/modules/
│   │       ├── identity-access/          # principal hydration + policy guards
│   │       ├── federations/
│   │       ├── protocols/
│   │       ├── rounds/
│   │       ├── artifacts/
│   │       ├── submissions/
│   │       ├── aggregation/
│   │       ├── models/
│   │       ├── releases/
│   │       ├── audit-operations/
│   │       └── health/
│   └── dispatch-worker/                  # Outbox delivery + BullMQ workers + reconciliation
├── packages/
│   ├── contracts/                        # OpenAPI/JSON Schema, canonical serialization, fixtures
│   ├── domain/                           # Values, aggregates, events, policy errors
│   ├── application/                      # Commands/use cases/ports; no framework imports
│   ├── persistence-postgres/             # repositories + migration helpers + transaction/outbox
│   ├── artifacts-s3/                     # scoped intent + descriptor verification
│   ├── queue-bullmq/                     # queues, retry classification, job envelopes
│   ├── identity-oidc/                    # OIDC/Clerk JWT verifier + webhook verification
│   ├── observability/                    # redacted logs, traces, metrics
│   ├── config/                           # typed startup config validation
│   └── testkit/                          # fakes, factory builders, fixtures, controlled clock
├── python/packages/
│   ├── fedagg_ml_core/                   # pure tensor/aggregation validation and algorithms
│   └── fedagg_worker/                    # command/result adapter, artifact port, result client
├── infra/{compose,migrations,observability,deploy}/
└── tests/{contract,e2e,resilience,fixtures}/
```

Each module exposes only a small public application interface. Controllers map DTOs to commands, call a use case, and map typed outcomes to responses. A domain aggregate never reads `process.env`, makes an HTTP request, reads Redis, calls an ORM, or instantiates a UUID/time directly. The Python core never opens a database connection or decides release authorization.

## 7. API and worker-contract delivery sequence

| Increment | APIs/contracts delivered | Constraints proven |
|---:|---|---|
| A | `GET /session`, organization/federation/protocol read/create routes. | JWT → local principal → scoped policy; no client role trust. |
| B | Participant/workload registration, round create/open/inspect/cancel. | Human/admin versus workload route separation and append-only round event history. |
| C | Upload intent, artifact manifest, submission status. | Direct storage path is short-lived/scoped; raw image upload is rejected/not routable. |
| D | Worker `ValidationCommand`/`ValidationResult`, aggregate command/result JSON Schema. | Golden fixtures validate in Node and Python; stale callback cannot mutate. |
| E | Candidate/evidence/model/release/rollback APIs. | Evidence/authorization gates enforce release lifecycle. |
| F | Audit export, incident/readiness, reconciliation endpoint/runbook. | Idempotent recovery and redacted audit export. |

### Worker contract minimum

| Command/result requirement | Implementation rule |
|---|---|
| Stable identity | `job_id`, `attempt_id`, `correlation_id`, `schema_version`, canonical digest. |
| Frozen scientific input | Protocol/base-model descriptor plus ordered accepted update descriptors/sample counts/policy/environment/deadline. |
| Artifact capability | Short-lived least-privilege worker-specific read/write grants; no bucket-wide credential. |
| Safe result | Status, candidate/evidence descriptors, checksum, included/excluded IDs, metric summary, environment/warnings/reason code. |
| Reconciliation | Core checks authenticated worker identity, job/attempt/correlation, contract version, input digest, round state, and result artifact metadata before transition. |

## 8. Phased implementation backlog and handoff gates

| Phase | Product slice | Main deliverables | Exit gate |
|---:|---|---|---|
| 0 | Repository foundation | Private repository, licenses/ADR template, pnpm + Python workspaces, strict lint/type format config, CI skeleton, secrets policy, testkit. | Clean checkout executes all static checks; no runtime feature claim. |
| 1 | Core domain and local identity | `users`/org/membership/workload migrations, OIDC verifier port, local principal hydration, scope policy, audit context, federation/protocol/round aggregates. | Pure tests prove authorization and transition matrix with no Nest/database requirement. |
| 2 | API + transactional state | Nest composition, strict DTO validation, PostgreSQL repos/migrations, request idempotency, audit/outbox transaction, health/readiness. | Real database test proves state + audit + outbox atomicity. |
| 3 | Artifact/submission pipeline | MinIO/S3 adapter, intent issuance, manifest parsing, node-side metadata verification, validation outcomes/quarantine. | Scope/digest/deadline/base-model failure cases are durable and idempotent. |
| 4 | Worker contract and ML baseline | Versioned schemas/fixtures, Python package split, validated aggregation, Node dispatcher, callback reconciliation. | Synthetic two-update FedAvg/FedProx-compatible job yields evidence-backed candidate; malformed/stale results are safe. |
| 5 | Candidate/release governance | Evaluation evidence, model card, human approval, publish/deprecate/rollback, release package. | No release without evidence + authority; rollback append-only event tested. |
| 6 | Operations/resilience | OpenTelemetry, controlled retry/reconciliation, access review, audit export, retention records, incident pathway. | Controlled Redis/storage/worker interruption cannot silently change frozen input or duplicate release. |
| 7 | Portal integration | Separate React admin client using Clerk/OIDC (if selected), session/introspection/read/write workflows, operator UX tests. | Browser tests prove local authorization wins over display-only client state. |
| 8 | Optional wallet ADR | Only after a non-clinical requirement. | Separate review approves SIWE/MetaMask privacy/threat model, schema, nonce/session design, and manual tests. |

## 9. Test and quality plan

| Test class | Required examples | Runs |
|---|---|---|
| Domain/unit | Membership expiry, role scope, protocol immutability, round state matrix, approval gate, canonical digest. | Every change. |
| Deterministic ML | One-client identity, sample-weighted mean, FedProx `mu=0`, state mismatch/NaN/Inf/missing key rejection, input-order policy, result manifest. | Every ML/contract change. |
| Module/application | Nest guards/use cases with fake ports and controlled clock. | Every capability change. |
| Adapter/migration | Postgres upgrade/empty DB, Redis retry, MinIO intent/digest, OIDC JWT/JWKS, Clerk webhook idempotency if selected. | Every adapter/migration change. |
| Contract | API OpenAPI and Node/Python worker golden fixtures in both runtimes. | Every schema version change. |
| E2E | Two simulated workload nodes: create protocol/round, submit, validate, aggregate, evidence, approve/publish, rollback. | Main/release candidate. |
| Resilience/security | Expired token/intent, wrong audience, revoked workload, duplicate/stale callback, storage/queue interruption, oversized payload. | Main/release candidate and affected changes. |

No CI fixture includes raw breast images, patient identifiers, hospital-network secrets, or production model artifacts. Synthetic tiny tensors and anonymous artifact manifests are the default evidence corpus.

## 10. Handoff checklist

| Handoff item | Owner action | Done when |
|---|---|---|
| Confirm product boundary | Approve core-only scope and all exclusions. | Scope is recorded as v1 product charter. |
| Choose human identity provider | Select **Clerk** or **Keycloak**; choose SSO/MFA requirements. | Provider decision and environment/config owner are recorded. |
| Confirm identity policy | Approve local user/membership/workload schema and MetaMask deferral. | ADR and migration plan approved. |
| Select persistence proof of concept | Compare migration/ORM candidates against transaction/outbox, SQL constraints, and testability. | A short spike selects one tool without weakening repository-port boundary. |
| Select Python toolchain | Approve `pyproject` lock approach and type checker. | Reproducible worker environment passes basic CI. |
| Freeze v1 contracts | Approve OpenAPI and worker schema ownership/version rules. | Golden fixtures committed before dispatcher/worker integration. |
| Create repository and baseline CI | Maintain `hstu-research/federated-aggregator-core` privately with the planned layout. | Phase 0 exit gate passes. |

## 11. Decisions awaiting explicit user confirmation

1. **Identity:** Do you approve **Clerk for the future human administrator portal**, with the core retaining local organization/membership/role/release authorization records?
2. **MetaMask:** Do you approve keeping **MetaMask disabled/deferred** until there is a concrete wallet/attestation requirement, rather than adding it now?
3. **Provider policy:** Must any participating institution use its own enterprise SSO from day one, or is Clerk-managed sign-in/MFA sufficient for the first research-only portal?
4. **Persistence:** May the implementation team run a brief, isolated migration/ORM proof-of-concept before choosing the production persistence adapter?
5. **Repository kickoff:** After the above, may the handoff create the private `federated-aggregator-core` repository and execute Phases 0–1 only?

## References

[1] Clerk. “Organizations.” https://clerk.com/docs/guides/organizations/overview

[2] Clerk. “MetaMask.” https://clerk.com/docs/guides/configure/auth-strategies/web3/metamask

[3] Clerk. “Sign-up and Sign-in Options.” https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options

[4] Ethereum Improvement Proposals. “ERC-4361: Sign-In with Ethereum.” https://eips.ethereum.org/EIPS/eip-4361

[5] MetaMask Developer Documentation. “Sign-In with Ethereum.” https://docs.metamask.io/metamask-connect/evm/guides/sign-data/siwe/
