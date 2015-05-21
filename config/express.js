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

module.exports = function (app, options) {

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

  // render index page
  app.get('/', function(req, res) {
    // textToSpeech.voices({}, function(err, data) {
    //   if (!err) {
    //     console.log('data', data);
    //     res.render('index', {result: 'success', data: data});
    //   } else {
    //     console.log('err', err);
    //     res.render('index', {result: 'error', data: null});
    //   }
    // })
    res.render('index');
  });

  app.post('/synthesize', function(req, res) {
    var req = request
      .get('https://stream.watsonplatform.net/text-to-speech-beta/api/v1/synthesize')
      .set('Accept', 'audio/ogg;codecs=opus')
      .auth(options.username, options.password)
      .query(req.body)
      .end(function(err, data) {
        console.log('data', data);
      });

    // params['Accept'] = 'audio/ogg;codecs=opus';
    // var transcript = textToSpeech.synthesize(params);
    // transcript.on('response', function(response) {
    //   response.headers['Mime-Type'] = 'audio/ogg; codecs=opus';
    //   if (req.query.download) {
    //     response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    //   }
    // });
    // res.headers['Content-Type'] = 'audio/ogg; codecs=opus';
    req.pipe(res);
  });

  // app.get('/synthesize', function(req, res) {
  //   var transcript = textToSpeech.synthesize(req.query);
  //   transcript.on('response', function(response) {
  //     response.headers['Mime-Type'] = 'audio/ogg; codecs=opus';
  //     if (req.query.download) {
  //       response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
  //     }
  //   });
  //   transcript.pipe(res);
  // });


};
