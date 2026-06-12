import os
from flask import Blueprint, request, jsonify
from groq import Groq
from db import db

chat_bp = Blueprint('chat', __name__)

GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.1-70b-versatile')

SYSTEM_PROMPT = """You are TaskFlow Assistant, a helpful AI for a project and task management app.
You help users manage projects, tasks, priorities, deadlines, and Kanban board statuses (TODO, IN PROGRESS, DONE).
Be concise, friendly, and actionable. If asked about their data, use the context provided below.
If you don't have enough information, say so and suggest what they can do in the app."""


def _get_taskflow_context():
    projects = list(db.projects.find())
    tasks = list(db.tasks.find())

    project_lines = [
        f"- {p.get('name', 'Unnamed')} (id: {str(p['_id'])})"
        for p in projects
    ]
    task_lines = [
        f"- [{t.get('status', 'TODO')}] {t.get('title', 'Untitled')} "
        f"(priority: {t.get('priority', 'MEDIUM')}, project: {t.get('project_id', 'unknown')})"
        for t in tasks
    ]

    return (
        f"Projects ({len(projects)}):\n"
        + ("\n".join(project_lines) if project_lines else "  (none)")
        + f"\n\nTasks ({len(tasks)}):\n"
        + ("\n".join(task_lines) if task_lines else "  (none)")
    )


def _get_client():
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return None
    return Groq(api_key=api_key)


@chat_bp.route('/', methods=['POST'])
def chat():
    data = request.json
    if not data or not data.get('message', '').strip():
        return jsonify({"error": "Message is required"}), 400

    client = _get_client()
    if not client:
        return jsonify({"error": "Chat is not configured. Set GROQ_API_KEY in .env"}), 503

    user_message = data['message'].strip()
    history = data.get('history', [])

    messages = [
        {"role": "system", "content": f"{SYSTEM_PROMPT}\n\n--- Current TaskFlow Data ---\n{_get_taskflow_context()}"}
    ]

    for msg in history[-10:]:
        role = msg.get('role')
        content = msg.get('content', '').strip()
        if role in ('user', 'assistant') and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": user_message})

    try:
        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
        )
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": f"Failed to get AI response: {str(e)}"}), 500
