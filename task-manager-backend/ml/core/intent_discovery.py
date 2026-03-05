from sklearn.cluster import KMeans
from utils.file_loader import load_json, save_json
from utils.embeddings import embed_texts

FEEDBACK_FILE = "data/feedback.json"
INTENTS_FILE = "data/intents.json"

MIN_CLUSTER_SIZE = 3

def discover_new_intents():
    feedback = load_json(FEEDBACK_FILE)
    intents = load_json(INTENTS_FILE)

    generic_items = [
        f["description"]
        for f in feedback
        if f["predictedIntent"] == "generic"
    ]

    if len(generic_items) < MIN_CLUSTER_SIZE:
        return False

    embeddings = embed_texts(generic_items)

    k = min(3, len(generic_items))
    kmeans = KMeans(n_clusters=k, n_init=10)
    labels = kmeans.fit_predict(embeddings.cpu().numpy())

    clusters = {}
    for label, desc in zip(labels, generic_items):
        clusters.setdefault(label, []).append(desc)

    new_intents = []

    for cluster in clusters.values():
        if len(cluster) >= MIN_CLUSTER_SIZE:
            new_intents.append({
                "intent": f"auto_intent_{len(intents) + len(new_intents)}",
                "examples": cluster
            })

    if new_intents:
        intents.extend(new_intents)
        save_json(INTENTS_FILE, intents)
        return True

    return False
