import React, { useState } from 'react';
import { AddGoalScreen, NewGoalData } from './AddGoalScreen';
import {
  triggerNeurologicalReinforcement,
  triggerNeurologicalHaptic,
} from '../../utils/neurologicalFeedback';

interface GoalsTabProps {
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime: () => void;
}

interface Milestone {
  id: string;
  quarter: string;
  title: string;
  desc: string;
  status: 'done' | 'active' | 'planned';
}

interface GoalItem {
  id: string;
  category: 'career' | 'wellness' | 'spirit';
  categoryLabel: string;
  daysLeft: number;
  title: string;
  desc: string;
  progress: number;
  todayAction: string;
  actionIcon: string;
  actionCompleted: boolean;
}

export const GoalsTab: React.FC<GoalsTabProps> = ({ onShowToast, onPlayChime }) => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'career' | 'wellness' | 'spirit'>('all');

  // Hero Goal #1 State
  const [isHeroActionShrunk, setIsHeroActionShrunk] = useState(false);
  const [isHeroActionCompleted, setIsHeroActionCompleted] = useState(false);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Hero Milestones State
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'm1',
      quarter: 'Q1',
      title: 'Q1: İtalyanca B1 & Vize Portföyü',
      desc: 'Resmi evraklar & sertifika alındı',
      status: 'done',
    },
    {
      id: 'm2',
      quarter: 'Q2',
      title: 'Q2: Como/Milano Çalışma Sözleşmesi',
      desc: 'Şirket evrakları onay & vergi kaydı',
      status: 'active',
    },
    {
      id: 'm3',
      quarter: 'Q3',
      title: 'Q3: Ev Kiralama & Fiziksel Yerleşim',
      desc: 'Uçak bileti ve taşınma lojistiği',
      status: 'planned',
    },
  ]);

  // Other Goals State
  const [otherGoals, setOtherGoals] = useState<GoalItem[]>([
    {
      id: 'g2',
      category: 'wellness',
      categoryLabel: 'Beden & Canlılık',
      daysLeft: 85,
      title: 'Canlı, Esnek & Dingin Bir Beden',
      desc: 'Q1 Yin Yoga serisi & sabah hidrasyon ritüeli tamamlandı',
      progress: 60,
      todayAction: 'Bugün: 20 dk akşam restoratif esneme',
      actionIcon: 'spa',
      actionCompleted: false,
    },
    {
      id: 'g3',
      category: 'spirit',
      categoryLabel: 'Ruhsal Denge',
      daysLeft: 30,
      title: '432Hz Zihin Hali & Derin Meditasyon',
      desc: 'Sabah alfa-dalga zihin boşaltımı & nefes kontrolü',
      progress: 85,
      todayAction: 'Bugün: 15 dk 432Hz solfeggio ses banyosu',
      actionIcon: 'graphic_eq',
      actionCompleted: false,
    },
    {
      id: 'g4',
      category: 'career',
      categoryLabel: 'Kariyer & Bolluk',
      daysLeft: 180,
      title: 'Yaratıcı Dijital Tasarım Stüdyosu',
      desc: 'Global müşteri tabanı ve bağımsız ürün lansmanı',
      progress: 35,
      todayAction: 'Bugün: 1 portföy vaka analizi taslağı hazırla',
      actionIcon: 'palette',
      actionCompleted: false,
    },
  ]);

  // New Goal Modal State
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  // Goal celebration & Neurological reinforcement animation states
  const [celebratingGoalId, setCelebratingGoalId] = useState<string | null>(null);
  const [pulsingMilestoneId, setPulsingMilestoneId] = useState<string | null>(null);
  const [pulsingGoalId, setPulsingGoalId] = useState<string | null>(null);
  const [isPulsingHeroAction, setIsPulsingHeroAction] = useState<boolean>(false);

  const triggerCelebrationEffect = (id: string) => {
    setCelebratingGoalId(id);
    setTimeout(() => {
      setCelebratingGoalId((prev) => (prev === id ? null : prev));
    }, 2400);
  };

  /**
   * Neurological Reinforcement Micro-Interaction:
   * Simulates the dopamine reward of hitting/acknowledging a milestone via
   * tactile haptic feedback (double pulse), crystalline 963Hz harmonic chime,
   * and a radiating visual synaptic pulse.
   */
  const triggerMilestoneReinforcement = (milestoneId: string, title: string) => {
    setPulsingMilestoneId(milestoneId);
    triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
    onShowToast(`Nöral Pekiştirme: "${title}" kilometre taşı hafızaya mühürlendi ⚡`, 'psychology');
    setTimeout(() => {
      setPulsingMilestoneId((prev) => (prev === milestoneId ? null : prev));
    }, 850);
  };

  const triggerGoalReinforcement = (goalId: string, title: string) => {
    setPulsingGoalId(goalId);
    triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
    onShowToast(`Nöral Pekiştirme: "${title}" dopamin rezonansı güçlendirildi ⚡`, 'psychology');
    setTimeout(() => {
      setPulsingGoalId((prev) => (prev === goalId ? null : prev));
    }, 850);
  };

  const triggerHeroActionReinforcement = () => {
    setIsPulsingHeroAction(true);
    triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
    onShowToast('Nöral Pekiştirme: Günlük eylem momentumu pekiştirildi ⚡', 'psychology');
    setTimeout(() => {
      setIsPulsingHeroAction(false);
    }, 850);
  };

  // Hero Micro-Action shrink toggle (AI relief)
  const handleToggleShrink = () => {
    const next = !isHeroActionShrunk;
    setIsHeroActionShrunk(next);
    if (next) {
      onShowToast('Eylem direnci düşürüldü: 5 dakikalık mikro-adıma küçültüldü ✨', 'compress');
    } else {
      onShowToast('Orijinal 15 dakikalık eyleme dönüldü.', 'schedule');
    }
  };

  // Hero Micro-Action completion
  const handleCompleteHeroAction = () => {
    if (isHeroActionCompleted) {
      triggerHeroActionReinforcement();
      return;
    }
    setIsHeroActionCompleted(true);
    setIsPulsingHeroAction(true);
    setShowCelebrationBanner(true);
    triggerCelebrationEffect('hero');
    triggerNeurologicalReinforcement({ pitch: 1080, enableAudio: true });
    onShowToast('Harika! +25 Odak Puanı ve momentum kazanıldı ✨', 'celebration');
    setTimeout(() => {
      setIsPulsingHeroAction(false);
    }, 850);
  };

  // Toggle milestone state
  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (m.status === 'done') {
          onShowToast(`"${m.title}" aktif duruma alındı.`, 'autorenew');
          return { ...m, status: 'active' };
        }
        if (m.status === 'active') {
          triggerNeurologicalReinforcement({ pitch: 1080, enableAudio: true });
          setPulsingMilestoneId(id);
          triggerCelebrationEffect('hero');
          onShowToast(`"${m.title}" tamamlandı! Nöral pekiştirme mühürlendi ✨`, 'verified');
          setTimeout(() => {
            setPulsingMilestoneId((prev) => (prev === id ? null : prev));
          }, 850);
          return { ...m, status: 'done' };
        }
        onShowToast(`"${m.title}" aktif kilometre taşı yapıldı.`, 'flag');
        return { ...m, status: 'active' };
      })
    );
  };

  // Toggle other goal action
  const handleToggleGoalAction = (goalId: string) => {
    setOtherGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextState = !g.actionCompleted;
        if (nextState) {
          triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
          setPulsingGoalId(goalId);
          triggerCelebrationEffect(goalId);
          onShowToast(`"${g.title}" günlük eylemi tamamlandı ✨`, 'check_circle');
          setTimeout(() => {
            setPulsingGoalId((prev) => (prev === goalId ? null : prev));
          }, 850);
        }
        return {
          ...g,
          actionCompleted: nextState,
          progress: nextState ? Math.min(100, g.progress + 5) : Math.max(0, g.progress - 5),
        };
      })
    );
  };

  // Receive new goal from AddGoalScreen
  const handleAddNewGoalFromScreen = (data: NewGoalData) => {
    const catMap: Record<string, 'career' | 'wellness' | 'spirit'> = {
      career: 'career',
      wellness: 'wellness',
      spirit: 'spirit',
      relationships: 'spirit',
      travel: 'career',
      art: 'career',
    };

    const catIconMap: Record<string, string> = {
      career: 'payments',
      wellness: 'vital_signs',
      spirit: 'self_improvement',
      relationships: 'favorite',
      travel: 'explore',
      art: 'palette',
    };

    const newGoal: GoalItem = {
      id: `g-${Date.now()}`,
      category: catMap[data.category] || 'career',
      categoryLabel: data.categoryLabel,
      daysLeft: data.daysLeft || 90,
      title: data.title,
      desc: data.emotionalWhy || '3 aylık kilometre taşları belirlendi & günlük eylem hazır',
      progress: 15,
      todayAction: `Bugün: ${data.microAction}`,
      actionIcon: catIconMap[data.category] || 'flag',
      actionCompleted: false,
    };

    setOtherGoals((prev) => [newGoal, ...prev]);
  };

  // Filter calculations
  const heroCategoryMatch = selectedCategory === 'all' || selectedCategory === 'career';
  const filteredOtherGoals = otherGoals.filter(
    (g) => selectedCategory === 'all' || g.category === selectedCategory
  );

  // Dynamic calculation of Hero Goal progress based on milestones & micro-action
  const completedMilestonesCount = milestones.filter((m) => m.status === 'done').length;
  const heroGoalProgress = Math.min(
    100,
    30 + completedMilestonesCount * 15 + (isHeroActionCompleted ? 10 : 0)
  );

  // Completed actions count across all goals
  const completedActionsCount =
    (isHeroActionCompleted ? 1 : 0) + otherGoals.filter((g) => g.actionCompleted).length;

  // Total manifestation progress calculation (average percentage of all individual goal cards currently in list)
  const allGoalsProgressValues = [heroGoalProgress, ...otherGoals.map((g) => g.progress)];
  const totalManifestationProgress = Math.round(
    allGoalsProgressValues.reduce((sum, val) => sum + val, 0) / (allGoalsProgressValues.length || 1)
  );

  const countCareer = 1 + otherGoals.filter((g) => g.category === 'career').length;
  const countWellness = otherGoals.filter((g) => g.category === 'wellness').length;
  const countSpirit = otherGoals.filter((g) => g.category === 'spirit').length;
  const totalCount = 1 + otherGoals.length;

  return (
    <section className="flex flex-col w-full max-w-lg sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 pb-14 animate-fadeIn relative">
      {/* SECTION 1: Header with Micro-Delight Button */}
      <section className="flex flex-col gap-1 mt-1 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e7c355] shadow-[0_0_8px_rgba(231,195,85,0.8)] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#e7c355] tracking-widest uppercase">
                Kozmik Manifest &amp; Eylem
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#dee0ff] tracking-tight">
              SMART Hedeflerim <span className="text-[#e7c355] drop-shadow-[0_0_12px_rgba(231,195,85,0.4)]">✨</span>
            </h1>
          </div>

          {/* Add Goal Pill Button */}
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            aria-label="Yeni Hedef Ekle"
            className="relative group overflow-hidden rounded-full p-px bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#8e7100] shadow-[0_0_16px_rgba(231,195,85,0.25)] active:scale-95 transition-transform duration-200"
          >
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#252840]/90 backdrop-blur-md text-[#e7c355] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Yeni Hedef</span>
            </span>
          </button>
        </div>

        <p className="text-xs text-[#c7c4d7] max-w-[92%] leading-relaxed">
          Vizyon → 3 Aylık Milestones &amp; Günlük 15 Dk Eylemler
        </p>
      </section>

      {/* SUMMARY VIEW: Total Manifestation Progress Cockpit */}
      <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#252840]/90 via-[#1a1e35]/95 to-[#252840]/80 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(8,12,34,0.6)] border border-[#e7c355]/25 overflow-hidden mb-5 group">
        {/* Atmospheric Ambient Glows */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#e7c355]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#8083ff]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 relative z-10 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e7c355]/20 to-[#8e7100]/20 border border-[#e7c355]/40 flex items-center justify-center text-[#e7c355] shadow-[0_0_12px_rgba(231,195,85,0.25)]">
              <span className="material-symbols-outlined text-[22px]">all_inclusive</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#dee0ff] tracking-tight">
                  Toplam Manifest İlerlemesi
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#e7c355]/15 text-[#e7c355] text-[10px] font-bold">
                  Canlı
                </span>
              </div>
              <span className="text-[11px] text-[#c7c4d7]">
                Tüm aktif hedeflerin nöral rezonans ortalaması
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#e7c355] tracking-tight drop-shadow-[0_0_14px_rgba(231,195,85,0.4)]">
              %{totalManifestationProgress}
            </span>
            <span className="text-[10px] text-[#c7c4d7] uppercase tracking-wider font-semibold">
              Rezonans
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative z-10 w-full mb-3.5">
          <div className="w-full h-3 rounded-full bg-[#080c22]/90 p-0.5 overflow-hidden border border-white/5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8e7100] via-[#e7c355] to-[#ffe089] shadow-[0_0_14px_rgba(231,195,85,0.6)] transition-all duration-700 ease-out"
              style={{ width: `${totalManifestationProgress}%` }}
            />
          </div>
        </div>

        {/* Micro Meta Strip */}
        <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-[#080c22]/40 border border-white/5">
            <span className="text-[10px] text-[#c7c4d7]">Aktif Hedef</span>
            <span className="font-serif text-sm font-bold text-[#dee0ff] mt-0.5">
              {totalCount} Kart
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-[#080c22]/40 border border-white/5">
            <span className="text-[10px] text-[#c7c4d7]">Tamamlanan Eylem</span>
            <span className="font-serif text-sm font-bold text-[#7bd0ff] mt-0.5">
              {completedActionsCount} Adım
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-[#080c22]/40 border border-white/5">
            <span className="text-[10px] text-[#c7c4d7]">Rezonans Seviyesi</span>
            <span className="font-serif text-xs font-bold text-[#ffe089] mt-0.5 truncate max-w-[90px]">
              {totalManifestationProgress >= 70
                ? 'Yüksek Rezonans'
                : totalManifestationProgress >= 50
                ? 'Dengeli Akış'
                : 'Başlangıç İvmesi'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Filter Pills (Scrollable Celestial Wheel) */}
      <div className="relative w-full mb-6 overflow-x-auto no-scrollbar py-1 flex items-center gap-2 scroll-smooth">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_14px_rgba(231,195,85,0.35)] font-bold'
              : 'bg-[#252840]/60 backdrop-blur-md text-[#c7c4d7] hover:text-[#e7c355]'
          }`}
        >
          {selectedCategory === 'all' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#3d2f00]" />
          )}
          <span>Tümü</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              selectedCategory === 'all'
                ? 'bg-[#3d2f00]/15 text-[#3d2f00]'
                : 'bg-[#2f334b] text-[#c7c4d7]'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('career')}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedCategory === 'career'
              ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_14px_rgba(231,195,85,0.35)] font-bold'
              : 'bg-[#252840]/60 backdrop-blur-md text-[#c7c4d7] hover:text-[#e7c355]'
          }`}
        >
          <span>Kariyer &amp; Bolluk</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedCategory === 'career'
                ? 'bg-[#3d2f00]/15 text-[#3d2f00] font-semibold'
                : 'bg-[#2f334b] text-[#c7c4d7]'
            }`}
          >
            {countCareer}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('wellness')}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedCategory === 'wellness'
              ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_14px_rgba(231,195,85,0.35)] font-bold'
              : 'bg-[#252840]/60 backdrop-blur-md text-[#c7c4d7] hover:text-[#e7c355]'
          }`}
        >
          <span>Beden &amp; Canlılık</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedCategory === 'wellness'
                ? 'bg-[#3d2f00]/15 text-[#3d2f00] font-semibold'
                : 'bg-[#2f334b] text-[#c7c4d7]'
            }`}
          >
            {countWellness}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('spirit')}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            selectedCategory === 'spirit'
              ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_14px_rgba(231,195,85,0.35)] font-bold'
              : 'bg-[#252840]/60 backdrop-blur-md text-[#c7c4d7] hover:text-[#e7c355]'
          }`}
        >
          <span>Ruhsal Denge</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedCategory === 'spirit'
                ? 'bg-[#3d2f00]/15 text-[#3d2f00] font-semibold'
                : 'bg-[#2f334b] text-[#c7c4d7]'
            }`}
          >
            {countSpirit}
          </span>
        </button>
      </div>

      {/* SECTION 3: Hero Card: Active Priority #1 SMART Goal */}
      {heroCategoryMatch && (
        <div className="relative w-full rounded-2xl bg-[#252840]/65 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_16px_36px_rgba(8,12,34,0.7)] overflow-hidden mb-8 border border-white/5">
          {/* Atmospheric Ambient Glows Inside Glass */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#e7c355]/10 blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-[#8083ff]/15 blur-[60px] pointer-events-none" />

          {/* Header Meta & Countdown */}
          <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#e7c355]/15 text-[#e7c355] text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
              Kariyer &amp; Bolluk
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#009bd1]/20 text-[#7bd0ff] text-[11px] font-semibold tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timelapse</span>
              142 Gün Kaldı
            </span>
          </div>

          {/* Goal Title & Vision Picture Placeholder */}
          <div className="relative z-10 mb-4">
            <h2 className="font-serif text-xl sm:text-2xl text-[#dee0ff] mb-3 leading-snug font-medium">
              Como Gölü Kıyısında Yaşam &amp; Bağımsız Çalışma
            </h2>

            {/* Visual Anchor: Vision Board Mood */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 shadow-md border border-white/5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBor3Jtqkv0F1CUrF50UGvaB63m-9gFMii3ymkVdRNbbNN6pt4cob_fBubQBsWjtZpdGALpjVacBT_cGaX1Z8nLbu7eN8kdhiwFFswT4ApAW3Xj8bpHQ-70QT9d7AoGXfSw5pE42ovOKvEv5aKM2ovshGlgoqGQTvu7_xGaPrNbiXQBdWkAKalr_2tDDj_tVS_8RXWR5w3PQ7PyHHr3TUEQDN0Nl99Cd6yHM4ivw5s"
                alt="Serene Lake Como villa terrace"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252840] via-[#252840]/30 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#e7c355] tracking-widest uppercase">
                  Görsel Çapa: Kuzey İtalya
                </span>
                <span className="material-symbols-outlined text-[#e7c355] text-[16px]">pin_drop</span>
              </div>
            </div>

            {/* Emotional Anchor: "Why" Statement */}
            <div className="rounded-xl bg-[#080c22]/50 p-3 flex items-start gap-2 border border-white/5">
              <span className="material-symbols-outlined text-[#e7c355] text-[18px] shrink-0 mt-0.5">
                format_quote
              </span>
              <p className="text-xs text-[#c7c4d7] italic leading-relaxed">
                “Aileme dingin, doğayla iç içe özgür bir yaşam sunmak ve yaratıcı potansiyelimi en yüksek seviyede gerçekleştirmek.”
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="relative z-10 flex flex-col gap-1.5 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#c7c4d7]">Genel Hedef İlerlemesi</span>
              <span
                className={`font-serif text-base font-bold tracking-tight transition-all duration-300 ${
                  celebratingGoalId === 'hero'
                    ? 'text-[#ffe089] scale-105 drop-shadow-[0_0_10px_rgba(231,195,85,0.7)]'
                    : 'text-[#e7c355]'
                }`}
              >
                %{heroGoalProgress} Tamamlandı
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full bg-[#080c22]/80 overflow-hidden p-0.5 border transition-all duration-500 ${
                celebratingGoalId === 'hero'
                  ? 'border-[#e7c355] shadow-[0_0_16px_rgba(231,195,85,0.6)]'
                  : 'border-white/5'
              }`}
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r from-[#8e7100] via-[#e7c355] to-[#ffe089] transition-all duration-500 relative overflow-hidden ${
                  celebratingGoalId === 'hero'
                    ? 'animate-celebrate-bar'
                    : 'shadow-[0_0_10px_rgba(231,195,85,0.7)]'
                }`}
                style={{ width: `${heroGoalProgress}%` }}
              >
                {celebratingGoalId === 'hero' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-sweep" />
                )}
              </div>
            </div>
          </div>

          {/* 3-Month Milestones Horizon */}
          <div className="relative z-10 flex flex-col gap-2 mb-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#dee0ff] tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#e7c355]">flag</span>
                3 Aylık Kilometre Taşları (Milestones)
              </span>
              <span className="text-[11px] text-[#c7c4d7]">Q1 – Q3 2025</span>
            </div>

            {/* Milestones list with Neurological Reinforcement */}
            {milestones.map((m) => {
              const isDone = m.status === 'done';
              const isActive = m.status === 'active';
              const isPulsing = pulsingMilestoneId === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (isDone) {
                      triggerMilestoneReinforcement(m.id, m.title);
                    } else {
                      handleToggleMilestone(m.id);
                    }
                  }}
                  className={`relative flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-[0.99] border overflow-hidden ${
                    isPulsing
                      ? 'animate-neural-pulse border-[#e7c355] shadow-[0_0_24px_rgba(231,195,85,0.45)]'
                      : isDone
                      ? 'bg-[#1a1e35]/60 border-white/5 hover:border-[#e7c355]/40 hover:bg-[#252840]/60'
                      : isActive
                      ? 'bg-[#2f334b]/80 border-[#e7c355]/30 shadow-[0_0_14px_rgba(231,195,85,0.12)]'
                      : 'bg-[#1a1e35]/30 border-white/5 opacity-70'
                  }`}
                >
                  {isPulsing && (
                    <span className="absolute inset-0 rounded-xl border-2 border-[#e7c355]/80 animate-synaptic-halo pointer-events-none" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative transition-transform duration-200 ${
                        isPulsing
                          ? 'scale-110 bg-[#e7c355] text-[#3d2f00] shadow-[0_0_14px_rgba(231,195,85,0.7)]'
                          : isDone
                          ? 'bg-[#e7c355]/20 text-[#e7c355]'
                          : isActive
                          ? 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_10px_rgba(231,195,85,0.5)]'
                          : 'bg-[#2f334b] text-[#c7c4d7]'
                      }`}
                    >
                      {isPulsing && (
                        <span className="absolute -inset-1 rounded-full border border-[#e7c355] animate-ping opacity-60 pointer-events-none" />
                      )}
                      {isDone ? (
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            isPulsing ? 'animate-neural-check text-[#3d2f00]' : ''
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      ) : isActive ? (
                        <span
                          className="material-symbols-outlined text-[16px] animate-spin"
                          style={{ animationDuration: '6s' }}
                        >
                          autorenew
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isDone
                              ? 'text-[#dee0ff]'
                              : isActive
                              ? 'text-[#e7c355]'
                              : 'text-[#dee0ff]'
                          }`}
                        >
                          {m.title}
                        </span>
                        {isPulsing && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#e7c355]/25 text-[#ffe089] font-bold tracking-tight animate-pulse shrink-0 border border-[#e7c355]/40">
                            ⚡ Nöral Pekiştirme
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] truncate ${
                          isDone ? 'text-[#c7c4d7]/70' : 'text-[#c7c4d7]'
                        }`}
                      >
                        {m.desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDone && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMilestone(m.id);
                        }}
                        title="Aktif duruma al"
                        className="p-1 rounded-full text-[#c7c4d7]/40 hover:text-[#e7c355] hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                      </button>
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase shrink-0 font-semibold transition-all ${
                        isDone
                          ? isPulsing
                            ? 'text-[#ffe089] bg-[#e7c355]/30 border border-[#e7c355] shadow-[0_0_8px_rgba(231,195,85,0.4)]'
                            : 'text-[#e7c355] bg-[#e7c355]/10 border border-[#e7c355]/30'
                          : isActive
                          ? 'text-[#3d2f00] bg-[#e7c355]'
                          : 'text-[#c7c4d7] bg-[#2f334b]'
                      }`}
                    >
                      {isDone ? 'Tamamlandı' : isActive ? 'Aktif' : 'Planlandı'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily 15-Minute Micro-Action Box (Delight Moment) */}
          <div
            onClick={isHeroActionCompleted ? triggerHeroActionReinforcement : undefined}
            className={`relative z-10 rounded-xl bg-gradient-to-br from-[#8083ff]/25 via-[#252840]/90 to-[#8083ff]/10 p-4 shadow-[0_8px_24px_rgba(128,131,255,0.15)] overflow-hidden border transition-all duration-300 ${
              isPulsingHeroAction
                ? 'animate-neural-pulse border-[#e7c355] shadow-[0_0_28px_rgba(231,195,85,0.5)]'
                : isHeroActionCompleted
                ? 'border-[#e7c355]/40 cursor-pointer hover:border-[#e7c355]/60'
                : 'border-white/5'
            }`}
            id="micro-action-card"
          >
            {isPulsingHeroAction && (
              <span className="absolute inset-0 rounded-xl border-2 border-[#e7c355]/80 animate-synaptic-halo pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">bolt</span>
                <span className="text-[11px] text-[#c0c1ff] tracking-widest uppercase font-bold">
                  Bugünkü Tek Mikro-Eylem
                </span>
                {isHeroActionCompleted && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#e7c355]/20 text-[#ffe089] font-bold border border-[#e7c355]/30">
                    {isPulsingHeroAction ? '⚡ Nöral Pekiştirildi' : 'Tamamlandı'}
                  </span>
                )}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#c0c1ff]/20 text-[#e1e0ff] text-[10px] font-semibold tracking-wide">
                {isHeroActionShrunk ? '5 DAKİKA' : '15 DAKİKA'}
              </span>
            </div>

            <p className="text-sm text-[#dee0ff] mb-4 leading-relaxed font-normal">
              {isHeroActionShrunk ? (
                <>
                  <span className="text-[#e7c355] font-semibold">⚡ Mikro-Odak (5 Dk): </span>
                  Başvuru mektubunun sadece ilk paragrafını aç ve 1 güçlü İtalyanca kelimeyi sarıya boya.
                </>
              ) : (
                'İtalyanca çalışma portföyünden 1 vize başvuru yazısını incele ve 3 anahtar kelimeyi not al.'
              )}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex items-center gap-2">
              {/* Shrink to 5 Min (AI Relief Button) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleShrink();
                }}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 border border-white/10 ${
                  isHeroActionShrunk
                    ? 'bg-[#009bd1]/30 text-[#7bd0ff]'
                    : 'bg-[#2f334b]/80 hover:bg-[#2f334b] text-[#c7c4d7] hover:text-[#dee0ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">compress</span>
                <span>{isHeroActionShrunk ? 'Geri Al (15 Dk)' : "⚡ 5 Dk'ya Küçült (AI)"}</span>
              </button>

              {/* Complete Micro-Action Golden Button with Haptic Pulse */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteHeroAction();
                }}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_16px_rgba(231,195,85,0.4)] relative ${
                  isHeroActionCompleted
                    ? 'bg-[#e7c355]/30 text-[#ffe089] border border-[#e7c355]/60 hover:bg-[#e7c355]/40 cursor-pointer'
                    : 'bg-gradient-to-r from-[#8e7100] via-[#e7c355] to-[#ffe089] text-[#3d2f00] hover:brightness-105'
                } ${isPulsingHeroAction ? 'animate-neural-pulse' : ''}`}
              >
                {isPulsingHeroAction && (
                  <span className="absolute inset-0 rounded-full border border-[#ffe089] animate-synaptic-halo pointer-events-none" />
                )}
                <span className={`material-symbols-outlined text-[17px] ${isPulsingHeroAction ? 'animate-neural-check text-[#ffe089]' : ''}`}>
                  {isHeroActionCompleted ? 'check_circle' : 'done_all'}
                </span>
                <span>{isHeroActionCompleted ? 'Pekiştir ⚡' : 'Tamamladım ✨'}</span>
              </button>
            </div>

            {/* Delight Celebration Toast inside card */}
            {showCelebrationBanner && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#e7c355]/20 text-[#e7c355] text-center text-xs animate-fadeIn flex items-center justify-center gap-1.5 border border-[#e7c355]/30">
                <span className="material-symbols-outlined text-[16px]">celebration</span>
                <span className="font-medium">Harika! +25 Odak Puanı ve momentum kazanıldı.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: Other SMART Goals (List of Contemplative Cards) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-lg text-[#dee0ff] font-medium">
            Diğer Aktif Vizyonlar
          </h3>
          <span className="text-xs font-semibold text-[#e7c355] tracking-wider uppercase">
            {filteredOtherGoals.length} Hedef
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5 w-full">
        {filteredOtherGoals.map((goal) => {
          const isGoalPulsing = pulsingGoalId === goal.id;
          const isDoneOrCompleted = goal.actionCompleted || goal.progress === 100;

          return (
            <div
              key={goal.id}
              onClick={isDoneOrCompleted ? () => triggerGoalReinforcement(goal.id, goal.title) : undefined}
              className={`relative rounded-2xl bg-[#1a1e35]/70 backdrop-blur-md p-4 shadow-md flex flex-col gap-2.5 transition-all border overflow-hidden ${
                isGoalPulsing
                  ? 'animate-neural-pulse border-[#e7c355] shadow-[0_0_24px_rgba(231,195,85,0.45)]'
                  : isDoneOrCompleted
                  ? 'hover:bg-[#252840]/80 border-white/10 hover:border-[#e7c355]/40 cursor-pointer select-none active:scale-[0.99]'
                  : 'hover:bg-[#252840]/80 border-white/5'
              }`}
            >
              {isGoalPulsing && (
                <span className="absolute inset-0 rounded-2xl border-2 border-[#e7c355]/80 animate-synaptic-halo pointer-events-none" />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      goal.category === 'wellness'
                        ? 'bg-[#009bd1]/20 text-[#7bd0ff]'
                        : goal.category === 'spirit'
                        ? 'bg-[#8083ff]/20 text-[#c0c1ff]'
                        : 'bg-[#e7c355]/15 text-[#e7c355]'
                    }`}
                  >
                    {goal.categoryLabel}
                  </span>
                  {isGoalPulsing && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#e7c355]/25 text-[#ffe089] font-bold tracking-tight animate-pulse border border-[#e7c355]/40">
                      ⚡ Nöral Pekiştirme
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#c7c4d7] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">timer</span>
                  {goal.daysLeft} Gün Kaldı
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <h4 className="font-serif text-base font-semibold text-[#dee0ff] truncate">
                    {goal.title}
                  </h4>
                  <span className="text-xs text-[#c7c4d7] truncate leading-relaxed">
                    {goal.desc}
                  </span>
                </div>
                <div className="shrink-0 flex flex-col items-end">
                  <span
                    className={`font-serif text-sm font-bold transition-all duration-300 ${
                      celebratingGoalId === goal.id || isGoalPulsing
                        ? 'text-[#ffe089] scale-110 drop-shadow-[0_0_8px_rgba(231,195,85,0.7)]'
                        : 'text-[#e7c355]'
                    }`}
                  >
                    %{goal.progress}
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div
                className={`w-full h-1.5 rounded-full bg-[#080c22] overflow-hidden border transition-all duration-500 ${
                  celebratingGoalId === goal.id || isGoalPulsing
                    ? 'border-[#e7c355] shadow-[0_0_14px_rgba(231,195,85,0.5)]'
                    : 'border-white/5'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                    celebratingGoalId === goal.id || isGoalPulsing
                      ? 'bg-gradient-to-r from-[#8e7100] via-[#e7c355] to-[#ffe089] animate-celebrate-bar'
                      : 'bg-[#e7c355]'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                >
                  {(celebratingGoalId === goal.id || isGoalPulsing) && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-sweep" />
                  )}
                </div>
              </div>

              {/* Today's Action Minimal Pill */}
              <div className="flex items-center justify-between rounded-xl bg-[#080c22]/60 px-3 py-2 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#e7c355] text-[16px] shrink-0">
                    {goal.actionIcon}
                  </span>
                  <span
                    className={`text-xs truncate ${
                      goal.actionCompleted ? 'line-through text-[#c7c4d7]/70' : 'text-[#c7c4d7]'
                    }`}
                  >
                    {goal.todayAction}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (goal.actionCompleted) {
                      triggerGoalReinforcement(goal.id, goal.title);
                    } else {
                      handleToggleGoalAction(goal.id);
                    }
                  }}
                  aria-label="Eylemi Tamamla veya Pekiştir"
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 relative ${
                    goal.actionCompleted
                      ? isGoalPulsing
                        ? 'bg-[#ffe089] text-[#3d2f00] shadow-[0_0_12px_rgba(231,195,85,0.7)]'
                        : 'bg-[#e7c355] text-[#3d2f00] shadow-[0_0_8px_rgba(231,195,85,0.4)]'
                      : 'bg-[#2f334b] text-[#c7c4d7] hover:text-[#e7c355]'
                  }`}
                >
                  {isGoalPulsing && (
                    <span className="absolute -inset-1 rounded-full border border-[#e7c355] animate-ping opacity-70 pointer-events-none" />
                  )}
                  <span className={`material-symbols-outlined text-[15px] ${isGoalPulsing ? 'animate-neural-check' : ''}`}>
                    check
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* DEDICATED SMART HEDEF MİMARİSİ MODAL SCREEN */}
      {isAddGoalModalOpen && (
        <AddGoalScreen
          onClose={() => setIsAddGoalModalOpen(false)}
          onAddGoal={handleAddNewGoalFromScreen}
          onShowToast={onShowToast}
          onPlayChime={onPlayChime}
        />
      )}
    </section>
  );
};
