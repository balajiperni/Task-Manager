# 📋 Task Manager — AI-Powered Subtask Generator

A full-stack task management web application with an integrated ML model that automatically generates subtasks from a high-level task description.

---

## 🚀 Features

- **AI Subtask Generation** — Enter a task title/description and the ML model breaks it down into actionable subtasks automatically
- **Task Dashboard** — Create, update, delete, and track tasks with status management
- **User Authentication** — Secure login and registration system
- **Persistent Storage** — All tasks and subtasks stored in PostgreSQL
- **Responsive UI** — Clean React frontend with real-time updates

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | React.js                |
| Backend     | Node.js + Express.js    |
| Database    | PostgreSQL              |
| ML Service  | Python (subtask model)  |

---

## 📁 Project Structure

```
Task-Manager/
├── task-manager-frontend/     # React frontend
├── task-manager-backend/      # Node.js + Express API
├── ML_INTEGRATION_GUIDE.md    # How the ML model is integrated
├── INTEGRATION_SUMMARY.md     # Summary of all service connections
├── START_ALL_SERVICES.sh      # Linux startup script
└── START_ALL_SERVICES.bat     # Windows startup script
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/balajiperni/Task-Manager.git
cd Task-Manager
```

### 2. Set Up the Database

```bash
# Create a PostgreSQL database
createdb taskmanager

# Update connection config in task-manager-backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=your_user
DB_PASSWORD=your_password
```

### 3. Start All Services

**Linux/Mac:**
```bash
chmod +x START_ALL_SERVICES.sh
./START_ALL_SERVICES.sh
```

**Windows:**
```bat
START_ALL_SERVICES.bat
```

Or start each service manually:

```bash
# Backend
cd task-manager-backend
npm install
npm start

# Frontend
cd task-manager-frontend
npm install
npm start
```

---

## 🤖 ML Model — Subtask Generation

The integrated ML model accepts a task title or description as input and returns a list of suggested subtasks.

**Example:**

| Input (Task)             | Output (Subtasks)                                                        |
|--------------------------|--------------------------------------------------------------------------|
| "Build a login page"     | 1. Design UI mockup, 2. Create form component, 3. Add validation, 4. Connect to auth API |

See [`ML_INTEGRATION_GUIDE.md`](./ML_INTEGRATION_GUIDE.md) for full API details and model architecture.


## 🔮 Future Improvements

- [ ] Task priority prediction using ML
- [ ] Deadline suggestions based on task complexity
- [ ] Collaborative task sharing between users
- [ ] Mobile app (React Native)

---

## 👤 Author

**Balaji Perni**
- GitHub: [@balajiperni](https://github.com/balajiperni)
- LinkedIn: [linkedin.com/in/balajiperni](www.linkedin.com/in/balaji-perni)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
