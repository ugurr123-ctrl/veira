/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { StitchHeader, StitchTab } from './components/stitch/StitchHeader';
import { StitchBottomDock } from './components/stitch/StitchBottomDock';
import { TodayTab } from './components/stitch/TodayTab';
import type { VisionModalData, VisionItemData } from './components/stitch/VisionTab';
import { audioEngine } from './utils/audioEngine';
import { getActiveTheme, getActiveThemeId, applyTheme, ThemeDefinition } from './utils/themeManager';
import { getStoredUnifiedVisions, saveStoredUnifiedVisions } from './utils/unifiedStorage';
import { UnifiedVisionGoal } from './types';
import { VeiraSplashScreen } from './components/stitch/VeiraSplashScreen';
import { checkAndTriggerDailyNotification, DailyIntention } from './utils/dailyIntentions';
import { CosmicShaderBackground } from './components/CosmicShaderBackground';

// High-Performance Lazy Chunking: Defer non-critical tabs & heavy modules until requested
const AstroTab = lazy(() =>
  import('./components/stitch/AstroTab').then((m) => ({ default: m.AstroTab }))
);
const UnifiedVisionGoalsTab = lazy(() =>
  import('./components/stitch/UnifiedVisionGoalsTab').then((m) => ({ default: m.UnifiedVisionGoalsTab }))
);
const AudioTab = lazy(() =>
  import('./components/stitch/AudioTab').then((m) => ({ default: m.AudioTab }))
);
const AssistantTab = lazy(() =>
  import('./components/stitch/AssistantTab').then((m) => ({ default: m.AssistantTab }))
);
const SettingsTab = lazy(() =>
  import('./components/stitch/SettingsTab').then((m) => ({ default: m.SettingsTab }))
);
const AuthScreen = lazy(() =>
  import('./components/stitch/AuthScreen').then((m) => ({ default: m.AuthScreen }))
);
const StitchModals = lazy(() =>
  import('./components/stitch/StitchModals').then((m) => ({ default: m.StitchModals }))
);
const ArchitectureIntroModal = lazy(() =>
  import('./components/stitch/ArchitectureIntroModal').then((m) => ({ default: m.ArchitectureIntroModal }))
);
const AndroidApkModal = lazy(() =>
  import('./components/AndroidApkModal').then((m) => ({ default: m.AndroidApkModal }))
);
const VeiraPremiumModal = lazy(() =>
  import('./components/stitch/VeiraPremiumModal').then((m) => ({ default: m.VeiraPremiumModal }))
);
const VeiraOnboardingCardsModal = lazy(() =>
  import('./components/stitch/VeiraOnboardingCardsModal').then((m) => ({ default: m.VeiraOnboardingCardsModal }))
);
const ManifestationConfetti = lazy(() =>
  import('./components/ManifestationConfetti').then((m) => ({ default: m.ManifestationConfetti }))
);

const TabLoadingSkeleton: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[45vh] p-8 animate-fadeIn text-[#e7c355]">
    <div className="w-10 h-10 rounded-full border-2 border-[#e7c355]/30 border-t-[#e7c355] animate-spin mb-3 shadow-[0_0_15px_rgba(231,195,85,0.3)]" />
    <span className="text-xs font-serif italic text-[#c7c4d7]/70 tracking-wide">Yükleniyor...</span>
  </div>
);

interface ToastState {
  id: number;
  message: string;
  icon?: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<StitchTab>('bugun');
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition>(() => getActiveTheme());
  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('veira_daily_streak');
      return saved !== null ? Number(saved) : 14;
    } catch {
      return 14;
    }
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isConfettiActive, setIsConfettiActive] = useState<boolean>(false);
  const [isSplashVisible, setIsSplashVisible] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('veira_splash_seen');
    } catch {
      return true;
    }
  });

  const handleSplashComplete = () => {
    setIsSplashVisible(false);
    try {
      sessionStorage.setItem('veira_splash_seen', 'true');
    } catch {
      // safe fallback
    }
  };

  // Persistent 432Hz Audio Mixer State (preserved across all tabs & page switches)
  const [sineVolume, setSineVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('veira_sine_volume');
      return saved !== null ? Number(saved) : 85;
    } catch {
      return 85;
    }
  });

  const [rainVolume, setRainVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('veira_rain_volume');
      return saved !== null ? Number(saved) : 40;
    } catch {
      return 40;
    }
  });

  const [selectedTimer, setSelectedTimer] = useState<number | null>(30);
  const [currentTimeSecs, setCurrentTimeSecs] = useState<number>(462);

  // Background playback clock progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAudioPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSecs((prev) => (prev >= 1260 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  // Synchronize audio engine with saved volumes on load
  useEffect(() => {
    audioEngine.setVolume(sineVolume / 100);
    audioEngine.setAmbienceLevel(rainVolume / 100);
  }, [sineVolume, rainVolume]);

  // Synchronize and react to global Theme changes
  useEffect(() => {
    applyTheme(currentTheme.id);

    const handleThemeChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.theme) {
        setCurrentTheme(detail.theme);
      }
    };

    window.addEventListener('veira_theme_changed', handleThemeChanged);
    return () => window.removeEventListener('veira_theme_changed', handleThemeChanged);
  }, []);

  const handleSineVolumeChange = (val: number) => {
    setSineVolume(val);
    audioEngine.setVolume(val / 100);
    try {
      localStorage.setItem('veira_sine_volume', String(val));
    } catch {
      // safe fallback
    }
  };

  const handleRainVolumeChange = (val: number) => {
    setRainVolume(val);
    audioEngine.setAmbienceLevel(val / 100);
    try {
      localStorage.setItem('veira_rain_volume', String(val));
    } catch {
      // safe fallback
    }
  };

  // Auth screen state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [, setCurrentUser] = useState<{ name: string; email: string }>({
    name: 'Selin Aydın',
    email: 'selin.***@privaterelay.appleid.com',
  });

  // Modals state
  const [activeVision, setActiveVision] = useState<VisionModalData | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [isIOSSimulatorOpen, setIsIOSSimulatorOpen] = useState<boolean>(false);
  const [isAddVisionOpen, setIsAddVisionOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  // One-time onboarding mini-window for architecture & logic (accessible via Settings)
  const [isArchitectureIntroOpen, setIsArchitectureIntroOpen] = useState<boolean>(false);

  // App Onboarding Mini Cards Modal (Opens on first launch or when triggered)
  const [isOnboardingCardsOpen, setIsOnboardingCardsOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('veira_onboarding_cards_seen');
    } catch {
      return true;
    }
  });

  // Gündüz Modu (Day / Light Mode) System
  const [isDayMode, setIsDayMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('veira_day_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDayMode) {
      root.classList.add('veira-day-mode');
      body.classList.add('veira-day-mode');
      const theme = applyTheme('day-light-sanctuary');
      setCurrentTheme(theme);
    } else {
      root.classList.remove('veira-day-mode');
      body.classList.remove('veira-day-mode');
      const savedThemeId = getActiveThemeId();
      const theme = applyTheme(savedThemeId === 'day-light-sanctuary' ? 'nocturnal-serenity' : savedThemeId);
      setCurrentTheme(theme);
    }
    try {
      localStorage.setItem('veira_day_mode', isDayMode ? 'true' : 'false');
    } catch {
      // safe
    }
  }, [isDayMode]);

  const handleToggleDayMode = () => {
    setIsDayMode((prev) => {
      const next = !prev;
      handlePlayChime();
      showToast(
        next ? '☀️ Gündüz Modu aktif edildi (Açık renkler)' : '🌙 Gece Modu aktif edildi (Karanlık Kozmos)',
        next ? 'light_mode' : 'dark_mode'
      );
      return next;
    });
  };

  // Dynamic toast system
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, icon = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Automated Daily Intention Notification Checker
  useEffect(() => {
    // Run initial check after 2.5s once splash/app is settled
    const timeout = setTimeout(() => {
      checkAndTriggerDailyNotification((intention: DailyIntention) => {
        showToast(`✨ Günün Niyeti: "${intention.tag}"`, 'sparkles');
      });
    }, 2500);

    // Periodic check every 60s while app is running
    const interval = setInterval(() => {
      checkAndTriggerDailyNotification();
    }, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const handleToggleAudio = () => {
    const newState = audioEngine.toggleTone();
    setIsAudioPlaying(newState);
    if (newState) {
      showToast('432Hz Kutsal Titreşim başladı.', 'graphic_eq');
    } else {
      showToast('432Hz ses duraklatıldı.', 'volume_off');
    }
  };

  const handlePlayChime = () => {
    audioEngine.playCelestialChime();
  };

  const [addedVisionCards, setAddedVisionCards] = useState<VisionItemData[]>([]);

  const handleIncrementStreak = () => {
    setStreak((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('veira_daily_streak', String(next));
      } catch {
        // safe fallback
      }
      return next;
    });
    setIsConfettiActive(true);
  };

  const handleTriggerCelebration = () => {
    setIsCelebrationOpen(true);
    setIsConfettiActive(true);
    audioEngine.playCelestialChime();
  };

  const handleAddVision = (seed: {
    title: string;
    category: string;
    desc: string;
    imageUrl?: string;
    action?: string;
  }) => {
    let catKey: 'career' | 'wellness' | 'spirit' | 'travel' | 'growth' = 'career';
    if (seed.category.includes('Beden')) catKey = 'wellness';
    else if (seed.category.includes('Ruh')) catKey = 'spirit';
    else if (seed.category.includes('Seyahat')) catKey = 'travel';
    else if (seed.category.includes('Gelişim')) catKey = 'growth';

    const newId = `uv-${Date.now()}`;
    const newUnifiedItem: UnifiedVisionGoal = {
      id: newId,
      title: seed.title,
      category: seed.category,
      categoryKey: catKey,
      categoryLabel: seed.category,
      horizon: '3 Ay',
      why: seed.desc || 'Bu vizyon ve hedef benim için derin bir anlam taşıyor.',
      imageUrl:
        seed.imageUrl ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCzRvB_cY7Xsrn4WWr0Ra7G3WrsZ3SPUWhhVUTA0gIscjy0Wgtinrm061u0pq0UpLWOEWiyORoZcXS2tAydmmI8M_c8ZEN43ODwDKEeI4ZtmRgMOUSiB9QDBj5ojoqFN0GgLySmtHdMad4uzTEoJ44V5P-5Tef8UaOSj9rf85AwBtmYNM9r_Cj77ozRXJB9fX_VNbsb4gRPLMKlvFVGHrKYty-M3B87zq1KStT6LUU',
      badge: 'Yeni Niyet Tohumu',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      dailyTasks: [
        {
          id: `dt-${newId}-1`,
          visionId: newId,
          visionTitle: seed.title,
          title: seed.action || 'Günde 15 dk niyet odaklı mikro-adım at',
          estimatedMinutes: 15,
          completed: false,
        },
      ],
      miniTasks: [
        {
          id: `mt-${newId}-1`,
          visionId: newId,
          stepNumber: 1,
          title: 'Temel hazırlık ve ilk eylemi tamamla',
          desc: 'Başlangıç kilometre taşı',
          completed: false,
        },
      ],
    };

    const currentUnified = getStoredUnifiedVisions();
    saveStoredUnifiedVisions([newUnifiedItem, ...currentUnified]);

    const newCard: VisionItemData = {
      id: String(Date.now()),
      title: seed.title,
      category: seed.category,
      categoryKey: catKey === 'growth' ? 'career' : catKey,
      categoryLabel: seed.category,
      why: seed.desc,
      action: seed.action || '15 dk niyet odaklı mikro-adım at.',
      shortAction: '15 dk niyet odaklı mikro-adım at.',
      imageUrl: newUnifiedItem.imageUrl,
      badge: 'Yeni Niyet Tohumu',
      completed: false,
    };
    setAddedVisionCards((prev) => [newCard, ...prev]);
    showToast(`"${seed.title}" tohumu vizyon panona mühürlendi! ✨`, 'auto_awesome');
    audioEngine.playCelestialChime();
  };

  const handleCompleteVisionAction = () => {
    handleIncrementStreak();
    showToast('Tebrikler! 15 dakikalık niyet mikro-adımı tamamlandı.', 'stars');
  };

  return (
    <div
      className="relative min-h-[100vh] min-h-[100svh] min-h-[100dvh] font-sans selection:bg-[#e7c355]/30 selection:text-[#fdf4dc] overflow-x-hidden flex flex-col justify-between transition-colors duration-500"
      style={{
        backgroundColor: currentTheme.bgColor,
        color: currentTheme.textColor,
      }}
    >
      {/* Living WebGL Cosmic Nebula Shader & Stardust Particle Layer */}
      <CosmicShaderBackground />

      {/* Ambient Nocturnal Starlight Gradients (Reactive to Active Theme) */}
      <div className="ambient-theme-glows fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] transition-all duration-700"
          style={{ backgroundColor: currentTheme.glow1 }}
        />
        <div
          className="absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-[110px] transition-all duration-700"
          style={{ backgroundColor: currentTheme.glow2 }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-all duration-700"
          style={{ backgroundColor: currentTheme.glow3 }}
        />
      </div>

      {/* Main Top Header (hidden when Auth is opened) */}
      {!isAuthOpen && (
        <StitchHeader
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenIOSSimulator={() => setIsIOSSimulatorOpen(true)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          isDayMode={isDayMode}
          onToggleDayMode={handleToggleDayMode}
          onOpenApkGuide={() => setIsApkModalOpen(true)}
          onReplaySplash={() => setIsSplashVisible(true)}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
        />
      )}

      {/* Auth Screen View */}
      {isAuthOpen ? (
        <div className="relative z-30 w-full min-h-[100svh] min-h-[100dvh] animate-fadeIn">
          <Suspense fallback={<TabLoadingSkeleton />}>
            <AuthScreen
              onSuccess={(userData) => {
                if (userData) {
                  setCurrentUser(userData);
                }
                setIsAuthOpen(false);
              }}
              onExploreAsGuest={() => {
                showToast('Misafir moduyla keşfe devam ediliyor ✨', 'explore');
                setIsAuthOpen(false);
              }}
              onBack={() => setIsAuthOpen(false)}
              onShowToast={showToast}
              onPlayChime={handlePlayChime}
            />
          </Suspense>
        </div>
      ) : (
        <>
          {/* Main Screen Content Viewport (Edge-to-Edge with generous mobile safe padding and dvh resilience) */}
          <main className={`relative z-10 flex-1 w-full max-w-full overflow-x-hidden pt-18 sm:pt-20 pb-safe min-h-0 ${currentTab === 'asistan' ? 'pb-36 sm:pb-36 flex flex-col' : 'pb-36 sm:pb-32 md:pb-28'}`}>
            {currentTab === 'bugun' && (
              <TodayTab
                onSwitchTab={setCurrentTab}
                onShowToast={showToast}
                streak={streak}
                onIncrementStreak={handleIncrementStreak}
                onPlayChime={handlePlayChime}
              />
            )}

            <Suspense fallback={<TabLoadingSkeleton />}>
              {currentTab === 'astro' && (
                <AstroTab
                  onSwitchTab={setCurrentTab}
                  onShowToast={showToast}
                  onPlayChime={handlePlayChime}
                  onIncrementStreak={handleIncrementStreak}
                  isAudioPlaying={isAudioPlaying}
                  onToggleAudio={handleToggleAudio}
                />
              )}

              {(currentTab === 'vizyon' || currentTab === 'hedefler') && (
                <UnifiedVisionGoalsTab
                  onShowToast={showToast}
                  onPlayChime={handlePlayChime}
                  onTriggerCelebration={handleTriggerCelebration}
                  onSwitchTab={setCurrentTab}
                />
              )}

              {currentTab === '432hz' && (
                <AudioTab
                  isAudioPlaying={isAudioPlaying}
                  onToggleAudio={handleToggleAudio}
                  onShowToast={showToast}
                  sineVolume={sineVolume}
                  onSineVolumeChange={handleSineVolumeChange}
                  rainVolume={rainVolume}
                  onRainVolumeChange={handleRainVolumeChange}
                  selectedTimer={selectedTimer}
                  onTimerSelect={setSelectedTimer}
                  currentTimeSecs={currentTimeSecs}
                  onSkip={(sec) =>
                    setCurrentTimeSecs((prev) => Math.max(0, Math.min(1260, prev + sec)))
                  }
                />
              )}

              {currentTab === 'asistan' && (
                <AssistantTab
                  onShowToast={showToast}
                  onPlayChime={handlePlayChime}
                  onSwitchTab={setCurrentTab}
                />
              )}

              {currentTab === 'ayarlar' && (
                <SettingsTab
                  onShowToast={showToast}
                  onOpenAuth={undefined}
                  onPlayChime={handlePlayChime}
                  onOpenArchitectureIntro={() => setIsArchitectureIntroOpen(true)}
                  onOpenOnboardingCards={() => setIsOnboardingCardsOpen(true)}
                  onReplaySplash={() => setIsSplashVisible(true)}
                />
              )}
            </Suspense>
          </main>

          {/* Floating Bottom Capsule Dock Navigation (Preserved exactly as requested) */}
          <StitchBottomDock
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
          />
        </>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1b2252]/95 border border-[#e7c355]/40 text-[#dee0ff] text-xs font-medium shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md animate-bounce"
          >
            {toast.icon && (
              <span className="material-symbols-outlined text-[16px] text-[#e7c355]">
                {toast.icon}
              </span>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Manifestation Starlight Confetti Canvas (Only rendered when triggered) */}
      {isConfettiActive && (
        <Suspense fallback={null}>
          <ManifestationConfetti
            active={isConfettiActive}
            onComplete={() => setIsConfettiActive(false)}
          />
        </Suspense>
      )}

      {/* Stitch Modals & Action Sheets (Deferred until opened) */}
      <Suspense fallback={null}>
        <StitchModals
          activeVision={activeVision}
          onCloseVisionModal={() => setActiveVision(null)}
          onCompleteVisionAction={handleCompleteVisionAction}
          isCelebrationOpen={isCelebrationOpen}
          onCloseCelebration={() => setIsCelebrationOpen(false)}
          isIOSSimulatorOpen={isIOSSimulatorOpen}
          onCloseIOSSimulator={() => setIsIOSSimulatorOpen(false)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          streak={streak}
          isAddVisionOpen={isAddVisionOpen}
          onCloseAddVision={() => setIsAddVisionOpen(false)}
          onAddVision={handleAddVision}
          onShowToast={showToast}
          onPlayChime={handlePlayChime}
        />

        {/* One-Time Architecture & Cognitive Logic Mini Window */}
        {isArchitectureIntroOpen && (
          <ArchitectureIntroModal
            isOpen={isArchitectureIntroOpen}
            onClose={() => setIsArchitectureIntroOpen(false)}
            onPlayChime={handlePlayChime}
          />
        )}

        {/* Android Studio Standalone APK Kit Modal */}
        {isApkModalOpen && (
          <AndroidApkModal
            isOpen={isApkModalOpen}
            onClose={() => setIsApkModalOpen(false)}
            lang="tr"
          />
        )}

        {/* Global Veira Premium Paywall Modal */}
        {isPremiumModalOpen && (
          <VeiraPremiumModal
            isOpen={isPremiumModalOpen}
            onClose={() => setIsPremiumModalOpen(false)}
            onShowToast={showToast}
            onPlayChime={handlePlayChime}
          />
        )}

        {/* First Load & Re-triggerable Mini Cards Onboarding Tour (Rendered after splash) */}
        {!isSplashVisible && isOnboardingCardsOpen && (
          <VeiraOnboardingCardsModal
            isOpen={isOnboardingCardsOpen}
            onClose={() => setIsOnboardingCardsOpen(false)}
            onPlayChime={handlePlayChime}
            onShowToast={showToast}
          />
        )}
      </Suspense>

      {/* Cinematic Veira Opening Splash Screen */}
      {isSplashVisible && (
        <VeiraSplashScreen
          onComplete={handleSplashComplete}
          onPlayChime={handlePlayChime}
        />
      )}
    </div>
  );
}
