import React, { useState } from 'react';
import { VisionAiImageGeneratorModal } from './VisionAiImageGeneratorModal';

export interface VisionModalData {
  category: string;
  title: string;
  desc: string;
  completed: boolean;
}

export interface VisionItemData {
  id: string;
  title: string;
  category: string;
  categoryKey: 'career' | 'wellness' | 'spirit' | 'travel';
  categoryLabel: string;
  why: string;
  action: string;
  shortAction: string;
  imageUrl: string;
  badge?: string;
  completed: boolean;
  colSpan?: boolean;
  heightClass?: string;
}

interface VisionTabProps {
  onTriggerCelebration: () => void;
  onOpenAddVisionModal: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime?: () => void;
  addedCards?: VisionItemData[];
}

export const VisionTab: React.FC<VisionTabProps> = ({
  onTriggerCelebration,
  onOpenAddVisionModal,
  onShowToast,
  onPlayChime,
  addedCards = [],
}) => {
  // 8 Vision Cards Data from the updated Stitch export
  const [cards, setCards] = useState<VisionItemData[]>([
    {
      id: '1',
      title: 'Como Gölü Kıyısında Yaşam & Çalışma',
      category: 'Kariyer & Bolluk',
      categoryKey: 'career',
      categoryLabel: 'Kariyer & Bolluk',
      why: 'Aileme ve kendime özgür, zaman kısıtlamalarından arınmış dingin bir yaşam alanı sunmak.',
      action: 'Vize gereksinimleri ve Como bölgesindeki sakin çalışma mekanları listesinden 1 makale oku.',
      shortAction: 'Como çalışma rehberine hızlıca 5 dk göz at ve 1 not al.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAYlhU-0NgSW87u0HG48qUwVmlcXUyPWvOsd3WFu6MLH3jO5AmSglc8M8poJ_bgLAPQlYYABbnFcKM_8KmkWGFbtOF_0Wzo5c7w35uNX6txxXLApGAdlzuIGTrozIHTh1oS0t4_TZxKgGXqVOZLrjiihiqZh9Z5wiOppkr8qqiX0KHvQuwprqkrgG2-8Ox8ym4J-GNRqgrZddFEGm2uqI4w8lQvl4raSwpF3ENMwiU',
      badge: 'Ana Niyet Yıldızı',
      completed: false,
    },
    {
      id: '2',
      title: 'Beden & Zihin Dinginliği',
      category: 'Beden & Canlılık',
      categoryKey: 'wellness',
      categoryLabel: 'Beden',
      why: 'Fiziksel gerginliklerden arınarak her güne yüksek hücresel enerjiyle başlamak.',
      action: 'Akşam yatmadan önce 20 dakika omurga açıcı sakin Yin Yoga akışını tamamla.',
      shortAction: '3 derin nefes egzersizi ve 5 dk omuz esnetmesi yap.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCHI8ddkGh9CycfOyFQAFJ5iXzAjBbOhhLQ9A05ba7i6BKsaeYW3GeMMWFIVsiYxW_i0O_559VOdDNsZcKKrUN_WuE3pMw_XRynSlRdtRrjGi8cPN678pBImX8zROKZ2jh8sRzGJBxAWxLiitJDoepeUZp-Awx5A3jUIZLQZAmKexQQL7X0CYBReoFD5F40592IMQynuSI7Iq_0neByQukwZEixHBzeC6mhphORHGo',
      completed: false,
      heightClass: 'h-36',
    },
    {
      id: '3',
      title: '432Hz Derin Meditasyon',
      category: 'Ruhsal Denge',
      categoryKey: 'spirit',
      categoryLabel: 'Ruhsal Denge',
      why: 'Zihinsel gevezeliği susturmak ve içsel sezgileri berraklaştırmak.',
      action: 'Kulaklıkları tak, 432Hz kristal kase frekansını aç ve 15 dk sessizce nefesine odaklan.',
      shortAction: '5 dakika boyunca gözlerini kapatıp 432Hz akorunu hisset.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCxLXF8ZssfZsU_LOHlF0_tiqJ3MKQqzKzAKGV3FrrfjkdVAdBvkkovwMQwNiuGPK556VNNRAtlIF2Np4f2ff4vilxdPrKTUh6020m-ON30hYBoAF7CQYsn6oOO8zO8B0ke3ttXidfZ91XkciAxT20lccoTfLiCB3hLDG4tDrnrAhgMl-OiTtJs1v2bhGVw7xyU93scFG-CgztLYomyxXbEaEJskd5oIl2ArXrwO2Y',
      completed: false,
      heightClass: 'h-44',
    },
    {
      id: '4',
      title: 'Özgür Dünya Rotaları',
      category: 'Seyahat',
      categoryKey: 'travel',
      categoryLabel: 'Seyahat',
      why: 'Yeni coğrafyaların ve kültürlerin vizyonumu ve ufkumu genişletmesine alan açmak.',
      action: 'İtalya veya İsviçre tren güzergahları için 1 rota taslağını kaydet.',
      shortAction: 'Görmek istediğin 1 göl kenarı kasabasını haritaya iğnele.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2JiohiaOR0ZC7crkGJ1OI86fMT2yE8WVyqClwznOTYn7mYwFvqAuyHO69G3wUaJYAPK150yvWjoG6Ud1UMNGn1D7mlYmn6SE4VX9C5of0_RouxhYB9QZhWIcHq5X3P6qFK7m74DbcMaVvk9TJF8DezS5KHDjmk65Sq_p--BBWv0jB9RiASl-q_vKQ_xwZIinCALUoAqqc_j8gVXmcpXclFWTyMYVr-RxIZ83uDDk',
      completed: false,
      heightClass: 'h-44',
    },
    {
      id: '5',
      title: 'Tasarım Stüdyosu',
      category: 'Kariyer & Bolluk',
      categoryKey: 'career',
      categoryLabel: 'Kariyer',
      why: 'Kendi vizyonumu yansıtan estetik ve derin projeler inşa etmek.',
      action: 'Kişisel portföyüne en güvendiğin 1 projeyi ekle veya metnini güncelle.',
      shortAction: 'Portföy başlığını ve anahtar niyet cümleni yeniden yaz.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBrHNnvLvhfmm44bvYDoozsasL8pDZhv0_KnIKdzusqbytwo6aYrMj45GvgOrFiUTPjvMkbzWSjDcLxmXD1xTZ_V67hqenc4hRsGeGjJmBPFamDuSR_uaajxCGm_DmFmtaudWcrOOnY2P403PUUqoalA7S_venpXk9Kk1ea1-JE4gr6R7lIBj7-Qr5NpRV3hZhi_Ck2AujTz4HZYu0Ei7ygr3H9x_LDpSeRohkk7Ko',
      completed: false,
      heightClass: 'h-36',
    },
    {
      id: '6',
      title: 'Sevgi & Aile Bağı',
      category: 'Ruhsal Denge',
      categoryKey: 'spirit',
      categoryLabel: 'Ruhsal',
      why: 'En büyük gücümün ve huzurumun sevdiklerimle paylaşılan anlardan beslendiğini hatırlamak.',
      action: 'Ailenden ya da değer verdiğin bir dostundan birine samimi bir şükran mesajı gönder.',
      shortAction: 'Sevdiğin birine seni düşündüm mesajı at.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDjDDbOGzs4zQW0SYH4qArgX6ZTGBsc-LqaLJ5DxW4SNY5zSzVxwyZjzbZSqrYn7iMQE2qHH2zylevCgw-Kw1dZDIaG7INijSpyWzPMteZyV3EbaeuAQt5QnhEhFanfttZJtPHJshTcx4a28kXBSNyuSCz5JHscIaAtcsFnWQtP98D4AQ9lRP9T9-eQwWrSFT1THnISDCIuFGlXF3eYW0ULppaWuFIE7aJZCt7xnb8',
      completed: false,
      heightClass: 'h-36',
    },
    {
      id: '7',
      title: 'Finansal Bolluk',
      category: 'Kariyer & Bolluk',
      categoryKey: 'career',
      categoryLabel: 'Kariyer',
      why: 'Para stresinden uzaklaşarak niyetlerimi hayata geçirecek maddi güvenceyi büyütmek.',
      action: 'Bu ayki pasif gelir ve birikim dağılımını 15 dakika boyunca çizelgene işle.',
      shortAction: 'Bugünkü harcamalarını kaydet ve bütçeni kontrol et.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDUnCIACg8yVWhwEvYKvXczQ5MHqoPlbItfd0Gccm1JwE159dBhHen3_4gK7ylZCnXfGlfLUt9pBY5K6dvvqoeX0Ia4ZIb7kv67kSqt2LtiX4szmVWKSfsyuylul2X17JfTxRP48SYA5FxaPQ0XYKQ5ShdU1CsJnxe6DTJDalr4NITRMN8xkvY_UTxHxq8EKirARiIQEfyyYSAvlWIkw9eqAB2AiPePL1DIPodvfMc',
      completed: false,
      heightClass: 'h-44',
    },
    {
      id: '8',
      title: 'Sanatsal Üretim & Yazarlık',
      category: 'Beden & Canlılık',
      categoryKey: 'wellness',
      categoryLabel: 'Beden & Zihin',
      why: 'Duygularımı ve fikirlerimi kalıcı birer esere dönüştürmenin hazzını yaşamak.',
      action: 'Herhangi bir filtre uygulamadan 2 tam sayfa serbest bilinç akışı günlüğü yaz.',
      shortAction: 'Bugün hissettiğin en güçlü duyguyu 3 cümleyle özetle.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCxlHJJjvdlJJhsfota5_K5aFa__Nda0kvnEl62qCH1h2b5CdwvMmg0PMB01YVSvf85rwroR7gx-aMS_qtYVsA-xl_wrFXPJqUMcNTO5RjOPrlRC-vqILZPOvZ2vyicvGAOmxud4YSLi5o8aJ-JcYF1uJaznrLWgcngpTFpDqXJXMWDV5FZlKSQEeig2WKkWTWWQarQNLawH0674h3lXWF5C6_6VbDRDOa2wqjrS6M',
      completed: false,
      colSpan: true,
      heightClass: 'h-36',
    },
  ]);

  // Active Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Bottom Sheet Modal state
  const [activeCard, setActiveCard] = useState<VisionItemData | null>(null);
  const [isShrunkTo5Min, setIsShrunkTo5Min] = useState<boolean>(false);

  // Year Switcher State
  const [selectedYear, setSelectedYear] = useState<'2027' | '2028' | '2026'>('2027');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);

  // Wallpaper Modal State
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState<boolean>(false);

  // Free AI Studio Modal State
  const [isAiStudioOpen, setIsAiStudioOpen] = useState<boolean>(false);

  const handleSelectFromAiStudio = (newImageUrl: string, promptTitle?: string) => {
    const newCard: VisionItemData = {
      id: String(Date.now()),
      title: promptTitle || 'Özel Nöro-AI Vizyon Tohumu',
      category: 'Kariyer & Bolluk',
      categoryKey: 'career',
      categoryLabel: 'Kariyer',
      why: 'Yapay zeka ile zihinde canlandırılan yüksek çözünürlüklü duyusal niyet.',
      action: 'Bu görselin temsil ettiği niyet için 15 dakikalık odaklanma adımı at.',
      shortAction: '5 dk görseli incele ve derin niyet nefesi al.',
      imageUrl: newImageUrl,
      badge: 'AI Tohumu',
      completed: false,
    };
    setCards((prev) => [newCard, ...prev]);
    if (onPlayChime) onPlayChime();
    onShowToast(`"${newCard.title}" panona mühürlendi! ✨`, 'stars');
  };

  // Combined cards list
  const displayCards = [...addedCards, ...cards];

  // Filter counts
  const countAll = displayCards.length;
  const countCareer = displayCards.filter((c) => c.categoryKey === 'career').length;
  const countWellness = displayCards.filter((c) => c.categoryKey === 'wellness').length;
  const countSpirit = displayCards.filter((c) => c.categoryKey === 'spirit').length;
  const countTravel = displayCards.filter((c) => c.categoryKey === 'travel').length;

  const filteredCards = displayCards.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.categoryKey === selectedCategory;
  });

  const toggleCheck = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          const nextState = !card.completed;
          if (nextState) {
            if (onPlayChime) onPlayChime();
            onShowToast('Tebrikler! Günlük niyet eylemi tamamlandı ✨', 'stars');
          }
          return { ...card, completed: nextState };
        }
        return card;
      })
    );
  };

  const openCardModal = (card: VisionItemData) => {
    setActiveCard(card);
    setIsShrunkTo5Min(false);
  };

  const handleCompleteActiveModal = () => {
    if (!activeCard) return;
    toggleCheck(activeCard.id);
    setActiveCard(null);
    onShowToast('15 Dakikalık eylem tamamlandı. Yıldız parıldıyor! ✨', 'verified');
  };

  const handleShrinkAi = () => {
    setIsShrunkTo5Min(!isShrunkTo5Min);
    onShowToast(
      !isShrunkTo5Min
        ? 'AI eylemi 5 dakikaya sadeleştirdi ⚡'
        : 'Orijinal 15 dakikalık niyet adımı geri yüklendi.',
      'auto_awesome'
    );
  };

  const handleDownloadWallpaper = () => {
    // Generate synthetic wallpaper canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark celestial background
      ctx.fillStyle = '#080c22';
      ctx.fillRect(0, 0, 1080, 1920);

      // Gold aura glow
      const grad = ctx.createRadialGradient(540, 600, 50, 540, 600, 500);
      grad.addColorStop(0, 'rgba(231, 195, 85, 0.35)');
      grad.addColorStop(1, 'rgba(8, 12, 34, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1200);

      // Celestial North Star text
      ctx.fillStyle = '#e7c355';
      ctx.font = 'bold 36px Playfair Display, serif';
      ctx.textAlign = 'center';
      ctx.fillText('VEIRA · 432Hz HARMONIC', 540, 480);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 56px Playfair Display, serif';
      ctx.fillText('Como Gölü 2027', 540, 570);

      ctx.fillStyle = '#c7c4d7';
      ctx.font = '32px Inter, sans-serif';
      ctx.fillText('Dingin Zihin, Berrak Niyet, Zirve Odak', 540, 650);

      // Download trigger
      const link = document.createElement('a');
      link.download = 'veira_4k_vision_wallpaper.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      onShowToast('4K Kilit Ekranı Duvar Kağıdı İndirildi 📱✨', 'wallpaper');
      setIsWallpaperModalOpen(false);
    }
  };

  return (
    <section className="flex flex-col w-full max-w-lg sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 space-y-4 sm:space-y-6 animate-fadeIn pb-8">
      {/* Ambient Celestial Background Effects */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#8083ff]/15 rounded-full blur-[90px] -z-10" />
      <div className="pointer-events-none absolute top-96 -right-16 w-64 h-64 bg-[#e7c355]/10 rounded-full blur-[80px] -z-10" />
      <div className="pointer-events-none absolute bottom-40 -left-12 w-72 h-72 bg-[#009bd1]/10 rounded-full blur-[100px] -z-10" />

      {/* SECTION 1: Year Selector & Board Controls Bar */}
      <div className="flex flex-col gap-2.5 w-full pt-1">
        <div className="flex items-center justify-between">
          {/* Year Switcher Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#252840]/80 backdrop-blur-md shadow-sm active:scale-95 transition-transform text-left border border-white/5"
            >
              <span className="w-2 h-2 rounded-full bg-[#e7c355] animate-pulse" />
              <span className="font-serif text-lg font-medium text-[#e7c355] tracking-tight">
                {selectedYear} Vizyon Panom
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#c7c4d7]">
                expand_more
              </span>
            </button>

            {/* Dropdown Options */}
            {isYearDropdownOpen && (
              <div className="absolute top-11 left-0 z-30 bg-[#161a30] border border-white/10 rounded-2xl shadow-2xl py-1.5 w-48 backdrop-blur-xl">
                {(['2027', '2028', '2026'] as const).map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsYearDropdownOpen(false);
                      onShowToast(`${year} Vizyon döngüsü aktif.`, 'stars');
                    }}
                    className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      selectedYear === year ? 'text-[#e7c355] font-bold' : 'text-[#c7c4d7]'
                    }`}
                  >
                    <span>{year} Vizyonu</span>
                    {selectedYear === year && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Miller's 12-Item Focus Gauge Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161a30]/90 shadow-sm border border-white/5">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#2f334b]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                />
                <path
                  className="text-[#e7c355]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="66, 100"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-[#dee0ff]">
              <strong className="text-[#e7c355] font-semibold">{displayCards.length}</strong>/12 Odak
            </span>
          </div>
        </div>

        {/* Quick Action Bar (Wallpapers, Free AI Studio & Add Card) */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          <button
            onClick={() => setIsWallpaperModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full bg-[#252840]/70 hover:bg-[#252840] backdrop-blur-lg active:scale-[0.98] transition-all shadow-sm border border-white/5 text-[#dee0ff]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#e7c355]">wallpaper</span>
            <span className="text-[11px] font-semibold truncate">Duvar Kağıdı</span>
          </button>

          <button
            onClick={() => setIsAiStudioOpen(true)}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-full bg-gradient-to-r from-[#2f334b] via-[#3d436a] to-[#2f334b] text-[#ffe089] hover:text-white font-bold text-[11px] border border-[#e7c355]/30 shadow-md active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#e7c355]">auto_awesome</span>
            <span className="truncate">AI Görsel</span>
          </button>

          <button
            onClick={onOpenAddVisionModal}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-full bg-[#e7c355] hover:bg-[#ebd074] text-[#3d2f00] font-bold text-[11px] shadow-[0_0_15px_rgba(231,195,85,0.3)] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span className="truncate">Vizyon Ekle</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Category Filter Carousel Pills */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-sm'
                : 'bg-[#252840]/80 text-[#c7c4d7] hover:text-[#dee0ff]'
            }`}
          >
            Tümü ({countAll})
          </button>

          <button
            onClick={() => setSelectedCategory('career')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
              selectedCategory === 'career'
                ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-sm'
                : 'bg-[#252840]/80 text-[#c7c4d7] hover:text-[#dee0ff]'
            }`}
          >
            Kariyer & Bolluk ({countCareer})
          </button>

          <button
            onClick={() => setSelectedCategory('wellness')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
              selectedCategory === 'wellness'
                ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-sm'
                : 'bg-[#252840]/80 text-[#c7c4d7] hover:text-[#dee0ff]'
            }`}
          >
            Beden & Canlılık ({countWellness})
          </button>

          <button
            onClick={() => setSelectedCategory('spirit')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
              selectedCategory === 'spirit'
                ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-sm'
                : 'bg-[#252840]/80 text-[#c7c4d7] hover:text-[#dee0ff]'
            }`}
          >
            Ruhsal Denge ({countSpirit})
          </button>

          <button
            onClick={() => setSelectedCategory('travel')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
              selectedCategory === 'travel'
                ? 'bg-[#e7c355] text-[#3d2f00] font-bold shadow-sm'
                : 'bg-[#252840]/80 text-[#c7c4d7] hover:text-[#dee0ff]'
            }`}
          >
            Seyahat ({countTravel})
          </button>
        </div>
      </div>

      {/* SECTION 3: Interactive Vision Board Layout */}
      <div className="flex flex-col gap-4 w-full">
        {/* Render Centerpiece if 'all' or 'career' is selected */}
        {cards
          .filter(
            (c) =>
              c.id === '1' && (selectedCategory === 'all' || selectedCategory === 'career')
          )
          .map((centerpiece) => (
            <div
              key={centerpiece.id}
              onClick={() => openCardModal(centerpiece)}
              className="group relative w-full rounded-2xl bg-[#252840]/80 backdrop-blur-2xl shadow-xl overflow-hidden cursor-pointer active:scale-[0.99] transition-all border border-white/5"
            >
              <div className="relative w-full h-52 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                <img
                  src={centerpiece.imageUrl}
                  alt={centerpiece.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="vision-card-overlay absolute inset-0 pointer-events-none" />

                {/* Celestial Pin & Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080c22]/85 backdrop-blur-md shadow-md border border-white/10">
                  <span
                    className="material-symbols-outlined text-[#e7c355] text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                  <span className="text-[11px] font-bold text-[#e7c355] tracking-widest uppercase">
                    Ana Niyet Yıldızı
                  </span>
                </div>

                {/* Check Action Button */}
                <button
                  onClick={(e) => toggleCheck(centerpiece.id, e)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-md ${
                    centerpiece.completed
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#080c22]/80 text-[#c7c4d7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {centerpiece.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#2f334b]/90 text-[#c7c4d7] text-[11px] font-semibold tracking-wider uppercase">
                    {centerpiece.category}
                  </span>
                  <span className="text-[11px] text-[#c0c1ff] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">touch_app</span> Detay
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-1.5">
                <h3 className="font-serif text-xl font-bold text-[#dee0ff] leading-snug">
                  {centerpiece.title}
                </h3>
                <p className="text-xs text-[#c7c4d7] leading-relaxed font-light">
                  {centerpiece.why}
                </p>

                {/* Micro-Action Trigger Chip */}
                <div className="mt-1 pt-2 flex items-center justify-between rounded-xl bg-[#1a1e35]/80 p-2.5 border border-white/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-[#e7c355] shrink-0">
                      bolt
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] text-[#e7c355] font-semibold">
                        Günün 15 Dk Eylemi
                      </span>
                      <span className="text-xs text-[#dee0ff] truncate">
                        {centerpiece.action}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCardModal(centerpiece);
                    }}
                    className="shrink-0 ml-2 px-3 py-1 rounded-full bg-[#8083ff] text-[#1000a9] font-bold text-xs active:scale-95 transition-transform"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* Responsive Masonry Grid: 2-Column on Mobile, 3-4 Columns on Tablet & Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 w-full">
          {filteredCards
            .filter((c) => c.id !== '1')
            .map((card) => {
              const isColSpan = card.colSpan;
              return (
                <div
                  key={card.id}
                  onClick={() => openCardModal(card)}
                  className={`group flex flex-col rounded-2xl bg-[#252840]/80 backdrop-blur-xl shadow-md overflow-hidden cursor-pointer active:scale-[0.98] transition-all border border-white/5 ${
                    isColSpan ? 'col-span-2' : ''
                  }`}
                >
                  <div className="relative w-full h-36 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="vision-card-overlay absolute inset-0 pointer-events-none" />

                    {/* Check Button */}
                    <button
                      onClick={(e) => toggleCheck(card.id, e)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${
                        card.completed
                          ? 'bg-[#e7c355] text-[#3d2f00]'
                          : 'bg-[#080c22]/80 text-[#c7c4d7]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {card.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>

                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#080c22]/80 text-[#c7c4d7] text-[10px] font-semibold uppercase tracking-wider">
                      {card.categoryLabel}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <h4 className="font-semibold text-sm text-[#dee0ff] leading-tight line-clamp-2">
                      {card.title}
                    </h4>

                    <div className="flex items-center justify-between rounded-xl bg-[#1a1e35]/60 p-2 border border-white/5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="material-symbols-outlined text-[14px] text-[#e7c355] shrink-0">
                          {card.categoryKey === 'spirit'
                            ? 'graphic_eq'
                            : card.categoryKey === 'travel'
                            ? 'flight_takeoff'
                            : card.categoryKey === 'career'
                            ? 'draw'
                            : 'spa'}
                        </span>
                        <span className="text-xs text-[#c7c4d7] truncate">
                          {card.action}
                        </span>
                      </div>
                      {isColSpan && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCardModal(card);
                          }}
                          className="shrink-0 ml-2 px-3 py-1 rounded-full bg-[#2f334b] text-[#dee0ff] text-[11px] font-semibold hover:bg-[#e7c355] hover:text-[#3d2f00] transition-colors"
                        >
                          Aksiyon Al
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* SECTION 4: Interactive Micro-Action Modal / Bottom Sheet */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveCard(null)}
        >
          <div
            className="w-full max-w-lg mx-auto max-h-[92dvh] overflow-y-auto bg-[#252840]/95 backdrop-blur-2xl rounded-t-3xl shadow-2xl p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 border-t border-[#e7c355]/20 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle & Close */}
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-1 rounded-full bg-white/20 mx-auto -mr-6" />
              <button
                className="w-8 h-8 rounded-full bg-[#2f334b] flex items-center justify-center text-[#dee0ff] active:scale-90 transition-transform"
                onClick={() => setActiveCard(null)}
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Card Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md shrink-0 bg-[#080c22] border border-white/10">
                <img
                  src={activeCard.imageUrl}
                  alt={activeCard.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-[#e7c355] tracking-widest uppercase">
                  {activeCard.category}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#dee0ff] truncate">
                  {activeCard.title}
                </h3>
                <span className="text-xs text-[#c7c4d7]">
                  Vizyon Odak Kartı #{activeCard.id}
                </span>
              </div>
            </div>

            {/* Emotional Why / Duygusal Çapa */}
            <div className="rounded-2xl bg-[#161a30]/90 p-3.5 sm:p-4 flex flex-col gap-1 shadow-sm border border-white/5">
              <div className="flex items-center gap-1.5 text-[#e7c355]">
                <span className="material-symbols-outlined text-[17px]">psychology_alt</span>
                <span className="text-xs font-semibold">Duygusal Çapa (Emotional Why)</span>
              </div>
              <p className="text-xs text-[#dee0ff]/90 italic font-serif leading-relaxed">
                “{activeCard.why}”
              </p>
            </div>

            {/* Daily 15-Minute Action Box */}
            <div className="rounded-2xl bg-[#1a1e35]/90 p-3.5 sm:p-4 flex flex-col gap-2 shadow-sm border border-white/5">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="text-xs text-[#e7c355] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[17px]">timer</span>
                  {isShrunkTo5Min ? '5 Dakikalık Mikro-Eylem' : 'Bugünkü 15 Dakikalık Eylem'}
                </span>
                <button
                  onClick={handleShrinkAi}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2f334b] text-[#8083ff] text-xs font-semibold active:scale-95 transition-all hover:bg-[#8083ff]/20"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>{isShrunkTo5Min ? "15 Dk'ya Geri Dön" : "5 Dk'ya Küçült (AI)"}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#dee0ff] pt-1">
                {isShrunkTo5Min ? activeCard.shortAction : activeCard.action}
              </p>
            </div>

            {/* Action Completion Button */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleCompleteActiveModal}
                className="w-full py-3 sm:py-3.5 px-4 rounded-full bg-[#e7c355] text-[#3d2f00] font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(231,195,85,0.4)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span>Görevi Tamamladım & Yıldızı Yak</span>
              </button>
              <p className="text-[10.5px] text-center text-[#c7c4d7]">
                Tamamlandığında frekans seviyeniz 432Hz dengesine taşınır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HD Duvar Kağıdı Modal */}
      {isWallpaperModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setIsWallpaperModalOpen(false)}
        >
          <div
            className="w-full max-w-sm max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative text-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWallpaperModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="w-16 h-16 rounded-full bg-[#e7c355]/15 border border-[#e7c355]/40 flex items-center justify-center mx-auto mb-3 text-[#e7c355]">
              <span className="material-symbols-outlined text-3xl">wallpaper</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#dee0ff] mb-1">
              4K Kilit Ekranı Duvar Kağıdı
            </h3>
            <p className="text-xs text-[#c7c4d7] mb-4">
              Como Gölü vizyonunu ve 432Hz kutsal frekans mottolarını telefon kilit ekranın için HD formatta oluştur.
            </p>

            <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#080c22] border border-white/10 relative mb-5 flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYlhU-0NgSW87u0HG48qUwVmlcXUyPWvOsd3WFu6MLH3jO5AmSglc8M8poJ_bgLAPQlYYABbnFcKM_8KmkWGFbtOF_0Wzo5c7w35uNX6txxXLApGAdlzuIGTrozIHTh1oS0t4_TZxKgGXqVOZLrjiihiqZh9Z5wiOppkr8qqiX0KHvQuwprqkrgG2-8Ox8ym4J-GNRqgrZddFEGm2uqI4w8lQvl4raSwpF3ENMwiU"
                alt="Wallpaper Preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c22] via-transparent to-[#080c22]/50" />
              <div className="absolute text-center px-4">
                <span className="text-[10px] font-bold text-[#e7c355] tracking-widest uppercase">
                  Veira 2027
                </span>
                <div className="font-serif text-sm font-semibold text-white">
                  Como Gölü • 432Hz
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadWallpaper}
              className="w-full py-3.5 px-4 rounded-xl bg-[#e7c355] hover:bg-[#ebd074] text-[#3d2f00] font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Duvar Kağıdını İndir (PNG)</span>
            </button>
          </div>
        </div>
      )}

      {/* Free AI Vision Image Generator & Curated Studio Modal */}
      <VisionAiImageGeneratorModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        initialTitle="Como Gölü Kıyısında Tasarım Stüdyosu & Sakin Yaşam"
        initialCategory="Kariyer & Bolluk"
        onPlayChime={onPlayChime}
        onShowToast={onShowToast}
        onSelectImage={handleSelectFromAiStudio}
      />
    </section>
  );
};
