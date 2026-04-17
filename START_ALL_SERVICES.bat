@echo off
REM ML Model Integration - Windows Startup Script
REM This script starts all services needed for the Task Manager with ML integration

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Task Manager - ML Integration Setup
echo ========================================
echo.

REM Check if Python is installed
python --version 2>&1 | findstr /R "^Python" >nul
if errorlevel 1 (
    echo.
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python 3.8 or higher from: https://www.python.org/downloads/
    echo.
    echo After installation, restart this script.
    echo.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version 2>&1 | findstr /R "^v[0-9]" >nul
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js 16 or higher from: https://nodejs.org/
    echo.
    echo After installation, restart this script.
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting ML Service on port 8000...
echo.
cd /d "%~dp0task-manager-backend\ml"

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

REM Install requirements if needed
pip install -q -r requirements.txt 2>nul

REM Start ML service in a new window
start "Task Manager - ML Service" cmd /k "cd /d %cd% && python -m uvicorn app:app --reload --port 8000"
echo ✓ ML Service started in new window (port 8000)

REM Wait a moment for ML service to start
timeout /t 3 /nobreak

echo.
echo [2/3] Starting Backend Service on port 5000...
echo.
cd /d "%~dp0task-manager-backend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install -q
)

REM Start backend service in a new window
start "Task Manager - Backend" cmd /k "cd /d %cd% && npm start"
echo ✓ Backend started in new window (port 5000)

REM Wait a moment for backend to start
timeout /t 3 /nobreak

echo.
echo [3/3] Starting Frontend Service on port 3000...
echo.
cd /d "%~dp0task-manager-frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install -q
)

REM Start frontend service in a new window
start "Task Manager - Frontend" cmd /k "cd /d %cd% && npm start"
echo ✓ Frontend started in new window (port 3000)

echo.
echo ========================================
echo   All services starting...
echo ========================================
echo.
echo Services will open in new command windows:
echo  • ML Service:  http://127.0.0.1:8000
echo  • Backend:     http://localhost:5000
echo  • Frontend:    http://localhost:3000
echo.
echo The frontend will automatically open in your browser.
echo.
echo To stop services, close the command windows or press Ctrl+C in each window.
echo.
pause
