/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
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

var express = require('express'),
  app = express(),
  bluemix = require('./config/bluemix'),
  watson = require('watson-developer-cloud'),
  extend = require('util')._extend;

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials = extend({
  version: 'v1',
  username: '<username>',
  password: '<password>',
  headers: { 'Accept': 'audio/ogg; codecs=opus' }
}, bluemix.getServiceCreds('text_to_speech')); // VCAP_SERVICES

// Create the service wrapper
var textToSpeech = new watson.text_to_speech(credentials);

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/synthesize', function(req, res) {
  var transcript = textToSpeech.synthesize(req.query);

  transcript.on('response', function(response) {
    console.log(response.headers);
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.pipe(res);
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
