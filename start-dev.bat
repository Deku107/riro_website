@echo off
echo Starting Riro Talehouse Website Development Environment
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm run dev"

echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo ================================================
echo Development servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo ================================================
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
pause
