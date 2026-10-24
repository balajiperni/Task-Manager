
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.feedback_learner import store_feedback
from core.intent_classifier import predict_intent
from core.subtask_generator import generate_subtasks as generate_with_ml
from core.ollama_generator import generate_subtasks as generate_with_llm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Task Manager ML Service")

# Preserve cross-origin access for your frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskInput(BaseModel):
    description: str


class FeedbackRequest(BaseModel):
    description: str
    predictedIntent: str
    confidence: float
    generatedSubtasks: list[str]
    finalSubtasks: list[str]


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Task Manager ML Service"}


@app.post("/generate-subtasks")
def generate(task: TaskInput):
    description = task.description.strip()

    if not description:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail="Task description cannot be empty."
        )

    # Try Phi-3 first.
    try:
        subtasks = generate_with_llm(description, 5)

        if not subtasks:
            raise ValueError("LLM returned an empty subtask list.")

        # Keep the existing response metadata useful.
        try:
            intent, confidence = predict_intent(description)
        except Exception:
            intent, confidence = "llm_generated", 0.0

        logger.info("Subtasks generated using Phi-3.")

        return {
            "intent": intent,
            "confidence": confidence,
            "subtasks": subtasks,
            "source": "llm",
            "message": "Subtasks generated successfully using Phi-3."
        }

    except Exception as error:
        logger.warning(
            "Phi-3 generation failed; using existing ML fallback. Error: %s",
            error
        )

    # Fallback to the original semantic ML + template generator.
    try:
        result = generate_with_ml(description)

        result["source"] = "fallback"
        result["message"] = (
            "AI generation was unavailable, so the built-in "
            "task generator was used."
        )

        return result

    except Exception:
        logger.exception("Both Phi-3 and the ML fallback failed.")

        from fastapi import HTTPException
        raise HTTPException(
            status_code=503,
            detail="Subtask generation is temporarily unavailable."
        )


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
