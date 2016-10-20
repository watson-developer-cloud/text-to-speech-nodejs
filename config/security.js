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


// security.js
const secure = require('express-secure-only');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

module.exports = function (app) {
  // 1. redirects http to https
  app.use(secure());

  // 2. helmet with custom CSP header
  const cspReportUrl = '/report-csp-violation';
  app.use(helmet({
    contentSecurityPolicy: {
      // Specify directives as normal.
      directives: {
        defaultSrc: ["'self'"], // default value for unspecified directives that end in -src
        scriptSrc: ["'self'", 'www.google-analytics.com'], // jquery cdn, etc. try to avid "'unsafe-inline'"
        styleSrc: ["'self'", "'unsafe-inline'"], // no inline css
        imgSrc: ["'self'", 'www.google-analytics.com'], // should be "'self'" and possibly 'data:' for most apps
        frameAncestors: [], // parent iframes
        formAction: ["'self'"], // where can forms submit to
        reportUri: cspReportUrl,
      },

      // Set to true if you only want browsers to report errors, not block them.
      // You may also set this to a function(req, res) in order to decide dynamically
      // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
      reportOnly: false,

      // Set to true if you want to blindly set all headers: Content-Security-Policy,
      // X-WebKit-CSP, and X-Content-Security-Policy.
      setAllHeaders: false,

      // Set to true if you want to disable CSP on Android where it can be buggy.
      disableAndroid: false,

      // Set to false if you want to completely disable any user-agent sniffing.
      // This may make the headers less compatible but it will be much faster.
      // This defaults to `true`.
      browserSniff: true,
    },
  }));
  // endpoint to report CSP violations
  app.post(cspReportUrl, (req, res) => {
    // eslint-disable-next-line no-console
    console.log('Content Security Policy Violation:\n', req.body);
    res.status(204).send(); // 204 = No Content
  });

  // 4. rate limiting
  const limiter = rateLimit({
    windowMs: 60 * 1000, // seconds
    delayMs: 0,
    max: 10,
    message: JSON.stringify({
      error: 'Too many requests, please try again in 30 seconds.',
      code: 429,
    }),
  });
  app.use('/api/', limiter);
};
