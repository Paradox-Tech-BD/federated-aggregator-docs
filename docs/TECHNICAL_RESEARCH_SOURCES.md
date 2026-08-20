# Technical Research Sources

## Node.js control-plane evidence

NestJS documents microservices as applications that use a transport layer distinct from HTTP and supports both request-response and event-based messaging across built-in transports. Its abstraction allows transport choice to be separated from application logic, while standard concerns such as dependency injection, validation pipes, guards, interceptors, and exception filters remain applicable. The framework is therefore appropriate for the TypeScript control plane, but the first core release should remain a modular monolith with explicit contracts before splitting into separately deployed services.

**Source:** NestJS, *Microservices*. https://docs.nestjs.com/microservices/basics

## Python federated-worker evidence

Flower’s framework documentation positions the framework for researchers and developers who want to bring existing machine-learning workloads into a federated setting, with strategy abstraction as a core concept. This supports a Python worker boundary that owns training and aggregation strategies while the TypeScript control plane owns identities, round state, policy, audit, release, and administration.

**Source:** Flower Framework documentation. https://flower.ai/docs/framework/index.html

## Technical conclusion captured for the architecture gate

The control plane and ML runtime should communicate through versioned, implementation-neutral commands and immutable artifact manifests. The Node.js layer must not import PyTorch or make tensor-level aggregation decisions; the Python layer must not create users, authorize release approvers, or manage business-level round state. Flower is a candidate dependency for future live federation, but it does not replace the project’s own protocol, artifact, audit, or release-governance requirements.
