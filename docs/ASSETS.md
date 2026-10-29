# Asset and dependency inventory

## Supplied inputs

- `C:/Users/Code/Downloads/hishams_atlas_4_0/`: inspected `index.html`, `README.txt`, `athenaeum-recovered-books.json` and local `three.min.js`. The approximately 184 KB HTML mixes several revisions, overlapping UI systems, localStorage garden records and an IndexedDB-backed native PDF iframe workflow. It is retained unchanged in the user's Downloads. No legacy JavaScript is bundled in the new app.
- `src/catalogue.json` is an unchanged copy of the supplied 50-resource metadata array. Provenance: user-supplied Atlas export. These records are not independently verified bibliographic descriptions, and no missing PDFs, authors or publication metadata have been invented. Rights to the catalogue remain with their respective owners; no license to referenced books is implied.
- `C:/Users/Code/Downloads/VirtualCottage_1.5.4/`: contains a 33.6 MB Windows executable and a 79.2 MB Godot asset pack. Neither is editable source or a separately licensed asset library. Neither was extracted, executed, incorporated or redistributed. No game artwork, music or code is included.
- No screenshots, Spirit City asset archives, Spiritify source, EPUBs or book PDFs were supplied in the named folders. Textual references to those inputs are not evidence that they were available.

## New assets

All geometry, wood grain, plant motifs, cover layouts, companion/character geometry and synthesized ambience in this release are created procedurally in the source. They contain no extracted commercial-game assets. The avatar and cat are simple original procedural studies, not finished rigged characters. Test PDF and silent WAV are original generated QA fixtures. Local system fonts are used; no font files are redistributed.

New application source is provided under the MIT license in `LICENSE`. Supplied catalogue data and third-party dependencies are excluded from that license grant.

## Direct libraries

| Package | License | Use |
|---|---|---|
| React / React DOM | MIT | UI |
| Three.js | MIT | Rendering and OrbitControls |
| Dexie | Apache-2.0 | IndexedDB |
| PDF.js (`pdfjs-dist`) | Apache-2.0 | PDF parsing/rendering and local worker |
| Zod | MIT | Backup validation |
| Lucide React | ISC | UI icons |
| Vite | MIT | Development/build |
| TypeScript | Apache-2.0 | Type checks |
| Vitest | MIT | Model tests |
| Playwright | Apache-2.0 | Browser testing |

Exact versions are pinned in `package.json` and `package-lock.json`. `docs/DEPENDENCIES.json` records installed package names, versions and declared licenses. Upstream license texts are retained under `docs/licenses/` for redistributed runtime packages. Consult those texts before redistribution. Source sites are linked and summarized briefly; their images are not downloaded or bundled.
