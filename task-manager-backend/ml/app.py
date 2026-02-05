from fastapi import FastAPI
from pydantic import BaseModel
from core.subtask_generator import generate_subtasks

app = FastAPI()

class TaskInput(BaseModel):
    description: str

@app.post("/generate-subtasks")
def generate(task: TaskInput):
    return generate_subtasks(task.description)
