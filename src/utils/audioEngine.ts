/**
 * Veira Nocturnal Audio Sanctuary Engine
 * High-purity 432Hz harmonic soundscapes + Seamless Infinite Acoustic Nature Recordings.
 * 
 * Features:
 * - Channel 1: 432Hz Pure Harmonic Sine Tone + 7.83Hz Schumann Resonance Binaural Beat (Continuous Web Audio Oscillators)
 * - Channel 2: Studio Acoustic Nature Recording with Dual-Voice Equal-Power Seamless Crossfade (ZERO GAP, NO SUDDEN RESTARTS)
 * - Channel Switching: Silky smooth 0.6s crossfades (no clicks or cuts)
 */

export type AmbienceSoundType = 'fire_rain' | 'fireplace' | 'rain' | 'waves';

class NocturnalAudioEngine {
  private ctx: AudioContext | null = null;

  // Channel 1 Nodes (432Hz Sine & Binaural Beat)
  private primaryOsc: OscillatorNode | null = null;
  private secondaryOsc: OscillatorNode | null = null;
  private binauralOsc: OscillatorNode | null = null;
  private sineGain: GainNode | null = null;

  // Channel 2 Nodes (Gapless Equal-Power Crossfade Nature Engine)
  private channel2MasterGain: GainNode | null = null;
  private audioBufferCache: Map<AmbienceSoundType, AudioBuffer> = new Map();
  private isLoadingBuffer: boolean = false;

  // Dual-voice crossfading state for seamless infinite loops
  private activeVoiceGain: GainNode | null = null;
  private nextVoiceGain: GainNode | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;
  private loopTimer: NodeJS.Timeout | null = null;
  private currentBuffer: AudioBuffer | null = null;

  // Master Gain Node
  private masterGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private currentFrequency: number = 432;
  private volume: number = 0.85; // Channel 1 (432Hz Sine) default 0.0 - 1.0
  private cosmicAmbienceLevel: number = 0.60; // Channel 2 (Nature Ambience) default 0.0 - 1.0
  private currentAmbienceType: AmbienceSoundType = 'fire_rain';

  public initContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentFrequency(): number {
    return this.currentFrequency;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getAmbienceLevel(): number {
    return this.cosmicAmbienceLevel;
  }

  public getAmbienceType(): AmbienceSoundType {
    return this.currentAmbienceType;
  }

  /**
   * Channel 1 Volume: 432Hz Harmonic Sine Tone (0.0 to 1.0)
   */
  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.sineGain && this.ctx) {
      this.sineGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Channel 2 Volume: Acoustic Nature Recording (0.0 to 1.0)
   */
  public setAmbienceLevel(val: number) {
    this.cosmicAmbienceLevel = Math.max(0, Math.min(1, val));
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.channel2MasterGain && this.ctx) {
      this.channel2MasterGain.gain.setTargetAtTime(this.cosmicAmbienceLevel, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Sound file path resolver
   */
  private getSoundFile(type: AmbienceSoundType): string {
    switch (type) {
      case 'fireplace':
        return '/audio/fireplace.mp3';
      case 'rain':
        return '/audio/rain.mp3';
      case 'waves':
        return '/audio/lake_waves.mp3';
      case 'fire_rain':
      default:
        return '/audio/rain_and_fire.mp3';
    }
  }

  /**
   * Pre-fetches and decodes the audio buffer into RAM for zero-latency gapless playback
   */
  private async loadAudioBuffer(type: AmbienceSoundType): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(type)) {
      return this.audioBufferCache.get(type)!;
    }

    this.initContext();
    if (!this.ctx) return null;

    try {
      this.isLoadingBuffer = true;
      const url = this.getSoundFile(type);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} loading ${url}`);
      const arrayBuffer = await res.arrayBuffer();
      const decodedBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.audioBufferCache.set(type, decodedBuffer);
      this.isLoadingBuffer = false;
      return decodedBuffer;
    } catch (err) {
      console.warn('Failed to load/decode audio buffer:', err);
      this.isLoadingBuffer = false;
      return null;
    }
  }

  /**
   * Select Nature Soundscape:
   * Smoothly crossfades to new sound without abrupt cuts
   */
  public async setAmbienceType(type: AmbienceSoundType) {
    if (this.currentAmbienceType === type && this.currentBuffer) return;
    this.currentAmbienceType = type;

    if (!this.isPlaying || !this.ctx || !this.channel2MasterGain) return;

    // Smoothly fade down Channel 2 gain, switch buffer, and fade back up
    const t = this.ctx.currentTime;
    this.channel2MasterGain.gain.linearRampToValueAtTime(0.001, t + 0.4);

    const buffer = await this.loadAudioBuffer(type);
    if (buffer && this.isPlaying) {
      setTimeout(() => {
        this.stopNatureLoop();
        this.startGaplessNatureLoop(buffer);
        if (this.channel2MasterGain && this.ctx) {
          this.channel2MasterGain.gain.linearRampToValueAtTime(this.cosmicAmbienceLevel, this.ctx.currentTime + 0.4);
        }
      }, 420);
    }
  }

  /**
   * Starts the gapless dual-voice ping-pong crossfading loop
   * Voice A plays -> 3 seconds before end, Voice B fades in while Voice A fades out -> repeat indefinitely!
   */
  private startGaplessNatureLoop(buffer: AudioBuffer) {
    if (!this.ctx || !this.channel2MasterGain) return;

    this.currentBuffer = buffer;
    const duration = buffer.duration;
    // Crossfade window: 2.5 seconds overlap
    const crossfadeSec = Math.min(3.0, duration * 0.2);

    const scheduleNextVoice = (isVoiceA: boolean) => {
      if (!this.isPlaying || !this.ctx || !this.channel2MasterGain) return;

      const now = this.ctx.currentTime;
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const voiceGain = this.ctx.createGain();
      // Fade in smoothly over crossfadeSec
      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.linearRampToValueAtTime(1.0, now + crossfadeSec);

      source.connect(voiceGain);
      voiceGain.connect(this.channel2MasterGain);

      source.start(now);

      if (isVoiceA) {
        // Fade out previous Voice B if active
        if (this.nextVoiceGain) {
          this.nextVoiceGain.gain.linearRampToValueAtTime(0.001, now + crossfadeSec);
          const oldNext = this.nextSource;
          setTimeout(() => {
            try {
              oldNext?.stop();
              oldNext?.disconnect();
            } catch {}
          }, (crossfadeSec + 0.1) * 1000);
        }
        this.activeSource = source;
        this.activeVoiceGain = voiceGain;
      } else {
        // Fade out previous Voice A
        if (this.activeVoiceGain) {
          this.activeVoiceGain.gain.linearRampToValueAtTime(0.001, now + crossfadeSec);
          const oldActive = this.activeSource;
          setTimeout(() => {
            try {
              oldActive?.stop();
              oldActive?.disconnect();
            } catch {}
          }, (crossfadeSec + 0.1) * 1000);
        }
        this.nextSource = source;
        this.nextVoiceGain = voiceGain;
      }

      // Schedule next crossfade before this voice finishes
      const timeUntilCrossfade = Math.max(1, duration - crossfadeSec);
      this.loopTimer = setTimeout(() => {
        scheduleNextVoice(!isVoiceA);
      }, timeUntilCrossfade * 1000);
    };

    scheduleNextVoice(true);
  }

  private stopNatureLoop() {
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }

    try {
      this.activeSource?.stop();
      this.activeSource?.disconnect();
      this.nextSource?.stop();
      this.nextSource?.disconnect();
      this.activeVoiceGain?.disconnect();
      this.nextVoiceGain?.disconnect();
    } catch {}

    this.activeSource = null;
    this.nextSource = null;
    this.activeVoiceGain = null;
    this.nextVoiceGain = null;
  }

  public async startTone(frequency: number = 432) {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying) {
      this.setFrequency(frequency);
      return;
    }

    this.currentFrequency = frequency;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + 0.3);
    this.masterGain.connect(this.ctx.destination);

    // =========================================================================
    // CHANNEL 1: 432Hz Pure Sine Tone + 2nd Harmonic + Schumann Binaural Beat
    // =========================================================================
    this.sineGain = this.ctx.createGain();
    this.sineGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.sineGain.connect(this.masterGain);

    const sineFilter = this.ctx.createBiquadFilter();
    sineFilter.type = 'lowpass';
    sineFilter.frequency.setValueAtTime(frequency * 3.5, this.ctx.currentTime);
    sineFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
    sineFilter.connect(this.sineGain);

    // Primary 432Hz Pure Sine
    this.primaryOsc = this.ctx.createOscillator();
    this.primaryOsc.type = 'sine';
    this.primaryOsc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    const primaryGain = this.ctx.createGain();
    primaryGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.primaryOsc.connect(primaryGain);
    primaryGain.connect(sineFilter);

    // 2nd Harmonic (subtle overtone)
    this.secondaryOsc = this.ctx.createOscillator();
    this.secondaryOsc.type = 'sine';
    this.secondaryOsc.frequency.setValueAtTime(frequency * 1.5, this.ctx.currentTime);

    const secondaryGain = this.ctx.createGain();
    secondaryGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.secondaryOsc.connect(secondaryGain);
    secondaryGain.connect(sineFilter);

    // Binaural Alpha Beat (7.83Hz Schumann resonance beat offset)
    this.binauralOsc = this.ctx.createOscillator();
    this.binauralOsc.type = 'sine';
    this.binauralOsc.frequency.setValueAtTime(frequency + 7.83, this.ctx.currentTime);

    const binauralGain = this.ctx.createGain();
    binauralGain.gain.setValueAtTime(0.16, this.ctx.currentTime);
    this.binauralOsc.connect(binauralGain);
    binauralGain.connect(sineFilter);

    // =========================================================================
    // CHANNEL 2: Seamless Dual-Voice Crossfading Acoustic Nature Engine
    // =========================================================================
    this.channel2MasterGain = this.ctx.createGain();
    this.channel2MasterGain.gain.setValueAtTime(this.cosmicAmbienceLevel, this.ctx.currentTime);
    this.channel2MasterGain.connect(this.masterGain);

    // Start oscillators immediately
    this.primaryOsc.start();
    this.secondaryOsc.start();
    this.binauralOsc.start();

    this.isPlaying = true;

    // Load and initiate the gapless crossfaded nature audio buffer
    const buffer = await this.loadAudioBuffer(this.currentAmbienceType);
    if (buffer && this.isPlaying) {
      this.startGaplessNatureLoop(buffer);
    }
  }

  public setFrequency(frequency: number) {
    this.currentFrequency = frequency;
    if (!this.isPlaying || !this.ctx) return;

    const t = this.ctx.currentTime;
    if (this.primaryOsc) {
      this.primaryOsc.frequency.setTargetAtTime(frequency, t, 0.3);
    }
    if (this.secondaryOsc) {
      this.secondaryOsc.frequency.setTargetAtTime(frequency * 1.5, t, 0.3);
    }
    if (this.binauralOsc) {
      this.binauralOsc.frequency.setTargetAtTime(frequency + 7.83, t, 0.3);
    }
  }

  public stopTone() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0.001, t + 0.3);

    // Stop nature loop smoothly
    this.stopNatureLoop();

    setTimeout(() => {
      try {
        this.primaryOsc?.stop();
        this.primaryOsc?.disconnect();
        this.secondaryOsc?.stop();
        this.secondaryOsc?.disconnect();
        this.binauralOsc?.stop();
        this.binauralOsc?.disconnect();
        this.sineGain?.disconnect();
        this.channel2MasterGain?.disconnect();
      } catch {
        // Safe tear down
      }
      this.isPlaying = false;
      this.primaryOsc = null;
      this.secondaryOsc = null;
      this.binauralOsc = null;
      this.sineGain = null;
      this.channel2MasterGain = null;
      this.currentBuffer = null;
    }, 350);
  }

  public toggleTone(frequency: number = 432): boolean {
    if (this.isPlaying) {
      this.stopTone();
      return false;
    } else {
      this.startTone(frequency);
      return true;
    }
  }

  /**
   * Delicate Tibetan / Starlight Chime for completed goals, habits, and manifest confirmations
   */
  public playCelestialChime(pitch: number = 864) {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(pitch * 2, now + 0.4);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  }
}

export const audioEngine = new NocturnalAudioEngine();
