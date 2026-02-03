from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# Subtask knowledge base
TASK_LIBRARY = {
    "authentication system": [
        "Design user database schema",
        "Implement user registration",
        "Implement user login",
        "Hash passwords securely",
        "Generate JWT tokens",
        "Protect API routes",
        "Write authentication tests"
    ],
    "frontend development": [
        "Design UI wireframes",
        "Create reusable components",
        "Integrate backend APIs",
        "Handle validation and errors",
        "Test UI flows"
    ],
    "task management": [
        "Create task CRUD APIs",
        "Implement task status workflow",
        "Add priority handling",
        "Track task completion",
        "Add analytics"
    ]
}

# Precompute embeddings
task_keys = list(TASK_LIBRARY.keys())
task_embeddings = model.encode(task_keys)


def generate_subtasks_ml(description: str):
    desc_embedding = model.encode([description])

    similarities = cosine_similarity(desc_embedding, task_embeddings)[0]
    best_match_idx = np.argmax(similarities)

    return TASK_LIBRARY[task_keys[best_match_idx]]
