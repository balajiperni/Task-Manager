import os
import joblib
import torch
from ml.utils.embeddings import embed_texts

# -------- PATHS -------- #

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # ml/
MODEL_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODEL_DIR, "intent_classifier.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# ----------------------- #

# Load once at startup (VERY IMPORTANT)
model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

def predict_intent(text: str):
    """
    Returns:
    - intent (str)
    - confidence (float)
    """

    embedding = embed_texts([text]).cpu().numpy()
    probs = model.predict_proba(embedding)[0]

    best_idx = probs.argmax()
    confidence = float(probs[best_idx])
    intent = label_encoder.inverse_transform([best_idx])[0]

    return intent, confidence
