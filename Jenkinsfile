pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub_id' // Jenkins credentials ID
        DOCKER_IMAGE = 'kareemelsayyad/devops' // Docker image name
        DOCKER_TAG = 'latest' // Tag for the image
        SLACK_CHANNEL = '#jenkins_notification' // Slack channel to send notifications
        SLACK_CREDENTIALS_ID = 'slack_new' // Jenkins credentials ID for Slack
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
		withCredentials([string(credentialsId: 'DB_CONNECTION_STRING', variable: 'ENV_PROD')]) {
                            sh 'echo "DB_CONNECTION_STRING = ${ENV_PROD}" >> .env.production'
                }
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
        success {
            script {
                // Send success notification to Slack
                slackSend(channel: "${SLACK_CHANNEL}", message: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
            }
        }
        failure {
            script {
                // Send failure notification to Slack
                slackSend(channel: "${SLACK_CHANNEL}", message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
            }
        }
        always {
            // Clean up workspace
            cleanWs()
        }
    }
}
