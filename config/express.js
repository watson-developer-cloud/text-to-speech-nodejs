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
var express    = require('express'),
  favicon      = require('serve-favicon'),
  errorhandler = require('errorhandler'),
  secure       = require('express-secure-only'),
  bodyParser   = require('body-parser');

module.exports = function (app) {
  app.enable('trust proxy');

  var env = process.env.NODE_ENV || 'development';
  if ('production' === env) {
    console.log('redirect http to https');
    app.use(secure());
    app.use(errorhandler());
  }

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Setup static public directory
  app.use(express.static(__dirname + '/../public'));

  app.use(favicon(__dirname + '/../public/images/favicon.ico'));


  var rateLimit = require('express-rate-limit');
  var limiter = rateLimit({
    windowMs: 20 * 1000, // seconds
    delayMs: 0,
    max: 3,
    global: false
  });

  // apply to all requests that begin with /api/
  app.use('/api/', limiter);

};
