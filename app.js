/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint no-param-reassign: "off" */

const express = require('express');
const app = express();
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

// Bootstrap application settings
require('./config/express')(app);

const textToSpeech = new TextToSpeechV1({
  // If unspecified here, the TEXT_TO_SPEECH_USERNAME and
  // TEXT_TO_SPEECH_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
});

app.get('/', (req, res) => {
  res.render('index');
});

/**
 * Pipe the synthesize method
 */
app.get('/api/synthesize', (req, res, next) => {
  const transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', (response) => {
    if (req.query.download) {
      if (req.query.accept && req.query.accept === 'audio/wav') {
        response.headers['content-disposition'] = 'attachment; filename=transcript.wav';
      } else {
        response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
      }
    }
  });
  transcript.on('error', next);
  transcript.pipe(res);
});

// Return the list of voices
app.get('/api/voices', (req, res, next) => {
  textToSpeech.voices(null, (error, voices) => {
    if (error) {
      return next(error);
    }
    res.json(voices);
  });
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
