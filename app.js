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
  request = require('request'),
  errorhandler = require('errorhandler'),
  bodyParser   = require('body-parser'),
  bluemix = require('./config/bluemix'),
  watson = require('watson-developer-cloud'),
  path = require('path'),
  // environmental variable points to demo's json config file
  config = JSON.parse(process.env.WATSON_CONFIG),
  extend = require('util')._extend;

// if bluemix credentials exists, then override local
var credentials = extend(config, bluemix.getServiceCreds('text_to_speech'));

console.log('Session config', credentials);

// Create the service wrapper
var textToSpeech = new watson.text_to_speech(credentials);

// Setup static public directory
app.use(express.static(path.join(__dirname , './public')));


// render index page with voice options
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// app.get('/token', function(req, res) {
//   textToSpeech.getToken({}, function(err, response, body) {
//     res.send(body);
//   })
// });
// Get token from Watson using your credentials
app.get('/token', function(req, res) {
    console.log('fetching token');
    request.get({'url': 
      'https://' 
        + credentials.hostname 
        + '/authorization/api/v1/token?url=' 
        + 'https://' + credentials.hostname + '/text-to-speech-beta/api',
      'auth': {
        'user': credentials.username,
        'pass': credentials.password,
        'sendImmediately': true
      }
    }, function(err, response, body) {
      res.send(body);
    }
    );
});

// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);

console.log('listening at:', port);

var http = require('http'),
    httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  req.headers['Authorization'] = 'Basic ' + new Buffer(process.env.BASIC_AUTH_STAGING).toString('base64');
  proxy.web(req, res, { target: 'https://stream-s.watsonplatform.net', secure: false });

  res.oldWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    /* add logic to change headers here */
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', '*');

    // old way: might not work now
    // as headers param is not always provided
    // https://github.com/nodejitsu/node-http-proxy/pull/260/files
    // headers['foo'] = 'bar';       

    res.oldWriteHead(statusCode, headers);
  }
  // and then proxy the request.
  var auth = 'Basic ' + new Buffer(process.env.BASIC_AUTH_STAGING).toString('base64');
  console.log('auth header', auth);
  req.headers['Authorization'] = 'Basic ' + new Buffer(process.env.BASIC_AUTH_STAGING).toString('base64');
  proxy.web(req, res, { target: 'https://stream-s.watsonplatform.net', secure: false });

});

console.log("listening on port 8000")
server.listen(8000);
