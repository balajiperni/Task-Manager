# 🤖 Task Manager - ML Model Integration

## Overview

The Task Manager now includes an **AI-powered subtask generation system** that uses machine learning to automatically suggest subtasks based on task descriptions. This integration includes:

- **FastAPI ML Service** - Runs intelligent intent classification and subtask generation
- **Node.js Backend** - Proxies ML requests and manages persistence
- **React Frontend** - Beautiful UI for AI-assisted task creation

---

## Quick Start

### Option 1: Automated Startup (Windows)
```bash
cd Task-Manager
START_ALL_SERVICES.bat
```

### Option 2: Automated Startup (Linux/macOS)
```bash
cd Task-Manager
chmod +x START_ALL_SERVICES.sh
./START_ALL_SERVICES.sh
```

### Option 3: Manual Startup

**Terminal 1 - ML Service:**
```bash
cd task-manager-backend/ml
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

**Terminal 2 - Backend:**
```bash
cd task-manager-backend
npm install
npm start
```

**Terminal 3 - Frontend:**
```bash
cd task-manager-frontend
npm install
npm start
```

---

## Features

### 1. AI Subtask Generation During Task Creation

When creating a task, users can:
1. **Enter task details** - Title, description, priority, and due date
2. **Click "Generate"** - AI analyzes the task and suggests subtasks
3. **Review suggestions** - See the AI-generated subtasks
4. **Enable saving** - Check "Save these subtasks with the task" 
5. **Create task** - Subtasks are automatically saved with the task

### 2. Intelligent Intent Classification

The ML model identifies task types:
- **Development** - Software/coding projects
- **Learning** - Educational tasks
- **Planning** - Project planning
- **Research** - Research and exploration
- **Generic** - Falls back to generic subtasks

### 3. Template-Based Generation

For high-confidence predictions, the system uses pre-trained templates to generate relevant subtasks.

### 4. Fallback System

If confidence is too low, the system uses generic subtasks to ensure task creation never fails.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Frontend (React)                                    │
│ • CreateTaskModal.jsx - Task creation with AI       │
│ • Tasks.jsx - Main task management                  │
│ • Calls: POST /api/ai/suggest                       │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│ Backend (Node.js/Express)                           │
│ • /api/ai/suggest - Suggests subtasks               │
│ • /api/tasks - Creates task with subtasks           │
│ • ai.service.js - Proxies to ML service             │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│ ML Service (FastAPI)                                │
│ • /generate-subtasks - AI generation endpoint       │
│ • /feedback - Learns from user corrections          │
│ • Core ML modules:                                  │
│   - intent_classifier.py - Intent prediction       │
│   - subtask_generator.py - Subtask generation      │
│   - feedback_learner.py - Learns from feedback     │
└─────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Suggest Subtasks (No Save)
**Used during task creation before saving**

```
POST /api/ai/suggest
Headers: Authorization: Bearer {token}
Body: {
  "title": "Build a mobile app",
  "description": "Create an iOS app for task management"
}

Response: {
  "subtasks": [
    "Design the UI wireframes",
    "Set up development environment",
    "Create data models",
    "Implement authentication",
    "Build the main features"
  ]
}
```

### Create Task with Subtasks
**Creates task with saved subtasks**

```
POST /api/tasks
Headers: Authorization: Bearer {token}
Body: {
  "title": "Build a mobile app",
  "description": "Create an iOS app for task management",
  "priority": "High",
  "dueDate": "2026-05-01",
  "subtasks": [
    "Design the UI wireframes",
    "Set up development environment",
    ...
  ],
  "collaborators": [1, 2, 3]
}

Response: {
  "id": 42,
  "title": "Build a mobile app",
  "description": "...",
  "subtasks": [
    { "id": 101, "title": "Design the UI...", "order": 1 },
    ...
  ],
  ...
}
```

### Send Feedback (For ML Improvement)
**Tells the ML system which subtasks were actually useful**

```
POST /api/ai/feedback
Headers: Authorization: Bearer {token}
Body: {
  "description": "Build a mobile app",
  "predictedIntent": "development",
  "confidence": 0.87,
  "generatedSubtasks": ["...", "..."],
  "finalSubtasks": ["...", "..."]
}

Response: {
  "message": "Feedback saved"
}
```

---

## Configuration

### Environment Variables

Create `.env` in `task-manager-backend/`:

```env
# ML Service
ML_SERVICE_URL=http://127.0.0.1:8000

# Database
DATABASE_URL=file:./dev.db

# Server
PORT=5000
NODE_ENV=development
```

### ML Service Configuration

The ML service runs on port 8000 by default. To change it:

```bash
python -m uvicorn app:app --port 9000
```

Then update the backend `.env`:
```env
ML_SERVICE_URL=http://127.0.0.1:9000
```

---

## Troubleshooting

### "ML service unavailable" Error

**Problem:** Frontend shows error when trying to generate subtasks

**Solutions:**
1. Check ML service is running: `http://127.0.0.1:8000/docs`
2. Verify Python environment has all dependencies:
   ```bash
   cd task-manager-backend/ml
   pip install -r requirements.txt
   ```
3. Check firewall isn't blocking port 8000

### Slow Subtask Generation

**Problem:** First request takes several seconds

**Solution:** This is normal - the first request loads the ML model into memory. Subsequent requests should be <1 second.

### "Permission denied" (Linux/macOS)

**Problem:** Script won't run

**Solution:**
```bash
chmod +x START_ALL_SERVICES.sh
./START_ALL_SERVICES.sh
```

### Frontend Can't Connect to Backend

**Problem:** CORS error or network error

**Solutions:**
1. Ensure backend is running on port 5000
2. Check frontend `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Verify no firewall blocks localhost connections

---

## File Structure

```
Task-Manager/
├── ML_INTEGRATION_GUIDE.md          # Detailed guide
├── START_ALL_SERVICES.bat           # Windows startup script
├── START_ALL_SERVICES.sh            # Linux/macOS startup script
│
├── task-manager-backend/
│   ├── ml/                          # FastAPI ML service
│   │   ├── app.py                   # FastAPI server
│   │   ├── requirements.txt         # Python dependencies
│   │   ├── core/
│   │   │   ├── intent_classifier.py
│   │   │   ├── subtask_generator.py
│   │   │   ├── feedback_learner.py
│   │   │   └── ...
│   │   ├── data/
│   │   │   ├── intents.json         # Intent definitions
│   │   │   ├── subtask_templates.json
│   │   │   └── feedback.json
│   │   └── utils/
│   │
│   ├── src/
│   │   ├── services/
│   │   │   ├── ai.service.js        # ML API client
│   │   │   └── ml.service.js        # Alternative ML client
│   │   ├── controllers/
│   │   │   ├── ai.controller.js     # AI route handlers
│   │   │   └── task.controller.js   # Task creation with AI
│   │   ├── routes/
│   │   │   └── ai.routes.js         # AI endpoints
│   │   └── app.js
│   │
│   └── package.json
│
├── task-manager-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CreateTaskModal.jsx  # Task modal with AI
│   │   ├── pages/
│   │   │   └── Tasks.jsx            # Tasks page with AI
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   └── App.js
│   │
│   └── package.json
│
└── ml-service/                      # Alternative ML service location
    └── main.py
```

---

## Development

### Adding New Intent Types

1. Edit `task-manager-backend/ml/data/intents.json`:
```json
{
  "your-intent": {
    "keywords": ["keyword1", "keyword2", "..."],
    "confidence_threshold": 0.6
  }
}
```

2. Add templates in `subtask_templates.json`:
```json
{
  "your-intent": [
    ["Step 1", "Step 2", "Step 3", ...]
  ]
}
```

3. Retrain the model (if using custom classifier)

### Collecting Feedback

The feedback system stores user corrections to improve the ML model over time:

```python
# Data stored in: task-manager-backend/ml/data/feedback.json
{
  "task_description": "...",
  "predicted_intent": "development",
  "confidence": 0.87,
  "generated_subtasks": ["...", "..."],
  "final_subtasks": ["...", "..."],
  "timestamp": "2026-04-17T10:30:00Z"
}
```

---

## Performance Optimization

### For Production

**ML Service (multiple workers):**
```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

**Backend (with caching):**
```bash
npm install redis
# Add Redis caching in ai.service.js
```

**Frontend (build for production):**
```bash
cd task-manager-frontend
npm run build
# Serves optimized build
```

---

## Monitoring

### Check Service Status

```bash
# ML Service health
curl http://127.0.0.1:8000/docs

# Backend health
curl http://localhost:5000/

# Frontend
Open http://localhost:3000 in browser
```

### View Logs

**ML Service:** Terminal where uvicorn is running
**Backend:** `npm start` terminal
**Frontend:** Browser console (F12)

---

## Support & Issues

For issues or questions:

1. Check the troubleshooting section above
2. Review the terminal output for error messages
3. Check browser console (F12 → Console tab)
4. Verify all services are running before testing

---

## Next Steps

✅ ML model integration complete  
✅ Frontend can generate AI subtasks  
✅ Backend saves subtasks to database  
✅ Feedback system ready for collection  

**Optional Enhancements:**
- [ ] Fine-tune ML model with collected feedback
- [ ] Add more intent types
- [ ] Implement Redis caching for faster responses
- [ ] Deploy to production (Docker, etc.)
- [ ] Add mobile app support

---

## License

Part of the Task Manager project. All rights reserved.
