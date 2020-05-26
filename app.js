const express = require('express');

const app = express();
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1.js');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
  version: '2018-04-05',
  authenticator: new IamAuthenticator({
    apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY || 'type-key-here',
  }),
  url: process.env.TEXT_TO_SPEECH_URL,
});

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

app.get('/', (req, res) => {
  res.render('index');
});

/**
 * Pipe the synthesize method
 */
app.get('/api/v3/synthesize', async (req, res, next) => {
  try {
    const { result } = await textToSpeech.synthesize(req.query);
    const transcript = result;
    transcript.on('response', (response) => {
      if (req.query.download) {
        response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
      }
    });
    transcript.on('error', next);
    transcript.pipe(res);
  } catch (error) {
    res.send(error);
  }
});

// Return the list of voices
app.get('/api/v2/voices', async (req, res, next) => {
  try {
    const { result } = textToSpeech.listVoices();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
