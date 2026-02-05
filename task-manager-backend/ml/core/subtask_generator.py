import random
from utils.file_loader import load_json
from core.semantic_matcher import detect_intent

templates = load_json("data/subtask_templates.json")

GENERIC_SUBTASKS = [
    "Understand the goal clearly",
    "Break the task into smaller steps",
    "Identify required resources",
    "Work on tasks step by step",
    "Review progress and improve"
]

CONFIDENCE_THRESHOLD = 0.45

def generate_subtasks(description: str):
    intent, confidence = detect_intent(description)

    # ✅ LOW CONFIDENCE → GENERIC FALLBACK
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "intent": "generic",
            "confidence": confidence,
            "subtasks": GENERIC_SUBTASKS
        }

    # ✅ EXTRA SAFETY CHECK (VERY IMPORTANT)
    if intent not in templates:
        return {
            "intent": "generic",
            "confidence": confidence,
            "subtasks": GENERIC_SUBTASKS
        }

    variant = random.choice(templates[intent])

    return {
        "intent": intent,
        "confidence": confidence,
        "subtasks": variant
    }
