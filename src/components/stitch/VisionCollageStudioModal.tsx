import React, { useState, useRef, useEffect } from 'react';
import { UnifiedVisionGoal } from '../../types';

interface VisionCollageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  visions: UnifiedVisionGoal[];
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime: () => void;
}

export type CollageLayoutMode = 'lockscreen' | 'moodboard';
export type CollageTheme = 'nocturnal' | 'como' | 'gold' | 'zen';

interface CollagePhotoItem {
  id: string;
  url: string;
  title: string;
  category?: string;
}

const AFFIRMATION_PRESETS = [
  '2026 BENİM YILIM · HER GÜN SAKİN, DİNGİN VE GÜÇLÜ',
  'HER GÜN HAYALLERİME 15 DAKİKA DAHA YAKINIM',
  'BOLLUK, SAĞLIK VE DERİN BİR HUZUR İÇİNDEYİM',
  'ZİHNİM SAKİN, ODAĞIM BERRAK, YOLUM AÇIK',
  'HÜCRESEL CANLILIK, ESNEKLİK VE DİNGİN GÜÇ',
  'BAĞIMSIZ, ÖZGÜR VE İLHAM DOLU BİR YAŞAM',
];

const CURATED_COLLAGE_PHOTOS = [
  {
    title: 'Como Gölü Villa',
    category: 'Kariyer & Yaşam',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Porsche Sahil Yolu',
    category: 'Seyahat & Hız',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Huzurlu Çalışma Alanı',
    category: 'Kariyer',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Zen Meditasyon',
    category: 'Ruhsal Denge',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Alp Dağları & Doğa',
    category: 'Seyahat',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Fit & Canlı Beden',
    category: 'Beden',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Samanyolu & Yıldızlar',
    category: 'Kozmik Güç',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Büyük Piyano',
    category: 'Sanat & Müzik',
    url: 'https://images.unsplash.com/photo-1520523839898-507127027582?auto=format&fit=crop&w=800&q=80',
  },
];

export const VisionCollageStudioModal: React.FC<VisionCollageStudioModalProps> = ({
  isOpen,
  onClose,
  visions,
  onShowToast,
  onPlayChime,
}) => {
  if (!isOpen) return null;

  // Selected format and styling
  const [layoutMode, setLayoutMode] = useState<CollageLayoutMode>('lockscreen');
  const [theme, setTheme] = useState<CollageTheme>('nocturnal');
  const [affirmationText, setAffirmationText] = useState<string>(AFFIRMATION_PRESETS[0]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showAddSheet, setShowAddSheet] = useState<boolean>(false);

  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time for lock screen simulation
  const [currentTimeStr, setCurrentTimeStr] = useState('09:41');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentTimeStr(
      now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    );
    setCurrentDateStr(
      now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    );
  }, []);

  // Photos loaded into the collage
  const [photos, setPhotos] = useState<CollagePhotoItem[]>(() => {
    const fromVisions: CollagePhotoItem[] = visions.slice(0, 6).map((v, idx) => ({
      id: `p-${v.id}-${idx}`,
      url: v.imageUrl,
      title: v.title,
      category: v.category,
    }));

    if (fromVisions.length >= 4) return fromVisions;

    const defaults: CollagePhotoItem[] = CURATED_COLLAGE_PHOTOS.slice(0, 4).map((c, i) => ({
      id: `def-${i}`,
      url: c.url,
      title: c.title,
      category: c.category,
    }));

    return [...fromVisions, ...defaults].slice(0, 4);
  });

  const handleFillFromVisions = () => {
    if (visions.length === 0) {
      onShowToast('Henüz kayıtlı bir vizyonun yok. Galeriden görsel ekleyebilirsin.', 'info');
      return;
    }
    const fromVisions: CollagePhotoItem[] = visions.slice(0, 6).map((v, idx) => ({
      id: `pv-${v.id}-${idx}-${Date.now()}`,
      url: v.imageUrl,
      title: v.title,
      category: v.category,
    }));
    setPhotos(fromVisions);
    onPlayChime();
    onShowToast('✦ Vizyonların kolaja dolduruldu! ✦', 'auto_awesome');
  };

  const handleAddPhoto = (item: (typeof CURATED_COLLAGE_PHOTOS)[0]) => {
    if (photos.length >= 6) {
      onShowToast('Kolaj en fazla 6 görsel barındırabilir.', 'warning');
      return;
    }
    const newP: CollagePhotoItem = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: item.url,
      title: item.title,
      category: item.category,
    };
    setPhotos((prev) => [...prev, newP]);
    onPlayChime();
    onShowToast(`"${item.title}" kolaja eklendi!`, 'add_photo_alternate');
  };

  const handleRemovePhoto = (id: string) => {
    if (photos.length <= 2) {
      onShowToast('Kolajda en az 2 görsel bulunmalıdır.', 'warning');
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (photos.length >= 6) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newP: CollagePhotoItem = {
            id: `p-up-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            url: dataUrl,
            title: file.name.replace(/\.[^/.]+$/, '').slice(0, 20) || 'Kişisel Görsel',
            category: 'Yükleme',
          };
          setPhotos((prev) => [...prev, newP]);
          onPlayChime();
          onShowToast('Fotoğraf kolaja eklendi! 📸', 'upload');
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Safe Image loader for canvas
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => resolve(fallback);
        fallback.src =
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23201e2d"/><text x="50%" y="50%" fill="%23f5d061" font-size="24" text-anchor="middle" dominant-baseline="middle">Veira</text></svg>';
      };
      img.src = url;
    });
  };

  // Export collage to high-res PNG wallpaper
  const handleExportWallpaper = async () => {
    setIsExporting(true);
    onPlayChime();
    onShowToast('HD Duvar Kağıdı render ediliyor... 🎨', 'palette');

    try {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Context not found');

      const width = 1080;
      const height = 1920;
      canvas.width = width;
      canvas.height = height;

      // Draw background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (theme === 'nocturnal') {
        bgGrad.addColorStop(0, '#0a0715');
        bgGrad.addColorStop(0.5, '#181427');
        bgGrad.addColorStop(1, '#060411');
      } else if (theme === 'como') {
        bgGrad.addColorStop(0, '#03191e');
        bgGrad.addColorStop(0.5, '#0b3948');
        bgGrad.addColorStop(1, '#020b0e');
      } else if (theme === 'gold') {
        bgGrad.addColorStop(0, '#1c1505');
        bgGrad.addColorStop(0.5, '#2e2307');
        bgGrad.addColorStop(1, '#0f0b02');
      } else {
        bgGrad.addColorStop(0, '#061a14');
        bgGrad.addColorStop(0.5, '#0e2e24');
        bgGrad.addColorStop(1, '#030d0a');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Top Clock & Date
      if (layoutMode === 'lockscreen') {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '300 24px Manrope, sans-serif';
        ctx.fillText(currentDateStr.toUpperCase(), width / 2, 230);

        ctx.font = '200 110px EB Garamond, Georgia, serif';
        ctx.fillText(currentTimeStr, width / 2, 360);
      }

      // Draw Grid / Mosaic photos
      const loadedImages = await Promise.all(photos.map((p) => loadImage(p.url)));
      const startY = layoutMode === 'lockscreen' ? 440 : 160;
      const availableHeight = layoutMode === 'lockscreen' ? 1220 : 1580;

      // 4 or 6 item 2-column grid
      const cols = 2;
      const rows = Math.ceil(loadedImages.length / cols);
      const gap = 20;
      const padding = 50;
      const cellWidth = (width - padding * 2 - gap * (cols - 1)) / cols;
      const cellHeight = (availableHeight - gap * (rows - 1)) / rows;

      loadedImages.forEach((img, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = padding + col * (cellWidth + gap);
        const y = startY + row * (cellHeight + gap);

        ctx.save();
        // Rounded rectangle clip
        const radius = 24;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + cellWidth - radius, y);
        ctx.quadraticCurveTo(x + cellWidth, y, x + cellWidth, y + radius);
        ctx.lineTo(x + cellWidth, y + cellHeight - radius);
        ctx.quadraticCurveTo(x + cellWidth, y + cellHeight, x + cellWidth - radius, y + cellHeight);
        ctx.lineTo(x + radius, y + cellHeight);
        ctx.quadraticCurveTo(x, y + cellHeight, x, y + cellHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

        // Aspect Fill Draw
        const imgRatio = img.width / img.height;
        const cellRatio = cellWidth / cellHeight;
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (imgRatio > cellRatio) {
          sWidth = img.height * cellRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / cellRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, cellWidth, cellHeight);

        // Gold border stroke
        ctx.restore();
        ctx.strokeStyle = 'rgba(245, 208, 97, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, y, cellWidth, cellHeight, 24);
        ctx.stroke();
      });

      // Bottom Affirmation Quote Banner
      ctx.fillStyle = 'rgba(10, 7, 21, 0.85)';
      ctx.beginPath();
      ctx.roundRect(60, height - 160, width - 120, 90, 45);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 208, 97, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f5d061';
      ctx.font = '600 22px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`✦ ${affirmationText} ✦`, width / 2, height - 105);

      // Download trigger
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `veira-vision-wallpaper-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onShowToast('✦ HD Duvar Kağıdın başarıyla indirildi! ✦', 'download');
    } catch (err) {
      console.error('Collage export failed:', err);
      onShowToast('Dışa aktarma sırasında hata oluştu.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl max-h-[94vh] rounded-3xl bg-[#181427] border border-[#f5d061]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#443b56]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#f5d061]/15 border border-[#f5d061]/40 flex items-center justify-center text-[#f5d061]">
              <span className="material-symbols-outlined text-[20px]">wallpaper</span>
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#f2ecfd]">
                Vizyon Kolaj &amp; Duvar Kağıdı
              </h2>
              <p className="text-xs text-[#c9bfdc]">
                Hayallerini telefonuna özel estetik bir kilit ekranına dönüştür.
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

        {/* Studio Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Format & Theme Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setLayoutMode('lockscreen');
                onPlayChime();
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === 'lockscreen'
                  ? 'bg-[#f5d061]/20 border-[#f5d061]/50 text-[#f5d061] shadow-[0_0_12px_rgba(245,208,97,0.25)]'
                  : 'bg-[#231e36] border-[#443b56]/40 text-[#c9bfdc]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
              <span>Kilit Ekranı (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLayoutMode('moodboard');
                onPlayChime();
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === 'moodboard'
                  ? 'bg-[#f5d061]/20 border-[#f5d061]/50 text-[#f5d061] shadow-[0_0_12px_rgba(245,208,97,0.25)]'
                  : 'bg-[#231e36] border-[#443b56]/40 text-[#c9bfdc]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Moodboard Mozaik</span>
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleFillFromVisions}
              className="py-2 px-3 rounded-xl bg-[#231e36] hover:bg-[#2e2747] border border-[#f5d061]/30 text-[#f5d061] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Vizyonlarımdan Doldur</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[#c9bfdc] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Fotoğraf Yükle</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => setShowAddSheet(!showAddSheet)}
                className="py-2 px-3 rounded-xl bg-[#7f00ff]/30 hover:bg-[#7f00ff]/50 border border-[#7f00ff]/50 text-[#d5baff] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                <span>Galeriden Ekle</span>
              </button>
            </div>
          </div>

          {/* Curated Gallery Add Sheet (Collapsible) */}
          {showAddSheet && (
            <div className="p-3 rounded-2xl bg-[#060411] border border-[#f5d061]/30 space-y-2 animate-fadeIn">
              <span className="text-[11px] font-bold text-[#f5d061] uppercase tracking-wider block">
                Hazır Estetik Görsel Ekle
              </span>
              <div className="grid grid-cols-4 gap-2">
                {CURATED_COLLAGE_PHOTOS.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleAddPhoto(c)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#f5d061] cursor-pointer group"
                  >
                    <img src={c.url} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[#f5d061] text-[18px]">add</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE COLLAGE PHONE PREVIEW FRAME */}
          <div className="flex justify-center my-2">
            <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-[9/16] rounded-[36px] bg-[#060411] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.9)] border-4 border-[#231e36] flex flex-col justify-between overflow-hidden">
              {/* iPhone Dynamic Island */}
              <div className="w-24 h-5 rounded-full bg-black mx-auto mt-1 flex items-center justify-center shrink-0 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] ml-auto mr-2" />
              </div>

              {/* Lockscreen Clock */}
              {layoutMode === 'lockscreen' && (
                <div className="text-center mt-1 z-10 shrink-0">
                  <span className="text-[10px] text-white/80 font-medium tracking-wider block">
                    {currentDateStr.toUpperCase()}
                  </span>
                  <span className="font-serif text-5xl font-light text-white tracking-tight">
                    {currentTimeStr}
                  </span>
                </div>
              )}

              {/* Photos Mosaic Container */}
              <div className="flex-1 my-2 grid grid-cols-2 gap-2 overflow-hidden z-10">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative rounded-2xl overflow-hidden border border-[#f5d061]/35 shadow-md group"
                  >
                    <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(p.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/75 hover:bg-red-500/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Kolajdan Çıkar"
                    >
                      <span className="material-symbols-outlined text-[13px]">close</span>
                    </button>
                    <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                      <span className="text-[9px] text-[#f2ecfd] truncate block font-medium">
                        {p.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Affirmation Quote Banner */}
              <div className="p-2 rounded-2xl bg-[#181427]/90 border border-[#f5d061]/40 text-center shrink-0 z-10">
                <p className="text-[10px] text-[#f5d061] font-semibold leading-tight line-clamp-2">
                  ✦ {affirmationText} ✦
                </p>
              </div>
            </div>
          </div>

          {/* Affirmation Text Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#d5baff] uppercase tracking-wider block">
              Duvar Kağıdı Niyet Cümlesi
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AFFIRMATION_PRESETS.map((aff, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAffirmationText(aff)}
                  className={`px-2.5 py-1 rounded-full text-[10px] transition-all cursor-pointer ${
                    affirmationText === aff
                      ? 'bg-[#f5d061]/25 text-[#f5d061] border border-[#f5d061]/50 font-bold'
                      : 'bg-[#231e36] text-[#c9bfdc] border border-[#443b56]/30 hover:text-white'
                  }`}
                >
                  {aff.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden Canvas for High-Res 1080x1920 Wallpaper Export */}
        <canvas ref={hiddenCanvasRef} className="hidden" />

        {/* Bottom CTA Export Button */}
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
            disabled={isExporting}
            onClick={handleExportWallpaper}
            className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#7f00ff] via-[#6f00be] to-[#f5d061] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(127,0,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExporting ? 'sync' : 'download'}
            </span>
            <span>{isExporting ? 'Render Ediliyor...' : 'HD Duvar Kağıdını İndir'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
