import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def load_json(relative_path):
    path = BASE_DIR / relative_path
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(relative_path, data):
    path = BASE_DIR / relative_path
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
