#!/bin/bash

# Task Manager - ML Integration Setup Script
# For Linux/macOS

echo ""
echo "========================================"
echo "  Task Manager - ML Integration Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 16 or higher"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "[1/3] Starting ML Service on port 8000..."
echo ""
cd "$SCRIPT_DIR/task-manager-backend/ml"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

# Install requirements
pip install -q -r requirements.txt 2>/dev/null

# Start ML service in background
python -m uvicorn app:app --reload --port 8000 &
ML_PID=$!
echo "✓ ML Service started (PID: $ML_PID, port 8000)"

# Wait a moment for ML service to start
sleep 3

echo ""
echo "[2/3] Starting Backend Service on port 5000..."
echo ""
cd "$SCRIPT_DIR/task-manager-backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install -q
fi

# Start backend service in background
npm start > /dev/null 2>&1 &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID, port 5000)"

# Wait a moment for backend to start
sleep 3

echo ""
echo "[3/3] Starting Frontend Service on port 3000..."
echo ""
cd "$SCRIPT_DIR/task-manager-frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install -q
fi

# Start frontend service in background
npm start > /dev/null 2>&1 &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID, port 3000)"

echo ""
echo "========================================"
echo "  All services started successfully!"
echo "========================================"
echo ""
echo "Services running:"
echo "  • ML Service:  http://127.0.0.1:8000"
echo "  • Backend:     http://localhost:5000"
echo "  • Frontend:    http://localhost:3000"
echo ""
echo "Process IDs:"
echo "  • ML Service:  $ML_PID"
echo "  • Backend:     $BACKEND_PID"
echo "  • Frontend:    $FRONTEND_PID"
echo ""
echo "To stop all services, run:"
echo "  kill $ML_PID $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Frontend should automatically open in your browser."
echo ""

# Wait for all background processes
wait
