from sentence_transformers import SentenceTransformer
from functools import lru_cache

# Lightweight, fast, free, CPU-friendly
MODEL_NAME = "all-MiniLM-L6-v2"

@lru_cache(maxsize=1)
def load_model():
    """
    Load model only once (cached).
    Prevents reloading on every request.
    """
    return SentenceTransformer(MODEL_NAME)

def embed_text(text: str):
    """
    Convert a single text into an embedding vector.
    """
    model = load_model()
    return model.encode(text, convert_to_tensor=True)

def embed_texts(texts: list[str]):
    """
    Convert multiple texts into embedding vectors.
    """
    model = load_model()
    return model.encode(texts, convert_to_tensor=True)
