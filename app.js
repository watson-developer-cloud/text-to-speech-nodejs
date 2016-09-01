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
  watson       = require('watson-developer-cloud');


// Bootstrap application settings
require('./config/express')(app);

// For local development, replace username and password
var textToSpeech = watson.text_to_speech({
  version: 'v1',
  "password": "D36gqexZ1Hxl",
  "username": "b5be35d1-223e-42a1-bf3c-652678e7217c"
//  username: '<username>',
//  password: '<password>'
});

app.get('/api/synthesize', function(req, res, next) {
  let transcript = textToSpeech.synthesize(req.query, function(err,utterance) {
    if (err) {
      next(err);
    } else {
      if (req.query.download) {
	res.header['content-disposition'] = 'attachment; filename=transcript.ogg';
      }
      res.send(utterance);
    }});
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
