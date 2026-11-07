import React from 'react';
import { VisionModalData } from './VisionTab';
import { AddVisionScreen } from './AddVisionScreen';
import { VeiraLogo } from './VeiraLogo';

interface StitchModalsProps {
  // Vision card detail
  activeVision: VisionModalData | null;
  onCloseVisionModal: () => void;
  onCompleteVisionAction: () => void;

  // 12/12 Celebration modal
  isCelebrationOpen: boolean;
  onCloseCelebration: () => void;

  // iOS Lock Screen & Dynamic Island Simulator modal
  isIOSSimulatorOpen: boolean;
  onCloseIOSSimulator: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  streak: number;

  // Add Vision Modal
  isAddVisionOpen: boolean;
  onCloseAddVision: () => void;
  onAddVision: (vision: {
    title: string;
    category: string;
    desc: string;
    imageUrl?: string;
    action?: string;
  }) => void;
  onShowToast?: (msg: string, icon?: string) => void;
  onPlayChime?: () => void;
}

export const StitchModals: React.FC<StitchModalsProps> = ({
  activeVision,
  onCloseVisionModal,
  onCompleteVisionAction,
  isCelebrationOpen,
  onCloseCelebration,
  isIOSSimulatorOpen,
  onCloseIOSSimulator,
  isAudioPlaying,
  onToggleAudio,
  streak,
  isAddVisionOpen,
  onCloseAddVision,
  onAddVision,
  onShowToast,
  onPlayChime,
}) => {
  return (
    <>
      {/* 1. VISION CARD DETAIL MODAL */}
      {activeVision && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={onCloseVisionModal}
        >
          <div
            className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-[#0e1228] border border-[#e7c355]/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(231,195,85,0.15)] relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={onCloseVisionModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#c7c4d7] hover:text-white transition-colors"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Category Pill */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#e7c355]/15 text-[#e7c355] border border-[#e7c355]/30">
                {activeVision.category}
              </span>
              <span className="text-xs text-[#c7c4d7]">12 Odak Kuralı</span>
            </div>

            {/* Title & Desc */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#dee0ff] mb-2 leading-tight">
              {activeVision.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed mb-5 font-light">
              {activeVision.desc}
            </p>

            {/* 15-Minute Action Section */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#c0c1ff] uppercase tracking-wider">
                  Bugünün 15 Dakikalık Mikro-Eylemi
                </span>
                <span className="text-xs text-[#e7c355] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  15 Dk
                </span>
              </div>
              <p className="text-xs text-[#dee0ff]">
                Bu vizyona alan açmak için zihnini hazırlayan ve direnç yaratmayan tek somut adım.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onCompleteVisionAction();
                  onCloseVisionModal();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#e7c355] hover:bg-[#ebd074] text-[#3b2f00] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(231,195,85,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">check_circle</span>
                <span>Bugünkü 15 Dakikayı Tamamladım</span>
              </button>

              <button
                onClick={onCloseVisionModal}
                className="w-full py-2.5 px-4 rounded-xl text-xs text-[#c7c4d7] hover:text-white transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 12/12 CELEBRATION MODAL */}
      {isCelebrationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={onCloseCelebration}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-gradient-to-b from-[#14193d] to-[#080c22] border-2 border-[#e7c355]/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_70px_rgba(231,195,85,0.35)] relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing Aura Ring */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-[#e7c355]/15 border-2 border-[#e7c355] flex items-center justify-center shadow-[0_0_35px_rgba(231,195,85,0.6)] mb-4 sm:mb-5">
              <span
                className="material-symbols-outlined text-[#e7c355] text-4xl sm:text-5xl animate-bounce"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
            </div>

            <span className="text-xs font-bold text-[#e7c355] tracking-widest uppercase">
              12/12 Odak Çemberi
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 mb-2 sm:mb-3">
              Görkemli Tamamlanma
            </h3>
            <p className="text-xs sm:text-sm text-[#dee0ff]/80 font-light leading-relaxed mb-5 sm:mb-6">
              Tebrikler Selin! Vizyon panondaki 12 kutsal odağın tamamı netleşti ve titreşimsel uyuma kavuştu. Artık enerjin dağılmıyor, her nefesin Como Gölü hedefine akıyor.
            </p>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-5 sm:mb-6 text-xs text-[#c0c1ff] italic">
              "Evren telaşı değil, berrak ve kararlı ritmi ödüllendirir."
            </div>

            <button
              onClick={onCloseCelebration}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#e7c355] hover:bg-[#ebd074] text-[#3b2f00] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(231,195,85,0.5)] transition-transform active:scale-95"
            >
              Kutlamayı Yaşa & Devam Et ✨
            </button>
          </div>
        </div>
      )}

      {/* 3. iOS DYNAMIC ISLAND & LOCK SCREEN SIMULATOR MODAL */}
      {isIOSSimulatorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={onCloseIOSSimulator}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto rounded-[36px] sm:rounded-[44px] p-3.5 sm:p-4 bg-[#050716] border-4 border-[#252845] shadow-[0_0_60px_rgba(123,208,255,0.2)] text-white relative flex flex-col items-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Speaker / Dynamic Island Capsule */}
            <div className="w-full flex items-center justify-between px-3 pt-2 mb-3">
              <span className="text-xs font-semibold text-white/80">09:41</span>
              {/* Dynamic Island Capsule */}
              <div
                onClick={onToggleAudio}
                className="cursor-pointer px-3.5 py-1.5 rounded-full bg-black border border-white/20 flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:border-[#e7c355]/60 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#e7c355] animate-pulse" />
                <span className="text-[11px] font-semibold text-[#dee0ff]">VEIRA · 432Hz</span>
                <span className="material-symbols-outlined text-[#e7c355] text-[14px]">
                  {isAudioPlaying ? 'graphic_eq' : 'play_arrow'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                <span className="material-symbols-outlined text-[14px]">battery_full</span>
              </div>
            </div>

            {/* Lock Screen Time Display */}
            <div className="text-center my-4">
              <div className="text-xs uppercase tracking-widest text-white/60 mb-0.5">
                Pazartesi, 26 Ekim
              </div>
              <div className="text-6xl font-light tracking-tight font-serif text-white">
                09:41
              </div>
            </div>

            {/* iOS Widget Bar: Concentric Wheel & Streak */}
            <div className="w-full grid grid-cols-2 gap-2.5 mb-4">
              {/* Streak Widget */}
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined text-[#e7c355] text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <div>
                  <div className="text-[10px] text-white/60 uppercase font-semibold">Seri</div>
                  <div className="text-sm font-bold text-white">{streak} Gün Kesintisiz</div>
                </div>
              </div>

              {/* Wheel Widget */}
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#7bd0ff] text-2xl">
                  donut_large
                </span>
                <div>
                  <div className="text-[10px] text-white/60 uppercase font-semibold">Denge</div>
                  <div className="text-sm font-bold text-white">%68 Uyum</div>
                </div>
              </div>
            </div>

            {/* Lock Screen Active Notification: 15-Minute Action */}
            <div className="w-full p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e7c355]">
                  <VeiraLogo className="w-4 h-4 rounded-md overflow-hidden" showFrame={true} />
                  <span>VEIRA • GÜNÜN NİYETİ</span>
                </div>
                <span className="text-[10px] text-white/50">Şimdi</span>
              </div>
              <p className="text-xs text-white/90 font-medium mb-1">
                Como Gölü: İtalyanca B1 Konuşma Pratiği
              </p>
              <p className="text-[11px] text-white/60">
                15 dakikalık podcast dinlemesi zihninde vizyonunu canlandıracak.
              </p>
            </div>

            {/* Bottom Torch & Camera Shortcut Pills */}
            <div className="w-full flex items-center justify-between px-6 pt-1 pb-3">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80">
                <span className="material-symbols-outlined text-[20px]">flashlight_on</span>
              </div>
              <button
                onClick={onCloseIOSSimulator}
                className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs text-white transition-colors"
              >
                Simülatörü Kapat
              </button>
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
            </div>

            {/* Home Indicator Bar */}
            <div className="w-32 h-1 bg-white/40 rounded-full mt-1 mb-1" />
          </div>
        </div>
      )}

      {/* 4. NEW VISION SEED SCREEN */}
      {isAddVisionOpen && (
        <AddVisionScreen
          onClose={onCloseAddVision}
          onAddVision={onAddVision}
          onShowToast={onShowToast || (() => {})}
          onPlayChime={onPlayChime}
        />
      )}
    </>
  );
};
