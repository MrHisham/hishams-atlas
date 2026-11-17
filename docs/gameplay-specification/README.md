# PHY TOLAB — First Research Assignment

Start with [GAMEPLAY-SPECIFICATION.md](GAMEPLAY-SPECIFICATION.md): fifteen fully specified quest drafts across Botanical Identification, Pharmacognosy and Phytochemistry, culminating in **The Mystery of the Herbal Capsules**.

The handoff includes observable objectives, player actions, exact synthetic teaching fixtures, correct reasoning, error-specific feedback, mastery rubrics and transfer-task authoring examples. It also covers source policy, scientific knowledge architecture, progression, accessibility, a six-phase roadmap and evaluation on genuinely new problems.

## Files

| File | Purpose |
|---|---|
| `GAMEPLAY-SPECIFICATION.md` | Main developer/SME blueprint, all fifteen quest cards and validation plan |
| `quest-specification.json` | Full authoring bundle, including answers and transfer examples |
| `prototype-content.json` | Prototype-facing scenarios/data/actions, without grading or transfer keys |
| `instructor-keys.json` | Expected reasoning, rubrics, feedback and illustrative transfer cases |
| `quest-bundle.schema.json` | JSON Schema for the authoring bundle structure |
| `SCIENTIFIC-CONTENT-SCHEMA.json` | JSON Schema for normalized scientific entities |
| `SCIENCE-DOMAIN-RULES.json` | Cross-entity, provenance and review/release requirements |
| `example-graph.json` | Small linked draft graph with declared versus verified identity |
| `plant-review-register.json` | Twelve candidate profile review packets; zero claimed approvals |
| `validate-package.py` | Dependency-free structural, calculation and scoring checks |
| `validation-results.json` | Results of the automated package checks |
| `VALIDATION.md` | What the checks establish and what remains to review/build/test |

This is an **instructor/developer package**, not a learner distribution. The full specification and answer-key files must remain outside a secure learner assessment build. The transfer examples cannot remain unseen after this package is shared; commission a separate controlled assessment bank for actual research.

## Review status

Prepared 2 November 2026 as an AI-assisted design draft. No human subject-matter reviewer or instructor is represented as having approved it. Authoring fixtures are synthetic or mathematical, not measured botanical/clinical data. Authenticated specimen packs, micrographs, approved assay references, twelve profile sign-offs, gameplay implementation and actual student learning validation remain roadmap work.

To reproduce the package checks with Python 3:

```sh
python validate-package.py
```

The checker validates the schema keywords used here and explicit domain/calculation invariants; it is not a general JSON Schema standards-conformance implementation or a scientific review.
