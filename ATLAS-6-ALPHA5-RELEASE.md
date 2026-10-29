# ATLAS VI — Alpha 5: Living Spaces

## Changes from Alpha 4
- Smoother, frame-rate-independent walking acceleration and stopping, normalized diagonal speed; Shift to move faster.
- Collision boundaries added around beds, desks, shelving, and clinical worktables in the new 3D rooms.
- Center-screen, proximity-limited E-key interactions for accessible keyboard play. Mouse clicking remains available.
- Interior details: wood floor inlays, ceiling beams, architectural columns, illuminated wall accents, and framed window details in the personal quarters and clinical hall.
- The existing library, garden, quarters, clinical cases, Atlas Life, and backup format remain intact.

## Windows setup
1. Export a full backup from the previous Atlas installation.
2. Extract this archive into a *new* folder, not over the old release.
3. Install Node.js (22.12+). Double-click `Start Atlas.cmd` with internet access available for dependency installation.
4. Use WASD / arrows to move, drag the mouse to look, hold Shift to move faster, and point at nearby interactive furniture and press E. Press R to reset the camera.
5. Keep making full backups via Settings.

## Verification limitation
The ZIP integrity and updated source structure were checked. A full TypeScript/Vite build, tests, and interactive browser gameplay could not be completed in the packaging environment because zod@4.1.12 was absent from the offline npm cache. The Windows launcher performs `npm ci` and `npm run build`; **Alpha 5 is not verified production-ready**.

## Storage
The existing `hishams-atlas-5` IndexedDB database name is unchanged. Back up first; same-browser same-origin data can be shared between releases.
