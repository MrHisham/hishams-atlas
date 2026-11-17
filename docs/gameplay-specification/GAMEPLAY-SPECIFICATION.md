# PHY TOLAB — First Research Assignment
## Developer and scientific-review specification, v0.1.0

Prepared 2 November 2026. This is a concrete design blueprint for the first fifteen quests, not a claim that the institute, reviewed reference assets, twelve approved plant profiles or educational validation have already been completed. It builds on the existing Atlas catalogue without replacing its 150 introductory records or saved progress.

**Playable scope:** three departments; three reusable simulation engines; fifteen quests; one integrated capstone; one competency dashboard. Guided safety and evidence prompts appear inside the three departments. The full Pharmacology, Toxicology, Evidence, Pharmaceutical Technology and Biotechnology/Research departments remain future map destinations, not mastery rewards earned by a few guided questions.

**Time budget:** 200 minutes of first-attempt quest play (including a 35-minute capstone), plus onboarding, breaks and remediation; approximately 3–4 hours for a first pass. These are planning targets to test, not measured completion times.

## 1. The player loop and institute

Arrival → inspect accession and task → choose a question → collect or request evidence → check evidence validity → compare with a reference → state a bounded conclusion → submit a structured report → receive criterion-specific feedback → attempt a new problem when ready.

The three department rooms connect through an inviting botanical institute atrium. Each offers an instrument/workbench hotspot, specimen/reference drawer and report desk. The player can use a map or keyboard-accessible list to reach the same functions; navigating or manipulating a camera is never required to demonstrate scientific competence. A “return to evidence” action preserves unfinished work. Only safety-critical decisions interrupt submission; incorrect hypotheses lead to targeted evidence requests and retries, not game-over.

Visual direction: warm botanical research architecture, paper-like accession records, clearly labeled instrument views and restrained modern analytical panels. Plants need authenticated, licensed specimen assets for diagnostic use. Decorative Atlas motifs remain labeled symbolic. Do not use potion effects, healing animations or vivid compound colors to imply therapeutic benefit or chemical identification. Text, tables, keyboard controls and scale/reference descriptions provide alternatives to visual manipulation; color is never the only signal.

## 2. Three reusable engines, five learning mechanics

| Engine | MVP responsibilities | Mechanics supported |
|---|---|---|
| Specimen workbench | accession inspection, feature observation, key traversal, reference comparison, microscopy-view quality, uncertainty log | A Botanical Detective |
| Analytical workbench | dataset/control selection, TLC/HPLC tables and traces, simple calculations, anonymous structure cues and mathematical curves | B Analytical Laboratory; limited C Molecular Investigator adapter |
| Research dossier and report | evidence graph, chronology, source scope, study tables, competing hypotheses, next-test planning, structured report and feedback | guided D Safety Investigator and E Evidence Analyst |

The molecular curve adapter is an abstract model in Q12, not a fourth engine or a full pharmacology department. Engines render versioned content and never embed plant-specific factual answers in UI code. No wet-lab protocol, solvent recipe, extraction sequence, plant dosing or poisonous-material collection is part of the simulation.

## 3. Content/source policy and scientific release gates

Each claim is an independently versioned record with source, publication locator, evidence type, taxon/material/preparation scope, verification state, reviewer and dates. A plant-source link is not verification of every statement in its profile. Taxonomy sources support names; analytical references support method principles; experimental papers support the particular assay; clinical studies support the studied intervention/population/outcome. Traditional use, experimental mechanism and demonstrated clinical outcomes receive distinct labels.

Sources located for this blueprint include [WHO quality-control methods](https://www.who.int/publications-detail-redirect/9789241500739), [ICH Q2(R2) through EMA](https://www.ema.europa.eu/en/scientific-guidelines/ich-q2r2-validation-analytical-procedures), the separate EMA assessments of [peppermint leaf](https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-folium) and [peppermint oil](https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-aetheroleum), [NCCIH St. John’s wort](https://www.nccih.nih.gov/health/st-johns-wort), and [TGA’s historical interaction communication](https://www.tga.gov.au/safety/safety-monitoring-and-information/safety-alerts/st-johns-wort-information-sheet-health-care-professionals). The historical TGA document is not a current standalone clinical management protocol. Exact editions, sections and applicable indications must be recorded by the reviewer before learner release.

Data classes are explicit: (1) measured/reference data, with original method, provenance, permissions and verification; (2) curator-authored synthetic teaching fixtures, with rationale and reproducible rules; (3) mathematical model outputs, with equations and assumptions. This package currently contains classes 2 and 3 only. Nothing is presented as an authenticated botanical fingerprint or measured clinical trial. WHO/ICH do not supply or endorse the fictional acceptance limits used here.

“Curated” means a content author selects and documents a comparison for a specified reasoning objective; it does not mean random signals are scientifically valid. Q11 uses a fixed signal vector and Q12 a declared mathematical function. Neither predicts a named constituent’s chemistry or a patient response. Plant-specific analytical identities, microscopy, therapeutic mechanisms and release limits may be bound only after appropriately scoped reference evidence and SME approval. A content manifest rejects missing method/control metadata, unsupported taxon bindings and mismatched preparation claims.

### Twelve-profile review packet

Candidates: chamomile, peppermint, ginger, turmeric, senna, psyllium, fennel, rosemary, lavender, green tea, St. John’s wort and milk thistle. `plant-review-register.json` carries their existing Atlas introductions as review inputs; **approved count is zero**. For each, botanical and pharmacy reviewers must approve taxon/part/preparation scope, authentication evidence, diagnostic characters/assets, constituent labels, evidence/safety limits, applicable restrictions and provenance. No quantity of source links substitutes for sign-off. These twelve are a carefully reviewed subset to commission, not a deletion of the other 138 catalogue records.

Required learner-release gate: all twelve profile packets signed off; every used claim and dataset approved for its stated scope; authenticated/permissioned diagnostic assets with scale and reference keys; no unresolved safety-critical review issue; accessibility/user-flow checks; expert grading agreement on representative answers. Abstract feature-code prototypes may be demonstrated to developers, but cannot be advertised as teaching real species identification. A researcher can reject a dataset or limit rather than guessing an apparently plausible chemical behavior.

## 4. Knowledge graph and versioned interfaces

Use normalized entities with stable IDs and foreign-key validation:

| Entity | Required scientific fields |
|---|---|
| Plant | taxon authority/ID, accepted name, synonyms, family, name-review status |
| Specimen | accession, declared/verified plant IDs, part, origin, custody events, authentication status, asset IDs |
| PlantMaterial | plant ID, part, source lot, processing description, provenance |
| Preparation | material ID, preparation type, composition/specification version, exposure/route scope when applicable |
| Constituent | molecule authority/ID, class, source-supported structure asset, identity verification |
| Target / Bioactivity | target ID, constituent/preparation ID, assay/context/conditions, endpoints, uncertainty; no implicit clinical edge |
| SafetyRecord | hazard, evidence type, exposure/product scope, interaction/contraindication claim IDs, jurisdiction/date if regulatory |
| ClinicalEvidence | design, population, exact intervention/comparator, outcomes/time, effect estimate/uncertainty, bias/limitations |
| AnalyticalDataset | origin class, instrument/method version, reference/sample/control IDs, units/basis, acceptance-rule origin, data/hash, validation/review |
| Claim / Source / Asset | statement/scope, citation locator, evidence type, permissions, version, review history, withdrawal reason |
| LearningObjective | competency, observable performance, prerequisites, rubric, transfer requirements |
| Quest | scenario, engine config, referenced entities/datasets, allowed actions, rubric version, dependencies, narrative reward |
| Attempt / Report | quest/content/rubric versions, evidence used, submitted conclusions, hint use, scores, grader and critical flags |

Typical edges: Plant → Material → Preparation → Evidence; Specimen → Authentication claim → Source; Dataset → Method + Controls + Samples; Quest → Objectives + Datasets; Attempt → Submitted report + Evidence IDs. A “same plant” edge never substitutes for preparation equivalence. An “observed association” edge never becomes a causal claim without a reviewed justification.

Keep scientific content, simulation and game progression separate. Content publishes immutable reviewed versions; simulations accept dataset/model contracts and return observations; the game consumes scored attempts and controls narrative access. An attempt pins its source/dataset/rubric versions so a later correction does not silently rewrite historical answers. Withdrawn safety-critical content is removed from new attempts; affected competencies are marked for review rather than silently retained as certified mastery. The existing Atlas database needs an additive namespaced institute state (e.g. `institute.v1`), migration tests and backup coverage when this module is implemented.

Workbench contract: `load(questVersion, datasetVersion)` → `observe(feature|control)` → `record(evidenceId, interpretation)` → `submit(report)` → `evaluate(rubricVersion)`. The evaluator returns criterion scores, evidence-linked feedback, missing requirements, critical flags and allowed remediation. It must accept multiple justified explanations; it must not require an exact sentence or let a language model independently decide safety mastery.

## 5. Reports, scoring and progression

Standard report fields: question; specimen/material/preparation identity and uncertainty; valid observations with evidence IDs; controls/method comparability; calculation with units; inference and confidence rationale; alternative explanations; discriminating next test; source/preparation scope; safety/referral limitation. The learner may respond through structured controls and an accessible short written explanation. Instructor scoring resolves nuanced cases; prototype automation may score only deterministic choices/calculations and rubric completeness, not claim to understand arbitrary prose.

Q01–Q14 have five quest-specific checks, each 0=missing/incorrect, 1=partly justified or materially incomplete, 2=correct and supported by evidence. Pass at least 8/10, with all named critical gates satisfied. Numeric tolerances below are teaching tolerances, not assay acceptance limits. A feedback-assisted pass records completion/practice only. Independent competency evidence requires an unhinted assessment form with all critical gates passed. A score increase from repeating the same item is not transfer evidence.

Q15 uses a separate six-dimension 0–2 rubric (12 maximum): traceability; controls/comparability/calculation; distinction of findings/missingness; competing explanations; next-test discrimination; qualified report/source/safety scope. Pass at least 10/12, no dimension zero and all critical gates satisfied. Implementation must select its six-dimension capstone evaluator rather than applying the generic 10-point evaluator.

Competency demonstration additionally requires two distinct unhinted, reviewer-approved transfer problems for that competency, each at least 8/10 with its critical gates passed. At least one must change the reasoning structure, not merely the display values. These in-game transfer-gate problems use a separate bank from the external educational-validation assessments. The included TF examples illustrate authoring requirements and do not fulfill either bank's secure-unseen requirement after this document is shared.

Department access: Q01–Q05 practice sequence opens Pharmacognosy after the relevant botanical/traceability transfer check; Q06–Q10 opens Phytochemistry after a QC-control and material-scope transfer check. Q13 and Q14 branch after their listed prerequisites. Q15 requires Q12, Q13 and Q14 plus no unresolved safety-critical remediation. XP/cosmetic rewards never bypass these gates. The map shows future departments but only the first three are playable.

The dashboard distinguishes “not assessed,” “practiced,” “independent evidence pending,” “demonstrated in this slice” and “review required.” Display competency evidence counts, latest rubric/version, assistance and uncertainty; do not invent percent mastery from time-on-task or assign professional credentials. Stages 1–3 are slice-specific progression labels after their assessed milestones. Stages 4–6 remain future curricula. Safety/evidence guided prompts alone do not confer full toxicology or clinical competency.

Safety remediation: a dangerous interaction/referral miss immediately withholds that safety criterion, explains the missed cue and routes to a different scenario before re-assessment. Noncritical errors reopen the relevant control, reference or calculation with a question prompt. Preserve first-attempt answers and hint history; reward revising a conclusion when new evidence warrants it. Uncertainty that accurately reflects missing evidence earns credit.

## 6. Quest map


| ID | Department | Quest | Minutes | Prerequisites |
|---|---|---|---:|---|
| Q01 | Botanical Identification | An accession is not an identification | 8 | None |
| Q02 | Botanical Identification | Follow the key, then stop at its boundary | 10 | Q01 |
| Q03 | Botanical Identification | Root or underground stem? | 10 | Q02 |
| Q04 | Botanical Identification | A justified unresolved identification | 10 | Q03 |
| Q05 | Botanical Identification | Build a defensible herbarium record | 12 | Q04 |
| Q06 | Pharmacognosy | Microscopy needs a reference and a valid view | 12 | Q05 |
| Q07 | Pharmacognosy | A quality percentage, not a universal limit | 12 | Q06 |
| Q08 | Pharmacognosy | Failed control, invalid conclusion | 10 | Q07 |
| Q09 | Pharmacognosy | The TLC blank changes the conclusion | 12 | Q08 |
| Q10 | Pharmacognosy | One plant name, different materials | 12 | Q09 |
| Q11 | Phytochemistry | Chromatogram investigator: the missing signal | 15 | Q10 |
| Q12 | Phytochemistry | Structure, potency and the clinical inference gap | 15 | Q11 |
| Q13 | Phytochemistry | A safety signal is not a proven cause | 12 | Q10 |
| Q14 | Phytochemistry | Evidence belongs to a preparation and an outcome | 15 | Q11 |
| Q15 | Phytochemistry | The Mystery of the Herbal Capsules | 35 | Q12, Q13, Q14 |

## 7. Complete quest cards

All numeric/feature datasets below are the fully specified synthetic design fixtures. Plant context tags connect the narrative to Atlas; they do not bind anonymous feature codes or chemical signals to real species. Real diagnostic teaching assets remain a separate release gate.

### Q01 — An accession is not an identification

**Department / engine:** Botanical Identification / `specimen-workbench`. **Time:** 8 minutes. **Prerequisites:** none. **Atlas plant contexts:** peppermint, chamomile.

**Observable learning objectives:** MAT-TRACE, BOT-OBS. Demonstrate each through the actions and rubric below.

The institute receives two sealed virtual accessions. A common name and a supplier assertion have been mistaken for authentication.

**Player interaction**

1. Open accession envelopes and compare label fields.
2. Link the declared taxon and plant part to an accession, retaining the supplier attribution.
3. Submit an authentication-status decision and a two-sentence evidence note.

**Simulated data / exact fixture**

```json
{
  "accessions": [
    {
      "id": "ACC-A",
      "declared_taxon": "Mentha × piperita",
      "declared_part": "leaf",
      "supplier": "S-01",
      "voucher": null,
      "authentication": "supplier assertion only"
    },
    {
      "id": "ACC-B",
      "declared_taxon": "Matricaria chamomilla",
      "declared_part": null,
      "supplier": "S-02",
      "voucher": "V-B",
      "authentication": "voucher reference supplied, not yet checked"
    }
  ]
}
```

**Correct reasoning and acceptable conclusion**

- Both taxa are declarations, not independently confirmed identifications.
- ACC-A lacks checked voucher evidence; ACC-B additionally lacks the declared material part. Preserve both missingness and attribution.

**Error-specific feedback**

- `confirmed_from_label`: A label is a claim. Ask which evidence actually verifies it.
- `invented_part`: Missing metadata must remain unknown rather than being filled from familiarity.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Records both declared taxa correctly.
2. Flags the missing ACC-B part.
3. Separates a voucher reference from checked authentication.
4. Keeps supplier and accession provenance.
5. Avoids assigning confirmed identity.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q01",
  "data": {
    "accession": "ACC-X",
    "declared_taxon": "Lavandula angustifolia",
    "declared_part": "flower",
    "supplier": "S-09",
    "voucher": null
  },
  "required_conclusion": "Identity remains unconfirmed despite complete name/part fields."
}
```

**Provenance / release:** `DS-Q01@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q02 — Follow the key, then stop at its boundary

**Department / engine:** Botanical Identification / `specimen-workbench`. **Time:** 10 minutes. **Prerequisites:** Q01. **Atlas plant contexts:** peppermint, rosemary.

**Observable learning objectives:** BOT-ID, BOT-OBS. Demonstrate each through the actions and rubric below.

A training key links observable features to anonymous reference cards. It is not a diagnostic key for peppermint or rosemary.

**Player interaction**

1. Reveal one feature card at a time.
2. Trace each choice through the key and attach supporting observations.
3. Choose a reference-card match and state the limit of that match.

**Simulated data / exact fixture**

```json
{
  "training_only": true,
  "observations": {
    "arrangement": "opposite",
    "margin": "toothed",
    "venation": "unresolved"
  },
  "key": [
    {
      "if": "arrangement=alternate",
      "then": "REF-C"
    },
    {
      "if": "arrangement=opposite AND margin=entire",
      "then": "REF-B"
    },
    {
      "if": "arrangement=opposite AND margin=toothed",
      "then": "REF-A"
    }
  ],
  "taxon_bindings": null,
  "asset_status": "Real species-bound image/key pack requires authenticated sources, licensing and botanist approval before release."
}
```

**Correct reasoning and acceptable conclusion**

- The supplied training observations route to REF-A.
- This establishes consistency with an anonymous card only; it does not identify either named plant or authenticate real material. Unobserved venation stays unresolved.

**Error-specific feedback**

- `species_guess`: A familiar name is not evidence. These training cards have no taxon binding.
- `invented_feature`: An unavailable feature cannot be treated as observed.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Selects the opposite-arrangement branch.
2. Selects the toothed-margin branch.
3. Returns REF-A.
4. Leaves venation unresolved.
5. States that a reference-card match is not real-world identification.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q02",
  "data": {
    "observations": {
      "arrangement": "opposite",
      "margin": "entire",
      "venation": "unresolved"
    },
    "key_version": "same rules, shuffled display"
  },
  "required_conclusion": "REF-B, with no taxonomic identification claim."
}
```

**Provenance / release:** `DS-Q02@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q03 — Root or underground stem?

**Department / engine:** Botanical Identification / `specimen-workbench`. **Time:** 10 minutes. **Prerequisites:** Q02. **Atlas plant contexts:** ginger, turmeric.

**Observable learning objectives:** BOT-OBS, MAT-TRACE. Demonstrate each through the actions and rubric below.

The virtual material sheet says “root,” but a supplied structural-description card records nodes, internodes and a bud.

**Player interaction**

1. Separate the supplier term from the structural observations.
2. Annotate the node, internode and bud descriptions on a schematic.
3. Classify the organ type and open a metadata discrepancy.

**Simulated data / exact fixture**

```json
{
  "supplier_term": "root",
  "observed_description": [
    "nodes",
    "internodes",
    "bud"
  ],
  "image_origin": "abstract schematic, not a diagnostic ginger or turmeric image",
  "organ_options": [
    "root",
    "rhizome / underground stem",
    "seed",
    "leaf"
  ]
}
```

**Correct reasoning and acceptable conclusion**

- Nodes, internodes and buds support classifying the described organ as an underground stem/rhizome.
- Correcting an organ label does not establish the species or the chemical/clinical equivalence of its products.

**Error-specific feedback**

- `all_underground_are_roots`: Location alone is not the classification criterion; use structural evidence.
- `species_from_organ`: Many taxa share this organ type.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Identifies all three structural observations.
2. Selects rhizome / underground stem.
3. Records a discrepancy without overwriting supplier history.
4. Keeps species authentication unresolved.
5. Separates organ classification from therapeutic conclusions.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q03",
  "data": {
    "label": "underground organ",
    "features": [
      "no nodes reported",
      "image incomplete",
      "no bud observation"
    ]
  },
  "required_conclusion": "Insufficient evidence; do not force a root/rhizome identification from absence of a report."
}
```

**Provenance / release:** `DS-Q03@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q04 — A justified unresolved identification

**Department / engine:** Botanical Identification / `specimen-workbench`. **Time:** 10 minutes. **Prerequisites:** Q03. **Atlas plant contexts:** fennel, chamomile.

**Observable learning objectives:** BOT-ID, DATA-INFER. Demonstrate each through the actions and rubric below.

Two anonymous reference materials share the visible features. The distinguishing fruit view is unavailable.

**Player interaction**

1. Build a feature-by-reference comparison.
2. Mark missing evidence rather than guessing.
3. Select the next observation most likely to distinguish the candidates.

**Simulated data / exact fixture**

```json
{
  "observed": {
    "F1": "present",
    "F2": "present",
    "fruit_character": "unavailable"
  },
  "references": {
    "REF-D": {
      "F1": "present",
      "F2": "present",
      "fruit_character": "pattern-D"
    },
    "REF-E": {
      "F1": "present",
      "F2": "present",
      "fruit_character": "pattern-E"
    }
  },
  "taxon_bindings": null,
  "next_options": [
    "obtain an authenticated diagnostic fruit view",
    "repeat a shared F1 observation",
    "infer identity from color of the app motif"
  ]
}
```

**Correct reasoning and acceptable conclusion**

- Both references remain compatible with the observations.
- An authenticated discriminating fruit observation is more informative than repeating a shared feature. No actual fennel/chamomile diagnostic pattern is asserted.

**Error-specific feedback**

- `forced_answer`: An unresolved conclusion is correct when the evidence does not distinguish the candidates.
- `more_shared_data`: Repeating a shared feature does not resolve this particular ambiguity.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Retains both compatible candidates.
2. Names the unresolved discriminator.
3. Requests an authenticated fruit view.
4. Avoids an app-motif identification.
5. States the current uncertainty in the report.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q04",
  "data": {
    "shared_features": [
      "F1"
    ],
    "missing_discriminator": "leaf surface character",
    "candidate_ids": [
      "REF-U",
      "REF-V"
    ]
  },
  "required_conclusion": "Retain both; seek the missing discriminating leaf-surface evidence."
}
```

**Provenance / release:** `DS-Q04@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q05 — Build a defensible herbarium record

**Department / engine:** Botanical Identification / `research-dossier`. **Time:** 12 minutes. **Prerequisites:** Q04. **Atlas plant contexts:** lavender, rosemary.

**Observable learning objectives:** MAT-TRACE, REPORT. Demonstrate each through the actions and rubric below.

A digital herbarium submission merges observations from two accessions and omits the source of an image.

**Player interaction**

1. Attach each observation to its accession.
2. Keep a missing image-license field explicit.
3. Submit an accession-specific record with separate declared and verified identity fields.

**Simulated data / exact fixture**

```json
{
  "accessions": [
    "ACC-L",
    "ACC-R"
  ],
  "events": [
    {
      "accession": "ACC-L",
      "event": "supplier label received",
      "time": "T1"
    },
    {
      "accession": "ACC-R",
      "event": "reference image viewed",
      "time": "T2",
      "asset_source": null
    }
  ],
  "bad_record": {
    "accession": "ACC-L",
    "claims": [
      "supplier label received",
      "reference image viewed"
    ],
    "identity_status": "confirmed"
  }
}
```

**Correct reasoning and acceptable conclusion**

- The ACC-R image event cannot be used as an ACC-L observation.
- Both records require honest identity status; an unlicensed or unprovenanced image is not release-ready evidence. Preserve an audit trail for the corrected record.

**Error-specific feedback**

- `merged_records`: An observation is evidence only for the accession it actually concerns.
- `missing_license_is_approval`: A missing permission field does not establish permission to distribute the image.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Separates accession histories.
2. Corrects the erroneous ACC-L image attribution.
3. Flags missing asset provenance/license.
4. Preserves declared versus verified status.
5. Includes a reproducible audit note.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q05",
  "data": {
    "record_accession": "ACC-P",
    "event_accession": "ACC-Q",
    "image_license": "known",
    "identity_status": "supplier declared"
  },
  "required_conclusion": "Reject cross-accession evidence even though licensing is known."
}
```

**Provenance / release:** `DS-Q05@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q06 — Microscopy needs a reference and a valid view

**Department / engine:** Pharmacognosy / `specimen-workbench`. **Time:** 12 minutes. **Prerequisites:** Q05. **Atlas plant contexts:** chamomile, peppermint.

**Observable learning objectives:** QC-CONTROL, BOT-ID. Demonstrate each through the actions and rubric below.

A microscope viewer offers symbolic feature overlays. The first view is blurred; an authenticated reference image has not yet been licensed.

**Player interaction**

1. Assess image interpretability before comparing features.
2. Request the readable synthetic training view.
3. Compare coded features with anonymous reference patterns and qualify the result.

**Simulated data / exact fixture**

```json
{
  "first_view": {
    "focus_control": "fail",
    "features": "unreadable"
  },
  "second_training_view": {
    "focus_control": "pass",
    "features": [
      "MIC-A",
      "MIC-B"
    ]
  },
  "reference_patterns": {
    "REF-M": [
      "MIC-A",
      "MIC-B"
    ],
    "REF-N": [
      "MIC-A",
      "MIC-C"
    ]
  },
  "taxon_bindings": null,
  "asset_status": "Species-specific micrographs, scale bars, diagnostic descriptions and permissions are mandatory SME-gated assets."
}
```

**Correct reasoning and acceptable conclusion**

- The failed-focus view cannot support comparison. The second view is consistent with REF-M in this symbolic exercise.
- No real microscopic character or species diagnosis has been validated by these feature codes.

**Error-specific feedback**

- `blurred_diagnostic`: A low-quality view is a limitation, not a negative finding.
- `one_feature_proves_taxon`: An anonymous pattern match is narrower than botanical authentication.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Rejects the blurred view.
2. Requests an interpretable view.
3. Matches both coded features to REF-M.
4. Does not promote coded features to species diagnostics.
5. Documents the missing real reference-asset gate.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q06",
  "data": {
    "focus_control": "pass",
    "sample": [
      "MIC-A"
    ],
    "reference_M": [
      "MIC-A",
      "MIC-B"
    ],
    "reference_N": [
      "MIC-A",
      "MIC-C"
    ]
  },
  "required_conclusion": "Both references remain possible; request the missing discriminating observation."
}
```

**Provenance / release:** `DS-Q06@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q07 — A quality percentage, not a universal limit

**Department / engine:** Pharmacognosy / `analytical-workbench`. **Time:** 12 minutes. **Prerequisites:** Q06. **Atlas plant contexts:** chamomile, senna.

**Observable learning objectives:** QC-QUANT, DATA-INFER. Demonstrate each through the actions and rubric below.

A fictional quality worksheet reports total material and foreign-material masses. A scenario-only limit is supplied.

**Player interaction**

1. Check numerator and denominator units.
2. Calculate the percentage and compare it with the supplied teaching limit.
3. Write a sample-specific concern without asserting a pharmacopoeial specification.

**Simulated data / exact fixture**

```json
{
  "total_mass_g": 10.0,
  "foreign_material_mass_g": 0.4,
  "scenario_limit_percent": 2.0,
  "formula": "100 * foreign_material_mass / total_mass",
  "limit_origin": "fictional teaching specification; not a pharmacopoeial limit",
  "sampling": "one virtual subsample; representativeness unresolved"
}
```

**Correct reasoning and acceptable conclusion**

- The calculated foreign-material fraction is 4.0%, above the fictional 2.0% limit.
- This supports a concern for this subsample under this scenario; representative sampling and actual product specifications are still required.

**Error-specific feedback**

- `wrong_denominator`: The denominator is total examined material, not foreign material.
- `real_world_limit`: The supplied limit is authored for this exercise, not a clinical or pharmacopoeial rule.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Uses consistent units.
2. Calculates 4.0% within 0.05 percentage point.
3. Compares with 2.0%, not an invented real limit.
4. Limits the decision to this subsample/scenario.
5. Requests representative sampling and the applicable specification.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q07",
  "data": {
    "total_mass_g": 20.0,
    "foreign_material_mass_g": 0.2,
    "scenario_limit_percent": 2.0
  },
  "required_conclusion": "1.0%, within the fictional limit; this still does not certify the whole batch."
}
```

**Provenance / release:** `DS-Q07@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO. No experimental or clinical measurement is claimed.

### Q08 — Failed control, invalid conclusion

**Department / engine:** Pharmacognosy / `analytical-workbench`. **Time:** 10 minutes. **Prerequisites:** Q07. **Atlas plant contexts:** milkthistle, greentea.

**Observable learning objectives:** QC-CONTROL, DATA-INFER. Demonstrate each through the actions and rubric below.

An attractive instrument result is available, but the check-standard result lies outside the fictional run-acceptance range.

**Player interaction**

1. Inspect control results before opening the batch verdict.
2. Compare the control against the declared scenario range.
3. Invalidate the run for the intended inference and request investigation/retest.

**Simulated data / exact fixture**

```json
{
  "check_standard_expected_units": 100,
  "check_standard_observed_units": 70,
  "scenario_acceptance_units": [
    95,
    105
  ],
  "sample_reported_units": 88,
  "acceptance_origin": "fictional run rule; not a validated assay criterion",
  "instrument_method_id": "TRAIN-M1"
}
```

**Correct reasoning and acceptable conclusion**

- The control value of 70 is outside 95–105, so the run does not support the intended batch interpretation.
- An invalid run is not evidence that the batch itself fails quality. Investigate the analytical system and repeat using an accepted method/run.

**Error-specific feedback**

- `batch_failure_from_run_failure`: A failed control undermines the measurement; it does not identify the batch as defective.
- `ignore_control`: A sample number is not interpretable merely because the instrument displays it.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Checks the control before the sample.
2. Recognizes the out-of-range control.
3. Withholds a batch pass/fail claim.
4. Distinguishes run validity from product quality.
5. Requests a documented investigation and valid repeat.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q08",
  "data": {
    "control": 101,
    "scenario_range": [
      95,
      105
    ],
    "sample": 88,
    "product_specification": null
  },
  "required_conclusion": "The control passes, but no batch verdict is possible without the applicable product specification."
}
```

**Provenance / release:** `DS-Q08@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-ICH. No experimental or clinical measurement is claimed.

### Q09 — The TLC blank changes the conclusion

**Department / engine:** Pharmacognosy / `analytical-workbench`. **Time:** 12 minutes. **Prerequisites:** Q08. **Atlas plant contexts:** turmeric, ginger.

**Observable learning objectives:** QC-QUANT, QC-CONTROL. Demonstrate each through the actions and rubric below.

A synthetic TLC viewer displays a sample spot and a nearby reference spot, but the blank also contains a signal.

**Player interaction**

1. Read distances from the same baseline.
2. Calculate Rf values.
3. Inspect the blank and explain why a match cannot establish identity.

**Simulated data / exact fixture**

```json
{
  "solvent_front_distance_units": 8.0,
  "spot_distances": {
    "reference": 2.4,
    "sample": 2.48,
    "blank": 2.4
  },
  "Rf_formula": "spot distance / solvent-front distance",
  "scenario_Rf_comparison_tolerance": 0.03,
  "run_rule": "blank must have no signal in the comparison region",
  "compound_assignment": null,
  "origin": "synthetic distances; no real botanical chromatogram or solvent procedure"
}
```

**Correct reasoning and acceptable conclusion**

- Reference Rf=0.300, sample=0.310 and blank=0.300. The apparent sample/reference proximity is within the fictional tolerance.
- The blank signal violates the run rule. Investigate carryover/contamination as possibilities, repeat a valid run and do not identify a compound or adulterant.

**Error-specific feedback**

- `Rf_identity`: Similar Rf is not unique molecular identification, especially in a run with a blank failure.
- `cause_certainty`: The blank raises a problem; it does not prove which contamination pathway occurred.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Calculates reference 0.300 within 0.005.
2. Calculates sample 0.310 within 0.005.
3. Recognizes the blank failure.
4. Withholds identity despite apparent Rf proximity.
5. Lists carryover/contamination as hypotheses, not proven causes.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q09",
  "data": {
    "front": 10,
    "reference_spot": 4,
    "sample_spot": 4.1,
    "blank_signal": false,
    "scenario_tolerance": 0.03
  },
  "required_conclusion": "Rf 0.400 vs 0.410 is consistent under the fictional rule; not sufficient for unique species/compound identity."
}
```

**Provenance / release:** `DS-Q09@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO, SRC-ICH. No experimental or clinical measurement is claimed.

### Q10 — One plant name, different materials

**Department / engine:** Pharmacognosy / `research-dossier`. **Time:** 12 minutes. **Prerequisites:** Q09. **Atlas plant contexts:** psyllium, peppermint.

**Observable learning objectives:** MAT-TRACE, EVID-SCOPE. Demonstrate each through the actions and rubric below.

A product claim cites a source for a different plant material or preparation.

**Player interaction**

1. Link each evidence record to its exact taxon, part and preparation.
2. Mark unsupported transfers.
3. Request a matching preparation-specific source.

**Simulated data / exact fixture**

```json
{
  "pairs": [
    {
      "product": "P-LEAF",
      "taxon": "Mentha × piperita",
      "material": "leaf",
      "cited_record": "E-OIL",
      "record_material": "essential oil"
    },
    {
      "product": "P-HUSK",
      "taxon": "Plantago ovata",
      "material": "seed husk",
      "cited_record": "E-SEED",
      "record_material": "whole seed"
    }
  ],
  "clinical_outcomes": "not supplied; no efficacy conclusion requested"
}
```

**Correct reasoning and acceptable conclusion**

- The leaf/oil and husk/whole-seed mismatches block automatic transfer of conclusions.
- Neither shared taxon nor a constituent label establishes equivalent exposure, evidence or safety. Locate the correct monograph/product record before appraising a claim.

**Error-specific feedback**

- `same_taxon_same_evidence`: The exact plant part and preparation are part of the intervention identity.
- `reject_all_research`: A mismatch limits applicability; it does not erase what the original source found for its own preparation.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Identifies the leaf/oil mismatch.
2. Identifies the husk/whole-seed mismatch.
3. Links each record to the preparation it actually covers.
4. Avoids any efficacy/safety inference from the shared name.
5. Specifies the missing matching-source requirement.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q10",
  "data": {
    "product_material": "aqueous leaf preparation",
    "study_material": "standardized concentrated extract",
    "same_taxon": true
  },
  "required_conclusion": "Applicability unresolved; check extraction, composition, exposure and outcome rather than transferring the claim."
}
```

**Provenance / release:** `DS-Q10@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-LEAF, SRC-OIL, SRC-WHO. No experimental or clinical measurement is claimed.

### Q11 — Chromatogram investigator: the missing signal

**Department / engine:** Phytochemistry / `analytical-workbench`. **Time:** 15 minutes. **Prerequisites:** Q10. **Atlas plant contexts:** greentea, milkthistle.

**Observable learning objectives:** QC-QUANT, DATA-INFER. Demonstrate each through the actions and rubric below.

Two fictional comparable profiles have passed the specified run controls. Determine the largest signal discrepancy and its limited meaning.

**Player interaction**

1. Verify matching method IDs, normalization and valid controls.
2. Compare each coded peak in a table and trace.
3. Select the largest difference and propose at least two non-fraud explanations plus follow-up testing.

**Simulated data / exact fixture**

```json
{
  "peak_ids": [
    "A",
    "B",
    "C",
    "D"
  ],
  "reference_normalized_signals": [
    100,
    80,
    120,
    60
  ],
  "sample_normalized_signals": [
    98,
    78,
    36,
    59
  ],
  "method_ids": [
    "TRAIN-H1",
    "TRAIN-H1"
  ],
  "normalization": "same internal-reference scaling and dry-material basis; stipulated in this fixture",
  "controls": "all scenario controls pass",
  "signal_units": "arbitrary normalized teaching units",
  "peak_compound_identities": null,
  "model": "fixed vector comparison, not a chemical-composition simulator"
}
```

**Correct reasoning and acceptable conclusion**

- Peak C differs most: 36−120=−84 units, a 70% decrease relative to its reference value.
- The discrepancy warrants investigation but does not independently establish adulteration, identity, a named compound or clinical potency. Sampling, preparation handling, storage and material variability are candidate explanations.

**Error-specific feedback**

- `highest_peak`: The question concerns between-profile discrepancy, not the tallest peak.
- `adulteration_proven`: A lower signal has multiple possible explanations. Distinguish an observation from a cause.
- `compound_from_letter`: A letter labels a signal, not a chemically identified molecule.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Confirms comparable valid runs.
2. Selects peak C.
3. Calculates −70% within 0.5 percentage point.
4. Withholds a causal/adulteration/clinical claim.
5. Proposes at least two alternatives and a discriminating repeat or orthogonal test.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q11",
  "data": {
    "peaks": [
      "W",
      "X",
      "Y",
      "Z"
    ],
    "reference": [
      50,
      100,
      80,
      60
    ],
    "sample": [
      50,
      30,
      82,
      59
    ],
    "controls": "pass",
    "method_match": true
  },
  "required_conclusion": "X is 70% lower; investigate without declaring adulteration. Changed labels/order prevent memorizing Peak C."
}
```

**Provenance / release:** `DS-Q11@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-ICH. No experimental or clinical measurement is claimed.

### Q12 — Structure, potency and the clinical inference gap

**Department / engine:** Phytochemistry / `analytical-workbench`. **Time:** 15 minutes. **Prerequisites:** Q11. **Atlas plant contexts:** peppermint, lavender.

**Observable learning objectives:** CHEM-CLASS, DATA-INFER. Demonstrate each through the actions and rubric below.

A generic functional-group card and two mathematical response curves are available. Neither curve is a measurement of a plant constituent.

**Player interaction**

1. Classify R–OH as an alcohol-group teaching cue.
2. Read the response curves and their common maximum.
3. Compare model EC50 values and state what the experiment cannot establish.

**Simulated data / exact fixture**

```json
{
  "functional_group_card": "R–OH; R is an unspecified organic group",
  "models": {
    "A": {
      "Emax": 100,
      "EC50": 2
    },
    "B": {
      "Emax": 100,
      "EC50": 8
    }
  },
  "formula": "response = Emax*x/(EC50+x)",
  "x_values": [
    0,
    1,
    2,
    4,
    8,
    16
  ],
  "x_units": "dimensionless model input; never a human dose",
  "y_units": "model response units",
  "target": null,
  "compound_identities": null,
  "clinical_studies": null
}
```

**Correct reasoning and acceptable conclusion**

- R–OH is the generic alcohol cue; it is not a verified structure of a particular plant constituent.
- A has a fourfold lower model EC50 than B (2 vs 8) with equal modeled Emax=100. This supports a relative potency statement only within this stipulated model.
- The model establishes neither a biological target, real assay effect, clinical efficacy, safety nor administration guidance.

**Error-specific feedback**

- `potency_equals_better_medicine`: Lower model EC50 is not evidence of a safer or more effective medicine.
- `observed_maximum`: The asymptotic model Emax is 100; finite displayed values need not reach it.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Correctly classifies the generic alcohol cue.
2. Reads EC50 A=2 and B=8.
3. Computes the fourfold EC50 ratio.
4. Recognizes equal modeled Emax.
5. Limits inference to the model and rejects a clinical/dose claim.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q12",
  "data": {
    "group_card": "R–COOH",
    "model_A": {
      "EC50": 6,
      "Emax": 60
    },
    "model_B": {
      "EC50": 3,
      "Emax": 100
    }
  },
  "required_conclusion": "Carboxylic-acid cue; B has lower EC50 and larger modeled maximum, with no clinical conclusion."
}
```

**Provenance / release:** `DS-Q12@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-ICH. No experimental or clinical measurement is claimed.

### Q13 — A safety signal is not a proven cause

**Department / engine:** Phytochemistry / `research-dossier`. **Time:** 12 minutes. **Prerequisites:** Q10. **Atlas plant contexts:** stjohnswort.

**Observable learning objectives:** SAFE-ESC, DATA-INFER. Demonstrate each through the actions and rubric below.

A fictional patient dossier contains prescribed cyclosporin, newly reported St. John’s wort exposure and incomplete event information. A later triage card reports collapse.

**Player interaction**

1. Construct the exposure/event timeline and identify the interaction-review concern using the source card.
2. List missing information and competing explanations.
3. Respond to the collapse card by seeking urgent professional assessment, without offering a treatment or medication-change plan.

**Simulated data / exact fixture**

```json
{
  "timeline": [
    {
      "day": 0,
      "event": "prescribed cyclosporin listed"
    },
    {
      "day": 10,
      "event": "St. John’s wort product reported; preparation uncertain"
    },
    {
      "day": 14,
      "event": "new adverse event reported; no diagnostic workup provided"
    }
  ],
  "confounders": [
    "intercurrent illness",
    "incomplete medicine history"
  ],
  "later_triage_card": "collapse reported in this fictional case",
  "diagnosis": null,
  "product_details": null
}
```

**Correct reasoning and acceptable conclusion**

- The co-exposure raises an important documented interaction concern and warrants qualified review. Temporal association alone does not prove the cause of the event.
- Collapse requires urgent local emergency/professional assessment. Do not wait for a plant ID, advise a home remedy or independently change prescribed medicines. This is a guided safety decision, not a clinical credential.

**Error-specific feedback**

- `timeline_is_proof`: Sequence is relevant evidence, not proof of causation.
- `game_identification_first`: A symptomatic emergency must not wait for a game-based botanical conclusion.
- `change_prescription`: The exercise calls for referral and qualified medicine review, not an unsupervised prescription change.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Flags the St. John’s wort/medicine interaction concern.
2. Distinguishes temporal association from established causality.
3. Identifies at least two missing/confounding items.
4. Chooses urgent professional assessment for collapse.
5. Avoids treatment, dose or independent prescribed-medicine changes.

**Critical gates:** Delaying urgent assessment after collapse.; Recommending a home remedy or independent prescribed-medicine change.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q13",
  "data": {
    "case": "different product and medicine, interaction evidence not supplied",
    "symptom": "severe breathing difficulty",
    "plant_identity": "unknown"
  },
  "required_conclusion": "Urgent professional assessment despite uncertain identity or interaction; do not invent a specific mechanism."
}
```

**Provenance / release:** `DS-Q13@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-SJW, SRC-TGA. No experimental or clinical measurement is claimed.

### Q14 — Evidence belongs to a preparation and an outcome

**Department / engine:** Phytochemistry / `research-dossier`. **Time:** 15 minutes. **Prerequisites:** Q11. **Atlas plant contexts:** peppermint, greentea.

**Observable learning objectives:** EVID-SCOPE, QC-QUANT. Demonstrate each through the actions and rubric below.

Two invented study summaries are being used to market a third, different preparation.

**Player interaction**

1. Compare design, comparator and exact intervention identity.
2. Calculate the randomized trial risk difference in percentage points.
3. Interpret its supplied uncertainty interval and reject an unsupported product transfer.

**Simulated data / exact fixture**

```json
{
  "studies": [
    {
      "id": "E1",
      "design": "uncontrolled before–after",
      "n": 20,
      "pre_score": 20,
      "post_score": 12,
      "preparation": "TRAIN-PREP-A",
      "clinical_identity": "none; synthetic data"
    },
    {
      "id": "E2",
      "design": "randomized blinded parallel comparison",
      "intervention": "TRAIN-PREP-A",
      "control": "placebo",
      "responders_treatment": 30,
      "n_treatment": 100,
      "responders_control": 20,
      "n_control": 100,
      "risk_difference_approx_95CI_percentage_points": [
        -2,
        22
      ],
      "analysis": "fictional intention-to-treat summary; equal 5% follow-up loss stipulated"
    }
  ],
  "marketed_product": "TRAIN-PREP-B, different composition/route details not supplied",
  "endpoint": "fictional binary symptom response; not a real botanical outcome",
  "interval_method": "rounded teaching interval, approximately normal risk-difference interval"
}
```

**Correct reasoning and acceptable conclusion**

- E2 provides a controlled randomized comparison; E1 cannot by itself separate intervention effects from time, expectation or other changes.
- E2 response difference=30%−20%=10 percentage points (RR=1.5 if additionally requested). The supplied interval spans zero: the estimate is imprecise, neither definitive benefit nor demonstrated equivalence.
- Neither invented trial establishes a real clinical claim, and evidence for PREP-A does not automatically apply to PREP-B.

**Error-specific feedback**

- `percent_vs_points`: 30% compared with 20% differs by 10 percentage points, not 10% relative.
- `no_significance_no_effect`: An interval including zero is compatible with multiple effects; it does not prove equivalence.
- `traditional_equals_trial`: A traditional-use assessment and a randomized outcome answer different evidence questions.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Distinguishes the uncontrolled and randomized designs.
2. Calculates 10 percentage points within 0.5 point.
3. Interprets the interval spanning zero without claiming equivalence.
4. Rejects transfer to PREP-B without comparability evidence.
5. Keeps the synthetic study and endpoint separate from real efficacy claims.

**Critical gates:** No additional quest-specific critical error; global no-fabrication/no-unsafe-use submission rules apply.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q14",
  "data": {
    "response_treatment": [
      24,
      100
    ],
    "response_control": [
      20,
      100
    ],
    "risk_difference_CI_pp": [
      -7,
      15
    ],
    "same_preparation_as_market": false
  },
  "required_conclusion": "4 percentage points, uncertainty spans zero, and applicability to the marketed preparation remains unestablished."
}
```

**Provenance / release:** `DS-Q14@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-LEAF, SRC-OIL. No experimental or clinical measurement is claimed.

### Q15 — The Mystery of the Herbal Capsules

**Department / engine:** Phytochemistry / `research-dossier`. **Time:** 35 minutes. **Prerequisites:** Q12, Q13, Q14. **Atlas plant contexts:** peppermint, greentea, milkthistle.

**Observable learning objectives:** MAT-TRACE, QC-CONTROL, DATA-INFER, SAFE-ESC, EVID-SCOPE, REPORT. Demonstrate each through the actions and rubric below.

Two virtual capsule batches carry the same botanical declaration. Evidence is incomplete and one valid analytical profile differs. The learner submits a qualified research report.

**Player interaction**

1. Reconcile batch/accession/specimen/material/preparation records.
2. Inspect authentication and microscopy records, retaining missing evidence.
3. Check analytical comparability and controls; quantify the discrepant signal.
4. Separate observations from hypotheses and choose discriminating follow-up tests.
5. Evaluate a promotional clinical claim for a different preparation.
6. Submit a structured report, cite evidence IDs and defend the uncertainty statement.

**Simulated data / exact fixture**

```json
{
  "declared_label": {
    "taxon": "Mentha × piperita",
    "part": "leaf",
    "preparation": "TRAIN-CAPSULE-P"
  },
  "batches": [
    {
      "id": "LOT-A",
      "accession": "CAP-A",
      "supplier": "S-A",
      "authentication_record": "AR-A checked in the fictional dossier",
      "microscopy_record": "MIC-CAP-A present in dossier"
    },
    {
      "id": "LOT-B",
      "accession": "CAP-B",
      "supplier": "S-B",
      "authentication_record": "supplier assertion only",
      "microscopy_record": null
    }
  ],
  "analysis": {
    "method": "TRAIN-H-CAP",
    "comparable_preparation_and_normalization": true,
    "scenario_controls": "pass",
    "peaks": [
      "A",
      "B",
      "C",
      "D"
    ],
    "reference": [
      100,
      80,
      120,
      60
    ],
    "LOT_A": [
      99,
      81,
      118,
      60
    ],
    "LOT_B": [
      98,
      79,
      36,
      59
    ],
    "compound_identities": null
  },
  "claim": {
    "marketed": "TRAIN-CAPSULE-P",
    "cited_intervention": "TRAIN-OIL-Q",
    "comparability_demonstrated": false
  },
  "blank_and_standard_checks": "pass stipulated in dossier",
  "sampling": "one virtual aliquot per batch; representativeness not established",
  "real_plant_fingerprint": false
}
```

**Correct reasoning and acceptable conclusion**

- LOT-B has incomplete authentication/microscopy evidence and a 70% lower coded C signal in a comparable valid synthetic run. These are separate findings.
- There is a justified quality concern requiring further work; no particular cause, fraud, adulterant, compound identity, clinical inferiority or whole-batch conformity is established.
- Prioritize representative resampling with custody records, authenticated identity/microscopy review and a validated repeat/orthogonal analytical method suited to the question. Investigate storage, supplier documentation and preparation consistency as hypotheses.
- The oil-preparation claim does not establish capsule efficacy or safety. The report must explicitly distinguish confirmed dossier facts, model assumptions, missing evidence and unresolved conclusions.

**Error-specific feedback**

- `fraud_from_fingerprint`: The profile difference raises a question, not a verdict about supplier intent or a named adulterant.
- `missing_is_negative`: A missing microscopy record is not a failed microscopy result.
- `one_sample_certifies_batch`: The dossier does not establish representative sampling.
- `clinical_from_signal`: A coded signal is not evidence of therapeutic potency.

**Mastery checks (0–2 each; Q15 uses the six-dimension capstone rubric)**

1. Accession/material/claim traceability is correct.
2. Run validity, comparability and the −70% C-signal difference are correctly interpreted.
3. Confirmed findings, missing authentication and sampling limitations are distinguished.
4. At least two plausible alternative explanations are kept as hypotheses.
5. Follow-up tests and representative sampling are selected to discriminate hypotheses.
6. The report qualifies its conclusion and addresses source/preparation applicability and safety limits.

**Critical gates:** Recommending use/administration of the unknown product.; Declaring a specific adulterant, clinical benefit or causality without evidence.

**Unseen-form design example (instructor/developer only):**

```json
{
  "id": "TF-Q15",
  "data": {
    "taxon_context": "different reviewed material at release",
    "LOT_A_controls": "pass",
    "LOT_B_controls": "fail",
    "microscopy": "both dossier records present",
    "profile_difference": "large",
    "clinical_preparation_match": false
  },
  "required_conclusion": "Invalidate the LOT-B run before inferring a batch difference; investigate/retest. Do not merely repeat the taught low-C explanation."
}
```

**Provenance / release:** `DS-Q15@0.1.0`; curator-designed synthetic fixture, specialist approval pending. Source scopes: SRC-WHO, SRC-ICH, SRC-LEAF, SRC-OIL. No experimental or clinical measurement is claimed.

## 8. Transfer assessment and educational validation

The included transfer variants are **authoring examples**, not secure unseen items once shared. They demonstrate the intended changes in task structure and reasoning. An instructor must commission an independently authored, access-restricted assessment bank before an actual validation study. Do not bundle answer keys or held-out problems in the learner build. `prototype-content.json` excludes answers/variants; `instructor-keys.json` and the full specification are instructor/developer material. Local-only game files cannot guarantee exam security; a controlled assessment environment or instructor-held delivery is needed for a validation study.

Each assessment form should contain six new cases mapped to the competency blueprint: (1) ambiguous identification; (2) material/preparation mismatch; (3) controls invalidating an apparent sample difference; (4) a quantitative comparison with different signal order or units; (5) a different safety/referral uncertainty; (6) an integrated report with a different reason for nonconclusion. Each scores five 0–2 dimensions: evidence selection, validity/controls, calculation or disciplined qualitative comparison, bounded inference, and next-action/report reasoning. Total 60. Every form includes a safety-critical gate reported separately; a high total cannot offset an unsafe response. Use genuine novel diagnostic/material cases only after expert review of their reference assets and content.

Near transfer changes specimens, numerical values, figure style, irrelevant cues and answer order; far transfer changes the causal structure (e.g. failed control instead of a true comparable-signal discrepancy) and asks what evidence would resolve the new problem. Do not count a shuffled answer list, a renamed Peak C or practice-set recall alone as transfer. Balance forms by competency, difficulty, reading load, calculation demand and safety requirements; have independent experts judge them before piloting. Log prior exposure, hinting and item/version IDs. Never use an assessment item's answer as game remediation before its outcome is measured.

**Proposed validation sequence (not completed):**

1. Two or more relevant subject reviewers independently check scientific content and rubric examples; reconcile disagreements and record scope-specific sign-offs. The exact reviewer roles depend on the content (botany, pharmacognosy/analytical science, pharmacy/safety).
2. Conduct a small formative usability/think-aloud pilot (planning target 8–12 students with varied experience/access needs). Look for navigation failures, misunderstood uncertainty labels, inaccessible visuals and misleading feedback; this is not an efficacy study.
3. Pilot parallel assessment forms for ambiguity, time burden, floor/ceiling effects and scorer agreement. A provisional 20–30-student feasibility sample can inform variance and recruitment assumptions, not establish effectiveness. Size any subsequent comparative study from the chosen effect/precision, variance, attrition and design assumptions with a statistical reviewer.
4. Pre-specify the evaluation plan. Randomly allocate where feasible to the game versus an active comparison covering the same content and study time; if randomization is impractical, record allocation limitations and avoid causal effectiveness claims. Capture baseline and prior education; use alternate, counterbalanced baseline/post/delayed forms. Suggested delayed interval: 7–14 days, a planning choice to validate.
5. Primary learning outcome: performance on genuinely unseen cases, comparing groups with baseline adjustment and an uncertainty interval, using the pre-specified scoring/analysis plan. Report near and far transfer, delayed retention and safety-critical errors separately. In-game completion and repeated-question scores are secondary process measures.
6. Two assessors, blinded to group where feasible, score a pre-specified subset independently. Report agreement and disagreements before adjudication; preserve original scores. Establish adequate rubric clarity before interpreting improvement. Record missing assessments and reasons, attrition, time exposure, assistive needs and any contamination between groups; do not silently analyze completers only or select favorable outcomes after seeing results.
7. Obtain appropriate institutional/participant permissions and consent for actual student research, collect only necessary pseudonymous data and define access/retention. No students or instructors have been tested or recruited by this specification. Publish actual results, limitations and version numbers; do not infer learning gains from this blueprint or a successful software test.

Provisional mastery thresholds (8/10 and 10/12) are design proposals requiring instructor calibration. They are not validated psychometric cut scores. Predefine acceptance criteria after expert/form pilot work and before a confirmatory study, rather than claiming success from an arbitrary improvement target.

## 9. Development roadmap and acceptance gates

| Phase | Concrete deliverable | Exit evidence |
|---|---|---|
| 1 Scientific foundations | stable graph/schema, claim/source policy, competency blueprint, twelve profile review packets | twelve signed-off profiles, scoped claims/assets/datasets and no unresolved safety-critical issue; current packet has zero approvals |
| 2 Core prototype | atrium/three-department routing, specimen and lab workbenches, evidence notebook, report submission | keyboard and pointer journeys; deterministic dataset evaluation; uncertainty and accessibility behavior; save/backup round trip |
| 3 Vertical slice | all fifteen quests, capstone, feedback, transfer gates, competency dashboard | dependency/rubric tests, expert exemplar scoring, independent critical-gate checks, content/version manifest validation |
| 4 Educational validation | student usability testing, instructor review, unseen-problem assessments | actual participant data and appropriately analyzed outcomes; no claim of efficacy until evidence exists |
| 5 Expansion | Pharmacology, Toxicology, Evidence Center, Pharmaceutical Technology | new reviewed content/assays reuse engines; targeted safety/assessment validation; stages 4–5 not unlocked by MVP shortcuts |
| 6 Advanced expansion | Biotechnology, Metabolomics, Drug Discovery, interdisciplinary research | provenance-rich authentic/reviewed datasets, advanced uncertainty/replication tasks and appropriate unseen transfer assessment |

### Implementation backlog and testable acceptance

- **CONTENT-01:** implement normalized entity/claim schema and referential validation. Reject unsupported real taxon bindings, absent preparation scope, unsigned release assets and unknown version references.
- **ENGINE-01:** specimen selection, evidence visibility and key traversal. Missing/blurred features cannot be evaluated as absent; revisit/refinement never silently erases prior observations.
- **ENGINE-02:** analytical controls-first workflow, trace/table alternatives and reproducible calculation tolerances. Q08 must block a batch verdict; Q09 must reject identity from an invalid blank; Q11 identifies C and Q12 reproduces the declared function.
- **ENGINE-03:** source-scoped dossier/report, hypothesis and follow-up evidence linking. Accept “insufficient evidence” when justified; missing microscopy is never converted to failed microscopy.
- **ASSESS-01:** implement five-check normal and six-dimension capstone rubrics as different evaluator types, no exact-prose matching. Preserve first attempts/hints. A critical miss blocks mastery even at the numeric threshold.
- **PROGRESS-01:** separate completion, assisted practice and independent competency evidence; apply prerequisites and remediation; pin immutable content/rubric versions. Existing Atlas 150-plant progress must survive any additive institute migration/backup.
- **QA-01:** golden datasets, numerical tests, critical-error fixtures, dependency-DAG checks, instructor exemplars, keyboard/screen-reader/table paths, narrow-screen navigation, save/restore and source-withdrawal scenarios.
- **ASSETS-01:** source/licensing/scale/diagnostic-context manifest for every real specimen or micrograph. Do not silently substitute generated or decorative art as authenticated diagnostic evidence.

## 10. Package and handoff

- `GAMEPLAY-SPECIFICATION.md`: full narrative/quest blueprint and instructor reasoning.
- `quest-specification.json`: complete machine-readable authoring content with answers and transfer examples; restricted instructor/developer use.
- `prototype-content.json`: prototype-facing scenarios, datasets and actions; no answer keys or transfer examples. Still requires content review before learner release.
- `instructor-keys.json`: rubric checks, expected reasoning, feedback and illustrative transfer variants. Keep out of learner distributions.
- `plant-review-register.json`: twelve candidate review packets, zero claimed approvals.
- `SCIENTIFIC-CONTENT-SCHEMA.json`: normalized graph/review/model contract.
- `VALIDATION.md`: automated package checks and explicit limits of verification.

This handoff specifies implementation and review work concretely. Authentic specimen packs, licensed micrographs, expert sign-offs, a secure novel assessment bank, institute gameplay implementation and real educational validation remain required deliverables for the corresponding roadmap phases.
