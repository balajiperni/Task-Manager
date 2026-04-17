import random
from core.intent_classifier import predict_intent
from utils.file_loader import load_json

TEMPLATES = load_json("data/subtask_templates.json")

GENERIC_SUBTASKS = [
    "Understand the goal clearly",
    "Break the task into smaller steps",
    "Identify required resources",
    "Prioritize the steps",
    "Work step by step",
    "Review progress and adjust"
]

CONFIDENCE_THRESHOLD = 0.50

def generate_subtasks(description: str):
    intent, confidence = predict_intent(description)

    # 🔴 LOW CONFIDENCE → GENERIC
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "intent": "generic",
            "confidence": confidence,
            "subtasks": GENERIC_SUBTASKS,
            "source": "fallback"
        }

    # 🔴 Intent not in templates → GENERIC
    if intent not in TEMPLATES:
        return {
            "intent": "generic",
            "confidence": confidence,
            "subtasks": GENERIC_SUBTASKS,
            "source": "fallback"
        }

    # 🟢 HIGH CONFIDENCE → TEMPLATE
    variant = random.choice(TEMPLATES[intent])

    return {
        "intent": intent,
        "confidence": confidence,
        "subtasks": variant,
        "source": "ml+template"
    }
