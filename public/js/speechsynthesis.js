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

/**
 *
 * SpeechSynthesis prototype per W3C Speech spec:
 * https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi.html
 *
 * @author Eric S. Bullington <esbullin@us.ibm.com>
 * @constructor
 * @param {Object} _options configuration parameters
 * @param {String} _options.url  resource URL
 *
 */
function SpeechSynthesis (_options) {

	var options = _options || {
		// TODO: change to production server when released
		url: 'https://stream-d.watsonplatform.net/text-to-speech-beta/api/v1'
	}

	this._url = options.url;
	this._api_key = options.api_key;
	this._audioElement = options.audioElement;
	this._voices = [];

	var xhr = new XMLHttpRequest();
	xhr.open('GET', this._url + '/voices', true);
	xhr.setRequestHeader('X-Watson-DPAT-Token', this._api_key ? this._api_key : '');
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			this._voices = JSON.parse(xhr.responseText).voices;
			this.onvoiceschanged();
		}
	}.bind(this);

	xhr.send();

}

// SpeechSynthesis methods

/**
 *
 * Attaches HTMLAudioElement (ie, <audio> element)
 * @param {Object} _options configuration parameters
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
}

SpeechSynthesis.prototype.speak = function(utterance) {
	var xhr = new XMLHttpRequest();
	var url = this._url + '/synthesize?' + serializeQueryString(utterance);
	// If the user sets an audio source via the createMediaElementSource method
	// set that element's source to the URL
	// This is the only way to presently stream chunked media
	// since the alternative, XMLHttpRequest, must wait until the data is fully loaded
	if (this._audioElement) {
		this._audioElement.src = url;
		return;
	}
	var audio = new Audio();
	xhr.open('GET', url, true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.setRequestHeader('X-Watson-DPAT-Token', this._api_key ? this._api_key : '');

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
			var objectUrl = URL.createObjectURL(blob);
			audio.src = objectUrl;
			audio.onload = function() {
				URL.revokeObjectURL(objectURL);
			};
			audio.play();
			utterance.start();
		}
	};
	xhr.send();
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

function SpeechSynthesisVoice(_options) {
	var options = _options || {};
	this._gender = options.gender;
	this.voiceURI = options.url;
	this.name = options.name;
	this.lang = options.language;
}

function SpeechSynthesisUtterance(_options) {
	var options = _options || {};
	this.text = options.text;
	this.lang = options.lang;
	this.voice = options.voice;
	this.download = options.download || false;
}

/**
 *
 * SpeechSynthesis event prototype
 * @constructor
 * @param {String} utterance that triggered the event
 * @param {String} charIndex of the speaking position in original utterance string
 * @param {Number} elapsedTime 
 * @param {String} name of marker (SSML)
 *
 */
function SpeechSynthesisEvent(_options) {
	var options = _options || {};
	this.utterance = options.utterance;
	this.charIndex = options.charIndex;
	this.elapsedTime = options.elapsedTime;
	this.name = options.name;
}

/**
 *
 * Error prototype
 * @constructor
 * @param {String} error code indicating what went wrong
 * @param {String} message
 *
 */
function SpeechSynthesisErrorEvent(error, message) {
	this.error = error;
	this.message = message;
}

/*
 * Utilities
 */
var serializeQueryString = function(obj) {
	var str = Object.keys(obj).map(function(key) {
		return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
	});
	return str.join("&");
}