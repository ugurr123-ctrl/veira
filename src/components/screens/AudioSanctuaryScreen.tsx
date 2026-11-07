import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  Wind,
  Sparkles,
  Timer,
  RotateCcw,
  Waves,
} from 'lucide-react';
import { SolfeggioFrequency } from '../../types';
import { SOLFEGGIO_FREQUENCIES } from '../../utils/storage';
import { audioEngine } from '../../utils/audioEngine';

interface AudioSanctuaryScreenProps {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onTriggerConfetti: () => void;
}

export const AudioSanctuaryScreen: React.FC<AudioSanctuaryScreenProps> = ({
  isAudioPlaying,
  onToggleAudio,
  onTriggerConfetti,
}) => {
  const [selectedFreq, setSelectedFreq] = useState<SolfeggioFrequency>(SOLFEGGIO_FREQUENCIES[0]);
  const [volume, setVolume] = useState<number>(0.4);
  const [ambienceLevel, setAmbienceLevel] = useState<number>(0.2);

  // Meditation / Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(15 * 60); // 15 mins default
  const [initialTimerSeconds, setInitialTimerSeconds] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Breath cycle state (0: Inhale, 1: Hold, 2: Exhale, 3: Rest)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Stillness'>('Inhale');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            audioEngine.playCelestialChime(1080);
            onTriggerConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, onTriggerConfetti]);

  // Breathing circle cycle (4-4-4-4 box breath)
  useEffect(() => {
    if (!isAudioPlaying && !isTimerRunning) return;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Stillness'> = ['Inhale', 'Hold', 'Exhale', 'Stillness'];
    let idx = 0;
    const breathInterval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathPhase(phases[idx]);
    }, 4000);

    return () => clearInterval(breathInterval);
  }, [isAudioPlaying, isTimerRunning]);

  const handleSelectFrequency = (freq: SolfeggioFrequency) => {
    setSelectedFreq(freq);
    audioEngine.setFrequency(freq.freq);
    if (!isAudioPlaying) {
      onToggleAudio();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
  };

  const handleAmbienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmbienceLevel(val);
    audioEngine.setAmbienceLevel(val);
  };

  const setTimerPreset = (minutes: number) => {
    setIsTimerRunning(false);
    const secs = minutes * 60;
    setInitialTimerSeconds(secs);
    setTimerSeconds(secs);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 md:p-10 border border-white/10 text-center max-w-3xl mx-auto">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-[#818cf8] tracking-widest uppercase font-medium bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
            <Headphones className="w-3.5 h-3.5 text-[#f5d061]" />
            <span>432Hz Harmonic Sound Sanctuary</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-semibold text-[#fdf4dc] leading-tight">
            Vibrational Alignment with Cosmic Frequencies
          </h1>

          <p className="text-[#c7c4d7] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            432Hz vibrates in sacred geometry with natural biology, water crystals, and neural alpha rhythms. Experience synthesized Solfeggio soundscapes designed for unhurried focus and nocturnal peace.
          </p>
        </div>

        {/* Central Luminous Breath Orb */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            {/* Outer pulsating glow */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isAudioPlaying
                  ? 'bg-gradient-to-tr from-[#6366f1]/30 via-[#f5d061]/20 to-[#38bdf8]/30 blur-2xl animate-pulse'
                  : 'bg-white/5 blur-xl'
              }`}
              style={{
                transform:
                  breathPhase === 'Inhale'
                    ? 'scale(1.2)'
                    : breathPhase === 'Hold'
                    ? 'scale(1.2)'
                    : 'scale(0.85)',
                transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            {/* Inner Sacred Geometric Circle */}
            <div
              className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full glass-panel-elevated flex flex-col items-center justify-center border border-white/20 p-4 text-center cursor-pointer transition-transform"
              onClick={onToggleAudio}
            >
              <button
                type="button"
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all ${
                  isAudioPlaying
                    ? 'bg-[#f5d061] text-[#080a16] shadow-[0_0_20px_#f5d061]'
                    : 'bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                }`}
              >
                {isAudioPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <span className="font-editorial text-lg font-bold text-[#fdf4dc] tabular-nums">
                {selectedFreq.name}
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#818cf8]">
                {breathPhase}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#c7c4d7]/70 mt-2 font-mono">
            {isAudioPlaying ? 'Harmonic tone active · Breathe with the orb' : 'Tap orb to initiate soundscape'}
          </p>
        </div>

        {/* Master Controls: Frequency Vol & Cosmic Noise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4 border-t border-white/10 text-left">
          {/* Tone Volume */}
          <div className="p-3 rounded-xl bg-[#080a16]/50 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#dee0ff]">
                <Volume2 className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Tone Volume</span>
              </span>
              <span className="font-mono text-[#f5d061] tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-[#818cf8] cursor-pointer"
            />
          </div>

          {/* Cosmic Void Noise */}
          <div className="p-3 rounded-xl bg-[#080a16]/50 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#dee0ff]">
                <Wind className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Cosmic Drift Void</span>
              </span>
              <span className="font-mono text-[#38bdf8] tabular-nums">{Math.round(ambienceLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambienceLevel}
              onChange={handleAmbienceChange}
              className="w-full accent-[#38bdf8] cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Focus & Meditation Timer */}
      <section className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f5d061] uppercase tracking-wider">
              <Timer className="w-4 h-4" />
              <span>Contemplative Focus Timer</span>
            </div>
            <p className="text-xs text-[#c7c4d7]">
              Time-bracketed stillness for meditation, writing, or deep design creation.
            </p>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[5, 15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setTimerPreset(mins)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  initialTimerSeconds === mins * 60
                    ? 'bg-[#f5d061] text-[#080a16] font-semibold'
                    : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10 border border-white/10'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display and Controls */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#080a16]/40 border border-white/10 space-y-4">
          <span className="font-editorial text-5xl sm:text-6xl font-bold tracking-tight text-[#fdf4dc] tabular-nums">
            {formatTime(timerSeconds)}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isAudioPlaying && !isTimerRunning) {
                  onToggleAudio();
                }
                setIsTimerRunning(!isTimerRunning);
              }}
              className="btn-celestial-primary text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full flex items-center gap-2"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Pause Stillness' : 'Begin Stillness'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(initialTimerSeconds);
              }}
              className="btn-ghost-glass p-2.5 rounded-full text-[#c7c4d7] hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Solfeggio & Harmonic Frequency Matrix */}
      <section className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#818cf8] uppercase tracking-wider">
            <Waves className="w-4 h-4" />
            <span>Solfeggio Harmonic Matrix</span>
          </div>
          <span className="text-[11px] text-[#c7c4d7]/70">
            Select to tune the harmonic oscillator
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLFEGGIO_FREQUENCIES.map((freq) => {
            const isSelected = selectedFreq.id === freq.id;
            return (
              <div
                key={freq.id}
                onClick={() => handleSelectFrequency(freq)}
                className={`p-5 rounded-2xl glass-panel cursor-pointer transition-all duration-200 space-y-3 ${
                  isSelected
                    ? 'border-[#f5d061]/50 bg-[#6366f1]/15 shadow-[0_0_20px_rgba(99,102,241,0.25)] -translate-y-1'
                    : 'hover:border-[#818cf8]/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-editorial text-2xl font-bold text-[#fdf4dc] tabular-nums block">
                      {freq.name}
                    </span>
                    <span className="text-xs font-medium text-[#818cf8]">
                      {freq.subtitle}
                    </span>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: freq.color }}
                  />
                </div>

                <p className="text-xs text-[#c7c4d7]/80 leading-relaxed">
                  {freq.description}
                </p>

                <div className="pt-2 border-t border-white/10 text-[11px] font-medium text-[#f5d061]">
                  ✦ {freq.chakraOrBenefit}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
