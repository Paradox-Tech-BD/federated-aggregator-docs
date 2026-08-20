# Federated Aggregator Core Documentation

This repository is the documentation-first product for the central federated-learning aggregator. It records the product boundary, architecture decisions, FedAvg/FedProx terminology, API contracts, release controls, research chronology, and safe interactive API reference.

The current site is a static research and contract reference. Its API console defaults to deterministic mock responses. It does not store tokens, call a production API, publish releases, accept raw hospital images, or make clinical claims.

## Product boundary

The first product includes the aggregator control plane and its future admin/research portal. Hospital-local data systems, hospital portals, blockchain/IPFS deployment, and clinical workflows are deferred and represented only through contracts and simulated clients.

## Contract source

`openapi/aggregator.v1.yaml` is the initial executable API contract. When the runtime product is created, route schemas and integration tests must remain synchronized with this document before a release is published.

## Related repositories

- Documentation product: `paradox-tech-bd/federated-aggregator-docs`
- Future runtime product: `paradox-tech-bd/federated-aggregator-core`
- Legacy research rebuild reference: `paradox-tech-bd/thesis_breast_cancer`
