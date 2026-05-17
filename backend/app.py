from flask import Flask
from flask_cors import CORS
from routes.projects import projects_bp
from routes.tasks import tasks_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(projects_bp, url_prefix='/api/projects')
app.register_blueprint(tasks_bp, url_prefix='/api')

@app.route('/')
def home():
    return {"message": "TaskFlow API is running"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
