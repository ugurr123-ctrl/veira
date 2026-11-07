import React, { useState, useRef } from 'react';
import { VisionAiImageGeneratorModal } from './VisionAiImageGeneratorModal';

export interface NewGoalData {
  title: string;
  category: 'career' | 'wellness' | 'spirit' | 'relationships' | 'travel' | 'art';
  categoryLabel: string;
  emotionalWhy: string;
  targetDate: string;
  daysLeft: number;
  priority: 'high' | 'balanced' | 'longterm';
  microAction: string;
  imageUrl: string;
  milestones: Array<{
    quarter: string;
    title: string;
    duration: string;
    tasksCount: number;
  }>;
}

interface AddGoalScreenProps {
  onClose: () => void;
  onAddGoal: (goal: NewGoalData) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime?: () => void;
}

export const CATEGORY_LABELS: Record<string, string> = {
  career: 'Kariyer & Bolluk',
  wellness: 'Beden & Canlılık',
  spirit: 'Ruhsal Denge',
  relationships: 'Sevgi & İlişkiler',
  travel: 'Yeni Ufuklar',
  art: 'Yaratıcılık & Sanat',
};

export const AddGoalScreen: React.FC<AddGoalScreenProps> = ({
  onClose,
  onAddGoal,
  onShowToast,
  onPlayChime,
}) => {
  // Form states
  const [selectedCategory, setSelectedCategory] = useState<
    'career' | 'wellness' | 'spirit' | 'relationships' | 'travel' | 'art'
  >('career');

  const [title, setTitle] = useState('Como Gölü Kıyısında Yaşam & Bağımsız Çalışma');
  const [emotionalWhy, setEmotionalWhy] = useState(
    'Aileme huzurlu, doğayla iç içe özgür bir yaşam sunmak ve yaratıcı potansiyelimi en berrak seviyede gerçekleştirmek. Sabahları Alp esintisiyle uyanıp üretmenin getirdiği sükûnet.'
  );

  // Target Date calculations & interactive states
  const [targetDateISO, setTargetDateISO] = useState<string>(() => {
    // Default to Oct 15, 2026 or ~142 days ahead
    return '2026-10-15';
  });
  const [targetDate, setTargetDate] = useState('15 Ekim 2026');
  const [daysLeft, setDaysLeft] = useState(142);
  const [weeksCycle, setWeeksCycle] = useState(20);
  const [priority, setPriority] = useState<'high' | 'balanced' | 'longterm'>('high');
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // Date calculation function
  const handleDateChange = (isoDate: string) => {
    if (!isoDate) return;
    setTargetDateISO(isoDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = isoDate.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const calculatedDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const calculatedWeeks = Math.max(1, Math.round(calculatedDays / 7));

    const formatted = target.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    setDaysLeft(calculatedDays);
    setWeeksCycle(calculatedWeeks);
    setTargetDate(formatted);
    triggerHaptic();
    onShowToast(`Hedef tarihi: ${formatted} (${calculatedDays} gün kaldı)`, 'event_available');
  };

  const handleApplyPresetDays = (additionalDays: number, label: string) => {
    const today = new Date();
    today.setDate(today.getDate() + additionalDays);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    handleDateChange(iso);
    onShowToast(`${label} eklendi: ${additionalDays} gün sonrasına kuruldu.`, 'date_range');
  };

  // Milestones with edit and deletion
  const [milestones, setMilestones] = useState([
    {
      id: 'm1',
      quarter: 'Q1',
      title: 'İtalyanca B1 Sertifikası & Vize Portföyü Hazırlığı',
      duration: 'Bitiş: 30 Gün',
      tasksCount: 4,
    },
    {
      id: 'm2',
      quarter: 'Q2',
      title: 'Milano & Como İş Görüşmeleri & Şirket Evrak Kaydı',
      duration: 'Bitiş: 90 Gün',
      tasksCount: 6,
    },
    {
      id: 'm3',
      quarter: 'Q3',
      title: 'Fiziksel Yerleşim & Como Kıyısında Ev Kiralama Süreci',
      duration: 'Bitiş: 180 Gün',
      tasksCount: 3,
    },
  ]);

  // Quarter creation modal state
  const [isAddQuarterModalOpen, setIsAddQuarterModalOpen] = useState(false);
  const [newQuarterCode, setNewQuarterCode] = useState('Q4');
  const [newQuarterTitle, setNewQuarterTitle] = useState('');
  const [newQuarterDuration, setNewQuarterDuration] = useState('Bitiş: 90 Gün');
  const [newQuarterTasks, setNewQuarterTasks] = useState(3);

  // Micro-action
  const [microAction, setMicroAction] = useState(
    'Vize portföyünden 1 ilham yazısı oku ve 3 anahtar kelime not al.'
  );
  const [isShrunk, setIsShrunk] = useState(false);

  // AI Visual Generator state
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // Vision Visual Anchor
  const [imageUrl, setImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuATGmrWgPTCBWy-J56KRQPpxnFhLLoUxXXkltzZZr1JBMlVpTfIAlUi6CfaAs21V4Qqk6sbaKHhPvc3VrskzNWJbLpAe1IUiXRaJqHMtzPD3Q1Cv7wIo5f1wwuJ220kQbps3NHQtm-GP2WGufdt-a77hoDMCNMSt0P_l8BDNlUiRnbVmMJQQBwogb0BxZ4NwAZYheyHnmAJlFboq_7eA9VTSHjKbauUG5mG6GK5YW0'
  );
  const [imageLocation, setImageLocation] = useState('Lago di Como, İtalya');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Haptic Feedback
  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(25);
      }
    } catch {
      // fallback
    }
  };

  // Shrink Action (AI relief)
  const handleToggleShrink = () => {
    triggerHaptic();
    const nextState = !isShrunk;
    setIsShrunk(nextState);
    if (nextState) {
      setMicroAction(
        'Sadece İtalyanca vize başvuru sitesini tarayıcında sekme olarak aç ve kapat (1-2 dakika).'
      );
      onShowToast('Prefrontal korteks rahatlatıldı: 5 dakikalık mikro-adıma küçültüldü ✨', 'compress');
    } else {
      setMicroAction(
        'Vize portföyünden 1 ilham yazısı oku ve 3 anahtar kelime not al.'
      );
      onShowToast('Orijinal 15 dakikalık eyleme dönüldü.', 'schedule');
    }
  };

  // AI Deepen Why
  const handleDeepenWhy = () => {
    triggerHaptic();
    const polishedOptions = [
      'Aileme huzurlu, doğayla iç içe özgür bir yaşam sunmak ve yaratıcı potansiyelimi en berrak seviyede gerçekleştirmek. Sabahları Alp esintisiyle uyanıp üretmenin getirdiği sükûnet.',
      'Kendi ritmimde yaşamak, çocuklarıma doğanın dinginliğini miras bırakmak. Yaratıcılığımı sınırların ötesine taşırken iç huzurumu korumak.',
      'Zamanın ve coğrafyanın kölesi değil, kendi varoluşumun mimarı olmak. Como’nun dingin sularında zihnimi berraklaştırıp dünyaya değer sunmak.',
    ];
    const currentIndex = polishedOptions.indexOf(emotionalWhy);
    const nextWhy = polishedOptions[(currentIndex + 1) % polishedOptions.length];
    setEmotionalWhy(nextWhy);
    if (onPlayChime) onPlayChime();
    onShowToast('Duygusal çapa Veira Nöro-AI tarafından derinleştirildi ✨', 'auto_fix_high');
  };

  // Open modal to add new quarter
  const handleOpenAddQuarter = () => {
    triggerHaptic();
    const nextQNum = milestones.length + 1;
    setNewQuarterCode(`Q${nextQNum}`);
    setNewQuarterTitle(`Q${nextQNum}: Yaşam Entegrasyonu & Büyüme`);
    setNewQuarterDuration(`Bitiş: ${nextQNum * 90} Gün`);
    setNewQuarterTasks(3);
    setIsAddQuarterModalOpen(true);
  };

  // Save new quarter from modal
  const handleConfirmAddQuarter = () => {
    if (!newQuarterTitle.trim()) {
      onShowToast('Lütfen çeyrek hedefine bir başlık verin.', 'edit');
      return;
    }
    triggerHaptic();
    const newQuarter = {
      id: String(Date.now()),
      quarter: newQuarterCode.trim() || `Q${milestones.length + 1}`,
      title: newQuarterTitle.trim(),
      duration: newQuarterDuration.trim() || 'Bitiş: 90 Gün',
      tasksCount: newQuarterTasks,
    };
    setMilestones((prev) => [...prev, newQuarter]);
    setIsAddQuarterModalOpen(false);
    if (onPlayChime) onPlayChime();
    onShowToast(`${newQuarter.quarter} kilometre taşı başarıyla eklendi ✨`, 'add_circle');
  };

  // Update existing milestone title
  const handleUpdateMilestoneTitle = (id: string, newTitle: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, title: newTitle } : m))
    );
  };

  // Delete milestone
  const handleDeleteMilestone = (id: string, quarterName: string) => {
    triggerHaptic();
    if (milestones.length <= 1) {
      onShowToast('En az bir kilometre taşı bulunmalıdır.', 'warning');
      return;
    }
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    onShowToast(`${quarterName} kilometre taşı kaldırıldı.`, 'delete');
  };

  // Image Upload Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
          setImageLocation('Özel İlham Görseli');
          triggerHaptic();
          onShowToast('Görsel duyusal vizyon alanına bağlandı ✨', 'photo_library');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Goal
  const handleSubmit = () => {
    triggerHaptic();
    if (!title.trim()) {
      onShowToast('Lütfen hedefinize bir büyük niyet başlığı verin.', 'edit');
      return;
    }

    const categoryLabels = {
      career: 'Kariyer & Bolluk',
      wellness: 'Beden & Canlılık',
      spirit: 'Ruhsal Denge',
      relationships: 'Sevgi & İlişkiler',
      travel: 'Yeni Ufuklar',
      art: 'Yaratıcılık & Sanat',
    };

    const newGoal: NewGoalData = {
      title: title.trim(),
      category: selectedCategory,
      categoryLabel: categoryLabels[selectedCategory],
      emotionalWhy: emotionalWhy.trim(),
      targetDate,
      daysLeft,
      priority,
      microAction: microAction.trim(),
      imageUrl,
      milestones,
    };

    if (onPlayChime) onPlayChime();
    onAddGoal(newGoal);
    onShowToast(`"${title}" vizyon panonuza ve planınıza başarıyla mühürlendi! ✨`, 'stars');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080c22] text-[#dee0ff] font-sans antialiased selection:bg-[#e7c355]/30 selection:text-[#fdf4dc]">
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0e1228]/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(8,12,34,0.4)] pt-safe border-b border-white/5">
        <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
          <button
            aria-label="Kapat"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#1a1e35]/60 hover:bg-[#252840] text-[#c7c4d7] hover:text-[#dee0ff] transition-colors active:scale-95"
            onClick={() => {
              triggerHaptic();
              onClose();
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-[#dee0ff] tracking-tight">
                Hedef Mimarisi
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#e7c355]/15 text-[#e7c355] text-[11px] font-semibold tracking-wide">
                SMART
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#c7c4d7]/80 tracking-wide uppercase">
              Vizyon &amp; Eylem Mimarlığı
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              aria-label="Kaydet"
              className="h-10 px-3.5 rounded-full bg-[#e7c355] text-[#3d2f00] flex items-center gap-1.5 text-xs font-bold shadow-[0_0_18px_rgba(231,195,85,0.35)] hover:shadow-[0_0_24px_rgba(231,195,85,0.5)] transition-all active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Kaydet</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#c0c1ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1000a9] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex flex-col relative w-full pt-20 pb-safe bg-[#080c22] min-h-[100vh] min-h-[100svh] min-h-[100dvh]">
        <div className="flex flex-col w-full max-w-lg mx-auto pb-12 space-y-6 px-4">
          {/* Ambient Ethereal Glow Elements */}
          <div className="relative w-full overflow-hidden pt-2">
            <div className="absolute -top-12 -left-10 w-44 h-44 bg-[#8083ff]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#e7c355]/10 rounded-full blur-3xl pointer-events-none" />

            {/* 1. Top Section - Motivating Subheader */}
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252840] text-[#e7c355] text-[11px] font-semibold tracking-wider uppercase shadow-sm border border-white/5">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    psychology
                  </span>
                  Nöro-Mimari Formu
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] text-[11px] font-semibold border border-[#c0c1ff]/20">
                  <span className="material-symbols-outlined text-[12px]">balance</span>
                  WOOP Tabanlı
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif text-[#dee0ff] tracking-tight leading-snug">
                Zihnindeki Soyut Niyeti <br />
                <span className="italic text-[#e7c355]">Somut Eyleme Dönüştür</span> ✨
              </h1>

              <p className="text-xs text-[#c7c4d7] leading-relaxed">
                Zihinsel tezatlama ve mikro-eylem basamaklarıyla zihnindeki vizyonu nörolojik olarak eyleme bağla.
              </p>
            </div>
          </div>

          {/* 2. Yaşam Çarkı Kategori Seçimi */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e7c355] text-[18px]">
                  radio_button_checked
                </span>
                <span className="text-sm font-semibold text-[#dee0ff] tracking-wide">
                  Yaşam Çarkı Boyutu
                </span>
              </div>
              <span className="text-xs font-semibold text-[#e7c355] tracking-tight bg-[#e7c355]/10 px-2 py-0.5 rounded-full border border-[#e7c355]/20">
                1 / 12 Odak
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Category 1: Kariyer & Bolluk */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory('career');
                }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] border ${
                  selectedCategory === 'career'
                    ? 'bg-[#252840] border-[#e7c355]/40 shadow-md'
                    : 'bg-[#161a30] hover:bg-[#1a1e35] border-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedCategory === 'career'
                      ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#dee0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedCategory === 'career' ? 'text-[#e7c355]' : 'text-[#dee0ff]'
                    }`}
                  >
                    Kariyer &amp; Bolluk
                  </span>
                  <span className="text-[11px] text-[#c7c4d7]">Finansal güç &amp; büyüme</span>
                </div>
                {selectedCategory === 'career' && (
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[18px] absolute right-3"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>

              {/* Category 2: Beden & Canlılık */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory('wellness');
                }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] border ${
                  selectedCategory === 'wellness'
                    ? 'bg-[#252840] border-[#e7c355]/40 shadow-md'
                    : 'bg-[#161a30] hover:bg-[#1a1e35] border-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedCategory === 'wellness'
                      ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#7bd0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">vital_signs</span>
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedCategory === 'wellness' ? 'text-[#e7c355]' : 'text-[#dee0ff]'
                    }`}
                  >
                    Beden &amp; Canlılık
                  </span>
                  <span className="text-[11px] text-[#c7c4d7]">Biyoloji, uyku, enerji</span>
                </div>
                {selectedCategory === 'wellness' && (
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[18px] absolute right-3"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>

              {/* Category 3: Ruhsal Denge */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory('spirit');
                }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] border ${
                  selectedCategory === 'spirit'
                    ? 'bg-[#252840] border-[#e7c355]/40 shadow-md'
                    : 'bg-[#161a30] hover:bg-[#1a1e35] border-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedCategory === 'spirit'
                      ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#c0c1ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">self_improvement</span>
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedCategory === 'spirit' ? 'text-[#e7c355]' : 'text-[#dee0ff]'
                    }`}
                  >
                    Ruhsal Denge
                  </span>
                  <span className="text-[11px] text-[#c7c4d7]">Farkındalık &amp; dinginlik</span>
                </div>
                {selectedCategory === 'spirit' && (
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[18px] absolute right-3"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>

              {/* Category 4: Sevgi & İlişkiler */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory('relationships');
                }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] border ${
                  selectedCategory === 'relationships'
                    ? 'bg-[#252840] border-[#e7c355]/40 shadow-md'
                    : 'bg-[#161a30] hover:bg-[#1a1e35] border-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedCategory === 'relationships'
                      ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#ffe089]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedCategory === 'relationships' ? 'text-[#e7c355]' : 'text-[#dee0ff]'
                    }`}
                  >
                    Sevgi &amp; İlişkiler
                  </span>
                  <span className="text-[11px] text-[#c7c4d7]">Bağlanma &amp; şefkat</span>
                </div>
                {selectedCategory === 'relationships' && (
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[18px] absolute right-3"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>

              {/* Category 5: Yeni Ufuklar */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory('travel');
                }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] border ${
                  selectedCategory === 'travel'
                    ? 'bg-[#252840] border-[#e7c355]/40 shadow-md'
                    : 'bg-[#161a30] hover:bg-[#1a1e35] border-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedCategory === 'travel'
                      ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#c4e7ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedCategory === 'travel' ? 'text-[#e7c355]' : 'text-[#dee0ff]'
                    }`}
                  >
                    Yeni Ufuklar
                  </span>
                  <span className="text-[11px] text-[#c7c4d7]">Seyahat &amp; keşif</span>
                </div>
                {selectedCategory === 'travel' && (
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[18px] absolute right-3"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>

              {/* Category 6: Yaratıcılık & Sanat */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedCategory('art');
                }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] border ${
                  selectedCategory === 'art'
                    ? 'bg-[#252840] border-[#e7c355]/40 shadow-md'
                    : 'bg-[#161a30] hover:bg-[#1a1e35] border-white/5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedCategory === 'art'
                      ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#c0c1ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">palette</span>
                </div>
                <div className="flex flex-col min-w-0 pr-4">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedCategory === 'art' ? 'text-[#e7c355]' : 'text-[#dee0ff]'
                    }`}
                  >
                    Yaratıcılık &amp; Sanat
                  </span>
                  <span className="text-[11px] text-[#c7c4d7]">İfade &amp; üretim</span>
                </div>
                {selectedCategory === 'art' && (
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[18px] absolute right-3"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 3. Hedef Başlığı & Niyet Alanı (Intention Input) */}
          <div className="flex flex-col space-y-2">
            <div className="p-5 rounded-2xl bg-[#1a1e35] shadow-lg flex flex-col space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-semibold tracking-wider uppercase text-[#e7c355] flex items-center gap-1.5"
                  htmlFor="goal-title-input"
                >
                  <span className="material-symbols-outlined text-[15px]">flag</span>
                  Hedefin Adı (Büyük Niyet)
                </label>
                <span className="text-xs text-[#c7c4d7]">
                  {title.length}/80
                </span>
              </div>

              <div className="relative">
                <input
                  id="goal-title-input"
                  type="text"
                  value={title}
                  maxLength={80}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: 10K Maratonunu Tamamlama ve Öz-Disiplin"
                  className="w-full bg-[#080c22] text-[#dee0ff] font-serif text-lg rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#e7c355] border border-white/10 shadow-inner placeholder:text-[#c7c4d7]/40 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="material-symbols-outlined text-[#7bd0ff] text-[16px] shrink-0">
                  verified
                </span>
                <p className="text-xs text-[#c7c4d7] leading-relaxed">
                  Zihinde canlandırılabilir ve duyusal ayrıntı barındıran niyet cümleleri dopamin ödül yolunu uyarır.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Duygusal Çapa / "Neden Önemli?" (The Emotional Why - WOOP Anchor) */}
          <div className="flex flex-col space-y-2">
            <div className="relative p-5 rounded-2xl bg-[#161a30] shadow-lg flex flex-col space-y-3 overflow-hidden border border-white/5">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#c0c1ff]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#c0c1ff]">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    format_quote
                  </span>
                  <span className="text-sm font-semibold tracking-wide text-[#dee0ff]">
                    Duygusal Çapa (Neden Önemli?)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#c0c1ff]/15 text-[#c0c1ff] text-[11px] font-semibold">
                  Direnç Kalkanı
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={emotionalWhy}
                  onChange={(e) => setEmotionalWhy(e.target.value)}
                  placeholder="Bu hedefe ulaşamadığında neyi kaybedeceksin? Gerçekleştiğinde nasıl hissedeceksin?"
                  className="w-full bg-[#1a1e35] text-[#dee0ff] text-xs leading-relaxed rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#c0c1ff] border border-white/5 transition-colors placeholder:text-[#c7c4d7]/40"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[#c7c4d7] text-xs">
                  <span className="material-symbols-outlined text-[15px] text-[#e7c355]">
                    flare
                  </span>
                  <span>Duygusal rezonans %94</span>
                </div>
                <button
                  type="button"
                  onClick={handleDeepenWhy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8083ff]/20 text-[#dee0ff] text-xs font-semibold shadow-md hover:bg-[#8083ff]/30 transition-all active:scale-[0.97] border border-[#8083ff]/40"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#e7c355]">
                    auto_awesome
                  </span>
                  <span>AI ile Nedenini Derinleştir</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. SMART Parametreleri (Tarih & Öncelik) */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e7c355] text-[18px]">tune</span>
              <span className="text-sm font-semibold text-[#dee0ff] tracking-wide">
                SMART Mimari Parametreleri
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Target Date Card with Interactive Native Picker & Live Math */}
              <div className="flex flex-col p-4 rounded-2xl bg-[#252840] shadow-md border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => {
                      if (dateInputRef.current) {
                        if (typeof dateInputRef.current.showPicker === 'function') {
                          dateInputRef.current.showPicker();
                        } else {
                          dateInputRef.current.focus();
                        }
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#2f334b] text-[#e7c355] flex items-center justify-center shrink-0 group-hover:bg-[#e7c355]/20 transition-colors">
                      <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c7c4d7] flex items-center gap-1">
                        Hedef Varış Tarihi
                        <span className="material-symbols-outlined text-[13px] text-[#e7c355]">edit_calendar</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#dee0ff] group-hover:text-[#e7c355] transition-colors">
                          {targetDate}
                        </span>
                        {/* Hidden Native Date Input triggering OS Date Wheel / Calendar */}
                        <input
                          ref={dateInputRef}
                          type="date"
                          value={targetDateISO}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="w-0 h-0 opacity-0 absolute pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="px-2.5 py-1 rounded-full bg-[#e7c355]/15 text-[#e7c355] text-xs font-semibold tracking-wide shadow-sm border border-[#e7c355]/20 animate-pulse">
                      {daysLeft} Gün Kaldı
                    </span>
                    <span className="text-[11px] text-[#c7c4d7] mt-1">
                      {weeksCycle} Hafta Döngüsü
                    </span>
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] text-[#c7c4d7] shrink-0 font-medium">Hızlı Kur:</span>
                  {[
                    { days: 30, label: '+30 Gün (1 Ay)' },
                    { days: 90, label: '+90 Gün (1 Çeyrek)' },
                    { days: 180, label: '+6 Ay' },
                    { days: 365, label: '+1 Yıl' },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => handleApplyPresetDays(preset.days, preset.label)}
                      className="px-2.5 py-1 rounded-lg bg-[#1a1e35] hover:bg-[#2f334b] text-[#dee0ff] hover:text-[#e7c355] text-[11px] font-medium transition-all whitespace-nowrap border border-white/5"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Segment Card */}
              <div className="p-4 rounded-2xl bg-[#1a1e35] shadow-md flex flex-col space-y-2.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c7c4d7]">
                    Öncelik Seviyesi &amp; Bilişsel Yük
                  </span>
                  <span className="text-[11px] font-semibold text-[#e7c355]">
                    {priority === 'high' ? 'Tier 1 Odak' : priority === 'balanced' ? 'Tier 2 Odak' : 'Tier 3 Odak'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#080c22] rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setPriority('high');
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold text-center shadow-sm flex items-center justify-center gap-1 transition-all ${
                      priority === 'high'
                        ? 'bg-[#e7c355] text-[#3d2f00]'
                        : 'text-[#c7c4d7] hover:text-[#dee0ff]'
                    }`}
                  >
                    <span>Yüksek</span>
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setPriority('balanced');
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                      priority === 'balanced'
                        ? 'bg-[#e7c355] text-[#3d2f00]'
                        : 'text-[#c7c4d7] hover:text-[#dee0ff]'
                    }`}
                  >
                    Dengeli
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setPriority('longterm');
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                      priority === 'longterm'
                        ? 'bg-[#e7c355] text-[#3d2f00]'
                        : 'text-[#c7c4d7] hover:text-[#dee0ff]'
                    }`}
                  >
                    Uzun Vadeli
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 6. 3 Aylık Kilometre Taşları (Q1, Q2, Q3...) - Dinamik Ekleme & Düzenleme */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e7c355] text-[18px]">
                  timeline
                </span>
                <span className="text-sm font-semibold text-[#dee0ff] tracking-wide">
                  Çeyreklik Kilometre Taşları ({milestones.length})
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenAddQuarter}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] hover:text-white hover:bg-[#8083ff]/30 text-xs font-semibold transition-all border border-[#8083ff]/30"
              >
                <span className="material-symbols-outlined text-[16px] text-[#e7c355]">add_circle</span>
                <span>+ Yeni Çeyrek Ekle</span>
              </button>
            </div>

            <div className="flex flex-col space-y-2.5">
              {milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="relative flex items-start gap-3 p-3.5 rounded-xl bg-[#252840] shadow-md border border-white/5 group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-mono ${
                      idx === 0
                        ? 'bg-[#e7c355]/20 text-[#e7c355]'
                        : idx === 1
                        ? 'bg-[#8083ff]/20 text-[#c0c1ff]'
                        : 'bg-[#2f334b] text-[#7bd0ff]'
                    }`}
                  >
                    <span className="text-xs font-bold">{m.quarter}</span>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 pr-1">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestoneTitle(m.id, e.target.value)}
                      placeholder="Çeyrek başlığı..."
                      className="bg-transparent text-xs font-medium text-[#dee0ff] leading-snug focus:outline-none focus:border-b focus:border-[#e7c355] transition-colors"
                    />
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#2f334b] text-[#e7c355] text-[10px] font-semibold">
                        {m.duration}
                      </span>
                      <span className="text-[#c7c4d7] text-[10px]">
                        • {m.tasksCount} Alt Görev
                      </span>
                    </div>
                  </div>

                  {/* Delete button (if more than 1 milestone) */}
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(m.id, m.quarter)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#c7c4d7]/60 hover:text-[#ff7171] hover:bg-[#ff7171]/10 transition-colors"
                      title="Bu çeyreği sil"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Vizyon-Eylem Köprüsü: Günlük 15 Dakikalık Tek Mikro-Eylem */}
          <div className="flex flex-col space-y-2">
            <div className="relative p-5 rounded-2xl bg-[#252840] shadow-xl flex flex-col space-y-3.5 overflow-hidden border border-white/5">
              <div className="absolute -top-12 -right-8 w-36 h-36 bg-[#e7c355]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#e7c355]/20 text-[#e7c355] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                  </div>
                  <span className="text-sm font-bold text-[#dee0ff]">Vizyon-Eylem Köprüsü</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#e7c355] text-[#3d2f00] text-[10px] font-bold tracking-wide">
                  Dirençsiz Başlangıç
                </span>
              </div>

              <div className="flex flex-col space-y-1.5">
                <span className="text-[11px] font-semibold text-[#e7c355] uppercase tracking-wider">
                  Bugünün Tekil 15 Dakikalık Mikro-Eylemi
                </span>
                <div className="p-3.5 rounded-xl bg-[#080c22] text-[#dee0ff] flex items-start gap-3 shadow-inner border border-white/5">
                  <span className="material-symbols-outlined text-[#e7c355] text-[20px] mt-0.5 shrink-0">
                    arrow_forward
                  </span>
                  <textarea
                    rows={2}
                    value={microAction}
                    onChange={(e) => setMicroAction(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#dee0ff] font-medium leading-relaxed focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#c7c4d7] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
                  Prefrontal korteks baskısını sıfırlar
                </span>
                <button
                  type="button"
                  onClick={handleToggleShrink}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-[0.96] ${
                    isShrunk
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#2f334b] text-[#e7c355] hover:bg-[#343850]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {isShrunk ? 'undo' : 'compress'}
                  </span>
                  <span>{isShrunk ? "15 Dk'ya Döndür" : "⚡ 5 Dk'ya Küçült"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 8. Vizyon Panosuna Görsel Bağlama (Connect Visual Anchor) */}
          <div className="flex flex-col space-y-2">
            <div className="p-5 rounded-2xl bg-[#1a1e35] shadow-md flex flex-col space-y-3.5 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#e7c355] text-[20px]">
                    photo_library
                  </span>
                  <span className="text-sm font-semibold text-[#dee0ff] tracking-wide">
                    Duyusal Vizyon Çapası
                  </span>
                </div>
                <span className="text-xs text-[#7bd0ff] font-semibold">Pano: 8 / 12 Görsel</span>
              </div>

              <p className="text-xs text-[#c7c4d7]">
                Hedefi her gün zihninde canlı tutacak yüksek çözünürlüklü duyusal görseli bağla.
              </p>

              {/* Visual Preview Card */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-lg group border border-white/10">
                <img
                  src={imageUrl}
                  alt="Lake Como"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080c22] via-[#080c22]/40 to-transparent" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080c22]/80 backdrop-blur-md text-[#dee0ff] text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
                  <span className="material-symbols-outlined text-[#e7c355] text-[14px]">
                    location_on
                  </span>
                  <span>{imageLocation}</span>
                </div>

                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white drop-shadow-md truncate max-w-[180px]">
                    {imageLocation}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setIsAiGeneratorOpen(true);
                      }}
                      className="h-8 px-3 rounded-full bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] text-xs font-bold flex items-center gap-1 shadow-md hover:brightness-110 transition-all active:scale-[0.95]"
                    >
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                      <span>AI ile Üret (Ücretsiz)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-2.5 rounded-full bg-[#252840]/90 hover:bg-[#2f334b] backdrop-blur-md text-[#dee0ff] text-xs font-semibold flex items-center gap-1 shadow-md transition-all active:scale-[0.95] border border-white/10"
                      title="Kendi fotoğrafını yükle"
                    >
                      <span className="material-symbols-outlined text-[15px]">upload</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 9. Alt Aksiyon / Gönderim Alanı */}
          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full h-14 rounded-full bg-[#e7c355] text-[#3d2f00] text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(231,195,85,0.45)] hover:shadow-[0_0_36px_rgba(231,195,85,0.6)] active:scale-[0.98] transition-all"
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span>Hedefi Vizyon Panoma ve Günlük Plana Kaydet</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-center px-4">
              <span className="material-symbols-outlined text-[#e7c355] text-[15px] shrink-0">
                info
              </span>
              <p className="text-[11px] text-[#c7c4d7]">
                Bu hedef otomatik olarak 12 Odak sınırına ve sabah mikro-eylem hatırlatıcılarına eklenecektir.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Modal: Yeni Çeyrek / Kilometre Taşı Ekle */}
      {isAddQuarterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="w-full max-w-sm max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1a1e35] border border-white/10 shadow-2xl p-5 flex flex-col gap-4 text-[#dee0ff] my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e7c355] text-[22px]">add_circle</span>
                <h3 className="font-serif text-lg font-bold text-[#dee0ff]">Yeni Çeyrek Ekle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddQuarterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#252840] flex items-center justify-center text-[#c7c4d7] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Quarter Code */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Dönem Kodu
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'M1', 'M2', 'M3'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setNewQuarterCode(code)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        newQuarterCode === code
                          ? 'bg-[#e7c355] text-[#3d2f00]'
                          : 'bg-[#252840] text-[#c7c4d7] hover:text-white'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Çeyrek Odak Başlığı
                </label>
                <input
                  type="text"
                  value={newQuarterTitle}
                  onChange={(e) => setNewQuarterTitle(e.target.value)}
                  placeholder="Örn: Portföy Tamamlama ve İlk Başvuru"
                  className="w-full bg-[#080c22] text-[#dee0ff] text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#e7c355] border border-white/10"
                />
              </div>

              {/* Duration / Horizon */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Zaman Ufku
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Bitiş: 30 Gün', 'Bitiş: 60 Gün', 'Bitiş: 90 Gün', 'Bitiş: 120 Gün', 'Bitiş: 180 Gün', 'Bitiş: 1 Yıl'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setNewQuarterDuration(dur)}
                      className={`py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                        newQuarterDuration === dur
                          ? 'bg-[#8083ff] text-white font-semibold'
                          : 'bg-[#252840] text-[#c7c4d7] hover:text-white'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtasks Count */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#252840]/60 border border-white/5">
                <span className="text-xs text-[#dee0ff] font-medium">Hedef Alt Görev Sayısı</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewQuarterTasks((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-[#1a1e35] text-[#dee0ff] flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold text-[#e7c355] w-5 text-center">
                    {newQuarterTasks}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNewQuarterTasks((prev) => Math.min(12, prev + 1))}
                    className="w-7 h-7 rounded-lg bg-[#1a1e35] text-[#dee0ff] flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddQuarterModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#252840] text-[#c7c4d7] hover:text-white text-xs font-semibold transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmAddQuarter}
                className="flex-1 py-2.5 rounded-xl bg-[#e7c355] text-[#3d2f00] text-xs font-bold shadow-md hover:bg-[#ffe089] transition-all"
              >
                Kilometre Taşını Ekle ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free AI Image Generator & Curated Studio Modal */}
      <VisionAiImageGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        initialTitle={title}
        initialCategory={CATEGORY_LABELS[selectedCategory] || 'Kariyer & Bolluk'}
        onPlayChime={onPlayChime}
        onShowToast={onShowToast}
        onSelectImage={(newImgUrl, promptTitle) => {
          setImageUrl(newImgUrl);
          if (promptTitle) {
            setImageLocation(promptTitle);
          }
        }}
      />
    </div>
  );
};
