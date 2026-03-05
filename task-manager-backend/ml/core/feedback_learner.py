import json
from datetime import datetime
from utils.file_loader import load_json, save_json

FEEDBACK_FILE = "data/feedback.json"

def store_feedback(description, predicted_intent, confidence, generated, final):
    feedback = load_json(FEEDBACK_FILE)

    feedback.append({
        "description": description,
        "predictedIntent": predicted_intent,
        "confidence": confidence,
        "generatedSubtasks": generated,
        "finalSubtasks": final,
        "timestamp": datetime.utcnow().isoformat()
    })

    save_json(FEEDBACK_FILE, feedback)
