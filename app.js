/**
 * Copyright 2014, 2015 IBM Corp. All Rights Reserved.
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

'use strict';

var express    = require('express'),
  app          = express(),
  errorhandler = require('errorhandler'),
  bluemix      = require('./config/bluemix'),
  watson       = require('watson-developer-cloud'),
  extend       = require('util')._extend;

// For local development, put username and password in config
// or store in your environment
var credentialsBackup = {
  //url: 'https://stream.watsonplatform.net/text-to-speech/api',
  url: 'https://stream-s.watsonplatform.net/text-to-speech/api',
  version: 'v1',
  //username: '<username>',
  //password: '<password>',
  //username: '99b82716-2c7c-451a-819a-77b83458866c',
  //password: 'NgnoDOh4E3Wz'
  username: 'bdb86865-60a4-4e42-bfa8-4c91dfd583d2',
  password: 'L3MIsuh4AGpz',
  use_vcap_services: false    
};

//var credentials = extend(credentialsBackup, bluemix.getServiceCreds('text_to_speech'));
var credentials = credentialsBackup;

// Create the service wrappers
var textToSpeech = watson.text_to_speech(credentials);
var authorization = watson.authorization(credentials);

// Setup static public directory
app.use(express.static('./public'));

// Get token from Watson using your credentials
app.get('/token', function(req, res) {
  authorization.getToken({url: credentials.url}, function(err, token) {
    if (err) {
      console.log('error:', err);
      res.status(err.code);
    }

    res.send(token);
  });
});

app.get('/synthesize', function(req, res) {
  var transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', function(response) {
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.on('error', function(error) {
    console.log('Synthesize error: ', error)
  });
  transcript.pipe(res);
});


// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);

console.log('listening at:', port);
