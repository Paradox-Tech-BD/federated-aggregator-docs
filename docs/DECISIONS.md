# Initial Decisions

## ADR-001 — Build the aggregator control plane before hospital products

**Status:** Accepted.  
**Decision:** The first bounded product is the central aggregator backend and administrator/research portal. Hospital products are deferred and represented through simulated clients and upload contracts.  
**Rationale:** The model-release control plane, deterministic aggregation, provenance, and release approval must be correct before a multi-portal clinical workflow can be evaluated.  
**Consequence:** No raw hospital image ingestion or patient record management belongs in this repository.

## ADR-002 — FedProx remains client-side local optimization

**Status:** Accepted.  
**Decision:** The aggregator records algorithm metadata and combines compatible updates. A simulated hospital client applies the FedProx proximal term against the received global state.  
**Rationale:** The server must not misrepresent sample-weighted aggregation as applying FedProx by itself.  
**Consequence:** Every update manifest records `algorithm`, `mu`, `local_epochs`, optimizer configuration, base model version, and compatibility identifiers.

## ADR-003 — OpenAPI drives the API reference

**Status:** Accepted.  
**Decision:** `openapi/aggregator.v1.yaml` is the executable API contract. The documentation UI renders a safe mock/local reference now; the runtime API will validate against the same contract later.  
**Rationale:** Human-readable docs must not drift from route behavior.  
**Consequence:** Contract tests will block runtime changes that are not reflected in OpenAPI.

## ADR-004 — Documentation defaults to mock API calls

**Status:** Accepted.  
**Decision:** The API reference has no production server by default. Destructive calls remain disabled in public documentation.  
**Rationale:** A documentation page must not become an accidental operations console.  
**Consequence:** Local or staging use requires an explicit environment selection and short-lived credentials that are never persisted.
