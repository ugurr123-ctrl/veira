export type OrbitCategory = 
  | 'Mind & Spirit'
  | 'Creative Craft'
  | 'Radiant Vitality'
  | 'Abundance & Wealth'
  | 'Meaningful Connections';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  orbitCategory: OrbitCategory;
  progress: number; // 0 to 100
  targetMetric: string;
  currentMetric: string;
  deadline: string;
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
}

export interface VisionItem {
  id: string;
  title: string;
  statement: string;
  category: OrbitCategory;
  targetYearOrDate: string;
  imageUrl: string;
  videoUrl?: string; // Optional motion video URL
  feeling: string;
  status: 'active' | 'manifested';
  manifestedDate?: string;
  gratitudeNote?: string;
  createdAt: string;
}

export type HabitTimeOfDay = 'dawn' | 'noon' | 'dusk' | 'anytime';

export interface HabitItem {
  id: string;
  title: string;
  timeOfDay: HabitTimeOfDay;
  orbitCategory: OrbitCategory;
  streak: number;
  bestStreak: number;
  history: Record<string, boolean>; // 'YYYY-MM-DD' -> true
  reminderTime?: string;
}

export type EnergyState = 'Luminous' | 'Centered' | 'Deep' | 'Transcendent' | 'Restful';

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  displayDate: string;
  title: string;
  promptQuestion?: string;
  content: string;
  energy: EnergyState;
  tags: string[];
}

export interface SolfeggioFrequency {
  id: string;
  freq: number;
  name: string;
  subtitle: string;
  description: string;
  chakraOrBenefit: string;
  color: string;
}

export interface DailyTask {
  id: string;
  visionId: string;
  visionTitle?: string;
  title: string;
  estimatedMinutes?: number;
  completed: boolean;
  completedAt?: string;
}

export interface MiniTask {
  id: string;
  visionId: string;
  stepNumber: number;
  title: string;
  desc?: string;
  completed: boolean;
}

export interface UnifiedVisionGoal {
  id: string;
  title: string;
  category: string;
  categoryKey: 'career' | 'wellness' | 'spirit' | 'travel' | 'growth';
  categoryLabel: string;
  horizon: string; // e.g. "3 Ay", "2027", "1 Yıl"
  why: string; // Neden önemli / Vizyonun temeli
  imageUrl: string;
  videoUrl?: string; // Optional motion video URL
  badge?: string;
  status: 'active' | 'achieved';
  createdAt: string;
  dailyTasks: DailyTask[];
  miniTasks: MiniTask[];
}
