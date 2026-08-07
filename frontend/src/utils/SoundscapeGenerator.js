/**
 * Web Audio API Synthesized Ambient Soundscape Generator
 * Generates soothing procedural audio 100% in-browser with zero external asset files.
 * Tracks:
 * - 'rain': Soft Pink Noise filtered like gentle rain drops
 * - 'alpha': 432Hz Deep Space Binaural Alpha Wave sine tone
 * - 'breeze': Modulated low-pass ambient wind breeze
 */

class SoundscapeGenerator {
  constructor() {
    this.audioCtx = null;
    this.currentTrack = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.volume = 0.3;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(newVol) {
    this.volume = Math.max(0, Math.min(1, newVol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  stop() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  playTrack(trackName) {
    this.initContext();
    if (!this.audioCtx) return;

    if (this.currentTrack === trackName) {
      this.stop();
      return false;
    }

    this.stop();
    this.currentTrack = trackName;

    if (trackName === 'rain') {
      this._createRainTrack();
    } else if (trackName === 'alpha') {
      this._createAlphaWaveTrack();
    } else if (trackName === 'breeze') {
      this._createBreezeTrack();
    }
    return true;
  }

  // 1. Soft Pink Noise Rain Synthesizer
  _createRainTrack() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter);
  }

  // 2. 432Hz Deep Space Binaural Alpha Wave
  _createAlphaWaveTrack() {
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, this.audioCtx.currentTime); // 432Hz harmonic base

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(226, this.audioCtx.currentTime); // 10Hz Alpha beat difference

    gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2, gainNode);
  }

  // 3. Modulated Forest Breeze Synthesizer
  _createBreezeTrack() {
    const bufferSize = this.audioCtx.sampleRate * 3;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(3, this.audioCtx.currentTime);

    // LFO to modulate breeze intensity
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.audioCtx.currentTime); // 0.2Hz wave
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(150, this.audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }
}

export const soundscapes = new SoundscapeGenerator();
