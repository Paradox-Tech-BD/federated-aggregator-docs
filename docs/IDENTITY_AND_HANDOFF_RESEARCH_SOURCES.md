# Identity Scope, Clerk, MetaMask, and Handoff Research Sources

## Decision summary

The Aggregator Core **does require** two distinct identity subsystems in its first product release:

1. A **human user and organization-governance subsystem** for administrators, researchers, auditors, and site administrators.
2. A **workload identity subsystem** for hospital nodes and the private Python worker.

It does **not** require blockchain, a wallet, on-chain transactions, IPFS, or MetaMask for the first release. A wallet may be introduced later as an *optional human authentication factor or evidence-attestation feature*, but it must not authenticate a hospital workload, authorize a model release by itself, replace institutional membership records, or become a scientific-provenance source of truth.

## Recommended identity split

| Plane | First-release decision | Authority | Why |
|---|---|---|---|
| Human authentication | Use an OIDC-compatible provider. Clerk is an acceptable managed option; Keycloak remains an acceptable self-hosted option. | Provider issues/verifies sign-in token. | Enterprise users need recoverable, revocable, MFA-capable accounts and may later need organization-level SSO. |
| Human authorization | Mandatory local PostgreSQL `users`, `organizations`, `memberships`, and scoped policy evaluation. | Aggregator Core. | External sign-in and session context do not encode scientific/release policy with sufficient local audit and revocation semantics. |
| Machine/workload identity | Mandatory, separate short-lived workload credential plus mTLS/private-network exchange. | Aggregator Core plus institutional issuer/identity boundary. | Hospital nodes and ML workers are not browsers or human accounts; browser sessions must never serve as machine credentials. |
| Wallet/MetaMask | Deferred, optional human-account connection only. | Never an authorization source in v1. | It creates an additional public/stable identifier, session/replay handling, wallet support burden, and no first-product requirement. |

## Clerk assessment

Clerk Organizations supports multi-tenant user grouping, active organization context, roles/permissions, invitations, verified domains, and enterprise SSO through SAML or OIDC.[1] [2] This can reduce portal-authentication implementation work. However, Clerk’s organization context must not replace the core’s local authorization truth: the core must hydrate its own `users`/`memberships`, federation scope, status, workload status, approval rights, and audit context from PostgreSQL for each consequential action. Clerk itself warns that browser session cookie organization context may not match a background request in another tab; a backend request should use an explicit Authorization token.[1]

If Clerk is chosen, the portal may use its managed sign-in/organization/SSO/MFA experience, while NestJS verifies Clerk JWTs through JWKS/OIDC configuration and maps the immutable subject to local `users.oidc_subject`. Clerk webhooks become a reconciliation input—not an authorization bypass. A domain/enterprise connection can enable a hospital’s IT-managed sign-in, but automatic JIT organization membership must be mapped to **pending local access** until an authorized core administrator activates scoped membership. Clerk documents both SAML and OIDC enterprise connections and JIT provisioning behavior.[2]

## MetaMask and SIWE assessment

Clerk can enable MetaMask as a Web3 provider, enabling a user to sign up/sign in and later connect a wallet to an existing account.[3] Clerk also documents that Web3 is another authentication factor and can work with its other account and MFA features.[4] This makes Clerk technically capable of adding an *optional wallet sign-in* to a human portal.

That capability does not make a wallet the right v1 requirement. ERC-4361 Sign-In with Ethereum is an off-chain authentication format: it authenticates control of an Ethereum account through a signed message and defines scope, domain, URI, chain ID, nonce, issued time, and optional expiry.[5] It explicitly leaves authorization to server resources out of scope. A core that ever adds SIWE must validate the structured message, domain/origin, unique server-generated nonce, time bounds, chain ID, and signature; sessions bind to the wallet address. MetaMask supports SIWE and can warn about domain mismatch, but a warning can be bypassed, so the server must enforce its own checks.[6]

The v1 control plane has no approved need for a self-custodied identifier, on-chain asset, transaction signature, or blockchain proof. The safest v1 decision is therefore: **Clerk/OIDC optional for human authentication; local RBAC mandatory; workload identity mandatory; MetaMask disabled/deferred.**

## Workload-identity implications

The human and workload identity separation is security-critical. Guidance for workload identity federation favors short-lived credentials, immutable/non-reusable subject attributes, issuer/audience validation, narrow trust configuration, and protected JWKS/metadata endpoints.[7] The core will apply the same principles regardless of cloud provider: unique workload subject, organization/federation scope, status/revocation check, intended audience, short expiry, least-privilege artifact intent, and audit correlation. An email address or wallet address must never become a workload identity.

## References

[1] Clerk. “Organizations.” https://clerk.com/docs/guides/organizations/overview

[2] Clerk. “Organization-level Enterprise SSO.” https://clerk.com/docs/guides/organizations/add-members/sso

[3] Clerk. “MetaMask.” https://clerk.com/docs/guides/configure/auth-strategies/web3/metamask

[4] Clerk. “Sign-up and Sign-in Options.” https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options

[5] Ethereum Improvement Proposals. “ERC-4361: Sign-In with Ethereum.” https://eips.ethereum.org/EIPS/eip-4361

[6] MetaMask Developer Documentation. “Sign-In with Ethereum.” https://docs.metamask.io/metamask-connect/evm/guides/sign-data/siwe/

[7] Google Cloud. “Best Practices for Using Workload Identity Federation.” https://docs.cloud.google.com/iam/docs/best-practices-for-using-workload-identity-federation
