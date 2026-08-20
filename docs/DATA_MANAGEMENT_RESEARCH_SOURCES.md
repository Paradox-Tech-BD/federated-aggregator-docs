# Data Management and Schema Research Sources

## Federated healthcare governance

Eden et al. identify federated-learning governance in healthcare as procedural, relational, and structural. The review emphasizes formal agreements, data provisioning and control, initial model utility, monitoring, roles and responsibilities, and mechanisms for misuse or harm. The aggregator schema must therefore preserve organization/participant agreements, protocol versions, actor/role decisions, monitoring events, and model-release evidence rather than storing only rounds and tensors.

Source: Eden et al., *A scoping review of the governance of federated learning in healthcare*, *npj Digital Medicine*, 2025. https://www.nature.com/articles/s41746-025-01836-3

## Data locality and institutional control

Fed-BioMed frames collaborative healthcare learning around moving computation rather than data. Its public description states that healthcare providers keep control of patient data, approve and monitor research activities, and collaborate without centralizing records. This supports a strict core-schema boundary: the aggregator stores site/workload identity, declared local-dataset descriptors, verified model/metrics artifacts, and evidence of permission—not patient records, raw images, or local datasets.

Source: Fed-BioMed, *Collaborative learning in healthcare*. https://fedbiomed.org/

## Schema implications

The data model must distinguish the following forms of lineage:

1. **Governance lineage:** organization → membership/workload → participation agreement → protocol → round → approval.
2. **Scientific lineage:** local data declaration → preprocessing declaration → base model → local update manifest → validation → aggregation job → candidate → evaluation → release.
3. **Artifact lineage:** immutable storage object → digest/size/type/producer → retention policy → legal hold/deletion event.
4. **Operational lineage:** request/correlation → queue job → worker attempt → result callback → audit/outbox event.

No core table stores raw clinical images, patient identifiers, or a copy of a hospital’s local training set.
