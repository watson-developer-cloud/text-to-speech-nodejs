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

  // TODO: change to production server when released
  this._url = options && options.url || 'https://stream-s.watsonplatform.net/text-to-speech-beta/api/v1';
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

  console.log('speak utterance this', utterance);

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
  // xhr.setRequestHeader('X-WDC-PL-OPT-OUT', sessionPermissionsQueryParam);
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

},{"./SpeechSynthesis":1,"./SpeechSynthesisErrorEvent":2,"./SpeechSynthesisEvent":3,"./SpeechSynthesisUtterance":4,"./SpeechSynthesisVoice":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5ucG0vbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibGliL3NwZWVjaHN5bnRoZXNpcy9TcGVlY2hTeW50aGVzaXMuanMiLCJsaWIvc3BlZWNoc3ludGhlc2lzL1NwZWVjaFN5bnRoZXNpc0Vycm9yRXZlbnQuanMiLCJsaWIvc3BlZWNoc3ludGhlc2lzL1NwZWVjaFN5bnRoZXNpc0V2ZW50LmpzIiwibGliL3NwZWVjaHN5bnRoZXNpcy9TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UuanMiLCJsaWIvc3BlZWNoc3ludGhlc2lzL1NwZWVjaFN5bnRoZXNpc1ZvaWNlLmpzIiwibGliL3V0aWxzLmpzIiwibGliL3NwZWVjaHN5bnRoZXNpcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUgSUJNIENvcnAuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqXG4gKiBTcGVlY2hTeW50aGVzaXMgcHJvdG90eXBlIHBlciBXM0MgU3BlZWNoIHNwZWM6XG4gKiBodHRwczovL2R2Y3MudzMub3JnL2hnL3NwZWVjaC1hcGkvcmF3LWZpbGUvdGlwL3dlYnNwZWVjaGFwaS5odG1sXG4gKlxuICogQGF1dGhvciBFcmljIFMuIEJ1bGxpbmd0b24gPGVzYnVsbGluQHVzLmlibS5jb20+XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IF91cmwgIGltcGxlbWVudGF0aW9uLXNwZWNpZmljcmVzb3VyY2UgVVJMXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5zZXJpYWxpemVRdWVyeVN0cmluZyxcbiAgICBTcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50ID0gcmVxdWlyZSgnLi9TcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50JyksXG4gICAgU3BlZWNoU3ludGhlc2lzVm9pY2UgPSByZXF1aXJlKCcuL1NwZWVjaFN5bnRoZXNpc1ZvaWNlJyk7XG5cbmZ1bmN0aW9uIFNwZWVjaFN5bnRoZXNpcyAob3B0aW9ucykge1xuXG4gIC8vIFRPRE86IGNoYW5nZSB0byBwcm9kdWN0aW9uIHNlcnZlciB3aGVuIHJlbGVhc2VkXG4gIHRoaXMuX3VybCA9IG9wdGlvbnMgJiYgb3B0aW9ucy51cmwgfHwgJ2h0dHBzOi8vc3RyZWFtLXMud2F0c29ucGxhdGZvcm0ubmV0L3RleHQtdG8tc3BlZWNoLWJldGEvYXBpL3YxJztcbiAgdGhpcy5fYXBpX2tleSA9IG9wdGlvbnMuYXBpX2tleTtcbiAgdGhpcy5fYXVkaW9FbGVtZW50ID0gb3B0aW9ucy5hdWRpb0VsZW1lbnQ7XG4gIHRoaXMuX3ZvaWNlcyA9IFtdO1xuXG4gIGlmICghU1BFRUNIX1NZTlRIRVNJU19WT0lDRVMpIHtcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHRoaXMuX3VybCArICcvdm9pY2VzJywgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtV2F0c29uLUF1dGhvcml6YXRpb24tVG9rZW4nLCB0aGlzLl9hcGlfa2V5KTtcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgdGhpcy5fdm9pY2VzID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS52b2ljZXM7XG4gICAgICAgIHRoaXMub252b2ljZXNjaGFuZ2VkKCk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIHhoci5zZW5kKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRW11bGF0ZSBhc3luYyBjYWxsLCBzaW5jZSB2b2ljZXMgYXJlIGF2YWlsYWJsZVxuICAgIC8vIG9uIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3ZvaWNlcyA9IFNQRUVDSF9TWU5USEVTSVNfVk9JQ0VTLnZvaWNlcztcbiAgICAgIHRoaXMub252b2ljZXNjaGFuZ2VkKCk7XG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgfVxuXG59XG5cbi8vIFNwZWVjaFN5bnRoZXNpcyBtZXRob2RzXG5cbi8qKlxuICpcbiAqIEF0dGFjaGVzIEhUTUxBdWRpb0VsZW1lbnQgKGllLCA8YXVkaW8+IGVsZW1lbnQpXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdWRpb0VsZW1lbnQgSFRNTEF1ZGlvRWxlbWVudCAoaWUsIDxhdWRpbz4gZWxlbWVudClcbiAqXG4gKi9cblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUuY3JlYXRlTWVkaWFFbGVtZW50U291cmNlID0gZnVuY3Rpb24oYXVkaW9FbGVtZW50KSB7XG4gIHRoaXMuX2F1ZGlvRWxlbWVudCA9IGF1ZGlvRWxlbWVudDtcbn07XG5cbi8qKlxuICpcbiAqIEdldHMgYXZhaWxhYmxlIHZvaWNlIG1vZGVscywgZW1wdHkgYXJyYXkgdW50aWwgb252b2ljZWNoYW5nZWQgaGFzIGJlZW4gY2FsbGVkXG4gKiBAcmV0dXJuIHthcnJheX0gYXJyYXkgb2YgU3BlZWNoU3ludGhlc2lzVm9pY2Ugb2JqZWN0c1xuICpcbiAqL1xuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5nZXRWb2ljZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGksIHZvaWNlT3B0aW9ucywgc3BlZWNoU3ludGhlc2lzVm9pY2UsXG4gICAgICBzcGVlY2hTeW50aGVzaXNWb2ljZUNvbGxlY3Rpb24gPSBbXSxcbiAgICAgIHZvaWNlcyA9IHRoaXMuX3ZvaWNlcztcbiAgZm9yIChpPTA7IGkgPCB2b2ljZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2b2ljZU9wdGlvbnMgPSB2b2ljZXNbaV07XG4gICAgc3BlZWNoU3ludGhlc2lzVm9pY2UgPSBuZXcgU3BlZWNoU3ludGhlc2lzVm9pY2Uodm9pY2VPcHRpb25zKTtcbiAgICBzcGVlY2hTeW50aGVzaXNWb2ljZS5sb2NhbFNlcnZpY2UgPSBmYWxzZTtcbiAgICBzcGVlY2hTeW50aGVzaXNWb2ljZUNvbGxlY3Rpb24ucHVzaChzcGVlY2hTeW50aGVzaXNWb2ljZSk7XG4gIH1cbiAgcmV0dXJuIHNwZWVjaFN5bnRoZXNpc1ZvaWNlQ29sbGVjdGlvbjtcbn07XG5cblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUuc3BlYWsgPSBmdW5jdGlvbih1dHRlcmFuY2UpIHtcblxuICB2YXIgbmV3T2JqID0ge307XG4gIGZvciAodmFyIHByb3AgaW4gdXR0ZXJhbmNlKSB7XG4gICAgaWYgKHByb3AgPT09ICdkb3dubG9hZCcgfHwgcHJvcCA9PT0gJ29uZG93bmxvYWRwcm9ncmVzcycgfHwgcHJvcCA9PT0gJ3N0YXJ0Jykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIG5ld09ialtwcm9wXSA9IHV0dGVyYW5jZVtwcm9wXTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKCdzcGVhayB1dHRlcmFuY2UgdGhpcycsIHV0dGVyYW5jZSk7XG5cbiAgLy8gU2Vzc2lvbiBwZXJtaXNzaW9uc1xuICBmdW5jdGlvbiB3aXRoRGVmYXVsdCh2YWwsIGRlZmF1bHRWYWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0VmFsIDogdmFsO1xuICB9XG4gIHZhciBzZXNzaW9uUGVybWlzc2lvbnMgPSB3aXRoRGVmYXVsdCh1dHRlcmFuY2Uuc2Vzc2lvblBlcm1pc3Npb25zLCBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZXNzaW9uUGVybWlzc2lvbnMnKSkpO1xuICB2YXIgc2Vzc2lvblBlcm1pc3Npb25zUXVlcnlQYXJhbSA9IHNlc3Npb25QZXJtaXNzaW9ucyA/ICcwJyA6ICcxJztcblxuXG4gIC8vIEZvcm0gVVJMXG4gIHZhciB1cmwgPSB0aGlzLl91cmwgKyAnL3N5bnRoZXNpemU/JyArIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nKG5ld09iaik7XG5cbiAgLy8gSWYgdGhlIHVzZXIgc2V0cyBhbiBhdWRpbyBzb3VyY2UgdmlhIHRoZSBjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UgbWV0aG9kXG4gIC8vIHNldCB0aGF0IGVsZW1lbnQncyBzb3VyY2UgdG8gdGhlIFVSTFxuICAvLyBUaGlzIGlzIHRoZSBvbmx5IHdheSB0byBwcmVzZW50bHkgc3RyZWFtIGNodW5rZWQgbWVkaWFcbiAgLy8gc2luY2UgdGhlIGFsdGVybmF0aXZlLCBYTUxIdHRwUmVxdWVzdCwgbXVzdCB3YWl0IHVudGlsIHRoZSBkYXRhIGlzIGZ1bGx5IGxvYWRlZFxuICAvLyBpZiAodGhpcy5fYXVkaW9FbGVtZW50KSB7XG4gIC8vICAgdGhpcy5fYXVkaW9FbGVtZW50LnNyYyA9IHVybDtcbiAgLy8gICByZXR1cm47XG4gIC8vIH1cblxuICB2YXIgYXVkaW8gPSB0aGlzLl9hdWRpb0VsZW1lbnQgfHwgbmV3IEF1ZGlvKCk7XG5cbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtV2F0c29uLUF1dGhvcml6YXRpb24tVG9rZW4nLCB0aGlzLl9hcGlfa2V5KTtcbiAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtV0RDLVBMLU9QVC1PVVQnLCBzZXNzaW9uUGVybWlzc2lvbnNRdWVyeVBhcmFtKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIGlmIChhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnJykubGVuZ3RoID4gMCkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXVkaW8vb2dnOyBjb2RlY3M9b3B1c1wiKTtcbiAgfSBlbHNlIGlmIChhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykubGVuZ3RoID4gMCkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXVkaW8vd2F2XCIpO1xuICB9IGVsc2Uge1xuICAgIHZhciBldnQgPSBuZXcgU3BlZWNoU3ludGhlc2lzRXJyb3JFdmVudCgnYXVkaW8taGFyZHdhcmUnLCAnTm8gYXBwcm9wcmlhdGUgYXVkaW8gcGxheWVyIGlzIGF2YWlsYWJsZSBvbiB5b3VyIGJyb3dzZXIgZm9yIFNwZWVjaFN5bnRoZXNpcyBhdWRpbycpO1xuICAgIHRoaXMuZXJyb3IoZXZ0KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJztcbiAgeGhyLm9ucHJvZ3Jlc3MgPSB1dHRlcmFuY2Uub25kb3dubG9hZHByb2dyZXNzO1xuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge3R5cGU6ICdhdWRpby9vZ2cnfSk7XG4gICAgICB2YXIgb2JqZWN0VVJMID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgIGlmICh1dHRlcmFuY2UuZG93bmxvYWQpIHtcbiAgICAgICAgdmFyIGFuY2hvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGFuY2hvckVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgb2JqZWN0VVJMKTtcbiAgICAgICAgYW5jaG9yRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgJ3R0c3NhbXBsZS5vZ2cnKTtcbiAgICAgICAgYW5jaG9yRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBhbmNob3JFbGVtZW50LmNsaWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF1ZGlvLnNyYyA9IG9iamVjdFVSTDtcbiAgICAgIGF1ZGlvLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKG9iamVjdFVSTCk7XG4gICAgICB9O1xuICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgdXR0ZXJhbmNlLnN0YXJ0KCk7XG4gICAgfVxuICB9O1xuICB4aHIuc2VuZCgpO1xufTsgXG5cbi8qKlxuICpcbiAqIEF0dGFjaGVzIEhUTUxBdWRpb0VsZW1lbnQgKGllLCA8YXVkaW8+IGVsZW1lbnQpXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdWRpb0VsZW1lbnQgSFRNTEF1ZGlvRWxlbWVudCAoaWUsIDxhdWRpbz4gZWxlbWVudClcbiAqXG4gKi9cblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUuY3JlYXRlTWVkaWFFbGVtZW50U291cmNlID0gZnVuY3Rpb24oYXVkaW9FbGVtZW50KSB7XG4gIHRoaXMuX2F1ZGlvRWxlbWVudCA9IGF1ZGlvRWxlbWVudDtcbn07XG5cblxuLy8gRnVuY3Rpb25zIHVzZWQgZm9yIHNwZWVjaCBzeW50aGVzaXMgIGV2ZW50cyBsaXN0ZW5lcnMuXG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLm9udm9pY2VzY2hhbmdlZCA9IGZ1bmN0aW9uKCkge307IFxuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge307XG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge307XG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24oKSB7fTtcblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHt9O1xuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbigpIHt9O1xuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5tYXJrID0gZnVuY3Rpb24oKSB7fTtcblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUuYm91bmRhcnkgPSBmdW5jdGlvbigpIHt9O1xuXG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLm9udm9pY2VzY2hhbmdlZCA9IGZ1bmN0aW9uKCkge307IFxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwZWVjaFN5bnRoZXNpcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUgSUJNIENvcnAuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICpcbiAqIEVycm9yIHByb3RvdHlwZVxuICogQGF1dGhvciBFcmljIFMuIEJ1bGxpbmd0b24gPGVzYnVsbGluQHVzLmlibS5jb20+XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvciBjb2RlIGluZGljYXRpbmcgd2hhdCB3ZW50IHdyb25nXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFNwZWVjaFN5bnRoZXNpc0Vycm9yRXZlbnQoZXJyb3IsIG1lc3NhZ2UpIHtcbiAgdGhpcy5lcnJvciA9IGVycm9yO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwZWVjaFN5bnRoZXNpc0Vycm9yRXZlbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbiBcbiAvKipcbiAqXG4gKiBTcGVlY2hTeW50aGVzaXMgZXZlbnQgcHJvdG90eXBlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdXRob3IgRXJpYyBTLiBCdWxsaW5ndG9uIDxlc2J1bGxpbkB1cy5pYm0uY29tPlxuICogQHBhcmFtIHtTdHJpbmd9IHV0dGVyYW5jZSB0aGF0IHRyaWdnZXJlZCB0aGUgZXZlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjaGFySW5kZXggb2YgdGhlIHNwZWFraW5nIHBvc2l0aW9uIGluIG9yaWdpbmFsIHV0dGVyYW5jZSBzdHJpbmdcbiAqIEBwYXJhbSB7TnVtYmVyfSBlbGFwc2VkVGltZSBcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG9mIG1hcmtlciAoU1NNTClcbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTcGVlY2hTeW50aGVzaXNFdmVudChfb3B0aW9ucykge1xuXHR2YXIgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXHR0aGlzLnV0dGVyYW5jZSA9IG9wdGlvbnMudXR0ZXJhbmNlO1xuXHR0aGlzLmNoYXJJbmRleCA9IG9wdGlvbnMuY2hhckluZGV4O1xuXHR0aGlzLmVsYXBzZWRUaW1lID0gb3B0aW9ucy5lbGFwc2VkVGltZTtcblx0dGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNwZWVjaFN5bnRoZXNpc0V2ZW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUgSUJNIENvcnAuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqXG4gKiBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UgcHJvdG90eXBlXG4gKiBAYXV0aG9yIEVyaWMgUy4gQnVsbGluZ3RvbiA8ZXNidWxsaW5AdXMuaWJtLmNvbT5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgdG8gYmUgc3ludGhlc2l6ZWQgYW5kIHNwb2tlbiBmb3IgdGhpcyB1dHRlcmFuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBsYW5nIGxhbmd1YWdlIG9mIHRoZSBzcGVlY2ggc3ludGhlc2lzIGZvciB0aGUgdXR0ZXJhbmNlLCB1c2luZyBCQ1AgNDcgdGFnXG4gKiBAcGFyYW0ge1N0cmluZ30gZG93bmxvYWQgZG93bmxvYWQgZmlsZVxuICogQHBhcmFtIHtOdW1iZXJ9IHZvaWNlIFxuICogQHBhcmFtIHtOdW1iZXJ9IHZvbHVtZSBcbiAqIEBwYXJhbSB7TnVtYmVyfSByYXRlIFxuICogQHBhcmFtIHtOdW1iZXJ9IHBpdGNoIFxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZShvcHRpb25zKSB7XG4gIHRoaXMudGV4dCA9IG9wdGlvbnMudGV4dDtcbiAgdGhpcy5kb3dubG9hZCA9IHR5cGVvZiBvcHRpb25zLmRvd25sb2FkID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogb3B0aW9ucy5kb3dubG9hZDtcbiAgdGhpcy5sYW5nID0gb3B0aW9ucy5sYW5nO1xuICB0aGlzLnZvaWNlID0gb3B0aW9ucy52b2ljZSB8fCAnZW4tVVNfTWljaGFlbFZvaWNlJztcbiAgdGhpcy52b2x1bWUgPSBvcHRpb25zLnZvbHVtZTtcbiAgdGhpcy5yYXRlID0gb3B0aW9ucy5yYXRlO1xuICB0aGlzLnBpdGNoID0gb3B0aW9ucy5waXRjaDtcbn1cblxuU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge307XG5TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UucHJvdG90eXBlLm9uZG93bmxvYWRwcm9ncmVzcyA9IGZ1bmN0aW9uKCkge307XG5TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UucHJvdG90eXBlLmRvd25sb2FkID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSBJQk0gQ29ycC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICpcbiAqIFNwZWVjaFN5bnRoZXNpc1ZvaWNlIHByb3RvdHlwZVxuICogQGF1dGhvciBFcmljIFMuIEJ1bGxpbmd0b24gPGVzYnVsbGluQHVzLmlibS5jb20+XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBfb3B0aW9ucyBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB2b2ljZVVSSSBwb2ludHMgdG8gcmVtb3RlIElCTSB0ZXh0LXRvLXNwZWVjaCBlbmRwb2ludFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgYXR0cmlidXRlIGlzIGEgaHVtYW4tcmVhZGFibGUgbmFtZSB0aGF0IHJlcHJlc2VudHMgdGhlIHZvaWNlXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFuZyBhdHRyaWJ1dGUgaXMgYSBCQ1AgNDcgbGFuZ3VhZ2UgdGFnIGluZGljYXRpbmcgdGhlIGxhbmd1YWdlIG9mIHRoZSB2b2ljZVxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsU2VydmljZSBhbHdheXMgZmFsc2UgZm9yIHRoaXMgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkZWZhdWx0IGF0dHJpYnV0ZSB0aGF0IGlzIHRydWUgZm9yIGF0IG1vc3Qgb25lIHZvaWNlIHBlciBsYW5ndWFnZVxuICogQHBhcmFtIHtTdHJpbmd9IF9nZW5kZXIgaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgZXh0ZW5zaW9uIGluZGljYXRpbmcgdm9pY2UncyBnZW5kZXJcbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTcGVlY2hTeW50aGVzaXNWb2ljZShfb3B0aW9ucykge1xuXHR2YXIgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXHR0aGlzLnZvaWNlVVJJID0gb3B0aW9ucy51cmw7XG5cdHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcblx0dGhpcy5sYW5nID0gb3B0aW9ucy5sYW5ndWFnZTtcblx0dGhpcy5sb2NhbFNlcnZpY2UgPSBmYWxzZTtcblx0dGhpcy5kZWZhdWx0ID0gb3B0aW9ucy5kZWZhdWx0IHx8IGZhbHNlO1xuXHR0aGlzLl9nZW5kZXIgPSBvcHRpb25zLmdlbmRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcGVlY2hTeW50aGVzaXNWb2ljZTsiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IDIwMTQgSUJNIENvcnAuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5zZXJpYWxpemVRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdmFyIHBhcmFtcyA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pO1xuICAgIHJlc3VsdHMucHVzaChwYXJhbXMpO1xuICB9XG4gIHJldHVybiByZXN1bHRzLmpvaW4oXCImXCIpO1xufTtcbiIsIlxud2luZG93LlNwZWVjaFN5bnRoZXNpcyA9IHJlcXVpcmUoJy4vU3BlZWNoU3ludGhlc2lzJyk7XG53aW5kb3cuU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlID0gcmVxdWlyZSgnLi9TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UnKTtcbndpbmRvdy5TcGVlY2hTeW50aGVzaXNFdmVudCA9IHJlcXVpcmUoJy4vU3BlZWNoU3ludGhlc2lzRXZlbnQnKTtcbndpbmRvdy5TcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50ID0gcmVxdWlyZSgnLi9TcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50Jyk7XG53aW5kb3cuU3BlZWNoU3ludGhlc2lzVm9pY2UgPSByZXF1aXJlKCcuL1NwZWVjaFN5bnRoZXNpc1ZvaWNlJyk7XG4iXX0=
