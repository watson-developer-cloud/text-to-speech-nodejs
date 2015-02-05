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

var request = require('request').defaults({ strictSSL: false});

/**
 * Text to Speech API Wrapper
 *
 * @param {[type]} options the context where 'auth' and 'url' are
 */
function TextToSpeech(options) {
  this._options = options || {};
  this.url = options.url.replace(/\/$/, '');
  this.auth = 'Basic ' + new Buffer(options.username + ':' + options.password).toString('base64');
}

TextToSpeech.prototype.synthesize = function(params) {
  var options = {
    method: 'GET',
    url: this.url + '/v1/synthesize',
    qs: params,
    headers: {
      'Authorization': this.auth,
      'Accept': 'audio/ogg; codecs=opus'
    }
  };

  return request(options);
};


module.exports = TextToSpeech;