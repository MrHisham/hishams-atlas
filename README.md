# ATLAS VI — Live What You Learn

**Living Pharmacist · 6.0.0-alpha.6**

ATLAS is an experimental, local-first immersive personal academy combining a 3D library, medicinal garden, pharmacology learning activities, clinical case exercises, daily routines and personal progression. Inspired by exploratory academic game worlds, ATLAS is an independent educational project, not affiliated with any commercial game franchise.

> **Alpha software:** the latest release has not yet passed independent production build and Windows gameplay verification. Save a backup before upgrading. Clinical examples are fictional and educational, not patient-specific medical advice.

## Requirements

- Windows, macOS or Linux, with **Node.js 22.12+** and npm.
- A modern Chromium-based browser is recommended for the 3D experience.

## Get started

```bash
npm ci
npm run dev
```

Open the local URL displayed in the terminal. On Windows, you can also double-click `Start Atlas.cmd` to install dependencies, build and run the local production server.

## Build and tests

```bash
npm run build
npm test
```

Optional end-to-end tests:

```bash
npx playwright install chromium
npm run test:e2e
```

These commands are documented; passing results for Alpha 6 are **not** claimed. CI will run build and unit tests on future pushes.

## Features in this alpha

- Walkable 3D library, botanical garden, Personal Quarters and Clinical Hall scenes
- Local book importing, reading, notes and research tools
- Daily routines, reflections and activity progression
- Fictional clinical pharmacy exercises with educational explanations
- Time-responsive lighting, in-room avatar presence and room transitions
- Local-first IndexedDB persistence and manual full backups

See `ATLAS-6-ALPHA6-RELEASE.md` for current limitations, and [ROADMAP.md](ROADMAP.md) for planned work.

## Backups and privacy

The application currently uses the browser's IndexedDB database `hishams-atlas-5` for compatibility with earlier versions. **Export a full backup through Settings before updating.** GitHub stores the project source, not your browser data. Do not commit exported backups, personal books, confidential records or `.env` secrets.

## Licence

See [LICENSE](LICENSE). The MIT license covers the newly authored application source as described there. Third-party dependencies, user-imported books, catalogue metadata and other assets may have separate rights.
