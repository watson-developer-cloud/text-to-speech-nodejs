/**
 * Copyright 2014, 2015 IBM Corp. All Rights Reserved.
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
/*global $:false, SPEECH_SYNTHESIS_VOICES */

'use strict';

$(document).ready(function() {
  function showError(msg) {
    console.error('Error: ', msg);
    var errorAlert = $('.error-row');
    errorAlert.css('visibility','hidden');
    errorAlert.css('background-color', '#d74108');
    errorAlert.css('color', 'white');
    var errorMessage = $('#errorMessage');
    errorMessage.text(msg);
    errorAlert.css('visibility','');
    $('body').css('cursor', 'default');
    $('.speak-button').css('cursor', 'pointer');

    $('#errorClose').click(function(e) {
      e.preventDefault();
      errorAlert.css('visibility','hidden');
      return false;
    });
  }

  function onCanplaythrough() {
    console.log('onCanplaythrough');
    var audio = $('.audio').get(0);
    audio.removeEventListener('canplaythrough', onCanplaythrough);
    try {
      audio.currentTime = 0;
    }
    catch(ex) {
      // ignore. Firefox just freaks out here for no apparent reason.
    }
    audio.controls = true;
    audio.muted = false;
    $('.result').show();
    $('.error-row').css('visibility','hidden');
    $('html, body').animate({scrollTop: $('.audio').offset().top}, 500);
    $('body').css('cursor', 'default');
    $('.speak-button').css('cursor', 'pointer');
  }

  function synthesizeRequest(options, audio) {
    var sessionPermissions = JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1;
    var downloadURL = '/api/synthesize' +
      '?voice=' + options.voice +
      '&text=' + encodeURIComponent(options.text) +
      '&X-WDC-PL-OPT-OUT=' +  sessionPermissions;

    if (options.download) {
      downloadURL += '&download=true';
      window.location.href = downloadURL;
      return true;
    }
    audio.pause();
    audio.src = downloadURL;
    enableButtons(true);
    audio.addEventListener('canplaythrough', onCanplaythrough);
    audio.muted = true;
    audio.play();
    $('body').css('cursor', 'wait');
    $('.speak-button').css('cursor', 'wait');
    return true;
  }

  // Global comes from file constants.js
  var voices = SPEECH_SYNTHESIS_VOICES.voices;
  showVoices(voices);

  var voice = 'en-US_AllisonVoice';

  function isSSMLSupported() {
    if($('#ssmlArea').val() == japaneseSSML) {
      return false;
    }
    return true;
  }

  function disableButtons() {
    $('.download-button').prop('disabled', true);
    $('.speak-button').prop('disabled', true);
  }

  function enableButtons() {
    $('.download-button').prop('disabled', false);
    $('.speak-button').prop('disabled', false);
  }

  function showVoices(voices) {

    var currentTab = 'Text';

    // Show tabs
    $('#nav-tabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      currentTab = $(e.target).text();
      audio.src = '';
      audio.controls = false;
      if(currentTab === 'SSML' && isSSMLSupported() === false) {
        disableButtons();
      }
      else {
        enableButtons();
      }
    });

    var LANGUAGE_TABLE = {
      'en-US': 'American English (en-US)',
      'en-GB': 'British English (en-GB)',
      'ja-JP': 'Japanese (ja-JP)',
      'es-US': 'North American Spanish (es-US)',
      'de-DE': 'German (de-DE)',
      'fr-FR': 'French (fr-FR)',
      'it-IT': 'Italian (it-IT)',
      'pt-BR': 'Brazilian Portuguese (pt-BR)',
      'es-ES': 'Castilian Spanish (es-ES)'
    };

    $.each(voices, function(idx, voice) {
      var voiceName = voice.name.substring(6, voice.name.length - 5);
      var optionText = LANGUAGE_TABLE[voice.language] + ': ' + voiceName + ' ('  + voice.gender + ')';
      $('#dropdownMenuList').append(
        $('<li>')
        .attr('role', 'presentation')
        .append(
          $('<a>').attr('role', 'menu-item')
          .attr('href', '/')
          .attr('data-voice', voice.name)
          .append(optionText)
          )
        );
    });

    var audio = $('.audio').get(0),
        textArea = $('#textArea');

    var textChanged = false;

    $('#textArea').val(englishExpressiveText);
    $('#ssmlArea').val(englishExpresiveSSML);

    $('#textArea').change(function(){
      textChanged = true;
    });

    $('#dropdownMenuList').click(function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var newVoiceDescription = $(evt.target).text();
      voice = $(evt.target).data('voice');
      $('#dropdownMenuDefault').empty().text(newVoiceDescription);
      $('#dropdownMenu1').dropdown('toggle');
      $('#ssml_caption').text('SSML');
      audio.src = ''; // to stop currently playing audio
      audio.controls = false; // to hide the player
      enableButtons();

      var lang = voice.substring(0, 2);
        switch(lang) {
          case 'es':
            $('#textArea').val(spanishText);
            $('#ssmlArea').val(spanishSSML);
            break;
          case 'fr':
            $('#textArea').val(frenchText);
            $('#ssmlArea').val(frenchSSML);
            break;
          case 'de':
            $('#textArea').val(germanText);
            $('#ssmlArea').val(germanSSML);
            break;
          case 'it':
            $('#textArea').val(italianText);
            $('#ssmlArea').val(italianSSML);
            break;
          case 'ja':
            $('#textArea').val(japaneseText);
            $('#ssmlArea').val(japaneseSSML);
            if (currentTab === 'SSML' || currentTab === 'Expressive SSML') disableButtons();
            break;
          case 'pt':
            $('#textArea').val(brazilianPortugueseText);
            $('#ssmlArea').val(brazilianPortugueseSSML);
            break;
          case 'en':
            if(voice === 'en-US_AllisonVoice') {
              $('#ssml_caption').text('Expressive SSML');
              $('#textArea').val(englishExpressiveText);
              $('#ssmlArea').val(englishExpresiveSSML);
            }
            else {
              $('#textArea').val(englishText);
              var en_accent = voice.substring(0, 5);
              if(en_accent === 'en-US') {
                $('#ssmlArea').val(usEnglishSSML);
              }
              else if(en_accent === 'en-GB') {
                $('#ssmlArea').val(ukEnglishSSML);
              }
            }
            break;
        }
    });

    // IE and Safari not supported disabled Speak button
    if ($('body').hasClass('ie') || $('body').hasClass('safari')) {
      $('.speak-button').prop('disabled', true);
    }

    if ($('.speak-button').prop('disabled')) {
      $('.ie-speak .arrow-box').show();
    }

    $('.audio').on('error', function (err) {
      if(this.src === this.baseURI) {
        console.log('audio.src was reset');
        return;
      }
      $.get('/api/synthesize?text=test').always(function (response) {
        showError(response.responseText || 'Error processing the request');
      });
    });

    $('.download-button').click(function() {
      textArea.focus();
      if (validText(voice, textArea.val())) {
        var utteranceDownloadOptions = {
          text: currentTab === 'SSML' || currentTab === 'Expressive SSML' ? $('#ssmlArea').val(): $('#textArea').val(),
          voice: voice,
          download: true
        };
        synthesizeRequest(utteranceDownloadOptions);
      }
    });

    $('.speak-button').click(function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      $('.result').hide();

      $('#textArea').focus();
      var text = currentTab === 'SSML' || currentTab === 'Expressive SSML' ? $('#ssmlArea').val() : $('#textArea').val();
      if (validText(voice, text)) {
        var utteranceOptions = {
          text: text,
          voice: voice,
          sessionPermissions: JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1
        };

        synthesizeRequest(utteranceOptions, audio);
      }
      return false;
    });

    /**
    * Check that the text contains Japanese characters only
    * @return true if the string contains only Japanese characters
    */
    function containsAllJapanese(str) {
       return str.match(/^[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+$/);
    }

    function validText(voice, text) {
      $('.error-row').css('visibility','hidden');
      $('.errorMsg').text('');
      $('.latin').hide();

      if ($.trim(text).length === 0) { // empty text
        showError('Please enter the text you would like to synthesize in the text window.');
        return false;
      }

      return true;
    }
  }

  (function() {
    // Radio buttons for session permissions
    localStorage.setItem('sessionPermissions', true);
    var sessionPermissionsRadio = $('#sessionPermissionsRadioGroup input[type="radio"]');
    sessionPermissionsRadio.click(function() {
      var checkedValue = sessionPermissionsRadio.filter(':checked').val();
      localStorage.setItem('sessionPermissions', checkedValue);
    });
  }());

});
