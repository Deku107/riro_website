@echo off
echo Building Riro Talehouse Website for Production
echo ==============================================

REM Build frontend
echo Building frontend...
cd frontend
call npm ci
if errorlevel 1 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo Error building frontend
    pause
    exit /b 1
)

echo Frontend build complete!
echo Build files located in: ./dist

REM Create production package for backend
echo Preparing backend for production...
cd ..\backend

REM Install production dependencies only
call npm ci --production
if errorlevel 1 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo Backend ready for production!
echo.
echo Next steps:
echo 1. Upload entire project to server
echo 2. Configure environment variables
echo 3. Follow PLESK_DEPLOYMENT.md instructions
pause
