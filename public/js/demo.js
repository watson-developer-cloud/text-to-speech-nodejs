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
/*global $:false */

'use strict';

$(document).ready(function() {
  var audio = $('.audio').get(0),
    textArea = $('#textArea');

  var textChanged = false,
    spanishText = 'El servicio de Voz a Texto utiliza la tecnología de síntesis de voz de IBM para convertir texto en Inglés o Español en una señal de audio. El audio es enviado de vuelta al cliente con un retraso mínimo. El servicio puede ser accedido a través de una interfaz REST.',
    englishText = 'The Text to Speech service uses IBM\'s speech synthesis capabilities to convert English or Spanish text to an audio signal. The audio is streamed back to the client with minimal delay. The service can be accessed via a REST interface.';

  $('#textArea').val(englishText);

  $('#voice').change(function(){
    if (!textChanged) {
      if ($(this).val() === 'VoiceEsEsEnrique')
        $('#textArea').val(spanishText);
      else
        $('#textArea').val(englishText);
    }
  });

  $('#textArea').change(function(){
    textChanged = true;
  });

  // IE and Safari not supported disabled Speak button
  if ($('body').hasClass('ie') || $('body').hasClass('safari')) {
    $('.speak-button').prop('disabled', true);
  }

  if ($('.speak-button').prop('disabled')) {
    $('.ie-speak .arrow-box').show();
  }

  $('.audio').on('error', function () {
    $('.result').hide();
    $('errorMgs').text('Error processing the request.');
    $('.errorMsg').css('color','red');
    $('.error').show();
  });

  $('.audio').on('loadeddata', function () {
    $('.result').show();
    $('.error').hide();
  });

  $('.download-button').click(function() {
    textArea.focus();
    if (validText(textArea.val())) {
      window.location.href = '/synthesize?download=true&' + $('.speech-form').serialize();
    }
  });

  $('.speak-button').click(function() {
    $('.result').hide();
    audio.pause();

    $('#textArea').focus();
    if (validText(textArea.val())) {
      audio.setAttribute('src','/synthesize?' + $('.speech-form').serialize());
    }
  });

  function validText(text) {
    if ($.trim(text)) {
      $('.error').hide();
      return true;
    } else {
      $('.errorMsg').text('Please enter the text you would like to synthesize in the text window.');
      $('.errorMsg').css('color','#00b2ef');
      $('.error').show();
      return false;
    }
  }
});
