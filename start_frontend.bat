@echo off
echo ========================================================
echo   Starting SpendAura Vite + React Frontend Development Server
echo ========================================================
cd "%~dp0frontend"
echo Installing frontend dependencies...
npm install
echo Launching Vite development server...
npm run dev
pause
