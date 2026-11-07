import { GoalItem, HabitItem, JournalEntry, SolfeggioFrequency, VisionItem } from '../types';

export const SOLFEGGIO_FREQUENCIES: SolfeggioFrequency[] = [
  {
    id: 'freq-432',
    freq: 432,
    name: '432 Hz',
    subtitle: 'Cosmic Natural Resonance',
    description: 'Mathematically consistent with the vibration of nature and the golden ratio. Induces deep calmness, mental clarity, and somatic stillness.',
    chakraOrBenefit: 'Deep Peace & Harmonic Stillness',
    color: '#818CF8',
  },
  {
    id: 'freq-528',
    freq: 528,
    name: '528 Hz',
    subtitle: 'Transformation & Clarity',
    description: 'Known as the "Miracle Tone" or frequency of transformation. Clears mental fog, promotes positive intention, and revitalizes creative energy.',
    chakraOrBenefit: 'Creative Renewal & Vitality',
    color: '#F5D061',
  },
  {
    id: 'freq-396',
    freq: 396,
    name: '396 Hz',
    subtitle: 'Liberation from Doubt',
    description: 'Dissolves hidden subconscious blockages, grounds restless contemplation, and cleanses accumulated anxieties.',
    chakraOrBenefit: 'Root Grounding & Emotional Release',
    color: '#EC4899',
  },
  {
    id: 'freq-639',
    freq: 639,
    name: '639 Hz',
    subtitle: 'Harmonious Connection',
    description: 'Fosters interpersonal empathy, resonant relationships, and open-hearted emotional equilibrium.',
    chakraOrBenefit: 'Heart Opening & Relationship Alignment',
    color: '#38BDF8',
  },
  {
    id: 'freq-741',
    freq: 741,
    name: '741 Hz',
    subtitle: 'Intuitive Awakening',
    description: 'Awakens subtle intuition, cleanses mental toxins, and allows effortless expression of genuine truth.',
    chakraOrBenefit: 'Clarity of Purpose & Expression',
    color: '#A78BFA',
  },
  {
    id: 'freq-852',
    freq: 852,
    name: '852 Hz',
    subtitle: 'Pure Spiritual Consciousness',
    description: 'Raises awareness to universal synchronicity, spiritual lucidity, and expansive cosmic order.',
    chakraOrBenefit: 'Higher Vision & Transcendent Insight',
    color: '#C0C1FF',
  },
];

const INITIAL_VISIONS: VisionItem[] = [
  {
    id: 'vis-1',
    title: 'Architecting Nocturnal Sanctuaries',
    statement: 'I create elevated digital experiences that nurture serene contemplation, timeless focus, and boundless beauty.',
    category: 'Creative Craft',
    targetYearOrDate: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    feeling: 'Expansive peace, pristine clarity, elegant mastery',
    status: 'active',
    createdAt: '2026-10-01',
  },
  {
    id: 'vis-2',
    title: 'Deep Vital Radiance & Presence',
    statement: 'My vessel is a temple of vitality, nourished by restorative dawn breath, whole sustenance, and nocturnal renewal.',
    category: 'Radiant Vitality',
    targetYearOrDate: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    feeling: 'Unhurried groundedness, buoyant energy, radiant posture',
    status: 'active',
    createdAt: '2026-10-05',
  },
  {
    id: 'vis-3',
    title: 'Abundance of Time & Artistic Freedom',
    statement: 'Generous financial flow arrives naturally as an outcome of dedicated high-craft creation and value gifted to the world.',
    category: 'Abundance & Wealth',
    targetYearOrDate: '2027',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    feeling: 'Effortless flow, serene autonomy, sovereign freedom',
    status: 'active',
    createdAt: '2026-10-10',
  },
  {
    id: 'vis-4',
    title: 'Sanctuary of Conscious Kinship',
    statement: 'Surrounding myself with luminous, intentional thinkers who illuminate the truth and cultivate heartfelt warmth.',
    category: 'Meaningful Connections',
    targetYearOrDate: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    feeling: 'Soulful understanding, gentle laughter, boundless trust',
    status: 'manifested',
    manifestedDate: '2026-10-20',
    gratitudeNote: 'Deeply grateful for the kindred spirits who entered my life during this celestial cycle.',
    createdAt: '2026-09-15',
  },
];

const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Complete Veira Android WebView APK Deployment',
    orbitCategory: 'Creative Craft',
    progress: 75,
    targetMetric: 'Production APK',
    currentMetric: '3/4 Assets Ready',
    deadline: '2026-11-15',
    milestones: [
      { id: 'm-1', title: 'Prepare high-performance webview shell & index.html', completed: true, completedAt: '2026-10-22' },
      { id: 'm-2', title: 'Integrate 432Hz ambient audio without gesture constraints', completed: true, completedAt: '2026-10-23' },
      { id: 'm-3', title: 'Compile release build with Proguard rules & Android 14 target', completed: true, completedAt: '2026-10-24' },
      { id: 'm-4', title: 'Verify nocturnal glassmorphism responsiveness on physical device', completed: false },
    ],
    notes: 'Follow the veira_android_studio_webview_apk_proje_dosyalar.md structure.',
    createdAt: '2026-10-18',
  },
  {
    id: 'goal-2',
    title: '40-Day Consecutive Dawn Stillness Ritual',
    orbitCategory: 'Mind & Spirit',
    progress: 60,
    targetMetric: '40 Days',
    currentMetric: '24 Days Completed',
    deadline: '2026-11-30',
    milestones: [
      { id: 'm-21', title: 'Reach 10-day initial threshold', completed: true, completedAt: '2026-10-10' },
      { id: 'm-22', title: 'Maintain orbit through travel weekend', completed: true, completedAt: '2026-10-18' },
      { id: 'm-23', title: 'Cross 25-day halfway mark', completed: false },
      { id: 'm-24', title: 'Complete full 40-day solar cycle celebration', completed: false },
    ],
    notes: 'Combine 15 minutes of 432Hz tone with written manifestation.',
    createdAt: '2026-10-01',
  },
  {
    id: 'goal-3',
    title: 'Curate 100 Contemplative Reflections',
    orbitCategory: 'Mind & Spirit',
    progress: 42,
    targetMetric: '100 Entries',
    currentMetric: '42 Entries Written',
    deadline: '2026-12-31',
    milestones: [
      { id: 'm-31', title: 'First 25 foundational reflections recorded', completed: true, completedAt: '2026-09-28' },
      { id: 'm-32', title: 'Reach 50 milestone entries in journal sanctuary', completed: false },
      { id: 'm-33', title: 'Publish editorial digest to personal archive', completed: false },
    ],
    createdAt: '2026-09-01',
  },
  {
    id: 'goal-4',
    title: 'Establish Sovereign Creative Studio Fund',
    orbitCategory: 'Abundance & Wealth',
    progress: 85,
    targetMetric: '$25,000 Reserve',
    currentMetric: '$21,250 Dedicated',
    deadline: '2026-12-15',
    milestones: [
      { id: 'm-41', title: 'Automate weekly starlight transfer', completed: true, completedAt: '2026-09-15' },
      { id: 'm-42', title: 'Reach $15,000 buffer mark', completed: true, completedAt: '2026-10-05' },
      { id: 'm-43', title: 'Finalize $25,000 milestone allocation', completed: false },
    ],
    createdAt: '2026-09-01',
  },
];

// Helper to get formatted dates
const getFormattedDate = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'hab-1',
    title: 'Dawn 432Hz Stillness & Breath',
    timeOfDay: 'dawn',
    orbitCategory: 'Mind & Spirit',
    streak: 18,
    bestStreak: 24,
    reminderTime: '06:30',
    history: {
      [getFormattedDate(0)]: true,
      [getFormattedDate(1)]: true,
      [getFormattedDate(2)]: true,
      [getFormattedDate(3)]: true,
      [getFormattedDate(4)]: true,
      [getFormattedDate(5)]: true,
      [getFormattedDate(6)]: true,
    },
  },
  {
    id: 'hab-2',
    title: 'Celestial Hydration & Herbal Tonic',
    timeOfDay: 'dawn',
    orbitCategory: 'Radiant Vitality',
    streak: 12,
    bestStreak: 19,
    reminderTime: '07:00',
    history: {
      [getFormattedDate(0)]: true,
      [getFormattedDate(1)]: true,
      [getFormattedDate(2)]: true,
      [getFormattedDate(3)]: true,
      [getFormattedDate(4)]: false,
      [getFormattedDate(5)]: true,
      [getFormattedDate(6)]: true,
    },
  },
  {
    id: 'hab-3',
    title: '90-Min Solitary Creative Deep Work',
    timeOfDay: 'anytime',
    orbitCategory: 'Creative Craft',
    streak: 9,
    bestStreak: 15,
    history: {
      [getFormattedDate(0)]: true,
      [getFormattedDate(1)]: true,
      [getFormattedDate(2)]: true,
      [getFormattedDate(3)]: true,
      [getFormattedDate(4)]: true,
      [getFormattedDate(5)]: true,
      [getFormattedDate(6)]: false,
    },
  },
  {
    id: 'hab-4',
    title: 'Dusk Written Gratitude & Release',
    timeOfDay: 'dusk',
    orbitCategory: 'Mind & Spirit',
    streak: 22,
    bestStreak: 30,
    reminderTime: '21:30',
    history: {
      [getFormattedDate(0)]: true,
      [getFormattedDate(1)]: true,
      [getFormattedDate(2)]: true,
      [getFormattedDate(3)]: true,
      [getFormattedDate(4)]: true,
      [getFormattedDate(5)]: true,
      [getFormattedDate(6)]: true,
    },
  },
  {
    id: 'hab-5',
    title: 'Digital Screen Disconnect 60m Pre-Sleep',
    timeOfDay: 'dusk',
    orbitCategory: 'Radiant Vitality',
    streak: 7,
    bestStreak: 14,
    reminderTime: '22:15',
    history: {
      [getFormattedDate(0)]: false,
      [getFormattedDate(1)]: true,
      [getFormattedDate(2)]: true,
      [getFormattedDate(3)]: true,
      [getFormattedDate(4)]: true,
      [getFormattedDate(5)]: false,
      [getFormattedDate(6)]: true,
    },
  },
];

const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'jrn-1',
    date: '2026-10-25T02:30:00.000Z',
    displayDate: 'October 25, 2026',
    title: 'The Architecture of Quiet Alignment',
    promptQuestion: 'What intention is quietly anchoring your mind tonight?',
    content: 'In the stillness of midnight, clarity returns like moonlight on still water. When noise strips away, only what is truly essential remains. The visions I carry are not distant mountains to conquer with brute force; they are seeds that unfurl through daily devotion and rhythmic discipline.',
    energy: 'Deep',
    tags: ['Clarity', 'Stillness', 'Vision'],
  },
  {
    id: 'jrn-2',
    date: '2026-10-23T21:15:00.000Z',
    displayDate: 'October 23, 2026',
    title: 'Surrendering the Rush for the Orbit',
    promptQuestion: 'Where did you notice effortless flow during this cycle?',
    content: 'Listening to 432Hz while working through complex design architecture made time dissolve. I realized that haste is a symptom of fear, while patience is the quiet confidence of someone who knows the celestial orbit will bring the season in due time.',
    energy: 'Transcendent',
    tags: ['Flow', 'Trust', '432Hz'],
  },
  {
    id: 'jrn-3',
    date: '2026-10-20T19:40:00.000Z',
    displayDate: 'October 20, 2026',
    title: 'Luminous Gratitude for Small Constellations',
    promptQuestion: 'What unexpected starlight touched your heart today?',
    content: 'An unexpected letter from an old companion. A warm tea savored with zero notifications. These small moments are not deviations from the Great Work—they are the very substance of it. Today my spirit feels warm, grounded, and luminous.',
    energy: 'Luminous',
    tags: ['Gratitude', 'Kindred', 'Simplicity'],
  },
];

export const StorageKeys = {
  VISIONS: 'veira_visions_v1',
  GOALS: 'veira_goals_v1',
  HABITS: 'veira_habits_v1',
  JOURNALS: 'veira_journals_v1',
  LANGUAGE: 'veira_language_v1', // 'en' | 'tr'
};

export function loadVisions(): VisionItem[] {
  try {
    const raw = localStorage.getItem(StorageKeys.VISIONS);
    return raw ? JSON.parse(raw) : INITIAL_VISIONS;
  } catch {
    return INITIAL_VISIONS;
  }
}

export function saveVisions(items: VisionItem[]) {
  try {
    localStorage.setItem(StorageKeys.VISIONS, JSON.stringify(items));
  } catch {
    // LocalStorage fallback
  }
}

export function loadGoals(): GoalItem[] {
  try {
    const raw = localStorage.getItem(StorageKeys.GOALS);
    return raw ? JSON.parse(raw) : INITIAL_GOALS;
  } catch {
    return INITIAL_GOALS;
  }
}

export function saveGoals(items: GoalItem[]) {
  try {
    localStorage.setItem(StorageKeys.GOALS, JSON.stringify(items));
  } catch {
    // LocalStorage fallback
  }
}

export function loadHabits(): HabitItem[] {
  try {
    const raw = localStorage.getItem(StorageKeys.HABITS);
    return raw ? JSON.parse(raw) : INITIAL_HABITS;
  } catch {
    return INITIAL_HABITS;
  }
}

export function saveHabits(items: HabitItem[]) {
  try {
    localStorage.setItem(StorageKeys.HABITS, JSON.stringify(items));
  } catch {
    // LocalStorage fallback
  }
}

export function loadJournals(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(StorageKeys.JOURNALS);
    return raw ? JSON.parse(raw) : INITIAL_JOURNALS;
  } catch {
    return INITIAL_JOURNALS;
  }
}

export function saveJournals(items: JournalEntry[]) {
  try {
    localStorage.setItem(StorageKeys.JOURNALS, JSON.stringify(items));
  } catch {
    // LocalStorage fallback
  }
}
