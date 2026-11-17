# Atlas 5.1 verification — 1 November 2026

The 50-plant learning collection is a working extension of the local-first vertical slice. It is not a completed clinical reference or a claim of expert validation.

## Passed checks

- TypeScript type checks.
- All 17 Vitest tests: seven existing garden/timer/backup tests and ten curriculum-integrity/save-compatibility tests.
- A complete six-journey Playwright run passed:
  1. Fifty profiles; filters by module/constituent; seven sections; toxic/controlled-context labels; recognition record; a full 11-question module including wrong-answer correction and a teaching case; saved notes; full backup/restore; practice progress after reload.
  2. An old save without learning data receives a pre-upgrade snapshot and preserves its bed identity, stage, moisture and botanical note. Tablet/phone curriculum views have no document-level horizontal overflow.
  3. Existing physical garden door, planting, watering, growth, harvest, notes, persistence and return journey.
  4. Existing cinematic views, focus, tasks, local audio and ambience journey.
  5. Existing PDF import, render, search, highlight, notes, flashcard, inspection and full-backup journey.
  6. Existing tablet/phone workspace navigation journey.
- Final Vite build succeeds with the source-linked curriculum included locally. Three.js still produces a bundle-size advisory; no new cross-device frame-rate benchmark is claimed.

The compiled-app smoke check and release archive are recorded in `RELEASE-5.1.txt` after packaging.

## Visual review

Inspected actual desktop screenshots of the 50-plant browser, five learning modules, teaching case and controlled-plant profile, plus the phone module view. The curriculum is scrollable and fits the tested viewport widths. Profiles reset to the top when opened, so their hazard labels precede the study sections. The compact catalogue header leaves the first row of plant names visible on desktop.

Screenshots: `curriculum-50.png`, `learning-modules.png`, `teaching-case.png`, `controlled-plant-profile.png`, `curriculum-tablet.png`, `curriculum-mobile.png` and `production-curriculum.png`. The HTML report in `docs/test-report/index.html` records the six passing journeys. The earlier 5.0 verification document is retained as historical provenance.

## Content review limits

All 50 priorities, order, module memberships, section presence, quiz integrity and persistence are checked. This is not the same as clinical or taxonomic validation. Full microscopy, quantitative quality specifications, many mechanism details, taxonomic reconciliation and chemical mappings still require specialist review and are labeled accordingly. Thyme, black-seed and neem references have incomplete full-text review due to access limitations. Sources are not represented as supporting every provisional metadata field. See `CURRICULUM.md` and `CURRICULUM-SOURCES.md`.

New species are study/recognition records; the original eight garden beds remain the only cultivation simulation. No unsupported claim of 50 fully modeled garden species is made. No toxic/controlled-material preparation, extraction, dosing or use instructions are included.
