import React, { useState } from 'react';
import { Sparkles, Plus, CheckCircle2, Calendar, Heart, Compass, Image as ImageIcon, X } from 'lucide-react';
import { OrbitCategory, VisionItem } from '../../types';
import { RadiantCategoryPill } from '../RadiantCategoryPill';
import { audioEngine } from '../../utils/audioEngine';

interface VisionManifestScreenProps {
  visions: VisionItem[];
  onUpdateVisions: (visions: VisionItem[]) => void;
  onTriggerConfetti: () => void;
}

const CATEGORIES: OrbitCategory[] = [
  'Mind & Spirit',
  'Creative Craft',
  'Radiant Vitality',
  'Abundance & Wealth',
  'Meaningful Connections',
];

const PRESET_IMAGES = [
  { label: 'Starlit Mountain', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cosmic Ocean', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Nocturnal Lake', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Celestial Aurora', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Minimalist Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
];

export const VisionManifestScreen: React.FC<VisionManifestScreenProps> = ({
  visions,
  onUpdateVisions,
  onTriggerConfetti,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<OrbitCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manifestModalItem, setManifestModalItem] = useState<VisionItem | null>(null);
  const [gratitudeNote, setGratitudeNote] = useState('');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newStatement, setNewStatement] = useState('');
  const [newCategory, setNewCategory] = useState<OrbitCategory>('Mind & Spirit');
  const [newTarget, setNewTarget] = useState('2026');
  const [newImageUrl, setNewImageUrl] = useState(PRESET_IMAGES[0].url);
  const [newFeeling, setNewFeeling] = useState('');

  const filteredVisions = visions.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  const activeCount = visions.filter((v) => v.status === 'active').length;
  const manifestedCount = visions.filter((v) => v.status === 'manifested').length;

  const handleCreateVision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStatement.trim()) return;

    const newItem: VisionItem = {
      id: `vis-${Date.now()}`,
      title: newTitle.trim(),
      statement: newStatement.trim(),
      category: newCategory,
      targetYearOrDate: newTarget.trim() || '2026',
      imageUrl: newImageUrl.trim() || PRESET_IMAGES[0].url,
      feeling: newFeeling.trim() || 'Deep alignment, serene gratitude',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateVisions([newItem, ...visions]);
    audioEngine.playCelestialChime(768);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewStatement('');
    setNewFeeling('');
  };

  const handleConfirmManifestation = () => {
    if (!manifestModalItem) return;

    const updated = visions.map((v) =>
      v.id === manifestModalItem.id
        ? {
            ...v,
            status: 'manifested' as const,
            manifestedDate: new Date().toISOString().split('T')[0],
            gratitudeNote: gratitudeNote.trim() || 'Manifested into physical reality with quiet grace.',
          }
        : v
    );

    onUpdateVisions(updated);
    audioEngine.playCelestialChime(972);
    onTriggerConfetti();
    setManifestModalItem(null);
    setGratitudeNote('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 md:p-10 border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#6366f1]/20 via-[#f5d061]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#818cf8] tracking-widest uppercase font-medium">
            <Sparkles className="w-4 h-4 text-[#f5d061]" />
            <span>Vision & Intentional Manifestation Sanctuary</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#fdf4dc] text-balance leading-tight">
            Align Your Desires with Celestial Stillness
          </h1>

          <p className="text-[#c7c4d7] text-sm sm:text-base leading-relaxed max-w-2xl">
            What is visualized with unhurried devotion crystallizes into reality. Anchor your intentions into clear vision cards, hold their energetic state, and witness their unfolding in time.
          </p>

          {/* Micro KPI Row */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#c7c4d7]/80">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold text-[#fdf4dc] tabular-nums">{activeCount}</span>
              <span>Active Intentions</span>
            </div>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold text-[#f5d061] tabular-nums">{manifestedCount}</span>
              <span>Manifested Stars</span>
            </div>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold text-[#38bdf8] tabular-nums">432 Hz</span>
              <span>Resonance Frequency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#6366f1]/30 text-[#fdf4dc] border border-[#818cf8]/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-white/5 text-[#c7c4d7] hover:bg-white/10 border border-white/10'
            }`}
          >
            All Intentions
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

        {/* Primary CTA */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-celestial-primary text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Vision Manifest</span>
        </button>
      </div>

      {/* Vision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisions.map((vision) => {
          const isManifested = vision.status === 'manifested';
          return (
            <div
              key={vision.id}
              className={`group relative rounded-2xl overflow-hidden glass-panel flex flex-col justify-between transition-all duration-300 ${
                isManifested
                  ? 'border-[#f5d061]/40 shadow-[0_0_24px_rgba(245,208,97,0.12)]'
                  : 'hover:border-[#818cf8]/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(99,102,241,0.18)]'
              }`}
            >
              {/* Card Image Cover with measured dark gradient overlay */}
              <div className="relative h-48 w-full overflow-hidden bg-[#0e1228]">
                <img
                  src={vision.imageUrl}
                  alt={vision.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Safe fallback container
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-[#141936]', 'to-[#0d1127]');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1127] via-[#0d1127]/50 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <RadiantCategoryPill category={vision.category} size="sm" />
                  <span className="text-[11px] font-medium tracking-wider text-[#fdf4dc] bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                    {vision.targetYearOrDate}
                  </span>
                </div>

                {/* Manifested Badge Overlay */}
                {isManifested && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5d061]/20 border border-[#f5d061]/60 backdrop-blur-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f5d061]" />
                    <span className="text-[11px] font-semibold text-[#fdf4dc] tracking-wide uppercase">
                      Manifested
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-editorial text-xl font-medium tracking-tight text-[#fdf4dc] leading-snug group-hover:text-[#c0c1ff] transition-colors">
                    {vision.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#dee0ff]/80 leading-relaxed italic font-serif">
                    "{vision.statement}"
                  </p>
                </div>

                {/* Emotional feeling vibration */}
                <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-2 text-[#c7c4d7]">
                    <Heart className="w-3.5 h-3.5 text-[#ec4899] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#c7c4d7]/60 block">Felt Vibration</span>
                      <span className="text-xs font-medium text-[#dee0ff]">{vision.feeling}</span>
                    </div>
                  </div>

                  {isManifested && vision.gratitudeNote && (
                    <div className="p-3 rounded-lg bg-[#f5d061]/10 border border-[#f5d061]/25 text-[#fdf4dc] text-xs">
                      <span className="block text-[10px] uppercase font-semibold text-[#f5d061] mb-1">
                        Gratitude Note ({vision.manifestedDate})
                      </span>
                      {vision.gratitudeNote}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#c7c4d7]/50">
                      Anchored {vision.createdAt}
                    </span>

                    {!isManifested ? (
                      <button
                        onClick={() => {
                          setManifestModalItem(vision);
                          setGratitudeNote('');
                        }}
                        className="btn-ghost-glass px-3 py-1.5 rounded-full text-xs font-medium text-[#f5d061] hover:text-white flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Manifested!</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#f5d061] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfilled</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVisions.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
          <Sparkles className="w-8 h-8 text-[#818cf8] mx-auto opacity-70" />
          <h3 className="font-editorial text-lg text-[#fdf4dc]">No Intentions in this Orbit Yet</h3>
          <p className="text-xs text-[#c7c4d7] max-w-sm mx-auto">
            Choose another category or anchor a new vision statement to cultivate your nocturnal sanctuary.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-celestial-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Intention</span>
          </button>
        </div>
      )}

      {/* Manifestation Confirmation Modal */}
      {manifestModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-[#f5d061]/40 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#f5d061]">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-editorial text-xl font-medium text-[#fdf4dc]">Celebrate Manifestation</h3>
              </div>
              <button
                onClick={() => setManifestModalItem(null)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#dee0ff]">
              You are marking <strong className="text-[#fdf4dc]">"{manifestModalItem.title}"</strong> as fulfilled into physical reality.
            </p>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#f5d061] block">
                Gratitude & Reflection Note
              </label>
              <textarea
                value={gratitudeNote}
                onChange={(e) => setGratitudeNote(e.target.value)}
                placeholder="How did this manifest? What feelings of quiet gratitude are present right now?"
                rows={3}
                className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 p-3 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#f5d061] focus:ring-1 focus:ring-[#f5d061] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setManifestModalItem(null)}
                className="px-4 py-2 rounded-full text-xs text-[#c7c4d7] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmManifestation}
                className="btn-celestial-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f5d061 0%, #e5b842 100%)',
                  color: '#080a16',
                }}
              >
                <Sparkles className="w-4 h-4 text-[#080a16]" />
                <span>Affirm & Manifest</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Vision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl glass-panel-elevated p-6 border border-[#818cf8]/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#818cf8]">
                <Sparkles className="w-5 h-5 text-[#f5d061]" />
                <h3 className="font-editorial text-xl font-medium text-[#fdf4dc]">Anchor New Vision Intention</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVision} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Vision Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Mastery of Nocturnal Design Craft"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Affirmation / Manifestation Statement
                </label>
                <textarea
                  required
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  placeholder="Write in present tense as already existing: 'I am creating elevated sanctuaries...'"
                  rows={2}
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                    Celestial Orbit Category
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
                    Target Timeframe / Year
                  </label>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="2026 or Winter Solstice"
                    className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Somatic Vibration & Feeling State
                </label>
                <input
                  type="text"
                  value={newFeeling}
                  onChange={(e) => setNewFeeling(e.target.value)}
                  placeholder="e.g., Deep tranquility, buoyant vitality, unhurried ease"
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none"
                />
              </div>

              {/* Imagery selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#818cf8] uppercase tracking-wider block">
                  Celestial Imagery
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setNewImageUrl(img.url)}
                      className={`relative rounded-lg overflow-hidden h-14 border transition-all ${
                        newImageUrl === img.url
                          ? 'border-[#f5d061] ring-2 ring-[#f5d061]/50 scale-105'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full rounded-xl bg-[#080a16]/70 border border-white/15 px-3 py-2 text-xs text-[#dee0ff] placeholder-[#c7c4d7]/40 focus:border-[#6366f1] outline-none mt-2"
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
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Anchor Into Orbit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
