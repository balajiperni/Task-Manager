import os
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

from ml.utils.file_loader import load_json
from ml.utils.embeddings import embed_texts

# ---------------- PATHS ---------------- #

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # ml/
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

INTENTS_FILE = os.path.join(DATA_DIR, "intents.json")
MODEL_PATH = os.path.join(MODEL_DIR, "intent_classifier.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# --------------------------------------- #

def train():
    # Ensure models directory exists
    os.makedirs(MODEL_DIR, exist_ok=True)

    intents = load_json(INTENTS_FILE)

    texts = []
    labels = []

    for intent in intents:
        for example in intent["examples"]:
            texts.append(example)
            labels.append(intent["intent"])

    # Generate embeddings
    embeddings = embed_texts(texts).cpu().numpy()

    # Encode labels
    encoder = LabelEncoder()
    y = encoder.fit_transform(labels)

    # Train classifier
    model = LogisticRegression(max_iter=1000)
    model.fit(embeddings, y)

    # Save artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoder, ENCODER_PATH)

    print("✅ Intent classifier trained and saved")
    print(f"📦 Model saved at: {MODEL_PATH}")
    print(f"📦 Encoder saved at: {ENCODER_PATH}")

if __name__ == "__main__":
    train()
