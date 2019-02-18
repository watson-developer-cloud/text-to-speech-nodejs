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

// Module dependencies
const express = require('express');
const bodyParser = require('body-parser');
const expressBrowserify = require('express-browserify');
const path = require('path');
const morgan = require('morgan');

module.exports = (app) => {
  app.enable('trust proxy');
  app.set('view engine', 'jsx');
  app.engine('jsx', require('express-react-views').createEngine());


  // Only loaded when running in IBM Cloud
  if (process.env.VCAP_APPLICATION) {
    require('./security')(app);
  }

  // automatically bundle the front-end js on the fly
  // note: this should come before the express.static since bundle.js is in the public folder
  const isDev = (app.get('env') === 'development');
  const browserifyier = expressBrowserify('./public/js/bundle.jsx', {
    watch: isDev,
    debug: isDev,
    extension: ['jsx'],
    transform: ['babelify'],
  });
  if (!isDev) {
    browserifyier.browserify.transform('uglifyify', { global: true });
  }
  app.get('/js/bundle.js', browserifyier);

  // Configure Express
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.static(path.join(__dirname, '..', 'node_modules/watson-react-components/dist/')));
  app.use(morgan('dev'));
};
