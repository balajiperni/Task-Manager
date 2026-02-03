from fastapi import FastAPI
from pydantic import BaseModel
from model import generate_subtasks_ml

app = FastAPI(title="ML Subtask Generator")

class TaskInput(BaseModel):
    description: str

@app.post("/generate-subtasks")
def generate(task: TaskInput):
    subtasks = generate_subtasks_ml(task.description)
    return {
        "count": len(subtasks),
        "subtasks": subtasks
    }
