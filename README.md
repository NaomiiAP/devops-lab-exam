# TaskFlow

A modern full-stack project and task management system designed for simplicity and efficiency. This project is suitable for a university DevOps lab exam demonstration.

## Features

- **Project Management**: Create and delete projects.
- **Task Management**: Add tasks to projects, delete tasks.
- **Kanban Board**: Visualize tasks in 3 columns (To Do, In Progress, Done) with status updates.
- **Dashboard Analytics**: View statistics with Pie and Bar charts using Chart.js.
- **Responsive Design**: Clean and modern UI built with Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, Chart.js.
- **Backend**: Flask, Flask-CORS, PyMongo.
- **Database**: MongoDB Atlas (Cloud).
- **CI/CD & DevOps**: Docker, Docker Compose, Jenkins.

## Folder Structure

```text
├── backend/
│   ├── data/               # (Optional) Data directory
│   ├── routes/             # API routes (projects, tasks)
│   ├── app.py              # Flask entry point
│   ├── db.py               # MongoDB connection setup
│   ├── requirements.txt    # Python dependencies
│   └── test_app.py         # Dummy test for CI/CD
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard and Project View pages
│   │   ├── services/       # API service (api.js)
│   │   ├── App.jsx         # Main application component
│   │   └── index.css       # Tailwind directives
│   ├── Dockerfile          # Frontend Dockerfile
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite configuration
├── docker-compose.yml      # Multi-container setup
├── Jenkinsfile             # CI/CD pipeline script
└── README.md               # This file
```

## Installation Steps

### Local Setup

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Update `MONGO_URI` in `db.py` with your MongoDB Atlas connection string.
4. Run the app:
   ```bash
   python app.py
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Docker Setup

To run both services together using Docker Compose:

1. Update the `MONGO_URI` environment variable in `docker-compose.yml` with your connection string.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## Jenkins Pipeline Overview

The project includes a `Jenkinsfile` with the following stages:
1. **Git Version Check**: Verifies Git and prints the current commit.
2. **Dependency Check**: Installs and verifies Python and Node.js dependencies.
3. **Build**: Builds the frontend production bundle.
4. **Test**: Runs backend and frontend tests.
5. **Code Quality Check**: SonarQube scan and quality gate.
6. **Containerization**: Builds Docker images for backend and frontend.
7. **Host Image on Docker Hub**: Pushes images to `thatoneukie/taskflow-backend` and `thatoneukie/taskflow-frontend`.
8. **Deployment**: Starts the application using Docker Compose.

*Note: The pipeline uses actual shell commands but assumes the necessary tools (Python, Node, Docker, SonarScanner) are installed on the Jenkins agent.*

### Trigger on Git Push

1. In Jenkins, create a **Pipeline** or **Multibranch Pipeline** job and point it at this repo (`Jenkinsfile` in the root).
2. Under **Build Triggers**, enable **GitHub hook trigger for GITScm polling** (GitHub) or the equivalent webhook for your Git host.
3. Add a webhook in your Git provider that POSTs to `http://<jenkins-url>/github-webhook/` on every push.

Each push runs the full pipeline, including SonarQube analysis, so the dashboard stays up to date.

### SonarQube Setup (one-time)

SonarQube runs as a local install (extracted zip), not in Docker. Keep it running while Jenkins builds.

1. **Start SonarQube** from your extracted folder:
   - **Windows**: run `bin\windows-x86-64\StartSonar.bat`
   - **Linux/macOS**: run `bin/linux-x86-64/sonar.sh start` (or `macosx-x86-64` on Mac)

   Open `http://localhost:9000` (default login: `admin` / `admin`).

2. **Create a project** in SonarQube with key `taskflow` (must match `sonar-project.properties` and `SONAR_PROJECT_KEY` in the Jenkinsfile).

3. **Generate a token** in SonarQube: *My Account → Security → Generate Tokens*.

4. **Configure Jenkins**:
   - Install plugins: **SonarQube Scanner**, **SonarQube Quality Gates**.
   - *Manage Jenkins → System → SonarQube servers*: add server named `SonarQube`, URL `http://localhost:9000`, token from step 3.
   - *Manage Jenkins → Tools → SonarQube Scanner*: add tool named `SonarQubeScanner` (install automatically, or point to your extracted scanner zip).

After this, every git push triggers the pipeline and Jenkins sends fresh analysis results to your local SonarQube instance.
