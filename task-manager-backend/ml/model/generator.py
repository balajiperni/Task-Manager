from .matcher import find_best_match

def generate_subtasks(description: str):
    subtasks = find_best_match(description)

    if subtasks:
        return subtasks

    # fallback (generic decomposition)
    return [
        "Understand the task requirements",
        "Break task into smaller steps",
        "Prioritize steps",
        "Execute each step",
        "Review and finalize"
    ]
