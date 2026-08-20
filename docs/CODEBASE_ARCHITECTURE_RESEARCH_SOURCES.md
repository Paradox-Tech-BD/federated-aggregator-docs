# Codebase Architecture and Engineering Standards — Research Sources

## Research synthesis

Comparable federated-learning runtimes demonstrate a useful separation between long-lived coordination/transport processes and short-lived task-specific application code. Flower describes a hub-and-spoke federation in which server-side coordination and client-side local execution are distinct. Its deployed architecture divides long-lived communication/scheduling elements from short-lived `ServerApp` and `ClientApp` processes containing project-specific aggregation, selection, local training, evaluation, and preprocessing logic.[1] OpenFL similarly describes the collaborator as the only component with local dataset access, while the aggregator receives updates and combines them into the global model.[2] The Aggregator Core will keep these concepts but remain independent of either runtime: governance, authorization, protocol registry, artifact lineage, release approval, and audit are application-owned modules rather than framework configuration.

The TypeScript control plane will use a pnpm workspace plus TypeScript project references for explicit compile-time package boundaries. TypeScript documents that project references split programs into smaller pieces, improve build/typecheck performance, and enforce logical separation; referenced projects consume declaration output and `tsc --build` follows dependency order.[3] This supports an intentionally directional graph: stable contracts and pure domain packages at the bottom; application modules above them; transport, persistence, and composition roots at the edge.

The Python ML code will use a `pyproject.toml` package with a `src/` layout and tests outside the package. Pytest recommends isolated environments, a `pyproject.toml`, an installed/editable package, a separate `tests/` directory where appropriate, and its importlib mode for new projects; it also documents strict configuration options.[4] The worker will therefore expose a small typed internal API over domain-neutral ML contracts, not import NestJS, database, queue, or HTTP modules.

The test design is layered rather than E2E-heavy. Unit tests dominate and run without network or clock dependence; integration tests prove a real adapter boundary; contract tests verify Node/Python and public API schemas; deterministic ML tests prove FedAvg/FedProx invariants; a smaller number of end-to-end and resilience tests prove the complete system wiring. This aligns with test-pyramid guidance that cautions against using large end-to-end tests as the bulk of a suite.[5]

NestJS supports an explicit module and dependency-injection model for isolated unit tests, module tests with overridden providers, and application-level end-to-end tests.[6] It also provides global request validation with options to whitelist/forbid unknown properties, and configuration facilities for externally supplied environment settings, typed namespaced configuration, and startup validation.[7] [8] The core will use those framework facilities at the transport/composition edge while keeping domain policy and use cases independent of Nest decorators, controllers, ORMs, and HTTP request objects.

## Source-to-design mapping

| Source | Verified concept | Design implication |
|---|---|---|
| Flower Architecture | Long-lived communication/scheduling infrastructure is distinct from short-lived server/client task code. | Keep the core control plane and hospital/node runtime separate; hide any Flower adapter behind the Python worker port. |
| OpenFL Overview | Local dataset access remains with a collaborator; aggregator combines updates. | Preserve hospital-local data ownership and limit core-side code to update/evidence artifacts. |
| TypeScript Project References | Explicit project references improve logical separation and build behavior. | Define workspace libraries with one-way imports and composite project references; reject deep cross-package imports. |
| pytest Good Integration Practices | `pyproject`, `src` layout, external tests, editable installs, importlib mode, and strictness make tests/package behavior clearer. | Use independent Python worker packages with strict pytest and fixture-based deterministic tests. |
| Google Testing Blog | Heavy reliance on end-to-end tests produces costly/fragile feedback; lower-layer coverage should form the foundation. | Build a layered test pyramid with E2E only for valuable end-to-end federation and recovery paths. |
| NestJS Testing / Validation / Configuration | Isolated/unit/module/E2E testing support; request and startup configuration validation. | Use feature modules with adapter interfaces, strict inbound DTO validation, typed startup configuration, and test-time provider overrides. |

## References

[1] Flower Labs. “Flower Architecture.” https://flower.ai/docs/framework/explanation-flower-architecture.html

[2] OpenFL. “Overview.” https://openfl.readthedocs.io/en/latest/

[3] TypeScript. “Project References.” https://www.typescriptlang.org/docs/handbook/project-references.html

[4] pytest. “Good Integration Practices.” https://docs.pytest.org/en/stable/explanation/goodpractices.html

[5] Google Testing Blog. “Just Say No to More End-to-End Tests.” https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html

[6] NestJS. “Testing.” https://docs.nestjs.com/fundamentals/testing

[7] NestJS. “Validation.” https://docs.nestjs.com/techniques/validation

[8] NestJS. “Configuration.” https://docs.nestjs.com/techniques/configuration

[9] NestJS. “Workspaces.” https://docs.nestjs.com/cli/monorepo
