import React from 'react';
import {
  Sparkles,
  Compass,
  Flame,
  BookOpen,
  Headphones,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Smartphone,
  Globe,
  Monitor,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ScreenTab = 'manifest' | 'goals' | 'rhythms' | 'journal' | 'audio' | 'constellation';

interface NavigationProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenApkModal: () => void;
  lang: 'tr' | 'en';
  onToggleLang: () => void;
  isMobileFrameEnabled: boolean;
  onToggleMobileFrame: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  isAudioPlaying,
  onToggleAudio,
  onOpenApkModal,
  lang,
  onToggleLang,
  isMobileFrameEnabled,
  onToggleMobileFrame,
}) => {
  const navItems: Array<{ id: ScreenTab; label: string; labelTr: string; icon: React.ElementType }> = [
    { id: 'manifest', label: 'Manifest', labelTr: 'Niyetler', icon: Sparkles },
    { id: 'goals', label: 'Goals & Orbit', labelTr: 'Hedefler', icon: Compass },
    { id: 'rhythms', label: 'Rhythms', labelTr: 'Ritüeller', icon: Flame },
    { id: 'journal', label: 'Sanctuary Journal', labelTr: 'Günlük', icon: BookOpen },
    { id: 'audio', label: '432Hz Sound', labelTr: '432Hz Ses', icon: Headphones },
    { id: 'constellation', label: 'Constellation', labelTr: 'Takımyıldız', icon: Share2 },
  ];

  return (
    <>
      {/* Top Bar: Zone 1 (Wordmark) — Zone 2 (Navigation Links) — Zone 3 (Action Controls) */}
      <header className="sticky top-0 z-40 w-full bg-[#080A16]/90 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('manifest')}
            className="flex items-center gap-2 text-left group whitespace-nowrap shrink-0 focus:outline-none"
          >
            <span className="font-editorial text-2xl font-semibold tracking-tight text-[#fdf4dc] group-hover:text-[#c0c1ff] transition-colors">
              Veira
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-widest uppercase text-[#818cf8] hidden xs:inline">
              {lang === 'tr' ? 'Mobil' : 'Sanctuary'}
            </span>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              const displayLabel = lang === 'tr' ? item.labelTr : item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors text-sm ${
                    active
                      ? 'text-[#fdf4dc] font-semibold'
                      : 'text-[#c7c4d7]/70 hover:text-[#dee0ff]'
                  }`}
                >
                  {displayLabel}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6366f1] via-[#f5d061] to-[#38bdf8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Mobile Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              title={lang === 'tr' ? 'Switch to English' : 'Türkçe Dil Seçeneği'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#dee0ff] border border-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#818cf8]" />
              <span className="font-mono text-[11px] uppercase">{lang}</span>
            </button>

            {/* Mobile Device Frame Toggle (Desktop) */}
            <button
              onClick={onToggleMobileFrame}
              title={
                isMobileFrameEnabled
                  ? lang === 'tr'
                    ? 'Tam Ekran Görünüme Geç'
                    : 'Switch to Full Screen'
                  : lang === 'tr'
                  ? 'Telefon Simülatörüne Geç'
                  : 'Switch to Mobile Phone Shell'
              }
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isMobileFrameEnabled
                  ? 'bg-[#38bdf8]/20 border-[#38bdf8]/60 text-[#fdf4dc] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'bg-white/5 border-white/10 text-[#c7c4d7] hover:text-white hover:bg-white/10'
              }`}
            >
              {isMobileFrameEnabled ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{lang === 'tr' ? 'Tam Ekran' : 'Full Screen'}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#f5d061]" />
                  <span>{lang === 'tr' ? 'Telefon Görünümü' : 'Phone Shell'}</span>
                </>
              )}
            </button>

            {/* Quick 432Hz Sound Ambient Toggle */}
            <button
              onClick={onToggleAudio}
              title={isAudioPlaying ? 'Durdur (432Hz)' : 'Başlat (432Hz)'}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isAudioPlaying
                  ? 'bg-[#6366f1]/25 border-[#818cf8]/60 text-[#fdf4dc] shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'bg-white/5 border-white/10 text-[#c7c4d7] hover:border-white/25 hover:text-white'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#f5d061] animate-pulse" />
                  <span className="tabular-nums hidden sm:inline">432Hz</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#c7c4d7]" />
                  <span className="hidden sm:inline">432Hz</span>
                </>
              )}
            </button>

            {/* PWA In-App Install Button */}
            <PWAInstallButton
              lang={lang}
              onOpenApkGuide={onOpenApkModal}
            />

            {/* Android APK Download Modal Button */}
            <button
              onClick={onOpenApkModal}
              title={lang === 'tr' ? 'Android APK İndirme Kiti' : 'Android APK Build Kit'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-[#c7c4d7] hover:text-white border border-white/10 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#818cf8]" />
              <span className="hidden sm:inline">APK</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar (Ergonomic Thumb Reach Zone <= 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080A16]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="grid grid-cols-6 items-center h-16 px-1">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            const Icon = item.icon;
            const shortLabel =
              lang === 'tr'
                ? item.id === 'manifest'
                  ? 'Niyet'
                  : item.id === 'goals'
                  ? 'Hedef'
                  : item.id === 'rhythms'
                  ? 'Ritüel'
                  : item.id === 'journal'
                  ? 'Günlük'
                  : item.id === 'audio'
                  ? '432Hz'
                  : 'Yıldız'
                : item.id === 'manifest'
                ? 'Manifest'
                : item.id === 'goals'
                ? 'Goals'
                : item.id === 'rhythms'
                ? 'Rhythms'
                : item.id === 'journal'
                ? 'Journal'
                : item.id === 'audio'
                ? '432Hz'
                : 'Stars';

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center h-full py-1 transition-colors relative ${
                  active ? 'text-[#f5d061]' : 'text-[#c7c4d7]/70 hover:text-[#dee0ff]'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                <span className="text-[9px] sm:text-[10px] font-medium tracking-tight mt-1 truncate max-w-[50px]">
                  {shortLabel}
                </span>
                {active && (
                  <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#f5d061] shadow-[0_0_6px_#f5d061]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
