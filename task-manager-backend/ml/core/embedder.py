# ml/semantic/embedder.py

from sentence_transformers import SentenceTransformer

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(self, texts):
        """
        texts: list[str]
        returns: list of vectors
        """
        return self.model.encode(texts, convert_to_tensor=True)
