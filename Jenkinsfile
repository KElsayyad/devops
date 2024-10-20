pipeline {
    agent any
    stages {
        stage('Master Branch'){
            stages{
                stage('checkout') {
                    steps {
                        slackSend channel: '#jenkins-notifications', color: 'warning', message: "Build Started: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: 'slack-webook'
                        git credentialsId: 'github-yat-project', url: 'https://github.com/souzi-nada/reading-recommendations'    
                    }
                }
                stage('build') {
                    steps {
                        nodejs('node-23') {
                        //   sh 'rm -rf node_modules && node --trace-warnings ... '
                          sh 'npm install'
                        }
                    }
                }
                // stage('test'){
                //     steps{
                //       nodejs('node-23') {
                //           sh 'npm test'
                //         }
                //     }
                // }
                stage('deploy'){
                    when {
                        expression { env.BRANCH_NAME == 'master' }
                    }
                    steps {
                        timeout(activity: true, time: 10) {
                            slackSend channel: '#jenkins-notifications', message: '@channel Kindly approve or decline the manual trigger 1'
                            input 'Do you want to deploy?'
                            slackSend channel: '#jenkins-notifications', message: '@channel Thanks for Approval'
                        }
                        sh "docker build -t suzy90/reading-recommendations:${env.BUILD_NUMBER} ."
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-repo', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                            sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                            sh "docker push suzy90/reading-recommendations:${env.BUILD_NUMBER}"
                        }
                    }
                }
                    }
            
        }
    }
    post {
      // only triggered when blue or green sign
      success {
          slackSend channel: '#jenkins-notifications', color: 'good', message: "Build Succeeded: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: 'slack-webook'
      }
      // triggered when red sign
      failure {
          slackSend channel: '#jenkins-notifications', color: 'danger', message: "Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\n(${env.BUILD_URL})", notifyCommitters: true, tokenCredentialId: 'slack-webook'
      }
      // trigger every-works
    //   always {
    //       slackSend ...
    //   }
    }
}
