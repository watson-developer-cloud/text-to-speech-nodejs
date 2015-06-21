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
  console.log('speak utterance this', utterance);
  var xhr = new XMLHttpRequest();
  var download = utterance.download;
  delete utterance.download;
  var url = this._url + '/synthesize?' + serializeQueryString(utterance);
  // If the user sets an audio source via the createMediaElementSource method
  // set that element's source to the URL
  // This is the only way to presently stream chunked media
  // since the alternative, XMLHttpRequest, must wait until the data is fully loaded
  // if (this._audioElement) {
  //   this._audioElement.src = url;
  //   return;
  // }
  var audio = this._audioElement || new Audio();
  xhr.open('GET', url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader('X-Watson-Authorization-Token', this._api_key);
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
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var blob = new Blob([this.response], {type: 'audio/ogg'});
      var objectURL = URL.createObjectURL(blob);
      if (download) {
        var anchorElement = document.createElement('a');
        anchorElement.setAttribute('href', objectURL);
        anchorElement.setAttribute('download', 'ttssample.ogg');
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

function SpeechSynthesisUtterance(_options) {
  var options = _options || {};
  this.text = options.text;
  this.download = options.download || false;
  this.lang = options.lang;
  this.voice = options.voice || 'en-US_MichaelVoice';
  this.volume = options.volume;
  this.rate = options.rate;
  this.pitch = options.pitch;
}

SpeechSynthesisUtterance.prototype.start = function() {};

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5ucG0vbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibGliL3NwZWVjaHN5bnRoZXNpcy9TcGVlY2hTeW50aGVzaXMuanMiLCJsaWIvc3BlZWNoc3ludGhlc2lzL1NwZWVjaFN5bnRoZXNpc0Vycm9yRXZlbnQuanMiLCJsaWIvc3BlZWNoc3ludGhlc2lzL1NwZWVjaFN5bnRoZXNpc0V2ZW50LmpzIiwibGliL3NwZWVjaHN5bnRoZXNpcy9TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UuanMiLCJsaWIvc3BlZWNoc3ludGhlc2lzL1NwZWVjaFN5bnRoZXNpc1ZvaWNlLmpzIiwibGliL3V0aWxzLmpzIiwibGliL3NwZWVjaHN5bnRoZXNpcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKlxuICogU3BlZWNoU3ludGhlc2lzIHByb3RvdHlwZSBwZXIgVzNDIFNwZWVjaCBzcGVjOlxuICogaHR0cHM6Ly9kdmNzLnczLm9yZy9oZy9zcGVlY2gtYXBpL3Jhdy1maWxlL3RpcC93ZWJzcGVlY2hhcGkuaHRtbFxuICpcbiAqIEBhdXRob3IgRXJpYyBTLiBCdWxsaW5ndG9uIDxlc2J1bGxpbkB1cy5pYm0uY29tPlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBfdXJsICBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpY3Jlc291cmNlIFVSTFxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzZXJpYWxpemVRdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4uL3V0aWxzJykuc2VyaWFsaXplUXVlcnlTdHJpbmcsXG4gICAgU3BlZWNoU3ludGhlc2lzRXJyb3JFdmVudCA9IHJlcXVpcmUoJy4vU3BlZWNoU3ludGhlc2lzRXJyb3JFdmVudCcpLFxuICAgIFNwZWVjaFN5bnRoZXNpc1ZvaWNlID0gcmVxdWlyZSgnLi9TcGVlY2hTeW50aGVzaXNWb2ljZScpO1xuXG5mdW5jdGlvbiBTcGVlY2hTeW50aGVzaXMgKG9wdGlvbnMpIHtcblxuICAvLyBUT0RPOiBjaGFuZ2UgdG8gcHJvZHVjdGlvbiBzZXJ2ZXIgd2hlbiByZWxlYXNlZFxuICB0aGlzLl91cmwgPSBvcHRpb25zICYmIG9wdGlvbnMudXJsIHx8ICdodHRwczovL3N0cmVhbS1zLndhdHNvbnBsYXRmb3JtLm5ldC90ZXh0LXRvLXNwZWVjaC1iZXRhL2FwaS92MSc7XG4gIHRoaXMuX2FwaV9rZXkgPSBvcHRpb25zLmFwaV9rZXk7XG4gIHRoaXMuX2F1ZGlvRWxlbWVudCA9IG9wdGlvbnMuYXVkaW9FbGVtZW50O1xuICB0aGlzLl92b2ljZXMgPSBbXTtcblxuICBpZiAoIVNQRUVDSF9TWU5USEVTSVNfVk9JQ0VTKSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdHRVQnLCB0aGlzLl91cmwgKyAnL3ZvaWNlcycsIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVdhdHNvbi1BdXRob3JpemF0aW9uLVRva2VuJywgdGhpcy5fYXBpX2tleSk7XG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHRoaXMuX3ZvaWNlcyA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkudm9pY2VzO1xuICAgICAgICB0aGlzLm9udm9pY2VzY2hhbmdlZCgpO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbiAgICB4aHIuc2VuZCgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEVtdWxhdGUgYXN5bmMgY2FsbCwgc2luY2Ugdm9pY2VzIGFyZSBhdmFpbGFibGVcbiAgICAvLyBvbiB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl92b2ljZXMgPSBTUEVFQ0hfU1lOVEhFU0lTX1ZPSUNFUy52b2ljZXM7XG4gICAgICB0aGlzLm9udm9pY2VzY2hhbmdlZCgpO1xuICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gIH1cblxufVxuXG4vLyBTcGVlY2hTeW50aGVzaXMgbWV0aG9kc1xuXG4vKipcbiAqXG4gKiBBdHRhY2hlcyBIVE1MQXVkaW9FbGVtZW50IChpZSwgPGF1ZGlvPiBlbGVtZW50KVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gYXVkaW9FbGVtZW50IEhUTUxBdWRpb0VsZW1lbnQgKGllLCA8YXVkaW8+IGVsZW1lbnQpXG4gKlxuICovXG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSA9IGZ1bmN0aW9uKGF1ZGlvRWxlbWVudCkge1xuICB0aGlzLl9hdWRpb0VsZW1lbnQgPSBhdWRpb0VsZW1lbnQ7XG59O1xuXG4vKipcbiAqXG4gKiBHZXRzIGF2YWlsYWJsZSB2b2ljZSBtb2RlbHMsIGVtcHR5IGFycmF5IHVudGlsIG9udm9pY2VjaGFuZ2VkIGhhcyBiZWVuIGNhbGxlZFxuICogQHJldHVybiB7YXJyYXl9IGFycmF5IG9mIFNwZWVjaFN5bnRoZXNpc1ZvaWNlIG9iamVjdHNcbiAqXG4gKi9cblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUuZ2V0Vm9pY2VzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpLCB2b2ljZU9wdGlvbnMsIHNwZWVjaFN5bnRoZXNpc1ZvaWNlLFxuICAgICAgc3BlZWNoU3ludGhlc2lzVm9pY2VDb2xsZWN0aW9uID0gW10sXG4gICAgICB2b2ljZXMgPSB0aGlzLl92b2ljZXM7XG4gIGZvciAoaT0wOyBpIDwgdm9pY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdm9pY2VPcHRpb25zID0gdm9pY2VzW2ldO1xuICAgIHNwZWVjaFN5bnRoZXNpc1ZvaWNlID0gbmV3IFNwZWVjaFN5bnRoZXNpc1ZvaWNlKHZvaWNlT3B0aW9ucyk7XG4gICAgc3BlZWNoU3ludGhlc2lzVm9pY2UubG9jYWxTZXJ2aWNlID0gZmFsc2U7XG4gICAgc3BlZWNoU3ludGhlc2lzVm9pY2VDb2xsZWN0aW9uLnB1c2goc3BlZWNoU3ludGhlc2lzVm9pY2UpO1xuICB9XG4gIHJldHVybiBzcGVlY2hTeW50aGVzaXNWb2ljZUNvbGxlY3Rpb247XG59O1xuXG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLnNwZWFrID0gZnVuY3Rpb24odXR0ZXJhbmNlKSB7XG4gIGNvbnNvbGUubG9nKCdzcGVhayB1dHRlcmFuY2UgdGhpcycsIHV0dGVyYW5jZSk7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgdmFyIGRvd25sb2FkID0gdXR0ZXJhbmNlLmRvd25sb2FkO1xuICBkZWxldGUgdXR0ZXJhbmNlLmRvd25sb2FkO1xuICB2YXIgdXJsID0gdGhpcy5fdXJsICsgJy9zeW50aGVzaXplPycgKyBzZXJpYWxpemVRdWVyeVN0cmluZyh1dHRlcmFuY2UpO1xuICAvLyBJZiB0aGUgdXNlciBzZXRzIGFuIGF1ZGlvIHNvdXJjZSB2aWEgdGhlIGNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSBtZXRob2RcbiAgLy8gc2V0IHRoYXQgZWxlbWVudCdzIHNvdXJjZSB0byB0aGUgVVJMXG4gIC8vIFRoaXMgaXMgdGhlIG9ubHkgd2F5IHRvIHByZXNlbnRseSBzdHJlYW0gY2h1bmtlZCBtZWRpYVxuICAvLyBzaW5jZSB0aGUgYWx0ZXJuYXRpdmUsIFhNTEh0dHBSZXF1ZXN0LCBtdXN0IHdhaXQgdW50aWwgdGhlIGRhdGEgaXMgZnVsbHkgbG9hZGVkXG4gIC8vIGlmICh0aGlzLl9hdWRpb0VsZW1lbnQpIHtcbiAgLy8gICB0aGlzLl9hdWRpb0VsZW1lbnQuc3JjID0gdXJsO1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuICB2YXIgYXVkaW8gPSB0aGlzLl9hdWRpb0VsZW1lbnQgfHwgbmV3IEF1ZGlvKCk7XG4gIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOFwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtV2F0c29uLUF1dGhvcml6YXRpb24tVG9rZW4nLCB0aGlzLl9hcGlfa2V5KTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIGlmIChhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnJykubGVuZ3RoID4gMCkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXVkaW8vb2dnOyBjb2RlY3M9b3B1c1wiKTtcbiAgfSBlbHNlIGlmIChhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykubGVuZ3RoID4gMCkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXVkaW8vd2F2XCIpO1xuICB9IGVsc2Uge1xuICAgIHZhciBldnQgPSBuZXcgU3BlZWNoU3ludGhlc2lzRXJyb3JFdmVudCgnYXVkaW8taGFyZHdhcmUnLCAnTm8gYXBwcm9wcmlhdGUgYXVkaW8gcGxheWVyIGlzIGF2YWlsYWJsZSBvbiB5b3VyIGJyb3dzZXIgZm9yIFNwZWVjaFN5bnRoZXNpcyBhdWRpbycpO1xuICAgIHRoaXMuZXJyb3IoZXZ0KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJztcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHt0eXBlOiAnYXVkaW8vb2dnJ30pO1xuICAgICAgdmFyIG9iamVjdFVSTCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICBpZiAoZG93bmxvYWQpIHtcbiAgICAgICAgdmFyIGFuY2hvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGFuY2hvckVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgb2JqZWN0VVJMKTtcbiAgICAgICAgYW5jaG9yRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgJ3R0c3NhbXBsZS5vZ2cnKTtcbiAgICAgICAgYW5jaG9yRWxlbWVudC5jbGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhdWRpby5zcmMgPSBvYmplY3RVUkw7XG4gICAgICBhdWRpby5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTChvYmplY3RVUkwpO1xuICAgICAgfTtcbiAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgIHV0dGVyYW5jZS5zdGFydCgpO1xuICAgIH1cbiAgfTtcbiAgeGhyLnNlbmQoKTtcbn07IFxuXG4vKipcbiAqXG4gKiBBdHRhY2hlcyBIVE1MQXVkaW9FbGVtZW50IChpZSwgPGF1ZGlvPiBlbGVtZW50KVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gYXVkaW9FbGVtZW50IEhUTUxBdWRpb0VsZW1lbnQgKGllLCA8YXVkaW8+IGVsZW1lbnQpXG4gKlxuICovXG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSA9IGZ1bmN0aW9uKGF1ZGlvRWxlbWVudCkge1xuICB0aGlzLl9hdWRpb0VsZW1lbnQgPSBhdWRpb0VsZW1lbnQ7XG59O1xuXG5cbi8vIEZ1bmN0aW9ucyB1c2VkIGZvciBzcGVlY2ggc3ludGhlc2lzICBldmVudHMgbGlzdGVuZXJzLlxuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5vbnZvaWNlc2NoYW5nZWQgPSBmdW5jdGlvbigpIHt9OyBcblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHt9O1xuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHt9O1xuU3BlZWNoU3ludGhlc2lzLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKCkge307XG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSB7fTtcblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7fTtcblNwZWVjaFN5bnRoZXNpcy5wcm90b3R5cGUubWFyayA9IGZ1bmN0aW9uKCkge307XG5TcGVlY2hTeW50aGVzaXMucHJvdG90eXBlLmJvdW5kYXJ5ID0gZnVuY3Rpb24oKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcGVlY2hTeW50aGVzaXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4vKipcbiAqXG4gKiBFcnJvciBwcm90b3R5cGVcbiAqIEBhdXRob3IgRXJpYyBTLiBCdWxsaW5ndG9uIDxlc2J1bGxpbkB1cy5pYm0uY29tPlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gZXJyb3IgY29kZSBpbmRpY2F0aW5nIHdoYXQgd2VudCB3cm9uZ1xuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50KGVycm9yLCBtZXNzYWdlKSB7XG4gIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSBJQk0gQ29ycC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4gXG4gLyoqXG4gKlxuICogU3BlZWNoU3ludGhlc2lzIGV2ZW50IHByb3RvdHlwZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXV0aG9yIEVyaWMgUy4gQnVsbGluZ3RvbiA8ZXNidWxsaW5AdXMuaWJtLmNvbT5cbiAqIEBwYXJhbSB7U3RyaW5nfSB1dHRlcmFuY2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2hhckluZGV4IG9mIHRoZSBzcGVha2luZyBwb3NpdGlvbiBpbiBvcmlnaW5hbCB1dHRlcmFuY2Ugc3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gZWxhcHNlZFRpbWUgXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBvZiBtYXJrZXIgKFNTTUwpXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gU3BlZWNoU3ludGhlc2lzRXZlbnQoX29wdGlvbnMpIHtcblx0dmFyIG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblx0dGhpcy51dHRlcmFuY2UgPSBvcHRpb25zLnV0dGVyYW5jZTtcblx0dGhpcy5jaGFySW5kZXggPSBvcHRpb25zLmNoYXJJbmRleDtcblx0dGhpcy5lbGFwc2VkVGltZSA9IG9wdGlvbnMuZWxhcHNlZFRpbWU7XG5cdHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcGVlY2hTeW50aGVzaXNFdmVudDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IElCTSBDb3JwLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKlxuICogU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlIHByb3RvdHlwZVxuICogQGF1dGhvciBFcmljIFMuIEJ1bGxpbmd0b24gPGVzYnVsbGluQHVzLmlibS5jb20+XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IHRvIGJlIHN5bnRoZXNpemVkIGFuZCBzcG9rZW4gZm9yIHRoaXMgdXR0ZXJhbmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFuZyBsYW5ndWFnZSBvZiB0aGUgc3BlZWNoIHN5bnRoZXNpcyBmb3IgdGhlIHV0dGVyYW5jZSwgdXNpbmcgQkNQIDQ3IHRhZ1xuICogQHBhcmFtIHtTdHJpbmd9IGRvd25sb2FkIGRvd25sb2FkIGZpbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB2b2ljZSBcbiAqIEBwYXJhbSB7TnVtYmVyfSB2b2x1bWUgXG4gKiBAcGFyYW0ge051bWJlcn0gcmF0ZSBcbiAqIEBwYXJhbSB7TnVtYmVyfSBwaXRjaCBcbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UoX29wdGlvbnMpIHtcbiAgdmFyIG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy50ZXh0ID0gb3B0aW9ucy50ZXh0O1xuICB0aGlzLmRvd25sb2FkID0gb3B0aW9ucy5kb3dubG9hZCB8fCBmYWxzZTtcbiAgdGhpcy5sYW5nID0gb3B0aW9ucy5sYW5nO1xuICB0aGlzLnZvaWNlID0gb3B0aW9ucy52b2ljZSB8fCAnZW4tVVNfTWljaGFlbFZvaWNlJztcbiAgdGhpcy52b2x1bWUgPSBvcHRpb25zLnZvbHVtZTtcbiAgdGhpcy5yYXRlID0gb3B0aW9ucy5yYXRlO1xuICB0aGlzLnBpdGNoID0gb3B0aW9ucy5waXRjaDtcbn1cblxuU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge307XG5cbm1vZHVsZS5leHBvcnRzID0gU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSBJQk0gQ29ycC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICpcbiAqIFNwZWVjaFN5bnRoZXNpc1ZvaWNlIHByb3RvdHlwZVxuICogQGF1dGhvciBFcmljIFMuIEJ1bGxpbmd0b24gPGVzYnVsbGluQHVzLmlibS5jb20+XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBfb3B0aW9ucyBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB2b2ljZVVSSSBwb2ludHMgdG8gcmVtb3RlIElCTSB0ZXh0LXRvLXNwZWVjaCBlbmRwb2ludFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgYXR0cmlidXRlIGlzIGEgaHVtYW4tcmVhZGFibGUgbmFtZSB0aGF0IHJlcHJlc2VudHMgdGhlIHZvaWNlXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFuZyBhdHRyaWJ1dGUgaXMgYSBCQ1AgNDcgbGFuZ3VhZ2UgdGFnIGluZGljYXRpbmcgdGhlIGxhbmd1YWdlIG9mIHRoZSB2b2ljZVxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsU2VydmljZSBhbHdheXMgZmFsc2UgZm9yIHRoaXMgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBkZWZhdWx0IGF0dHJpYnV0ZSB0aGF0IGlzIHRydWUgZm9yIGF0IG1vc3Qgb25lIHZvaWNlIHBlciBsYW5ndWFnZVxuICogQHBhcmFtIHtTdHJpbmd9IF9nZW5kZXIgaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgZXh0ZW5zaW9uIGluZGljYXRpbmcgdm9pY2UncyBnZW5kZXJcbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTcGVlY2hTeW50aGVzaXNWb2ljZShfb3B0aW9ucykge1xuXHR2YXIgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXHR0aGlzLnZvaWNlVVJJID0gb3B0aW9ucy51cmw7XG5cdHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcblx0dGhpcy5sYW5nID0gb3B0aW9ucy5sYW5ndWFnZTtcblx0dGhpcy5sb2NhbFNlcnZpY2UgPSBmYWxzZTtcblx0dGhpcy5kZWZhdWx0ID0gb3B0aW9ucy5kZWZhdWx0IHx8IGZhbHNlO1xuXHR0aGlzLl9nZW5kZXIgPSBvcHRpb25zLmdlbmRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcGVlY2hTeW50aGVzaXNWb2ljZTsiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IDIwMTQgSUJNIENvcnAuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5zZXJpYWxpemVRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdmFyIHBhcmFtcyA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pO1xuICAgIHJlc3VsdHMucHVzaChwYXJhbXMpO1xuICB9XG4gIHJldHVybiByZXN1bHRzLmpvaW4oXCImXCIpO1xufTtcbiIsIlxud2luZG93LlNwZWVjaFN5bnRoZXNpcyA9IHJlcXVpcmUoJy4vU3BlZWNoU3ludGhlc2lzJyk7XG53aW5kb3cuU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlID0gcmVxdWlyZSgnLi9TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UnKTtcbndpbmRvdy5TcGVlY2hTeW50aGVzaXNFdmVudCA9IHJlcXVpcmUoJy4vU3BlZWNoU3ludGhlc2lzRXZlbnQnKTtcbndpbmRvdy5TcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50ID0gcmVxdWlyZSgnLi9TcGVlY2hTeW50aGVzaXNFcnJvckV2ZW50Jyk7XG53aW5kb3cuU3BlZWNoU3ludGhlc2lzVm9pY2UgPSByZXF1aXJlKCcuL1NwZWVjaFN5bnRoZXNpc1ZvaWNlJyk7XG4iXX0=
