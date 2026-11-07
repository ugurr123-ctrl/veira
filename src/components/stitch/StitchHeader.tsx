import React from 'react';
import { PWAInstallButton } from '../PWAInstallButton';
import { VeiraLogo } from './VeiraLogo';

export type StitchTab = 'bugun' | 'astro' | 'vizyon' | '432hz' | 'hedefler' | 'asistan' | 'ayarlar';

interface StitchHeaderProps {
  currentTab: StitchTab;
  onSelectTab: (tab: StitchTab) => void;
  onOpenIOSSimulator: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isDayMode?: boolean;
  onToggleDayMode?: () => void;
  onOpenApkGuide?: () => void;
  onReplaySplash?: () => void;
  onOpenPremium?: () => void;
}

export const StitchHeader: React.FC<StitchHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenIOSSimulator,
  isAudioPlaying,
  onToggleAudio,
  isDayMode = false,
  onToggleDayMode,
  onOpenApkGuide,
  onReplaySplash,
  onOpenPremium,
}) => {
  const getTabLabel = (tab: StitchTab) => {
    switch (tab) {
      case 'bugun':
        return 'Cosmos';
      case 'astro':
        return 'Astro-Vizyon';
      case 'vizyon':
      case 'hedefler':
        return 'Vizyon';
      case '432hz':
        return '432Hz';
      case 'asistan':
        return 'Asistan';
      case 'ayarlar':
        return 'Ayarlar';
      default:
        return 'Cosmos';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#141120]/80 backdrop-blur-2xl shadow-[0_1px_16px_rgba(0,0,0,0.4),0_0_20px_rgba(245,208,97,0.08)] border-b border-[#f5d061]/15 transition-all">
      <div className="h-16 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo Lockup from User Design */}
        <div className="flex items-center gap-2.5 min-w-0 relative">
          <button
            onClick={() => onSelectTab('bugun')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Ana Ekrana Dön"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center border border-[#f5d061]/40 bg-[#080a16] shadow-[0_0_12px_rgba(245,208,97,0.35)] group-hover:scale-105 transition-transform">
                <VeiraLogo className="w-full h-full" showFrame={true} />
              </div>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f5d061] animate-ping" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#f5d061] tracking-widest uppercase truncate flex items-center gap-1 font-bold">
                Veira Cosmos Core <span className="text-[10px]">✨</span>
              </span>
              <span className="font-serif text-lg sm:text-xl text-[#dee0ff] truncate leading-tight font-semibold">
                {getTabLabel(currentTab)}
              </span>
            </div>
          </button>

          {onOpenPremium && (
            <button
              type="button"
              onClick={onOpenPremium}
              title="Veira Premium & Kutsal Lisans"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-[#ffe06b]/20 to-[#f5d061]/20 text-[#ffe06b] hover:bg-[#f5d061]/30 border border-[#f5d061]/40 transition-all shadow-[0_0_10px_rgba(245,208,97,0.25)] active:scale-95 tracking-wider uppercase ml-1"
            >
              <span
                className="material-symbols-outlined text-[13px] text-[#f5d061]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
              <span>PREMIUM</span>
            </button>
          )}
        </div>

        {/* Right Actions from User Design */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* iOS Dynamic Island Simulator on desktop */}
          <button
            onClick={onOpenIOSSimulator}
            title="iOS Kilit Ekranı & Dinamik Ada Simülatörü"
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#00dce6]/10 hover:bg-[#00dce6]/20 text-[#00dce6] border border-[#00dce6]/30 transition-all active:scale-95 shadow-[0_0_10px_rgba(0,220,230,0.2)]"
          >
            <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
            <span className="text-[11px]">iOS Ada</span>
          </button>

          {/* 528Hz Solfeggio Badge with Gold & Aurora Aura */}
          <button
            onClick={onToggleAudio}
            type="button"
            title={isAudioPlaying ? 'Frekans Çalıyor (Tıklayarak Durdur)' : '528Hz DNA Onarımı ve 432Hz Çaları Başlat'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#006b71]/30 hover:bg-[#006b71]/50 backdrop-blur-md shadow-[0_0_14px_rgba(0,220,230,0.3)] border border-[#00dce6]/40 cursor-pointer active:scale-95 transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-[#00dce6] ${isAudioPlaying ? 'animate-ping' : ''} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isAudioPlaying ? 'bg-[#f5d061]' : 'bg-[#00dce6]'}`} />
            </span>
            <span className="text-[11px] font-bold text-[#04f2fe] tracking-wider">
              {isAudioPlaying ? '432Hz Canlı' : '528Hz'}
            </span>
          </button>

          {/* PWA In-App Install Button */}
          <PWAInstallButton lang="tr" onOpenApkGuide={onOpenApkGuide} />

          {/* Dedicated Gündüz / Gece Modu (Day/Light Mode Toggle at top of screen) */}
          {onToggleDayMode && (
            <button
              type="button"
              onClick={onToggleDayMode}
              title={isDayMode ? 'Gece Moduna Geç (Karanlık Kozmos)' : 'Gündüz Moduna Geç (Açık ve Ferah Renkler)'}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 shadow-sm ${
                isDayMode
                  ? 'bg-[#f8f1ff] hover:bg-[#ede4ff] text-[#1d182e] border-[#d3c5ae]/60 shadow-[0_2px_10px_rgba(212,160,23,0.18)]'
                  : 'bg-[#201e2d] hover:bg-[#2e2747] text-[#ffe06b] border-[#ffe06b]/30 shadow-[0_0_10px_rgba(245,208,97,0.15)]'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isDayMode ? 'text-[#d4a017]' : 'text-[#f5d061]'}`}>
                {isDayMode ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="text-[11px] font-bold">
                {isDayMode ? 'Gündüz' : 'Gece'}
              </span>
            </button>
          )}

          {/* Dedicated Ayarlar (Settings) Button in Top Header */}
          <button
            type="button"
            onClick={() => onSelectTab('ayarlar')}
            title="Ayarlar & Kutsal Tercihler"
            aria-label="Ayarlar"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 shrink-0 ${
              currentTab === 'ayarlar'
                ? 'bg-[#f5d061]/25 text-[#f5d061] border-[#f5d061]/50 shadow-[0_0_12px_rgba(245,208,97,0.3)]'
                : 'bg-[#201e2d] hover:bg-[#2e2747] text-[#cdc2da] hover:text-[#f5d061] border-[#f5d061]/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
