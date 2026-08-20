# Design Directions

## Three candidate approaches

### Theme Name: Research Ledger

**Very Brief Intro:** An archival technical notebook with warm paper surfaces, deep ink typography, and precise cyan annotations. It makes complex federated-learning decisions feel studied, durable, and reviewable.

**Probability:** 0.07

### Theme Name: Signal Atlas

**Very Brief Intro:** A spatial systems map for a distributed learning network, combining restrained dark navy panels with bright operational signals. It emphasizes flows, version lineage, and active decision points.

**Probability:** 0.04

### Theme Name: Clinical Terminal

**Very Brief Intro:** A high-contrast clinical documentation environment that borrows the clarity of laboratory instruments and the hierarchy of scientific publishing. It is calm, serious, and oriented around evidence rather than decoration.

**Probability:** 0.09

## Chosen approach: Research Ledger

**Design Movement:** Contemporary editorial systems design, influenced by scientific field notebooks, technical standards documents, and high-end research-library interfaces.

**Core Principles:**

1. Put evidence before ornament: every visual element must clarify state, provenance, or navigation.
2. Combine an editorial reading rhythm with compact technical panels so long-form decisions remain easy to scan.
3. Use one strong structural motif—annotated ruled margins and index tabs—rather than generic cards.
4. Show uncertainty visibly through status labels and deliberate muted treatment, never by hiding it.

**Color Philosophy:** The base is a warm paper white that reduces glare during long reading sessions. Near-black ink creates institutional seriousness, while a restrained mineral teal is reserved for active, validated, and navigational signals. Oxide red is used only for cautions, rejected claims, and blocked actions.

**Layout Paradigm:** A reading room: a persistent left index rail, a wide editorial document column, and a slim right evidence margin. Primary pages shift from narrative sections into dense operational inserts instead of uniform card grids.

**Signature Elements:** Numbered chapter tabs, a fine vertical research-rule in the content margin, and evidence stamps such as `PROVISIONAL`, `VALIDATED`, and `BLOCKED`.

**Interaction Philosophy:** Navigation should feel like moving through a carefully indexed report. Hover states are subtle, API controls disclose their safety state before interaction, and destructive API examples are visibly disabled outside the mock/local environment.

**Animation:** Use brief 160–220ms opacity/transform transitions for sidebar selection, API panel expansion, and page-section entry. Respect reduced-motion preferences. Do not animate reading content aggressively.

**Typography System:** Use `DM Serif Display` for page titles and chapter-level claims, paired with `IBM Plex Sans` for navigation, descriptions, and controls. Use `IBM Plex Mono` for API methods, schema names, hashes, and experiment identifiers. Keep a disciplined scale with a large editorial title, a medium section title, and compact technical metadata.

**Brand Essence:** A research control ledger for federated model releases—built for teams that need to trace every decision from local update to approved global model. **Personality:** rigorous, calm, accountable.

**Brand Voice:** Headlines are factual and declarative; CTAs state the operational outcome rather than selling. Example lines: “A global model is a release, not a score.” and “Every accepted update leaves an auditable trail.” Generic filler such as “Welcome” or “Get started” is prohibited.

**Wordmark & Logo:** A ledger-mark composed of three offset vertical rules intersected by one rising aggregation line, with the wordmark “AGGREGATOR / LEDGER” set in compressed uppercase mono. The graphic mark must work alone as the favicon.

**Signature Brand Color:** Mineral Teal — `#0D7C78`.

## Style Decisions

- Documentation is the first product and must read like a living research record, not a marketing landing page.
- The API reference uses mock/local safety states and visibly disables destructive calls in documentation mode.
- Provisional research outcomes are preserved in place with explicit evidence stamps.
