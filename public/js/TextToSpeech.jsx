'use strict';

import React from 'react';
import ReactDom from 'react-dom';


const voices = [
  {
    "name": "en-US_AllisonVoice",
    "language": "en-US",
    "customizable": true,
    "gender": "female, expressive, transformable",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonVoice",
    "description": "Allison: American English female voice."
  },
  {
    "name": "en-US_MichaelVoice",
    "language": "en-US",
    "customizable": true,
    "gender": "male",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelVoice",
    "description": "Michael: American English male voice."
  },
  {
    "name": "en-US_LisaVoice",
    "language": "en-US",
    "customizable": true,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_LisaVoice",
    "description": "Lisa: American English female voice."
  },
  {
    "name": "en-GB_KateVoice",
    "language": "en-GB",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-GB_KateVoice",
    "description": "Kate: British English female voice."
  },
  {
    "name": "fr-FR_ReneeVoice",
    "language": "fr-FR",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_ReneeVoice",
    "description": "Renee: French (français) female voice."
  },
  {
    "name": "de-DE_BirgitVoice",
    "language": "de-DE",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_BirgitVoice",
    "description": "Birgit: Standard German of Germany (Standarddeutsch) female voice."
  },
  {
    "name": "de-DE_DieterVoice",
    "language": "de-DE",
    "customizable": false,
    "gender": "male",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/de-DE_DieterVoice",
    "description": "Dieter: Standard German of Germany (Standarddeutsch) male voice."
  },
  {
    "name": "it-IT_FrancescaVoice",
    "language": "it-IT",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/it-IT_FrancescaVoice",
    "description": "Francesca: Italian (italiano) female voice."
  },
  {
    "name": "ja-JP_EmiVoice",
    "language": "ja-JP",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/ja-JP_EmiVoice",
    "description": "Emi: Japanese (日本語) female voice."
  },
  {
    "name": "pt-BR_IsabelaVoice",
    "language": "pt-BR",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/pt-BR_IsabelaVoice",
    "description": "Isabela: Brazilian Portuguese (português brasileiro) female voice."
  },
  {
    "name": "es-ES_EnriqueVoice",
    "language": "es-ES",
    "customizable": false,
    "gender": "male",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_EnriqueVoice",
    "description": "Enrique: Castilian Spanish (español castellano) male voice."
  },
  {
    "name": "es-ES_LauraVoice",
    "language": "es-ES",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-ES_LauraVoice",
    "description": "Laura: Castilian Spanish (español castellano) female voice."
  },
  {
    "name": "es-US_SofiaVoice",
    "language": "es-US",
    "customizable": false,
    "gender": "female",
    "url": "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/es-US_SofiaVoice",
    "description": "Sofia: North American Spanish (español norteamericano) female voice."
  }
];
const LANGUAGE_TABLE = {
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

class TTSLanguageDropDown extends React.Component {
  formatVoiceName(idx) {
    let voice = typeof(idx) === 'number' ? this.props.languages[idx] : idx
    let voiceReg = /^[^_]+_(.*)?Voice$/
    let voiceNameMatch = voiceReg.exec(voice.name)
    let voiceName = voiceNameMatch && voiceNameMatch.length == 2 ? voiceNameMatch[1] : voice.name
    return LANGUAGE_TABLE[voice.language] + ': ' + voiceName + ' (' + voice.gender + ')';
  }

  render() {
    let currentthis = this;
    return (<div className="col-lg-5 col-md-10 col-sm-22">
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1"
                data-toggle="dropdown" aria-expanded="true">
          <span id="dropdownMenuDefault" className="dropdown-text">{this.formatVoiceName(0)}</span>
          <span class="caret"></span>
        </button>
        <ul id="dropdownMenuList" className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          {this.props.languages.slice(1).map(function (voice) {
            return (
                <li role="presentation">
                  <a href="/" data-voice={voice.name} role="menu-item">{currentthis.formatVoiceName(voice)}</a>
                </li>);
          })}
        </ul>
      </div>
    </div>);
  }}