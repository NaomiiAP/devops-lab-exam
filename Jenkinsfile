pipeline {
    agent any

    stages {
        // Stage 1: Clone
        // This stage is usually handled automatically by Jenkins when pulling from Git.
        stage('Clone') {
            steps {
                echo 'Stage 1: Cloning repository...'
                // checkout scm
            }
        }

        // Stage 2: Install Dependencies
        stage('Install Dependencies') {
            steps {
                echo 'Stage 2: Installing dependencies...'
                sh '''
                    cd backend
                    pip install -r requirements.txt
                '''
                sh '''
                    cd frontend
                    npm install
                '''
            }
        }

        // Stage 3: Build
        stage('Build') {
            steps {
                echo 'Stage 3: Building application...'
                echo 'Backend: No-op for Python'
                sh '''
                    cd frontend
                    npm run build
                '''
            }
        }

        // Stage 4: Test
        stage('Test') {
            steps {
                echo 'Stage 4: Running tests...'
                sh '''
                    cd backend
                    python -m unittest discover
                '''
                sh '''
                    cd frontend
                    npm test
                '''
            }
        }

        // Stage 5: Deploy
        stage('Deploy') {
            steps {
                echo 'Stage 5: Deploying application...'
                sh '''
                    docker-compose up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
