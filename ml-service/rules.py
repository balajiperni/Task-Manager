def generate_subtasks(description: str):
    subtasks = []

    desc = description.lower()

    if "auth" in desc or "login" in desc:
        subtasks.extend([
            "Design user schema",
            "Implement registration API",
            "Implement login API",
            "Hash passwords securely",
            "Generate JWT tokens",
            "Protect routes using middleware",
            "Test authentication flow"
        ])

    if "frontend" in desc or "ui" in desc:
        subtasks.extend([
            "Design UI layout",
            "Create components",
            "Connect APIs",
            "Handle errors",
            "Test UI flow"
        ])

    if not subtasks:
        subtasks = [
            "Analyze task requirements",
            "Break task into smaller steps",
            "Implement each step",
            "Test functionality",
            "Finalize task"
        ]

    return subtasks
