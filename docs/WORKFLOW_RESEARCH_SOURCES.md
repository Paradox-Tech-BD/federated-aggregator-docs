# Workflow Design Research Sources

## Research synthesis

The Aggregator Core workflow is intentionally server-centric at the control-plane layer, while its hospital nodes retain their data and execute local computation. The governing flow is therefore **base model distribution → local training → update submission → validation → aggregation → evaluation → controlled release**, not a transfer of patient records. A medical-imaging review describes the common server-centric workflow as distribution of a global model to sites, local updates against each site’s dataset, return of model versions, and server reconciliation into an updated global model.[1]

Federation does not make all evaluation results interchangeable. Flower distinguishes centralized/server-side evaluation from federated/client-side evaluation and notes that the server evaluation function can run after aggregation, while participating clients can evaluate global parameters on locally held test data.[2] The documentation must therefore label hospital-reported metrics separately from any aggregator-run evaluation result; neither can be represented as a clinical-performance claim merely because it is recorded in a release package.

FedProx is a heterogeneity-oriented generalization of FedAvg. Its baseline configuration uses an SGD optimizer with a proximal term and a `mu` hyperparameter, so the aggregator needs to retain the declared local-training configuration as scientific provenance rather than presenting average-weight aggregation itself as FedProx.[3] The first-product workflow will implement this distinction explicitly.

Operational workflow needs to recognize that local processing and model sharing can coexist with institutional data boundaries. ACR’s technical framework describes on-premise systems that retain sensitive data while exchanging permitted models, metadata, and experiment results; it also describes model manifests and controlled distribution after security review.[4] This supports a workflow model with compatibility attestations, immutable model/protocol identifiers, artifact checksums, explicit release authorization, and auditable event records, while avoiding claims that this research documentation implements ACR’s system or establishes clinical readiness.

## Source-to-decision register

| Source | Workflow claim supported | Design use in this project | Limitation applied |
|---|---|---|---|
| Sandhu et al. (2023) | A server-centric FL lifecycle distributes a global model, trains locally, returns model updates, aggregates, and repeats. | Establishes the core round sequence and local-data boundary. | FL does not by itself establish compliance, protection from inference, or clinical validity. |
| Flower: Federated evaluation | Server-side and federated/client-side evaluation are distinct pathways. | Creates separate evidence labels and evaluation records for candidate releases. | Framework documentation is not a healthcare governance standard. |
| Flower: FedProx baseline / Li et al. | FedProx addresses heterogeneity through local optimization with proximal `mu`; it generalizes FedAvg. | Requires protocol declaration and per-submission provenance for local strategy and `mu`. | No claim that any `mu` is universally correct or clinically validated. |
| Brink et al. / ACR Connect & AI-LAB | On-premise systems can support cross-site model/evaluation workflows while data remain local. | Supports external hospital-node boundary, artifact/model manifest, and governed distribution concepts. | This project is an original, research-stage aggregator core—not an implementation of ACR Connect or AI-LAB. |

## References

[1] Sandhu, S. S., Taheri Gorji, H., Tavakolian, P., Tavakolian, K., & Akhbardeh, A. “Medical Imaging Applications of Federated Learning.” *Diagnostics*, 13(19), 3140 (2023). https://pmc.ncbi.nlm.nih.gov/articles/PMC10572559/

[2] Flower Labs. “Federated evaluation.” *Flower Framework Documentation*. https://flower.ai/docs/framework/explanation-federated-evaluation.html

[3] Flower Labs. “FedProx: Federated Optimization in Heterogeneous Networks.” *Flower Baselines*. Original paper: Li, T., Sahu, A. K., Zaheer, M., Sanjabi, M., Talwalkar, A., & Smith, V. (2020). https://flower.ai/docs/baselines/fedprox.html

[4] Brink, L., Coombs, L. P., Veettil, D. K., et al. “ACR’s Connect and AI-LAB technical framework.” *JAMIA Open*, 5(4), ooac094 (2022). https://pmc.ncbi.nlm.nih.gov/articles/PMC9651971/
