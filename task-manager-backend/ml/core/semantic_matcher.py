from sentence_transformers import util
from utils.file_loader import load_json
from utils.embeddings import embed_text, embed_texts

intents = load_json("data/intents.json")

def detect_intent(task_description: str):
    task_embedding = embed_text(task_description)

    best_intent = None
    best_score = 0.45

    for item in intents:
        examples = item["examples"]
        example_embeddings = embed_texts(examples)

        score = util.cos_sim(task_embedding, example_embeddings).max().item()

        if score > best_score:
            best_score = score
            best_intent = item["intent"]

    return best_intent, round(best_score, 3)
