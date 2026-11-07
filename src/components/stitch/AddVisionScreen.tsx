import React, { useState, useRef } from 'react';
import { VisionAiImageGeneratorModal } from './VisionAiImageGeneratorModal';

interface AddVisionScreenProps {
  onClose: () => void;
  onAddVision: (vision: {
    title: string;
    category: string;
    desc: string;
    imageUrl?: string;
    action?: string;
  }) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime?: () => void;
}

export type FrameFormat = 'polaroid' | 'kelle' | 'cam' | 'serbest';

export interface ConnectedGoalItem {
  id: string;
  categoryLabel: string;
  title: string;
  progressPercent: number;
  progressText: string;
  durationText: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
}

export const AddVisionScreen: React.FC<AddVisionScreenProps> = ({
  onClose,
  onAddVision,
  onShowToast,
  onPlayChime,
}) => {
  // Form and visual states
  const [title, setTitle] = useState('Como Gölü Tasarım Stüdyosu & Sakin Yaşam');
  const [affirmation, setAffirmation] = useState(
    'Her sabah gölün dinginliğine uyanıyor, küresel projelerimi özgürce yönetiyorum. Ruhum huzurda, zihnim berrak ve bolluk akışında.'
  );
  const [selectedFormat, setSelectedFormat] = useState<FrameFormat>('polaroid');
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '1:1' | '16:9'>('4:5');
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [isAiBackgroundRemoved, setIsAiBackgroundRemoved] = useState(false);
  const [isMicroActionChecked, setIsMicroActionChecked] = useState(false);

  // Connected Goals state
  const [connectedGoals, setConnectedGoals] = useState<ConnectedGoalItem[]>([
    {
      id: 'career',
      categoryLabel: 'Kariyer & Bolluk',
      title: 'Como Gölü Kıyısında Yaşam ve Özgür Çalışma Düzeni',
      progressPercent: 75,
      progressText: '%75 İlerleme',
      durationText: '142 Gün Kaldı',
      icon: 'corporate_fare',
      iconBg: 'bg-[#e7c355]/20',
      iconColor: 'text-[#e7c355]',
      barColor: 'bg-[#e7c355]',
    },
    {
      id: 'wellness',
      categoryLabel: 'Beden & Canlılık',
      title: 'Haftalık 4 Gün Pilates ve Hücresel Arınma',
      progressPercent: 40,
      progressText: '%40 İlerleme',
      durationText: 'Sürekli Rutin',
      icon: 'spa',
      iconBg: 'bg-[#009bd1]/20',
      iconColor: 'text-[#7bd0ff]',
      barColor: 'bg-[#7bd0ff]',
    },
    {
      id: 'spirit',
      categoryLabel: 'Ruhsal Denge',
      title: '432Hz Günlük Gece Dinginlik ve Meditasyon Seansı',
      progressPercent: 90,
      progressText: '%90 Alışkanlık Tutarlılığı',
      durationText: '21 Günlük Seri',
      icon: 'bedtime',
      iconBg: 'bg-[#8083ff]/20',
      iconColor: 'text-[#c0c1ff]',
      barColor: 'bg-[#c0c1ff]',
    },
  ]);
  const [selectedGoal, setSelectedGoal] = useState<string>('career');

  // New Goal Modal states
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [newGoalCategory, setNewGoalCategory] = useState('Kariyer & Bolluk');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalHorizon, setNewGoalHorizon] = useState('90 Gün (1 Çeyrek)');

  // AI Image Generator Modal state
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // Vision Image
  const [imageUrl, setImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCzRvB_cY7Xsrn4WWr0Ra7G3WrsZ3SPUWhhVUTA0gIscjy0Wgtinrm061u0pq0UpLWOEWiyORoZcXS2tAydmmI8M_c8ZEN43ODwDKEeI4ZtmRgMOUSiB9QDBj5ojoqFN0GgLySmtHdMad4uzTEoJ44V5P-5Tef8UaOSj9rf85AwBtmYNM9r_Cj77ozRXJB9fX_VNbsb4gRPLMKlvFVGHrKYty-M3B87zq1KStT6LUU'
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Haptic feedback helper
  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(25);
      }
    } catch {
      // silent fallback
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
          triggerHaptic();
          onShowToast('Yeni görsel vizyon alanına yüklendi ✨', 'photo_library');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiPolishAffirmation = () => {
    triggerHaptic();
    const polishedOptions = [
      'Her sabah gölün dinginliğine uyanıyor, küresel projelerimi özgürce yönetiyorum. Ruhum huzurda, zihnim berrak ve bolluk akışında.',
      'Dingin Como sularında zihnim berraklaşıyor; yarattığım her eser dünyaya zarafet ve bolluk yayıyor.',
      'İtalyan dağlarının huzuruyla nefes alıyor, bağımsız stüdyomda dingin bir ilhamla üretiyorum. Zaman bana çalışıyor.',
    ];
    const next = polishedOptions[(polishedOptions.indexOf(affirmation) + 1) % polishedOptions.length];
    setAffirmation(next);
    if (onPlayChime) onPlayChime();
    onShowToast('Afirmasyon Veira AI tarafından berraklaştırıldı ✨', 'auto_fix_high');
  };

  const handleToggleAiBackground = () => {
    triggerHaptic();
    const nextState = !isAiBackgroundRemoved;
    setIsAiBackgroundRemoved(nextState);
    onShowToast(
      nextState
        ? 'Arka plan nöral odaklama algoritmasıyla izole edildi ✨'
        : 'Orijinal derin atmosferik katman geri yüklendi.',
      'auto_fix_high'
    );
  };

  const handleToggleAspectRatio = () => {
    triggerHaptic();
    const nextRatio = aspectRatio === '4:5' ? '1:1' : aspectRatio === '1:1' ? '16:9' : '4:5';
    setAspectRatio(nextRatio);
    onShowToast(`En boy oranı: ${nextRatio}`, 'grid_goldenratio');
  };

  const handleConfirmCreateGoal = () => {
    if (!newGoalTitle.trim()) {
      onShowToast('Lütfen hedefinize bir niyet başlığı verin.', 'edit');
      return;
    }
    triggerHaptic();

    const categoryIcons: Record<string, { icon: string; iconBg: string; iconColor: string; barColor: string }> = {
      'Kariyer & Bolluk': { icon: 'corporate_fare', iconBg: 'bg-[#e7c355]/20', iconColor: 'text-[#e7c355]', barColor: 'bg-[#e7c355]' },
      'Beden & Canlılık': { icon: 'spa', iconBg: 'bg-[#009bd1]/20', iconColor: 'text-[#7bd0ff]', barColor: 'bg-[#7bd0ff]' },
      'Ruhsal Denge': { icon: 'bedtime', iconBg: 'bg-[#8083ff]/20', iconColor: 'text-[#c0c1ff]', barColor: 'bg-[#c0c1ff]' },
      'Sevgi & İlişkiler': { icon: 'favorite', iconBg: 'bg-[#ff7597]/20', iconColor: 'text-[#ff7597]', barColor: 'bg-[#ff7597]' },
      'Yeni Ufuklar': { icon: 'flight_takeoff', iconBg: 'bg-[#00d2b4]/20', iconColor: 'text-[#00d2b4]', barColor: 'bg-[#00d2b4]' },
      'Yaratıcılık & Sanat': { icon: 'palette', iconBg: 'bg-[#e7c355]/20', iconColor: 'text-[#e7c355]', barColor: 'bg-[#e7c355]' },
    };

    const styling = categoryIcons[newGoalCategory] || categoryIcons['Kariyer & Bolluk'];
    const newId = `goal_${Date.now()}`;

    const newGoal: ConnectedGoalItem = {
      id: newId,
      categoryLabel: newGoalCategory,
      title: newGoalTitle.trim(),
      progressPercent: 10,
      progressText: '%10 Başlangıç',
      durationText: newGoalHorizon,
      icon: styling.icon,
      iconBg: styling.iconBg,
      iconColor: styling.iconColor,
      barColor: styling.barColor,
    };

    setConnectedGoals((prev) => [newGoal, ...prev]);
    setSelectedGoal(newId);
    setIsCreateGoalModalOpen(false);
    setNewGoalTitle('');
    if (onPlayChime) onPlayChime();
    onShowToast(`"${newGoal.title}" yaşam hedefi oluşturuldu ve vizyona bağlandı! ✨`, 'stars');
  };

  const handleSubmit = () => {
    triggerHaptic();
    if (!title.trim()) {
      onShowToast('Lütfen vizyonunuza ilham verici bir başlık verin.', 'edit');
      return;
    }

    if (onPlayChime) onPlayChime();

    const selectedGoalObj = connectedGoals.find((g) => g.id === selectedGoal);
    const categoryName = selectedGoalObj ? selectedGoalObj.categoryLabel : 'Kariyer & Bolluk';

    onAddVision({
      title: title.trim(),
      category: categoryName,
      desc: affirmation.trim(),
      imageUrl,
      action: isMicroActionChecked
        ? 'İtalyanca çalışma portföyünden 1 vize yazısını incele ve 3 somut not al.'
        : undefined,
    });

    onShowToast(`"${title}" vizyon panonuza başarıyla mühürlendi ✨`, 'auto_awesome');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0e1228] text-[#dee0ff] font-body-md antialiased selection:bg-[#8083ff] selection:text-[#0d0096]">
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0e1228]/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-white/5">
        <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              aria-label="Kapat"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#1a1e35]/60 hover:bg-[#1a1e35] text-[#c7c4d7] hover:text-[#dee0ff] transition-colors active:scale-95"
              onClick={() => {
                triggerHaptic();
                onClose();
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#e7c355]/15 flex items-center justify-center border border-[#e7c355]/40 shadow-sm">
                <span
                  className="material-symbols-outlined text-[#e7c355] text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
              </div>
              <h1 className="font-serif text-lg text-[#dee0ff] font-medium tracking-tight truncate max-w-[200px]">
                Vizyon Tohumu Ekle
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="min-h-[40px] px-4 flex items-center justify-center rounded-full bg-[#e7c355] text-[#3d2f00] text-xs font-semibold tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-[0_0_16px_rgba(231,195,85,0.3)]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] mr-1">auto_awesome</span>
              <span>Panoya Ekle</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#c0c1ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#1000a9] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-safe">
        <div className="flex flex-col w-full max-w-lg mx-auto px-4 pb-16 gap-6 text-[#dee0ff]">
          {/* 1. ÜST BİLGİ & 12 GÖRSEL KURALI SAYACI */}
          <section className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8083ff]/20 text-[#e1e0ff] border border-[#8083ff]/30">
                <span className="material-symbols-outlined text-[16px] text-[#e7c355]">
                  psychiatry
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  Vizyon Tohumu Ekle
                </span>
              </div>

              {/* Nöro-odak Sayaç Hapı */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252840] shadow-sm border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#e7c355] shadow-[0_0_8px_#e7c355] animate-pulse" />
                <span className="text-xs font-semibold text-[#ffe089]">8 / 12 Görsel Dolu</span>
              </div>
            </div>

            {/* Nöro-odak Açıklama & Tohum Yardımcı Metni */}
            <div className="flex flex-col gap-1.5 mt-1 rounded-xl bg-[#1a1e35]/60 p-3 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#e7c355] shrink-0">
                  psychiatry
                </span>
                <p className="text-xs font-semibold text-[#dee0ff] leading-relaxed">
                  Her eklenen vizyon, zihninde yeni bir sinaptik bağın tohumunu atar.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pl-6">
                <span className="material-symbols-outlined text-[14px] text-[#7bd0ff] shrink-0">
                  flare
                </span>
                <p className="text-[11px] text-[#c7c4d7] italic leading-relaxed">
                  Nöro-odak kuralı: Zihniniz en berrak ve kalıcı sinaptik bağı en fazla 12 ana vizyonla kurar.
                </p>
              </div>
            </div>

            {/* İlerleme Çubuğu */}
            <div className="w-full h-1.5 rounded-full bg-[#080c22] overflow-hidden flex border border-white/5 mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#c0c1ff] to-[#e7c355] rounded-full shadow-[0_0_12px_rgba(231,195,85,0.45)] transition-all duration-500"
                style={{ width: '66.6%' }}
              />
            </div>
          </section>

          {/* 2. GÖRSEL ÖNİZLEME & ÇERÇEVELEME ALANI (INTERACTIVE CROP & CANVAS) */}
          <section className="flex flex-col gap-3">
            <div
              className={`relative w-full rounded-2xl overflow-hidden bg-[#080c22] shadow-[0_12px_40px_rgba(8,12,34,0.7)] group border border-white/10 transition-all ${
                aspectRatio === '4:5'
                  ? 'aspect-[4/5]'
                  : aspectRatio === '1:1'
                  ? 'aspect-square'
                  : 'aspect-video'
              }`}
            >
              {/* Vizyon Görseli */}
              <img
                className={`w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isAiBackgroundRemoved ? 'contrast-125 saturate-110 brightness-105' : ''
                }`}
                alt={title}
                src={imageUrl}
              />

              {/* Altın/Mistik Gölgeleme Katmanı */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1228]/90 via-transparent to-[#0e1228]/30 pointer-events-none" />

              {/* Kırpma / Kompozisyon Kılavuz Izgarası (Rule of Thirds) */}
              {isGridVisible && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div />
                </div>
              )}

              {/* Odak Köşe İşaretleyicileri */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#e7c355]/80 pointer-events-none" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#e7c355]/80 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#e7c355]/80 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#e7c355]/80 pointer-events-none" />

              {/* Üst Araçlar: Oran & Cihaz İçi AI Temizle Rozeti */}
              <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-1.5 flex-wrap pointer-events-auto">
                <button
                  onClick={handleToggleAspectRatio}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full bg-[#252840]/90 backdrop-blur-md text-[#dee0ff] shadow-md active:scale-95 transition-transform border border-white/10 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#7bd0ff]">
                    grid_goldenratio
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium">{aspectRatio}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setIsGridVisible(!isGridVisible);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors ${
                      isGridVisible ? 'bg-[#e7c355]/20 text-[#e7c355]' : 'bg-[#252840]/90 text-[#c7c4d7]'
                    }`}
                    title="Kılavuz Izgarası Aç/Kapat"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px]">grid_on</span>
                  </button>

                  <button
                    onClick={handleToggleAiBackground}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_16px_rgba(231,195,85,0.2)] active:scale-95 transition-all border border-white/10 ${
                      isAiBackgroundRemoved
                        ? 'bg-[#e7c355] text-[#3d2f00] font-bold'
                        : 'bg-[#2f334b]/90 text-[#ffe089] hover:bg-[#343850]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#e7c355]">
                      auto_fix_high
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold">
                      {isAiBackgroundRemoved ? 'Odaklandı' : 'AI Temizle'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Alt Durum Etiketi */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none gap-1.5 flex-wrap">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0e1228]/85 backdrop-blur-md border border-white/10 shrink-0">
                  <span className="material-symbols-outlined text-[13px] text-[#e7c355]">
                    location_on
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#c7c4d7] truncate max-w-[120px] sm:max-w-none">
                    Lago di Como
                  </span>
                </div>

                <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setIsAiGeneratorOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] text-[11px] sm:text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[13px] sm:text-[14px]">auto_awesome</span>
                    <span>AI ile Üret</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-[#0e1228]/85 backdrop-blur-md text-[#7bd0ff] hover:text-white border border-[#7bd0ff]/30 text-[11px] sm:text-xs font-semibold active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[13px] sm:text-[14px]">upload</span>
                    <span>Dosya</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Format Seçici Sekmeleri */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[11px] font-semibold text-[#908fa0] uppercase tracking-wider">
                Çerçeve &amp; Estetik Dokusu
              </span>
              <div className="grid grid-cols-4 gap-2">
                {/* 1. Polaroid */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setSelectedFormat('polaroid');
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${
                    selectedFormat === 'polaroid'
                      ? 'bg-[#2f334b] text-[#e7c355] border-[#e7c355]/40 shadow-[0_0_14px_rgba(231,195,85,0.25)]'
                      : 'bg-[#161a30] text-[#c7c4d7] border-white/5 hover:bg-[#1a1e35]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">filter_frames</span>
                  <span className="text-[11px] font-semibold text-center leading-tight">Polaroid</span>
                </button>

                {/* 2. Dergi Kupürü */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setSelectedFormat('kelle');
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${
                    selectedFormat === 'kelle'
                      ? 'bg-[#2f334b] text-[#e7c355] border-[#e7c355]/40 shadow-[0_0_14px_rgba(231,195,85,0.25)]'
                      : 'bg-[#161a30] text-[#c7c4d7] border-white/5 hover:bg-[#1a1e35]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">auto_stories</span>
                  <span className="text-[11px] font-semibold text-center leading-tight">Kupür</span>
                </button>

                {/* 3. Minimalist Cam */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setSelectedFormat('cam');
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${
                    selectedFormat === 'cam'
                      ? 'bg-[#2f334b] text-[#e7c355] border-[#e7c355]/40 shadow-[0_0_14px_rgba(231,195,85,0.25)]'
                      : 'bg-[#161a30] text-[#c7c4d7] border-white/5 hover:bg-[#1a1e35]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">blur_on</span>
                  <span className="text-[11px] font-semibold text-center leading-tight">Mistik Cam</span>
                </button>

                {/* 4. Serbest Kesim */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setSelectedFormat('serbest');
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${
                    selectedFormat === 'serbest'
                      ? 'bg-[#2f334b] text-[#e7c355] border-[#e7c355]/40 shadow-[0_0_14px_rgba(231,195,85,0.25)]'
                      : 'bg-[#161a30] text-[#c7c4d7] border-white/5 hover:bg-[#1a1e35]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">crop_free</span>
                  <span className="text-[11px] font-semibold text-center leading-tight">Serbest</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. İLHAM VERİCİ VİZYON BAŞLIĞI & AFİRMASYON METNİ */}
          <section className="flex flex-col gap-4 p-5 rounded-2xl bg-[#1a1e35] shadow-md border border-white/5">
            {/* Başlık Giriş Alanı */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#908fa0] uppercase tracking-wider" htmlFor="vision-title">
                  Vizyon Başlığı
                </label>
                <span className="text-[11px] text-[#c7c4d7]">{title.length}/60</span>
              </div>
              <div className="relative flex items-center">
                <input
                  className="w-full py-3 px-4 rounded-xl bg-[#2f334b]/70 text-[#dee0ff] font-semibold text-sm focus:outline-none focus:bg-[#343850] border border-white/5 focus:border-[#e7c355]/40 transition-all shadow-inner"
                  id="vision-title"
                  maxLength={60}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="absolute right-3 material-symbols-outlined text-[20px] text-[#e7c355]">
                  verified
                </span>
              </div>
            </div>

            {/* Niyet / Afirmasyon Girişi */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#908fa0] uppercase tracking-wider" htmlFor="vision-affirmation">
                  Şimdiki Zaman Niyeti &amp; Afirmasyon
                </label>
                {/* Veira AI Butonu */}
                <button
                  onClick={handleAiPolishAffirmation}
                  className="flex items-center gap-1 text-[#e7c355] text-xs font-medium hover:brightness-120 transition-all active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>Veira AI ile Güçlendir</span>
                </button>
              </div>
              <div className="relative">
                <textarea
                  className="w-full p-4 rounded-xl bg-[#2f334b]/70 text-[#dee0ff] text-sm focus:outline-none focus:bg-[#343850] resize-none leading-relaxed border border-white/5 focus:border-[#e7c355]/40 transition-all shadow-inner"
                  id="vision-affirmation"
                  rows={3}
                  value={affirmation}
                  onChange={(e) => setAffirmation(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 4. HEDEFE BAĞLAMA (VISION-TO-ACTION BRIDGE) */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#e7c355]">explore</span>
                <h2 className="font-serif text-base font-semibold text-[#dee0ff]">
                  Hangi Yaşam Hedefine Bağlansın?
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#c0c1ff] bg-[#c0c1ff]/10 px-2 py-0.5 rounded-full border border-[#c0c1ff]/20">
                Köprüleme Zorunlu
              </span>
            </div>
            <p className="text-xs text-[#c7c4d7] -mt-1 leading-relaxed">
              Görseller sadece hayal değil, nörolojik olarak ölçülebilir bir eylem sütununa kilitlenmelidir.
            </p>

            {/* Bağlı Hedef Seçim Kartları Listesi (Dinamik) */}
            <div className="flex flex-col gap-2.5">
              {connectedGoals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      triggerHaptic();
                      setSelectedGoal(g.id);
                    }}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#2f334b] border-[#e7c355]/40 shadow-[0_0_20px_rgba(231,195,85,0.18)]'
                        : 'bg-[#1a1e35] hover:bg-[#252840] border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center justify-center w-7 h-7 rounded-full ${g.iconBg} ${g.iconColor}`}>
                          <span className="material-symbols-outlined text-[16px]">{g.icon}</span>
                        </span>
                        <span className={`text-xs uppercase tracking-wide font-semibold ${g.iconColor}`}>
                          {g.categoryLabel}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#e7c355] text-[#3d2f00] flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#252840] border border-white/10" />
                      )}
                    </div>

                    <h3 className="font-semibold text-sm text-[#dee0ff] mb-2 leading-snug">
                      {g.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-[#c7c4d7] mb-1.5">
                      <span className={`font-semibold ${g.iconColor}`}>{g.progressText}</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timelapse</span>
                        {g.durationText}
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#1a1e35] overflow-hidden">
                      <div
                        className={`h-full ${g.barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${g.progressPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Buton: Yeni Yaşam Hedefi Oluştur (Aktif Modal Açar) */}
              <button
                onClick={() => {
                  triggerHaptic();
                  setIsCreateGoalModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#161a30] hover:bg-[#252840] text-[#e7c355] hover:text-[#ffe089] transition-all border border-dashed border-[#e7c355]/30 active:scale-[0.99] group shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] text-[#e7c355] group-hover:rotate-90 transition-transform">
                  add_circle
                </span>
                <span className="text-xs font-bold">+ Yeni Yaşam Hedefi Oluştur</span>
              </button>
            </div>
          </section>

          {/* 5. BAĞLI GÜNLÜK 15 DAKİKALIK MİKRO-ADIM ÖNERİSİ */}
          <section className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#252840] via-[#1a1e35] to-[#161a30] shadow-lg border border-white/5">
            {/* Arka plan kozmik ışık efekti */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#e7c355]/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col gap-2.5 relative z-10">
              <div className="flex items-center gap-1.5 text-[#e7c355]">
                <span className="material-symbols-outlined text-[20px] animate-pulse">bolt</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Bu Görselin Günlük 15 Dakikalık Tohumu
                </span>
              </div>

              {/* Mikro-Eylem Kutusu */}
              <div
                onClick={() => {
                  triggerHaptic();
                  setIsMicroActionChecked(!isMicroActionChecked);
                }}
                className="p-3.5 rounded-xl bg-[#080c22]/80 backdrop-blur-md flex items-start gap-3 cursor-pointer border border-white/5 hover:border-[#e7c355]/30 transition-all"
              >
                <span
                  className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 transition-colors ${
                    isMicroActionChecked ? 'text-[#e7c355]' : 'text-[#7bd0ff]'
                  }`}
                >
                  {isMicroActionChecked ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <div className="flex flex-col">
                  <p className="text-sm text-[#dee0ff] font-medium leading-snug">
                    İtalyanca çalışma portföyünden 1 vize yazısını incele ve 3 somut not al.
                  </p>
                  <span className="text-[11px] text-[#ffe089] mt-1 font-medium">
                    Önerilen Saat: 21:30 (Akşam Dinginliği)
                  </span>
                </div>
              </div>

              {/* Nöro Eşleşme Bilgisi */}
              <div className="flex items-center gap-2 text-[#c7c4d7] pt-1">
                <span className="material-symbols-outlined text-[16px] text-[#c0c1ff] shrink-0">
                  widgets
                </span>
                <p className="text-xs leading-relaxed">
                  Görsel panoya mühürlendiğinde Ana Sayfa ve Kilit Ekranı widget'ınızda bu tek eylemle senkronize olacaktır.
                </p>
              </div>
            </div>
          </section>

          {/* 6. ALT AKSİYON BUTONLARI */}
          <section className="flex flex-col gap-3 pt-1">
            {/* Altın Mühürleme Butonu */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#ffe089] via-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(231,195,85,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span>Vizyon Panoma Mühürle &amp; Ekle</span>
            </button>

            {/* AI ile Ücretsiz Görsel Üret Butonu */}
            <button
              onClick={() => {
                triggerHaptic();
                setIsAiGeneratorOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#2f334b] via-[#3d436a] to-[#2f334b] text-[#ffe089] hover:text-white font-bold text-xs hover:border-[#e7c355]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg border border-[#e7c355]/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#e7c355]">
                auto_awesome
              </span>
              <span>Yapay Zekayla Vizyonuna Özel Görsel Üret (%100 Ücretsiz)</span>
            </button>

            {/* Farklı Görsel Seçimi Butonu */}
            <button
              onClick={() => {
                triggerHaptic();
                fileInputRef.current?.click();
              }}
              className="w-full py-3 px-6 rounded-full bg-[#1a1e35] text-[#c7c4d7] hover:text-white font-medium text-xs hover:bg-[#252840] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm border border-white/5"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#7bd0ff]">
                add_photo_alternate
              </span>
              <span>Galeriden Kendi Fotoğrafını Yükle</span>
            </button>
          </section>
        </div>
      </main>

      {/* Interactive Modal: Yeni Yaşam Hedefi Oluştur */}
      {isCreateGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="w-full max-w-sm max-h-[96dvh] sm:max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#1a1e35] border border-white/10 shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 sm:gap-4 text-[#dee0ff] my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e7c355] text-[20px] sm:text-[22px]">flag</span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#dee0ff]">Yeni Yaşam Hedefi</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateGoalModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#252840] flex items-center justify-center text-[#c7c4d7] hover:text-white shrink-0"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#c7c4d7]">
              Bu vizyon tohumunu yönlendirecek ana niyet ve yaşam hedefini tanımla.
            </p>

            <div className="flex flex-col gap-3">
              {/* Category Picker */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Yaşam Alanı (Kategori)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Kariyer & Bolluk',
                    'Beden & Canlılık',
                    'Ruhsal Denge',
                    'Sevgi & İlişkiler',
                    'Yeni Ufuklar',
                    'Yaratıcılık & Sanat',
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewGoalCategory(cat)}
                      className={`p-2 rounded-xl text-xs font-semibold text-left transition-all ${
                        newGoalCategory === cat
                          ? 'bg-[#e7c355] text-[#3d2f00] shadow-sm'
                          : 'bg-[#252840] text-[#c7c4d7] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Hedefin Adı (Büyük Niyet)
                </label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Örn: Como Gölü Stüdyo & Bağımsız Çalışma"
                  className="w-full bg-[#080c22] text-[#dee0ff] text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#e7c355] border border-white/10"
                />
              </div>

              {/* Horizon */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Zaman Ufku
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {['30 Gün (1 Ay)', '90 Gün (1 Çeyrek)', '180 Gün (6 Ay)', '1 Yıl', '3 Yıl', 'Sürekli Yaşam Rutini'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setNewGoalHorizon(h)}
                      className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                        newGoalHorizon === h
                          ? 'bg-[#8083ff] text-white font-semibold'
                          : 'bg-[#252840] text-[#c7c4d7] hover:text-white'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateGoalModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#252840] text-[#c7c4d7] hover:text-white text-xs font-semibold transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmCreateGoal}
                className="flex-1 py-2.5 rounded-xl bg-[#e7c355] text-[#3d2f00] text-xs font-bold shadow-md hover:bg-[#ffe089] transition-all"
              >
                Hedefi Oluştur &amp; Bağla ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free AI Vision Image Generator & Curated Studio Modal */}
      <VisionAiImageGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        initialTitle={title}
        initialCategory={connectedGoals.find((g) => g.id === selectedGoal)?.categoryLabel || 'Kariyer & Bolluk'}
        onPlayChime={onPlayChime}
        onShowToast={onShowToast}
        onSelectImage={(newImgUrl) => {
          setImageUrl(newImgUrl);
        }}
      />
    </div>
  );
};
