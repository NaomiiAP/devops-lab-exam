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
1. **Clone**: Pulls the repository from SCM.
2. **Install Dependencies**: Installs Python and Node.js dependencies.
3. **Build**: Builds the frontend production bundle.
4. **Test**: Runs backend and frontend tests.
5. **Deploy**: Starts the application using Docker Compose.

*Note: The pipeline uses actual shell commands but assumes the necessary tools (Python, Node, Docker) are installed on the Jenkins agent.*
