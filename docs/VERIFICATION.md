# Verification record — 29 October 2026

## Passed

- TypeScript `tsc --noEmit` on the final source.
- Seven Vitest model tests: prepared/sown/watered six-stage growth and harvest, drought/health, immutable/invalid actions, timestamp completion exactly once, no early timer completion, invalid/duplicate/versioned backup rejection, and preservation of 50 metadata-only records.
- Four complete Playwright browser journeys passed together:
  1. Physical library door → garden → prepare/sow/water → five growth advances → virtual harvest → herbarium observation → botanical note → reload persistence → greenhouse/pavilion viewpoints → return to library.
  2. Cinematic study, alternate camera, focus session across worlds/reload, saved task, original local WAV playback/pause and user-started rain ambience.
  3. Original PDF import/rendering, text search, normalized rectangle highlight and note, bookmark, flashcard, interactive 3D book preview, full backup including file bytes, validated restore and successful reload of PDF plus annotation.
  4. Tablet and phone navigation/catalogue/field-book layouts with no document-level horizontal overflow.
- An additional responsive journey passed after fixing reduced-motion canvas redraw on viewport resize. The updated mobile screenshot visibly contains the 3D scene.
- Final Vite production build succeeds. PDF reader and worker are separate local assets; a bundle-size advisory remains for Three.js. This is not a measured frame-rate benchmark.
- `node tests/production-smoke.mjs` passed against the included dependency-free static server, checking compiled startup, lazy PDF module/worker, local file import, page rendering and saving an annotation with no browser errors.
- SHA-256 of `src/catalogue.json` matches the original supplied metadata file: `22b57effc6794224f85e2ee68edf7f6ff11932dfddde5a246fc6d9cb6529ae51`.

## Environment and limits

Windows, Node.js 24.22.1, installed Microsoft Edge controlled through Playwright. Browser journeys use the Low graphics preset and reduced motion. Desktop: 1440×900. Tablet: 1024×768. Phone: 390×844. Production smoke: 1280×800. These checks do not establish performance or compatibility on all GPUs, Safari, Firefox or physical mobile devices.

The first browser attempts identified and led to fixes for stale camera matrices during immediate post-teleport raycasts, excessive rendering work in still scenes, Vite watching locked test-backup files, and reduced-motion resize clearing the canvas without requesting a redraw. Final checks above use the corrected implementation.

## Visual review

Actual screenshots were inspected for the library, cinematic study, avatar, garden entrance/growth, herbarium, PDF reader, book inspection, tablet field book and phone navigation/catalogue. Additional greenhouse/pavilion and botanical-record screenshots are included. The UI is legible and the tested panels fit their viewports. Procedural architecture, simplified avatar/companion geometry, sparse unplanted beds and stylized botanical motifs remain visible limitations. No commercial-game visual fidelity, scientifically validated illustration or full premium-art completion is claimed.

`docs/test-report/index.html` contains the passing four-journey report. The repeated responsive check uses the console reporter so the full report is retained. Screenshots are evidence of this implementation, not approved visual-regression baselines. See `STATUS.md` for the feature-by-feature checklist and production roadmap.
