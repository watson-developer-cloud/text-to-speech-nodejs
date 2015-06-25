(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

/**
 *
 * SpeechSynthesis prototype per W3C Speech spec:
 * https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi.html
 *
 * @author Eric S. Bullington <esbullin@us.ibm.com>
 * @constructor
 * @param {Object} options configuration parameters
 * @param {String} _url  implementation-specificresource URL
 *
 */

'use strict';

var serializeQueryString = require('../utils').serializeQueryString,
    SpeechSynthesisErrorEvent = require('./SpeechSynthesisErrorEvent'),
    SpeechSynthesisVoice = require('./SpeechSynthesisVoice');

function SpeechSynthesis (options) {

  this._url = options && options.url || 'https://stream.watsonplatform.net/text-to-speech/api/v1';
  this._api_key = options.api_key;
  this._audioElement = options.audioElement;
  this._voices = [];

  if (!SPEECH_SYNTHESIS_VOICES) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this._url + '/voices', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");
    xhr.setRequestHeader('X-Watson-Authorization-Token', this._api_key);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        this._voices = JSON.parse(xhr.responseText).voices;
        this.onvoiceschanged();
      }
    }.bind(this);
    xhr.send();
  } else {
    // Emulate async call, since voices are available
    // on the global object
    setTimeout(function() {
      this._voices = SPEECH_SYNTHESIS_VOICES.voices;
      this.onvoiceschanged();
    }.bind(this), 0);
  }

}

// SpeechSynthesis methods

/**
 *
 * Attaches HTMLAudioElement (ie, <audio> element)
 * @param {Object} options configuration parameters
 * @param {String} audioElement HTMLAudioElement (ie, <audio> element)
 *
 */
SpeechSynthesis.prototype.createMediaElementSource = function(audioElement) {
  this._audioElement = audioElement;
};

/**
 *
 * Gets available voice models, empty array until onvoicechanged has been called
 * @return {array} array of SpeechSynthesisVoice objects
 *
 */
SpeechSynthesis.prototype.getVoices = function() {
  var i, voiceOptions, speechSynthesisVoice,
      speechSynthesisVoiceCollection = [],
      voices = this._voices;
  for (i=0; i < voices.length; i++) {
    voiceOptions = voices[i];
    speechSynthesisVoice = new SpeechSynthesisVoice(voiceOptions);
    speechSynthesisVoice.localService = false;
    speechSynthesisVoiceCollection.push(speechSynthesisVoice);
  }
  return speechSynthesisVoiceCollection;
};

SpeechSynthesis.prototype.speak = function(utterance) {

  var newObj = {};
  for (var prop in utterance) {
    if (prop === 'download' || prop === 'ondownloadprogress' || prop === 'start') {
      continue;
    }
    newObj[prop] = utterance[prop];
  }

  // Session permissions
  function withDefault(val, defaultVal) {
    return typeof val === 'undefined' ? defaultVal : val;
  }
  var sessionPermissions = withDefault(utterance.sessionPermissions, JSON.parse(localStorage.getItem('sessionPermissions')));
  var sessionPermissionsQueryParam = sessionPermissions ? '0' : '1';


  // Form URL
  var url = this._url + '/synthesize?' + serializeQueryString(newObj);

  // If the user sets an audio source via the createMediaElementSource method
  // set that element's source to the URL
  // This is the only way to presently stream chunked media
  // since the alternative, XMLHttpRequest, must wait until the data is fully loaded
  // if (this._audioElement) {
  //   this._audioElement.src = url;
  //   return;
  // }

  var audio = this._audioElement || new Audio();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('X-Watson-Authorization-Token', this._api_key);
  xhr.setRequestHeader('X-WDC-PL-OPT-OUT', sessionPermissionsQueryParam);
  xhr.withCredentials = true;
  if (audio.canPlayType('audio/ogg').length > 0) {
    xhr.setRequestHeader("Accept", "audio/ogg; codecs=opus");
  } else if (audio.canPlayType('audio/wav').length > 0) {
    xhr.setRequestHeader("Accept", "audio/wav");
  } else {
    var evt = new SpeechSynthesisErrorEvent('audio-hardware', 'No appropriate audio player is available on your browser for SpeechSynthesis audio');
    this.error(evt);
    return false;
  }
  xhr.responseType = 'blob';
  xhr.onprogress = utterance.ondownloadprogress;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var blob = new Blob([this.response], {type: 'audio/ogg'});
      var objectURL = URL.createObjectURL(blob);
      if (utterance.download) {
        var anchorElement = document.createElement('a');
        anchorElement.setAttribute('href', objectURL);
        anchorElement.setAttribute('download', 'ttssample.ogg');
        anchorElement.style.display = 'none';
        anchorElement.click();
        return;
      }
      audio.src = objectURL;
      audio.onload = function() {
        URL.revokeObjectURL(objectURL);
      };
      audio.play();
      utterance.start();
    }
  };
  xhr.send();
}; 

/**
 *
 * Attaches HTMLAudioElement (ie, <audio> element)
 * @param {Object} options configuration parameters
 * @param {String} audioElement HTMLAudioElement (ie, <audio> element)
 *
 */
SpeechSynthesis.prototype.createMediaElementSource = function(audioElement) {
  this._audioElement = audioElement;
};


// Functions used for speech synthesis  events listeners.
SpeechSynthesis.prototype.onvoiceschanged = function() {}; 
SpeechSynthesis.prototype.start = function() {};
SpeechSynthesis.prototype.end = function() {};
SpeechSynthesis.prototype.error = function() {};
SpeechSynthesis.prototype.pause = function() {};
SpeechSynthesis.prototype.resume = function() {};
SpeechSynthesis.prototype.mark = function() {};
SpeechSynthesis.prototype.boundary = function() {};

SpeechSynthesis.prototype.onvoiceschanged = function() {}; 

module.exports = SpeechSynthesis;
},{"../utils":6,"./SpeechSynthesisErrorEvent":2,"./SpeechSynthesisVoice":5}],2:[function(require,module,exports){
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


/**
 *
 * Error prototype
 * @author Eric S. Bullington <esbullin@us.ibm.com>
 * @constructor
 * @param {String} error code indicating what went wrong
 * @param {String} message
 *
 */

'use strict';

function SpeechSynthesisErrorEvent(error, message) {
  this.error = error;
  this.message = message;
}

module.exports = SpeechSynthesisErrorEvent;

},{}],3:[function(require,module,exports){
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
 
 /**
 *
 * SpeechSynthesis event prototype
 * @constructor
 * @author Eric S. Bullington <esbullin@us.ibm.com>
 * @param {String} utterance that triggered the event
 * @param {String} charIndex of the speaking position in original utterance string
 * @param {Number} elapsedTime 
 * @param {String} name of marker (SSML)
 *
 */

'use strict';

function SpeechSynthesisEvent(_options) {
	var options = _options || {};
	this.utterance = options.utterance;
	this.charIndex = options.charIndex;
	this.elapsedTime = options.elapsedTime;
	this.name = options.name;
}

module.exports = SpeechSynthesisEvent;
},{}],4:[function(require,module,exports){
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

/**
 *
 * SpeechSynthesisUtterance prototype
 * @author Eric S. Bullington <esbullin@us.ibm.com>
 * @constructor
 * @param {String} text to be synthesized and spoken for this utterance
 * @param {String} lang language of the speech synthesis for the utterance, using BCP 47 tag
 * @param {String} download download file
 * @param {Number} voice 
 * @param {Number} volume 
 * @param {Number} rate 
 * @param {Number} pitch 
 *
 */

'use strict';

function SpeechSynthesisUtterance(options) {
  this.text = options.text;
  this.download = typeof options.download === 'undefined' ? false : options.download;
  this.lang = options.lang;
  this.voice = options.voice || 'en-US_MichaelVoice';
  this.volume = options.volume;
  this.rate = options.rate;
  this.pitch = options.pitch;
}

SpeechSynthesisUtterance.prototype.start = function() {};
SpeechSynthesisUtterance.prototype.ondownloadprogress = function() {};
SpeechSynthesisUtterance.prototype.download = false;

module.exports = SpeechSynthesisUtterance;

},{}],5:[function(require,module,exports){
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

/**
 *
 * SpeechSynthesisVoice prototype
 * @author Eric S. Bullington <esbullin@us.ibm.com>
 * @constructor
 * @param {Object} _options configuration parameters
 * @param {String} voiceURI points to remote IBM text-to-speech endpoint
 * @param {String} name attribute is a human-readable name that represents the voice
 * @param {String} lang attribute is a BCP 47 language tag indicating the language of the voice
 * @param {String} localService always false for this implementation
 * @param {String} default attribute that is true for at most one voice per language
 * @param {String} _gender implementation-specific extension indicating voice's gender
 *
 */

'use strict';

function SpeechSynthesisVoice(_options) {
	var options = _options || {};
	this.voiceURI = options.url;
	this.name = options.name;
	this.lang = options.language;
	this.localService = false;
	this.default = options.default || false;
	this._gender = options.gender;
}

module.exports = SpeechSynthesisVoice;
},{}],6:[function(require,module,exports){
'use strict';

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

module.exports.serializeQueryString = function(obj) {
  var results = [];
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    if (typeof obj[key] === 'undefined') {
      continue;
    }
    var params = encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    results.push(params);
  }
  return results.join("&");
};

},{}],7:[function(require,module,exports){

window.SpeechSynthesis = require('./SpeechSynthesis');
window.SpeechSynthesisUtterance = require('./SpeechSynthesisUtterance');
window.SpeechSynthesisEvent = require('./SpeechSynthesisEvent');
window.SpeechSynthesisErrorEvent = require('./SpeechSynthesisErrorEvent');
window.SpeechSynthesisVoice = require('./SpeechSynthesisVoice');

},{"./SpeechSynthesis":1,"./SpeechSynthesisErrorEvent":2,"./SpeechSynthesisEvent":3,"./SpeechSynthesisUtterance":4,"./SpeechSynthesisVoice":5}]},{},[7]);
