import React, { useState, useEffect } from 'react';

interface VisionAiImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, title?: string) => void;
  initialTitle?: string;
  initialCategory?: string;
  onPlayChime?: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

interface CuratedPhoto {
  id: string;
  category: string;
  title: string;
  url: string;
}

const EXTENSIVE_CURATED_PHOTOS: CuratedPhoto[] = [
  // Spor Araba & Hız
  {
    id: 'car-1',
    category: 'Spor Araba',
    title: 'Porsche Sahil Yolu & Gün Batımı',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'car-2',
    category: 'Spor Araba',
    title: 'Kırmızı Süper Spor Araba',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'car-3',
    category: 'Spor Araba',
    title: 'Lüks Klasik Üstü Açık Sürüş',
    url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=85',
  },

  // Kariyer, Bolluk & Ev
  {
    id: 'c1',
    category: 'Kariyer & Bolluk',
    title: 'Como Gölü Kıyısında Tasarım Stüdyosu',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'c2',
    category: 'Kariyer & Bolluk',
    title: 'Minimalist Bağımsız Çalışma Alanı & Sabah Güneşi',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'c3',
    category: 'Kariyer & Bolluk',
    title: 'Modern Alp Villası & Yaratıcı Özgürlük',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
  },

  // Beden & Canlılık
  {
    id: 'b1',
    category: 'Beden & Canlılık',
    title: 'Göl Kenarında Sabah Koşusu & Zindelik',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'b2',
    category: 'Beden & Canlılık',
    title: 'Açık Havada Zen Yoga & Hücresel Nefes',
    url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'b3',
    category: 'Beden & Canlılık',
    title: 'Taze ve Renkli Sağlıklı Beslenme Kasesi',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85',
  },

  // Ruhsal Denge
  {
    id: 'r1',
    category: 'Ruhsal Denge',
    title: 'Altın Saat Meditasyonu & Dingin Zihin',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'r2',
    category: 'Ruhsal Denge',
    title: 'Yıldız Işığı Altında Gece Sükuneti',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
  },

  // Seyahat & Şehirler
  {
    id: 's1',
    category: 'Seyahat',
    title: 'Paris Eyfel Kulesi & Şehir Işıkları',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 's2',
    category: 'Seyahat',
    title: 'İtalya Kıyı Yollarında Özgür Sürüş',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  },

  // Müzik & Sanat
  {
    id: 'm1',
    category: 'Sanat & Müzik',
    title: 'Güneş Işığında Büyük Piyano',
    url: 'https://images.unsplash.com/photo-1520523839898-507127027582?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm2',
    category: 'Sanat & Müzik',
    title: 'Resim & Tasarım Sanat Stüdyosu',
    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm3',
    category: 'Sanat & Müzik',
    title: 'Kahve & İlham Veren Kitap Okuma Alanı',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85',
  },
];

const FAST_INSPIRATION_PRESETS = [
  { label: '🏎️ Kırmızı Spor Araba', prompt: 'Sleek modern red luxury sports car on a scenic coastal highway, sunset golden hour, photorealistic 8k' },
  { label: '🌿 Como Gölü & Villa', prompt: 'Lake Como Italy modern glass minimalist villa, floor-to-ceiling panoramic windows, calm turquoise water, 8k' },
  { label: '🧘 Zen Meditasyon', prompt: 'Peaceful zen meditation garden, morning mist, bamboo fountain, calm reflection, 8k photography' },
  { label: '🏃 Zinde Koşu & Sağlık', prompt: 'Fit inspiring athletic runner in mountain trail at sunrise, vibrant vitality, 8k' },
  { label: '🎹 Piyano & Müzik', prompt: 'Grand piano in a sunlit modern aesthetic room, sheet music, warm ambient lighting, 8k' },
  { label: '📚 Kitap & Yazarlık', prompt: 'Author wooden desk with published hardcover book, notebook, warm coffee cup, cozy library, 8k' },
  { label: '🗼 Paris Seyahati', prompt: 'Scenic view of Paris with Eiffel Tower at dusk, warm streetlights, romantic atmosphere, 8k' },
  { label: '🌌 Samanyolu & Kozmos', prompt: 'Clear starlit night sky with milky way galaxy over quiet lake, astrophotography 8k' },
];

export const VisionAiImageGeneratorModal: React.FC<VisionAiImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  initialTitle = '',
  onPlayChime,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'curated' | 'url'>('ai');

  // AI Generation State
  const [prompt, setPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Curated search filter
  const [curatedCategory, setCuratedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize prompt on modal open
  useEffect(() => {
    if (isOpen) {
      const baseTitle = initialTitle.trim() || 'Como Gölü Kıyısında Huzurlu Yaşam ve Çalışma';
      setPrompt(baseTitle);
      handleGenerate(baseTitle);
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const handleGenerate = async (targetPrompt?: string) => {
    const textToGen = (targetPrompt || prompt).trim();
    if (!textToGen) {
      onShowToast('Lütfen oluşturulacak vizyon için bir niyet yazın.', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/image/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToGen, aspectRatio: '4:5' }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const realUrl = data.imageUrl || data.aiLiveUrl || data.reliableUrl;
      setGeneratedImageUrl(realUrl);
      setFallbackUrl(data.reliableUrl || null);
    } catch (err) {
      console.warn('AI Generation error:', err);
      // Construct direct Pollinations prompt as client-side guarantee
      const seed = Math.floor(Math.random() * 900000) + 1000;
      const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(textToGen + ', photorealistic 8k, cinematic lighting')}?model=flux&width=1024&height=1024&seed=${seed}&nologo=true`;
      setGeneratedImageUrl(directUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectCurated = (photo: CuratedPhoto) => {
    if (onPlayChime) onPlayChime();
    onSelectImage(photo.url, photo.title);
    onShowToast(`"${photo.title}" seçildi ve vizyona bağlandı! ✨`, 'check');
    onClose();
  };

  const handleConfirmAiImage = () => {
    if (!generatedImageUrl) return;
    if (onPlayChime) onPlayChime();
    onSelectImage(generatedImageUrl, prompt.slice(0, 35));
    onShowToast('✦ Görsel vizyonuna mühürlendi! ✦', 'auto_awesome');
    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) {
      onShowToast('Lütfen geçerli bir görsel URL adresi girin.', 'warning');
      return;
    }
    if (onPlayChime) onPlayChime();
    onSelectImage(customUrl.trim(), prompt.slice(0, 35) || 'Kişisel Görsel');
    onShowToast('Özel görsel vizyonuna mühürlendi!', 'check');
    onClose();
  };

  // Filter curated photos
  const filteredCurated = EXTENSIVE_CURATED_PHOTOS.filter((p) => {
    const matchesCategory = curatedCategory === 'Tümü' || p.category === curatedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl max-h-[94vh] rounded-3xl bg-[#181427] border border-[#f5d061]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="p-4 border-b border-[#443b56]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#f5d061]/15 border border-[#f5d061]/40 flex items-center justify-center text-[#f5d061]">
              <span className="material-symbols-outlined text-[20px]">palette</span>
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#f2ecfd]">
                Vizyon Görsel Stüdyosu
              </h2>
              <p className="text-xs text-[#c9bfdc]">
                Yazdığın hedefe özel 8K yapay zeka görseli üret veya seç.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#231e36] hover:bg-[#2e2747] text-[#c9bfdc] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pt-3 shrink-0">
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#060411] border border-[#443b56]/40 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-[#f5d061]/25 text-[#f5d061] border border-[#f5d061]/50 shadow-[0_0_10px_rgba(245,208,97,0.25)]'
                  : 'text-[#c9bfdc] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Yapay Zeka</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curated')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-[#f5d061]/25 text-[#f5d061] border border-[#f5d061]/50 shadow-[0_0_10px_rgba(245,208,97,0.25)]'
                  : 'text-[#c9bfdc] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">photo_library</span>
              <span>Hazır Galeri</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-[#f5d061]/25 text-[#f5d061] border border-[#f5d061]/50 shadow-[0_0_10px_rgba(245,208,97,0.25)]'
                  : 'text-[#c9bfdc] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">link</span>
              <span>URL Yapıştır</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: AI GENERATION */}
          {activeTab === 'ai' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Prompt Input Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#f5d061] uppercase tracking-wider block">
                  Vizyon Niyet Cümlen (Ne Hayal Ediyorsun?)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerate();
                    }}
                    placeholder="Örn: Kırmızı spor araba sahil yolu, Como gölü villa, piyano..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#f5d061]"
                  />
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handleGenerate()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7f00ff] to-[#f5d061] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isGenerating ? 'sync' : 'auto_awesome'}
                    </span>
                    <span>{isGenerating ? 'Üretiliyor...' : 'Üret'}</span>
                  </button>
                </div>
              </div>

              {/* Fast Preset Chips */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#c9bfdc] font-medium block">Hızlı İlham Temaları:</span>
                <div className="flex flex-wrap gap-1.5">
                  {FAST_INSPIRATION_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(p.label.replace(/^.+?\s/, ''));
                        handleGenerate(p.prompt);
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[11px] text-[#f2ecfd] hover:text-[#f5d061] transition-all cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#060411] border-2 border-[#f5d061]/35 shadow-lg flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <span className="material-symbols-outlined text-[#f5d061] text-4xl animate-spin">
                      auto_awesome
                    </span>
                    <span className="text-xs font-semibold text-[#f2ecfd]">
                      8K Yapay Zeka Vizyonun Render Ediliyor...
                    </span>
                    <span className="text-[10px] text-[#c9bfdc]">
                      Flux motoru promptunu sinematik ışıkla işliyor
                    </span>
                  </div>
                ) : generatedImageUrl ? (
                  <>
                    <img
                      src={generatedImageUrl}
                      alt={prompt}
                      className="w-full h-full object-cover"
                      onError={() => {
                        if (fallbackUrl && generatedImageUrl !== fallbackUrl) {
                          setGeneratedImageUrl(fallbackUrl);
                        }
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#f5d061] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      <span>8K Fotogerçekçi Vizyon</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerate()}
                      title="Yeni bir varyasyon üret"
                      className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-black/75 hover:bg-black text-[#f2ecfd] border border-white/20 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#f5d061]">refresh</span>
                      <span>Farklı Varyasyon</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[#c9bfdc]">Görsel üretmek için yukarıdaki butona bas.</span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CURATED GALLERY */}
          {activeTab === 'curated' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Search & Category Pills */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: Araba, piyano, Como, yoga, Paris..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#f5d061]"
              />

              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {['Tümü', 'Spor Araba', 'Kariyer & Bolluk', 'Beden & Canlılık', 'Ruhsal Denge', 'Seyahat', 'Sanat & Müzik'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCuratedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                      curatedCategory === cat
                        ? 'bg-[#f5d061]/25 text-[#f5d061] border border-[#f5d061]/50'
                        : 'bg-[#231e36] text-[#c9bfdc] border border-[#443b56]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid Photos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {filteredCurated.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => handleSelectCurated(photo)}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-[#443b56]/40 hover:border-[#f5d061] cursor-pointer group shadow-sm transition-all"
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                      <span className="text-[10px] font-bold text-[#f2ecfd] line-clamp-1">{photo.title}</span>
                      <span className="text-[9px] text-[#f5d061]">{photo.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM URL / UPLOAD */}
          {activeTab === 'url' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#f5d061] uppercase tracking-wider block">
                  Fotoğraf Bağlantısı (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#f5d061]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2.5 rounded-xl bg-[#f5d061] text-[#141120] font-bold text-xs cursor-pointer active:scale-95"
                  >
                    Uygula
                  </button>
                </div>
              </div>

              {customUrl && (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#f5d061]/35">
                  <img src={customUrl} alt="Önizleme" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Confirm Button */}
        {activeTab === 'ai' && (
          <div className="p-4 border-t border-[#443b56]/40 bg-[#141120] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs text-[#c9bfdc] hover:text-white cursor-pointer"
            >
              Vazgeç
            </button>

            <button
              type="button"
              disabled={isGenerating || !generatedImageUrl}
              onClick={handleConfirmAiImage}
              className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#7f00ff] via-[#6f00be] to-[#f5d061] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(127,0,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Bu Görseli Vizyonuma Bağla</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
