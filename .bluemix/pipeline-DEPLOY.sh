cf create-service text_to_speech standard my-text-to-speech
# Push app
export CF_APP_NAME="$CF_APP"
cf push "${CF_APP_NAME}"
