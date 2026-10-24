
import json
import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "phi3:mini"


def generate_subtasks(task_description, number_of_subtasks=5):
    """Generate task subtasks using Phi-3 through Ollama."""

    if not isinstance(task_description, str) or not task_description.strip():
        raise ValueError("Task description cannot be empty.")

    prompt = f"""
You are an assistant for a task management application.

Break the task below into exactly {number_of_subtasks}
clear, actionable subtasks.

Task: {task_description}

Requirements:
- Return only a valid JSON array.
- Each item must be an object containing a "title" string.
- Make each subtask specific and useful.
- Do not include markdown or explanations.
- Do not repeat subtasks.

Example:
[
  {{"title": "Define project requirements"}},
  {{"title": "Design the database schema"}}
]
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False,
            "format": "json",
            "options": {"temperature": 0.2}
        },
        timeout=180
    )

    response.raise_for_status()
    result = response.json()
    content = result["message"]["content"]

    # Parse and validate the generated JSON.
    subtasks = json.loads(content)

    if isinstance(subtasks, dict):
        # Handle a JSON object that wraps the array.
        subtasks = subtasks.get("subtasks")

    if not isinstance(subtasks, list) or not subtasks:
        raise ValueError("Phi-3 returned no valid subtasks.")

    cleaned = []

    for item in subtasks:
        if not isinstance(item, dict):
            continue

        title = item.get("title")

        if isinstance(title, str) and title.strip():
            cleaned.append({"title": title.strip()})

    if not cleaned:
        raise ValueError("Phi-3 returned no valid subtask titles.")

    return [item["title"] for item in cleaned]
