from flask import Blueprint, request, jsonify
from db import db
from bson.objectid import ObjectId

projects_bp = Blueprint('projects', __name__)

# Get all projects
@projects_bp.route('/', methods=['GET'])
def get_projects():
    projects = list(db.projects.find())
    for p in projects:
        p['id'] = str(p['_id'])
        del p['_id']
    return jsonify(projects)

# Create a project
@projects_bp.route('/', methods=['POST'])
def create_project():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    project = {
        "name": data['name'],
        "description": data.get('description', '')
    }
    result = db.projects.insert_one(project)
    project['id'] = str(result.inserted_id)
    del project['_id']
    return jsonify(project), 201

# Delete a project
@projects_bp.route('/<id>', methods=['DELETE'])
def delete_project(id):
    try:
        result = db.projects.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Project not found"}), 404
        
        # Also delete tasks associated with this project
        db.tasks.delete_many({"project_id": id})
        
        return jsonify({"message": "Project deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
