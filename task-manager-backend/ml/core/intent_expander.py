from utils.file_loader import load_json, save_json

INTENTS_FILE = "data/intents.json"
FEEDBACK_FILE = "data/feedback.json"

CONFIDENCE_THRESHOLD = 0.35

def expand_intents_from_feedback():
    intents = load_json(INTENTS_FILE)
    feedback = load_json(FEEDBACK_FILE)

    intent_map = {i["intent"]: i for i in intents}

    updated = False

    for item in feedback:
        intent = item["predictedIntent"]
        desc = item["description"]
        confidence = item["confidence"]

        if (
            intent in intent_map
            and confidence >= CONFIDENCE_THRESHOLD
            and desc not in intent_map[intent]["examples"]
        ):
            intent_map[intent]["examples"].append(desc)
            updated = True

    if updated:
        save_json(INTENTS_FILE, list(intent_map.values()))

    return updated
