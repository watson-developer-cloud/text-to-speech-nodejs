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

'use strict';

// security.js
var secure  = require('express-secure-only'),
  rateLimit = require('express-rate-limit'),
  helmet    = require('helmet');

module.exports = function (app) {
  app.enable('trust proxy');

  // redirects http to https
  if (process.env.NODE_ENV === 'production') {
    app.use(secure());
  }

  // use the default helmet
  // see: https://www.npmjs.com/package/helmet
  console.log('activating helmet');
  app.use(helmet());

  var limiter = rateLimit({
    windowMs: 20 * 1000, // seconds
    delayMs: 0,
    max: 3,
    global: false
  });

  // apply to all requests that begin with /api
  app.use('/api', limiter);

};
