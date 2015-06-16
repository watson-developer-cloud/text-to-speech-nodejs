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
  errorhandler = require('errorhandler'),
  bodyParser   = require('body-parser'),
  bluemix = require('./config/bluemix'),
  watson = require('watson-developer-cloud'),
  path = require('path'),
  // environmental variable points to demo's json config file
  // config = require(process.env.WATSON_CONFIG_FILE),
  config = JSON.parse(process.env.WATSON_CONFIG),
  extend = require('util')._extend;

// if bluemix credentials exists, then override local
var credentials = extend(config, bluemix.getServiceCreds('text_to_speech'));

// Create the service wrapper
var textToSpeech = new watson.text_to_speech(credentials);

// Setup static public directory
app.use(express.static(path.join(__dirname , './public')));

// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}

// render index page with voice options
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.get('/token', function(req, res) {
  textToSpeech.getToken({}, function(err, response, body) {
    res.send(body);
  })
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
