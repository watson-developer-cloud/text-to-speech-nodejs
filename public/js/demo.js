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
      window.location.href = '/synthesize?download=true&' + $('form').serialize();
    }
  });

  $('.speak-button').click(function() {
    $('.result').hide();
    audio.pause();

    $('#textArea').focus();
    if (validText(textArea.val())) {
      audio.setAttribute('src','/synthesize?' + $('form').serialize());
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
