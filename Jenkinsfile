pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub_id' // Jenkins credentials ID
        DOCKER_IMAGE = 'kareemelsayyad/devops' // Docker image name
        DOCKER_TAG = 'latest' // Tag for the image
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your code from version control
                git 'https://github.com/KElsayyad/devops.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    // Log in to Docker Hub
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        // Push the image to Docker Hub
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
    }
}

