from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

# Load patterns
with open("data/task-patterns.json", "r", encoding="utf-8") as f:
    patterns = json.load(f)

class TaskRequest(BaseModel):
    description: str


@app.post("/generate-subtasks")
def generate_subtasks(req: TaskRequest):
    description = req.description.lower()
    matched_subtasks = []

    for pattern in patterns:
        examples = pattern.get("examples", [])
        subtasks = pattern.get("subtasks", [])

        for example in examples:
            if example.lower() in description:
                matched_subtasks = subtasks
                break

        if matched_subtasks:
            break

    # Fallback if nothing matches
    if not matched_subtasks:
        matched_subtasks = [
            "Understand the task clearly",
            "Break task into smaller steps",
            "Execute each step",
            "Review and complete"
        ]

    return {
        "subtasks": matched_subtasks
    }
