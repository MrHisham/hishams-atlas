# Atlas 5.1 — Pharmacy learning collection

The user's 50 priorities are preserved in their original numerical order. This is an educational selection, not a ranking of clinical effectiveness, a prescribing guide or a universal accreditation list.

## Working features

- Fifty searchable records: common/scientific names, provisional family/material labels, constituent study themes, safety context and source links.
- Five learning modules with exactly ten plants each. Every plant belongs to one primary module; membership is a teaching arrangement, not an indication, hazard or efficacy ranking.
- Seven sections per profile: botany, pharmacognosy, phytochemistry, pharmacology, clinical evidence, toxicology and pharmaceutical relevance.
- Ten plant questions plus one synthetic teaching case per module: 55 questions in total. Answers, corrections and opened-profile counts persist locally and are included in full backups.
- Research notes, links to personal literature, and virtual recognition records in the herbarium. Recognition records contain no harvested material and are not real-world identifications.
- Existing eight cultivation beds retain their IDs, species, growth state, notes and harvest history. Expanding the learning catalogue does not pretend that 42 additional growth models or garden plots have been built.

## Five ten-plant modules

1. **Everyday medicinal plants:** chamomile, peppermint, ginger, turmeric, garlic, lavender, thyme, fennel, rosemary and eucalyptus. Match common/scientific names; examine preparation-specific evidence.
2. **Phytochemical foundations:** senna, psyllium, cinnamon, clove, green tea, coffee, cacao, olive, artichoke and dandelion. Distinguish study markers, classes, mixtures and materials. A constituent match does not establish clinical benefit.
3. **Clinical herbal products:** milk thistle, ginkgo, St. John's wort, valerian, echinacea, Asian ginseng, ashwagandha, fenugreek, saw palmetto and cranberry. Compare clinical summaries and study an interaction-recognition case.
4. **Pharmaceutical natural products:** black seed, hawthorn, boswellia, myrrh, willow, foxglove, opium poppy, cinchona, Madagascar periwinkle and Pacific yew. Connect preparation specificity, quality and drug-discovery history. Not every member has an approved pharmaceutical derivative.
5. **Toxicology & safety:** sage, licorice, aloe vera, horse chestnut, neem, deadly nightshade, ephedra, castor bean, rauwolfia and autumn crocus. Study adverse effects, raw-material/product distinctions and hazard recognition. Inclusion does not mean that every part or product has the same toxicity.

## Scientific review boundaries

The seven sections are structured learning profiles, not completed pharmacopoeial monographs. Clinical and safety overviews point to the relevant authority and explicitly limit the source scope. They are not exhaustive contraindication or interaction references.

The supplied names and learning priorities are distinguished from curator-added study metadata. Family/material labels and detailed chemical-class/marker mappings are marked provisional. They need taxonomic, pharmacognosy and pharmacy review before formal academic use. No quantitative assay criteria, microscopy images, diagnostic microcharacters, molecular structures or species-specific dosing are invented. Sections still needing those details say so explicitly and provide a student verification task.

The thyme EMA overview was access-limited; the black-seed and neem LiverTox full texts encountered access checks. Those records are explicitly marked as references located with incomplete full-text review, rather than as independently verified monographs. Source links for medicines (for example quinine and vincristine) are not represented as proof of efficacy or identity of raw plant material. The willow overview spans several species; the fennel source is narrower than all fennel products. Regulatory statements are source/jurisdiction-specific; no universal or Jordan-specific legal status is asserted.

Toxic or controlled contexts use recognition-only labels. No plant preparation, extraction, dosing, use or real-world cultivation instructions are supplied. New recognition records use symbolic study plates rather than invented diagnostic illustrations. The pre-existing eight procedural plant motifs remain explicitly stylized.

## Save compatibility

The database remains `hishams-atlas-5` on the same origin. The state format retains version 1 and adds a defaulted `learning` field. Before first loading a state without that field, `loadState()` keeps the original raw metadata in the `snapshots` table under `before-curriculum-5.1`; imported file blobs are untouched. New quiz state then saves with the rest of the atlas. Old backups remain accepted, with empty learning progress added. New recognition records may refer to any of the 50 species; cultivation-bed validation remains restricted to the original eight species.

The snapshot is a local recovery aid. Continue exporting portable backups through Settings. No migration step silently replaces the book catalogue or garden layout.

## Authoring

- `src/curriculum-data.ts`: the 50-entry priority list, study themes, clinical/safety summaries, references and exact module membership.
- `src/botany.ts`: shared plant records, seven-section profile composition, provenance and explicit review status.
- `src/curriculum.ts`: stable question IDs, deterministic choices, filters and five teaching cases.
- `src/FieldBook.tsx` and `src/curriculum.css`: browsing, profile sections, note/literature links, recognition and practice UI.
- `public/pharmacy-curriculum.json`: portable curriculum metadata, with review/scope caveats. This is not a user-state backup and should not be restored through Settings.

Add specialist-reviewed diagnostic features and microscopic characters only with an exact reference, publication details, taxon/part/preparation scope and an explicit review record. Retain the evidence-category distinction: tradition, laboratory/animal research, human clinical outcomes and regulatory assessment are different things.

## Reference index

The accompanying `CURRICULUM-SOURCES.md` lists the source organization and link associated with all 50 entries. Reference check date: 1 November 2026. Publication years are left source-linked when not independently verified.
