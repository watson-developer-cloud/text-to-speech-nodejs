<h1 align="center" style="border-bottom: none;">🔊 Text to Speech Demo </h1>
<h3 align="center">Node.js sample applications that shows some of the the IBM Watson Text to Speech service features. </h3>
<p align="center">
  <a href="http://travis-ci.org/watson-developer-cloud/text-to-speech-nodejs">
    <img alt="Travis" src="https://travis-ci.org/watson-developer-cloud/text-to-speech-nodejs.svg?branch=master">
  </a>
  <a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
</p>
</p>

Text to Speech is designed for streaming, low latency, synthesis of audio from text. It is the inverse of the automatic speech recognition.

You can view a [demo][demo_url] of this app.


## Prerequisites

1. Sign up for an [IBM Cloud account](https://console.bluemix.net/registration/).
1. Download the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).
1. Create an instance of the Text to Speech service and get your credentials:
    - Go to the [Text to Speech](https://console.bluemix.net/catalog/services/text-to-speech) page in the IBM Cloud Catalog.
    - Log in to your IBM Cloud account.
    - Click **Create**.
    - Click **Show** to view the service credentials.
    - Copy the `apikey` value, or copy the `username` and `password` values if your service instance doesn't provide an `apikey`.
    - Copy the `url` value.

## Configuring the application

1. In the application folder, copy the *.env.example* file and create a file called *.env*

    ```
    cp .env.example .env
    ```

2. Open the *.env* file and add the service credentials that you obtained in the previous step.

    Example *.env* file that configures the `apikey` and `url` for a Text to Speech service instance hosted in the US East region:

    ```
    TEXT_TO_SPEECH_IAM_APIKEY=X4rbi8vwZmKpXfowaS3GAsA7vdy17Qh7km5D6EzKLHL2
    TEXT_TO_SPEECH_URL=https://stream-wdc.watsonplatform.net/text-to-speech/api
    ```

    - If your service instance uses `username` and `password` credentials, add the `TEXT_TO_SPEECH_USERNAME` and `TEXT_TO_SPEECH_PASSWORD` variables to the *.env* file.

    Example *.env* file that configures the `username`, `password`, and `url` for a Text to Speech service instance hosted in the Sydney region:

    ```
    TEXT_TO_SPEECH_USERNAME=522be-7b41-ab44-dec3-g1eab2ha73c6
    TEXT_TO_SPEECH_PASSWORD=A4Z5BdGENrwu8
    TEXT_TO_SPEECH_URL=https://gateway-syd.watsonplatform.net/text-to-speech/api
    ```

## Running locally

1. Install the dependencies

    ```
    npm install
    ```

1. Run the application

    ```
    npm start
    ```

1. View the application in a browser at `localhost:3000`

## Deploying to IBM Cloud as a Cloud Foundry Application

1. Login to IBM Cloud with the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview)

    ```
    ibmcloud login
    ```

1. Target a Cloud Foundry organization and space.

    ```
    ibmcloud target --cf
    ```

1. Edit the *manifest.yml* file. Change the **name** field to something unique. For example, `- name: my-app-name`.
1. Deploy the application

    ```
    ibmcloud app push
    ```

1. View the application online at the app URL, for example: https://my-app-name.mybluemix.net



## Directory structure

```none
.
├── app.js                      // express routes
├── config                      // express configuration
│   ├── error-handler.js
│   ├── express.js
│   └── security.js
├── manifest.yml
├── package.json
├── public                      // static resources
├── server.js                   // entry point
├── test                        // tests
└── views                       // react components
```

## License

  This sample code is licensed under Apache 2.0.

## Contributing

  See [CONTRIBUTING](./CONTRIBUTING.md).

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)


[service_url]: https://www.ibm.com/watson/services/text-to-speech/
[docs]: https://www.ibm.com/watson/developercloud/text-to-speech/api/v1/curl.html?curl
[sign_up]: https://console.bluemix.net/registration/?target=/catalog/services/text-to-speech/
[demo_url]: https://text-to-speech-demo.ng.bluemix.net