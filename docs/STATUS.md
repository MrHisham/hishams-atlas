# Atlas 5.3 — Tier 3 update

Added the exact supplied priorities 101–150 and Modules 11–15. Totals: 150 introductory plant profiles, fifteen modules and 165 module questions. Five research missions add fifteen separate saved decisions. Missions use clearly labeled fictional analytical data and exposure cases. All Module 14 entries are recognition-only. Eight cultivation beds, original 100 records/questions and saved progress remain intact.

These additions do not complete the premium 3D simulation or 150 specialist-reviewed monographs. Symbolic study motifs are not diagnostic art. Source scope, provisional metadata and outstanding review gaps are explicit. See TIER-3.md, TIER-3-SOURCES.md and VERIFICATION-5.3.md for the current release. Earlier checklists follow as historical context.

# Atlas 5.2 update — Essential 100

Added priorities 51–100 in the supplied five modules. Total: 100 introductory plant profiles, ten modules and 110 saved practice questions/cases. Essential 50 records and question content are unchanged. Collection filtering, notes, literature connections, recognition records and JSON backups support the expansion. Module 10 is explicitly recognition-only, independent of hazard category.

The original eight cultivation beds remain the simulated garden. No additional species-specific cultivation or diagnostic art is claimed. The seven profile sections are introductory; provisional botanical/chemical labels, microscopy, quality specifications, detailed mechanisms and several plant-specific source appraisals remain unfinished. See CURRICULUM-100.md and VERIFICATION-5.2.md for current scope and checks.

Earlier implementation checklist and limitations follow as historical context.

# Implementation checklist and production gaps

This release is a local-first vertical slice. “Implemented” below describes code and behavior present in this edition; the final verification record is in `VERIFICATION.md`. It is not a claim that the complete master brief is satisfied.

## Milestones

- [x] Inspect both supplied directories and preserve originals.
- [x] Preserve all 50 catalogue records without fabricating missing books/files.
- [x] Replace layered legacy UI with a single React application shell and shared types.
- [x] Separate render lifecycle, data, persistence, audio and PDF reader modules.
- [x] Local-first IndexedDB state/file tables with schema version 1 and visible write errors.
- [x] Explore World, a separate cinematic camera mode and Medical Garden.
- [x] Exactly one functional garden door in the library; a corresponding garden return gate.
- [x] Drag-look, WASD/arrows, bounded walking, furniture/bed collision footprints, reset and accessible teleport points.
- [x] 3D volumes derived from the real supplied catalogue, raycast inspection and orbit/zoom preview.
- [x] Dedicated study camera presets, timestamp-based focus, tasks and persistent session history.
- [x] Procedural avatar/cat appearance controls and subtle idle motion.
- [x] Original library/garden geometry, wood grain, shelving, seating, fireplace, raised beds, greenhouse, pavilion and fountain.
- [x] Bed preparation, sowing, watering, visible six-stage growth, drought/health and virtual specimen collection.
- [x] Expanded field book for 50 priority plants with seven scoped study sections, notes, references and explicit toxicity/controlled-context labels.
- [x] Five ten-plant modules, 55 practice questions/cases, saved progress and virtual recognition records.
- [x] Backward-compatible learning state and a pre-upgrade metadata snapshot; the original eight cultivation beds are preserved.
- [x] Persistent herbarium sheets with editable observations.
- [x] Botanical-to-library relationships and resource backlinks.
- [x] Local PDF/image/text/Markdown import; unsupported-format handling.
- [x] PDF.js pages, zoom, text search, bookmarks, page/rectangle anchored highlights and annotation notes.
- [x] Flashcards created from the reader and simple scheduled review.
- [x] Local music selection, playback/pause/seek/skip/loop/shuffle/volume and generated ambience.
- [x] Full JSON backup including attached files; runtime validation and transactional restore.
- [x] Appearance settings, graphics presets, text scaling, reduced ambient motion and direct garden accessibility option.
- [x] Model tests and browser journey tests supplied.
- [x] Production build, source, launcher, asset inventory and scientific review documentation.

## Deliberately unfinished

- [ ] Premium semi-realistic architecture, richly authored materials, foliage LOD and commercial-game lighting. The present scenes remain procedural and visibly stylized.
- [ ] Rigged production avatar, hairstyle/outfit meshes, accessories, glasses, multiple sitting poses, reading/typing/drinking/stretching animations.
- [ ] Walking/following/reactive companion animation state machine. Present cat has only simple breathing, recoloring and a greeting interaction.
- [ ] Animated book extraction from its exact shelf position. The selected volume opens in a separate interactive 3D inspection scene.
- [ ] Fully editable room/garden furniture with collision-safe placement and custom shelf ordering.
- [ ] Physically rendered active tools, pruning, seed inventory, free species placement and species-specific growth biology.
- [ ] Continuous background/offline plant growth. Growth advances only with the explicit next-day action.
- [ ] Species-specific six-stage morphology validated by a botanist; the existing plant forms are illustrative motifs.
- [ ] A complete taxonomically reviewed encyclopedia with geographic distribution, validated microscopy, clinical bibliography, full safety/interactions and analytical specifications.
- [ ] Comprehensive specialist-reviewed instruction across all chemical classes, biosynthesis, spectroscopy, verified 2D/3D structures and validated analytical workflows. The new 55-question curriculum covers selected study mappings, scoped evidence and safety cases; detailed mechanisms and microscopy remain incomplete. The lab retains its synthetic trace and menthol source link.
- [ ] EPUB reader, OCR, selectable PDF text layer, passage-linked highlights, split view and passage-selection keyboard commands. Arrow-page and +/− zoom shortcuts are implemented.
- [ ] Custom metadata schemas, smart saved filters, custom collections/shelves UI, recent-resource tracking and complete reading-list workflows. This edition includes searchable collections, editable collection labels/tags, favorites and progress.
- [ ] Universal relationship graph across all entity types. Current explicit links connect plant records and resources; flashcards refer to books and specimens to species.
- [ ] Persistent music file storage, bird ambience, layered independent ambience buses and playlist management beyond current-session selection.
- [ ] Streaming/chunked backups with cryptographic checksums, file garbage collection, snapshot recovery UI and complete legacy migration.
- [ ] Reordering annotations across altered PDF editions. Anchors are page-local rectangles tied to an unchanged file.
- [ ] Fully equivalent screen-reader navigation for every world interaction. Accessible panels and teleport shortcuts cover primary tasks but a semantic world map is planned.
- [ ] Automated multi-GPU benchmarks, context restoration without reload, visual-regression baselines and exhaustive screen/device testing.
- [ ] Desktop installer, service worker, cloud sync and hosted deployment. These were not necessary for the local-first scope.

## Known constraints

The app requires a modern WebGL-capable Chromium browser and an HTTP origin. Storage belongs to the browser profile and exact origin/port. Incognito mode, browser cleanup or device loss can erase it. Source metadata is preserved but not bibliographically verified. Simulations and sketches are not clinical or identification tools. Backups base64-encode files in memory and are not appropriate for very large document libraries yet. Scene changes rebuild resources, so there may be a brief frame pause. Avatar/companion meshes remain deliberately simple. Current collision boxes prioritize primary furniture and beds; decorative foliage and every pavilion object do not have individual collision meshes. Low-power mode reduces resolution/shadows and reduced-motion mode renders still scenes on demand.

## Next production steps

1. Commission or license coherent architecture, foliage, rigged character and companion assets; validate licenses, performance and camera-safe compositions.
2. Expand the tested vertical slice into separate artist-authored worlds with instancing, LOD, measured GPU budgets and visual-regression baselines.
3. Add species-specific horticulture, tools, inventory, greenhouse examination stations and a complete reviewed botanical content pipeline.
4. Extend reader and knowledge tools: text highlights, EPUB/OCR, richer connections, smart collections and user-defined metadata.
5. Harden data management with streaming archives, integrity hashes, recoverable migration UI, large-library stress tests and optional desktop distribution.
