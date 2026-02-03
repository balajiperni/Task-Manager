from fastapi import FastAPI
from pydantic import BaseModel
from rules import generate_subtasks

app = FastAPI(title="Subtask Generator Service")

class TaskInput(BaseModel):
    description: str

@app.post("/generate-subtasks")
def generate(task: TaskInput):
    subtasks = generate_subtasks(task.description)
    return {
        "count": len(subtasks),
        "subtasks": subtasks
    }
