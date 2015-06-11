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
	// environmental variable points to demo's json config file
	config = require(process.env.WATSON_CONFIG_FILE),
  extend = require('util')._extend;

// if bluemix credentials exists, then override local
var credentials = extend(config, bluemix.getServiceCreds('text_to_speech'));

// Create the service wrapper
var textToSpeech = new watson.text_to_speech(credentials);

// Configure express
require('./config/express')(app, textToSpeech);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
