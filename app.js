const express = require('express');

const app = express();
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

// Bootstrap application settings
require('./config/express')(app);

const getFileExtension = (acceptQuery) => {
  const accept = acceptQuery || '';
  switch (accept) {
    case 'audio/ogg;codecs=opus':
    case 'audio/ogg;codecs=vorbis':
      return 'ogg';
    case 'audio/wav':
      return 'wav';
    case 'audio/mpeg':
      return 'mpeg';
    case 'audio/webm':
      return 'webm';
    case 'audio/flac':
      return 'flac';
    default:
      return 'mp3';
  }
};

let textToSpeech;

if (process.env.TEXT_TO_SPEECH_IAM_APIKEY && process.env.TEXT_TO_SPEECH_IAM_APIKEY !== '') {
  textToSpeech = new TextToSpeechV1({
    url: process.env.TEXT_TO_SPEECH_URL || 'https://stream.watsonplatform.net/text-to-speech/api',
    iam_apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY || '<iam_apikey>',
    iam_url: 'https://iam.bluemix.net/identity/token',
  });
} else {
  textToSpeech = new TextToSpeechV1({
    url: process.env.TEXT_TO_SPEECH_URL || 'https://stream.watsonplatform.net/text-to-speech/api',
    username: process.env.TEXT_TO_SPEECH_USERNAME || '<username>',
    password: process.env.TEXT_TO_SPEECH_PASSWORD || '<password>',
  });
}

app.get('/', (req, res) => {
  res.render('index');
});

/**
 * Pipe the synthesize method
 */
app.get('/api/v1/synthesize', (req, res, next) => {
  const transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', (response) => {
    if (req.query.download) {
      response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
    }
  });
  transcript.on('error', next);
  transcript.pipe(res);
});

// Return the list of voices
app.get('/api/v1/voices', (req, res, next) => {
  textToSpeech.voices(null, (error, voices) => {
    if (error) {
      return next(error);
    }
    return res.json(voices);
  });
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
