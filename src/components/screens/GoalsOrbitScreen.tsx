import React, { useState } from 'react';
import { Compass, Plus, CheckCircle2, Circle, Calendar, Target, ChevronRight, X, Sparkles } from 'lucide-react';
import { GoalItem, Milestone, OrbitCategory } from '../../types';
import { AstralProgressRing } from '../AstralProgressRing';
import { RadiantCategoryPill } from '../RadiantCategoryPill';
import { audioEngine } from '../../utils/audioEngine';
import { triggerNeurologicalReinforcement } from '../../utils/neurologicalFeedback';

interface GoalsOrbitScreenProps {
  goals: GoalItem[];
  onUpdateGoals: (goals: GoalItem[]) => void;
  onTriggerConfetti: () => void;
}

const CATEGORIES: OrbitCategory[] = [
  'Mind & Spirit',
  'Creative Craft',
  'Radiant Vitality',
  'Abundance & Wealth',
  'Meaningful Connections',
];

export const GoalsOrbitScreen: React.FC<GoalsOrbitScreenProps> = ({
  goals,
  onUpdateGoals,
  onTriggerConfetti,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<OrbitCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pulsingMilestoneId, setPulsingMilestoneId] = useState<string | null>(null);
  const [pulsingGoalId, setPulsingGoalId] = useState<string | null>(null);

  // New goal form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<OrbitCategory>('Creative Craft');
  const [newTargetMetric, setNewTargetMetric] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [milestonesList, setMilestonesList] = useState<string[]>(['', '']);

  const filteredGoals = goals.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.orbitCategory === selectedCategory;
  });

  // Calculate overall celestial alignment progress
  const totalProgressSum = goals.reduce((acc, g) => acc + g.progress, 0);
  const averageProgress = goals.length > 0 ? Math.round(totalProgressSum / goals.length) : 0;
  const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const completedMilestones = goals.reduce(
    (acc, g) => acc + g.milestones.filter((m) => m.completed).length,
    0
  );

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map((goal) => {
      if (goal.id !== goalId) return goal;

      const updatedMilestones = goal.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        const willBeCompleted = !m.completed;
        if (willBeCompleted) {
          triggerNeurologicalReinforcement({ pitch: 1080 });
          setPulsingMilestoneId(milestoneId);
          setTimeout(() => setPulsingMilestoneId((prev) => (prev === milestoneId ? null : prev)), 850);
        }
        return {
          ...m,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      });

      // Recalculate progress based on milestones
      const doneCount = updatedMilestones.filter((m) => m.completed).length;
      const newProgress = Math.round((doneCount / updatedMilestones.length) * 100);

      if (newProgress === 100 && goal.progress < 100) {
        triggerNeurologicalReinforcement({ pitch: 1200 });
        setPulsingGoalId(goalId);
        setTimeout(() => setPulsingGoalId((prev) => (prev === goalId ? null : prev)), 850);
        onTriggerConfetti();
      }

      return {
        ...goal,
        milestones: updatedMilestones,
        progress: newProgress,
      };
    });

    onUpdateGoals(updated);
  };

  const handleTapMilestone = (goalId: string, milestone: Milestone) => {
    if (milestone.completed) {
      triggerNeurologicalReinforcement({ pitch: 963 });
      setPulsingMilestoneId(milestone.id);
      setTimeout(() => setPulsingMilestoneId((prev) => (prev === milestone.id ? null : prev)), 850);
    } else {
      handleToggleMilestone(goalId, milestone.id);
    }
  };

  const handleTapCompletedGoal = (goalId: string) => {
    triggerNeurologicalReinforcement({ pitch: 963 });
    setPulsingGoalId(goalId);
    setTimeout(() => setPulsingGoalId((prev) => (prev === goalId ? null : prev)), 850);
  };

  const handleAddMilestoneInput = () => {
    setMilestonesList([...milestonesList, '']);
  };

  const handleMilestoneTextChange = (index: number, text: string) => {
    const updated = [...milestonesList];
    updated[index] = text;
    setMilestonesList(updated);
  };

  const handleRemoveMilestoneInput = (index: number) => {
    if (milestonesList.length <= 1) return;
    setMilestonesList(milestonesList.filter((_, i) => i !== index));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const validMilestones: Milestone[] = milestonesList
      .filter((m) => m.trim().length > 0)
      .map((text, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: text.trim(),
        completed: false,
      }));

    if (validMilestones.length === 0) {
      validMilestones.push({
        id: `m-${Date.now()}-0`,
        title: 'Initial manifestation checkpoint',
        completed: false,
      });
    }

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      orbitCategory: newCategory,
      progress: 0,
      targetMetric: newTargetMetric.trim() || 'Milestone Completion',
      currentMetric: `0/${validMilestones.length} Completed`,
      deadline: newDeadline || '2026-12-31',
      milestones: validMilestones,
      notes: newNotes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateGoals([newGoal, ...goals]);
    audioEngine.playCelestialChime(720);
    setIsAddModalOpen(false);

    // Reset
    setNewTitle('');
    setNewTargetMetric('');
    setNewDeadline('');
    setNewNotes('');
    setMilestonesList(['', '']);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Orbit Summary Card */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#818cf8] tracking-widest uppercase font-medium">
              <Compass className="w-4 h-4 text-[#38bdf8]" />
              <span>Celestial Goals & Orbital Alignment</span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-semibold text-[#fdf4dc] leading-tight">
              Orbital Momentum Across All Dimensions
            </h1>

            <p className="text-xs sm:text-sm text-[#c7c4d7] leading-relaxed">
              Every milestone achieved shifts the cosmic gravity of your trajectory. Track tangible checkpoints with astral precision.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-6 pt-1 text-xs text-[#c7c4d7]/80">
              <div>
                <span className="font-editorial text-xl font-bold text-[#fdf4dc] tabular-nums block">{goals.length}</span>
                <span className="text-[11px]">Active Goals</span>
              </div>
              <span className="text-white/20">/</span>
              <div>
                <span className="font-editorial text-xl font-bold text-[#f5d061] tabular-nums block">
                  {completedMilestones}/{totalMilestones}
                </span>
                <span className="text-[11px]">Milestones Reached</span>
              </div>
              <span className="text-white/20">/</span>
              <div>
                <span className="font-editorial text-xl font-bold text-[#38bdf8] tabular-nums block">
                  {goals.filter((g) => g.progress === 100).length}
                </span>
                <span className="text-[11px]">Fulfilled Orbits</span>
              </div>
            </div>
          </div>

          {/* Master Astral Progress Ring */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#080a16]/40 border border-white/10 shrink-0">
            <AstralProgressRing
              progress={averageProgress}
              size={120}
              strokeWidth={9}
              label={`${averageProgress}%`}
              sublabel="Orbit Alignment"
            />
          </div>
        </div>
      </section>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#6366f1]/30 text-[#fdf4dc] border border-[#818cf8]/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10 border border-white/10'
            }`}
          >
            All Orbits
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#6366f1]/30 text-[#fdf4dc] border border-[#818cf8]/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-celestial-primary text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Orbital Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const completedCount = goal.milestones.filter((m) => m.completed).length;
          const isComplete = goal.progress === 100;
          const isGoalPulsing = pulsingGoalId === goal.id;

          return (
            <div
              key={goal.id}
              onClick={isComplete ? () => handleTapCompletedGoal(goal.id) : undefined}
                  className={`relative rounded-2xl glass-panel p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden ${
                    isGoalPulsing
                      ? 'animate-neural-pulse border-[#f5d061] shadow-[0_0_28px_rgba(245,208,97,0.35)]'
                      : isComplete
                      ? 'border-[#f5d061]/40 shadow-[0_0_24px_rgba(245,208,97,0.1)] cursor-pointer select-none'
                      : 'hover:border-[#818cf8]/35'
                  }`}
                >
                  {isGoalPulsing && (
                    <span className="absolute inset-0 rounded-2xl border-2 border-[#f5d061]/80 animate-synaptic-halo pointer-events-none" />
                  )}

                  {/* Header with Title and Astral Ring */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <RadiantCategoryPill category={goal.orbitCategory} size="sm" />
                        {isGoalPulsing && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5d061]/20 text-[#f5d061] font-bold border border-[#f5d061]/40 animate-pulse">
                            ⚡ Nöral Pekiştirme
                          </span>
                        )}
                        <span className="text-[11px] text-[#c7c4d7]/70 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-[#818cf8]" />
                          <span>Due {goal.deadline}</span>
                        </span>
                      </div>

                      <h3 className="font-editorial text-xl font-medium tracking-tight text-[#fdf4dc] leading-snug">
                        {goal.title}
                      </h3>

                      {goal.notes && (
                        <p className="text-xs text-[#c7c4d7]/80 line-clamp-2 leading-relaxed">
                          {goal.notes}
                        </p>
                      )}
                    </div>

                    {/* Individual Goal Astral Progress Ring */}
                    <div
                      onClick={(e) => {
                        if (isComplete) {
                          e.stopPropagation();
                          handleTapCompletedGoal(goal.id);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <AstralProgressRing
                        progress={goal.progress}
                        size={76}
                        strokeWidth={6}
                        label={`${goal.progress}%`}
                      />
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#818cf8]">
                        Orbital Milestones ({completedCount}/{goal.milestones.length})
                      </span>
                      <span className="text-[11px] text-[#c7c4d7]/60 font-mono">
                        {goal.targetMetric}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => {
                        const isMilestonePulsing = pulsingMilestoneId === milestone.id;

                        return (
                          <div
                            key={milestone.id}
                            onClick={() => handleTapMilestone(goal.id, milestone)}
                            className={`relative w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs cursor-pointer select-none border overflow-hidden ${
                              isMilestonePulsing
                                ? 'animate-neural-pulse border-[#f5d061] shadow-[0_0_20px_rgba(245,208,97,0.45)]'
                                : milestone.completed
                                ? 'bg-[#6366f1]/15 text-[#dee0ff] border-white/10 hover:border-[#f5d061]/40'
                                : 'bg-white/5 hover:bg-white/10 text-[#dee0ff] border-white/5 hover:border-white/15'
                            }`}
                          >
                            {isMilestonePulsing && (
                              <span className="absolute inset-0 rounded-xl border-2 border-[#f5d061]/80 animate-synaptic-halo pointer-events-none" />
                            )}

                            {milestone.completed ? (
                              <div className="relative shrink-0">
                                {isMilestonePulsing && (
                                  <span className="absolute -inset-1 rounded-full border border-[#f5d061] animate-ping opacity-75 pointer-events-none" />
                                )}
                                <CheckCircle2 className={`w-4 h-4 text-[#f5d061] ${isMilestonePulsing ? 'animate-neural-check' : ''}`} />
                              </div>
                            ) : (
                              <Circle className="w-4 h-4 text-[#818cf8] hover:text-[#dee0ff] shrink-0" />
                            )}

                            <span className={`flex-1 font-medium leading-tight ${milestone.completed ? 'text-[#fdf4dc]' : ''}`}>
                              {milestone.title}
                            </span>

                            {isMilestonePulsing && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f5d061]/20 text-[#f5d061] font-bold border border-[#f5d061]/40 animate-pulse shrink-0">
                                Pekiştirildi ⚡
                              </span>
                            )}

                            {milestone.completedAt && (
                              <span className="text-[10px] text-[#f5d061]/80 font-mono shrink-0">
                                {milestone.completedAt}
                              </span>
                            )}

                            {milestone.completed && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleMilestone(goal.id, milestone.id);
                                }}
                                title="Geri Al"
                                className="p-1 rounded-full text-[#c7c4d7]/40 hover:text-[#f5d061] hover:bg-white/5 transition-colors shrink-0"
                              >
                                <span className="text-[11px] font-mono">↺</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Completion Banner with Neurological Feedback */}
                  {isComplete && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTapCompletedGoal(goal.id);
                      }}
                      className="p-3 rounded-xl bg-[#f5d061]/15 border border-[#f5d061]/40 flex items-center justify-between text-xs text-[#fdf4dc] cursor-pointer hover:bg-[#f5d061]/25 transition-all shadow-[0_0_16px_rgba(245,208,97,0.15)] active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#f5d061] animate-spin" style={{ animationDuration: '8s' }} />
                        <span className="font-semibold">Orbital Milestone Completed</span>
                      </div>
                      <span className="text-[11px] text-[#f5d061] uppercase tracking-wider font-bold">
                        {isGoalPulsing ? 'Pekiştirildi ⚡' : 'Ascended'}
                      </span>
                    </div>
                  )}
                </div>
              );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
          <Compass className="w-8 h-8 text-[#38bdf8] mx-auto opacity-70" />
          <h3 className="font-editorial text-lg text-[#fdf4dc]">No Goals in this Orbit</h3>
          <p className="text-xs text-[#c7c4d7] max-w-sm mx-auto">
            Design a new orbital goal to bring structured cadence to your journey.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-celestial-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      )}

      {/* New Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl glass-panel-elevated p-6 border border-[#818cf8]/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#38bdf8]">
                <Compass className="w-5 h-5 text-[#818cf8]" />
                <h3 className="font-editorial text-xl font-medium text-[#fdf4dc]">Design Orbital Goal</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Launch Veira APK on Physical Devices"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] focus:border-[#6366f1] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Target Metric or Deliverable
                </label>
                <input
                  type="text"
                  value={newTargetMetric}
                  onChange={(e) => setNewTargetMetric(e.target.value)}
                  placeholder="e.g., Production APK, 40 Days, $25k Reserve"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Contemplative Notes / Context
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key principles or references to honor during execution..."
                  rows={2}
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              {/* Milestones Breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                    Milestone Checkpoints
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMilestoneInput}
                    className="text-[11px] text-[#f5d061] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Checkpoint</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {milestonesList.map((mText, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#c7c4d7]/50 font-mono w-4 text-right">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={mText}
                        onChange={(e) => handleMilestoneTextChange(idx, e.target.value)}
                        placeholder={`Milestone checkpoint #${idx + 1}`}
                        className="flex-1 rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-1.5 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                      />
                      {milestonesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestoneInput(idx)}
                          className="p-1 text-[#c7c4d7]/60 hover:text-[#ffb4ab]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                  <Compass className="w-3.5 h-3.5" />
                  <span>Launch Orbital Goal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
