from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.feedback_learner import store_feedback
from pydantic import BaseModel
from core.subtask_generator import generate_subtasks

app = FastAPI()

class TaskInput(BaseModel):
    description: str

@app.post("/generate-subtasks")
def generate(task: TaskInput):
    return generate_subtasks(task.description)

class FeedbackRequest(BaseModel):
    description: str
    predictedIntent: str
    confidence: float
    generatedSubtasks: list[str]
    finalSubtasks: list[str]

@app.post("/feedback")
def feedback(req: FeedbackRequest):
    store_feedback(
        req.description,
        req.predictedIntent,
        req.confidence,
        req.generatedSubtasks,
        req.finalSubtasks
    )
    return {"message": "Feedback saved"}
