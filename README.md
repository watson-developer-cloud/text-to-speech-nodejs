# Text to Speech Demo [![Build Status](https://travis-ci.org/watson-developer-cloud/text-to-speech-nodejs.svg?branch=master)](http://travis-ci.org/watson-developer-cloud/text-to-speech-nodejs)

The IBM Watson [Text to Speech][service_url] service is designed for streaming, low latency, synthesis of audio from text. It is the inverse of the automatic speech recognition.

Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/watson-developer-cloud/text-to-speech-nodejs)

## Getting started

1. You need a Bluemix account. If you don't have one, [sign up][sign_up]. Experimental Watson Services are free to use.

1. Download and install the [Cloud-foundry CLI][cloud_foundry] tool if you haven't already.

1. Edit the `manifest.yml` file and change `<application-name>` to something unique. The name you use determines the URL of your application. For example, `<application-name>.mybluemix.net`.

	```yaml
  applications:
  - services:
    - my-text-to-speech
    name: <application-name>
    command: npm start
    path: .
    memory: 512M
	```

1. Connect to Bluemix with the command line tool.

	```sh
	$ cf api https://api.ng.bluemix.net
	$ cf login -u <your user ID>
	```

1. Create the Text to Speech service in Bluemix.

	```sh
	$ cf create-service text_to_speech standard my-text-to-speech
	```

1. Push your app to make it live:

	```sh
	$ cf push
	```

	For more details about developing applications that use Watson Developer Cloud services in Bluemix, see [Getting started with Watson Developer Cloud and Bluemix][getting_started].

## Running locally

1. Download and install [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.com/).

1. Create an instance of the Text to Speech service on Bluemix.

1. Configure the code to connect to your service:

	1. Copy the credentials from your Text to Speech service in Bluemix. Run the following command:

		```sh
		$ cf service-key my-text-to-speech Credentials-1
		```

		Example output:

		```sh
        {"password": "<password>",
		  "url": "<url>",
		  "username": "<username>"
		}
		```

	1. You can add that information to Rename `.env.example` to be `.env` and update it with `username`, `password`.

	```none
  TEXT_TO_SPEECH_USERNAME=
  TEXT_TO_SPEECH_PASSWORD=
  ```

1. Install the dependencies:

	```sh
	$ npm install
	```

1. Start the application:

	```sh
	npm start
	```

1. Point your browser to [http://localhost:3000](http://localhost:3000).


## Troubleshooting

* The main source of troubleshooting and recovery information is the Bluemix log. To view the log, run the following command:

  ```sh
  $ cf logs <application-name> --recent
  ```

* For more details about the service, see the [documentation][nlc_docs] for the Natural Language Classifier.


----

### Directory structure

```none
.
├── app.js                      // express routes
├── config                      // express configuration
│   ├── error-handler.js
│   ├── express.js
│   └── security.js
├── manifest.yml
├── package.json
├── public                      // static resources
├── server.js                   // entry point
├── test                        // unit tests
└── views                       // react components
```

## License

  This sample code is licensed under Apache 2.0.

## Contributing

  See [CONTRIBUTING](.github/CONTRIBUTING.md).

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

[deploy_track_url]: https://github.com/cloudant-labs/deployment-tracker
[cloud_foundry]: https://github.com/cloudfoundry/cli
[getting_started]: https://www.ibm.com/watson/developercloud/doc/getting_started/
[service_url]: http://www.ibm.com/watson/developercloud/text-to-speech.html
[sign_up]: https://console.ng.bluemix.net/registration/
