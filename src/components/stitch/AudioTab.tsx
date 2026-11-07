import React, { useState } from 'react';
import { audioEngine, AmbienceSoundType } from '../../utils/audioEngine';

interface AudioTabProps {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  sineVolume: number;
  onSineVolumeChange: (val: number) => void;
  rainVolume: number;
  onRainVolumeChange: (val: number) => void;
  selectedTimer: number | null;
  onTimerSelect: (mins: number) => void;
  currentTimeSecs: number;
  onSkip: (seconds: number) => void;
}

export type SolfeggioFrequency = {
  freq: number;
  name: string;
  chakra: string;
  benefit: string;
  color: string;
};

const FREQUENCIES: SolfeggioFrequency[] = [
  {
    freq: 432,
    name: 'Evrensel Rezonans',
    chakra: 'Zihin & Ruh',
    benefit: 'Hücresel rahatlama, sakin nabız ve derin zihinsel netlik',
    color: '#e7c355',
  },
  {
    freq: 528,
    name: 'DNA & Mucize Frekansı',
    chakra: 'Solar Pleksus',
    benefit: 'Dönüşüm, hücresel yenilenme ve biyolojik uyum',
    color: '#2dd4bf',
  },
  {
    freq: 396,
    name: 'Korkudan Arınma',
    chakra: 'Kök Çakra',
    benefit: 'Korku, kaygı ve negatif zihin döngülerini temizleme',
    color: '#f43f5e',
  },
  {
    freq: 639,
    name: 'Kalp Çakrası & Aşk',
    chakra: 'Kalp Çakrası',
    benefit: 'İlişkilerde şefkat, empati ve içsel barış frekansı',
    color: '#a855f7',
  },
];

const SOUNDSCAPE_ARTWORKS: Record<AmbienceSoundType, { url: string; title: string; subtitle: string }> = {
  fire_rain: {
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=700&q=80',
    title: 'Şömine Ateşi & Gece Yağmuru',
    subtitle: 'Kutsal Geometrik Rezonans & Sıcak Ahşap Çıtırtısı',
  },
  fireplace: {
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80',
    title: 'Sıcak Şömine Ateşi',
    subtitle: 'Köz Çıtırtısı & Huzurlu Güven Yuvası',
  },
  rain: {
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=700&q=80',
    title: 'Dağ Çamları & Gece Yağmuru',
    subtitle: 'Yapraklara Vuran Yağmur Damlaları',
  },
  waves: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    title: 'Como Gölü Dingin Dalgaları',
    subtitle: 'Kristal Berraklığında Su Dalgalanması',
  },
};

export const AudioTab: React.FC<AudioTabProps> = ({
  isAudioPlaying,
  onToggleAudio,
  onShowToast,
  sineVolume,
  onSineVolumeChange,
  rainVolume,
  onRainVolumeChange,
  selectedTimer,
  onTimerSelect,
  currentTimeSecs,
  onSkip,
}) => {
  const [ambienceType, setAmbienceType] = useState<AmbienceSoundType>(() => audioEngine.getAmbienceType());
  const [activeFrequency, setActiveFrequency] = useState<number>(() => audioEngine.getCurrentFrequency());
  const totalTimeSecs = 1260; // 21:00

  const currentArtwork = SOUNDSCAPE_ARTWORKS[ambienceType] || SOUNDSCAPE_ARTWORKS.fire_rain;
  const currentFreqData = FREQUENCIES.find((f) => f.freq === activeFrequency) || FREQUENCIES[0];

  const handleSkipClick = (seconds: number) => {
    onSkip(seconds);
    onShowToast(`${seconds > 0 ? '+10' : '-10'} saniye atlandı.`, 'fast_forward');
  };

  const handleMixerSine = (val: number) => {
    onSineVolumeChange(val);
    audioEngine.setVolume(val / 100);
  };

  const handleMixerRain = (val: number) => {
    onRainVolumeChange(val);
    audioEngine.setAmbienceLevel(val / 100);
  };

  const handleTimerSelect = (mins: number) => {
    onTimerSelect(mins);
    onShowToast(`Uyku zamanlayıcısı: ${mins} dakika ayarlandı.`, 'timer');
  };

  const handleFrequencyChange = (freq: number) => {
    setActiveFrequency(freq);
    audioEngine.setFrequency(freq);
    const item = FREQUENCIES.find((f) => f.freq === freq);
    onShowToast(`🎵 ${freq}Hz ${item?.name || ''} aktif edildi.`, 'graphic_eq');
  };

  const handleSelectAmbience = (type: AmbienceSoundType) => {
    setAmbienceType(type);
    audioEngine.setAmbienceType(type);
    const art = SOUNDSCAPE_ARTWORKS[type];
    onShowToast(`🌿 ${art.title} seçildi.`, 'spa');
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTimeSecs / totalTimeSecs) * 100));

  return (
    <section className="audio-tab-root flex flex-col w-full max-w-lg sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 space-y-6 animate-fadeIn pb-20 sm:pb-16 select-none box-border">
      {/* Title Header */}
      <div className="flex flex-col items-center text-center pt-2">
        <span className="text-[11px] sm:text-xs font-bold text-[#e7c355] tracking-widest uppercase mb-1">
          Nöro-Akustik Frekans Mâbedi
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#dee0ff]">
          {activeFrequency}Hz Kutsal Rezonans Çaları
        </h2>
        <p className="text-xs sm:text-sm text-[#c7c4d7] mt-1 max-w-md">
          {currentFreqData.name} • {currentFreqData.benefit}
        </p>
      </div>

      {/* Sacred Frequency Pill Selector */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
        {FREQUENCIES.map((item) => {
          const isActive = activeFrequency === item.freq;
          return (
            <button
              key={item.freq}
              type="button"
              onClick={() => handleFrequencyChange(item.freq)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                isActive
                  ? 'bg-[#e7c355] text-[#3d2f00] font-bold border-[#e7c355] shadow-[0_0_15px_rgba(231,195,85,0.4)] scale-105'
                  : 'bg-[#181427]/80 hover:bg-[#252038] text-[#c7c4d7] hover:text-white border-white/10'
              }`}
            >
              <span className="font-mono">{item.freq}Hz</span>
              <span className="hidden sm:inline font-normal opacity-90">• {item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Responsive Grid for Tablets (2 Columns) & Phones (1 Column Stack) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Left Column: Sacred Geometric Disc Artwork & Playback Transport */}
        <div className="audio-player-hero flex flex-col items-center space-y-5">
          {/* Sacred Geometric Pulsing Disc Artwork */}
          <div className="relative flex items-center justify-center py-2 sm:py-3">
            {/* Glowing Aura Ring */}
            <div
              className={`absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-[#e7c355]/25 via-[#c0c1ff]/20 to-[#7bd0ff]/20 blur-xl transition-all duration-1000 ${
                isAudioPlaying ? 'scale-110 opacity-100 animate-pulse' : 'scale-90 opacity-30'
              }`}
            />

            {/* Outer Rotating Starlight Halo */}
            <div
              className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[#e7c355]/35 p-2 flex items-center justify-center transition-transform duration-700 ${
                isAudioPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '36s' }}
            >
              <div className="w-full h-full rounded-full border border-dashed border-[#e7c355]/50 p-2 flex items-center justify-center">
                {/* Center Mandala Artwork Container */}
                <div className="audio-disc-container w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(231,195,85,0.4)] relative">
                  <img
                    src={currentArtwork.url}
                    alt={currentArtwork.title}
                    key={currentArtwork.url}
                    className="audio-mandala-img w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle Gradient Vignette with 0% opacity block in Day Mode */}
                  <div className="audio-mandala-overlay absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="audio-frequency-badge font-mono text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {activeFrequency} Hz
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Track Meta & Active Soundscape */}
          <div className="text-center space-y-1">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#dee0ff]">
              {currentArtwork.title}
            </h3>
            <span className="text-xs text-[#c7c4d7] block">
              {activeFrequency}Hz Saf Sinüs Dalgası • {currentArtwork.subtitle}
            </span>
          </div>

          {/* Live Audio Equalizer Waveform Bars (16 Dynamic Frequency Bands) */}
          <div className="flex items-center justify-center gap-1 h-8 px-4 w-full max-w-xs">
            {[4, 8, 14, 22, 16, 26, 18, 12, 20, 24, 15, 25, 10, 18, 12, 6].map((baseH, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isAudioPlaying ? 'bg-gradient-to-t from-[#8083ff] to-[#e7c355]' : 'bg-[#c7c4d7]/30'
                }`}
                style={{
                  height: isAudioPlaying
                    ? `${Math.max(6, Math.min(28, baseH + ((idx * 3) % 9)))}px`
                    : '4px',
                  animation: isAudioPlaying ? `eqWave 0.${6 + (idx % 5)}s infinite ease-in-out ${(idx * 0.08).toFixed(2)}s` : 'none',
                }}
              />
            ))}
          </div>

          {/* Seek Progress Bar */}
          <div className="flex flex-col space-y-1.5 w-full max-w-sm px-2">
            <div className="w-full bg-[#1a1e35] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8083ff] to-[#e7c355] rounded-full shadow-[0_0_8px_#e7c355] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#c7c4d7]">
              <span>{formatSecs(currentTimeSecs)}</span>
              <span>21:00</span>
            </div>
          </div>

          {/* Main Playback Action Buttons */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              type="button"
              onClick={() => handleSkipClick(-10)}
              title="-10 saniye geri sar"
              className="w-12 h-12 rounded-full bg-[#252840] flex items-center justify-center text-[#c7c4d7] hover:text-[#dee0ff] active:scale-90 transition-all border border-white/5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">replay_10</span>
            </button>

            <button
              type="button"
              onClick={onToggleAudio}
              title={isAudioPlaying ? 'Durdur' : 'Oynat'}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ffe089] to-[#e7c355] text-[#3d2f00] flex items-center justify-center shadow-[0_0_30px_rgba(231,195,85,0.45)] active:scale-95 transition-transform cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isAudioPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSkipClick(10)}
              title="+10 saniye ileri sar"
              className="w-12 h-12 rounded-full bg-[#252840] flex items-center justify-center text-[#c7c4d7] hover:text-[#dee0ff] active:scale-90 transition-all border border-white/5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">forward_10</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dual-Channel Neuro-Acoustic Mixer & Sleep Timer */}
        <div className="flex flex-col space-y-5">
          {/* Sleep Timer Selector Pills */}
          <div className="rounded-2xl bg-[#252840]/60 p-4 border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#e7c355]">timer</span>
              <span className="text-xs font-semibold text-[#dee0ff]">Uyku Sayacı:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleTimerSelect(mins)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedTimer === mins
                      ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-[0_0_10px_rgba(231,195,85,0.3)]'
                      : 'bg-[#1a1e35] text-[#c7c4d7] hover:text-[#dee0ff]'
                  }`}
                >
                  {mins} dk
                </button>
              ))}
              {selectedTimer && (
                <button
                  type="button"
                  onClick={() => {
                    onTimerSelect(0);
                    onShowToast('Uyku sayacı kapatıldı.', 'timer_off');
                  }}
                  className="text-xs text-[#c7c4d7] hover:text-white underline ml-1 cursor-pointer"
                >
                  Kapat
                </button>
              )}
            </div>
          </div>

          {/* Dual-Channel Neuro-Acoustic Mixer Card */}
          <div className="rounded-2xl bg-[#252840]/75 backdrop-blur-xl p-5 sm:p-6 space-y-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-semibold text-[#dee0ff] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#e7c355]">tune</span>
                <span>Canlı Katman Mikseri</span>
              </span>
              <span className="text-[11px] text-[#e7c355] bg-[#e7c355]/10 px-2.5 py-0.5 rounded-full border border-[#e7c355]/20 font-mono font-semibold">
                ÇİFT KANAL
              </span>
            </div>

            {/* Quick Ritual Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => {
                  handleFrequencyChange(396);
                  handleMixerSine(65);
                  handleMixerRain(80);
                  handleSelectAmbience('rain');
                  if (!isAudioPlaying) onToggleAudio();
                  onShowToast('🌙 Derin Uyku Ritüeli (396Hz + Gece Yağmuru)', 'bedtime');
                }}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-[#1a1e35] text-[#c7c4d7] hover:text-white border border-white/5 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">bedtime</span>
                <span>Derin Uyku</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleFrequencyChange(432);
                  handleMixerSine(80);
                  handleMixerRain(55);
                  handleSelectAmbience('fire_rain');
                  if (!isAudioPlaying) onToggleAudio();
                  onShowToast('✨ Manifestasyon (432Hz + Şömine & Yağmur)', 'auto_awesome');
                }}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-[#1a1e35] text-[#c7c4d7] hover:text-white border border-white/5 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-[#e7c355]">auto_awesome</span>
                <span>Manifestasyon</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleFrequencyChange(528);
                  handleMixerSine(85);
                  handleMixerRain(40);
                  handleSelectAmbience('waves');
                  if (!isAudioPlaying) onToggleAudio();
                  onShowToast('🌊 DNA Şifası (528Hz + Göl Dalgaları)', 'water');
                }}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-[#1a1e35] text-[#c7c4d7] hover:text-white border border-white/5 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-[#2dd4bf]">spa</span>
                <span>DNA Şifası</span>
              </button>
            </div>

            {/* Channel 1: Solfeggio Sine Wave Slider */}
            <div className="flex flex-col space-y-2.5 bg-[#1a1e35]/70 p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                <span className="text-[#dee0ff] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#e7c355]">graphic_eq</span>
                  <span>Kanal 1: {activeFrequency}Hz Saf Sinüs</span>
                  {isAudioPlaying && sineVolume > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#e7c355] animate-ping ml-1" />
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMixerSine(sineVolume === 0 ? 80 : 0)}
                    className="text-[10px] text-[#e7c355] hover:underline"
                  >
                    {sineVolume === 0 ? 'Aç' : 'Sustur'}
                  </button>
                  <span className="text-[#e7c355] font-mono font-bold">%{sineVolume}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sineVolume}
                onChange={(e) => handleMixerSine(Number(e.target.value))}
                className="w-full accent-[#e7c355] h-2 bg-[#080c22] rounded-lg cursor-pointer"
              />
            </div>

            {/* Channel 2: Acoustic Nature Soundscape Selector & Slider */}
            <div className="flex flex-col space-y-2.5 bg-[#1a1e35]/70 p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                <span className="text-[#dee0ff] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">rainy</span>
                  <span>Kanal 2: Gerçek Akustik Doğa</span>
                  {isAudioPlaying && rainVolume > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse ml-1" />
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMixerRain(rainVolume === 0 ? 70 : 0)}
                    className="text-[10px] text-[#7bd0ff] hover:underline"
                  >
                    {rainVolume === 0 ? 'Aç' : 'Sustur'}
                  </button>
                  <span className="text-[#7bd0ff] font-mono font-bold">%{rainVolume}</span>
                </div>
              </div>

              {/* Soundscape Type Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                {[
                  { id: 'fire_rain', label: 'Şömine & Yağmur', icon: 'local_fire_department' },
                  { id: 'fireplace', label: 'Şömine Ateşi', icon: 'fireplace' },
                  { id: 'rain', label: 'Gece Yağmuru', icon: 'water_drop' },
                  { id: 'waves', label: 'Göl Dalgaları', icon: 'water' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectAmbience(s.id as AmbienceSoundType)}
                    className={`py-2 px-1.5 rounded-xl text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      ambienceType === s.id
                        ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-sm'
                        : 'bg-[#080c22] text-[#c7c4d7] hover:text-white border border-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px] shrink-0">{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={rainVolume}
                onChange={(e) => handleMixerRain(Number(e.target.value))}
                className="w-full accent-[#e7c355] h-2 bg-[#080c22] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Biological Resonance Explanation Pill */}
          <div className="rounded-xl bg-[#1a1e35]/40 p-3.5 border border-white/5 text-xs text-[#c7c4d7] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#e7c355] shrink-0 mt-0.5">
              auto_awesome
            </span>
            <p className="leading-relaxed font-light">
              <strong>{activeFrequency}Hz &amp; Schumann Rezonansı (7.83Hz):</strong> Ses motorumuz saf sinüs dalgaları ile gerçek stüdyo doğa kayıtlarını çift kanallı gapless teknolojiyle birleştirir. Beyin dalgalarınızı alfa ve teta frekanslarına senkronize ederek derin içsel denge sunar.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Safe Bottom Clearance Spacer */}
      <div className="h-16 sm:h-10 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </section>
  );
};
