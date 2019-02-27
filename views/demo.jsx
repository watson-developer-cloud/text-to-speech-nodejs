/* eslint camelcase: off */
import React, { Component } from 'react';
import PropType from 'prop-types';
import { Icon, Tabs, Pane } from 'watson-react-components';
import 'whatwg-fetch';
import voices from '../voices';

// eslint-disable-next-line
const TEXT_DESCRIPTION = 'The text language must match the selected voice language: Mixing language (English text with a Spanish male voice) does not produce valid results. The synthesized audio is streamed to the client as it is being produced, using the HTTP chunked encoding. The audio is returned in mp3 format which can be played using VLC and Audacity players.';

/**
 * @return {Function} A polyfill for URLSearchParams
 */
const getSearchParams = () => {
  if (typeof URLSearchParams === 'function') {
    return new URLSearchParams();
  }

  // Simple polyfill for URLSearchparams
  const SearchParams = function SearchParams() {
  };

  SearchParams.prototype.set = function set(key, value) {
    this[key] = value;
  };

  SearchParams.prototype.toString = function toString() {
    return Object.keys(this).map(v => `${encodeURI(v)}=${encodeURI(this[v])}`).join('&');
  };

  return new SearchParams();
};

/**
 * Validates that the mimetype is: audio/wav, audio/mpeg;codecs=mp3 or audio/ogg;codecs=opus
 * @param  {String} mimeType The audio mimetype
 * @return {bool} Returns true if the mimetype can be played.
 */
const canPlayAudioFormat = (mimeType) => {
  const audio = document.createElement('audio');
  if (audio) {
    return (typeof audio.canPlayType === 'function' && audio.canPlayType(mimeType) !== '');
  }
  return false;
};

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voice: voices[3], // Alisson is the first voice
      error: null, // the error from calling /classify
      text: voices[3].demo.text, // default text
      ssml: voices[3].demo.ssml, // SSML text
      ssml_voice: voices[3].demo.ssml_voice, // Voice SSML text, only some voices support this
      ssmlLabel: 'Expressive SSML',
      current_tab: 0,
      loading: false,
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onSsmlChange = this.onSsmlChange.bind(this);
    this.onVoiceSsmlChange = this.onVoiceSsmlChange.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.onSpeak = this.onSpeak.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onVoiceChange = this.onVoiceChange.bind(this);
    this.setupParamsFromState = this.setupParamsFromState.bind(this);
    this.downloadDisabled = this.downloadDisabled.bind(this);
    this.speakDisabled = this.speakDisabled.bind(this);
    this.downloadAllowed = this.downloadAllowed.bind(this);
  }

  onTabChange(idx) {
    this.setState({ current_tab: idx });
  }

  onTextChange(event) {
    this.setState({ text: event.target.value });
  }

  onSsmlChange(event) {
    this.setState({ ssml: event.target.value });
  }

  onVoiceSsmlChange(event) {
    this.setState({ ssml_voice: event.target.value });
  }

  onDownload(event) {
    event.target.blur();
    const params = this.setupParamsFromState(true);
    window.location.href = `/api/synthesize?${params.toString()}`;
  }

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
    });
  }

  onResetClick() {
    // pause audio, if it's playing.
    document.querySelector('audio#audio').pause();
    const { voice } = this.state;
    this.setState({
      error: null,
      hasAudio: false,
      text: voice.demo.text,
      ssml: voice.demo.ssml,
      ssml_voice: voice.demo.ssml_voice,
    });
  }

  onVoiceChange(event) {
    const voice = voices[voices.map(v => v.name).indexOf(event.target.value)];
    const label = (voice.name === 'en-US_AllisonVoice') ? 'Expressive SSML' : 'SSML';
    this.setState({
      voice,
      error: null,
      text: voice.demo.text,
      ssml: voice.demo.ssml,
      ssml_voice: voice.demo.ssml_voice,
      ssmlLabel: label,
    });
  }

  setupParamsFromState(doDownload) {
    const {
      text, voice, current_tab, ssmlLabel, ssml_voice, ssml,
    } = this.state;

    const params = getSearchParams();
    if (this.state && current_tab === 0) {
      params.set('text', text);
      params.set('voice', voice.name);
    } else if (this.state && current_tab === 1) {
      params.set('text', ssml);
      params.set('voice', voice.name);
      params.set('ssmlLabel', ssmlLabel);
    } else if (this.state && current_tab === 2) {
      params.set('text', ssml_voice);
      params.set('voice', voice.name);
    }
    params.set('download', doDownload);

    if (canPlayAudioFormat('audio/mp3')) {
      params.set('accept', 'audio/mp3');
    } else if (canPlayAudioFormat('audio/ogg;codec=opus')) {
      params.set('accept', 'audio/ogg;codec=opus');
    } else if (canPlayAudioFormat('audio/wav')) {
      params.set('accept', 'audio/wav');
    }
    console.log(JSON.stringify(params));
    return params;
  }

  downloadDisabled() {
    return !this.downloadAllowed();
  }

  speakDisabled() {
    return this.downloadDisabled();
  }

  downloadAllowed() {
    const {
      ssml, ssml_voice, current_tab, text,
    } = this.state;
    return (
      (ssml_voice && current_tab === 2)
      || (ssml && current_tab === 1)
      || (current_tab === 0 && text)
    );
  }

  render() {
    const {
      ssml, ssml_voice, voice, loading, hasAudio, ssmlLabel, error, text,
    } = this.state;
    return (
      <section className="_container _container_large">
        <div className="row">
          <h2 className="base--h2 title">
            Input Text
          </h2>
          <p className="base--p normalfont">
            {TEXT_DESCRIPTION}
          </p>
          <div className="voice-input">
            <select
              name="voice"
              className="base--select"
              onChange={this.onVoiceChange}
              value={voice.name}
            >
              {voices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.option}
                </option>
              ))}
            </select>
          </div>

          <Tabs selected={0} onChange={this.onTabChange}>
            <Pane label="Text">
              <textarea onChange={this.onTextChange} className="base--textarea textarea" spellCheck="false" value={text || ''} />
            </Pane>
            <Pane label={ssmlLabel}>
              <textarea onChange={this.onSsmlChange} className="base--textarea textarea" spellCheck="false" value={ssml || ''} />
            </Pane>
            <Pane label="Voice Transformation SSML">
              <textarea readOnly={!ssml_voice} onChange={this.onVoiceSsmlChange} className="base--textarea textarea" spellCheck="false" value={ssml_voice || 'Voice Transformation not currently supported for this voice.'} />
            </Pane>
          </Tabs>
          <div className="output-container">
            <div className="controls-container">
              <div className="buttons-container">
                <button
                  type="button"
                  onClick={this.onDownload}
                  disabled={this.downloadDisabled()}
                  className="base--button download-button"
                >
                  Download
                </button>
                <ConditionalSpeakButton
                  loading={loading}
                  onClick={this.onSpeak}
                  disabled={this.speakDisabled()}
                />
              </div>
              <div className={!loading && hasAudio ? 'reset-container' : 'reset-container dimmed'}>
                <Icon type="reset" />
                <a
                  href="#reset"
                  className="base--a reset-button"
                  onClick={this.onResetClick}
                >
                  Reset
                </a>
              </div>
            </div>
            <div className={`errorMessage ${error ? '' : 'hidden'}`}>
              <Icon type="error" />
              <p className="base--p service-error--message">
                {error ? error.error : ''}
              </p>
            </div>
            <div className={`text-center loading ${loading ? '' : 'hidden'}`}>
              <Icon type="loader" />
            </div>
            <audio autoPlay id="audio" className={`audio ${hasAudio ? '' : 'hidden'}`} controls="controls">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </section>
    );
  }
}

class ConditionalSpeakButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.checkBrowser();
  }

  checkBrowser() {
    this.setState({ canPlay: canPlayAudioFormat('audio/ogg;codecs=opus') });
  }

  render() {
    const { onClick, loading, disabled } = this.props;
    const { canPlay } = this.state;
    return (canPlay) ? (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={loading ? 'base--button speak-button loading' : 'base--button speak-button'}
      >
        Speak
      </button>
    ) : (
      <button
        type="button"
        onClick={onClick}
        className="base--button speak-button speak-disabled"
        title="Only available on Chrome and Firefox"
        disabled
      >
        Speak
      </button>
    );
  }
}

ConditionalSpeakButton.defaultProps = {
  disabled: false,
  onClick: s => s,
  loading: false,
};

ConditionalSpeakButton.propTypes = {
  disabled: PropType.bool,
  onClick: PropType.func,
  loading: PropType.bool,
};
