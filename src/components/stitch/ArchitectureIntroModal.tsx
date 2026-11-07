import React from 'react';
import { VeiraLogo } from './VeiraLogo';

interface ArchitectureIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayChime?: () => void;
}

export const ArchitectureIntroModal: React.FC<ArchitectureIntroModalProps> = ({
  isOpen,
  onClose,
  onPlayChime,
}) => {
  if (!isOpen) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem('veira_architecture_intro_seen', 'true');
    } catch {
      // fallback
    }
    if (onPlayChime) onPlayChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain text-[#dee0ff]">
      {/* Mini Window Container */}
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[94dvh] sm:max-h-[90dvh] rounded-3xl bg-[#161a30] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#e7c355] via-[#8083ff] to-[#7bd0ff]" />
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#e7c355]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-white/5 flex items-start justify-between relative z-10 shrink-0">
          <div className="flex flex-col gap-1 pr-2">
            <div className="inline-flex items-center gap-2 self-start px-2.5 py-0.5 rounded-full bg-[#e7c355]/15 border border-[#e7c355]/25 text-[#e7c355] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
              <div className="w-4 h-4 rounded-sm overflow-hidden shrink-0">
                <VeiraLogo className="w-full h-full" showFrame={true} />
              </div>
              <span>Veira • Bilişsel Mimari &amp; Yeni Sistem</span>
            </div>
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#dee0ff] tracking-tight mt-0.5">
              Veira'ya Hoş Geldin ✨
            </h2>
            <p className="text-[11px] sm:text-xs text-[#c7c4d7] leading-relaxed">
              Soyut niyetleri somut gerçekliğe dönüştüren nöro-bilim ve kognitif psikoloji metodolojimiz.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#252840] flex items-center justify-center text-[#c7c4d7] hover:text-white shrink-0 transition-colors"
            aria-label="Kapat"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 text-xs text-[#c7c4d7] leading-relaxed relative z-10 min-h-0">
          {/* Section 1: 3 Temel Bilişsel Aksiyom */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[#e7c355]">
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                3 Temel Bilişsel Aksiyom
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Aksiyom 1 */}
              <div className="p-3 rounded-2xl bg-[#252840]/60 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#dee0ff] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#e7c355]">filter_12</span>
                    1. 12 Odak Kuralı (Bilişsel Yük)
                  </span>
                  <span className="text-[10px] font-semibold text-[#e7c355] bg-[#e7c355]/10 px-2 py-0.5 rounded-full">
                    Miller Yasası
                  </span>
                </div>
                <p className="text-[11px] text-[#c7c4d7] leading-relaxed pl-5">
                  İnsan zihni en fazla 7±2 karmaşık kavramı aktif tutabilir. Veira, vizyon panonuzu 12 görselle sınırlandırarak dikkatinizi dağıtmaz, dopamin ödül yolunu odakta toplar.
                </p>
              </div>

              {/* Aksiyom 2 */}
              <div className="p-3 rounded-2xl bg-[#252840]/60 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#dee0ff] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">route</span>
                    2. WOOP Modeli &amp; 15 Dk Mikro-Eylem
                  </span>
                  <span className="text-[10px] font-semibold text-[#c0c1ff] bg-[#c0c1ff]/10 px-2 py-0.5 rounded-full">
                    SMART Köprü
                  </span>
                </div>
                <p className="text-[11px] text-[#c7c4d7] leading-relaxed pl-5">
                  Her büyük niyet, 3 aylık SMART çeyrek taşlarına ve bugünün tekil 15 dakikalık mikro-eylemine köprülenir. Erteleme davranışı sürtünmesiz başlangıçla aşılır.
                </p>
              </div>

              {/* Aksiyom 3 */}
              <div className="p-3 rounded-2xl bg-[#252840]/60 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#dee0ff] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">waves</span>
                    3. 432Hz Nöro-Akustik Rezonans
                  </span>
                  <span className="text-[10px] font-semibold text-[#7bd0ff] bg-[#7bd0ff]/10 px-2 py-0.5 rounded-full">
                    Hücresel Uyum
                  </span>
                </div>
                <p className="text-[11px] text-[#c7c4d7] leading-relaxed pl-5">
                  Saf 432Hz altın oran sinüs dalgası ve gece yağmuru soundscape'i, sempatik alarm modunu parasempatik dinginliğe geçirerek yaratıcı derin odaklanma sağlar.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: 4 Temel Yaşam Alanı & Kasa (Yeni Sistem Mantığı) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[#c7c4d7]">
              <span className="material-symbols-outlined text-[17px]">dashboard_customize</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Yeni Sistem Mantığı &amp; Yaşam Alanları
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-[#080c22]/70 border border-white/5 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7c355]/20 text-[#e7c355] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">today</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#dee0ff]">1. Bugün: Günlük Niyet &amp; 15 Dk Öncelikli Adım</h4>
                  <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                    Günün niyeti, AI ile anında yeni niyet çağırma ve günün tekil 15 dakikalık mikro-adımı. Bildirim karmaşası kaldırıldı; bildirimler Ayarlar sekmesinden açılır.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080c22]/70 border border-white/5 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome_mosaic</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#dee0ff]">2. Vizyon &amp; Hedefler: Bütünleşik Tek Sayfa</h4>
                  <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                    Ayrı sayfalar birleşti: 12 Odak Kuralı vizyon panosu, 3 aylık SMART kilometre taşları ve AI hedef parçalayıcı tek sayfada sade ve kaliteli bir akışla buluştu.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080c22]/70 border border-white/5 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#009bd1]/20 text-[#7bd0ff] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">headphones</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#dee0ff]">3. 432Hz Ses Mabedi: Nöro-Akustik Soundscape</h4>
                  <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                    432Hz saf sinüs tonu, Como dalgaları, çıtırdayan şömine ve gece yağmuru ile zihinsel berraklık ve uyku desteği.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080c22]/70 border border-white/5 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#dee0ff]">4. Veira Asistan: AI Zihin &amp; Vizyon Stüdyosu</h4>
                  <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                    Flux.1 8K Ultra-Fotogerçekçi Vizyon Stüdyosu, Stoik Zihinsel Kontrol Çemberi, 4-7-8 diyafram nefesi ve kişisel niyet koçluğu.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#080c22]/70 border border-white/5 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2f334b] text-[#dee0ff] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#dee0ff]">5. Ayarlar &amp; Kasa: Cihaz İçi Kontrol &amp; Gizlilik</h4>
                  <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                    Günlük bildirim saatini ayarlama, bildirim sıklığı, koç tonu, AES-256 yerel şifreleme ve sıfır telemetri güvencesi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Action Button */}
        <div className="p-3.5 sm:p-4 bg-[#1a1e35] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10 shrink-0">
          <span className="text-[11px] text-[#c7c4d7] text-center sm:text-left">
            İstediğin an <strong className="text-white">Ayarlar</strong> sekmesinden inceleyebilirsin.
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#e7c355] text-[#3d2f00] text-xs font-bold shadow-md hover:bg-[#ffe089] active:scale-95 transition-all text-center"
          >
            Anladım, Yolculuğa Başla ✨
          </button>
        </div>
      </div>
    </div>
  );
};
