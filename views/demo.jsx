import React from 'react';

import { Icon, Tabs, Pane } from 'watson-react-components';

import voices from '../voices';

const synthesizeUrl = `/api/synthesize?voice={voice}&text={encodeURIComponent(text)}`;

export default React.createClass({

  getInitialState() {
    return {
      voice: voices[3], // Alisson is the first voice
      error: null, // the error from calling /classify
      text: voices[3].demo.text, // default text
      ssml: voices[3].demo.ssml, // SSML text
      voice_ssml: voices[3].demo.voice_ssml, // Voice SSML text, only Allison supports this
    };
  },

  onTextChange(event) {
    this.setState({ text: event.target.value });
  },

  onSsmlChange(event) {
    this.setState({ ssml: event.target.value });
  },

  onVoiceSsmlChange(event) {
    this.setState({ voice_ssml: event.target.value });
  },

  onDownload() {
    const voice = this.state.voice;

    window.location.href = downloadURL;
    return true;

  },

  onSpeak() {
    console.log('speak');
synthesizeUrl

   if (options.download) {
     downloadURL += ;
     window.location.href = downloadURL;
     return true;
   }
   audio.pause();
   audio.src = downloadURL;
   enableButtons(true);
   audio.addEventListener('canplaythrough', onCanplaythrough);
   audio.muted = true;
   audio.play();

  },

  onResetClick() {
    const currentVoice = this.state.voice;
    this.setState({
      error: null,
      text: currentVoice.demo.text,
      ssml: currentVoice.demo.ssml,
      ssml_voice: currentVoice.demo.ssml_voice,
    });
  },

  onVoiceChange(event) {
    const voice = voices[voices.map(v => v.name).indexOf(event.target.value)];
    console.log(voice.demo.text);
    this.setState({
      voice,
      error: null,
      text: voice.demo.text,
      ssml: voice.demo.ssml,
      ssml_voice: voice.demo.ssml_voice,
    });
  },

  render() {
    return (
      <section className="_container _container_large">
        <div className="row">
          <h2 className="base--h2">Input Text</h2>
          <p className="base--p" >
            The text language must match the selected voice language: Mixing language
            (English text with a Spanish male voice) does not produce valid results.
            The synthesized audio is streamed to the client as it is being produced,
            using the HTTP chunked encoding. The audio is returned in the Ogg Opus
            format which can be played using VLC and Audacity players.
          </p>
          <div className="voice-input">
            <select
              name="voice"
              className="base--select"
              onChange={this.onVoiceChange}
              value={this.state.voice.name}
            >
              {
                voices.map(voice => (
                  <option key={voice.name} value={voice.name}>{voice.option}</option>
                  )
                )
              }
            </select>
          </div>

          <Tabs selected={0}>
            <Pane label="Text">
              <textarea
                onChange={this.onTextChange}
                className="base--textarea textarea"
                spellCheck="false"
                value={this.state.text || ''}
              />
            </Pane>
            <Pane label="Expressive SSML">
              <textarea
                onChange={this.onSsmlChange}
                className="base--textarea textarea"
                spellCheck="false"
                value={this.state.ssml || ''}
              />
            </Pane>
            <Pane label="Voice Transformation SSML">
              <textarea
                readOnly={!this.state.voice_ssml}
                onChange={this.onVoiceSsmlChange}
                className="base--textarea textarea"
                spellCheck="false"
                value={this.state.voice_ssml || 'Voice Transformation not currently supported for this language.'}
              />
            </Pane>
          </Tabs>
          <div className="reset-container">
            <Icon type="reset" />
            <a className="base--a reset-button" onClick={this.onResetClick}>Reset</a>
          </div>
          <div className="buttons-container">
            <button
              onClick={this.onDownload}
              className="base--button download-button"
            >
              Download
            </button>
            <button
              onClick={this.onSpeak}
              className="base--button speak-button"
            >
              Speak
            </button>
            <p className="speak-browser">Only on Chrome and Firefox</p>
          </div>
          <div className="audioplayer-container">
            <audio id="audio" className="audio" controls="">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </section>
    );
  },
});
