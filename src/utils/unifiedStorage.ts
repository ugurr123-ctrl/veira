import { useState, useEffect, useCallback } from 'react';
import { UnifiedVisionGoal, DailyTask, MiniTask } from '../types';

export const UNIFIED_STORAGE_KEY = 'veira_unified_visions_v2';
export const UNIFIED_UPDATE_EVENT = 'veira_unified_visions_updated';

export const INITIAL_UNIFIED_VISIONS: UnifiedVisionGoal[] = [
  {
    id: 'uv-como',
    title: 'Como Gölü Kıyısında Yaşam & Çalışma',
    category: 'Kariyer & Bolluk',
    categoryKey: 'career',
    categoryLabel: 'Kariyer & Bolluk',
    horizon: '2027',
    why: 'Kendime ve sevdiklerime zaman kısıtlamasından arınmış, doğa içinde dingin ve bağımsız bir çalışma alanı sunmak.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAYlhU-0NgSW87u0HG48qUwVmlcXUyPWvOsd3WFu6MLH3jO5AmSglc8M8poJ_bgLAPQlYYABbnFcKM_8KmkWGFbtOF_0Wzo5c7w35uNX6txxXLApGAdlzuIGTrozIHTh1oS0t4_TZxKgGXqVOZLrjiihiqZh9Z5wiOppkr8qqiX0KHvQuwprqkrgG2-8Ox8ym4J-GNRqgrZddFEGm2uqI4w8lQvl4raSwpF3ENMwiU',
    badge: 'Ana Vizyon Yıldızı',
    status: 'active',
    createdAt: '2026-10-15',
    dailyTasks: [
      {
        id: 'dt-c1',
        visionId: 'uv-como',
        visionTitle: 'Como Gölü',
        title: 'Günde 15 dk İtalyanca kelime & telaffuz pratiği yap',
        estimatedMinutes: 15,
        completed: false,
      },
      {
        id: 'dt-c2',
        visionId: 'uv-como',
        visionTitle: 'Como Gölü',
        title: 'Como & İtalya uzaktan çalışma rehberinden 1 mekan incele',
        estimatedMinutes: 10,
        completed: false,
      },
    ],
    miniTasks: [
      {
        id: 'mt-c1',
        visionId: 'uv-como',
        stepNumber: 1,
        title: 'Temel A1/A2 İtalyanca çalışma rotasını hazırla',
        desc: 'Haftalık 3 gün düzenli pratik',
        completed: true,
      },
      {
        id: 'mt-c2',
        visionId: 'uv-como',
        stepNumber: 2,
        title: 'Uzaktan çalışma ve dijital göçebe evraklarını listele',
        desc: 'Resmi vize ve banka gereksinimleri',
        completed: false,
      },
      {
        id: 'mt-c3',
        visionId: 'uv-como',
        stepNumber: 3,
        title: 'Como Gölü ve Milano bölgesinde 3 ortak çalışma alanı belirle',
        desc: 'İnternet hızı ve sakin ortam kontrolü',
        completed: false,
      },
      {
        id: 'mt-c4',
        visionId: 'uv-como',
        stepNumber: 4,
        title: 'Fiziksel taşınma ve ev kiralama bütçe taslağını oluştur',
        desc: 'Konaklama lojistiği ve uçak planı',
        completed: false,
      },
    ],
  },
  {
    id: 'uv-body',
    title: 'Canlı, Fit & Esnek Bir Beden',
    category: 'Beden & Canlılık',
    categoryKey: 'wellness',
    categoryLabel: 'Beden & Canlılık',
    horizon: '3 Ay',
    why: 'Her güne yüksek hücresel enerjiyle başlamak, omurgayı rahatlatmak ve gün boyu dingin bir güç hissetmek.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHI8ddkGh9CycfOyFQAFJ5iXzAjBbOhhLQ9A05ba7i6BKsaeYW3GeMMWFIVsiYxW_i0O_559VOdDNsZcKKrUN_WuE3pMw_XRynSlRdtRrjGi8cPN678pBImX8zROKZ2jh8sRzGJBxAWxLiitJDoepeUZp-Awx5A3jUIZLQZAmKexQQL7X0CYBReoFD5F40592IMQynuSI7Iq_0neByQukwZEixHBzeC6mhphORHGo',
    badge: 'Hücresel Canlılık',
    status: 'active',
    createdAt: '2026-10-18',
    dailyTasks: [
      {
        id: 'dt-b1',
        visionId: 'uv-body',
        visionTitle: 'Fit & Esnek Beden',
        title: 'Sabah 15 dk omurga açıcı Yin Yoga & esneme yap',
        estimatedMinutes: 15,
        completed: true,
      },
      {
        id: 'dt-b2',
        visionId: 'uv-body',
        visionTitle: 'Fit & Esnek Beden',
        title: 'Günde 2.5 litre su ve temiz hidrasyon takibi',
        estimatedMinutes: 5,
        completed: false,
      },
    ],
    miniTasks: [
      {
        id: 'mt-b1',
        visionId: 'uv-body',
        stepNumber: 1,
        title: '30 günlük sabah esneme takvimini oluştur',
        desc: 'Yatak başında mat ve su hazırlığı',
        completed: true,
      },
      {
        id: 'mt-b2',
        visionId: 'uv-body',
        stepNumber: 2,
        title: 'Haftada 3 gün 5 km tempolu yürüyüş/hafif koşu rutini kur',
        desc: 'Açık hava ve oksijen alımı',
        completed: false,
      },
      {
        id: 'mt-b3',
        visionId: 'uv-body',
        stepNumber: 3,
        title: 'Postür ve esneklik ilerlemesini fotoğrafla belgele',
        desc: 'Gözle görülür omurga dikliği',
        completed: false,
      },
    ],
  },
  {
    id: 'uv-spirit',
    title: '432Hz Zihin Hali & Derin Dinginlik',
    category: 'Ruhsal Denge',
    categoryKey: 'spirit',
    categoryLabel: 'Ruhsal Denge',
    horizon: '6 Ay',
    why: 'Zihinsel aşırı düşünmeyi ve kaygıyı susturarak içsel sezgileri ve yaratıcı ilhamı berraklaştırmak.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxLXF8ZssfZsU_LOHlF0_tiqJ3MKQqzKzAKGV3FrrfjkdVAdBvkkovwMQwNiuGPK556VNNRAtlIF2Np4f2ff4vilxdPrKTUh6020m-ON30hYBoAF7CQYsn6oOO8zO8B0ke3ttXidfZ91XkciAxT20lccoTfLiCB3hLDG4tDrnrAhgMl-OiTtJs1v2bhGVw7xyU93scFG-CgztLYomyxXbEaEJskd5oIl2ArXrwO2Y',
    badge: 'İçsel Sığınak',
    status: 'active',
    createdAt: '2026-10-20',
    dailyTasks: [
      {
        id: 'dt-s1',
        visionId: 'uv-spirit',
        visionTitle: '432Hz Zihin Hali',
        title: 'Akşam 15 dk 432Hz şömine & yağmur ses banyosu yap',
        estimatedMinutes: 15,
        completed: false,
      },
      {
        id: 'dt-s2',
        visionId: 'uv-spirit',
        visionTitle: '432Hz Zihin Hali',
        title: '5 dk 4-7-8 vagus siniri diyafram nefesi al',
        estimatedMinutes: 5,
        completed: false,
      },
    ],
    miniTasks: [
      {
        id: 'mt-s1',
        visionId: 'uv-spirit',
        stepNumber: 1,
        title: 'Gece mavi ışık kapatma ve uyku ritüeli kur',
        desc: 'Saat 22:30 sonrası ekran detoksu',
        completed: true,
      },
      {
        id: 'mt-s2',
        visionId: 'uv-spirit',
        stepNumber: 2,
        title: '21 gün kesintisiz 432Hz alfa frekansı serisi yakala',
        desc: 'Alışkanlık nöral pekiştirmesi',
        completed: false,
      },
      {
        id: 'mt-s3',
        visionId: 'uv-spirit',
        stepNumber: 3,
        title: 'Stoacı akşam düşünce günlüğü tutma alışkanlığı kazan',
        desc: 'Düşünce tuzaklarını yazarak arındırma',
        completed: false,
      },
    ],
  },
];

export function getStoredUnifiedVisions(): UnifiedVisionGoal[] {
  try {
    const raw = localStorage.getItem(UNIFIED_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading unified visions:', err);
  }
  return INITIAL_UNIFIED_VISIONS;
}

export function saveStoredUnifiedVisions(items: UnifiedVisionGoal[]): void {
  try {
    localStorage.setItem(UNIFIED_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(UNIFIED_UPDATE_EVENT));
  } catch (err) {
    console.warn('Error saving unified visions:', err);
  }
}

export function useUnifiedVisions() {
  const [visions, setVisions] = useState<UnifiedVisionGoal[]>(() => getStoredUnifiedVisions());

  const reload = useCallback(() => {
    setVisions(getStoredUnifiedVisions());
  }, []);

  useEffect(() => {
    const handler = () => reload();
    window.addEventListener(UNIFIED_UPDATE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(UNIFIED_UPDATE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, [reload]);

  // Derived: All daily tasks from all visions
  const allDailyTasks: DailyTask[] = visions.flatMap((v) =>
    (v.dailyTasks || []).map((t) => ({
      ...t,
      visionTitle: t.visionTitle || v.title,
    }))
  );

  const completedDailyTasksCount = allDailyTasks.filter((t) => t.completed).length;
  const totalDailyTasksCount = allDailyTasks.length;
  const dailyProgressPercent =
    totalDailyTasksCount > 0 ? Math.round((completedDailyTasksCount / totalDailyTasksCount) * 100) : 0;

  // Toggle a daily task (either from Today or from Vision tab)
  const toggleDailyTask = useCallback((visionId: string, taskId: string) => {
    const current = getStoredUnifiedVisions();
    let updated = false;

    const next = current.map((v) => {
      if (v.id === visionId || !visionId) {
        const found = v.dailyTasks?.some((t) => t.id === taskId);
        if (found) {
          updated = true;
          return {
            ...v,
            dailyTasks: v.dailyTasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    completed: !t.completed,
                    completedAt: !t.completed ? new Date().toISOString() : undefined,
                  }
                : t
            ),
          };
        }
      }
      return v;
    });

    if (updated) {
      saveStoredUnifiedVisions(next);
      setVisions(next);
    }
  }, []);

  // Toggle a mini task / milestone
  const toggleMiniTask = useCallback((visionId: string, taskId: string) => {
    const current = getStoredUnifiedVisions();
    const next = current.map((v) => {
      if (v.id === visionId) {
        return {
          ...v,
          miniTasks: v.miniTasks.map((m) =>
            m.id === taskId ? { ...m, completed: !m.completed } : m
          ),
        };
      }
      return v;
    });
    saveStoredUnifiedVisions(next);
    setVisions(next);
  }, []);

  // Add a new vision and its tasks
  const addVision = useCallback(
    (newVision: Omit<UnifiedVisionGoal, 'id' | 'createdAt'>) => {
      const current = getStoredUnifiedVisions();
      const id = `uv-${Date.now()}`;
      const item: UnifiedVisionGoal = {
        ...newVision,
        id,
        createdAt: new Date().toISOString().split('T')[0],
        dailyTasks: (newVision.dailyTasks || []).map((dt, idx) => ({
          ...dt,
          id: dt.id || `dt-${id}-${idx}-${Date.now()}`,
          visionId: id,
          visionTitle: newVision.title,
        })),
        miniTasks: (newVision.miniTasks || []).map((mt, idx) => ({
          ...mt,
          id: mt.id || `mt-${id}-${idx}-${Date.now()}`,
          visionId: id,
        })),
      };

      const next = [item, ...current];
      saveStoredUnifiedVisions(next);
      setVisions(next);
      return item;
    },
    []
  );

  // Delete a vision
  const deleteVision = useCallback((visionId: string) => {
    const current = getStoredUnifiedVisions();
    const next = current.filter((v) => v.id !== visionId);
    saveStoredUnifiedVisions(next);
    setVisions(next);
  }, []);

  // Update an existing vision (title, why, horizon, category, status, etc.)
  const updateVision = useCallback((visionId: string, partial: Partial<UnifiedVisionGoal>) => {
    const current = getStoredUnifiedVisions();
    const next = current.map((v) => {
      if (v.id === visionId) {
        return {
          ...v,
          ...partial,
          dailyTasks: partial.title
            ? (v.dailyTasks || []).map((dt) => ({ ...dt, visionTitle: partial.title }))
            : v.dailyTasks,
        };
      }
      return v;
    });
    saveStoredUnifiedVisions(next);
    setVisions(next);
  }, []);

  // Add a daily task to a specific vision
  const addDailyTaskToVision = useCallback(
    (visionId: string, title: string, estimatedMinutes = 15) => {
      const current = getStoredUnifiedVisions();
      const next = current.map((v) => {
        if (v.id === visionId) {
          const newTask: DailyTask = {
            id: `dt-${Date.now()}`,
            visionId,
            visionTitle: v.title,
            title,
            estimatedMinutes,
            completed: false,
          };
          return {
            ...v,
            dailyTasks: [...(v.dailyTasks || []), newTask],
          };
        }
        return v;
      });
      saveStoredUnifiedVisions(next);
      setVisions(next);
    },
    []
  );

  // Add a mini task / milestone to a specific vision
  const addMiniTaskToVision = useCallback((visionId: string, title: string, desc = '') => {
    const current = getStoredUnifiedVisions();
    const next = current.map((v) => {
      if (v.id === visionId) {
        const nextStepNumber = (v.miniTasks?.length || 0) + 1;
        const newMini: MiniTask = {
          id: `mt-${Date.now()}`,
          visionId,
          stepNumber: nextStepNumber,
          title,
          desc,
          completed: false,
        };
        return {
          ...v,
          miniTasks: [...(v.miniTasks || []), newMini],
        };
      }
      return v;
    });
    saveStoredUnifiedVisions(next);
    setVisions(next);
  }, []);

  // Delete a daily task
  const deleteDailyTask = useCallback((visionId: string, taskId: string) => {
    const current = getStoredUnifiedVisions();
    const next = current.map((v) => {
      if (v.id === visionId) {
        return {
          ...v,
          dailyTasks: (v.dailyTasks || []).filter((t) => t.id !== taskId),
        };
      }
      return v;
    });
    saveStoredUnifiedVisions(next);
    setVisions(next);
  }, []);

  // Delete a mini task
  const deleteMiniTask = useCallback((visionId: string, taskId: string) => {
    const current = getStoredUnifiedVisions();
    const next = current.map((v) => {
      if (v.id === visionId) {
        return {
          ...v,
          miniTasks: (v.miniTasks || []).filter((t) => t.id !== taskId),
        };
      }
      return v;
    });
    saveStoredUnifiedVisions(next);
    setVisions(next);
  }, []);

  return {
    visions,
    allDailyTasks,
    completedDailyTasksCount,
    totalDailyTasksCount,
    dailyProgressPercent,
    toggleDailyTask,
    toggleMiniTask,
    addVision,
    updateVision,
    deleteVision,
    addDailyTaskToVision,
    addMiniTaskToVision,
    deleteDailyTask,
    deleteMiniTask,
    reload,
  };
}
