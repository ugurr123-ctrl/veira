/**
 * Daily Reflection Background Service (Günün Şiirsel Tefekkürü & Akşam Yansıması)
 *
 * Listens to completed tasks from unified storage, generates a poetic, encouraging narrative
 * that celebrates the user's achievements and mindfulness via Gemini AI or a rich local
 * poetic Turkish generation engine.
 */

import { DailyTask } from '../types';
import { UNIFIED_STORAGE_KEY, UNIFIED_UPDATE_EVENT } from '../utils/unifiedStorage';
import { useEffect, useState, useCallback } from 'react';

export interface DailyReflection {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  strophe: string[]; // 4-line poetic verse
  narrative: string; // Encouraging mindful narrative
  mindfulnessPrompt: string; // Evening reflection question
  eveningMantra: string; // Bedtime calming affirmation
  completedTasksCount: number;
  totalTasksCount: number;
  completedTaskTitles: string[];
  createdAt: string;
  source: 'gemini-ai' | 'deterministic-fallback' | 'local-poetic';
}

const STORAGE_TODAY_KEY = 'veira_daily_reflection_today';
const STORAGE_HISTORY_KEY = 'veira_daily_reflections_history';
export const REFLECTION_UPDATE_EVENT = 'veira_daily_reflection_updated';

// Formats YYYY-MM-DD
export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * High-literary Turkish poetic fallback generator.
 * Weaves user's actual completed task titles into lyric strophes,
 * celebrating mindful atomic progress without toxic hustle culture.
 */
export function generatePoeticReflectionLocally(
  completedTasks: { title: string; visionTitle?: string; estimatedMinutes?: number }[],
  totalTasksCount: number,
  userName = 'Selin'
): DailyReflection {
  const today = getTodayKey();
  const count = completedTasks.length;
  const firstTask = completedTasks[0]?.title || 'Dingin bir nefes';
  const secondTask = completedTasks[1]?.title;

  let title = '';
  let strophe: string[] = [];
  let narrative = '';
  let mindfulnessPrompt = '';
  let eveningMantra = '';

  if (count === 0) {
    title = 'Sessiz Tohumların Dinginliği & Akşam Sükûneti';
    strophe = [
      'Gök kubbe kararırken telaşı ardında bırak,',
      'Bazen en kutlu eylem, yalnızca durup nefes almak.',
      'Yarın yeni bir fecir, tohum karanlıkta uyanır,',
      'Bugün dinlenen ruhun, yarın yıldızlara uzanır.',
    ];
    narrative = `Sevgili ${userName}, bugün hiçbir satır çizilmemiş veya hiçbir görev tamamlanmamış görünse de, bil ki durmak da yolculuğun en bilge parçasıdır. Doğada hiçbir ağaç her saniye çiçek açmaz; kışın sessizliği, baharın görkemli uyanışını hazırlar.\n\nBugünün yorgunluğunu, erteleyişini veya suskunluğunu şefkatle kucakla. Kendine kızmadan, telaş etmeden ve eksik hissetmeden geceye teslim ol. Zihnin nadasa çekildiğinde en parlak vizyonlar kök salar.`;
    mindfulnessPrompt = 'Bugün bedenimin ve zihnimin benden istediği en derin dinlenme neydi?';
    eveningMantra = 'Bugün elimden gelenin en iyisi buydu; kendimi olduğum gibi kabul ediyor ve huzurla uykuya bırakıyorum.';
  } else if (count === 1) {
    title = `Tek Bir Kıvılcımın Şiiri: "${firstTask.slice(0, 30)}..."`;
    strophe = [
      'Bir tek damla koca nehri başlatır derler,',
      `"${firstTask}" diyerek aştın engeller.`,
      'Küçük sanılan adımlar ulu dağları eritir,',
      'Akşamın yıldızları bu adımı sana tebessümle iletir.',
    ];
    narrative = `Bugün attığın "${firstTask}" adımı, sıradan bir mikro-eylem değil; ruhunun kendi geleceğine verdiği sözün somut bir mührüdür. 15 dakikalık bile olsa odaklanmış bir dikkat, zihinsel ertelemenin yarattığı sis perdesini delip geçmeye yetti.\n\n${userName}, büyük zaferler gürültülü devrimlerle değil, senin bugün gösterdiğin bu sessiz, zarif adımlarla inşa edilir. Yastığa başını koyarken bu tek adımın yarattığı içsel genişlemeyi hisset.`;
    mindfulnessPrompt = `"${firstTask}" adımını tamamlarken içimde yükselen his neydi: Zafer mi, hafiflik mi, yoksa huzur mu?`;
    eveningMantra = 'Attığım her küçük adım beni en yüksek potansiyelime sevgiyle ve güvenle yaklaştırıyor.';
  } else if (count <= 3) {
    title = 'Sessiz Zaferlerin Şiiri & Akşam Yankısı';
    strophe = [
      'Zamanın kum saatinde altın taneler aktı,',
      `"${firstTask}" adımıyla kalbin geleceğe baktı.`,
      secondTask ? `"${secondTask}" ile taçlandı bu günün emeği,` : 'İnançla örüldü hayallerin zarif peteği,',
      'Gökler tebessüm etti, gün hakkıyla tamamlandı.',
    ];
    narrative = `Sevgili ${userName}, bugün ${count} farklı eşiği geçtin. ${firstTask}${secondTask ? ` ve ${secondTask}` : ''} gibi somut gayretlerinle vizyonunu zihinsel bir taslak olmaktan çıkarıp elle tutulur bir gerçekliğe dönüştürdün.\n\nHarcanan her 15 dakika, ruhunun geleceğe diktiği bir fidan oldu. Gün biterken ardında bir pişmanlık gölgesi değil, tatminle atılmış adımların dingin yankısı kalıyor. Artık tüm düşünceleri serbest bırakıp akşamın huzur veren kollarına çekilme vakti.`;
    mindfulnessPrompt = 'Bugün tamamladığım adımlardan hangisi bana kendimi en çok "kendi yolumda" hissettirdi?';
    eveningMantra = 'Emeklerim güvende, niyetlerim evrende yankılanıyor; geceyi sükûnetle kucaklıyorum.';
  } else {
    title = 'Yıldızlara Yazılan Gün: Üstün Tezahür & İçsel Işık';
    strophe = [
      'Bugün iraden bir meşale gibi yandı göklerde,',
      `${count} kutsal niyet hayat buldu ellerinde.`,
      `"${firstTask}" ile başlayan bu aydınlık yürüyüş,`,
      'Akşamın koynunda şimdi en derin sükûnete dönüş.',
    ];
    narrative = `Bugün muazzam bir içsel hizalanma günüdür ${userName}. Tam ${count} görevi sevgi ve disiplinle tamamladın. ${completedTasks.map((t) => `"${t.title}"`).slice(0, 3).join(', ')} başta olmak üzere attığın her adım, kararlılığının ve yüksek bilincinin bir kanıtıdır.\n\nBu bereketli günün meyvelerini kalbinde topla. Artık yapacak hiçbir şey kalmadı; sadece yaptıklarının getirdiği huzuru ve derin tatmini soluma zamanı. Zihnini dinlendir, yarın seni yine aynı ışıkla karşılayacak.`;
    mindfulnessPrompt = 'Bugün bu yüksek odak ve akışı sağlayan içsel güç kaynağım neydi?';
    eveningMantra = 'Bugün hayatımın efendisi oldum; şimdi hak edilmiş bir dinginlikle dinleniyorum.';
  }

  return {
    id: `ref-${today}-${Date.now()}`,
    date: today,
    title,
    strophe,
    narrative,
    mindfulnessPrompt,
    eveningMantra,
    completedTasksCount: count,
    totalTasksCount: totalTasksCount || count,
    completedTaskTitles: completedTasks.map((t) => t.title),
    createdAt: new Date().toISOString(),
    source: 'local-poetic',
  };
}

/**
 * Singleton service running in the background.
 * Tracks task changes from localStorage and auto-generates / refreshes the daily reflection.
 */
class DailyReflectionBackgroundService {
  private debounceTimer: any = null;
  private isProcessing: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;

    // Listen to unified storage task updates
    window.addEventListener(UNIFIED_UPDATE_EVENT, this.handleStorageOrTaskChange);
    window.addEventListener('storage', (e) => {
      if (e.key === UNIFIED_STORAGE_KEY) {
        this.handleStorageOrTaskChange();
      }
    });

    // Check once on init
    setTimeout(() => {
      this.checkAndGenerate();
    }, 500);
  }

  private handleStorageOrTaskChange = () => {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    // Debounce by 1200ms so multiple rapid task clicks won't trigger redundant API calls
    this.debounceTimer = setTimeout(() => {
      this.checkAndGenerate();
    }, 1200);
  };

  /**
   * Reads completed tasks from localStorage unified storage
   */
  public getCompletedTasksFromStorage(): {
    completed: { title: string; visionTitle?: string; estimatedMinutes?: number }[];
    total: number;
    userName: string;
  } {
    let completed: { title: string; visionTitle?: string; estimatedMinutes?: number }[] = [];
    let total = 0;
    let userName = 'Selin';

    try {
      userName = localStorage.getItem('veira_profile_fullname') || 'Selin';
      const raw = localStorage.getItem(UNIFIED_STORAGE_KEY);
      if (raw) {
        const visions = JSON.parse(raw);
        if (Array.isArray(visions)) {
          visions.forEach((v: any) => {
            if (Array.isArray(v.dailyTasks)) {
              v.dailyTasks.forEach((dt: DailyTask) => {
                total++;
                if (dt.completed) {
                  completed.push({
                    title: dt.title,
                    visionTitle: dt.visionTitle || v.title,
                    estimatedMinutes: dt.estimatedMinutes || 15,
                  });
                }
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Failed to read completed tasks for reflection:', e);
    }

    return { completed, total, userName };
  }

  /**
   * Generates a stable fingerprint of current completed tasks + date
   */
  private computeFingerprint(completedTitles: string[], date: string): string {
    return `${date}::${[...completedTitles].sort().join('|')}`;
  }

  /**
   * Checks if reflection needs regeneration and generates it
   */
  public async checkAndGenerate(force = false): Promise<DailyReflection | null> {
    if (this.isProcessing && !force) return null;

    const today = getTodayKey();
    const { completed, total, userName } = this.getCompletedTasksFromStorage();
    const completedTitles = completed.map((t) => t.title);
    const fingerprint = this.computeFingerprint(completedTitles, today);

    // If already generated for this exact task state and not forcing, return existing
    const existing = this.getTodayReflection();
    if (existing && existing.date === today && !force) {
      // Check if tasks changed since this reflection was generated
      const existingFp = this.computeFingerprint(existing.completedTaskTitles || [], existing.date);
      if (existingFp === fingerprint) {
        return existing;
      }
    }

    this.isProcessing = true;
    try {
      let reflection: DailyReflection | null = null;

      // Attempt AI generation via backend
      try {
        const res = await fetch('/api/reflection/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completedTasks: completed,
            totalTasksCount: total,
            userName,
            date: today,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            reflection = {
              id: `ref-${today}-${Date.now()}`,
              date: today,
              title: json.data.title || 'Sessiz Zaferlerin Şiiri & Akşam Yankısı',
              strophe: Array.isArray(json.data.strophe) ? json.data.strophe : [],
              narrative: json.data.narrative || '',
              mindfulnessPrompt: json.data.mindfulnessPrompt || '',
              eveningMantra: json.data.eveningMantra || '',
              completedTasksCount: completed.length,
              totalTasksCount: total,
              completedTaskTitles: completedTitles,
              createdAt: new Date().toISOString(),
              source: 'gemini-ai',
            };
          }
        }
      } catch (err) {
        console.warn('Backend reflection API failed, using poetic fallback:', err);
      }

      // If AI failed or returned fallback, generate rich local poetic reflection
      if (!reflection || !reflection.narrative) {
        reflection = generatePoeticReflectionLocally(completed, total, userName);
      }

      // Save to localStorage
      this.saveReflection(reflection);

      return reflection;
    } catch (e) {
      console.error('Error generating reflection:', e);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }

  public getTodayReflection(): DailyReflection | null {
    try {
      const raw = localStorage.getItem(STORAGE_TODAY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === getTodayKey()) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  public getHistory(): DailyReflection[] {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public saveReflection(reflection: DailyReflection) {
    try {
      localStorage.setItem(STORAGE_TODAY_KEY, JSON.stringify(reflection));

      // Append/Update in history
      const history = this.getHistory();
      const filtered = history.filter((h) => h.date !== reflection.date);
      filtered.unshift(reflection);
      // Keep up to 30 days of reflections
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(filtered.slice(0, 30)));

      // Dispatch global event for reactive UI
      window.dispatchEvent(new CustomEvent(REFLECTION_UPDATE_EVENT, { detail: reflection }));
    } catch (e) {
      console.error('Failed to save daily reflection:', e);
    }
  }
}

// Global Singleton
export const dailyReflectionService = new DailyReflectionBackgroundService();

/**
 * Custom React hook for seamless consumption in TodayTab
 */
export function useDailyReflection() {
  const [reflection, setReflection] = useState<DailyReflection | null>(() =>
    dailyReflectionService.getTodayReflection()
  );
  const [isLoading, setIsLoading] = useState<boolean>(!reflection);
  const [history, setHistory] = useState<DailyReflection[]>(() =>
    dailyReflectionService.getHistory()
  );

  // Sync state with events
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setReflection(e.detail);
        setHistory(dailyReflectionService.getHistory());
        setIsLoading(false);
      }
    };

    window.addEventListener(REFLECTION_UPDATE_EVENT, handleUpdate);

    // Initial check if no reflection today
    if (!reflection) {
      setIsLoading(true);
      dailyReflectionService.checkAndGenerate().then((res) => {
        if (res) {
          setReflection(res);
          setHistory(dailyReflectionService.getHistory());
        }
        setIsLoading(false);
      });
    }

    return () => {
      window.removeEventListener(REFLECTION_UPDATE_EVENT, handleUpdate);
    };
  }, [reflection]);

  const refreshReflection = useCallback(async () => {
    setIsLoading(true);
    const fresh = await dailyReflectionService.checkAndGenerate(true);
    if (fresh) {
      setReflection(fresh);
      setHistory(dailyReflectionService.getHistory());
    }
    setIsLoading(false);
    return fresh;
  }, []);

  /**
   * Plays a soothing mindfulness chime tone (432Hz Solfeggio / Singing Bowl)
   */
  const playReflectionChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // 432 Hz fundamental frequency (Solfeggio natural tuning) + 864 Hz harmonic
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, now);
      // Gentle pitch bend like a singing bowl
      osc1.frequency.exponentialRampToValueAtTime(431.5, now + 3.5);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(864, now);
      osc2.frequency.exponentialRampToValueAtTime(863, now + 3.0);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.15);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 4.0);
      osc2.stop(now + 3.0);
    } catch (e) {
      console.warn('Audio chime could not play:', e);
    }
  }, []);

  return {
    reflection,
    isLoading,
    history,
    refreshReflection,
    playReflectionChime,
  };
}
