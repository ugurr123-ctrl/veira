import React, { useState, useEffect } from 'react';
import { StitchTab } from './StitchHeader';
import { triggerNeurologicalReinforcement } from '../../utils/neurologicalFeedback';
import { useUnifiedVisions } from '../../utils/unifiedStorage';
import { audioEngine } from '../../utils/audioEngine';
import {
  DailyIntention,
  getTodayIntention,
  cycleNextIntention,
  getRandomIntention,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendBrowserNotification,
} from '../../utils/dailyIntentions';
import { getStoredNatalChart } from '../../utils/astrologyCalculator';
import { calculateMoonPhase } from '../../utils/dailyAstroEngine';
import { useDailyReflection, DailyReflection } from '../../services/dailyReflectionService';

interface TodayTabProps {
  onSwitchTab: (tab: StitchTab) => void;
  onShowToast: (msg: string, icon?: string) => void;
  streak: number;
  onIncrementStreak: () => void;
  onPlayChime: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  onSwitchTab,
  onShowToast,
  streak,
  onIncrementStreak,
  onPlayChime,
}) => {
  const {
    visions,
    allDailyTasks,
    completedDailyTasksCount,
    totalDailyTasksCount,
    dailyProgressPercent,
    toggleDailyTask,
    addDailyTaskToVision,
  } = useUnifiedVisions();

  // Profile name
  const [profileName] = useState<string>(() => {
    try {
      return localStorage.getItem('veira_profile_fullname') || 'Selin';
    } catch {
      return 'Selin';
    }
  });

  // Dynamic Daily Intention
  const [dailyIntention, setDailyIntention] = useState<DailyIntention>(() => getTodayIntention());
  const [isRotatingIntention, setIsRotatingIntention] = useState(false);
  const [isGeneratingAiIntention, setIsGeneratingAiIntention] = useState(false);

  // Notification Permissions System
  const [notifPermission, setNotifPermission] = useState<string>(() => {
    return getNotificationPermission();
  });
  const [isRequestingNotif, setIsRequestingNotif] = useState(false);

  // Daily Reflection Background Service & State
  const {
    reflection,
    isLoading: isReflectionLoading,
    history: reflectionHistory,
    refreshReflection,
    playReflectionChime,
  } = useDailyReflection();

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [copiedReflection, setCopiedReflection] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<DailyReflection | null>(null);

  const handleRequestNotification = async () => {
    setIsRequestingNotif(true);
    const granted = await requestNotificationPermission();
    setNotifPermission(getNotificationPermission());
    setIsRequestingNotif(false);
    if (granted) {
      onPlayChime();
      onShowToast('🔔 Zarif bildirimler aktif edildi! Niyet & Tefekkür hatırlatıcıları hazır.', 'notifications');
      sendBrowserNotification(
        {
          id: 'welcome-veira',
          tag: 'Kozmik Hoş Geldin',
          quote: 'Bugünün sessiz adımları, yarının görkemli zaferleridir.',
          subtext: 'Veira ile her niyetin ve tamamlanan görevin sevgiyle korunuyor.',
          category: 'dinginlik',
        },
        true
      );
    } else {
      onShowToast('Bildirim izni verilmedi veya tarayıcıda engellendi.', 'info');
    }
  };

  const handleSendTestNotification = () => {
    if (notifPermission !== 'granted') {
      handleRequestNotification();
      return;
    }
    const testIntention: DailyIntention = {
      id: 'test-now',
      tag: 'Tefekkür Hatırlatıcısı',
      quote: reflection?.title || 'Bugün attığın her adım ruhunun geleceğe mührüdür.',
      subtext: reflection?.eveningMantra || 'Huzur ve tatminle akşamın dinginliğine bırak kendini.',
      category: 'sukran',
    };
    const sent = sendBrowserNotification(testIntention, true);
    if (sent) {
      onPlayChime();
      onShowToast('🔔 Test bildirimi cihazına başarıyla gönderildi!', 'notifications');
    } else {
      onShowToast('Bildirim gönderilemedi. Tarayıcı izinlerini kontrol edin.', 'info');
    }
  };

  const handleCopyReflection = (targetRef: DailyReflection | null = reflection) => {
    if (!targetRef) return;
    const textToCopy = `✦ VEIRA • GÜNÜN TEFEKKÜRÜ (${targetRef.date}) ✦\n"${targetRef.title}"\n\n${targetRef.strophe.join('\n')}\n\n${targetRef.narrative}\n\n✦ Geceye Soru: ${targetRef.mindfulnessPrompt}\n✦ Uyku Mantrası: "${targetRef.eveningMantra}"`;
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopiedReflection(true);
      onShowToast('✨ Şiirsel tefekkür panoya kopyalandı!', 'content_copy');
      setTimeout(() => setCopiedReflection(false), 2500);
    } catch {
      onShowToast('Kopyalama başarısız oldu.', 'info');
    }
  };

  // Real-time Swiss Haute Horology Clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 15-Minute Action Countdown with Play/Pause
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          audioEngine.playCelestialChime();
          onShowToast('⏱️ 15 dakikalık odak seansı tamamlandı!', 'stars');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, onShowToast]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Audio & Orb States
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [sineVolume, setSineVolume] = useState(80);
  const [rainVolume, setRainVolume] = useState(50);
  const [isOrbPulsing, setIsOrbPulsing] = useState(false);

  const toggleSoundscape = () => {
    setIsOrbPulsing(true);
    if (isAudioActive) {
      audioEngine.stopTone();
      setIsAudioActive(false);
      onShowToast('432Hz Frekans Mabedi duraklatıldı.', 'pause');
    } else {
      audioEngine.setVolume(sineVolume / 100);
      audioEngine.setAmbienceLevel(rainVolume / 100);
      audioEngine.startTone(432);
      setIsAudioActive(true);
      triggerNeurologicalReinforcement({ pitch: 741, enableAudio: true });
      onShowToast('✨ 432Hz Rezonans Mabedi canlı akışta!', 'graphic_eq');
    }
    if (navigator.vibrate) {
      navigator.vibrate([25, 40, 25]);
    }
    setTimeout(() => setIsOrbPulsing(false), 600);
  };

  const handleSineVolumeChange = (newVal: number) => {
    setSineVolume(newVal);
    audioEngine.setVolume(newVal / 100);
  };

  const handleRainVolumeChange = (newVal: number) => {
    setRainVolume(newVal);
    audioEngine.setAmbienceLevel(newVal / 100);
  };

  // Cycle next intention
  const handleCycleIntention = () => {
    setIsRotatingIntention(true);
    const next = cycleNextIntention(dailyIntention.id);
    setDailyIntention(next);
    onPlayChime();
    triggerNeurologicalReinforcement({ pitch: 852, enableAudio: true });
    onShowToast(`✨ Günün Niyeti: "${next.tag}"`, 'sparkles');
    setTimeout(() => setIsRotatingIntention(false), 400);
  };

  // AI Intention Generator
  const handleGenerateAiIntention = async () => {
    setIsGeneratingAiIntention(true);
    onShowToast('Veira Zekası günün niyetini frekansınıza göre yazıyor... 🧠', 'psychology');
    try {
      const activeVision = visions[0];
      const res = await fetch('/api/intention/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focus: activeVision?.title || 'Zihinsel berraklık, bolluk ve 15 dakikalık atomik adımlar',
          category: activeVision?.category || 'Kişisel Gelişim',
        }),
      });
      if (!res.ok) throw new Error('Intention fetch failed');
      const data = await res.json();
      setDailyIntention(data);
      onPlayChime();
      triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
      onShowToast('✨ Size özel yeni niyet mühürlendi!', 'auto_awesome');
    } catch {
      const random = getRandomIntention();
      setDailyIntention(random);
      onShowToast('Yeni niyet çağrıldı ✨', 'check');
    } finally {
      setIsGeneratingAiIntention(false);
    }
  };

  // Primary Focus Task (Hero Task)
  const heroTask = allDailyTasks.find((t) => !t.completed) || allDailyTasks[0];
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCompleteHeroTask = () => {
    if (!heroTask) return;
    if (!heroTask.completed) {
      toggleDailyTask(heroTask.visionId, heroTask.id);
      onIncrementStreak();
      onPlayChime();
      audioEngine.playCelestialChime();
      triggerNeurologicalReinforcement({ pitch: 1080, enableAudio: true });
      setShowCelebration(true);
      if (navigator.vibrate) {
        navigator.vibrate([60, 40, 120]);
      }
      setTimeout(() => setShowCelebration(false), 2600);
      onShowToast('Tebrikler! Günün odak mikro-adımı tamamlandı. +1 Seri! ⚡', 'stars');
    } else {
      toggleDailyTask(heroTask.visionId, heroTask.id);
      onShowToast('Görev tekrar aktif duruma alındı.', 'restart_alt');
    }
  };

  // Quick Task Addition
  const [quickTaskText, setQuickTaskText] = useState('');
  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    const text = quickTaskText.trim();
    if (!text) return;
    const targetVisionId = visions[0]?.id || 'uv-como';
    addDailyTaskToVision(targetVisionId, text, 15);
    setQuickTaskText('');
    onPlayChime();
    onShowToast('Yeni günlük görev panonuza mühürlendi! ✨', 'task_alt');
  };

  // Vision Backdrop for the Micro-Action
  const activeBackdropImage =
    visions[0]?.imageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuArToWQgi097SHL57WdX0T4PF-_4CwFvzUXWSJzv5emviOLFcw11qQo06-5Bcdx_pIT0AO-ABdYrYd463cqLNGgl2agRK2ahORN5nTJhcsy4_cIMnVqVNNk8z-ClxkHY6Dd6hUl0vdKAiiPvWVItG2XkJxkoTjOG_p1nyc2LTL5esU-aOBuzA3Zig0m8NIi4Eo1V2I5l_59oBvSaOFuWKF7_sQa6gMz1qPZRuXYBJ0';

  return (
    <div className="relative flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-3.5 sm:px-6 pt-2 pb-24 space-y-5 sm:space-y-6 animate-fadeIn select-none">
      
      {/* =========================================================================
          BÖLÜM 1: KOZMİK BAŞLIK & KUTSAL GÜNLÜK NİYET
         ========================================================================= */}
      <section className="relative rounded-2xl bg-[#1c1a29]/80 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(245,208,97,0.08)] border border-[#f5d061]/25 overflow-hidden">
        {/* Subtle decorative gold sparkle */}
        <svg
          className="absolute top-3 right-3 w-4 h-4 text-[#f5d061] animate-star-pulse gold-stardust-glow pointer-events-none"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
        </svg>

        {/* Top Status Bar: Moon Phase / Natal Signs + Swiss Horology + Streak */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
          {(() => {
            const storedNatal = getStoredNatalChart();
            const moon = calculateMoonPhase(new Date());
            return (
              <button
                type="button"
                onClick={() => onSwitchTab('astro')}
                title="Astro-Vizyon ve Canlı Günlük Yorumu Aç"
                className="flex items-center gap-2 group hover:opacity-95 active:scale-95 transition-all text-left cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-[#7f00ff]/30 text-[#ddb7ff] border border-[#ddb7ff]/20 flex items-center justify-center shrink-0 group-hover:border-[#f5d061]/50 group-hover:shadow-[0_0_10px_rgba(245,208,97,0.3)] transition-all">
                  <span className="material-symbols-outlined text-[14px]">
                    {storedNatal ? 'planet' : 'bedtime'}
                  </span>
                </span>
                <span className="text-[11px] text-[#cdc2da] font-medium flex items-center gap-1.5">
                  <span>{storedNatal ? `${storedNatal.sun.sign} ☉` : `${moon.glyph}`}</span>
                  <strong className="text-[#f5d061] group-hover:underline">
                    {storedNatal ? `Yükselen ${storedNatal.rising.sign} • Ay ${moon.sign}` : `${moon.glyph} Ay ${moon.sign} (%${moon.percent})`}
                  </strong>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#00dce6]/15 text-[#00f2fe] border border-[#00dce6]/30 font-bold uppercase">
                    Günlük Yorum &gt;
                  </span>
                </span>
              </button>
            );
          })()}

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#978da3] font-mono tabular-nums">
              {currentTimeStr || '03:42:19'}
            </span>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f5d061]/15 border border-[#f5d061]/30 text-[#f5d061] text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
              <span>{streak} Gün Seri</span>
            </div>
          </div>
        </div>

        {/* Greeting & Intention Header */}
        <div className="pt-3 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#f5d061] font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <span>Günün Niyeti &amp; Zihinsel Çapası</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5d061]/15 text-[#ffe06b] border border-[#f5d061]/30">
                {dailyIntention.tag}
              </span>
            </span>

            {/* Quick Cycle Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCycleIntention}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-[#f5d061] border border-white/10 transition-all flex items-center justify-center"
                title="Sıradaki niyeti kütüphaneden çağır"
              >
                <span className={`material-symbols-outlined text-[16px] ${isRotatingIntention ? 'animate-spin' : ''}`}>
                  autorenew
                </span>
              </button>
            </div>
          </div>

          {/* Intention Quote */}
          <div className={`transition-all duration-300 ${isRotatingIntention ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'}`}>
            <p className="font-serif text-lg sm:text-xl text-[#e6dff5] italic leading-relaxed">
              “{dailyIntention.quote}”
            </p>
            <p className="text-xs text-[#cdc2da] mt-1 leading-relaxed">
              {dailyIntention.subtext}
            </p>
          </div>

          {/* AI Intention Generation CTA */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              disabled={isGeneratingAiIntention}
              onClick={handleGenerateAiIntention}
              className="text-[11px] font-semibold text-[#f5d061] hover:text-[#ffe06b] flex items-center gap-1 px-3 py-1 rounded-full bg-[#f5d061]/10 border border-[#f5d061]/30 hover:bg-[#f5d061]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[14px] ${isGeneratingAiIntention ? 'animate-spin' : ''}`}>
                auto_awesome
              </span>
              <span>{isGeneratingAiIntention ? 'Yazılıyor...' : 'Yapay Zeka ile Yeni Niyet Yaz'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BÖLÜM 2: 432Hz NÖRAL REZONANS KÜRESİ & SES MABEDİ (Tek, Birleşik Modül)
         ========================================================================= */}
      <section className="relative rounded-2xl bg-[#201e2d]/75 backdrop-blur-3xl p-5 sm:p-6 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8),0_0_40px_rgba(245,208,97,0.12)] border border-[#f5d061]/25 flex flex-col items-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,208,97,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Section Title */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5d061] text-[18px]">graphic_eq</span>
            <span className="font-serif text-base text-[#e6dff5] font-semibold">432Hz Dinlendirici Meditasyon Sesi</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#006b71]/30 text-[#00dce6] border border-[#00dce6]/40 font-bold tracking-wider">
            {isAudioActive ? 'Canlı Yayında' : 'Dokun & Dinle'}
          </span>
        </div>

        {/* Gyroscopic Interactive Resonator Orb Stage */}
        <div
          onClick={toggleSoundscape}
          className="relative w-52 h-52 sm:w-60 sm:h-60 my-3 flex items-center justify-center cursor-pointer transition-transform duration-500 ease-out active:scale-95 group"
          title="Küreye dokunarak 432Hz frekansını başlatın veya durdurun"
        >
          {/* Layer 1: Outermost Gold Stardust Orbit Ring */}
          <svg className="absolute inset-0 w-full h-full animate-[orbitShimmer_28s_linear_infinite]" viewBox="0 0 260 260">
            <circle
              className="text-[#f5d061]/45"
              cx="130"
              cy="130"
              fill="none"
              r="122"
              stroke="currentColor"
              strokeDasharray="6 14"
              strokeWidth="1.4"
            />
            <circle
              className="text-[#ffe06b]/70"
              cx="130"
              cy="130"
              fill="none"
              r="114"
              stroke="currentColor"
              strokeDasharray="2 10"
              strokeWidth="0.9"
            />
            {/* Sacred Geometry Triangles */}
            <polygon className="text-[#f5d061]/25" fill="none" points="130,16 230,190 30,190" stroke="currentColor" strokeWidth="1" />
            <polygon className="text-[#00dce6]/25" fill="none" points="130,244 30,70 230,70" stroke="currentColor" strokeWidth="0.8" />
            {/* Star Nodes */}
            <circle className="filter drop-shadow-[0_0_8px_#f5d061]" cx="130" cy="8" fill="#f5d061" r="3.5" />
            <circle className="filter drop-shadow-[0_0_6px_#ffe06b]" cx="230" cy="190" fill="#ffe06b" r="3" />
            <circle className="filter drop-shadow-[0_0_6px_#00dce6]" cx="30" cy="190" fill="#00dce6" r="3" />
          </svg>

          {/* Layer 2: Counter-Rotating Telemetry Arcs */}
          <svg className="absolute inset-0 w-full h-full animate-[orbitShimmerReverse_20s_linear_infinite]" viewBox="0 0 260 260">
            <circle
              className="text-[#00dce6] filter drop-shadow-[0_0_10px_rgba(0,220,230,0.8)]"
              cx="130"
              cy="130"
              fill="none"
              r="92"
              stroke="currentColor"
              strokeDasharray="540"
              strokeDashoffset="65"
              strokeLinecap="round"
              strokeWidth="3.5"
            />
            <circle
              className="text-[#f5d061] filter drop-shadow-[0_0_12px_rgba(245,208,97,0.9)]"
              cx="130"
              cy="130"
              fill="none"
              r="82"
              stroke="currentColor"
              strokeDasharray="480"
              strokeDashoffset="120"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <circle
              className="text-[#7f00ff] filter drop-shadow-[0_0_8px_rgba(127,0,255,0.7)]"
              cx="130"
              cy="130"
              fill="none"
              r="72"
              stroke="currentColor"
              strokeDasharray="420"
              strokeDashoffset="25"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>

          {/* Ambient Shimmering Stardust Aura */}
          <div
            className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#7f00ff] via-[#006b71] to-[#f5d061] blur-2xl transition-all duration-700 pointer-events-none ${
              isAudioActive || isOrbPulsing ? 'opacity-95 blur-3xl scale-125' : 'opacity-50 animate-pulse'
            }`}
          />

          {/* Central Sphere */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#0f0c1b] via-[#7f00ff] to-[#6f00be] shadow-[0_0_36px_rgba(245,208,97,0.4),0_0_30px_rgba(127,0,255,0.6)] border border-[#f5d061]/50 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute -top-5 -left-5 w-16 h-16 bg-white/20 rounded-full blur-md" />
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 text-[#f5d061] filter drop-shadow-[0_0_10px_#f5d061] ${
                isAudioActive ? 'animate-star-pulse' : ''
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
            </svg>
            <span className="font-serif text-xl sm:text-2xl text-white font-bold tracking-tighter mt-0.5 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              432<span className="text-[#f5d061] text-xs font-semibold">Hz</span>
            </span>
            <span className="text-[8.5px] text-[#f5d061] tracking-widest uppercase font-bold">
              {isAudioActive ? 'Çalıyor' : 'Küreye Dokun'}
            </span>
          </div>

          {/* Orbit Star Node Accents */}
          <div className="absolute top-2 right-6 animate-star-pulse gold-stardust-glow pointer-events-none">
            <svg className="w-4 h-4 text-[#f5d061]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-6 animate-star-pulse-delayed pointer-events-none">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
            </svg>
          </div>
        </div>

        {/* Real Status Metrics (Meaningful Data) */}
        <div className="grid grid-cols-3 gap-2 w-full mt-1">
          <div className="flex flex-col items-center p-2 rounded-xl bg-[#2b2838]/70 border border-[#00dce6]/25">
            <span className="text-[10px] text-[#cdc2da] font-medium">Görev Odaklılığı</span>
            <span className="font-serif text-lg font-bold text-[#00dce6] mt-0.5">
              %{dailyProgressPercent}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-[#2b2838]/70 border border-[#f5d061]/35">
            <span className="text-[10px] text-[#cdc2da] font-medium">Seri Disiplini</span>
            <span className="font-serif text-lg font-bold text-[#f5d061] mt-0.5">
              {streak} Gün
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-[#2b2838]/70 border border-[#d5baff]/25">
            <span className="text-[10px] text-[#cdc2da] font-medium">Aktif Niyetler</span>
            <span className="font-serif text-lg font-bold text-[#d5baff] mt-0.5">
              {visions.length} Tohum
            </span>
          </div>
        </div>

        {/* Integrated Sound Mix Sliders */}
        <div className="w-full mt-4 pt-3 border-t border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#cdc2da] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#f5d061]" />
              432Hz Saf Sinüs Frekansı
            </span>
            <span className="text-[#f5d061] font-mono text-[11px]">%{sineVolume}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sineVolume}
            onChange={(e) => handleSineVolumeChange(Number(e.target.value))}
            className="w-full accent-[#f5d061] h-1.5 bg-[#0f0c1b] rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#cdc2da] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00dce6]" />
              Gece Yağmuru (Teta Dalga)
            </span>
            <span className="text-[#00dce6] font-mono text-[11px]">%{rainVolume}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rainVolume}
            onChange={(e) => handleRainVolumeChange(Number(e.target.value))}
            className="w-full accent-[#00dce6] h-1.5 bg-[#0f0c1b] rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#978da3] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#f5d061]">headphones</span>
              Binaural 3D Akort
            </span>
            <button
              type="button"
              onClick={() => onSwitchTab('432hz')}
              className="text-[11px] font-semibold text-[#f5d061] hover:underline flex items-center gap-0.5"
            >
              <span>Tüm Ses Çalarını Aç</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BÖLÜM 3: GÜNÜN 15 DAKİKALIK ODAK MİKRO-EYLEMİ (Visus-Action Köprüsü)
         ========================================================================= */}
      <section className="relative rounded-2xl overflow-hidden bg-[#1c1a29]/85 backdrop-blur-2xl shadow-[0_20px_48px_-12px_rgba(0,0,0,0.85),0_0_28px_rgba(245,208,97,0.15)] border border-[#f5d061]/25">
        {/* Dynamic Image Backdrop */}
        <div className="relative w-full h-40 sm:h-44 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-7000 ease-out transform scale-105 hover:scale-110"
            style={{ backgroundImage: `url('${activeBackdropImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a29] via-[#1c1a29]/65 to-transparent" />

          {/* Interactive Countdown Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0f0c1b]/85 backdrop-blur-md flex items-center gap-2 shadow-lg border border-[#f5d061]/35">
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-[#f5d061] hover:text-[#ffe06b] flex items-center justify-center transition-transform active:scale-90"
              title={isTimerRunning ? 'Sayacı Duraklat' : 'Sayacı Başlat'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isTimerRunning ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <span className="text-[11px] text-[#e6dff5] font-bold tracking-wider font-mono">
              ODAK: <span className="text-[#f5d061]">{formatCountdown(secondsRemaining)}</span>
            </span>
          </div>

          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#7f00ff] to-[#6f00be] border border-[#f5d061]/40 backdrop-blur-md text-[#ffe06b] text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
            <span>✨ Günün Odak Adımı</span>
          </div>
        </div>

        {/* Content & Action Button */}
        <div className="p-4 sm:p-5 -mt-3 relative z-10 flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#f5d061] uppercase tracking-widest font-bold flex items-center gap-1">
              <span>{heroTask?.visionTitle || 'Ana Vizyon'}</span>
              <span className="text-xs">✦</span>
            </span>
            <h2 className="font-serif text-lg sm:text-xl text-[#e6dff5] font-semibold leading-tight mt-0.5">
              {heroTask ? heroTask.title : 'Vizyon panosundan ilk günlük hedefinizi belirleyin'}
            </h2>
            <p className="text-xs text-[#cdc2da] mt-1 leading-snug">
              Bugünkü tekil ve berrak adımınız (yaklaşık {heroTask?.estimatedMinutes || 15} dk). Zihninizi telaştan arındırarak tamamlayın.
            </p>
          </div>

          {/* Complete Hero Task Button */}
          <button
            type="button"
            onClick={handleCompleteHeroTask}
            className={`w-full py-3.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(245,208,97,0.35)] border border-[#f5d061]/60 group relative overflow-hidden active:scale-[0.98] ${
              heroTask?.completed
                ? 'bg-gradient-to-r from-[#006b71] to-[#f5d061] text-[#080c22]'
                : 'bg-gradient-to-r from-[#7f00ff] via-[#6f00be] to-[#b38600] text-white hover:brightness-110'
            }`}
          >
            <svg className="w-4 h-4 text-[#f5d061]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
            </svg>
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {heroTask?.completed ? 'Tamamlandı Olarak Mühürlendi ✓' : 'Tamamlandı Olarak Mühürle'}
            </span>
            <span className="material-symbols-outlined text-[#f5d061] text-[18px]">
              {heroTask?.completed ? 'task_alt' : 'auto_awesome'}
            </span>
          </button>
        </div>

        {/* Celebration Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-[#0f0c1b]/95 backdrop-blur-xl transition-opacity duration-500 z-30 ${
            showCelebration ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg className="w-16 h-16 text-[#f5d061] animate-star-pulse filter drop-shadow-[0_0_20px_#f5d061]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
          </svg>
          <span className="font-serif text-2xl text-white font-bold mt-2 filter drop-shadow-[0_0_10px_#f5d061]">
            Tebrikler! Odak Adımı Tamamlandı
          </span>
          <span className="text-xs sm:text-sm text-[#f5d061] mt-1 font-semibold flex items-center gap-1">
            ✨ Harika İlerleme &amp; +1 Günlük Seri Eklendi ✨
          </span>
        </div>
      </section>

      {/* =========================================================================
          BÖLÜM 4: BUGÜNÜN GÖREV DEFTERİ (Tüm Görevlerin Listesi & Hızlı Ekleme)
         ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-[#201e2d]/75 backdrop-blur-2xl shadow-lg border border-[#f5d061]/20 flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#f5d061] text-[18px]">checklist</span>
            <h2 className="text-sm sm:text-base font-semibold text-[#e6dff5]">
              Bugünün Görev Defteri
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#f5d061] tabular-nums">
            {completedDailyTasksCount} / {totalDailyTasksCount} Görev (%{dailyProgressPercent})
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#0f0c1b] overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f5d061] to-[#00dce6] transition-all duration-500"
            style={{ width: `${dailyProgressPercent}%` }}
          />
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {allDailyTasks.length === 0 ? (
            <div className="text-center py-5 text-xs text-[#978da3] space-y-2">
              <p>Henüz aktif bir günlük görev bulunmuyor.</p>
              <button
                type="button"
                onClick={() => onSwitchTab('vizyon')}
                className="px-3 py-1.5 rounded-full bg-[#2b2838] text-[#f5d061] font-semibold text-xs border border-[#f5d061]/30 hover:bg-[#363343] transition-colors"
              >
                Vizyon Panosundan Görev Belirle
              </button>
            </div>
          ) : (
            allDailyTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  toggleDailyTask(task.visionId, task.id);
                  if (!task.completed) {
                    onIncrementStreak();
                    onPlayChime();
                    triggerNeurologicalReinforcement({ pitch: 1080 });
                    onShowToast('Tebrikler! Görev tamamlandı. +1 Seri ⚡', 'stars');
                  }
                }}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                  task.completed
                    ? 'bg-[#0f0c1b]/50 border-[#f5d061]/20 text-[#cdc2da]'
                    : 'bg-[#2b2838]/80 border-white/5 hover:border-[#f5d061]/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                      task.completed
                        ? 'bg-[#f5d061] border-[#f5d061] text-[#080c22]'
                        : 'border-white/20 bg-transparent hover:border-[#f5d061]'
                    }`}
                  >
                    {task.completed && (
                      <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-medium truncate ${
                        task.completed ? 'line-through text-[#978da3]' : 'text-[#e6dff5]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-[#978da3]">
                      {task.visionTitle || 'Genel Niyet'} · {task.estimatedMinutes || 15} dk
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddQuickTask} className="pt-1 flex items-center gap-2">
          <input
            type="text"
            value={quickTaskText}
            onChange={(e) => setQuickTaskText(e.target.value)}
            placeholder="Bugün için hızlı mikro-görev ekle..."
            maxLength={60}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#0f0c1b] border border-[#f5d061]/25 text-[#e6dff5] focus:outline-none focus:border-[#f5d061] placeholder:text-[#978da3]/60"
          />
          <button
            type="submit"
            disabled={!quickTaskText.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#f5d061] text-[#080c22] font-bold text-xs hover:bg-[#ffe06b] active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Ekle</span>
          </button>
        </form>
      </section>

      {/* =========================================================================
          BÖLÜM 4.5: GÜNÜN ŞİİRSEL TEFEKKÜRÜ & AKŞAM YANSIMASI (Daily Reflection Sanctuary)
         ========================================================================= */}
      <section className="veira-reflection-card relative rounded-3xl bg-gradient-to-br from-[#1c182c]/90 via-[#181326]/95 to-[#100d1c]/95 backdrop-blur-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_35px_rgba(245,208,97,0.08)] border border-[#f5d061]/30 overflow-hidden flex flex-col space-y-4">
        {/* Ambient Top Luminous Ray */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f5d061] via-[#ff95d5] to-[#8083ff] pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#f5d061]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f5d061]/15 border border-[#f5d061]/30 flex items-center justify-center text-[#f5d061] shadow-[0_0_12px_rgba(245,208,97,0.25)]">
              <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                  Günün Şiirsel Tefekkürü
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f5d061]/15 text-[#ffe06b] border border-[#f5d061]/30 font-bold uppercase tracking-wider">
                  Akşam Yansıması
                </span>
              </div>
              <span className="text-[11px] text-[#cdc2da]">
                {reflection?.completedTasksCount && reflection.completedTasksCount > 0
                  ? `✦ ${reflection.completedTasksCount} Görev Tamamlandı · Şiire Dönüştürüldü`
                  : '✦ Akşam Sükûneti & Dingin Niyet Aşaması'}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 432Hz Sound Tone */}
            <button
              type="button"
              onClick={() => {
                playReflectionChime();
                onShowToast('🔔 432Hz Solfeggio tefekkür tınısı çalınıyor...', 'music_note');
              }}
              title="432Hz Solfeggio Tefekkür Tınısı"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-[#f5d061] border border-white/10 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">spatial_audio_off</span>
              <span className="hidden sm:inline">432Hz Tını</span>
            </button>

            {/* Copy Reflection */}
            <button
              type="button"
              onClick={() => handleCopyReflection(reflection)}
              title="Şiiri ve tefekkürü kopyala"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-[#c7c4d7] hover:text-white border border-white/10 transition-all flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedReflection ? 'check' : 'content_copy'}
              </span>
              <span className="hidden sm:inline">{copiedReflection ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>

            {/* Refresh / Re-reflect */}
            <button
              type="button"
              onClick={async () => {
                onShowToast('Yapay Zeka bugünkü adımlarını yeniden tefekkür ediyor... ✨', 'auto_awesome');
                await refreshReflection();
                playReflectionChime();
                onShowToast('✨ Günün tefekkürü tazelendi!', 'stars');
              }}
              disabled={isReflectionLoading}
              title="Tefekkürü yeniden üret"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-[#f5d061] border border-white/10 transition-all flex items-center gap-1 text-xs cursor-pointer disabled:opacity-40"
            >
              <span className={`material-symbols-outlined text-[16px] ${isReflectionLoading ? 'animate-spin' : ''}`}>
                cached
              </span>
              <span className="hidden sm:inline">Tazele</span>
            </button>

            {/* Past Reflections Archive */}
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              title="Geçmiş günlerin tefekkür arşivi"
              className="p-2 rounded-xl bg-[#252038] hover:bg-[#322c4a] active:scale-95 text-[#ffe06b] border border-[#f5d061]/20 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">history_edu</span>
              <span>Arşiv ({reflectionHistory.length})</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner Shimmer */}
        {isReflectionLoading && !reflection ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-[#f5d061]">
            <div className="w-8 h-8 rounded-full border-2 border-[#f5d061]/25 border-t-[#f5d061] animate-spin" />
            <p className="text-xs text-[#cdc2da] italic">Günün emekleri şiire dokunuyor...</p>
          </div>
        ) : reflection ? (
          <div className="space-y-4 relative z-10">
            {/* Poetic Title */}
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest text-[#f5d061] uppercase font-bold">
                {reflection.date} · GÜN BATIMI YANSIMASI
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fff] tracking-tight leading-snug">
                {reflection.title}
              </h3>
            </div>

            {/* 4-Line Poetic Verse (Strophe) in Golden Calligraphy Aesthetic */}
            {reflection.strophe && reflection.strophe.length > 0 && (
              <div className="veira-strophe-container relative p-4 sm:p-5 rounded-2xl bg-[#0f0c1b]/80 border border-[#f5d061]/25 shadow-inner overflow-hidden">
                <span className="absolute top-1 left-2 font-serif text-4xl text-[#f5d061]/20 select-none leading-none">
                  “
                </span>
                <div className="space-y-1.5 pl-3 sm:pl-4 border-l-2 border-[#f5d061]/50">
                  {reflection.strophe.map((line, idx) => (
                    <p
                      key={idx}
                      className="font-serif italic text-sm sm:text-base text-[#ffe06b] leading-relaxed drop-shadow-[0_1px_8px_rgba(245,208,97,0.15)]"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Mindful Prose Narrative (celebrating user's completed actions) */}
            <div className="veira-narrative-container text-xs sm:text-sm text-[#e6dff5] leading-relaxed space-y-2.5 whitespace-pre-line bg-white/[0.02] p-3.5 sm:p-4 rounded-2xl border border-white/5">
              {reflection.narrative}
            </div>

            {/* Evening Dual Zen Cards: Prompt & Mantra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Question to the Night */}
              {reflection.mindfulnessPrompt && (
                <div className="veira-zen-card p-3.5 rounded-2xl bg-[#141223]/90 border border-[#8083ff]/25 flex flex-col space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#a8aaff]">
                    <span className="material-symbols-outlined text-[16px]">nights_stay</span>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider">
                      Geceye Bırakılan Soru
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#dee0ff] leading-relaxed">
                    “{reflection.mindfulnessPrompt}”
                  </p>
                </div>
              )}

              {/* Bedtime Mantra */}
              {reflection.eveningMantra && (
                <div className="veira-zen-card p-3.5 rounded-2xl bg-[#141223]/90 border border-[#55e7a5]/25 flex flex-col space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#55e7a5]">
                    <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider">
                      Uyku Öncesi Olumlama
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#e6dff5] leading-relaxed">
                    “{reflection.eveningMantra}”
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* =========================================================================
          BÖLÜM 5: TEZAHÜR SEKANSLARI (Vizyon Kartları Vitrini)
         ========================================================================= */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#f5d061] animate-star-pulse gold-stardust-glow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
            </svg>
            <span className="veira-sequence-header-title font-serif text-base sm:text-lg text-[#e6dff5] font-semibold">
              Tezahür Sekansları
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onPlayChime();
              onSwitchTab('vizyon');
            }}
            className="veira-sequence-manage-btn text-[11px] sm:text-xs text-[#f5d061] hover:text-white transition-colors cursor-pointer font-bold flex items-center gap-0.5"
          >
            Vizyon Panosunu Yönet ›
          </button>
        </div>

        {/* Carousel */}
        {visions && visions.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-3.5 px-3.5 sm:-mx-6 sm:px-6">
            {visions.slice(0, 6).map((vision, idx) => (
              <div
                key={vision.id || idx}
                onClick={() => {
                  onPlayChime();
                  onSwitchTab('vizyon');
                }}
                className="veira-sequence-card snap-center shrink-0 w-60 sm:w-64 rounded-2xl overflow-hidden bg-[#1c1a29]/85 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.6)] border border-[#f5d061]/25 flex flex-col group cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#080c22]">
                  <img
                    src={vision.imageUrl}
                    alt={vision.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="veira-sequence-overlay absolute inset-0 pointer-events-none" />
                  <span className="veira-sequence-badge absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9.5px] uppercase tracking-wider backdrop-blur-md font-bold flex items-center gap-1 shadow-sm">
                    <span className="text-[9px]">✨</span> {vision.category || 'Vizyon'}
                  </span>
                </div>
                <div className="p-3 flex flex-col">
                  <h3 className="veira-sequence-title text-xs sm:text-sm font-semibold text-[#e6dff5] truncate">
                    {vision.title}
                  </h3>
                  <p className="veira-sequence-why text-[11px] text-[#cdc2da] line-clamp-1 mt-0.5">
                    {vision.why || 'Yaratıcı akış ve mutlak sükûnet mabedi.'}
                  </p>
                  <div className="veira-sequence-footer mt-2 flex items-center justify-between pt-1.5 border-t border-white/5">
                    <span className="veira-sequence-score text-[10px] text-[#f5d061] font-bold">
                      Uyum: %{90 + ((idx * 3) % 9)}
                    </span>
                    <span className="veira-sequence-icon material-symbols-outlined text-[#f5d061] text-[15px]">
                      north_east
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => {
              onPlayChime();
              onSwitchTab('vizyon');
            }}
            className="veira-sequence-card p-5 rounded-2xl border border-dashed border-[#f5d061]/35 flex items-center justify-between gap-3 cursor-pointer group hover:border-[#f5d061] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5d061]/15 text-[#f5d061] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
              </div>
              <div>
                <h4 className="veira-sequence-title text-xs sm:text-sm font-semibold text-[#e6dff5]">
                  İlk Tezahür Sekansını Başlat
                </h4>
                <p className="veira-sequence-why text-[11px] text-[#cdc2da]">
                  Vizyon panona hedef ve görseller ekleyerek niyetlerini somutlaştır.
                </p>
              </div>
            </div>
            <span className="veira-sequence-icon material-symbols-outlined text-[#f5d061] text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        )}
      </section>

      {/* =========================================================================
          GEÇMİŞ TEFEKKÜR ARŞİVİ MODALI (History Modal)
         ========================================================================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto overscroll-contain text-[#e6dff5]">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#161326] border border-[#f5d061]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90dvh] overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 pb-3 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#f5d061]/15 border border-[#f5d061]/30 flex items-center justify-center text-[#f5d061]">
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                    Tefekkür &amp; Şiir Arşivi
                  </h3>
                  <p className="text-[11px] text-[#cdc2da]">Geçmiş günlerin kaydedilmiş akşam yansımaları</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  setSelectedHistoryItem(null);
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#cdc2da] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {selectedHistoryItem ? (
                <div className="space-y-3 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryItem(null)}
                    className="text-xs text-[#f5d061] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Tüm Günlere Dön</span>
                  </button>

                  <div className="veira-strophe-container p-4 rounded-2xl bg-[#0f0c1b]/80 border border-[#f5d061]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#f5d061] font-bold uppercase">{selectedHistoryItem.date}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyReflection(selectedHistoryItem)}
                        className="text-xs text-[#cdc2da] hover:text-white flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        <span>Kopyala</span>
                      </button>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white">{selectedHistoryItem.title}</h4>

                    {selectedHistoryItem.strophe && selectedHistoryItem.strophe.length > 0 && (
                      <div className="veira-modal-strophe p-3 rounded-xl bg-black/40 border-l-2 border-[#f5d061] space-y-1">
                        {selectedHistoryItem.strophe.map((l, i) => (
                          <p key={i} className="font-serif italic text-xs sm:text-sm text-[#ffe06b]">
                            {l}
                          </p>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-[#e6dff5] leading-relaxed whitespace-pre-line">
                      {selectedHistoryItem.narrative}
                    </p>

                    {selectedHistoryItem.mindfulnessPrompt && (
                      <div className="p-3 rounded-xl bg-[#8083ff]/10 border border-[#8083ff]/25 text-xs text-[#dee0ff]">
                        <span className="font-bold text-[10px] uppercase block text-[#a8aaff] mb-1">Geceye Soru</span>
                        “{selectedHistoryItem.mindfulnessPrompt}”
                      </div>
                    )}

                    {selectedHistoryItem.eveningMantra && (
                      <div className="p-3 rounded-xl bg-[#55e7a5]/10 border border-[#55e7a5]/25 text-xs text-[#dee0ff]">
                        <span className="font-bold text-[10px] uppercase block text-[#55e7a5] mb-1">Olumlama</span>
                        “{selectedHistoryItem.eveningMantra}”
                      </div>
                    )}
                  </div>
                </div>
              ) : reflectionHistory.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#978da3] space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#f5d061]/40">auto_stories</span>
                  <p>Henüz arşivlenmiş bir tefekkür bulunmuyor.</p>
                  <p className="text-[11px] text-[#cdc2da]">Günlük görevlerini tamamladıkça akşam tefekkürlerin burada birikecek.</p>
                </div>
              ) : (
                reflectionHistory.map((item) => (
                  <div
                    key={item.id || item.date}
                    onClick={() => setSelectedHistoryItem(item)}
                    className="p-3.5 rounded-2xl bg-[#0f0c1b]/60 hover:bg-[#0f0c1b] border border-white/5 hover:border-[#f5d061]/40 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#f5d061] font-bold">{item.date}</span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-white/5 text-[#cdc2da]">
                          {item.completedTasksCount} görev
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">{item.title}</h4>
                      <p className="text-[11px] text-[#cdc2da] line-clamp-1 mt-0.5">{item.narrative}</p>
                    </div>
                    <span className="material-symbols-outlined text-[#f5d061] text-[18px] shrink-0">
                      chevron_right
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
