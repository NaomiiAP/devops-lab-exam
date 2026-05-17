from flask import Blueprint, request, jsonify
from db import db
from bson.objectid import ObjectId

tasks_bp = Blueprint('tasks', __name__)

# Valid statuses
VALID_STATUSES = ['TODO', 'IN PROGRESS', 'DONE']

# Get All Tasks
@tasks_bp.route('/tasks', methods=['GET'])
def get_all_tasks():
    tasks = list(db.tasks.find())
    for t in tasks:
        t['id'] = str(t['_id'])
        del t['_id']
    return jsonify(tasks)

# Add Task
@tasks_bp.route('/projects/<project_id>/tasks', methods=['POST'])
def add_task(project_id):
    data = request.json
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400
    
    status = data.get('status', 'TODO')
    if status not in VALID_STATUSES:
        return jsonify({"error": "Invalid status"}), 400
        
    task = {
        "title": data['title'],
        "priority": data.get('priority', 'MEDIUM'),
        "status": status,
        "deadline": data.get('deadline', ''),
        "project_id": project_id
    }
    result = db.tasks.insert_one(task)
    task['id'] = str(result.inserted_id)
    del task['_id']
    return jsonify(task), 201

# Get Tasks by Project
@tasks_bp.route('/projects/<project_id>/tasks', methods=['GET'])
def get_tasks(project_id):
    tasks = list(db.tasks.find({"project_id": project_id}))
    for t in tasks:
        t['id'] = str(t['_id'])
        del t['_id']
    return jsonify(tasks)

# Update Task Status
@tasks_bp.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    data = request.json
    if not data or 'status' not in data:
        return jsonify({"error": "Status is required"}), 400
        
    status = data['status']
    if status not in VALID_STATUSES:
        return jsonify({"error": "Invalid status"}), 400
    
    try:
        result = db.tasks.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": status}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Task not found"}), 404
        
        return jsonify({"message": "Task updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete Task
@tasks_bp.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    try:
        result = db.tasks.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Task not found"}), 404
        return jsonify({"message": "Task deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
