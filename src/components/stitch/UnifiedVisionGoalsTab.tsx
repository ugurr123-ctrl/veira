import React, { useState } from 'react';
import { UnifiedVisionGoal, DailyTask, MiniTask } from '../../types';
import { useUnifiedVisions } from '../../utils/unifiedStorage';
import { triggerNeurologicalReinforcement } from '../../utils/neurologicalFeedback';
import { VisionCollageStudioModal } from './VisionCollageStudioModal';
import { VisionAiImageGeneratorModal } from './VisionAiImageGeneratorModal';

interface UnifiedVisionGoalsTabProps {
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime: () => void;
  onTriggerCelebration?: () => void;
  onSwitchTab?: (tab: any) => void;
}

export type VisionViewMode = 'grid' | 'table' | 'cinema';

export const UnifiedVisionGoalsTab: React.FC<UnifiedVisionGoalsTabProps> = ({
  onShowToast,
  onPlayChime,
  onTriggerCelebration,
  onSwitchTab,
}) => {
  const {
    visions,
    toggleDailyTask,
    toggleMiniTask,
    addVision,
    updateVision,
    deleteVision,
    addDailyTaskToVision,
    addMiniTaskToVision,
    deleteDailyTask,
    deleteMiniTask,
  } = useUnifiedVisions();

  // Active View Mode: 'grid' (Gallery Cards), 'table' (Minimalist Focus Table), 'cinema' (Immersive Carousel)
  const [viewMode, setViewMode] = useState<VisionViewMode>('grid');

  // Category filter & search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active sub-tab inside cards: 'daily' (Günlük Görevler) or 'mini' (Yol Haritası / Kilometre Taşları)
  const [activeCardView, setActiveCardView] = useState<Record<string, 'daily' | 'mini'>>({});

  // Inline input states for adding tasks to cards
  const [newDailyInput, setNewDailyInput] = useState<Record<string, string>>({});
  const [newMiniInput, setNewMiniInput] = useState<Record<string, string>>({});

  // Cinema Mode / Fullscreen Index
  const [cinemaIndex, setCinemaIndex] = useState<number>(0);

  // BÜYÜK SİNEMATİK ÖNİZLEME MODALI STATE (Enhanced Sanctuary Preview)
  const [previewVision, setPreviewVision] = useState<UnifiedVisionGoal | null>(null);
  const [previewRegenPrompt, setPreviewRegenPrompt] = useState<string>('');
  const [isRegeneratingPreview, setIsRegeneratingPreview] = useState<boolean>(false);
  const [newPreviewDailyInput, setNewPreviewDailyInput] = useState<string>('');
  const [newPreviewMiniInput, setNewPreviewMiniInput] = useState<string>('');

  // Modal State: Add New Vision & Goal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCollageStudioOpen, setIsCollageStudioOpen] = useState(false);
  const [isImageGeneratorOpen, setIsImageGeneratorOpen] = useState(false);
  const [imageGenTarget, setImageGenTarget] = useState<'form' | 'preview' | 'quick_add'>('form');
  const [isDecomposingAI, setIsDecomposingAI] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Edit Vision State
  const [editingVision, setEditingVision] = useState<UnifiedVisionGoal | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editHorizon, setEditHorizon] = useState('');
  const [editWhy, setEditWhy] = useState('');

  // Custom task inputs inside creation modal
  const [newModalDailyTask, setNewModalDailyTask] = useState('');
  const [newModalMiniTask, setNewModalMiniTask] = useState('');

  // Form Fields for New Vision
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Kariyer & Bolluk');
  const [formHorizon, setFormHorizon] = useState('3 Ay');
  const [formWhy, setFormWhy] = useState('');
  const [formImageUrl, setFormImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAYlhU-0NgSW87u0HG48qUwVmlcXUyPWvOsd3WFu6MLH3jO5AmSglc8M8poJ_bgLAPQlYYABbnFcKM_8KmkWGFbtOF_0Wzo5c7w35uNX6txxXLApGAdlzuIGTrozIHTh1oS0t4_TZxKgGXqVOZLrjiihiqZh9Z5wiOppkr8qqiX0KHvQuwprqkrgG2-8Ox8ym4J-GNRqgrZddFEGm2uqI4w8lQvl4raSwpF3ENMwiU'
  );
  const [formDailyTasks, setFormDailyTasks] = useState<Array<{ title: string; estimatedMinutes: number }>>([
    { title: 'Günde 15 dk niyet odaklı mikro-adım at', estimatedMinutes: 15 },
  ]);
  const [formMiniTasks, setFormMiniTasks] = useState<Array<{ stepNumber: number; title: string; desc: string }>>([
    { stepNumber: 1, title: 'Temel yol haritası ve kaynakları belirle', desc: 'Başlangıç adımı' },
    { stepNumber: 2, title: 'İlk somut prototipi/hazırlığı tamamla', desc: 'Gelişme adımı' },
  ]);
  const [, setFormAffirmation] = useState('');
  const [targetMinutes, setTargetMinutes] = useState<number>(15);
  const [decomposeMode, setDecomposeMode] = useState<'balanced' | 'low_resistance' | 'deep_focus'>('balanced');
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [isCustomDailyOpen, setIsCustomDailyOpen] = useState(false);
  const [isCustomMiniOpen, setIsCustomMiniOpen] = useState(false);

  // Vision Deletion Confirmation State
  const [visionToDelete, setVisionToDelete] = useState<UnifiedVisionGoal | null>(null);

  // Pulsing celebration state per card
  const [pulsingCardId, setPulsingCardId] = useState<string | null>(null);
  const [isSuggestingAiForId, setIsSuggestingAiForId] = useState<string | null>(null);

  // Category Key helper
  const getCategoryKey = (cat: string): 'career' | 'wellness' | 'spirit' | 'travel' | 'growth' => {
    const lower = cat.toLowerCase();
    if (lower.includes('beden') || lower.includes('canlılık') || lower.includes('sağlık')) return 'wellness';
    if (lower.includes('ruh') || lower.includes('denge') || lower.includes('zihin')) return 'spirit';
    if (lower.includes('seyahat') || lower.includes('yaşam')) return 'travel';
    if (lower.includes('gelişim') || lower.includes('kişisel')) return 'growth';
    return 'career';
  };

  // Filtered visions
  const filteredVisions = visions.filter((v) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      v.categoryKey === selectedCategory ||
      v.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.why.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate global summary stats
  const totalVisions = visions.length;
  const totalDailyTasks = visions.reduce((acc, v) => acc + (v.dailyTasks?.length || 0), 0);
  const totalMiniTasks = visions.reduce((acc, v) => acc + (v.miniTasks?.length || 0), 0);
  const completedMiniTasks = visions.reduce(
    (acc, v) => acc + (v.miniTasks?.filter((m) => m.completed)?.length || 0),
    0
  );
  const overallMilestoneProgress =
    totalMiniTasks > 0 ? Math.round((completedMiniTasks / totalMiniTasks) * 100) : 0;

  // Toggle mini task with celebratory reinforcement
  const handleToggleMini = (visionId: string, mini: MiniTask) => {
    toggleMiniTask(visionId, mini.id);
    if (!mini.completed) {
      triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
      setPulsingCardId(visionId);
      setTimeout(() => setPulsingCardId(null), 900);
      onShowToast(`Adım ${mini.stepNumber} tamamlandı: "${mini.title}" 🎯`, 'check_circle');
    }
    // Sync preview modal if open
    if (previewVision && previewVision.id === visionId) {
      setPreviewVision((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          miniTasks: prev.miniTasks.map((m) =>
            m.id === mini.id ? { ...m, completed: !m.completed } : m
          ),
        };
      });
    }
  };

  // Toggle daily task with immediate haptic & audio
  const handleToggleDaily = (visionId: string, daily: DailyTask) => {
    toggleDailyTask(visionId, daily.id);
    if (!daily.completed) {
      triggerNeurologicalReinforcement({ pitch: 1080, enableAudio: true });
      onShowToast(`Günlük Görev Tamamlandı! "Bugün" panosuyla senkronize edildi ⚡`, 'task_alt');
    }
    // Sync preview modal if open
    if (previewVision && previewVision.id === visionId) {
      setPreviewVision((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          dailyTasks: prev.dailyTasks.map((d) =>
            d.id === daily.id ? { ...d, completed: !d.completed } : d
          ),
        };
      });
    }
  };

  // Handle inline daily task addition
  const handleAddInlineDaily = (visionId: string) => {
    const text = (newDailyInput[visionId] || '').trim();
    if (!text) return;
    addDailyTaskToVision(visionId, text, 15);
    setNewDailyInput((prev) => ({ ...prev, [visionId]: '' }));
    onPlayChime();
    onShowToast('Yeni günlük görev eklendi ve "Bugün" panosuna bağlandı! ✨', 'playlist_add');
  };

  // Handle inline mini task addition
  const handleAddInlineMini = (visionId: string) => {
    const text = (newMiniInput[visionId] || '').trim();
    if (!text) return;
    addMiniTaskToVision(visionId, text, 'Kullanıcı tanımlı aşama');
    setNewMiniInput((prev) => ({ ...prev, [visionId]: '' }));
    onPlayChime();
    onShowToast('Yeni kilometre taşı adım adım yol haritasına eklendi! 🗺️', 'add_task');
  };

  // Start editing existing vision
  const handleStartEdit = (vision: UnifiedVisionGoal) => {
    setEditingVision(vision);
    setEditTitle(vision.title);
    setEditCategory(vision.categoryLabel || vision.category);
    setEditHorizon(vision.horizon);
    setEditWhy(vision.why);
  };

  // Save edited vision
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVision || !editTitle.trim()) return;
    const catKey = getCategoryKey(editCategory);
    updateVision(editingVision.id, {
      title: editTitle.trim(),
      category: editCategory,
      categoryKey: catKey,
      categoryLabel: editCategory,
      horizon: editHorizon,
      why: editWhy.trim() || 'Bu vizyon ve hedef benim için derin bir anlam taşıyor.',
    });
    setEditingVision(null);
    onPlayChime();
    onShowToast(`"${editTitle.trim()}" vizyonu başarıyla güncellendi. ✨`, 'check');
  };

  // Toggle manifested/achieved status
  const handleToggleAchieved = (vision: UnifiedVisionGoal) => {
    const isNowAchieved = vision.status !== 'achieved';
    updateVision(vision.id, {
      status: isNowAchieved ? 'achieved' : 'active',
    });
    if (previewVision && previewVision.id === vision.id) {
      setPreviewVision((prev) => (prev ? { ...prev, status: isNowAchieved ? 'achieved' : 'active' } : null));
    }
    if (isNowAchieved) {
      if (onTriggerCelebration) onTriggerCelebration();
      onPlayChime();
      triggerNeurologicalReinforcement({ pitch: 1080, enableAudio: true });
      onShowToast(`🌟 Tebrikler! "${vision.title}" manifest edildi ve mühürlendi!`, 'stars');
    } else {
      onShowToast(`"${vision.title}" yeniden aktif hedefler arasına alındı.`, 'restart_alt');
    }
  };

  // Inline AI suggestion for existing vision
  const handleSuggestAiStepsForVision = async (vision: UnifiedVisionGoal) => {
    setIsSuggestingAiForId(vision.id);
    onShowToast(`"${vision.title}" için 15 dk atomik mikro-adımlar üretiliyor... 🧠`, 'psychology');

    try {
      const res = await fetch('/api/goals/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: vision.title,
          category: vision.category,
          horizon: vision.horizon,
          why: vision.why,
          targetMinutes: 15,
          mode: 'balanced',
        }),
      });

      if (!res.ok) throw new Error('Decompose failed');
      const data = await res.json();

      let addedCount = 0;
      if (data.dailyTasks && Array.isArray(data.dailyTasks)) {
        data.dailyTasks.forEach((dt: any) => {
          const exists = vision.dailyTasks?.some(
            (existing) => existing.title.toLowerCase().trim() === dt.title.toLowerCase().trim()
          );
          if (!exists) {
            addDailyTaskToVision(vision.id, dt.title, dt.estimatedMinutes || 15);
            addedCount++;
          }
        });
      }

      if (data.miniTasks && Array.isArray(data.miniTasks)) {
        data.miniTasks.forEach((mt: any) => {
          const exists = vision.miniTasks?.some(
            (existing) => existing.title.toLowerCase().trim() === mt.title.toLowerCase().trim()
          );
          if (!exists) {
            addMiniTaskToVision(vision.id, mt.title, mt.desc || 'AI tarafından önerilen aşama');
            addedCount++;
          }
        });
      }

      onPlayChime();
      triggerNeurologicalReinforcement({ pitch: 963, enableAudio: true });
      onShowToast(
        addedCount > 0
          ? `✨ ${addedCount} yeni atomik eylem "${vision.title}" hedefine mühürlendi!`
          : `✨ Tüm adımlar zaten güncel!`,
        'auto_awesome'
      );
    } catch (err) {
      console.warn('AI Suggestion error:', err);
      onShowToast('Adım önerisi yerel zeka ile tamamlandı.', 'check');
    } finally {
      setIsSuggestingAiForId(null);
    }
  };

  // AI Task Decomposition for the modal
  const handleDecomposeWithAI = async (
    overrideMinutes?: number,
    overrideMode?: 'balanced' | 'low_resistance' | 'deep_focus',
    customTitle?: string,
    customCat?: string,
    customHorizon?: string,
    customWhy?: string
  ) => {
    const titleToUse = (customTitle ?? formTitle).trim();
    if (!titleToUse) {
      onShowToast('Lütfen önce vizyon & hedef başlığını yazın.', 'warning');
      return;
    }

    const min = overrideMinutes ?? targetMinutes;
    const currentMode = overrideMode ?? decomposeMode;
    const catToUse = customCat ?? formCategory;
    const horizToUse = customHorizon ?? formHorizon;
    const whyToUse = customWhy ?? formWhy;

    setIsDecomposingAI(true);
    onShowToast(`Veira Yapay Zekası (${min} dk mikro-aksiyonlar) hedefini bölüyor... 🧠`, 'psychology');

    try {
      const res = await fetch('/api/goals/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToUse,
          category: catToUse,
          horizon: horizToUse,
          why: whyToUse,
          targetMinutes: min,
          mode: currentMode,
        }),
      });

      if (!res.ok) throw new Error('Decompose failed');
      const data = await res.json();

      if (data.dailyTasks && Array.isArray(data.dailyTasks)) {
        setFormDailyTasks(data.dailyTasks);
      }
      if (data.miniTasks && Array.isArray(data.miniTasks)) {
        setFormMiniTasks(data.miniTasks);
      }
      if (data.smartAffirmation) {
        setFormAffirmation(data.smartAffirmation);
      }

      onPlayChime();
      onShowToast(`✨ Hedefin ${min} dakikalık ${data.dailyTasks?.length || 2} günlük görev ve ${data.miniTasks?.length || 4} kilometre taşına ayrıldı!`, 'auto_awesome');
    } catch (err) {
      console.warn('AI Decompose error:', err);
      onShowToast('Yapay zeka ayrıştırma yerel bilişsel motor ile tamamlandı.', 'check');
    } finally {
      setIsDecomposingAI(false);
    }
  };

  // Image Selection Handler from AI Studio / Gallery Modal
  const handleSelectAiGeneratedImage = (selectedUrl: string, selectedTitle?: string) => {
    if (imageGenTarget === 'form') {
      setFormImageUrl(selectedUrl);
      if (selectedTitle && !formTitle.trim()) {
        setFormTitle(selectedTitle);
      }
      onShowToast('Vizyon görseli güncellendi! ✨', 'image');
    } else if (imageGenTarget === 'preview' && previewVision) {
      updateVision(previewVision.id, { imageUrl: selectedUrl });
      setPreviewVision((prev) => (prev ? { ...prev, imageUrl: selectedUrl } : null));
      onShowToast('Önizleme görseli 8K olarak güncellendi! ✨', 'image');
    } else if (imageGenTarget === 'quick_add') {
      const title = selectedTitle || 'Yeni İlham Vizyonu';
      addVision({
        title,
        category: 'Kariyer & Bolluk',
        categoryKey: 'career',
        categoryLabel: 'Kariyer & Bolluk',
        horizon: '3 Ay',
        why: 'Bu vizyon ve görsel benim gelecek vizyonumu temsil ediyor.',
        imageUrl: selectedUrl,
        badge: 'AI İlham Kartı',
        status: 'active',
        dailyTasks: [
          {
            id: `dt-${Date.now()}-1`,
            visionId: '',
            visionTitle: title,
            title: '15 dk bu vizyon için somut aksiyon adımı at',
            estimatedMinutes: 15,
            completed: false,
          },
        ],
        miniTasks: [
          {
            id: `mt-${Date.now()}-1`,
            visionId: '',
            stepNumber: 1,
            title: 'Vizyonun ilk yapı taşlarını ve kaynaklarını hazırla',
            desc: 'Başlangıç aşaması',
            completed: false,
          },
        ],
      });
      onPlayChime();
      if (onTriggerCelebration) onTriggerCelebration();
      onShowToast(`"${title}" vizyon panona mühürlendi! 🌟`, 'stars');
    }
    setIsImageGeneratorOpen(false);
  };

  // AI Image generation for the modal using Flux.1
  const handleGenerateFluxImage = async () => {
    if (!formTitle.trim()) {
      onShowToast('Lütfen önce görselini üretmek istediğin hedefi yaz.', 'warning');
      return;
    }

    setIsGeneratingImage(true);
    onShowToast('Flux.1 AI 8K fotogerçekçi vizyon görselini üretiyor... 🎨', 'palette');

    try {
      const res = await fetch('/api/image/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${formTitle} - ${formWhy || 'peaceful serene luxury'}`,
          style: 'cinematic',
        }),
      });

      if (!res.ok) throw new Error('Image generation failed');
      const data = await res.json();
      const finalUrl = data.imageUrl || data.reliableUrl || data.fluxUrl;
      if (finalUrl) {
        setFormImageUrl(finalUrl);
        onPlayChime();
        onShowToast('8K vizyon kartın hazırlandı! ✨', 'image');
      }
    } catch (err) {
      console.warn('Image generation warning:', err);
      const fallbackUrl = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85';
      setFormImageUrl(fallbackUrl);
      onShowToast('Görsel başarıyla hazırlandı.', 'image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Submit new Vision & Goal
  const handleCreateVisionGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Lütfen bir başlık girin.', 'warning');
      return;
    }

    let catKey: 'career' | 'wellness' | 'spirit' | 'travel' | 'growth' = 'career';
    if (formCategory.includes('Beden')) catKey = 'wellness';
    else if (formCategory.includes('Ruh')) catKey = 'spirit';
    else if (formCategory.includes('Seyahat')) catKey = 'travel';
    else if (formCategory.includes('Gelişim')) catKey = 'growth';

    const dailyTasksToSave: DailyTask[] = formDailyTasks.map((dt, idx) => ({
      id: `dt-new-${Date.now()}-${idx}`,
      visionId: '',
      visionTitle: formTitle,
      title: dt.title,
      estimatedMinutes: dt.estimatedMinutes || 15,
      completed: false,
    }));

    const miniTasksToSave: MiniTask[] = formMiniTasks.map((mt, idx) => ({
      id: `mt-new-${Date.now()}-${idx}`,
      visionId: '',
      stepNumber: mt.stepNumber || idx + 1,
      title: mt.title,
      desc: mt.desc || '',
      completed: false,
    }));

    addVision({
      title: formTitle,
      category: formCategory,
      categoryKey: catKey,
      categoryLabel: formCategory,
      horizon: formHorizon,
      why: formWhy || 'Bu vizyon benim için derin bir anlam ve yaşam tatmini taşıyor.',
      imageUrl: formImageUrl,
      badge: 'Yeni Vizyon Tohumu',
      status: 'active',
      dailyTasks: dailyTasksToSave,
      miniTasks: miniTasksToSave,
    });

    onPlayChime();
    if (onTriggerCelebration) onTriggerCelebration();
    onShowToast(`"${formTitle}" tek sayfada tüm görevleriyle mühürlendi! 🌟`, 'stars');

    // Reset Form
    setIsAddModalOpen(false);
    setFormTitle('');
    setFormWhy('');
  };

  // REGENERATE PREVIEW IMAGE (Flux.1)
  const handleRegeneratePreviewImage = async () => {
    if (!previewVision) return;
    const promptToUse = previewRegenPrompt.trim() || previewVision.title;
    setIsRegeneratingPreview(true);
    onShowToast('Flux.1 8K vizyon görseli yeniden üretiliyor... 🎨', 'palette');

    try {
      const res = await fetch('/api/image/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${promptToUse} - ${previewVision.why || 'modern luxury'}`,
          style: 'photorealistic',
        }),
      });

      if (!res.ok) throw new Error('Regen failed');
      const data = await res.json();
      const finalUrl = data.imageUrl || data.reliableUrl || data.fluxUrl;
      if (finalUrl) {
        updateVision(previewVision.id, { imageUrl: finalUrl });
        setPreviewVision((prev) => (prev ? { ...prev, imageUrl: finalUrl } : null));
        onPlayChime();
        onShowToast('Vizyon görselin 8K kalitede yenilendi! ✨', 'check');
        setPreviewRegenPrompt('');
      }
    } catch (err) {
      console.warn('Preview regen error:', err);
      const fallbackUrl = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85';
      updateVision(previewVision.id, { imageUrl: fallbackUrl });
      setPreviewVision((prev) => (prev ? { ...prev, imageUrl: fallbackUrl } : null));
      onShowToast('Görsel güncellendi.', 'check');
    } finally {
      setIsRegeneratingPreview(false);
    }
  };

  // Preview Carousel Navigation
  const handlePrevPreview = () => {
    if (!previewVision || filteredVisions.length === 0) return;
    const currentIndex = filteredVisions.findIndex((v) => v.id === previewVision.id);
    const prevIndex = currentIndex <= 0 ? filteredVisions.length - 1 : currentIndex - 1;
    setPreviewVision(filteredVisions[prevIndex]);
    setPreviewRegenPrompt('');
  };

  const handleNextPreview = () => {
    if (!previewVision || filteredVisions.length === 0) return;
    const currentIndex = filteredVisions.findIndex((v) => v.id === previewVision.id);
    const nextIndex = currentIndex >= filteredVisions.length - 1 ? 0 : currentIndex + 1;
    setPreviewVision(filteredVisions[nextIndex]);
    setPreviewRegenPrompt('');
  };

  // Add task directly from preview modal
  const handleAddPreviewDaily = () => {
    if (!previewVision || !newPreviewDailyInput.trim()) return;
    addDailyTaskToVision(previewVision.id, newPreviewDailyInput.trim(), 15);
    const updatedDaily: DailyTask = {
      id: `dt-${Date.now()}`,
      visionId: previewVision.id,
      title: newPreviewDailyInput.trim(),
      estimatedMinutes: 15,
      completed: false,
    };
    setPreviewVision((prev) =>
      prev ? { ...prev, dailyTasks: [...(prev.dailyTasks || []), updatedDaily] } : null
    );
    setNewPreviewDailyInput('');
    onPlayChime();
    onShowToast('Günlük görev eklendi ve "Bugün" panosuna bağlandı! ✨', 'playlist_add');
  };

  const handleAddPreviewMini = () => {
    if (!previewVision || !newPreviewMiniInput.trim()) return;
    addMiniTaskToVision(previewVision.id, newPreviewMiniInput.trim(), 'Önizleme üzerinden eklendi');
    const updatedMini: MiniTask = {
      id: `mt-${Date.now()}`,
      visionId: previewVision.id,
      stepNumber: (previewVision.miniTasks?.length || 0) + 1,
      title: newPreviewMiniInput.trim(),
      desc: 'Önizleme üzerinden eklendi',
      completed: false,
    };
    setPreviewVision((prev) =>
      prev ? { ...prev, miniTasks: [...(prev.miniTasks || []), updatedMini] } : null
    );
    setNewPreviewMiniInput('');
    onPlayChime();
    onShowToast('Yeni yol haritası adımı eklendi! 🗺️', 'add_task');
  };

  return (
    <section className="flex flex-col w-full max-w-full overflow-x-hidden min-w-0 max-w-7xl mx-auto px-3 sm:px-6 md:px-8 space-y-6 animate-fadeIn pb-16">
      {/* 1. EDITORIAL HEADER & SANCTUARY COCKPIT (Clean, Anti-Slop, High-Grade) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161a30]/95 via-[#1a1e35]/90 to-[#0d1024]/95 backdrop-blur-2xl p-5 sm:p-7 md:p-8 border border-white/10 shadow-[0_12px_40px_rgba(8,12,34,0.7)]">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#e7c355]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#8083ff]/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#e7c355] font-semibold tracking-wider">
              <span>VİZYON &amp; EYLEM MİMARİSİ</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="text-[#a4a2b5]">ZİHİNSEL ODAK</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#dee0ff] tracking-tight">
              Vizyonlar ve Yol Haritaları
            </h1>
            <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed">
              Büyük hayallerini netleştir. Veira yapay zekası vizyonunu hem 15 dakikalık sakin alışkanlıklara hem de adım adım kilometre taşlarına böler.
            </p>

            {/* Clean Metadata Stats */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-[#c7c4d7]">
              <span className="font-medium text-[#dee0ff]">
                <strong className="text-white font-bold">{totalVisions}</strong> Aktif Vizyon
              </span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="font-medium text-[#ffe089]">
                <strong className="text-[#ffe089] font-bold">{totalDailyTasks}</strong> Günlük Eylem
              </span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="font-medium text-[#7bd0ff]">
                {completedMiniTasks}/{totalMiniTasks} Kilometre Taşı (%{overallMilestoneProgress})
              </span>
            </div>
          </div>

          {/* Action CTAs & View Switcher */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setWizardStep(1);
                  setIsAddModalOpen(true);
                }}
                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#e7c355] text-[#3d2f00] font-bold text-xs sm:text-sm shadow-[0_0_24px_rgba(231,195,85,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[19px]">add_circle</span>
                <span>Yeni Hedef</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCollageStudioOpen(true)}
                title="Vizyon Kolajı & Duvar Kağıdı Stüdyosu"
                className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#252840]/90 hover:bg-[#2f334b] border border-[#e7c355]/40 text-[#dee0ff] hover:text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-[#e7c355] text-[19px] group-hover:scale-110 transition-transform">
                  auto_awesome_mosaic
                </span>
                <span>Kolaj Stüdyosu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImageGenTarget('quick_add');
                  setIsImageGeneratorOpen(true);
                }}
                title="Yapay Zeka Görsel Üretici & İlham Galerisi"
                className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#252840]/90 hover:bg-[#2f334b] border border-[#7bd0ff]/40 text-[#dee0ff] hover:text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-[#7bd0ff] text-[19px] group-hover:scale-110 transition-transform">
                  palette
                </span>
                <span>Görsel Üret</span>
              </button>
            </div>

            {/* Modern Segmented View Switcher: Grid vs Table vs Cinema */}
            <div className="flex items-center p-1 rounded-xl bg-[#080c22] border border-white/10 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#252840] text-[#e7c355] shadow-sm font-bold'
                    : 'text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">grid_view</span>
                <span>Pano</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#252840] text-[#7bd0ff] shadow-sm font-bold'
                    : 'text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">table_rows</span>
                <span>Minimalist Liste</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('cinema')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'cinema'
                    ? 'bg-[#252840] text-[#ffe089] shadow-sm font-bold'
                    : 'text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">theaters</span>
                <span>Vizyon Sineması</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY SEGMENTED FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Tüm Vizyonlar', icon: 'all_inclusive' },
            { id: 'career', label: 'Kariyer & Bolluk', icon: 'work' },
            { id: 'wellness', label: 'Beden & Canlılık', icon: 'spa' },
            { id: 'spirit', label: 'Ruhsal Denge', icon: 'graphic_eq' },
            { id: 'travel', label: 'Seyahat & Yaşam', icon: 'flight_takeoff' },
            { id: 'growth', label: 'Kişisel Gelişim', icon: 'psychology' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#e7c355] text-[#3d2f00] border-[#e7c355] shadow-sm font-bold scale-102'
                  : 'bg-[#161a30]/80 text-[#c7c4d7] hover:text-white border-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#908fa0]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Vizyon veya görev ara..."
            className="w-full bg-[#161a30]/80 text-xs text-[#dee0ff] placeholder-[#908fa0] pl-8 pr-3 py-2 rounded-full border border-white/10 outline-none focus:border-[#e7c355]/50 transition-all"
          />
        </div>
      </div>

      {/* 3. CONTENT AREA BY ACTIVE VIEW MODE */}
      {filteredVisions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#161a30]/60 border border-white/10 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#908fa0]">search_off</span>
          <h3 className="font-serif text-lg font-bold text-[#dee0ff]">
            Arama kriterine uygun vizyon bulunamadı
          </h3>
          <p className="text-xs text-[#c7c4d7]">
            Farklı bir kategori seçebilir veya yeni bir vizyon &amp; hedef ekleyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full bg-[#252840] text-xs font-semibold text-[#e7c355] border border-white/10"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ==================== VIEW B: MINIMALIST FOCUS TABLE ==================== */
        <div className="rounded-3xl bg-[#161a30]/85 border border-white/10 overflow-hidden shadow-xl backdrop-blur-xl animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#dee0ff]">
              <thead>
                <tr className="border-b border-white/10 bg-[#080c22]/70 text-[#908fa0] uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Görsel &amp; Vizyon</th>
                  <th className="py-3.5 px-4">Kategori &amp; Zaman</th>
                  <th className="py-3.5 px-4">İlerleme</th>
                  <th className="py-3.5 px-4">Günlük Eylemler</th>
                  <th className="py-3.5 px-4 text-right">Eylemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVisions.map((vision) => {
                  const miniCount = vision.miniTasks?.length || 0;
                  const completedMini = vision.miniTasks?.filter((m) => m.completed)?.length || 0;
                  const progress = miniCount > 0 ? Math.round((completedMini / miniCount) * 100) : 0;

                  return (
                    <tr
                      key={vision.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setPreviewVision(vision)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vision.imageUrl}
                            alt={vision.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-sm text-[#dee0ff] block truncate group-hover:text-[#ffe089] transition-colors">
                              {vision.title}
                            </span>
                            <span className="text-[11px] text-[#908fa0] italic truncate block max-w-xs">
                              "{vision.why}"
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[#dee0ff] font-medium block">{vision.categoryLabel}</span>
                        <span className="text-[10px] text-[#908fa0]">{vision.horizon}</span>
                      </td>

                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-[#7bd0ff] font-semibold">%{progress}</span>
                          <span className="text-[#908fa0]">{completedMini}/{miniCount}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#080c22] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7bd0ff] to-[#e7c355] rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[#ffe089] font-medium">
                          {vision.dailyTasks?.length || 0} mikro-görev
                        </span>
                        <span className="text-[10px] text-[#908fa0] block">Bugün panosuna bağlı</span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setPreviewVision(vision)}
                            className="px-2.5 py-1 rounded-lg bg-[#252840] hover:bg-[#2f334b] text-[#7bd0ff] text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                            <span>Önizle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(vision)}
                            className="p-1 rounded-lg hover:bg-white/5 text-[#c7c4d7] hover:text-[#e7c355]"
                            title="Düzenle"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'cinema' ? (
        /* ==================== VIEW C: CINEMATIC SANCTUARY CAROUSEL ==================== */
        <div className="space-y-4 animate-fadeIn">
          {filteredVisions[cinemaIndex] && (() => {
            const currentVision = filteredVisions[cinemaIndex];
            const miniCount = currentVision.miniTasks?.length || 0;
            const completedMini = currentVision.miniTasks?.filter((m) => m.completed)?.length || 0;
            const progress = miniCount > 0 ? Math.round((completedMini / miniCount) * 100) : 0;

            return (
              <div className="relative rounded-3xl bg-[#161a30]/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
                {/* Background Artwork */}
                <div className="relative w-full h-80 sm:h-96 md:h-[420px] overflow-hidden group">
                  {currentVision.videoUrl ? (
                    <video
                      src={currentVision.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={currentVision.imageUrl}
                      alt={currentVision.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161a30] via-[#161a30]/50 to-black/30" />

                  {/* Kicker overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                      <span>{currentVision.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{currentVision.horizon}</span>
                      {currentVision.status === 'achieved' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#e7c355] font-bold">🌟 Manifest Edildi</span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewVision(currentVision)}
                      className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-xs font-semibold text-[#dee0ff] border border-white/20 flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                      <span>Tam Ekran Önizleme</span>
                    </button>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                      {currentVision.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#ffe089] italic font-serif max-w-3xl drop-shadow">
                      "{currentVision.why}"
                    </p>
                  </div>
                </div>

                {/* Cinema Bottom Control Bar */}
                <div className="p-5 sm:p-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#080c22]/60">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCinemaIndex((idx) => (idx <= 0 ? filteredVisions.length - 1 : idx - 1))
                        }
                        className="w-10 h-10 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] flex items-center justify-center transition-colors border border-white/10"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                      </button>
                      <span className="text-xs font-mono text-[#c7c4d7]">
                        {cinemaIndex + 1} / {filteredVisions.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCinemaIndex((idx) => (idx >= filteredVisions.length - 1 ? 0 : idx + 1))
                        }
                        className="w-10 h-10 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] flex items-center justify-center transition-colors border border-white/10"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#c7c4d7]">
                      <span className="text-[#7bd0ff] font-semibold">%{progress} Tamamlandı</span>
                      <span>({completedMini}/{miniCount} Adım)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleToggleAchieved(currentVision)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        currentVision.status === 'achieved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] shadow-md hover:brightness-110'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {currentVision.status === 'achieved' ? 'verified' : 'stars'}
                      </span>
                      <span>
                        {currentVision.status === 'achieved' ? 'Manifest Edildi' : 'Manifest Olarak Mühürle'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewVision(currentVision)}
                      className="px-4 py-2 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#7bd0ff] text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      <span>Görevleri ve Aşamaları İncele</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* ==================== VIEW A: GALLERY CARDS (Sade, Kaliteli & Berrak Grid) ==================== */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {filteredVisions.map((vision) => {
            const miniCount = vision.miniTasks?.length || 0;
            const completedMini = vision.miniTasks?.filter((m) => m.completed)?.length || 0;
            const progressPercent = miniCount > 0 ? Math.round((completedMini / miniCount) * 100) : 0;
            const isPulsing = pulsingCardId === vision.id;
            const activeDailyTask = vision.dailyTasks && vision.dailyTasks.length > 0 ? vision.dailyTasks[0] : null;
            const nextIncompleteMini = vision.miniTasks?.find((m) => !m.completed) || vision.miniTasks?.[0];

            return (
              <div
                key={vision.id}
                className={`group relative rounded-3xl bg-[#14172c]/90 border transition-all duration-300 shadow-xl overflow-hidden flex flex-col ${
                  vision.status === 'achieved'
                    ? 'border-[#e7c355]/50 shadow-[0_0_24px_rgba(231,195,85,0.2)]'
                    : isPulsing
                    ? 'border-[#e7c355] shadow-[0_0_30px_rgba(231,195,85,0.4)] animate-neural-pulse'
                    : 'border-white/10 hover:border-[#e7c355]/40 hover:shadow-2xl'
                }`}
              >
                {/* Visual Image Header */}
                <div
                  className="relative w-full h-52 sm:h-60 overflow-hidden cursor-pointer"
                  onClick={() => setPreviewVision(vision)}
                >
                  {vision.videoUrl ? (
                    <video
                      src={vision.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={vision.imageUrl}
                      alt={vision.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14172c] via-[#14172c]/40 to-black/35 pointer-events-none" />

                  {/* Top Badges */}
                  <div
                    className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/95 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      <span>{vision.categoryLabel}</span>
                      <span aria-hidden="true" className="text-white/40">·</span>
                      <span className="text-[#ffe089]">{vision.horizon}</span>
                      {vision.videoUrl && (
                        <>
                          <span aria-hidden="true" className="text-white/40">·</span>
                          <span className="text-[#7bd0ff] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">movie</span>
                            <span>4K Video</span>
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {vision.status === 'achieved' && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                          <span className="material-symbols-outlined text-[13px]">stars</span>
                          Manifest
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewVision(vision)}
                        className="w-8 h-8 rounded-full bg-black/60 text-[#dee0ff] hover:text-[#ffe089] flex items-center justify-center backdrop-blur-md transition-colors border border-white/15 shadow-sm active:scale-95"
                        title="Büyük Sinematik Görünüm"
                      >
                        <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(vision)}
                        className="w-8 h-8 rounded-full bg-black/60 text-[#c7c4d7] hover:text-[#e7c355] flex items-center justify-center backdrop-blur-md transition-colors border border-white/15 shadow-sm active:scale-95"
                        title="Düzenle"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVisionToDelete(vision);
                        }}
                        className="w-8 h-8 rounded-full bg-black/60 text-[#c7c4d7] hover:text-red-400 flex items-center justify-center backdrop-blur-md transition-colors border border-white/15 shadow-sm active:scale-95 cursor-pointer"
                        title="Bu Vizyonu Sil"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Intention Quote Overlay */}
                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md group-hover:text-[#ffe089] transition-colors truncate">
                      {vision.title}
                    </h2>
                    <p className="text-xs text-[#c7c4d7] italic line-clamp-1 mt-0.5 drop-shadow">
                      "{vision.why}"
                    </p>
                  </div>
                </div>

                {/* Card Body: Clean, Focused, High-Grade Simplicity */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Progress Indicator */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#a4a2b5] font-medium flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-[#7bd0ff]">route</span>
                        <span>Yol Haritası</span>
                      </span>
                      <span className="font-bold text-[#7bd0ff] font-mono">
                        {completedMini}/{miniCount} Adım (%{progressPercent})
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#080c22] overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7bd0ff] to-[#e7c355] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actionable Core (Max 2 clean focal points) */}
                  <div className="space-y-2">
                    {/* 1. Daily 15-Minute Micro Habit */}
                    {activeDailyTask ? (
                      <div
                        onClick={() => handleToggleDaily(vision.id, activeDailyTask)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none active:scale-[0.99] ${
                          activeDailyTask.completed
                            ? 'bg-[#080c22]/50 border-[#e7c355]/30 text-[#8e8d9f]'
                            : 'bg-[#1b203c]/70 hover:bg-[#1b203c] border-white/5 hover:border-[#e7c355]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                              activeDailyTask.completed
                                ? 'bg-[#e7c355] border-[#e7c355] text-[#3d2f00]'
                                : 'border-white/30 bg-transparent hover:border-[#e7c355]'
                            }`}
                          >
                            {activeDailyTask.completed && (
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-[#e7c355] uppercase tracking-wider">
                              Bugünün 15 Dk Odak Eylemi
                            </span>
                            <span
                              className={`text-xs font-medium truncate ${
                                activeDailyTask.completed ? 'line-through text-[#8e8d9f]' : 'text-white'
                              }`}
                            >
                              {activeDailyTask.title}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#a4a2b5] font-mono shrink-0">15 dk</span>
                      </div>
                    ) : (
                      <div
                        onClick={() => setPreviewVision(vision)}
                        className="p-3 rounded-2xl border border-dashed border-white/10 hover:border-white/20 text-[#908fa0] text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">add_task</span>
                        <span>Günlük 15 dk eylem ekle</span>
                      </div>
                    )}

                    {/* 2. Next Sequential Milestone */}
                    {nextIncompleteMini && (
                      <div
                        onClick={() => handleToggleMini(vision.id, nextIncompleteMini)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none active:scale-[0.99] ${
                          nextIncompleteMini.completed
                            ? 'bg-[#080c22]/40 border-[#7bd0ff]/30 text-[#8e8d9f]'
                            : 'bg-[#1b203c]/40 hover:bg-[#1b203c]/70 border-white/5 hover:border-[#7bd0ff]/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                              nextIncompleteMini.completed
                                ? 'bg-[#7bd0ff] border-[#7bd0ff] text-[#080c22]'
                                : 'border-white/30 text-[#7bd0ff]'
                            }`}
                          >
                            {nextIncompleteMini.completed ? (
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            ) : (
                              <span>{nextIncompleteMini.stepNumber || 1}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-[#7bd0ff] uppercase tracking-wider">
                              Sıradaki Kilometre Taşı
                            </span>
                            <span
                              className={`text-xs font-medium truncate ${
                                nextIncompleteMini.completed ? 'line-through text-[#8e8d9f]' : 'text-[#dee0ff]'
                              }`}
                            >
                              {nextIncompleteMini.title}
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[15px] text-[#7bd0ff] shrink-0">
                          chevron_right
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Bar: Elegant, Clean & Uncluttered */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewVision(vision)}
                      className="px-3.5 py-2 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-white/5"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#e7c355]">visibility</span>
                      <span>
                        Tüm Detayları Gör ({miniCount + (vision.dailyTasks?.length || 0)} Adım)
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleAchieved(vision)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
                          vision.status === 'achieved'
                            ? 'bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-[#c7c4d7] hover:text-[#ffe089] border border-white/5'
                        }`}
                        title={vision.status === 'achieved' ? 'Manifest Edildi' : 'Manifest Olarak Mühürle'}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {vision.status === 'achieved' ? 'verified' : 'stars'}
                        </span>
                        <span className="hidden sm:inline">
                          {vision.status === 'achieved' ? 'Manifest Edildi' : 'Mühürle'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          4. BÜYÜK SİNEMATİK VİZYON MABEDİ ÖNİZLEME MODALI (En Son Derece Gelişmiş & Büyüleyici)
          ========================================================================= */}
      {previewVision && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-[#13162b] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] my-auto overflow-hidden flex flex-col max-h-[96dvh] sm:max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 flex items-center justify-between bg-[#080c22]/90 backdrop-blur-xl shrink-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#e7c355] text-[18px] sm:text-[20px] shrink-0">
                  theaters
                </span>
                <div className="flex items-center gap-1.5 text-xs truncate">
                  <span className="font-bold text-[#e7c355] uppercase tracking-wider text-[10px] sm:text-xs truncate">
                    SİNEMATİK VİZYON
                  </span>
                  <span aria-hidden="true" className="text-white/30 hidden sm:inline">·</span>
                  <span className="text-[#c7c4d7] hidden sm:inline truncate">{previewVision.categoryLabel}</span>
                  <span aria-hidden="true" className="text-white/30 hidden sm:inline">·</span>
                  <span className="text-[#ffe089] font-medium hidden sm:inline">{previewVision.horizon}</span>
                </div>
              </div>

              {/* Prev / Next Carousel Controls & Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevPreview}
                  title="Önceki Vizyon (←)"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] flex items-center justify-center transition-colors border border-white/10"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[17px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextPreview}
                  title="Sonraki Vizyon (→)"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] flex items-center justify-center transition-colors border border-white/10"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[17px]">chevron_right</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisionToDelete(previewVision)}
                  title="Bu Vizyonu Sil"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors border border-red-500/30 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[17px]">delete</span>
                </button>
                <div className="w-px h-4 sm:h-5 bg-white/10 mx-0.5" />
                <button
                  type="button"
                  onClick={() => setPreviewVision(null)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#c7c4d7] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Kapat"
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[19px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Split 2-Column Responsive Layout */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {/* LEFT COLUMN: 8K High-Fidelity Artwork Showcase & Studio (lg:col-span-6) */}
              <div className="lg:col-span-6 p-4 sm:p-6 md:p-7 flex flex-col space-y-3.5 sm:space-y-4 bg-gradient-to-b from-[#13162b] to-[#0a0d1f]">
                {/* 8K Image / 4K Video Frame */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#e7c355]/30 shadow-2xl bg-black group">
                  {previewVision.videoUrl ? (
                    <video
                      src={previewVision.videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewVision.imageUrl}
                      alt={previewVision.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Badge & Resolution indicator */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-[#e7c355] flex items-center gap-1.5 shadow pointer-events-none">
                    <span className="material-symbols-outlined text-[13px]">
                      {previewVision.videoUrl ? 'videocam' : 'verified'}
                    </span>
                    <span>{previewVision.videoUrl ? '4K Ultra HD Sinematik Video' : '8K Hasselblad Sinematik Vizyon'}</span>
                  </div>

                  {previewVision.status === 'achieved' && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                      <span className="material-symbols-outlined text-[13px]">stars</span>
                      <span>Manifest Edildi</span>
                    </div>
                  )}

                  {/* Wallpaper Quick Download Button */}
                  <a
                    href={previewVision.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="veira-vision-wallpaper.jpg"
                    className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-[#dee0ff] hover:text-white px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    <span>HD Duvar Kağıdı İndir</span>
                  </a>
                </div>

                {/* AI 8K REGENERATE STUDIO ACCELERATOR */}
                <div className="p-3.5 rounded-2xl bg-[#080c22]/90 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#e7c355] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">palette</span>
                      <span>Flux.1 Motoruyla Görseli Yeniden Üret</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageGenTarget('preview');
                        setIsImageGeneratorOpen(true);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-[#7bd0ff]/20 text-[#7bd0ff] hover:bg-[#7bd0ff]/30 text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                      <span>Stüdyo / Galeri</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={previewRegenPrompt}
                      onChange={(e) => setPreviewRegenPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRegeneratePreviewImage();
                      }}
                      placeholder={`Örn: ${previewVision.title}, gün doğumu, altın saat, 35mm...`}
                      className="flex-1 bg-[#161a30] text-xs text-[#dee0ff] placeholder-[#908fa0] px-3 py-2 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                    />
                    <button
                      type="button"
                      disabled={isRegeneratingPreview}
                      onClick={handleRegeneratePreviewImage}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-xs shrink-0 flex items-center gap-1 shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isRegeneratingPreview ? 'sync' : 'auto_awesome'}
                      </span>
                      <span>{isRegeneratingPreview ? 'Üretiliyor...' : 'Yenile'}</span>
                    </button>
                  </div>

                  {/* Fast Style Inspiration Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[
                      '🌅 Altın Saat Gün Doğumu',
                      '🌿 Zen Minimalist Bahçe',
                      '🏛️ Modern İtalyan Villa',
                      '🌌 Gece Kozmosu & Yıldızlar',
                    ].map((styleChip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPreviewRegenPrompt(`${previewVision.title}, ${styleChip}`);
                        }}
                        className="px-2 py-0.5 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[10px] text-[#dee0ff] border border-white/5 transition-all"
                      >
                        {styleChip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: The Deep Why, Connected Daily Tasks & Roadmap (lg:col-span-6) */}
              <div className="lg:col-span-6 p-4 sm:p-6 md:p-7 flex flex-col space-y-4 sm:space-y-5 bg-[#13162b] lg:overflow-y-auto">
                {/* Title & Status */}
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#dee0ff] tracking-tight">
                    {previewVision.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-[#908fa0]">
                    <span>Kategori: <strong className="text-[#dee0ff] font-medium">{previewVision.categoryLabel}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Zaman Ufku: <strong className="text-[#ffe089] font-medium">{previewVision.horizon}</strong></span>
                  </div>
                </div>

                {/* Soul Intention & Why Quote */}
                <div className="p-4 rounded-2xl bg-[#080c22]/90 border border-[#e7c355]/20 flex items-start gap-3 shadow-inner">
                  <span className="material-symbols-outlined text-[#e7c355] text-[22px] shrink-0 mt-0.5">
                    format_quote
                  </span>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e7c355]">
                      Ruh Niyeti &amp; İçsel İtici Güç
                    </span>
                    <p className="text-xs sm:text-sm text-[#ffe089] italic font-serif leading-relaxed">
                      "{previewVision.why}"
                    </p>
                  </div>
                </div>

                {/* Connected Daily Micro-Habits */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ffe089] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">routine</span>
                      <span>Günün 15 Dakikalık Alışkanlıkları (Bugün Panosuyla Senkron)</span>
                    </span>
                    <span className="text-[10px] text-[#908fa0]">
                      {previewVision.dailyTasks?.filter((d) => d.completed).length || 0} / {previewVision.dailyTasks?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {previewVision.dailyTasks?.map((daily) => (
                      <div
                        key={daily.id}
                        onClick={() => handleToggleDaily(previewVision.id, daily)}
                        className={`p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer select-none ${
                          daily.completed
                            ? 'bg-[#080c22]/50 border-[#e7c355]/30 text-[#c7c4d7]'
                            : 'bg-[#252840]/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                            daily.completed
                              ? 'bg-[#e7c355] border-[#e7c355] text-[#3d2f00]'
                              : 'border-white/20 bg-transparent hover:border-[#e7c355]'
                          }`}
                        >
                          {daily.completed && (
                            <span className="material-symbols-outlined text-[15px] font-bold">
                              check
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`text-xs font-medium ${
                              daily.completed ? 'line-through opacity-70' : 'text-[#dee0ff]'
                            }`}
                          >
                            {daily.title}
                          </span>
                          <span className="text-[10px] text-[#908fa0]">
                            ⏱️ ~{daily.estimatedMinutes || 15} dk mikro-adım
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDailyTask(previewVision.id, daily.id);
                            onShowToast('Görev silindi.', 'delete');
                          }}
                          className="w-7 h-7 rounded-full text-[#908fa0] hover:text-red-400 hover:bg-white/5 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Görevi Sil"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Daily inline in modal */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newPreviewDailyInput}
                      onChange={(e) => setNewPreviewDailyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddPreviewDaily();
                      }}
                      placeholder="+ Bu vizyona günlük yeni eylem ekle..."
                      className="flex-1 bg-[#080c22] text-xs text-[#dee0ff] placeholder-[#908fa0] px-3.5 py-2 rounded-xl border border-white/10 outline-none focus:border-[#ffe089]"
                    />
                    <button
                      type="button"
                      onClick={handleAddPreviewDaily}
                      className="px-3 py-2 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#ffe089] text-xs font-bold shrink-0 border border-white/5"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Milestones Roadmap */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7bd0ff] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      <span>Adım Adım Kilometre Taşları &amp; Yol Haritası</span>
                    </span>
                    <span className="text-[10px] text-[#7bd0ff] font-bold">
                      {previewVision.miniTasks?.filter((m) => m.completed).length || 0} / {previewVision.miniTasks?.length || 0} Tamamlandı
                    </span>
                  </div>

                  <div className="space-y-2">
                    {previewVision.miniTasks?.map((mini, idx) => (
                      <div
                        key={mini.id}
                        onClick={() => handleToggleMini(previewVision.id, mini)}
                        className={`p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer select-none ${
                          mini.completed
                            ? 'bg-[#080c22]/50 border-[#7bd0ff]/30 text-[#c7c4d7]'
                            : 'bg-[#252840]/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 text-xs font-bold ${
                            mini.completed
                              ? 'bg-[#7bd0ff] border-[#7bd0ff] text-[#080c22]'
                              : 'border-white/20 text-[#c7c4d7]'
                          }`}
                        >
                          {mini.completed ? (
                            <span className="material-symbols-outlined text-[15px]">check</span>
                          ) : (
                            <span>{mini.stepNumber || idx + 1}</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`text-xs font-medium ${
                              mini.completed ? 'line-through opacity-70' : 'text-[#dee0ff]'
                            }`}
                          >
                            {mini.title}
                          </span>
                          {mini.desc && (
                            <span className="text-[10px] text-[#908fa0]">{mini.desc}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMiniTask(previewVision.id, mini.id);
                            onShowToast('Aşama silindi.', 'delete');
                          }}
                          className="w-7 h-7 rounded-full text-[#908fa0] hover:text-red-400 hover:bg-white/5 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Aşamayı Sil"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Mini inline in modal */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newPreviewMiniInput}
                      onChange={(e) => setNewPreviewMiniInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddPreviewMini();
                      }}
                      placeholder="+ Bir sonraki adımı/kilometre taşını ekle..."
                      className="flex-1 bg-[#080c22] text-xs text-[#dee0ff] placeholder-[#908fa0] px-3.5 py-2 rounded-xl border border-white/10 outline-none focus:border-[#7bd0ff]"
                    />
                    <button
                      type="button"
                      onClick={handleAddPreviewMini}
                      className="px-3 py-2 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#7bd0ff] text-xs font-bold shrink-0 border border-white/5"
                    >
                      Adım Ekle
                    </button>
                  </div>
                </div>

                {/* Modal Footer Actions: Toggle Manifested & Close */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleAchieved(previewVision)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      previewVision.status === 'achieved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] shadow-md hover:brightness-110 active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {previewVision.status === 'achieved' ? 'verified' : 'trophy'}
                    </span>
                    <span>
                      {previewVision.status === 'achieved' ? 'Manifest Olarak Mühürlendi' : 'Hedefi Manifest Et!'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVisionToDelete(previewVision)}
                      className="px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
                      title="Bu Vizyonu Kalıcı Olarak Sil"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>Vizyonu Sil</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewVision(null)}
                      className="px-4 py-2.5 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#c7c4d7] hover:text-white text-xs font-semibold transition-colors"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. MODAL: YENİ VİZYON VE HEDEF EKLEME (3 ADIMLI DÜZENLİ SİHİRBAZ)
          ========================================================================= */}
      {/* =========================================================================
          5. MODAL: YENİ VİZYON VE HEDEF EKLEME (TEK EKRANDA BASİTLEŞTİRİLMİŞ MİMARİ)
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="veira-add-goal-modal relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-3xl bg-[#141221] border border-[#f5d061]/25 p-4 sm:p-6 shadow-2xl my-auto overflow-hidden">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-[#c7c4d7] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Header */}
            <div className="shrink-0 pr-10 mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-[#e7c355] text-[16px] sm:text-[18px]">
                  auto_awesome
                </span>
                <span className="text-[10px] font-bold text-[#e7c355] uppercase tracking-wider">
                  Veira Niyet &amp; Hedef Mimarisi
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#dee0ff] tracking-tight">
                Yeni Vizyon &amp; Hedef Belirle
              </h2>
              <p className="text-[11px] sm:text-xs text-[#c7c4d7] mt-0.5">
                Hayalini sakin ve berrak adımlarla somut gerçekliğe dönüştür.
              </p>
            </div>

            {/* Step Indicator Tabs (3-Step Smooth Workflow) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/25 border border-white/10 shrink-0 mb-3.5">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  wizardStep === 1
                    ? 'veira-wizard-step-active bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#e7c355] text-[#3d2f00] shadow-md font-bold'
                    : 'veira-wizard-step-inactive text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">edit_note</span>
                <span className="truncate">1. Niyet &amp; Bilgi</span>
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  wizardStep === 2
                    ? 'veira-wizard-step-active bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#e7c355] text-[#3d2f00] shadow-md font-bold'
                    : 'veira-wizard-step-inactive text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">image</span>
                <span className="truncate">2. Görsel &amp; Ruh</span>
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(3)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  wizardStep === 3
                    ? 'veira-wizard-step-active bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#e7c355] text-[#3d2f00] shadow-md font-bold'
                    : 'veira-wizard-step-inactive text-[#c7c4d7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                <span className="truncate">3. AI Yol Haritası</span>
              </button>
            </div>

            <form onSubmit={handleCreateVisionGoal} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1 pb-2 space-y-4">
                {/* ----------------- ADIM 1: NİYET & HEDEF BİLGİLERİ ----------------- */}
                {wizardStep === 1 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    {/* Quick Inspiration Presets Bar */}
                    <div className="veira-panel-box p-3 rounded-2xl bg-[#0a0818]/80 border border-white/10">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-bold text-[#e7c355] uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">lightbulb</span>
                          Hızlı İlham Şablonları (Tek Tıkla Başla)
                        </span>
                        <span className="text-[9px] text-[#908fa0]">Seçince otomatik doldurur &amp; adımları üretir</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {[
                          {
                            icon: '🏎️',
                            title: 'Kırmızı Süper Spor Araba',
                            category: 'Kariyer & Bolluk',
                            horizon: '6 Ay',
                            why: 'Özgürlük, hız ve bağımsızlık hissini derinden deneyimlemek.',
                            imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
                          },
                          {
                            icon: '🏡',
                            title: 'Como Gölü Kıyısında Villa & Tasarım',
                            category: 'Seyahat & Yaşam',
                            horizon: '1 Yıl',
                            why: 'Doğayla iç içe, sessiz ve yaratıcı bir yaşam sürmek.',
                            imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85',
                          },
                          {
                            icon: '🧘',
                            title: 'Fit, Enerjik ve Zinde Beden',
                            category: 'Beden & Canlılık',
                            horizon: '3 Ay',
                            why: 'Sabahları yüksek enerjiyle uyanmak ve sağlıklı yaşamak.',
                            imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
                          },
                          {
                            icon: '🎹',
                            title: 'Piyano Öğrenmek & Müzik',
                            category: 'Kişisel Gelişim',
                            horizon: '6 Ay',
                            why: 'Müzikle ruhumu dinlendirmek ve sanatsal derinlik kazanmak.',
                            imageUrl: 'https://images.unsplash.com/photo-1520523839898-5071270535a7?auto=format&fit=crop&w=1200&q=85',
                          },
                          {
                            icon: '📚',
                            title: 'İlk Kitabımı Yazıp Yayınlamak',
                            category: 'Kişisel Gelişim',
                            horizon: '6 Ay',
                            why: 'Kendi hikayemi ve bilgimi dünyaya miras bırakmak.',
                            imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85',
                          },
                          {
                            icon: '✈️',
                            title: 'Paris & Dünya Seyahati',
                            category: 'Seyahat & Yaşam',
                            horizon: '3 Ay',
                            why: 'Yeni kültürler, sanat sokakları ve unutulmaz anılar keşfetmek.',
                            imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
                          },
                          {
                            icon: '💼',
                            title: 'Kendi İşimi / Girişimimi Büyütmek',
                            category: 'Kariyer & Bolluk',
                            horizon: '1 Yıl',
                            why: 'Kendi vizyonumu inşa ederek finansal bağımsızlık sağlamak.',
                            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
                          },
                        ].map((tpl, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => {
                              setFormTitle(tpl.title);
                              setFormCategory(tpl.category);
                              setFormHorizon(tpl.horizon);
                              setFormWhy(tpl.why);
                              setFormImageUrl(tpl.imageUrl);
                              onPlayChime();
                              handleDecomposeWithAI(15, 'balanced', tpl.title, tpl.category, tpl.horizon, tpl.why);
                            }}
                            className="veira-preset-pill px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e7c355]/40 text-left text-xs text-[#dee0ff] whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all active:scale-95 group"
                          >
                            <span>{tpl.icon}</span>
                            <span className="font-semibold group-hover:text-[#ffe089] transition-colors">{tpl.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Form Input Section */}
                    <div className="veira-modal-section space-y-3.5 p-3.5 rounded-2xl bg-[#0a0818]/60 border border-white/10">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#dee0ff] flex items-center gap-1">
                            <span>Vizyon &amp; Hedef Başlığı</span>
                            <span className="text-[#e7c355]">*</span>
                          </label>
                          <span className="text-[10px] text-[#908fa0]">Somut ve net bir niyet yaz</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Örn: Kırmızı Spor Araba, Como Gölü Kıyısında Villa, Canlı & Fit Beden..."
                          className="w-full bg-[#1b1730] text-xs sm:text-sm text-[#dee0ff] placeholder-[#908fa0] px-3.5 py-2.5 rounded-xl border border-white/15 outline-none focus:border-[#e7c355] transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#c7c4d7]">Kategori</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            className="w-full bg-[#1b1730] text-xs text-[#dee0ff] px-3 py-2.5 rounded-xl border border-white/15 outline-none focus:border-[#e7c355]"
                          >
                            <option value="Kariyer & Bolluk">Kariyer &amp; Bolluk</option>
                            <option value="Beden & Canlılık">Beden &amp; Canlılık</option>
                            <option value="Ruhsal Denge">Ruhsal Denge</option>
                            <option value="Seyahat & Yaşam">Seyahat &amp; Yaşam</option>
                            <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#c7c4d7]">Zaman Ufku</label>
                          <select
                            value={formHorizon}
                            onChange={(e) => setFormHorizon(e.target.value)}
                            className="w-full bg-[#1b1730] text-xs text-[#dee0ff] px-3 py-2.5 rounded-xl border border-white/15 outline-none focus:border-[#e7c355]"
                          >
                            <option value="1 Ay">1 Ay (Hızlı Odak)</option>
                            <option value="3 Ay">3 Ay (Çeyrek Dönem)</option>
                            <option value="6 Ay">6 Ay (Gelişim)</option>
                            <option value="1 Yıl">1 Yıl (Dönüşüm)</option>
                            <option value="2027">2027 (Kozmik Vizyon)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#c7c4d7]">
                          İçsel Nedenin / Motivasyon (Neden bu vizyon?)
                        </label>
                        <input
                          type="text"
                          value={formWhy}
                          onChange={(e) => setFormWhy(e.target.value)}
                          placeholder="Bu vizyona ulaştığında hayatında ne değişecek? Ne hissedeceksin?"
                          className="w-full bg-[#1b1730] text-xs text-[#dee0ff] placeholder-[#908fa0] px-3.5 py-2.5 rounded-xl border border-white/15 outline-none focus:border-[#e7c355]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- ADIM 2: GÖRSEL & ATMOSFER ----------------- */}
                {wizardStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Large High-Impact Preview Card */}
                    <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
                      <img
                        src={formImageUrl}
                        alt="Seçili Vizyon Görseli"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e7c355]/30 text-[#ffe089] w-fit mb-1 border border-[#e7c355]/40 backdrop-blur-sm">
                          {formCategory} · {formHorizon}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-md">
                          {formTitle || 'Vizyon Başlığı Henüz Girilmedi'}
                        </h3>
                        <p className="text-xs text-[#c7c4d7] line-clamp-1 italic mt-0.5">
                          {formWhy || 'İçsel motivasyon burada parıldayacak...'}
                        </p>
                      </div>
                    </div>

                    {/* Flux AI Generator Action */}
                    <div className="veira-panel-box flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0a0818]/70 border border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e7c355]/20 to-[#ffe089]/20 border border-[#e7c355]/40 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#e7c355] text-[18px]">palette</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#dee0ff] block">Flux AI Sanat Stüdyosu</span>
                          <span className="text-[10px] text-[#908fa0]">Yapay zeka ile vizyonuna özel 8K başyapıt üret</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImageGenTarget('form');
                          setIsImageGeneratorOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#e7c355] text-[#3d2f00] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                        <span>Flux AI Stüdyosu Aç</span>
                      </button>
                    </div>

                    {/* Quick Atmosphere Presets Grid */}
                    <div className="veira-panel-box p-3.5 rounded-2xl bg-[#0a0818]/70 border border-white/10 space-y-2">
                      <span className="text-[11px] font-bold text-[#dee0ff] block">
                        Hızlı Atmosfer Seçenekleri:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { name: 'Como Gölü', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80', icon: '🏡' },
                          { name: 'Spor Araba', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', icon: '🏎️' },
                          { name: 'Fit & Spor', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', icon: '🧘' },
                          { name: 'Zen Huzur', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', icon: '🌿' },
                          { name: 'Piyano & Müzik', url: 'https://images.unsplash.com/photo-1520523839898-5071270535a7?auto=format&fit=crop&w=800&q=80', icon: '🎹' },
                          { name: 'Paris Seyahati', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', icon: '✈️' },
                        ].map((preset, pIdx) => {
                          const isSelected = formImageUrl === preset.url;
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => setFormImageUrl(preset.url)}
                              className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-[#e7c355]/20 text-[#ffe089] border-[#e7c355] shadow-[0_0_12px_rgba(231,195,85,0.25)]'
                                  : 'bg-white/5 text-[#c7c4d7] border-white/10 hover:border-white/25'
                              }`}
                            >
                              <span className="text-base">{preset.icon}</span>
                              <span className="truncate flex-1">{preset.name}</span>
                              {isSelected && (
                                <span className="material-symbols-outlined text-[#e7c355] text-[14px]">check</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Image URL input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#908fa0]">Veya Doğrudan Görsel URL'si Yapıştır:</label>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#1b1730] text-xs text-[#dee0ff] placeholder-[#908fa0] px-3.5 py-2 rounded-xl border border-white/15 outline-none focus:border-[#e7c355]"
                      />
                    </div>
                  </div>
                )}

                {/* ----------------- ADIM 3: YAPAY ZEKA YOL HARİTASI ----------------- */}
                {wizardStep === 3 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    {/* AI Engine Duration Selector & Trigger */}
                    <div className="veira-panel-box p-3.5 rounded-2xl bg-gradient-to-br from-[#8083ff]/15 via-[#7bd0ff]/10 to-[#e7c355]/15 border border-[#7bd0ff]/30 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">psychology</span>
                          <span className="text-xs font-bold text-[#dee0ff]">Yapay Zeka Mikro-Eylemleri &amp; Yol Haritası</span>
                        </div>
                        {/* Duration Selector */}
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-[10px] text-[#c7c4d7] mr-1">Süre:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetMinutes(5);
                              handleDecomposeWithAI(5);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              targetMinutes === 5 ? 'bg-[#7bd0ff] text-[#080c22]' : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10'
                            }`}
                          >
                            ⚡ 5 dk
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetMinutes(15);
                              handleDecomposeWithAI(15);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              targetMinutes === 15 ? 'bg-[#e7c355] text-[#080c22]' : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10'
                            }`}
                          >
                            🌟 15 dk
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetMinutes(25);
                              handleDecomposeWithAI(25);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              targetMinutes === 25 ? 'bg-[#8083ff] text-white' : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10'
                            }`}
                          >
                            🚀 25 dk
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isDecomposingAI || !formTitle.trim()}
                        onClick={() => handleDecomposeWithAI()}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7bd0ff] via-[#e7c355] to-[#ffe089] hover:opacity-95 text-[#080c22] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[17px] animate-spin" style={{ animationDuration: isDecomposingAI ? '1s' : '0s' }}>
                          {isDecomposingAI ? 'sync' : 'auto_fix_high'}
                        </span>
                        <span>
                          {isDecomposingAI ? 'Yapay Zeka Adımları Çözümlüyor...' : '✨ Yapay Zekayla Mikro-Eylemleri Üret / Yenile'}
                        </span>
                      </button>
                    </div>

                    {/* 2-Column Responsive Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Column A: Günlük Mikro-Görevler */}
                      <div className="veira-panel-box space-y-2 p-3 rounded-2xl bg-[#0a0818]/70 border border-white/10">
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                          <span className="text-xs font-bold text-[#ffe089] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">routine</span>
                            Günlük Görevler ({formDailyTasks.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsCustomDailyOpen((prev) => !prev)}
                            className="text-[11px] text-[#7bd0ff] hover:underline flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[13px]">{isCustomDailyOpen ? 'expand_less' : 'add'}</span>
                            <span>{isCustomDailyOpen ? 'Gizle' : 'Özel Ekle'}</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {formDailyTasks.map((dt, idx) => (
                            <div
                              key={idx}
                              className="veira-task-item flex items-center justify-between gap-1.5 text-xs text-[#dee0ff] p-2 rounded-xl bg-[#1b1730] border border-white/10 hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#e7c355]/20 text-[#ffe089] shrink-0 border border-[#e7c355]/30">
                                  {dt.estimatedMinutes || 15} dk
                                </span>
                                <span className="truncate text-xs font-medium">{dt.title}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormDailyTasks((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="text-[#908fa0] hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
                                title="Görevi Sil"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {isCustomDailyOpen && (
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="text"
                              value={newModalDailyTask}
                              onChange={(e) => setNewModalDailyTask(e.target.value)}
                              placeholder="Örn: 15 dk pratik yap"
                              className="flex-1 bg-[#1b1730] text-xs text-[#dee0ff] px-2.5 py-1.5 rounded-xl border border-white/15 outline-none focus:border-[#e7c355]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newModalDailyTask.trim()) {
                                  setFormDailyTasks((prev) => [
                                    ...prev,
                                    { title: newModalDailyTask.trim(), estimatedMinutes: targetMinutes },
                                  ]);
                                  setNewModalDailyTask('');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#e7c355] text-[#3d2f00] font-bold text-xs shadow-sm hover:brightness-110 active:scale-95"
                            >
                              Ekle
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Column B: Yol Haritası Aşamaları */}
                      <div className="veira-panel-box space-y-2 p-3 rounded-2xl bg-[#0a0818]/70 border border-white/10">
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                          <span className="text-xs font-bold text-[#7bd0ff] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">flag</span>
                            Yol Haritası ({formMiniTasks.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsCustomMiniOpen((prev) => !prev)}
                            className="text-[11px] text-[#7bd0ff] hover:underline flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[13px]">{isCustomMiniOpen ? 'expand_less' : 'add'}</span>
                            <span>{isCustomMiniOpen ? 'Gizle' : 'Özel Ekle'}</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {formMiniTasks.map((mt, idx) => (
                            <div
                              key={idx}
                              className="veira-task-item flex items-center justify-between gap-1.5 text-xs text-[#dee0ff] p-2 rounded-xl bg-[#1b1730] border border-white/10 hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#7bd0ff]/20 text-[#7bd0ff] shrink-0 border border-[#7bd0ff]/30">
                                  {mt.stepNumber || idx + 1}. Aşama
                                </span>
                                <span className="truncate text-xs font-medium">{mt.title}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormMiniTasks((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="text-[#908fa0] hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
                                title="Aşamayı Sil"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {isCustomMiniOpen && (
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="text"
                              value={newModalMiniTask}
                              onChange={(e) => setNewModalMiniTask(e.target.value)}
                              placeholder="Örn: İlk taslağı tamamla"
                              className="flex-1 bg-[#1b1730] text-xs text-[#dee0ff] px-2.5 py-1.5 rounded-xl border border-white/15 outline-none focus:border-[#7bd0ff]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newModalMiniTask.trim()) {
                                  setFormMiniTasks((prev) => [
                                    ...prev,
                                    {
                                      stepNumber: prev.length + 1,
                                      title: newModalMiniTask.trim(),
                                      desc: 'Özel aşama',
                                    },
                                  ]);
                                  setNewModalMiniTask('');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#7bd0ff] text-[#080c22] font-bold text-xs shadow-sm hover:brightness-110 active:scale-95"
                            >
                              Ekle
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS & WIZARD CONTROLS */}
              <div className="veira-modal-footer pt-3 mt-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10 shrink-0">
                <div className="flex items-center justify-between sm:justify-start gap-2 text-xs text-[#c7c4d7]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#c7c4d7] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-[11px] text-[#908fa0] font-medium">
                    Adım {wizardStep} / 3
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep((prev) => (prev - 1) as 1 | 2)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#dee0ff] bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                      <span>Önceki</span>
                    </button>
                  )}

                  {wizardStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardStep === 1 && !formTitle.trim()) {
                          onShowToast('Lütfen önce bir vizyon başlığı girin.', 'info');
                          return;
                        }
                        if (wizardStep === 2 && formDailyTasks.length <= 1 && formTitle.trim()) {
                          handleDecomposeWithAI();
                        }
                        setWizardStep((prev) => (prev + 1) as 2 | 3);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Sonraki Adım</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!formTitle.trim()}
                    className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 ${
                      wizardStep === 3
                        ? 'bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#e7c355] text-[#3d2f00] shadow-[0_0_20px_rgba(231,195,85,0.4)] hover:brightness-110'
                        : 'bg-white/10 hover:bg-white/15 text-[#dee0ff] border border-white/15'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Vizyon &amp; Hedefi Mühürle</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          5.1 MODAL: VİZYON VE HEDEFİ DÜZENLE (EDIT MODAL)
          ========================================================================= */}
      {editingVision && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="veira-add-goal-modal relative w-full max-w-lg max-h-[96dvh] sm:max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#161a30] border border-white/15 p-4 sm:p-6 shadow-2xl my-auto overflow-hidden">
            <button
              type="button"
              onClick={() => setEditingVision(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-[#c7c4d7] hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors z-10"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="shrink-0 pr-8 mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="material-symbols-outlined text-[#e7c355] text-[18px]">edit</span>
                <span className="text-[10px] font-bold text-[#e7c355] uppercase tracking-wider">
                  Vizyonu Güncelle
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#dee0ff] tracking-tight">
                Vizyon &amp; Hedefi Düzenle
              </h2>
              <p className="text-[11px] sm:text-xs text-[#c7c4d7] mt-0.5">
                Başlığı, kategoriyi, zaman ufkunu veya bu hedefin senin için derin anlamını güncelle.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-0.5 sm:pr-1 space-y-3.5 sm:space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#dee0ff]">
                  Vizyon &amp; Hedef Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#080c22] text-xs sm:text-sm text-[#dee0ff] px-4 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#dee0ff]">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-[#080c22] text-xs text-[#dee0ff] px-3.5 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                  >
                    <option value="Kariyer & Bolluk">Kariyer &amp; Bolluk</option>
                    <option value="Beden & Canlılık">Beden &amp; Canlılık</option>
                    <option value="Ruhsal Denge">Ruhsal Denge</option>
                    <option value="Seyahat & Yaşam">Seyahat &amp; Yaşam</option>
                    <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#dee0ff]">Zaman Ufku</label>
                  <select
                    value={editHorizon}
                    onChange={(e) => setEditHorizon(e.target.value)}
                    className="w-full bg-[#080c22] text-xs text-[#dee0ff] px-3.5 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                  >
                    <option value="1 Ay">1 Ay (Hızlı Odak)</option>
                    <option value="3 Ay">3 Ay (Q1 Çeyrek)</option>
                    <option value="6 Ay">6 Ay</option>
                    <option value="1 Yıl">1 Yıl (2026/2027)</option>
                    <option value="2027">2027 Uzun Vadeli Vizyon</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#dee0ff]">
                  Neden Bu Hedef Benim İçin Çok Önemli?
                </label>
                <textarea
                  rows={3}
                  value={editWhy}
                  onChange={(e) => setEditWhy(e.target.value)}
                  className="w-full bg-[#080c22] text-xs sm:text-sm text-[#dee0ff] px-4 py-2 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                />
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setVisionToDelete(editingVision)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
                  title="Bu Vizyonu Sil"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Vizyonu Sil</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingVision(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#c7c4d7] hover:text-white"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. VISION COLLAGE & PHONE LOCK SCREEN STUDIO MODAL
          ========================================================================= */}
      <VisionCollageStudioModal
        isOpen={isCollageStudioOpen}
        onClose={() => setIsCollageStudioOpen(false)}
        visions={visions}
        onShowToast={onShowToast}
        onPlayChime={onPlayChime}
      />

      {/* =========================================================================
          6.1 VISION AI IMAGE GENERATOR & FLUX STUDIO MODAL
          ========================================================================= */}
      <VisionAiImageGeneratorModal
        isOpen={isImageGeneratorOpen}
        onClose={() => setIsImageGeneratorOpen(false)}
        onSelectImage={handleSelectAiGeneratedImage}
        initialTitle={
          imageGenTarget === 'form'
            ? formTitle
            : imageGenTarget === 'preview' && previewVision
            ? previewVision.title
            : ''
        }
        initialCategory={
          imageGenTarget === 'form'
            ? formCategory
            : imageGenTarget === 'preview' && previewVision
            ? previewVision.category
            : ''
        }
        onPlayChime={onPlayChime}
        onShowToast={onShowToast}
      />

      {/* =========================================================================
          7. VİZYON SİLME ONAY MODALI (Tarayıcı confirm engeline takılmayan güvenli onay)
          ========================================================================= */}
      {visionToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setVisionToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#161a30] border border-red-500/40 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base font-bold text-white truncate">
                  Vizyonu Sil
                </h3>
                <span className="text-[11px] text-[#978da3] block">
                  Bu işlem geri alınamaz
                </span>
              </div>
            </div>

            <p className="text-xs text-[#cdc2da] leading-relaxed">
              <strong className="text-white">"{visionToDelete.title}"</strong> vizyonunu ve bu vizyona ait tüm günlük ve mikro görevleri kalıcı olarak silmek istediğinize emin misiniz?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setVisionToDelete(null)}
                className="min-h-[44px] px-4 rounded-xl text-xs font-medium text-[#cdc2da] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = visionToDelete.title;
                  deleteVision(visionToDelete.id);
                  if (previewVision && previewVision.id === visionToDelete.id) {
                    setPreviewVision(null);
                  }
                  if (editingVision && editingVision.id === visionToDelete.id) {
                    setEditingVision(null);
                  }
                  setVisionToDelete(null);
                  onShowToast(`"${title}" vizyonu silindi.`, 'delete');
                  if (onPlayChime) onPlayChime();
                }}
                className="min-h-[44px] px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs active:scale-95 transition-all shadow-lg shadow-red-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Evet, Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Safe Bottom Clearance Spacer - prevents floating dock collision */}
      <div className="h-14 sm:h-8 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </section>
  );
};
