# Essential 100 — Atlas 5.2

The field book contains the supplied priorities 1–100, ten learning modules and 110 practice questions: ten plant questions and one case per module. These are educational priorities, not an efficacy ranking or accreditation standard.

Priorities 1–50, their module membership and all original 55 questions are preserved exactly. Existing IndexedDB saves and version-1 JSON backups remain compatible. No database reset or catalogue migration is required. The original eight cultivation beds and 50 library metadata records are retained.

## Added modules

| Module | Priorities | Title |
|---|---|---|
| 6 | 51–60 | Gastrointestinal & Respiratory Medicinal Plants |
| 7 | 61–70 | Nervous System & Adaptogenic Plant Research |
| 8 | 71–80 | Metabolic, Nutritional & Reproductive Plant Sciences |
| 9 | 81–90 | Dermatology, Inflammation & Botanical Quality |
| 10 | 91–100 | Pharmaceutical Drug Sources & Toxicognosy |

Use the **Collection** filter for Essential 50, Next 50 or all 100, alongside search, module and safety-context filters. Each plant has seven introductory profile sections, notes, literature connections and virtual recognition records. Module cards show saved profile visits and practice answers.

The five new cases cover preparation-specific EMA evidence, kava liver safety, nettle plant-part distinctions, echinacea species distinctions and WHO's position on non-pharmaceutical Artemisia. The complete machine-readable catalogue is `public/pharmacy-curriculum.json`; regenerate it with `npm run export:curriculum`. Production builds regenerate it automatically.

## Evidence and educational limits

EMA traditional use and well-established medicinal use are distinct. The ivy-leaf case concerns specific preparations with well-established medicinal use; it does not validate raw ivy or every extract. Clinical conclusions cannot be transferred automatically across species, plant parts, preparations, routes or endpoints.

All ten Module 10 entries are explicitly recognition-only, including entries whose individual hazard category is “caution.” Module membership is not a toxicity ranking. No preparation, extraction, dose or administration instructions are provided. New entries use symbolic study motifs, not diagnostic illustrations or additional cultivation simulations.

Each new entry has a source-scope note and an explicit review status. Some clinical/safety introductions use checked authoritative overviews; other entries have located but incompletely appraised references, or a clearly labeled general reference only. A link is not independent validation of the entire profile. Family/part metadata and chemical mappings remain provisional; diagnostic microscopy, quantitative quality specifications, detailed mechanisms and jurisdiction-specific regulatory assessments require specialist review. The edition does not claim 100 completed clinical monographs.

Source index: `CURRICULUM-SOURCES-100.md`. Validation: `VERIFICATION-5.2.md`.
