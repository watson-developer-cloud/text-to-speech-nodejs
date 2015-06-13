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


function getToken(callback) {
	$.get('/token', function(data) {
		callback(data);
	});
}

getToken(function(token) {
	var speechSynthesisOptions = {
		audioElement: audio,
		url: 'https://stream-d.watsonplatform.net/text-to-speech-beta/api/v1',
		api_key: token
	};

	var speechSynthesis = new SpeechSynthesis(speechSynthesisOptions);

	speechSynthesis.onvoiceschanged = function() {
		var voices = speechSynthesis.getVoices();
		console.log('voices', voices);
	};
});


function parseVoices(voices) {
	var voiceName = voice.name.substring(6, voice.name.length - 5);
}

$(document).ready(function() {

	function getBaseURL() {
		return location.protocol + "//" + location.hostname + 
	(location.port && ":" + location.port);
	}

	$.each(voices, function(idx, voice) {
		var voiceName = voice.name.substring(6, voice.name.length - 5);
		var optionText = voice._gender + ' voice: ' + voiceName + ' (' + voice.lang + ')';
		$('#voice')
		.append($('<option>', { value : voice.name })
			.prop('selected', voice.name === 'en-US_MichaelVoice' ? true : false)
			.text(optionText));
	});

  var audio = $('.audio').get(0),
    textArea = $('#textArea');

  var textChanged = false,
    spanishText = "Consciente de su patrimonio espiritual y moral, la Unión está fundada sobre los valores indivisibles y universales de la dignidad humana, la libertad, la igualdad y la solidaridad, y se basa en los principios de la democracia y el Estado de Derecho. Al instituir la ciudadanía de la Unión y crear un espacio de libertad, seguridad y justicia, sitúa a la persona en el centro de su actuación.",
		frenchText = "Consciente de son patrimoine spirituel et moral, l'Union se fonde sur les valeurs indivisibles et universelles de dignité humaine, de liberté, d'égalité et de solidarité; elle repose sur le principe de la démocratie et le principe de l'État de droit. Elle place la personne au coeur de son action en instituant la citoyenneté de l'Union et en créant un espace de liberté, de sécurité et de justice.",
		englishText = "Conscious of its spiritual and moral heritage, the Union is founded on the indivisible, universal values of human dignity, freedom, equality and solidarity; it is based on the principles of democracy and the rule of law. It places the individual at the heart of its activities, by establishing the citizenship of the Union and by creating an area of freedom, security and justice.",
		germanText = "In dem Bewusstsein ihres geistig-religiösen und sittlichen Erbes gründet sich die Union auf die unteilbaren und universellen Werte der Würde des Menschen, der Freiheit, der Gleichheit und der Solidarität. Sie beruht auf den Grundsätzen der Demokratie und der Rechtsstaatlichkeit. Sie stellt den Menschen in den Mittelpunkt ihres Handelns, indem sie die Unionsbürgerschaft und einen Raum der Freiheit, der Sicherheit und des Rechts begründet.",
		italianText = "Consapevole del suo patrimonio spirituale e morale, l'Unione si fonda sui valori indivisibili e universali della dignità umana, della libertà, dell'uguaglianza e della solidarietà; essa si basa sul principio della democrazia e sul principio dello Stato di diritto. Pone la persona al centro della sua azione istituendo la cittadinanza dell'Unione e creando uno spazio di libertà, sicurezza e giustizia.";


  $('#textArea').val(englishText);

  $('#textArea').change(function(){
    textChanged = true;
  });

  $('#voice').change(function(){
    if (!textChanged) {
      switch($(this).val().substring(0, 2)) {
				case 'es':
					$('#textArea').val(spanishText);
					break;
				case 'fr':
					$('#textArea').val(frenchText);
					break;
				case 'de':
					$('#textArea').val(germanText);
					break;
				case 'it':
					$('#textArea').val(italianText);
					break;
				default:
					$('#textArea').val(englishText);
					break;
			}
    }
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
    $('.errorMgs').text('Error processing the request.');
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

			var options = {
				text: $('#textArea').val(),
				voice: $('#voice').val()
			};

			var utterance = new SpeechSynthesisUtterance(options);
			speechSynthesis.speak(utterance);

    }
  });

  function containsAllLatin1(str) {
    return  /^[A-z\u00C0-\u00ff\s?@¿"'\.,-\/#!$%\^&\*;:{}=\-_`~()]+$/.test(str) ;
  }

  function validText(text) {
    $('.error').hide();
    $('.errorMsg').text('');
    $('.latin').hide();

    if ($.trim(text).length === 0) { // empty text
      $('.errorMsg').text('Please enter the text you would like to synthesize in the text window.');
      $('.errorMsg').css('color','#00b2ef');
      $('.error').show();
      return false;
    }

    if (!containsAllLatin1(text)) {
      $('.latin').show();
      $('.error').show();
       return false;
    }
    return true;
  }
});