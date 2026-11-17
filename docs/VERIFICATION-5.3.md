# Atlas 5.3 verification — 1 November 2026

## Results

- TypeScript: passed (`tsc --noEmit`).
- Unit checks: **26 passed** across model, curriculum and Tier 3 suites.
- Browser journeys: **8 passed** in the complete Playwright run. The final HTML report is `docs/test-report/index.html`.
- Production build: passed. Vite's existing advisory remains for the Three.js vendor chunk exceeding 500 kB; no build failure.
- Standalone production smoke: passed for 150 plants, fifteen modules, the synthetic research mission, startup, lazy PDF chunk/worker, local PDF import, rendered page and saved annotation, with no browser errors.
- Existing launch address `http://127.0.0.1:4173/` responds with version 5.3, 150 plants and fifteen modules. Retaining the same browser origin retains its local IndexedDB collection.

## Verified scope

- Exactly 150 unique supplied taxa in priority order. New Modules 11–15 each contain the corresponding consecutive ten plants.
- All original 100 plant objects, ten module objects and 110 questions are exactly equal to frozen 5.2 fixtures, including question IDs, prompts, options, answer order, explanations and sources.
- All 165 module questions have four unique options and exactly one correct answer.
- Five research missions contain fifteen distinct saved decision IDs, separate from practice IDs, each with four unique options and a valid answer.
- Every Module 14 plant is recognition-only and excluded from the teaching-lab context. No added cultivation beds or practical toxic-plant procedures.
- Tier 3 filter shows exactly fifty plants; individual module filters show ten. Rosary-pea profiles have seven sections, notes, recognition records and no cultivation-bed action.
- Every research mission completes in the browser, including structure-description classification, synthetic fingerprints, analytical dossier limits, fictional exposure referral, taxonomic spelling and benefit-sharing documentation. Wrong-answer feedback and saved-answer changes are exercised.
- Tier 3 mission answers, notes and recognition records round trip through a real exported JSON backup and restore, then persist across reload.
- The Next 50 browser journey continues to preserve Essential 50 quiz progress alongside Module 10 practice and recognition records.
- Original garden, focus/tasks, audio/ambience, camera, PDF search/annotations/flashcards, file backup, legacy-save snapshot and responsive navigation journeys still pass.
- Mobile width 390 px: no document-level horizontal overflow. Desktop and mobile screenshots were visually inspected.
- Original eight garden species IDs and original fifty library metadata records are retained. Library source SHA-256: `22b57effc6794224f85e2ee68edf7f6ff11932dfddde5a246fc6d9cb6529ae51`.

## Reproduce

```sh
npm test
npm run build
```

With the Vite preview running at port 5175:

```sh
npm run test:e2e
node tests/production-smoke.mjs
```

Browser verification used installed Microsoft Edge on Windows, Low graphics and reduced motion. The standalone smoke temporarily serves production assets on port 4176. These checks do not benchmark every GPU/browser configuration.

## Scientific and product limits

The seven profile sections remain introductory study scaffolds, not 150 completed clinical or pharmacopoeial monographs. Provisional family/part/chemical labels, diagnostic microscopy, quantitative specifications, some detailed mechanisms and several plant-specific reference appraisals remain pending. New source scope and review status are explicit; a Kew lookup is not a verified clinical assessment.

Mission fingerprints, structure-description cards, dossiers and exposure vignettes are curator-created teaching material. They are not measured spectra, validated molecular drawings, real clinical cases, botanical identification keys or competency certification. Module 15's conservation review is an additional curator-designed mission; the other four mission names follow the user's request. Threat status, current trade rules, product efficacy and benefit-sharing compliance require separate evidence.

The release ZIP includes source, production assets, exported curriculum, launcher and documentation. It excludes installed dependencies and temporary browser traces. Packaging verifies ZIP CRC, exported 150/15 counts, exact preservation of the first 100 records/modules and the unchanged library hash. The package report is `Atlas-5.3-package-check.json` beside the archive.
