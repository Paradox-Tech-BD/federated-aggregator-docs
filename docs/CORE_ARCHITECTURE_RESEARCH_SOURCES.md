# Core Architecture Research Sources and Design Constraints

## Research synthesis

The first-product Aggregator Core is a **server-centric federated-learning control plane**. It distributes an approved base model to eligible hospital nodes, receives model update artifacts and permitted metadata, validates these updates, aggregates an accepted set, and governs release of the resulting candidate. Healthcare FL literature makes clear that raw data do not leave the participating sites in this pattern, while model updates may still require additional privacy and security controls.[1]

NestJS and BullMQ suit the core’s control-plane background tasks when each job remains a serializable command with a durable identity. Nest documents Redis-backed queues as a way to move expensive work away from request handling and distribute producers/consumers across nodes; BullMQ’s production guidance adds that Redis persistence must be configured, queue producers should fail quickly on Redis outages, workers should reconnect/recover, and sensitive data should not be placed in job payloads.[2][3] Consequently, queue messages in this design carry only IDs, immutable command digests, and non-sensitive descriptors; PostgreSQL remains the authoritative domain state and outbox source.

Workloads should authenticate as themselves rather than inherit a browser session. OAuth client credentials is a machine-to-machine flow in which a confidential client uses its own credentials and is authorized directly as an application; certificate or federated credentials provide higher assurance alternatives to shared secrets.[4] The architecture therefore distinguishes human OIDC tokens, hospital workload credentials, and Python-worker internal service credentials, then hydrates the associated organization, role, status, and protocol scope from PostgreSQL.

Short-lived object-storage access can move large artifacts without proxying them through the public API. S3 presigned URLs grant time-limited access to a designated object/method and can include checksum verification, while the service that issues them remains accountable for the underlying permission.[5][6] The design must therefore issue one-use, round-scoped upload intents and re-verify object metadata/checksum before a submission is accepted. The storage URI alone is never proof of integrity.

OpenTelemetry’s signals model treats traces, metrics, logs, and contextual propagation as complementary views of distributed activity.[7] The architecture will propagate a correlation ID, trace context, command ID, and round/model identifiers through API requests, outbox events, queue jobs, Node dispatch, Python worker execution, callbacks, and release events.

Flower remains a future adapter, not the product’s governance layer: its documentation provides client/server, strategy, checkpoint, deployment, TLS, identity, and audit concepts, but the Aggregator Core owns its protocol registry, authorization, artifact lineage, approval workflow, and release ledger.[8]

## Source-to-design mapping

| Source | Verified point used | Resulting core decision |
|---|---|---|
| Teo et al. (2024) | FL commonly uses a central server to distribute global parameters, receive updates, and aggregate; model updates can still have privacy risk. | Retain local-data boundary; treat update artifacts as sensitive research artifacts; do not claim privacy compliance or secure aggregation. |
| NestJS queues documentation | Redis-backed producers/consumers can be distributed and preserve job state across restarts. | Use BullMQ only for Node control-plane dispatch; persist business truth and immutable commands in PostgreSQL. |
| BullMQ production guide | Persistence, no-eviction, retry/reconnect distinctions, graceful shutdown, and non-sensitive job data matter. | Configure Redis as durable queue infrastructure; adopt fail-fast producer / recoverable worker semantics and bounded, classified retries. |
| OAuth client credentials guidance | Machine identities are application identities with directly assigned permissions. | Use distinct workload and worker credentials with scope-to-organization/protocol checks. |
| S3 signed URL and integrity guidance | Presigned upload access is time-limited and may be checksum-verified. | Use direct artifact upload intents with content/size/checksum constraints, then verify before acceptance. |
| OpenTelemetry signals | Traces, metrics, logs, and context propagation support distributed observability. | Propagate request/correlation/command identifiers across all trust boundaries. |
| Flower Framework documentation | Flower supports FL strategies and deployment concerns. | Defer Flower integration behind a Python adapter; do not let it supersede governance/release boundaries. |

## References

[1] Teo, Z. L., Jin, L., Li, S., et al. “Federated machine learning in healthcare: A systematic review on clinical applications and technical architecture.” *Cell Reports Medicine*, 5(2), 101419 (2024). https://pmc.ncbi.nlm.nih.gov/articles/PMC10897620/

[2] NestJS. “Queues.” https://docs.nestjs.com/techniques/queues

[3] BullMQ. “Going to production.” https://docs.bullmq.io/guide/going-to-production

[4] Microsoft. “OAuth 2.0 client credentials flow.” https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow

[5] Amazon Web Services. “Download and upload objects with presigned URLs.” https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html

[6] Amazon Web Services. “Checking object integrity in Amazon S3.” https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity.html

[7] OpenTelemetry. “Signals.” https://opentelemetry.io/docs/concepts/signals/

[8] Flower Labs. “Flower Framework Documentation.” https://flower.ai/docs/framework/index.html

[9] Amazon Web Services. “Transactional outbox pattern.” https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html

[10] OpenTelemetry. “Context propagation.” https://opentelemetry.io/docs/concepts/context-propagation/

[11] Kubernetes. “Configure Liveness, Readiness and Startup Probes.” https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

[12] Kubernetes. “Network Policies.” https://kubernetes.io/docs/concepts/services-networking/network-policies/

## Additional design constraints

The transactional outbox avoids a dual-write inconsistency by recording the domain update and outbox event in one database transaction. An outbox dispatcher may deliver an event more than once, so all consumers must be idempotent and preserve aggregate ordering where it is material. This is the planned handoff from PostgreSQL domain transitions to BullMQ and later integration/webhook delivery.[9]

Trace context must cross API, queue, worker, and callback boundaries but must be sanitized at the public edge and never carry credentials, patient information, or unrestricted baggage. OpenTelemetry describes propagation as the transfer of trace/span context across process boundaries and advises caution with external/untrusted context.[10]

The production topology assumes a private runtime network with default-deny ingress/egress policy and explicit allow rules for each required path. Kubernetes NetworkPolicies regulate pod traffic only when the selected network plugin enforces them, so the deployment runbook must include this prerequisite. Liveness detects stuck containers, readiness removes unavailable services from traffic, and startup probes accommodate controlled initialization; these checks are not substitutes for domain-level worker heartbeat or job-recovery state.[11][12]
