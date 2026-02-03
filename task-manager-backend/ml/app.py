from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

class TaskInput(BaseModel):
    description: str

@app.post("/generate-subtasks")
def generate_subtasks(data: TaskInput):
    description = data.description.lower()

    with open("data/task-patterns.json") as f:
        patterns = json.load(f)

    subtasks = []

    for keyword, tasks in patterns.items():
        if keyword in description:
            subtasks.extend(tasks)

    if not subtasks:
        subtasks = [
            "Analyze task requirements",
            "Break task into smaller steps",
            "Execute subtasks sequentially"
        ]

    return {"subtasks": subtasks}
