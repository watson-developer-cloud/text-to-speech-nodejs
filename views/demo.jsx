import React from 'react';
import {Icon, Tabs, Pane} from 'watson-react-components';
import 'whatwg-fetch'
import voices from '../voices';

const synthesizeUrl = `/api/synthesize?voice={this.state.voice.name}&text={encodeURIComponent(this.state.text)}`;

/**
 * @return {Function} A polyfill for URLSearchParams
 */
const getSearchParams = () => {
  if (typeof URLSearchParams === 'function') {
    return new URLSearchParams();
  }
  // simple polyfill for URLSearchparams
  const searchParams = () => {};

  searchParams.prototype.set = (key, value) => {
    this[key] = value;
  };

  searchParams.prototype.toString = () => Object.keys(this).map((v) =>
    (`${encodeURI(v)}=${encodeURI(this[v])}`), this).join("&");
  return new searchParams();
};

/**
 * Validates that the mimetype is: audio/wav, audio/mpeg;codecs=mp3 or audio/ogg;codecs=opus
 * @param  {String} mimeType The audio mimetype
 * @return {bool} Returns true if the mimetype can be played.
 */
const canPlayAudioFormat = (mimeType) => {
  var audio = document.createElement('audio');
  if (audio) {
    return (typeof audio.canPlayType === 'function' && audio.canPlayType(mimeType) !== '');
  } else {
    return false
  }
};

class ConditionalSpeakButton extends React.Component {
  componentDidMount() {
    if (canPlayAudioFormat('audio/ogg;codecs=opus')) {
      this.setState({canPlay: true});
    } else {
      this.setState({canPlay: false});
    }
  }

  render() {
    if (this.state && this.state.canPlay) {
      return (
        <button onClick={this.props.onClick} className={ this.props.loading ? "base--button speak-button loading" : "base--button speak-button"}>
          Speak
        </button>
      );
    } else {
      return (
        <span>
          <button
            onClick={this.props.onClick}
            className="base--button speak-button speak-disabled"
            title="Only available on Chrome and Firefox"
            disabled={true}
          >
            Speak
          </button>
        </span>
      );
    }
  }
}

export default React.createClass({

  getInitialState() {
    return {
      voice: voices[3], // Alisson is the first voice
      error: null, // the error from calling /classify
      text: voices[3].demo.text, // default text
      ssml: voices[3].demo.ssml, // SSML text
      voice_ssml: voices[3].demo.voice_ssml, // Voice SSML text, only Allison supports this
      current_tab: 0,
      loading: false
    };
  },

  onTabChange(idx) {
    this.setState({current_tab: idx});
  },

  onTextChange(event) {
    this.setState({text: event.target.value, ssml: "", voice_ssml: ""});
  },

  onSsmlChange(event) {
    this.setState({ssml: event.target.value, text: "", voice_ssml: ""});
  },

  onVoiceSsmlChange(event) {
    this.setState({voice_ssml: event.target.value, ssml: "", text: ""});
  },

  setupParamsFromState(do_download) {
    var params = getSearchParams();
    if (this.state && this.state.current_tab === 0) {
      params.set('text', this.state.text);
      params.set('voice', this.state.voice.name);
    } else if (this.state && this.state.current_tab === 1) {
      params.set('text', this.state.ssml);
      params.set('voice', this.state.voice.name);
    } else if (this.state && this.state.current_tab === 2) {
      params.set('text', this.state.voice_ssml);
      params.set('voice', this.state.voice.name);
    }
    params.set('download', do_download);

    if (!canPlayAudioFormat('audio/ogg;codec=opus') && canPlayAudioFormat('audio/wav')) {
      params.set('accept', 'audio/wav');
    }

    return params
  },

  onDownload(event) {
    event.target.blur();
    const params = this.setupParamsFromState(true);
    window.location.href = `/api/synthesize?${params.toString()}`
  },

  onSpeak(event) {
    event.target.blur();
    const params = this.setupParamsFromState(true);
    const audio = document.getElementById('audio');
    audio.setAttribute('src', '');


    this.setState({ loading: true, hasAudio: false });
    fetch(`/api/synthesize?${params.toString()}`).then((response) => {
      if (response.ok) {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          this.setState({ loading: false, hasAudio: true });

          audio.setAttribute('src', url);
          audio.setAttribute('type', 'audio/ogg;codecs=opus');
        });
      } else {
        this.setState({ loading: false });
        response.json().then((json) => {
          this.setState({ error: json });
          setTimeout(() => this.setState({ error: null, loading: false }), 5000);
        });
      }
    })
  },

  onResetClick() {
    // pause audio, if it's playing. 
    document.querySelector('audio#audio').pause();
    const currentVoice = this.state.voice;
    this.setState({
      error: null,
      hasAudio: false,
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
      ssml_voice: voice.demo.ssml_voice
    });
  },

  render() {
    return (
      <section className="_container _container_large">
        <div className="row">
          <h2 className="base--h2 title">Input Text</h2>
          <p className="base--p normalfont">
            The text language must match the selected voice language: Mixing language (English text with a Spanish male voice) does not produce valid results. The synthesized audio is streamed to the client as it is being produced, using the HTTP chunked encoding. The audio is returned in the Ogg Opus format which can be played using VLC and Audacity players.
          </p>
          <div className="voice-input">
            <select name="voice" className="base--select" onChange={this.onVoiceChange} value={this.state.voice.name}>
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>{voice.option}</option>
              ))}
            </select>
          </div>

          <Tabs selected={0} onChange={this.onTabChange}>
            <Pane label="Text">
              <textarea onChange={this.onTextChange} className="base--textarea textarea" spellCheck="false" value={this.state.text || ''}/>
            </Pane>
            <Pane label="Expressive SSML">
              <textarea onChange={this.onSsmlChange} className="base--textarea textarea" spellCheck="false" value={this.state.ssml || ''}/>
            </Pane>
            <Pane label="Voice Transformation SSML">
              <textarea readOnly={!this.state.voice_ssml} onChange={this.onVoiceSsmlChange} className="base--textarea textarea" spellCheck="false" value={this.state.voice_ssml || 'Voice Transformation not currently supported for this language.'}/>
            </Pane>
          </Tabs>
          <div className="output-container">
            <div className="controls-container">
              <div className="buttons-container">
                <button onClick={this.onDownload} className="base--button download-button">Download</button>
                <ConditionalSpeakButton loading={this.state.loading} onClick={this.onSpeak} />
              </div>
              <div className={!this.state.loading && this.state.hasAudio ? "reset-container" : "reset-container dimmed"}>
                <Icon type="reset" />
                <a className="base--a reset-button" onClick={this.onResetClick}>Reset</a>
              </div>
            </div>
            <div className={`errorMessage ${this.state.error ? '' : 'hidden'}`}>
              <Icon type="error" />
              <p className="base--p service-error--message">{this.state.error ? this.state.error.error : ''}</p>
            </div>
            <div className={`text-center loading ${this.state.loading ? '' : 'hidden'}`}>
              <Icon type="loader" />
            </div>
            <audio autoPlay="true" id="audio" className={`audio ${this.state.hasAudio ? '' : 'hidden'}`} controls="controls">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </section>
    );
  }
});
