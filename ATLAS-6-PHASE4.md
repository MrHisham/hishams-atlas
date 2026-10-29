# ATLAS VI — Alpha 4: Immersive Academy

## Added
- Walkable 3D Personal Quarters with bed, desk and daily-planner interaction.
- Walkable 3D Clinical Hall with case-study tables and clinical-workspace interaction.
- 3D library portal objects to enter the new rooms, plus return doors.
- Direct navigation buttons, accessible workspace actions and updated world descriptions.
- Reuses the existing life, routine, clinical case and IndexedDB storage implementations: no save database rename or migration.

## Launch on Windows
1. Back up your existing Atlas in Settings before upgrading.
2. Extract the ZIP to a new folder.
3. Install Node.js 22.12+ (or supported newer LTS).
4. Double-click Start Atlas.cmd. The launcher installs dependencies and builds the application.
5. Use the top navigation to enter Quarters 3D or Clinical Hall 3D; WASD moves, mouse drag looks, E interacts with nearby highlighted objects.

## Verification limitation
This release was source-modified and ZIP integrity checked, but the full TypeScript/Vite build and automated browser tests could not be completed in the packaging environment: offline npm installation lacks the cached zod 4.1.12 package. It must be built and tested on a system with npm package registry access. These are initial functional 3D rooms, not a finished Hogwarts-scale world or verified clinical training environment.
