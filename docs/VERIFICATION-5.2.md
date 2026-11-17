# Atlas 5.2 verification — 1 November 2026

- TypeScript: passed (`tsc --noEmit`).
- Unit checks: 20 passed across the model and curriculum suites.
- Existing browser journeys: six passed in the full-suite run (field book, legacy-save snapshot, garden, study/audio, PDF/backup and responsive navigation).
- New expansion journey: passed separately after the final navigation fix. It checks Essential/Next 50 filters, Modules 6 and 10, seven-section profiles, preparation-specific ivy evidence, recognition-only sweet wormwood, all eleven Module 10 answers, old/new progress together, recognition records, backup restore, reload and mobile overflow. The final targeted HTML report is in `docs/test-report/`.
- Final Vite production build: passed. The existing Three.js vendor chunk still triggers Vite's size advisory; no build failure.
- Production smoke: standalone HTTP server, 100 plants, ten modules, lazy PDF worker, local PDF import/rendering and saved annotation. See the smoke command below and production screenshots.
- Original 50 plant records and five modules: exact equality with the frozen 5.1 catalogue fixture.
- Original 55 questions: exact equality including IDs, prompts, options, answers, explanations and sources. Existing saved answers retain their meaning.
- New module membership: exact consecutive priorities 51–60, 61–70, 71–80, 81–90 and 91–100, with ten unique plants each.
- All 110 questions have four distinct options and exactly one correct answer.
- Original eight garden species IDs remain independent of catalogue priority order.
- Original 50 library metadata records are unchanged. `src/catalogue.json` SHA-256: `22b57effc6794224f85e2ee68edf7f6ff11932dfddde5a246fc6d9cb6529ae51`.
- Existing production address `http://127.0.0.1:4173/` responds with version 5.2, 100 plants and ten modules. Reusing this origin retains its browser-local IndexedDB collection.

The expansion journey found that the profile's “All 100 plants” button could return to a previously selected module tab. The button now explicitly selects the collection view; the journey passed after correction. An earlier run was interrupted while diagnosing the issue and is not counted as a passing run.

## Reproduce

```sh
npm test
npm run build
```

Start the Vite server on port 5175, then run:

```sh
npm run test:e2e
node tests/production-smoke.mjs
```

Browser verification used installed Microsoft Edge, Low graphics and reduced motion on Windows. This verifies behavior, not performance across all GPU configurations. Desktop and mobile screenshots were visually inspected.

## Content scope

Seven sections per plant are introductory study scaffolds, not completed monographs. Provisional family/part/chemistry labels, diagnostic microscopy, quantitative specifications, some mechanisms and several plant-specific source appraisals remain pending. Each new record discloses its source scope and review status. All Module 10 entries are recognition-only without preparation or administration instructions. No new cultivation species or diagnostic botanical images are claimed.

The release archive includes source, production assets, curriculum JSON, launch scripts and documentation; it excludes installed dependencies and temporary browser traces. Packaging checks verify ZIP integrity, the 100/10 exported counts and the unchanged original library hash.
