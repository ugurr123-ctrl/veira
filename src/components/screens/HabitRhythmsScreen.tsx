import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Check,
  Sun,
  Moon,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { HabitItem, HabitTimeOfDay, OrbitCategory } from '../../types';
import { FlameStreakBadge } from '../FlameStreakBadge';
import { RadiantCategoryPill } from '../RadiantCategoryPill';
import { audioEngine } from '../../utils/audioEngine';

interface HabitRhythmsScreenProps {
  habits: HabitItem[];
  onUpdateHabits: (habits: HabitItem[]) => void;
  onTriggerConfetti: () => void;
}

const CATEGORIES: OrbitCategory[] = [
  'Mind & Spirit',
  'Creative Craft',
  'Radiant Vitality',
  'Abundance & Wealth',
  'Meaningful Connections',
];

export const HabitRhythmsScreen: React.FC<HabitRhythmsScreenProps> = ({
  habits,
  onUpdateHabits,
  onTriggerConfetti,
}) => {
  // 7-day window ending today
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [newTitle, setNewTitle] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<HabitTimeOfDay>('dawn');
  const [newCategory, setNewCategory] = useState<OrbitCategory>('Mind & Spirit');
  const [newReminder, setNewReminder] = useState('');

  // Generate 7 days (day -6 to day 0)
  const days = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i;
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNameTr = d.toLocaleDateString('tr-TR', { weekday: 'short' });
    const dayNum = d.getDate();
    return { offset, dateStr, dayName, dayNameTr, dayNum, isToday: offset === 0 };
  });

  const activeDateStr = days.find((d) => d.offset === selectedDayOffset)?.dateStr || days[6].dateStr;

  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;

      const currentStatus = Boolean(h.history[dateStr]);
      const nextStatus = !currentStatus;

      const newHistory = {
        ...h.history,
        [dateStr]: nextStatus,
      };

      // Recalculate streak
      let currentStreak = 0;
      for (let i = 0; i < 60; i++) {
        const checkD = new Date();
        checkD.setDate(checkD.getDate() - i);
        const checkStr = checkD.toISOString().split('T')[0];
        if (newHistory[checkStr]) {
          currentStreak++;
        } else {
          break;
        }
      }

      if (nextStatus) {
        audioEngine.playCelestialChime(912);
        if (currentStreak > 0 && currentStreak % 7 === 0) {
          onTriggerConfetti();
        }
      }

      return {
        ...h,
        history: newHistory,
        streak: currentStreak,
        bestStreak: Math.max(h.bestStreak, currentStreak),
      };
    });

    onUpdateHabits(updated);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `hab-${Date.now()}`,
      title: newTitle.trim(),
      timeOfDay: newTimeOfDay,
      orbitCategory: newCategory,
      streak: 0,
      bestStreak: 0,
      reminderTime: newReminder.trim() || undefined,
      history: {},
    };

    onUpdateHabits([newHabit, ...habits]);
    audioEngine.playCelestialChime(768);
    setIsAddModalOpen(false);

    setNewTitle('');
    setNewReminder('');
  };

  // Group by Time of Day
  const dawnHabits = habits.filter((h) => h.timeOfDay === 'dawn');
  const anytimeHabits = habits.filter((h) => h.timeOfDay === 'anytime' || h.timeOfDay === 'noon');
  const duskHabits = habits.filter((h) => h.timeOfDay === 'dusk');

  // Overall completion for selected day
  const completedTodayCount = habits.filter((h) => h.history[activeDateStr]).length;
  const dayCompletionPct = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and 7-day horizontal scroller */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-xs text-[#ec4899] tracking-widest uppercase font-medium">
              <Flame className="w-4 h-4 text-[#f5d061]" />
              <span>Diurnal Rhythms & Habit Cadence</span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-semibold text-[#fdf4dc] leading-tight">
              Honoring Daily Micro-Devotions
            </h1>

            <p className="text-xs sm:text-sm text-[#c7c4d7]">
              Small rituals practiced with constancy build unshakeable cosmic momentum. Track dawn intentions and dusk reflections.
            </p>
          </div>

          {/* Quick Consistency Starlight Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#080a16]/40 border border-white/10 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#818cf8] tracking-wider block">
                Selected Day Rhythm
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-2xl font-bold text-[#f5d061] tabular-nums">
                  {completedTodayCount}/{habits.length}
                </span>
                <span className="text-xs text-[#c7c4d7] tabular-nums">({dayCompletionPct}%)</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full border-2 border-[#6366f1]/30 flex items-center justify-center relative">
              <span className="font-editorial text-xs font-semibold text-[#dee0ff]">
                {dayCompletionPct}%
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Date Carousel */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {days.map((day) => {
              const isSelected = day.offset === selectedDayOffset;
              const countForDay = habits.filter((h) => h.history[day.dateStr]).length;
              const isPerfect = habits.length > 0 && countForDay === habits.length;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDayOffset(day.offset)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#6366f1]/30 to-[#818cf8]/20 border border-[#818cf8]/70 shadow-[0_0_15px_rgba(99,102,241,0.35)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#c7c4d7]/70">
                    {day.dayName}
                  </span>
                  <span
                    className={`font-editorial text-base sm:text-lg font-bold tabular-nums my-0.5 ${
                      isSelected ? 'text-[#fdf4dc]' : 'text-[#dee0ff]'
                    }`}
                  >
                    {day.dayNum}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {isPerfect ? (
                      <Sparkles className="w-2.5 h-2.5 text-[#f5d061]" />
                    ) : (
                      <span className="text-[9px] text-[#818cf8] tabular-nums font-mono">
                        {countForDay}/{habits.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-semibold text-[#818cf8] tracking-wider">
            Viewing:
          </span>
          <span className="text-xs font-mono font-medium text-[#fdf4dc] bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {activeDateStr} {selectedDayOffset === 0 ? '(Today)' : ''}
          </span>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-celestial-primary text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Rhythm</span>
        </button>
      </div>

      {/* Rhythms Columns / Sections */}
      <div className="space-y-6">
        {/* Dawn Rhythms */}
        {dawnHabits.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f5d061] uppercase tracking-wider">
              <Sun className="w-4 h-4" />
              <span>Dawn & Morning Rhythms</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dawnHabits.map((habit) => (
                <HabitRowCard
                  key={habit.id}
                  habit={habit}
                  dateStr={activeDateStr}
                  onToggle={() => handleToggleHabitDay(habit.id, activeDateStr)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Solar Deep Work / Anytime */}
        {anytimeHabits.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Solar Craft & Daytime Focus</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anytimeHabits.map((habit) => (
                <HabitRowCard
                  key={habit.id}
                  habit={habit}
                  dateStr={activeDateStr}
                  onToggle={() => handleToggleHabitDay(habit.id, activeDateStr)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dusk Rhythms */}
        {duskHabits.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#818cf8] uppercase tracking-wider">
              <Moon className="w-4 h-4" />
              <span>Dusk & Nocturnal Wind-Down</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {duskHabits.map((habit) => (
                <HabitRowCard
                  key={habit.id}
                  habit={habit}
                  dateStr={activeDateStr}
                  onToggle={() => handleToggleHabitDay(habit.id, activeDateStr)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-[#818cf8]/40 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ec4899]">
                <Flame className="w-5 h-5 text-[#f5d061]" />
                <h3 className="font-editorial text-xl font-medium text-[#fdf4dc]">Create Daily Rhythm</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Rhythm Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., 20 Minutes 432Hz Sound & Stillness"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                    Diurnal Timing
                  </label>
                  <select
                    value={newTimeOfDay}
                    onChange={(e) => setNewTimeOfDay(e.target.value as HabitTimeOfDay)}
                    className="w-full rounded-xl bg-[#080a16] border border-white/15 px-3 py-2 text-xs text-[#dee0ff] focus:border-[#6366f1] outline-none"
                  >
                    <option value="dawn">Dawn (Morning)</option>
                    <option value="noon">Noon / Daytime</option>
                    <option value="dusk">Dusk (Evening)</option>
                    <option value="anytime">Anytime Flexible</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                    Orbit Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as OrbitCategory)}
                    className="w-full rounded-xl bg-[#080a16] border border-white/15 px-3 py-2 text-xs text-[#dee0ff] focus:border-[#6366f1] outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Ideal Time Anchor (Optional)
                </label>
                <input
                  type="text"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  placeholder="e.g., 07:00 AM or Upon Waking"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#c7c4d7] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-celestial-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Establish Rhythm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface HabitRowCardProps {
  habit: HabitItem;
  dateStr: string;
  onToggle: () => void;
}

const HabitRowCard: React.FC<HabitRowCardProps> = ({ habit, dateStr, onToggle }) => {
  const isDone = Boolean(habit.history[dateStr]);

  return (
    <div
      onClick={onToggle}
      className={`group rounded-2xl glass-panel p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 select-none ${
        isDone
          ? 'border-[#f5d061]/35 bg-[#6366f1]/10'
          : 'hover:border-[#818cf8]/40 hover:bg-white/5 active:scale-[0.99]'
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Check Circle Button */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isDone
              ? 'bg-gradient-to-br from-[#f5d061] to-[#e5b842] text-[#080a16] shadow-[0_0_14px_rgba(245,208,97,0.4)] scale-105'
              : 'border border-white/20 text-transparent group-hover:border-[#818cf8]'
          }`}
        >
          <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Title and Category */}
        <div className="min-w-0 space-y-1">
          <h4
            className={`text-sm sm:text-base font-medium truncate leading-tight transition-colors ${
              isDone ? 'text-[#fdf4dc] line-through opacity-85' : 'text-[#dee0ff]'
            }`}
          >
            {habit.title}
          </h4>

          <div className="flex items-center gap-2 text-[11px] text-[#c7c4d7]/70">
            <span>{habit.orbitCategory}</span>
            {habit.reminderTime && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5 font-mono">
                  <Clock className="w-2.5 h-2.5 text-[#818cf8]" />
                  {habit.reminderTime}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Flame Streak Badge */}
      <FlameStreakBadge streak={habit.streak} />
    </div>
  );
};
