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

// Module dependencies
var request = require('superagent');
var express    = require('express'),
  errorhandler = require('errorhandler'),
  bodyParser   = require('body-parser');

module.exports = function (app, textToSpeech) {

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Setup static public directory
  app.use(express.static(__dirname + '/../public'));
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/../views');

  // Add error handling in dev
  if (!process.env.VCAP_SERVICES) {
    app.use(errorhandler());
  }

  // render index page with voice options
  app.get('/', function(req, res) {
    console.log('textToSpeech', textToSpeech);
    textToSpeech.voices({}, function(err, data) {
      if (!err) {
        res.render('index', {result: 'success', data: data});
      } else {
        res.render('index', {result: 'error', data: null});
      }
    })
  });

  app.post('/synthesize', function(req, res) {
    var transcript = textToSpeech.synthesize(req.body);
    transcript.on('response', function(response) {
      response.headers['Content-Type'] = 'audio/ogg; codecs=opus';
      if (req.query.download) {
        response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
      }
    });
    transcript.pipe(res);
  });

};