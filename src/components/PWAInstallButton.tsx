import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, Share, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  lang?: 'tr' | 'en';
  variant?: 'header' | 'banner' | 'modal';
  onOpenApkGuide?: () => void;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang = 'tr',
  variant = 'header',
  onOpenApkGuide,
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside installed standalone PWA, hide install trigger
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f5d061]/15 text-[#f5d061] border border-[#f5d061]/30">
        <Check className="w-3.5 h-3.5" />
        <span>{lang === 'tr' ? 'Mobil Yüklü' : 'App Installed'}</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={lang === 'tr' ? 'Telefona Mobil Uygulama Olarak Yükle' : 'Install as Mobile App'}
        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
          variant === 'header'
            ? 'bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95 border border-[#c0c1ff]/30'
            : 'bg-white/10 hover:bg-white/15 text-[#fdf4dc] border border-white/20'
        } ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 text-[#f5d061]" />
        <span>
          <span className="hidden xs:inline">{lang === 'tr' ? 'Uygulamayı ' : 'Install '}</span>
          <span>{lang === 'tr' ? 'Yükle' : 'App'}</span>
        </span>
      </button>

      {/* Mobile Installation Guide Modal (rendered via Portal directly to body to prevent parent clipping) */}
      {showGuide &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn min-h-[100svh] min-h-[100dvh]"
            onClick={() => setShowGuide(false)}
          >
            <div
              className="w-full max-w-md my-auto max-h-[85svh] max-h-[85dvh] flex flex-col rounded-3xl bg-[#0e1228] border border-[#818cf8]/40 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2 text-[#f5d061]">
                  <Smartphone className="w-5 h-5 text-[#f5d061]" />
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-[#fdf4dc]">
                    {lang === 'tr' ? 'Mobil Uygulama Kurulumu' : 'Mobile App Installation'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#c7c4d7] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 space-y-4 text-xs text-[#dee0ff] overflow-y-auto flex-1 min-h-0">
                {/* Option 1: PWA Add to Home Screen */}
                <div className="p-4 rounded-2xl bg-[#161a30]/80 border border-white/10 space-y-2.5">
                  <span className="font-bold text-[#818cf8] text-xs uppercase tracking-wider block">
                    {lang === 'tr' ? '1. Yöntem: Telefona Anında Ekle (PWA)' : 'Method 1: Instant Home Screen (PWA)'}
                  </span>

                  {isIOS ? (
                    <div className="space-y-2 text-xs text-[#c7c4d7]">
                      <div className="flex items-start gap-2.5">
                        <Share className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                        <span>
                          {lang === 'tr'
                            ? 'Safari alt çubuğundaki "Paylaş" (Share) simgesine dokunun.'
                            : 'Tap the "Share" button in Safari bottom bar.'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <PlusSquare className="w-4 h-4 text-[#f5d061] shrink-0 mt-0.5" />
                        <span>
                          {lang === 'tr'
                            ? 'Aşağı kaydırıp "Ana Ekrana Ekle" (Add to Home Screen) seçeneğini seçin.'
                            : 'Scroll down and tap "Add to Home Screen".'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-[#c7c4d7]">
                      <p className="leading-relaxed">
                        {lang === 'tr'
                          ? 'Chrome veya tarayıcınızın sağ üstündeki 3 noktaya (⋮) tıklayın ve "Uygulamayı Yükle" veya "Ana ekrana ekle" seçeneğini seçin.'
                          : 'Tap the 3 dots (⋮) in Chrome or your browser menu and choose "Install App" or "Add to Home screen".'}
                      </p>
                      {isInstallable && (
                        <button
                          onClick={async () => {
                            const res = await install();
                            if (res) setShowGuide(false);
                          }}
                          className="w-full btn-celestial-primary text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center justify-center gap-2 mt-1 cursor-pointer shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span>{lang === 'tr' ? 'Şimdi Yükle (Otomatik)' : 'Install Now (Automatic)'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Option 2: Standalone Android APK Build Kit */}
                <div className="p-4 rounded-2xl bg-[#161a30]/80 border border-white/10 space-y-2.5">
                  <span className="font-bold text-[#f5d061] text-xs uppercase tracking-wider block">
                    {lang === 'tr' ? '2. Yöntem: Standalone Android APK' : 'Method 2: Standalone Android APK'}
                  </span>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    {lang === 'tr'
                      ? 'Android Studio ile doğrudan telefonunuza .APK yüklemek için hazır proje kodlarını ve yapılandırmasını inceleyin.'
                      : 'Download ready-to-compile Android Studio WebView project files and create a standalone .APK.'}
                  </p>
                  {onOpenApkGuide && (
                    <button
                      onClick={() => {
                        setShowGuide(false);
                        onOpenApkGuide();
                      }}
                      className="w-full py-2.5 px-4 rounded-full bg-[#f5d061]/15 hover:bg-[#f5d061]/25 border border-[#f5d061]/30 text-xs font-semibold text-[#f5d061] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{lang === 'tr' ? 'Android APK Dosyalarını Aç' : 'Open Android APK Kit'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end px-5 py-3 border-t border-white/10 shrink-0 bg-[#080c22]/60">
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-5 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-[#dee0ff] hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

