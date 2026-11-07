import React, { useState } from 'react';
import { VeiraLogo } from './VeiraLogo';
import { requestNotificationPermission } from '../../utils/dailyIntentions';

interface VeiraOnboardingCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayChime?: () => void;
  onShowToast?: (msg: string, icon?: string) => void;
}

interface OnboardingCardItem {
  id: string;
  tag: string;
  badgeColor: string;
  icon: string;
  title: string;
  subtitle: string;
  bullets: string[];
  gradient: string;
  borderAccent: string;
}

const ONBOARDING_CARDS: OnboardingCardItem[] = [
  {
    id: 'vision',
    tag: 'BİLİŞSEL MİMARİ',
    badgeColor: 'bg-[#f5d061]/15 text-[#f5d061] border-[#f5d061]/30',
    icon: 'flare',
    title: 'Kozmik Vizyon Panosu & 15 Dk Eylemler',
    subtitle: 'Hayallerini ertelenemez, dirençsiz mikro-adımlara dönüştür.',
    bullets: [
      'Bilişsel yükü sıfırlayan atomik 15 dakikalık günlük görevler.',
      'Yapay zeka hedef ayrıştırma motoru (WOOP & Atomic Habits).',
      'Yüksek çözünürlüklü 4K estetik görsel kolajı ve niyet odaları.',
    ],
    gradient: 'from-[#2b2438] via-[#1a1727] to-[#120f1e]',
    borderAccent: 'border-[#f5d061]/40',
  },
  {
    id: 'astro',
    tag: 'GÖKSEL SENKRONİZASYON',
    badgeColor: 'bg-[#00dce6]/15 text-[#00dce6] border-[#00dce6]/30',
    icon: 'hdr_strong',
    title: '360° Zodyak & Canlı Transit Çarkı',
    subtitle: 'Doğum haritan ve gökyüzü ritmiyle kusursuz hizalan.',
    bullets: [
      'Güneş, Ay, Merkür, Venüs ve Mars gerçek zamanlı derece hesaplamaları.',
      '360 derece interaktif gezegen ve burç çarkı.',
      'Her gün yenilenen, dinamik astrolojik rehberlik ve Ay fazı analizi.',
    ],
    gradient: 'from-[#17253b] via-[#11192e] to-[#0c1222]',
    borderAccent: 'border-[#00dce6]/40',
  },
  {
    id: 'reflection',
    tag: 'AKŞAM YANSIMASI',
    badgeColor: 'bg-[#ff95d5]/15 text-[#ff95d5] border-[#ff95d5]/30',
    icon: 'auto_stories',
    title: 'Şiirsel Günlük Tefekkür (Daily Reflection)',
    subtitle: 'Tamamladığın her emek, akşam olunca lirik bir şiire dönüşür.',
    bullets: [
      'Arka planda tamamlanan görevlerini otomatik takip eden bilinç motoru.',
      '4 dizelik lirik şiir, şefkatli nesir anlatımı ve gece olumlaması.',
      '432Hz Solfeggio tefekkür tınısı ile günü dinginlikle kapatma.',
    ],
    gradient: 'from-[#2b172d] via-[#1f1025] to-[#120918]',
    borderAccent: 'border-[#ff95d5]/40',
  },
  {
    id: 'sound',
    tag: 'ZİHİNSEL AKIŞ',
    badgeColor: 'bg-[#a379f7]/15 text-[#a379f7] border-[#a379f7]/30',
    icon: 'graphic_eq',
    title: '432Hz Frekans Mabedi & Odak Sayacı',
    subtitle: 'Zihinsel gürültüyü kesen kutsal rezonans ve alfa dalgaları.',
    bullets: [
      'Doğal Solfeggio 432Hz saf sinüs tonu ve organik yağmur mikseri.',
      '15 dakikalık nörolojik odaklanma ve geri sayım ritüeli.',
      'Sekmeler arasında kesintisiz akan arka plan ses mimarisi.',
    ],
    gradient: 'from-[#231a3d] via-[#18122c] to-[#0f0b1d]',
    borderAccent: 'border-[#a379f7]/40',
  },
  {
    id: 'notifications',
    tag: 'ZARİF HATIRLATICILAR',
    badgeColor: 'bg-[#55e7a5]/15 text-[#55e7a5] border-[#55e7a5]/30',
    icon: 'notifications_active',
    title: 'Nazik Bildirimler & Veri Gizliliği',
    subtitle: 'Gürültüden uzak, sadece günün niyetini ve akşam şiirini fısıldar.',
    bullets: [
      'Sabah günün niyetini, akşam tamamlanan zaferlerin tefekkürünü bildirir.',
      'Sıfır spam, tamamen senin kontrolünde zarif bildirim izni.',
      'Tüm hedefler ve veriler cihazında şifreli ve yerel kalır.',
    ],
    gradient: 'from-[#122e26] via-[#0d211b] to-[#081511]',
    borderAccent: 'border-[#55e7a5]/40',
  },
];

export const VeiraOnboardingCardsModal: React.FC<VeiraOnboardingCardsModalProps> = ({
  isOpen,
  onClose,
  onPlayChime,
  onShowToast,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRequestingNotif, setIsRequestingNotif] = useState(false);

  if (!isOpen) return null;

  const currentCard = ONBOARDING_CARDS[activeIndex];
  const isLast = activeIndex === ONBOARDING_CARDS.length - 1;

  const handleNext = () => {
    if (onPlayChime) onPlayChime();
    if (isLast) {
      handleComplete();
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (onPlayChime) onPlayChime();
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('veira_onboarding_cards_seen', 'true');
    } catch {
      // safe
    }
    if (onPlayChime) onPlayChime();
    if (onShowToast) {
      onShowToast('✨ Veira kozmik yolculuğun başladı!', 'stars');
    }
    onClose();
  };

  const handleEnableNotification = async () => {
    setIsRequestingNotif(true);
    const granted = await requestNotificationPermission();
    setIsRequestingNotif(false);
    if (granted) {
      if (onShowToast) onShowToast('🔔 Zarif bildirimler aktif edildi!', 'notifications');
      if (onPlayChime) onPlayChime();
    } else {
      if (onShowToast) onShowToast('Bildirim izni verilmedi veya desteklenmiyor.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto overscroll-contain text-[#e6dff5]">
      {/* Container */}
      <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-[#141221] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden my-auto">
        {/* Top ambient gold bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f5d061] via-[#00dce6] to-[#ff95d5]" />

        {/* Modal Top Nav: Logo, Step Indicator, Close */}
        <div className="p-4 sm:p-5 pb-2 flex items-center justify-between border-b border-white/5 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded overflow-hidden">
              <VeiraLogo className="w-full h-full" showFrame={true} />
            </div>
            <span className="font-serif text-sm font-bold text-[#f5d061] tracking-wider uppercase">
              Veira Rehberi
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#978da3] tabular-nums">
              {activeIndex + 1} / {ONBOARDING_CARDS.length}
            </span>
            <button
              type="button"
              onClick={handleComplete}
              className="text-[11px] text-[#978da3] hover:text-[#f5d061] transition-colors font-medium px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Atla
            </button>
          </div>
        </div>

        {/* Mini Card Presentation Area */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 relative z-10">
          {/* Visual Mini Card */}
          <div
            className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${currentCard.gradient} border ${currentCard.borderAccent} shadow-2xl relative overflow-hidden transition-all duration-300 min-h-[260px] flex flex-col justify-between`}
          >
            {/* Background glowing watermark icon */}
            <div className="absolute -bottom-4 -right-4 text-white/5 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[140px] leading-none">
                {currentCard.icon}
              </span>
            </div>

            {/* Card Header Tag */}
            <div className="flex items-center justify-between relative z-10">
              <span
                className={`text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border backdrop-blur-md ${currentCard.badgeColor}`}
              >
                {currentCard.tag}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#f5d061] border border-white/10">
                <span className="material-symbols-outlined text-[18px]">
                  {currentCard.icon}
                </span>
              </div>
            </div>

            {/* Card Title & Description */}
            <div className="my-2 relative z-10 space-y-1.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {currentCard.title}
              </h3>
              <p className="text-xs text-[#cdc2da] leading-relaxed">
                {currentCard.subtitle}
              </p>
            </div>

            {/* Bullets List */}
            <div className="space-y-1.5 pt-2 border-t border-white/10 relative z-10">
              {currentCard.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-[#e6dff5]">
                  <span className="text-[#f5d061] font-bold text-xs shrink-0 mt-0.5">✦</span>
                  <span className="leading-snug">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Notification Quick Opt-in if on notifications card */}
            {currentCard.id === 'notifications' && (
              <div className="mt-3 pt-2 relative z-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleEnableNotification}
                  disabled={isRequestingNotif}
                  className="px-3 py-1.5 rounded-xl bg-[#55e7a5]/20 hover:bg-[#55e7a5]/30 border border-[#55e7a5]/40 text-[#55e7a5] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isRequestingNotif ? 'hourglass_empty' : 'notifications'}
                  </span>
                  <span>{isRequestingNotif ? 'İzin İsteniyor...' : 'Bildirimleri Şimdi Etkinleştir'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 py-1">
            {ONBOARDING_CARDS.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  if (onPlayChime) onPlayChime();
                  setActiveIndex(idx);
                }}
                className={`transition-all rounded-full ${
                  activeIndex === idx
                    ? 'w-6 h-1.5 bg-[#f5d061] shadow-[0_0_8px_#f5d061]'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Kart ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 pt-1 border-t border-white/5 flex items-center justify-between gap-3 relative z-10 bg-[#0f0d1a]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#978da3] hover:text-white disabled:opacity-30 disabled:hover:text-[#978da3] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">west</span>
            <span>Geri</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 ${
              isLast
                ? 'bg-gradient-to-r from-[#f5d061] to-[#ffe06b] text-[#080c22] shadow-[0_0_20px_rgba(245,208,97,0.4)]'
                : 'bg-[#252238] hover:bg-[#302c46] text-[#e6dff5] border border-white/10'
            }`}
          >
            <span>{isLast ? 'Yolculuğa Başla ✨' : 'Sonraki Kart'}</span>
            <span className="material-symbols-outlined text-[16px]">
              {isLast ? 'check_circle' : 'east'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
