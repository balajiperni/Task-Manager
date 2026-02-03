import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .embedder import embed

with open("data/task-patterns.json") as f:
    TASK_PATTERNS = json.load(f)

# Precompute embeddings
pattern_embeddings = []
for pattern in TASK_PATTERNS:
    for example in pattern["examples"]:
        pattern_embeddings.append({
            "intent": pattern["intent"],
            "embedding": embed(example),
            "subtasks": pattern["subtasks"]
        })

def find_best_match(user_text: str, threshold=0.45):
    user_embedding = embed(user_text)

    best_score = 0
    best_subtasks = None

    for pattern in pattern_embeddings:
        score = cosine_similarity(
            [user_embedding],
            [pattern["embedding"]]
        )[0][0]

        if score > best_score:
            best_score = score
            best_subtasks = pattern["subtasks"]

    if best_score < threshold:
        return None

    return best_subtasks
