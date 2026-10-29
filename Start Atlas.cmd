@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.12 or newer is required. Install Node.js, then try again.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm is required. Reinstall Node.js with npm.
  pause
  exit /b 1
)
echo =======================================
echo    ATLAS VI - Living Pharmacist Alpha
echo =======================================
echo Installing dependencies if required...
if not exist "node_modules\.bin\vite.cmd" (
  call npm ci
  if errorlevel 1 goto fail
)
echo Building the latest Atlas VI source...
call npm run build
if errorlevel 1 goto fail
echo Starting Atlas...
node serve.mjs
pause
exit /b 0
:fail
echo Build failed. The Atlas 6 source requires its dependencies.
echo Check the error shown above; your saved browser data is unaffected.
pause
exit /b 1
