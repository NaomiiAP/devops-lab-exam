pipeline {
agent any

tools {
    jdk 'JDK'
}

environment {
    SCANNER_HOME = tool 'Sonar-scanner'
    DOCKERHUB_USERNAME = 'thatoneukie'
    BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/taskflow-backend"
    FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/taskflow-frontend"
}

stages {

    stage('Checkout Code') {
        steps {
            git branch: 'main', url: 'https://github.com/NaomiiAP/devops-lab-exam.git'
        }
    }

    stage('Git Version Check') {
        steps {
            bat 'git --version'
            bat 'git log -1 --oneline'
        }
    }

    stage('Install Dependencies') {
        steps {
            bat '''
                cd backend
                pip install -r requirements.txt
            '''

            bat '''
                cd frontend
                npm install
            '''
        }
    }

    stage('Dependency Check') {
        steps {
            dir('frontend') {
                dependencyCheck additionalArguments: '--scan . --disableYarnAudit', odcInstallation: 'DP'
            }

            dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
        }
    }

    stage('Build') {
        steps {
            bat '''
                cd frontend
                npm run build
            '''
        }
    }

    stage('Test') {
        steps {
            bat '''
                cd backend
                python -m unittest discover
            '''

            bat '''
                cd frontend
                npm test
            '''
        }
    }

    stage('Code Quality Check') {
        steps {
            script {
                withSonarQubeEnv('SonarQube-server') {
                    bat """
                    ${SCANNER_HOME}\\bin\\sonar-scanner ^
                    -Dsonar.projectName=devops-lab-exam ^
                    -Dsonar.projectKey=devops-lab-exam ^
                    -Dsonar.sources=backend,frontend/src ^
                    -Dsonar.exclusions=**/node_modules/**,**/__pycache__/**,**/dist/**
                    """
                }
            }
        }
    }

    stage('Containerization') {
        steps {
            bat "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
            bat "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend"
        }
    }

    stage('Host Image on Docker Hub') {
        steps {
            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {
                bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'

                bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                bat "docker push ${BACKEND_IMAGE}:latest"

                bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                bat "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
    }

    stage('Deployment') {
        steps {
            bat 'docker-compose up --build -d'
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