//pipeline
pipeline {
    agent any 

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub_id' // Jenkins credentials ID
        DOCKER_IMAGE = 'kareemelsayyad/devops' // Docker image name
        DOCKER_TAG = "${env.BUILD_NUMBER}" // Tag for the image
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

        stage('Testing') {
            steps {
                withCredentials([string(credentialsId: 'DB_CONNECTION_STRING', variable: 'ENV_PROD')]) {
                    sh 'echo "DB_CONNECTION_STRING = ${ENV_PROD}" >> .env.testing'
                }
                script {
                    try {
                        nodejs('node-18') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE' // Mark build as failure
                        error("Tests failed: ${e}") // Stop the pipeline
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { currentBuild.result != 'FAILURE' } // Only proceed if tests passed
            }
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
            when {
                expression { currentBuild.result != 'FAILURE' } // Only proceed if tests passed
            }
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

        stage('Deploy Locally') {
            when {
                expression { currentBuild.result != 'FAILURE' } // Only proceed if tests passed
            }
            steps {
                withCredentials([string(credentialsId: 'DB_CONNECTION_STRING', variable: 'ENV_PROD')]) {
                    script {
                        // Stop and remove any existing container
                        sh 'docker stop my_container || true'
                        sh 'docker rm my_container || true'
    
                        // Run the new container
                        sh "docker run -d -p 3000:3000 --name my_container -e DB_CONNECTION_STRING=${ENV_PROD} ${DOCKER_IMAGE}:${DOCKER_TAG}"
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
