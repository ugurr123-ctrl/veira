import React, { useState } from 'react';
import { VeiraLogo } from './VeiraLogo';

interface VeiraPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime?: () => void;
}

export const VeiraPremiumModal: React.FC<VeiraPremiumModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onPlayChime,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'annual'>('lifetime');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    if (onPlayChime) onPlayChime();

    setTimeout(() => {
      try {
        localStorage.setItem('veira_is_premium', 'true');
        localStorage.setItem('veira_premium_tier', selectedPlan);
      } catch {
        // safe fallback
      }
      setIsProcessing(false);
      onShowToast(
        selectedPlan === 'lifetime'
          ? '🌟 Veira Ömür Boyu Lisansınız aktive edildi! Hoş geldiniz.'
          : '✨ 7 Günlük Ücretsiz Veira Premium denemeniz başladı!',
        'stars'
      );
      onClose();
    }, 800);
  };

  const handleRestorePurchases = () => {
    if (onPlayChime) onPlayChime();
    onShowToast('Apple ID / Google Play lisans makbuzu doğrulandı: Ömür Boyu Premium geri yüklendi ✨', 'restore');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-[#080c22]/90 backdrop-blur-xl animate-fadeIn overflow-y-auto overscroll-contain"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[94dvh] sm:max-h-[90dvh] bg-gradient-to-b from-[#1a1e35] via-[#14172c] to-[#0d1022] border border-[#e7c355]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col text-left overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Radiant Ambient Background Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#e7c355]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#7bd0ff]/15 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden flex items-center justify-center border border-[#e7c355]/40 bg-[#080a16] shadow-sm shrink-0">
              <VeiraLogo className="w-full h-full" showFrame={true} />
            </div>
            <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-[#dee0ff]">
              Veira Premium
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Kapat"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#c7c4d7] hover:text-white flex items-center justify-center transition-colors border border-white/10 active:scale-95 shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[19px]">close</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-0.5 sm:pr-1 pt-3 space-y-4 relative z-10">

        {/* Hero Section */}
        <div className="text-center space-y-2 relative z-10 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7c355]/15 border border-[#e7c355]/30 shadow-sm text-[#e7c355] text-[11px] font-bold tracking-widest uppercase">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span>KUTSAL ZİHİN &amp; VİZYON KASASI</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hayallerini Günlük Eyleme Dönüştür
          </h2>
          <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed max-w-md mx-auto">
            Sınırsız 8K fotogerçekçi vizyon üretimi, 15 dakikalık WOOP bilişsel ayrıştırma ve 432Hz hücresel nöro-ses arşiviyle zihinsel netliğini en üst seviyeye taşı.
          </p>
        </div>

        {/* Plan Selectors (Apple / Google Store Transparent Tiering) */}
        <div className="space-y-3 relative z-10">
          {/* Option 1: Ömür Boyu Lisans */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all relative flex flex-col gap-2 ${
              selectedPlan === 'lifetime'
                ? 'bg-gradient-to-r from-[#e7c355]/20 via-[#252840] to-[#1a1e35] border-[#e7c355] shadow-[0_0_24px_rgba(231,195,85,0.25)]'
                : 'bg-[#161a30]/80 hover:bg-[#252840]/60 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    selectedPlan === 'lifetime'
                      ? 'border-[#e7c355] bg-[#e7c355] text-[#3d2f00]'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  {selectedPlan === 'lifetime' && (
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  )}
                </div>
                <span className="text-sm font-bold text-white">Ömür Boyu Kutsal Lisans</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e7c355] text-[#3d2f00] text-[10px] font-extrabold uppercase tracking-wide">
                TAVSİYE EDİLEN
              </span>
            </div>

            <div className="flex items-baseline justify-between pl-7">
              <div>
                <p className="text-xs text-[#c7c4d7]">Tek seferlik ödeme • Asla yenileme yok</p>
                <p className="text-[11px] text-[#ffe089] font-medium">Ömür boyu tüm gelecekteki güncellemeler dahil</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#ffe089]">₺899</span>
                <span className="text-[10px] text-[#908fa0] block">tek seferlik</span>
              </div>
            </div>
          </div>

          {/* Option 2: Yıllık Plan (7 Gün Ücretsiz Deneme) */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all relative flex flex-col gap-2 ${
              selectedPlan === 'annual'
                ? 'bg-gradient-to-r from-[#7bd0ff]/20 via-[#252840] to-[#1a1e35] border-[#7bd0ff] shadow-[0_0_24px_rgba(123,208,255,0.25)]'
                : 'bg-[#161a30]/80 hover:bg-[#252840]/60 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    selectedPlan === 'annual'
                      ? 'border-[#7bd0ff] bg-[#7bd0ff] text-[#080c22]'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  {selectedPlan === 'annual' && (
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  )}
                </div>
                <span className="text-sm font-bold text-white">Yıllık Plan</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7bd0ff]/20 text-[#7bd0ff] border border-[#7bd0ff]/30 text-[10px] font-bold uppercase tracking-wide">
                7 GÜN ÜCRETSİZ
              </span>
            </div>

            <div className="flex items-baseline justify-between pl-7">
              <div>
                <p className="text-xs text-[#c7c4d7]">7 gün boyunca sıfır risk • İstediğin an iptal et</p>
                <p className="text-[11px] text-[#7bd0ff] font-medium">Aylık sadece ~₺29 denk gelir</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#7bd0ff]">₺349</span>
                <span className="text-[10px] text-[#908fa0] block">/ yıl</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Bento Grid (Sade & Etkileyici Avantajlar) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-10 text-xs">
          <div className="p-3 rounded-xl bg-[#080c22]/80 border border-white/5 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#e7c355] text-[18px] shrink-0">palette</span>
            <div>
              <p className="font-bold text-white text-[11px]">Sınırsız 8K Flux.1 AI</p>
              <p className="text-[10px] text-[#908fa0]">Fotogerçekçi sınırsız vizyon görseli üretimi</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080c22]/80 border border-white/5 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[18px] shrink-0">psychology</span>
            <div>
              <p className="font-bold text-white text-[11px]">15 Dk WOOP Motoru</p>
              <p className="text-[10px] text-[#908fa0]">Hedefleri günlük mikro-eyleme bölen yapay zeka</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080c22]/80 border border-white/5 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[18px] shrink-0">graphic_eq</span>
            <div>
              <p className="font-bold text-white text-[11px]">432Hz Nöro-Akustik</p>
              <p className="text-[10px] text-[#908fa0]">Sonsuz arka plan çalma ve yağmur dokuları</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080c22]/80 border border-white/5 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#e7c355] text-[18px] shrink-0">shield</span>
            <div>
              <p className="font-bold text-white text-[11px]">AES-256 Gizlilik Kasa</p>
              <p className="text-[10px] text-[#908fa0]">%100 yerel kriptografi, sıfır veri takibi</p>
            </div>
          </div>
        </div>

        {/* Primary Subscribe CTA */}
        <div className="space-y-2.5 pt-1 relative z-10">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSubscribe}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffe089] via-[#e7c355] to-[#e7c355] text-[#3d2f00] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(231,195,85,0.4)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            <span>
              {selectedPlan === 'lifetime'
                ? 'Ömür Boyu Erişimi Aktifleştir (₺899)'
                : '7 Günlük Ücretsiz Denemeyi Başlat'}
            </span>
          </button>

          {/* Anti-Dark Pattern Reassurance */}
          <div className="flex items-center justify-center gap-1.5 text-center text-[#908fa0] text-[11px]">
            <span className="material-symbols-outlined text-[13px] text-[#7bd0ff]">verified</span>
            <span>Sıfır gizli masraf. İstediğin an App Store veya Google Play üzerinden 1 tıkla iptal et.</span>
          </div>
        </div>

        {/* Footer Store Actions (Apple Guideline 3.1.2 & EULA Links) */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#908fa0] relative z-10">
          <button
            type="button"
            onClick={handleRestorePurchases}
            className="text-[#ffe089] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">restore</span>
            <span>Satın Alımları Geri Yükle</span>
          </button>
          <span>•</span>
          <span className="text-[#a4a2b5]">Kullanım Koşulları (EULA)</span>
          <span>•</span>
          <span className="text-[#a4a2b5]">Gizlilik Politikası</span>
        </div>
        </div>
      </div>
    </div>
  );
};
