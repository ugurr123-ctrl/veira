import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Calendar,
  Tag,
  Feather,
  X,
  Compass,
} from 'lucide-react';
import { EnergyState, JournalEntry } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

interface JournalScreenProps {
  journals: JournalEntry[];
  onUpdateJournals: (journals: JournalEntry[]) => void;
  onTriggerConfetti: () => void;
}

const CONTEMPLATIVE_PROMPTS = [
  'What intention quietly anchored your mind today?',
  'Where did you notice effortless flow during this celestial cycle?',
  'What friction did you release into starlight stillness?',
  'Name three subtle gifts that went unnoticed by the world today.',
  'What truth is seeking expression in your craft right now?',
  'How does your highest future self look at this present moment?',
];

const ENERGY_STATES: Array<{ id: EnergyState; label: string; color: string; desc: string }> = [
  { id: 'Luminous', label: 'Luminous', color: '#F5D061', desc: 'Radiant warmth, joyful realization' },
  { id: 'Centered', label: 'Centered', color: '#38BDF8', desc: 'Calm groundedness, clarity of sight' },
  { id: 'Deep', label: 'Deep', color: '#818CF8', desc: 'Contemplative inquiry, subterranean focus' },
  { id: 'Transcendent', label: 'Transcendent', color: '#C0C1FF', desc: 'Cosmic synchronicity, boundless trust' },
  { id: 'Restful', label: 'Restful', color: '#908FA0', desc: 'Soft stillness, surrender and release' },
];

export const JournalScreen: React.FC<JournalScreenProps> = ({
  journals,
  onUpdateJournals,
  onTriggerConfetti,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnergyFilter, setSelectedEnergyFilter] = useState<EnergyState | 'all'>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  // New Entry Form State
  const [newTitle, setNewTitle] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(CONTEMPLATIVE_PROMPTS[0]);
  const [newContent, setNewContent] = useState('');
  const [newEnergy, setNewEnergy] = useState<EnergyState>('Centered');
  const [newTagsString, setNewTagsString] = useState('Stillness, Reflection');

  const filteredEntries = journals.filter((entry) => {
    const matchesEnergy = selectedEnergyFilter === 'all' || entry.energy === selectedEnergyFilter;
    const matchesQuery =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEnergy && matchesQuery;
  });

  const handleShufflePrompt = () => {
    const randomIndex = Math.floor(Math.random() * CONTEMPLATIVE_PROMPTS.length);
    setSelectedPrompt(CONTEMPLATIVE_PROMPTS[randomIndex]);
    audioEngine.playCelestialChime(648);
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const now = new Date();
    const displayDate = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const newEntry: JournalEntry = {
      id: `jrn-${Date.now()}`,
      date: now.toISOString(),
      displayDate,
      title: newTitle.trim(),
      promptQuestion: selectedPrompt,
      content: newContent.trim(),
      energy: newEnergy,
      tags: tags.length > 0 ? tags : ['Reflection'],
    };

    onUpdateJournals([newEntry, ...journals]);
    audioEngine.playCelestialChime(852);
    setIsComposeModalOpen(false);

    // Reset
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Sanctuary Header */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 md:p-10 border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#818cf8] tracking-widest uppercase font-medium">
              <BookOpen className="w-4 h-4 text-[#f5d061]" />
              <span>Sanctuary Journal & Nocturnal Contemplation</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-semibold text-[#fdf4dc] leading-tight">
              The Living Book of Inner Constellations
            </h1>

            <p className="text-[#c7c4d7] text-sm sm:text-base leading-relaxed">
              Quiet thoughts written under nocturnal serenity reveal the subterranean river of intentionality. Give voice to unhurried inquiry, gratitude, and transcendent realizations.
            </p>
          </div>

          <button
            onClick={() => setIsComposeModalOpen(true)}
            className="btn-celestial-primary text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Feather className="w-4 h-4" />
            <span>Write Contemplation</span>
          </button>
        </div>

        {/* Daily Inquiry Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#f5d061] tracking-wider block">
              Inquiry of the Night
            </span>
            <p className="font-editorial text-lg text-[#dee0ff] italic">
              "{selectedPrompt}"
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShufflePrompt}
              className="btn-ghost-glass px-3.5 py-1.5 rounded-full text-xs text-[#818cf8] hover:text-[#fdf4dc] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspire Query</span>
            </button>
            <button
              onClick={() => {
                setIsComposeModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#6366f1]/20 border border-[#818cf8]/40 text-[#fdf4dc] hover:bg-[#6366f1]/30 transition-all"
            >
              Respond
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Energy Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedEnergyFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedEnergyFilter === 'all'
                ? 'bg-[#6366f1]/30 text-[#fdf4dc] border border-[#818cf8]/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10 border border-white/10'
            }`}
          >
            All Reflections ({journals.length})
          </button>
          {ENERGY_STATES.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedEnergyFilter(state.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedEnergyFilter === state.id
                  ? 'bg-[#6366f1]/30 text-[#fdf4dc] border border-[#818cf8]/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10 border border-white/10'
              }`}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ backgroundColor: state.color }}
              />
              {state.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-[#c7c4d7]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries, tags..."
            className="w-full rounded-full bg-[#080a16]/80 border border-white/15 pl-9 pr-4 py-1.5 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
          />
        </div>
      </div>

      {/* Journal Entries List - Editorial Column */}
      <div className="space-y-6">
        {filteredEntries.map((entry) => {
          const energyMeta = ENERGY_STATES.find((e) => e.id === entry.energy) || ENERGY_STATES[0];

          return (
            <article
              key={entry.id}
              className="rounded-2xl glass-panel p-6 sm:p-8 space-y-4 hover:border-[#818cf8]/40 transition-all duration-300 group"
            >
              {/* Header: Date, Energy state, and Tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#c7c4d7]/70 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#818cf8]" />
                    {entry.displayDate}
                  </span>

                  <span className="text-white/20">·</span>

                  {/* Energy pill */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                    style={{
                      backgroundColor: `${energyMeta.color}15`,
                      borderColor: `${energyMeta.color}40`,
                      color: energyMeta.color,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: energyMeta.color }}
                    />
                    <span>{entry.energy} State</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-[#c7c4d7]/70 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Prompt question */}
              <div className="space-y-1.5">
                <h3 className="font-editorial text-2xl font-medium tracking-tight text-[#fdf4dc] group-hover:text-[#c0c1ff] transition-colors leading-snug">
                  {entry.title}
                </h3>

                {entry.promptQuestion && (
                  <p className="text-xs text-[#818cf8] font-serif italic">
                    In response to: "{entry.promptQuestion}"
                  </p>
                )}
              </div>

              {/* Editorial prose */}
              <p className="text-sm sm:text-base text-[#dee0ff]/90 leading-relaxed font-sans whitespace-pre-line">
                {entry.content}
              </p>
            </article>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
            <BookOpen className="w-8 h-8 text-[#818cf8] mx-auto opacity-70" />
            <h3 className="font-editorial text-lg text-[#fdf4dc]">No Reflections Found</h3>
            <p className="text-xs text-[#c7c4d7] max-w-sm mx-auto">
              Your sanctuary awaits your words. Inscribe the first contemplation of this cycle.
            </p>
            <button
              onClick={() => setIsComposeModalOpen(true)}
              className="btn-celestial-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 mt-2"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Compose Entry</span>
            </button>
          </div>
        )}
      </div>

      {/* Compose Entry Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl glass-panel-elevated p-6 border border-[#818cf8]/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#818cf8]">
                <Feather className="w-5 h-5 text-[#f5d061]" />
                <h3 className="font-editorial text-xl font-medium text-[#fdf4dc]">Inscribe Contemplation</h3>
              </div>
              <button
                onClick={() => setIsComposeModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Reflection Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., The Architecture of Sacred Silence"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              {/* Inquiry Prompt Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                    Guiding Inquiry
                  </label>
                  <button
                    type="button"
                    onClick={handleShufflePrompt}
                    className="text-[10px] text-[#f5d061] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Shuffle</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={selectedPrompt}
                  onChange={(e) => setSelectedPrompt(e.target.value)}
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none italic font-serif"
                />
              </div>

              {/* Energy State Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Dominant Energy State
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ENERGY_STATES.map((state) => (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => setNewEnergy(state.id)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        newEnergy === state.id
                          ? 'border-[#f5d061] bg-[#f5d061]/15 text-[#fdf4dc]'
                          : 'border-white/10 bg-white/5 text-[#c7c4d7] hover:border-white/20'
                      }`}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mb-1"
                        style={{ backgroundColor: state.color }}
                      />
                      <span className="block text-[11px] font-medium leading-tight">
                        {state.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content body */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Prose & Realizations
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Record your deepest realizations, feelings, or quiet gratitude without filter..."
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 p-3 text-xs sm:text-sm text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none leading-relaxed font-sans"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={newTagsString}
                  onChange={(e) => setNewTagsString(e.target.value)}
                  placeholder="Stillness, 432Hz, Vision, Flow"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#c7c4d7] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-celestial-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bind into Sanctuary</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
