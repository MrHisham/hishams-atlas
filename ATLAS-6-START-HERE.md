# ATLAS 6 — Living Pharmacist (Alpha 6)

**Latest release notes:** see `ATLAS-6-ALPHA6-RELEASE.md`.

## Windows
1. Install Node.js 22.12+ (Node 24 recommended).
2. Extract ZIP to a folder.
3. Double-click `Start Atlas.cmd`. It installs dependencies on first launch, builds Atlas 6 from source, then prints a localhost URL. Internet access is needed for the first dependency installation.
4. Use Settings > Export full backup regularly. Export from your current ATLAS 5 installation **before** opening this upgrade.

For source development, run `npm install` and `npm run dev`.

## Scope / safeguards
This is an **alpha foundation**, not the finished ATLAS 6 simulation. It reuses the existing 3D world; this phase adds dynamic atmosphere and academy character presence; it is not yet a complete life simulation. Self-reported XP is for motivation, not validated pharmacy competency. Existing IndexedDB name and state version remain unchanged for compatibility. The Atlas Life field is optional when validating older saves.
