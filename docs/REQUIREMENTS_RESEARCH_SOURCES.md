# Requirements Research Sources

## Governance and clinical-translation evidence

### Federated-learning governance in healthcare

Eden et al. conducted a 2025 scoping review of governance for federated learning in healthcare. The review identifies governance as procedural, relational, and structural, and notes that the literature has limited synthesized guidance tailored to federated learning. It highlights the importance of formal agreements, data provisioning/control, initial model utility, ongoing monitoring, roles and responsibilities, and mechanisms to address misuse and harm.

**Implication for the aggregator product:** The core product must be more than a weight-combining API. It needs traceable participant eligibility, explicit protocol agreements, model registration, approval, audit records, monitoring, and human governance controls.

Source: Eden et al., *A scoping review of the governance of federated learning in healthcare*, npj Digital Medicine, 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12246253/

### Clinical translation gap

Teo et al. reviewed 612 federated-learning healthcare articles and reported that only 5.2% involved real-life application. The authors identify medical imaging as the most common data type and emphasize the gap between proof-of-concept systems and clinical translation.

**Implication for the aggregator product:** The first product should explicitly prioritize reproducibility, evidence status, release controls, operational auditability, and realistic multi-institution workflows rather than framing a simulation as clinical deployment.

Source: Teo et al., *Federated machine learning in healthcare: A systematic review on clinical applications and technical architecture*, Cell Reports Medicine, 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC10897620/

### Medical-imaging implementation context

Sandhu et al. review federated-learning applications in medical imaging and describe a common server-centric workflow: a central service distributes a global model, sites train locally, sites return model updates, and the central service aggregates and redistributes the global model. The review also highlights data, security, heterogeneity, and deployment challenges.

**Implication for the aggregator product:** Product requirements must include clear release bundles, compatibility and integrity checks, a defined round lifecycle, local-site heterogeneity awareness, and a boundary that prevents raw image transfer to the core service.

Source: Sandhu et al., *Medical Imaging Applications of Federated Learning*, Diagnostics, 2023. https://pmc.ncbi.nlm.nih.gov/articles/PMC10572559/

## Method and security anchors

The requirements analysis also uses the foundational FedAvg and FedProx papers, the Nextra documentation framework, Scalar OpenAPI reference integration, and OWASP authentication, session-management, and REST-security guidance. The canonical URLs are retained in the product plan and the site references.

- McMahan et al., FedAvg: https://proceedings.mlr.press/v54/mcmahan17a.html
- Li et al., FedProx: https://proceedings.mlsys.org/paper/2020/hash/1f5fe83998a09396ebe6477d9475ba0c-Abstract.html
- Nextra: https://nextra.site/docs
- Scalar for Next.js: https://scalar.com/products/api-references/integrations/nextjs
- OWASP authentication: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP session management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP REST security: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
