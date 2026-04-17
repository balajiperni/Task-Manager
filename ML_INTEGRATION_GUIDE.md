# ML Model Integration Guide

## Architecture Overview

The ML model integration allows your task manager to automatically generate intelligent subtasks using AI. The architecture consists of:

1. **ML Service** (`ml-service/` or `task-manager-backend/ml/`)
   - FastAPI server running on port 8000
   - Trained intent classifier and subtask generator
   - Provides `/generate-subtasks` endpoint

2. **Backend Service** (`task-manager-backend/src/`)
   - Node.js/Express server running on port 5000
   - Proxies ML requests through `/api/ai/suggest`
   - Integrates with database for task and subtask management

3. **Frontend** (`task-manager-frontend/`)
   - React application with Chakra UI
   - AI subtask generation in Task creation modals and pages
   - Real-time UI updates with loading states

---

## Getting Started

### Prerequisites
- Python 3.8+ (for ML service)
- Node.js 16+ (for backend and frontend)
- PyTorch and transformers (installed via requirements)

### Step 1: Start the ML Service

```bash
cd task-manager-backend/ml
# or: cd ml-service

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app:app --reload --port 8000
```

**Output:** You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

### Step 2: Start the Backend Service

```bash
cd task-manager-backend

# Install dependencies (if not already done)
npm install

# Start server on port 5000
npm start
# or: node src/server.js
```

**Output:** Backend running on `http://localhost:5000`

### Step 3: Start the Frontend

```bash
cd task-manager-frontend

# Install dependencies (if not already done)
npm install

# Start React development server
npm start
```

**Output:** Frontend running on `http://localhost:3000`

---

## API Endpoints

### Generate Subtasks (During Task Creation)
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
    ...
  ]
}
```

### Generate and Save Subtasks (For Existing Task)
```
POST /api/ai/tasks/{taskId}/generate-subtasks
Headers: Authorization: Bearer {token}
Body: {
  "description": "Task description for better accuracy"
}
Response: {
  "success": true,
  "message": "Subtasks generated & saved",
  "task": {
    "id": 1,
    "title": "...",
    "subtasks": [...]
  }
}
```

---

## Features

### 1. AI Subtask Generation During Task Creation
- Available in **Create Task Modal**
- Users can:
  - Enter task title and description
  - Click "Generate" to get AI-suggested subtasks
  - Review suggestions before saving
  - Manually edit or add subtasks

### 2. Confidence-Based Generation
- **High Confidence (>50%)**: Uses trained templates
- **Low Confidence**: Falls back to generic subtasks
- Intent detection includes:
  - Project planning
  - Learning tasks
  - Software development
  - And more...

### 3. Feedback Learning System
```
POST /api/ai/feedback
Body: {
  "description": "Original task description",
  "predictedIntent": "development",
  "confidence": 0.85,
  "generatedSubtasks": ["...", "..."],
  "finalSubtasks": ["...", "..."]  // User's final choice
}
```

---

## Troubleshooting

### ML Service Not Available
```
Error: ML service unavailable
```
**Solution:**
1. Check ML service is running on port 8000
2. Run: `curl http://127.0.0.1:8000/docs` (should show Swagger UI)
3. Check Python environment has all dependencies

### Slow Subtask Generation
- First request may be slower (model loading)
- Subsequent requests should be < 1 second
- Consider running ML service in production with uvicorn workers: `uvicorn app:app --workers 4`

### Frontend Not Showing Generate Button
1. Ensure backend is running on port 5000
2. Check browser console for API errors
3. Verify token is valid (check auth middleware)

### Database Errors
- Ensure Prisma migrations are up to date: `npx prisma migrate deploy`
- Check database connection in `backend/src/config/prisma.js`

---

## File Structure Reference

```
ML Components:
├── task-manager-backend/ml/
│   ├── app.py                              # FastAPI server
│   ├── core/
│   │   ├── intent_classifier.py            # Intent prediction
│   │   ├── subtask_generator.py            # Subtask generation
│   │   ├── feedback_learner.py             # Learns from user feedback
│   │   └── ...
│   ├── data/
│   │   ├── intents.json                    # Intent definitions
│   │   ├── subtask_templates.json          # Subtask templates
│   │   └── feedback.json                   # Learning data
│   └── requirements.txt

Backend Integration:
├── task-manager-backend/src/
│   ├── services/ai.service.js              # ML API client
│   ├── controllers/ai.controller.js        # Route handlers
│   ├── routes/ai.routes.js                 # Route definitions
│   └── ...

Frontend Integration:
├── task-manager-frontend/src/
│   ├── components/CreateTaskModal.jsx      # Modal with AI gen
│   ├── pages/Tasks.jsx                     # Tasks page with AI gen
│   ├── services/api.js                     # API client
│   └── ...
```

---

## Development Tips

### Testing the ML Service Directly
```bash
curl -X POST http://127.0.0.1:8000/generate-subtasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Build a website"}'
```

### Checking ML Service Logs
- FastAPI debug output shows in terminal where `uvicorn` is running
- Check request/response times for performance monitoring

### Monitoring Task Creation Flow
1. Open browser DevTools (F12)
2. Go to Network tab
3. Create a task with AI subtask generation
4. Monitor requests to:
   - `POST /api/ai/suggest` (suggestion request)
   - `POST /api/tasks` (task creation)

---

## Next Steps

1. ✅ Start all three services (ML, Backend, Frontend)
2. ✅ Navigate to Tasks page
3. ✅ Create a new task and test "Generate" button
4. ✅ Verify subtasks are displayed correctly
5. ✅ Create task and save subtasks to database
6. (Optional) Collect user feedback to improve ML model

---

## Performance Optimization

For production deployment:
```bash
# ML Service with multiple workers
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4 --reload

# Backend caching (optional)
# Add Redis caching for frequently generated subtasks
```

## Support

For issues or questions about the ML integration:
1. Check the troubleshooting section above
2. Review logs in the ML service terminal
3. Check API responses in browser DevTools
