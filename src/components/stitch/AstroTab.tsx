import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StitchTab } from './StitchHeader';
import {
  NatalChartData,
  calculateNatalChart,
  getStoredNatalChart,
  saveStoredNatalChart,
} from '../../utils/astrologyCalculator';
import {
  DailyHoroscope,
  generateDailyHoroscope,
  ALL_ZODIAC_SIGNS,
  calculateDailyTemperament,
  generateDynamicPlanets,
  generateDailyTransits,
  DailyTemperamentData,
  DynamicPlanetData,
  DynamicDailyTransit,
} from '../../utils/dailyAstroEngine';

export type AstroSubTab = 'gunluk' | 'harita' | 'element' | 'gezegenler' | 'transitler';

interface AstroTabProps {
  onSwitchTab: (tab: StitchTab) => void;
  onShowToast: (message: string, icon?: string) => void;
  onPlayChime: () => void;
  onIncrementStreak?: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const AstroTab: React.FC<AstroTabProps> = ({
  onShowToast,
  onPlayChime,
  isAudioPlaying,
  onToggleAudio,
}) => {
  // Kayıtlı ya da varsayılan doğum haritası verisi
  const [natalData, setNatalData] = useState<NatalChartData>(() => {
    const saved = getStoredNatalChart();
    if (saved) return saved;
    return calculateNatalChart({
      name: 'Selin',
      birthDate: '1998-05-14',
      birthTime: '14:45',
      birthPlace: 'İstanbul, TR',
    });
  });

  // Üst Sekmeler / Bölüm Seçimi (Hepsini tek ekranda yığmak yerine seçilen bölüme göre gösterir)
  const [activeSubTab, setActiveSubTab] = useState<AstroSubTab>('gunluk');

  // Günlük Burç & Yorum State'leri (Her gün otomatik değişir & burç seçilebilir)
  const [selectedHoroscopeSign, setSelectedHoroscopeSign] = useState<string>(
    () => natalData.sun?.sign || 'Boğa'
  );
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0); // -1: Dün, 0: Bugün, 1: Yarın

  // Seçilen gün ve burca göre anlık göksel hesaplama (Her gün otomatik güncellenir)
  const targetDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDayOffset);
    return d;
  }, [selectedDayOffset]);

  const activeHoroscope: DailyHoroscope = useMemo(() => {
    return generateDailyHoroscope(selectedHoroscopeSign, targetDate, natalData.name);
  }, [selectedHoroscopeSign, targetDate, natalData.name]);

  // Dinamik Günlük Mizaç & Element Dengesi
  const dailyTemperament: DailyTemperamentData = useMemo(() => {
    return calculateDailyTemperament(targetDate, selectedHoroscopeSign);
  }, [targetDate, selectedHoroscopeSign]);

  // Dinamik Günlük & Haftalık Gezegen Transitleri
  const dynamicPlanets: DynamicPlanetData[] = useMemo(() => {
    return generateDynamicPlanets(targetDate, selectedHoroscopeSign);
  }, [targetDate, selectedHoroscopeSign]);

  // Dinamik Günlük Göksel Açılar ve Canlı Transitler
  const dailyTransits: DynamicDailyTransit[] = useMemo(() => {
    return generateDailyTransits(targetDate, selectedHoroscopeSign);
  }, [targetDate, selectedHoroscopeSign]);

  // Doğum Bilgileri Düzenleme Modal State'i
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>(natalData.name);
  const [formBirthDate, setFormBirthDate] = useState<string>(natalData.birthDate);
  const [formBirthTime, setFormBirthTime] = useState<string>(natalData.birthTime);
  const [formBirthPlace, setFormBirthPlace] = useState<string>(natalData.birthPlace);

  // 360° Çark Dokunma & Çevirme State'leri
  const [rotationDegree, setRotationDegree] = useState<number>(0);
  const [aspectsVisible, setAspectsVisible] = useState<boolean>(true);
  const [starsGlowing, setStarsGlowing] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);

  // Otomatik Yörünge Dönüşü Efekti
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setRotationDegree((prev) => (prev + 0.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  // Stardust Canvas Arka Plan Efekti
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(245, 208, 97, ',  // Gold
      'rgba(213, 186, 255, ', // Lavender
      'rgba(0, 220, 230, ',   // Celestial Cyan
      'rgba(255, 255, 255, ', // Silver
    ];

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      colorPrefix: string;
      alpha: number;
      speedX: number;
      speedY: number;
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < 36; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.55 + 0.2,
        speedX: (Math.random() - 0.5) * 0.18,
        speedY: (Math.random() - 0.5) * 0.18,
        pulseSpeed: 0.015 + Math.random() * 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * 0.002 * p.pulseSpeed) * 0.01;
        const clampedAlpha = Math.max(0.12, Math.min(0.85, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorPrefix + clampedAlpha + ')';
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.colorPrefix + '0.7)';
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 360 Çark Açı Hesaplama
  const getAngleFromClientXY = (clientX: number, clientY: number) => {
    if (!wheelContainerRef.current) return 0;
    const rect = wheelContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    return (radians * 180) / Math.PI;
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startAngleRef.current = getAngleFromClientXY(clientX, clientY);
    startRotationRef.current = rotationDegree;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const currentAngle = getAngleFromClientXY(clientX, clientY);
    const delta = currentAngle - startAngleRef.current;
    setRotationDegree(Math.round(startRotationRef.current + delta));
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPlayChime();
    }
  };

  // Global mouseup listener
  useEffect(() => {
    const handleGlobalUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDragging]);

  // Gezegen Kartları Akordiyon State'i (Genişletilmiş kartlar)
  const [expandedPlanets, setExpandedPlanets] = useState<Record<string, boolean>>({
    sun: true, // varsayılan olarak Güneş açık
    moon: false,
    asc: false,
    venus: false,
    mars: false,
    mercury: false,
    jupiter: false,
    saturn: false,
  });

  const togglePlanet = (planetKey: string) => {
    setExpandedPlanets((prev) => ({
      ...prev,
      [planetKey]: !prev[planetKey],
    }));
    onPlayChime();
  };

  const handleToggleAllPlanets = () => {
    const anyOpen = Object.values(expandedPlanets).some(Boolean);
    const newState = !anyOpen;
    setExpandedPlanets({
      sun: newState,
      moon: newState,
      asc: newState,
      venus: newState,
      mars: newState,
      mercury: newState,
      jupiter: newState,
      saturn: newState,
    });
    onPlayChime();
    onShowToast(anyOpen ? 'Tüm gezegen kartları daraltıldı.' : 'Tüm gezegen analizleri açıldı.', 'unfold_more');
  };

  const handleRotateWheel = (delta: number = 60) => {
    setIsDragging(false);
    setRotationDegree((prev) => prev + delta);
    onPlayChime();
  };

  const handleResetWheel = () => {
    setIsDragging(false);
    setRotationDegree(0);
    onPlayChime();
    onShowToast('Harita 0° başlangıç açısına sıfırlandı.', 'restart_alt');
  };

  const handleToggleAspects = () => {
    setAspectsVisible((prev) => !prev);
    onPlayChime();
    onShowToast(!aspectsVisible ? 'Açı çizgileri gösteriliyor.' : 'Açı çizgileri gizlendi.', 'all_inclusive');
  };

  const handleToggleStars = () => {
    setStarsGlowing((prev) => !prev);
    onPlayChime();
    onShowToast(!starsGlowing ? '✦ Çark yıldızları ve takımyıldızlar parlatıldı! ✦' : 'Yıldız aurası hafifletildi.', 'stars');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    onPlayChime();
    onShowToast('✦ Doğum haritası panoya kopyalandı! ✦', 'ios_share');
  };

  const handleSelectSubTab = (tab: AstroSubTab) => {
    setActiveSubTab(tab);
    onPlayChime();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBirthDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBirthDate || !formBirthTime) {
      onShowToast('Lütfen doğum tarihi ve saatini eksiksiz girin.', 'warning');
      return;
    }

    const computed = calculateNatalChart({
      name: formName || 'Selin',
      birthDate: formBirthDate,
      birthTime: formBirthTime,
      birthPlace: formBirthPlace || 'İstanbul, TR',
    });

    setNatalData(computed);
    saveStoredNatalChart(computed);
    setIsEditModalOpen(false);
    onPlayChime();
    onShowToast(
      `✦ Doğum haritan güncellendi: ${computed.sun.sign} Güneşi & ${computed.rising.sign} Yükseleni! ✦`,
      'auto_awesome'
    );
  };

  const normalizedDegree = ((rotationDegree % 360) + 360) % 360;

  const subTabItems: Array<{ id: AstroSubTab; label: string; icon: string }> = [
    { id: 'gunluk', label: 'Günlük Yorum', icon: 'auto_awesome' },
    { id: 'harita', label: 'Doğum Haritası', icon: 'pie_chart' },
    { id: 'element', label: 'Mizaç & Element', icon: 'blur_on' },
    { id: 'gezegenler', label: 'Gezegenler', icon: 'public' },
    { id: 'transitler', label: 'Günün Transitleri', icon: 'schedule' },
  ];

  return (
    <div className="astro-tab-root relative flex flex-col w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-3.5 sm:px-4 space-y-5 pb-36 animate-fadeIn select-none box-border">
      
      {/* Background Stardust Particles */}
      <div className="astro-stardust-canvas fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* =========================================================================
          KULLANICI NATAL KAPSÜLÜ (İsim • Burç • Natal Bilgileri)
         ========================================================================= */}
      <div className="relative z-10 overflow-hidden p-4 rounded-2xl bg-[#181427]/90 border border-[#443b56]/40 shadow-[0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#7f00ff]/15 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#7f00ff] via-[#6f00be] to-[#f5d061] p-[2px] shadow-[0_0_18px_rgba(127,0,255,0.45)] shrink-0">
              <div className="w-full h-full rounded-full bg-[#060411] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#f5d061] text-[20px] sm:text-[22px] animate-pulse">
                  auto_awesome
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#f2ecfd] tracking-tight truncate">
                  {natalData.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#f5d061]/25 to-[#f5d061]/15 text-[#f5d061] border border-[#f5d061]/40 text-xs font-bold tracking-wide flex items-center gap-1 shadow-sm">
                  <span>{natalData.sun?.glyph || '☀️'}</span>
                  <span>{natalData.sun?.sign || selectedHoroscopeSign} Burcu</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#f5d061]/15 text-[#f5d061] border border-[#f5d061]/35 text-[10px] font-bold uppercase tracking-wider">
                  Natal V.IV
                </span>
              </div>
              <p className="text-xs text-[#c9bfdc] truncate mt-0.5">
                {natalData.birthDate} • {natalData.birthTime} • {natalData.birthPlace}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              title="Doğum Bilgilerini Düzenle"
              className="h-9 px-3 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/60 flex items-center gap-1.5 text-[#00dce6] text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span className="hidden sm:inline">Düzenle</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Haritayı Paylaş"
              title="Haritayı Paylaş"
              className="h-9 w-9 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/60 flex items-center justify-center text-[#c9bfdc] hover:text-[#f5d061] transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. YUKARIDAKİ BÖLÜM SEÇİM SEKMELERİ (STICKY SUB-NAVIGATION PILLS)
         ========================================================================= */}
      <div className="sticky top-16 z-30 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 py-2 bg-[#080a16]/95 backdrop-blur-2xl border-y border-[#443b56]/40 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {subTabItems.map((item) => {
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSubTab(item.id)}
                className={`px-3.5 py-2 rounded-full font-semibold text-xs tracking-wide shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#f5d061]/20 text-[#f5d061] border border-[#f5d061]/50 shadow-[0_0_14px_rgba(245,208,97,0.3)] scale-[1.02]'
                    : 'bg-[#181427]/90 hover:bg-[#231e36] text-[#c9bfdc] hover:text-[#f2ecfd] border border-[#443b56]/30'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. DİNAMİK BÖLÜM İÇERİĞİ (SEÇİLEN SEKMEYE GÖRE TEK TEK GÖSTERİM)
         ========================================================================= */}
      <div className="relative z-10 w-full transition-all">

        {/* -----------------------------------------------------------------------
            BÖLÜM 1: GÜNLÜK GÖKSEL REHBER
           ----------------------------------------------------------------------- */}
        {/* -----------------------------------------------------------------------
            BÖLÜM 1: GÜNLÜK GÖKSEL REHBER (HER GÜN OTOMATİK DEĞİŞEN DİNAMİK YORUM)
           ----------------------------------------------------------------------- */}
        {activeSubTab === 'gunluk' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 1.1 Header & Gün Seçici (Dün / Bugün / Yarın) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-gradient-to-r from-[#f5d061]/25 to-[#7f00ff]/20 text-[#f5d061] text-[11px] font-bold uppercase tracking-widest border border-[#f5d061]/40 shadow-[0_0_10px_rgba(245,208,97,0.25)]">
                  ✨ Günlük Göksel
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f2ecfd] tracking-wide">
                  Günlük Göksel Rehber
                </h2>
              </div>

              {/* Day Offset Pills: Dün (-1), Bugün (0), Yarın (+1) */}
              <div className="flex items-center p-1 rounded-full bg-[#181427]/90 border border-[#443b56]/40 shadow-inner self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDayOffset(-1);
                    onPlayChime();
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedDayOffset === -1
                      ? 'bg-[#2e2747] text-[#00dce6] shadow-sm'
                      : 'text-[#c9bfdc] hover:text-white'
                  }`}
                >
                  Dün
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDayOffset(0);
                    onPlayChime();
                  }}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedDayOffset === 0
                      ? 'bg-gradient-to-r from-[#f5d061] to-[#ffe484] text-[#3d2f00] shadow-[0_0_12px_rgba(245,208,97,0.4)] scale-105'
                      : 'text-[#c9bfdc] hover:text-white'
                  }`}
                >
                  ✨ Bugün
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDayOffset(1);
                    onPlayChime();
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedDayOffset === 1
                      ? 'bg-[#2e2747] text-[#d5baff] shadow-sm'
                      : 'text-[#c9bfdc] hover:text-white'
                  }`}
                >
                  Yarın
                </button>
              </div>
            </div>

            {/* Date & Moon Phase Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#181427]/70 border border-white/5 text-xs text-[#c9bfdc]">
              <div className="flex items-center gap-1.5 font-medium text-[#f2ecfd]">
                <span className="material-symbols-outlined text-[16px] text-[#f5d061]">calendar_today</span>
                <span>{activeHoroscope.dateFormatted}</span>
                {selectedDayOffset === 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    CANLI
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[#00dce6] font-semibold">
                <span className="text-[14px]">{activeHoroscope.moonPhase.glyph}</span>
                <span>
                  {activeHoroscope.moonPhase.name} (%{activeHoroscope.moonPhase.percent}) • Ay {activeHoroscope.moonPhase.sign}
                </span>
              </div>
            </div>

            {/* 1.2 Burç Seçici (12 Burç Yatay Kaydırma Şeridi) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] px-1 text-[#c9bfdc]">
                <span className="font-semibold text-[#f5d061] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">stars</span>
                  Yorumu Okunacak Burç:
                </span>
                <span className="text-[10px] text-[#908fa0]">
                  Doğum Haritan: {natalData.sun.sign}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {ALL_ZODIAC_SIGNS.map((zSign) => {
                  const isSelected = selectedHoroscopeSign === zSign.name;
                  const isNatalSun = natalData.sun.sign === zSign.name;
                  return (
                    <button
                      key={zSign.name}
                      type="button"
                      onClick={() => {
                        setSelectedHoroscopeSign(zSign.name);
                        onPlayChime();
                        onShowToast(`${zSign.name} burcu günlük yorumu yüklendi ✦`, 'auto_awesome');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#7f00ff] to-[#f5d061] text-white shadow-[0_0_14px_rgba(245,208,97,0.35)] scale-105 border border-[#f5d061]/60'
                          : 'bg-[#181427]/80 hover:bg-[#231e36] text-[#c9bfdc] hover:text-white border border-[#443b56]/40'
                      }`}
                    >
                      <span className="text-[13px]">{zSign.glyph}</span>
                      <span>{zSign.name}</span>
                      {isNatalSun && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5d061] animate-ping" title="Senin Burcun" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1.3 Aurora Göksel Kart (Seçili Burcun Günlük Yorumu) */}
            <div className="relative rounded-2xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-[#f5d061]/35 space-y-4 overflow-hidden bg-gradient-to-br from-[#201738]/95 via-[#120e20]/90 to-[#1e1532]/95 backdrop-blur-xl">
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#f5d061]/10 blur-3xl pointer-events-none" />

              {/* Transit & Sky Badge Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2 text-[#00dce6]">
                  <span className="material-symbols-outlined text-[19px] text-[#00dce6] drop-shadow-[0_0_8px_rgba(0,220,230,0.6)]">
                    nights_stay
                  </span>
                  <span className="tracking-wide text-[#f2ecfd]">
                    {activeHoroscope.glyph} {activeHoroscope.sign} •{' '}
                    <span className="text-[#00dce6]">{activeHoroscope.planetaryTransit}</span>
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#f5d061]/15 text-[#f5d061] text-[10px] font-bold border border-[#f5d061]/30">
                  {activeHoroscope.element} Elementi
                </span>
              </div>

              {/* Cosmic Theme Title */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#f5d061] uppercase font-bold tracking-widest block">
                  Günün Kozmik Teması
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f2ecfd] tracking-tight">
                  {activeHoroscope.cosmicTheme}
                </h3>
              </div>

              {/* General Reading Body */}
              <p className="text-sm sm:text-base text-[#f2ecfd]/95 leading-relaxed font-light">
                {activeHoroscope.generalReading}
              </p>

              {/* 1.4 Astrological Stats Badges (Aşk, Kariyer, Zihin & Ruh) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Aşk */}
                <div
                  onClick={() => {
                    onPlayChime();
                    onShowToast(`💖 Aşk: %${activeHoroscope.love.score} - ${activeHoroscope.love.advice}`, 'favorite');
                  }}
                  className="p-3 rounded-xl bg-[#120f20]/85 hover:bg-[#231e36] border border-[#d5baff]/30 hover:border-[#d5baff]/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(213,186,255,0.25)] flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[20px]">💖</span>
                    <span className="text-base font-bold text-[#d5baff] drop-shadow-[0_0_6px_rgba(213,186,255,0.5)]">
                      %{activeHoroscope.love.score}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs font-bold text-[#f2ecfd] block truncate">
                      {activeHoroscope.love.title}
                    </span>
                    <span className="text-[10.5px] text-[#c9bfdc] line-clamp-2 mt-0.5 leading-snug">
                      {activeHoroscope.love.advice}
                    </span>
                  </div>
                </div>

                {/* Kariyer */}
                <div
                  onClick={() => {
                    onPlayChime();
                    onShowToast(`✨ Kariyer: %${activeHoroscope.career.score} - ${activeHoroscope.career.advice}`, 'payments');
                  }}
                  className="p-3 rounded-xl bg-[#120f20]/85 hover:bg-[#231e36] border border-[#f5d061]/30 hover:border-[#f5d061]/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(245,208,97,0.25)] flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[20px]">✨</span>
                    <span className="text-base font-bold text-[#f5d061] drop-shadow-[0_0_6px_rgba(245,208,97,0.6)]">
                      %{activeHoroscope.career.score}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs font-bold text-[#f2ecfd] block truncate">
                      {activeHoroscope.career.title}
                    </span>
                    <span className="text-[10.5px] text-[#c9bfdc] line-clamp-2 mt-0.5 leading-snug">
                      {activeHoroscope.career.advice}
                    </span>
                  </div>
                </div>

                {/* Zihin & Ruh */}
                <div
                  onClick={() => {
                    onPlayChime();
                    onShowToast(`🔮 Zihin & Ruh: %${activeHoroscope.spirit.score} - ${activeHoroscope.spirit.advice}`, 'psychology');
                  }}
                  className="p-3 rounded-xl bg-[#120f20]/85 hover:bg-[#231e36] border border-[#00dce6]/30 hover:border-[#00dce6]/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,220,230,0.25)] flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[20px]">🔮</span>
                    <span className="text-base font-bold text-[#00dce6] drop-shadow-[0_0_6px_rgba(0,220,230,0.5)]">
                      %{activeHoroscope.spirit.score}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs font-bold text-[#f2ecfd] block truncate">
                      {activeHoroscope.spirit.title}
                    </span>
                    <span className="text-[10.5px] text-[#c9bfdc] line-clamp-2 mt-0.5 leading-snug">
                      {activeHoroscope.spirit.advice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Günün 15 Dakikalık Kozmik Eylemi */}
              <div className="p-3.5 rounded-xl bg-[#120f20]/90 border border-[#f5d061]/25 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f5d061] text-[20px] shrink-0 mt-0.5">
                  timer
                </span>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#f5d061] uppercase font-bold tracking-widest block">
                    Günün 15 Dakikalık Kozmik Eylemi
                  </span>
                  <p className="text-xs text-[#f2ecfd] font-medium leading-relaxed">
                    {activeHoroscope.microAction}
                  </p>
                </div>
              </div>

              {/* Günün Kozmik Olumlaması */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#7f00ff]/25 via-[#231e36]/70 to-[#7f00ff]/15 border border-[#d5baff]/35 flex items-start justify-between gap-3 shadow-inner">
                <div className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-[#f5d061] text-[20px] shrink-0 mt-0.5 animate-spin"
                    style={{ animationDuration: '9s' }}
                  >
                    auto_awesome
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#f5d061] uppercase font-bold tracking-widest block">
                      Günün Kozmik Olumlaması
                    </span>
                    <p className="text-xs sm:text-sm text-[#f2ecfd] italic leading-relaxed">
                      “{activeHoroscope.cosmicAffirmation}”
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeHoroscope.cosmicAffirmation);
                    onPlayChime();
                    onShowToast('Olumlama panoya kopyalandı! ✨', 'content_copy');
                  }}
                  title="Olumlamayı Kopyala"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#d5baff] hover:text-white shrink-0 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
            </div>

            {/* 1.5 Günün Şanslı Frekansları & Uğurlu Saatleri */}
            <div className="rounded-2xl bg-[#181427]/90 p-4 border border-[#443b56]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f5d061] uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">diamond</span>
                  {activeHoroscope.sign} Burcunun Bugün Şanslı Frekansları
                </span>
                <span className="text-[10px] text-[#c9bfdc]">
                  Güne Göre Hesaplanmış
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#231e36]/70 border border-white/5 space-y-0.5">
                  <span className="text-[10.5px] text-[#c9bfdc] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#f5d061]">schedule</span>
                    Şanslı Saat Aralığı
                  </span>
                  <span className="font-bold text-[#f2ecfd] text-sm block">
                    {activeHoroscope.luckyHours}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#231e36]/70 border border-white/5 space-y-0.5">
                  <span className="text-[10.5px] text-[#c9bfdc] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#00dce6]">palette</span>
                    Uğurlu Renkler
                  </span>
                  <span className="font-bold text-[#00dce6] text-xs sm:text-sm block truncate">
                    {activeHoroscope.luckyColors}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#231e36]/70 border border-white/5 space-y-0.5">
                  <span className="text-[10.5px] text-[#c9bfdc] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#d5baff]">sparkles</span>
                    Rezonans Kristali
                  </span>
                  <span className="font-bold text-[#d5baff] text-xs sm:text-sm block truncate">
                    {activeHoroscope.luckyCrystal}
                  </span>
                </div>
              </div>
            </div>

            {/* Geçiş Butonu */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSelectSubTab('harita')}
                className="py-3 px-6 rounded-full bg-gradient-to-r from-[#7f00ff]/40 to-[#f5d061]/25 hover:from-[#7f00ff]/60 hover:to-[#f5d061]/35 border border-[#f5d061]/40 text-[#f5d061] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <span>Doğum Haritası Çarkına Geç</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            BÖLÜM 2: BÜYÜK ÜÇLÜ & 360° ÇARK (YILDIZLARLA DOLU VE KİLİTLİ ÇARK)
           ----------------------------------------------------------------------- */}
        {activeSubTab === 'harita' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-[#00dce6]/20 text-[#00dce6] text-[11px] font-bold uppercase tracking-widest border border-[#00dce6]/35 shadow-[0_0_10px_rgba(0,220,230,0.2)]">
                  ✦ 360° Astrolabe
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f2ecfd] tracking-wide">
                  Büyük Üçlü &amp; 360° Çark
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#231e36]/80 border border-[#443b56]/40 text-[#c9bfdc] text-xs uppercase font-semibold">
                Placidus Sistemi
              </span>
            </div>

            {/* The Big Three Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Güneş (Sun) */}
              <div
                onClick={() => togglePlanet('sun')}
                className="p-3 rounded-xl bg-[#181427]/90 border border-[#f5d061]/35 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#f5d061]/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[#f5d061] mb-1">
                  <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9bfdc]">Güneş</span>
                </div>
                <span className="font-serif text-base sm:text-lg font-bold text-[#f2ecfd]">
                  {natalData.sun.sign}
                </span>
                <span className="text-[11px] text-[#f5d061] mt-0.5 font-bold">23° • 10. Ev MC</span>
                <span className="text-[10.5px] text-[#c9bfdc] mt-1 font-medium">Öz Benlik</span>
              </div>

              {/* Ay (Moon) */}
              <div
                onClick={() => togglePlanet('moon')}
                className="p-3 rounded-xl bg-[#181427]/90 border border-[#d5baff]/35 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#d5baff]/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[#d5baff] mb-1">
                  <span className="material-symbols-outlined text-[16px]">bedtime</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9bfdc]">Ay</span>
                </div>
                <span className="font-serif text-base sm:text-lg font-bold text-[#f2ecfd]">
                  {natalData.moon.sign}
                </span>
                <span className="text-[11px] text-[#d5baff] mt-0.5 font-bold">11° • 4. Ev IC</span>
                <span className="text-[10.5px] text-[#c9bfdc] mt-1 font-medium">Bilinçaltı</span>
              </div>

              {/* Yükselen (Ascendant) */}
              <div
                onClick={() => togglePlanet('asc')}
                className="p-3 rounded-xl bg-[#181427]/90 border border-[#00dce6]/35 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#00dce6]/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1 text-[#00dce6] mb-1">
                  <span className="material-symbols-outlined text-[16px]">change_history</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9bfdc]">Yükselen</span>
                </div>
                <span className="font-serif text-base sm:text-lg font-bold text-[#f2ecfd]">
                  {natalData.rising.sign}
                </span>
                <span className="text-[11px] text-[#00dce6] mt-0.5 font-bold">18° • 1. Ev ASC</span>
                <span className="text-[10.5px] text-[#c9bfdc] mt-1 font-medium">Dış Aura</span>
              </div>
            </div>

            {/* 360 Natal Chart Visual Wheel Container */}
            <div className="rounded-2xl bg-[#181427]/95 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-[#443b56]/50 flex flex-col items-center relative overflow-hidden backdrop-blur-xl">
              {/* Radiant Cosmic Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(127,0,255,0.2)_0%,rgba(245,208,97,0.08)_45%,transparent_75%)] pointer-events-none" />

              {/* Interactive Wheel Stage - Fixed Aspect Square */}
              <div
                ref={wheelContainerRef}
                onPointerDown={(e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {}
                  setIsAutoSpinning(false);
                  handlePointerDown(e.clientX, e.clientY);
                }}
                onPointerMove={(e) => {
                  handlePointerMove(e.clientX, e.clientY);
                }}
                onPointerUp={(e) => {
                  try {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  } catch {}
                  handlePointerUp();
                }}
                onPointerCancel={handlePointerUp}
                className="relative w-full max-w-[340px] aspect-square flex items-center justify-center my-2 select-none cursor-grab active:cursor-grabbing touch-none"
              >
                {/* Halo backlight aura */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#7f00ff]/25 via-[#f5d061]/10 to-[#00dce6]/20 blur-2xl pointer-events-none animate-pulse" />

                {/* SVG Canvas (STATIONARY BOUNDARY - 400x400 viewBox) */}
                <svg
                  id="natalWheelSvg"
                  viewBox="0 0 400 400"
                  className="w-full h-full select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <radialGradient id="celestialCore" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2a1d47" stopOpacity="0.95" />
                      <stop offset="65%" stopColor="#140f25" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#080a16" stopOpacity="1" />
                    </radialGradient>
                    <linearGradient id="goldTrine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffe484" />
                      <stop offset="100%" stopColor="#f5d061" />
                    </linearGradient>
                    <linearGradient id="cyanOpp" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00dce6" />
                      <stop offset="100%" stopColor="#7f00ff" />
                    </linearGradient>
                    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="1.8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Base Outer Stationary Rings */}
                  <circle cx="200" cy="200" r="194" fill="#0c0919" />
                  <circle cx="200" cy="200" r="194" fill="none" stroke="#4b4356" strokeOpacity="0.5" strokeWidth="1.5" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="#7f00ff" strokeOpacity="0.55" strokeWidth="1.2" />
                  <circle cx="200" cy="200" r="128" fill="none" stroke="#4b4356" strokeDasharray="2 3" strokeOpacity="0.6" strokeWidth="1" />

                  {/* =========================================================================
                      DÖNEN GÖK KUBBE & YILDIZLAR (TRANSFORM LİTERALLY PİNNED TO CENTER (200, 200))
                     ========================================================================= */}
                  <g
                    transform={`rotate(${rotationDegree}, 200, 200)`}
                    style={{
                      transformOrigin: '200px 200px',
                      transformBox: 'view-box',
                      transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Outer subtle tick marks */}
                    <circle cx="200" cy="200" r="184" fill="none" stroke="#d5baff" strokeDasharray="1 8" strokeOpacity="0.45" strokeWidth="2" />
                    <circle cx="200" cy="200" r="148" fill="none" stroke="#f5d061" strokeDasharray="1 12" strokeOpacity="0.35" strokeWidth="1.5" />

                    {/* Çarka Eklenen Yıldızlar & Takımyıldızlar */}
                    {starsGlowing && (
                      <g id="celestialStarsLayer" className="transition-opacity duration-500">
                        {/* Pleiades (Ülker Kümesi - 7 Yıldız) */}
                        <g opacity="0.95" filter="url(#starGlow)">
                          <circle cx="338" cy="118" r="2.2" fill="#ffe484" />
                          <circle cx="344" cy="114" r="1.8" fill="#ffffff" />
                          <circle cx="348" cy="122" r="1.6" fill="#ffe484" />
                          <circle cx="341" cy="126" r="1.4" fill="#ffffff" />
                          <circle cx="332" cy="124" r="1.3" fill="#ffe484" />
                          <circle cx="327" cy="116" r="1.2" fill="#ffffff" />
                          <circle cx="350" cy="112" r="1.0" fill="#ffffff" />
                          <polyline
                            points="327,116 338,118 344,114 350,112 348,122 341,126 332,124 338,118"
                            fill="none"
                            stroke="#f5d061"
                            strokeWidth="0.5"
                            strokeOpacity="0.45"
                          />
                          <text x="345" y="136" fill="#f5d061" fontSize="7" fontFamily="Manrope" fontStyle="italic" textAnchor="middle" opacity="0.8">
                            Pleiades
                          </text>
                        </g>

                        {/* Major Royal Fixed Stars */}
                        <g filter="url(#starGlow)">
                          <circle cx="316" cy="142" r="2.5" fill="#f5d061" />
                          <path d="M 316,138 L 317,141 L 320,142 L 317,143 L 316,146 L 315,143 L 312,142 L 315,141 Z" fill="#ffe484" />
                          <text x="316" y="153" fill="#f5d061" fontSize="7.5" fontWeight="600" textAnchor="middle">Aldebaran ★</text>
                        </g>

                        <g filter="url(#starGlow)">
                          <circle cx="340" cy="275" r="3" fill="#ffffff" />
                          <path d="M 340,269 L 341.5,273.5 L 346,275 L 341.5,276.5 L 340,281 L 338.5,276.5 L 334,275 L 338.5,273.5 Z" fill="#ffffff" />
                          <text x="340" y="289" fill="#e6dff5" fontSize="7.5" fontWeight="700" textAnchor="middle">Sirius ★</text>
                        </g>

                        <g filter="url(#starGlow)">
                          <circle cx="280" cy="342" r="2.4" fill="#f5d061" />
                          <path d="M 280,338 L 281,341 L 284,342 L 281,343 L 280,346 L 279,343 L 276,342 L 279,341 Z" fill="#ffe484" />
                          <text x="280" y="354" fill="#f5d061" fontSize="7.5" fontWeight="600" textAnchor="middle">Regulus ★</text>
                        </g>

                        <g filter="url(#starGlow)">
                          <circle cx="150" cy="360" r="2.4" fill="#6ff6ff" />
                          <text x="150" y="371" fill="#00dce6" fontSize="7.5" fontWeight="600" textAnchor="middle">Spica ★</text>
                        </g>

                        <g filter="url(#starGlow)">
                          <circle cx="75" cy="305" r="2.6" fill="#ffb4ab" />
                          <path d="M 75,301 L 76,304 L 79,305 L 76,306 L 75,309 L 74,306 L 71,305 L 74,304 Z" fill="#ffb4ab" />
                          <text x="75" y="318" fill="#ffb4ab" fontSize="7.5" fontWeight="600" textAnchor="middle">Antares ★</text>
                        </g>

                        <g filter="url(#starGlow)">
                          <circle cx="65" cy="140" r="2.5" fill="#d5baff" />
                          <text x="65" y="151" fill="#ddb7ff" fontSize="7.5" fontWeight="600" textAnchor="middle">Vega ★</text>
                        </g>

                        <g filter="url(#starGlow)">
                          <circle cx="100" cy="65" r="2.3" fill="#6ff6ff" />
                          <text x="100" y="76" fill="#00dce6" fontSize="7.5" fontWeight="600" textAnchor="middle">Fomalhaut ★</text>
                        </g>

                        {/* Multi-magnitude Star Points */}
                        {[
                          { x: 230, y: 55, r: 1.5, c: '#ffe484', o: 0.8 },
                          { x: 260, y: 70, r: 1.2, c: '#ffffff', o: 0.7 },
                          { x: 300, y: 80, r: 1.4, c: '#d5baff', o: 0.9 },
                          { x: 360, y: 150, r: 1.3, c: '#ffffff', o: 0.8 },
                          { x: 355, y: 215, r: 1.6, c: '#ffe484', o: 0.85 },
                          { x: 310, y: 295, r: 1.4, c: '#6ff6ff', o: 0.8 },
                          { x: 215, y: 365, r: 1.3, c: '#ffffff', o: 0.75 },
                          { x: 185, y: 365, r: 1.5, c: '#d5baff', o: 0.85 },
                          { x: 120, y: 350, r: 1.2, c: '#ffe484', o: 0.7 },
                          { x: 50, y: 235, r: 1.5, c: '#ffffff', o: 0.85 },
                          { x: 45, y: 155, r: 1.3, c: '#6ff6ff', o: 0.8 },
                          { x: 80, y: 85, r: 1.4, c: '#ffe484', o: 0.75 },
                          { x: 150, y: 50, r: 1.5, c: '#ffffff', o: 0.9 },
                        ].map((star, idx) => (
                          <circle key={idx} cx={star.x} cy={star.y} r={star.r} fill={star.c} opacity={star.o} />
                        ))}
                      </g>
                    )}

                    {/* 12 Zodiac Symbols on Outer Track */}
                    <text x="285" y="45" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♈</text>
                    <text x="348" y="105" fill="#f5d061" filter="url(#glowGold)" fontSize="15" fontWeight="700" textAnchor="middle">♉</text>
                    <text x="375" y="180" fill="#d5baff" fontSize="13" fontWeight="600" textAnchor="middle">♊</text>
                    <text x="365" y="255" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♋</text>
                    <text x="320" y="325" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♌</text>
                    <text x="245" y="370" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♍</text>
                    <text x="160" y="375" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♎</text>
                    <text x="85" y="335" fill="#00dce6" fontSize="15" fontWeight="700" textAnchor="middle">♏</text>
                    <text x="35" y="260" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♐</text>
                    <text x="25" y="180" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♑</text>
                    <text x="55" y="105" fill="#e6dff5" fontSize="13" fontWeight="600" textAnchor="middle">♒</text>
                    <text x="120" y="45" fill="#d5baff" fontSize="15" fontWeight="700" textAnchor="middle">♓</text>

                    {/* House Axis Lines */}
                    <line x1="10" y1="200" x2="390" y2="200" stroke="#00dce6" strokeOpacity="0.85" strokeWidth="2" />
                    <line x1="200" y1="10" x2="200" y2="390" stroke="#f5d061" strokeOpacity="0.85" strokeWidth="2" />
                    <line x1="48" y1="105" x2="352" y2="295" stroke="#4b4356" strokeOpacity="0.45" strokeWidth="0.8" />
                    <line x1="105" y1="48" x2="295" y2="352" stroke="#4b4356" strokeOpacity="0.45" strokeWidth="0.8" />
                    <line x1="295" y1="48" x2="105" y2="352" stroke="#4b4356" strokeOpacity="0.45" strokeWidth="0.8" />
                    <line x1="352" y1="105" x2="48" y2="295" stroke="#4b4356" strokeOpacity="0.45" strokeWidth="0.8" />

                    {/* House Cusp Markers */}
                    <text x="145" y="185" fill="#978da3" fontFamily="Manrope" fontSize="10">X</text>
                    <text x="110" y="215" fill="#00dce6" fontFamily="Manrope" fontSize="10" fontWeight="700">I</text>
                    <text x="135" y="265" fill="#978da3" fontFamily="Manrope" fontSize="10">IV</text>
                    <text x="260" y="195" fill="#978da3" fontFamily="Manrope" fontSize="10">VII</text>

                    {/* Aspect Polygons */}
                    {aspectsVisible && (
                      <g id="aspectLayer" className="transition-opacity duration-300">
                        <polygon
                          points="325,120 195,335 95,140"
                          fill="rgba(245, 208, 97, 0.05)"
                          stroke="url(#goldTrine)"
                          strokeOpacity="0.9"
                          strokeWidth="2"
                        />
                        <line
                          x1="330"
                          y1="125"
                          x2="85"
                          y2="280"
                          stroke="url(#cyanOpp)"
                          strokeOpacity="0.8"
                          strokeWidth="1.8"
                        />
                        <line
                          x1="315"
                          y1="95"
                          x2="285"
                          y2="55"
                          stroke="#ddb7ff"
                          strokeDasharray="3 3"
                          strokeOpacity="0.9"
                          strokeWidth="1.4"
                        />
                      </g>
                    )}

                    {/* Interactive Planetary Markers */}
                    <g className="cursor-pointer">
                      <g onClick={(e) => { e.stopPropagation(); togglePlanet('sun'); }}>
                        <circle cx="320" cy="115" r="11" fill="#201e2d" stroke="#f5d061" strokeWidth="1.5" />
                        <text x="320" y="119" fill="#f5d061" fontSize="10" fontWeight="bold" textAnchor="middle">☉</text>
                      </g>
                      <g onClick={(e) => { e.stopPropagation(); togglePlanet('moon'); }}>
                        <circle cx="115" cy="55" r="11" fill="#201e2d" stroke="#d5baff" strokeWidth="1.5" />
                        <text x="115" y="59" fill="#d5baff" fontSize="10" fontWeight="bold" textAnchor="middle">☽</text>
                      </g>
                      <g onClick={(e) => { e.stopPropagation(); togglePlanet('venus'); }}>
                        <circle cx="340" cy="135" r="10" fill="#201e2d" stroke="#ddb7ff" strokeWidth="1.5" />
                        <text x="340" y="139" fill="#ddb7ff" fontSize="9.5" fontWeight="bold" textAnchor="middle">♀</text>
                      </g>
                      <g onClick={(e) => { e.stopPropagation(); togglePlanet('mars'); }}>
                        <circle cx="280" cy="65" r="10" fill="#201e2d" stroke="#ffb4ab" strokeWidth="1.5" />
                        <text x="280" y="69" fill="#ffb4ab" fontSize="9.5" fontWeight="bold" textAnchor="middle">♂</text>
                      </g>
                      <g>
                        <circle cx="195" cy="335" r="10" fill="#201e2d" stroke="#00dce6" strokeWidth="1.5" />
                        <text x="195" y="339" fill="#00dce6" fontSize="9.5" fontWeight="bold" textAnchor="middle">♃</text>
                      </g>
                      <g>
                        <circle cx="310" cy="155" r="10" fill="#201e2d" stroke="#f5d061" strokeWidth="1.5" />
                        <text x="310" y="159" fill="#f5d061" fontSize="9.5" fontWeight="bold" textAnchor="middle">♄</text>
                      </g>
                    </g>

                    {/* Celestial Center Inner Gradient Disc */}
                    <circle cx="200" cy="200" r="72" fill="url(#celestialCore)" stroke="#d5baff" strokeOpacity="0.75" strokeWidth="1.2" />
                  </g>

                  {/* Stationary Center Cosmic Core (Always Pinned at Center) */}
                  <circle cx="200" cy="200" r="32" fill="#201e2d" stroke="#f5d061" strokeOpacity="0.6" strokeWidth="1" />
                  <circle cx="200" cy="200" r="18" fill="#7f00ff" fillOpacity="0.45" />
                  <circle cx="200" cy="200" r="6" fill="#f5d061" filter="url(#glowGold)" />
                  <text x="200" y="204" fill="#f5d061" filter="url(#glowGold)" fontSize="12" fontWeight="700" textAnchor="middle">✦</text>
                </svg>
              </div>

              {/* Aspect Legend Badges */}
              <div className="flex items-center justify-center gap-4 w-full py-1 text-[#c9bfdc] text-xs border-t border-[#443b56]/40 pt-3 mt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5d061] shadow-[0_0_8px_#f5d061]" /> Üçgen (120°)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00dce6] shadow-[0_0_8px_#00dce6]" /> Karşıt (180°)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ddb7ff] shadow-[0_0_8px_#ddb7ff]" /> Sekstil (60°)
                </span>
              </div>

              {/* Real-time Angle & Rotation Slider */}
              <div className="w-full space-y-2 mt-2 px-1">
                <div className="flex items-center justify-between text-xs text-[#c9bfdc]">
                  <span className="flex items-center gap-1.5 font-mono text-[#f5d061] font-bold">
                    <span className="material-symbols-outlined text-[16px]">sync</span>
                    <span>Çark Açısı: {normalizedDegree}°</span>
                  </span>
                  <span className="text-[11px] text-[#00dce6] font-medium bg-[#00dce6]/10 px-2 py-0.5 rounded-full border border-[#00dce6]/20">
                    {isAutoSpinning ? '🌟 Canlı Yörüngede Dönüyor' : 'Serbest Döndürme Aktif'}
                  </span>
                </div>
                
                {/* Degree Slider */}
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={normalizedDegree}
                  onChange={(e) => {
                    setIsAutoSpinning(false);
                    setIsDragging(false);
                    setRotationDegree(Number(e.target.value));
                  }}
                  className="w-full accent-[#f5d061] h-2 bg-[#060411] rounded-lg cursor-pointer"
                />
              </div>

              {/* Interactive Wheel Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-3">
                <button
                  type="button"
                  onClick={() => handleRotateWheel(-30)}
                  className="py-2.5 px-3 rounded-full bg-[#231e36] hover:bg-[#2e2747] text-[#f2ecfd] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#443b56]/50 active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Saat yönünün tersine 30° döndür"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#f5d061]">
                    rotate_left
                  </span>
                  <span>-30° Sola</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRotateWheel(30)}
                  className="py-2.5 px-3 rounded-full bg-[#231e36] hover:bg-[#2e2747] text-[#f2ecfd] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#443b56]/50 active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Saat yönünde 30° döndür"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#f5d061]">
                    rotate_right
                  </span>
                  <span>+30° Sağa</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAutoSpinning(!isAutoSpinning);
                    onPlayChime();
                    onShowToast(!isAutoSpinning ? '✦ Canlı Yörünge Dönüşü Aktif! ✦' : 'Yörünge dönüşü duraklatıldı.', 'autorenew');
                  }}
                  className={`py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border active:scale-95 transition-all cursor-pointer ${
                    isAutoSpinning
                      ? 'bg-gradient-to-r from-[#f5d061] to-[#ffe484] text-[#3d2f00] font-bold shadow-[0_0_12px_rgba(245,208,97,0.4)]'
                      : 'bg-[#231e36] hover:bg-[#2e2747] text-[#c9bfdc] border-[#443b56]/50'
                  }`}
                  title="Otomatik yörüngesel dönüşü aç/kapat"
                >
                  <span className={`material-symbols-outlined text-[17px] ${isAutoSpinning ? 'animate-spin' : ''}`}>
                    autorenew
                  </span>
                  <span>{isAutoSpinning ? 'Durdur' : 'Canlı Döndür'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetWheel}
                  className="py-2.5 px-3 rounded-full bg-[#231e36] hover:bg-[#2e2747] text-[#c9bfdc] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#443b56]/50 active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Açıyı 0° başlangıç durumuna sıfırla"
                >
                  <span className="material-symbols-outlined text-[17px]">restart_alt</span>
                  <span>0° Sıfırla</span>
                </button>
              </div>

              {/* Aspect and Star Toggles */}
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                <button
                  type="button"
                  onClick={handleToggleAspects}
                  className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border active:scale-95 transition-all cursor-pointer ${
                    aspectsVisible
                      ? 'bg-[#7f00ff]/35 text-[#ecdcff] border-[#7f00ff]/50 shadow-[0_0_12px_rgba(127,0,255,0.25)]'
                      : 'bg-[#231e36] text-[#c9bfdc] border-[#443b56]/40 opacity-60'
                  }`}
                  title="Açı çizgilerini aç/kapat"
                >
                  <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
                  <span>Açı Çizgileri</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleStars}
                  className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border active:scale-95 transition-all cursor-pointer ${
                    starsGlowing
                      ? 'bg-[#f5d061]/20 text-[#f5d061] border-[#f5d061]/45 shadow-[0_0_12px_rgba(245,208,97,0.25)]'
                      : 'bg-[#231e36] text-[#c9bfdc] border-[#443b56]/40 opacity-60'
                  }`}
                  title="Yıldızları ve takımyıldızları parlat"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#f5d061]">stars</span>
                  <span>Göksel Yıldızlar</span>
                </button>
              </div>
            </div>

            {/* Gezinme Butonları */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSelectSubTab('gunluk')}
                className="py-2.5 px-4 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[#c9bfdc] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                <span>Günlük Yorum</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSubTab('element')}
                className="py-2.5 px-4 rounded-full bg-gradient-to-r from-[#7f00ff]/40 to-[#f5d061]/25 hover:from-[#7f00ff]/60 hover:to-[#f5d061]/35 border border-[#f5d061]/40 text-[#f5d061] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Mizaç &amp; Element Dengesi</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            BÖLÜM 3: ELEMENT & MİZAÇ DENGESİ
           ----------------------------------------------------------------------- */}
        {activeSubTab === 'element' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-[#7f00ff]/20 text-[#d5baff] text-[11px] font-bold uppercase tracking-widest border border-[#7f00ff]/35 shadow-[0_0_10px_rgba(127,0,255,0.25)]">
                  💧 Dört Mizaç &amp; Denge
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f2ecfd] tracking-wide">
                  Günlük Mizaç &amp; Element Dengesi
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#f5d061] bg-[#f5d061]/10 px-2.5 py-1 rounded-full border border-[#f5d061]/25">
                {dailyTemperament.dominantSign}
              </span>
            </div>

            <div className="rounded-2xl bg-[#181427]/90 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-[#443b56]/40 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                <span className="font-serif font-bold text-sm text-[#f2ecfd]">
                  {dailyTemperament.temperamentTitle}
                </span>
                <span className="text-[10.5px] text-[#c9bfdc]">
                  {dailyTemperament.dateFormatted} İçin Güncellendi
                </span>
              </div>

              {/* Progress Bars with Glowing Gradients */}
              <div className="space-y-3.5">
                {/* Su */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-[#f2ecfd]">
                      <span>💧</span> Su (Sezgisellik &amp; Duygusal Derinlik)
                    </span>
                    <span className="font-bold text-[#00dce6] drop-shadow-[0_0_6px_rgba(0,220,230,0.5)]">
                      %{dailyTemperament.waterPercent}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#060411] overflow-hidden border border-[#00dce6]/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#006b71] via-[#00dce6] to-[#6ff6ff] shadow-[0_0_10px_rgba(0,220,230,0.4)] transition-all duration-700"
                      style={{ width: `${dailyTemperament.waterPercent}%` }}
                    />
                  </div>
                </div>

                {/* Toprak */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-[#f2ecfd]">
                      <span>🌍</span> Toprak (Sarsılmaz Gerçekçilik &amp; Uygulama)
                    </span>
                    <span className="font-bold text-[#f5d061] drop-shadow-[0_0_6px_rgba(245,208,97,0.6)]">
                      %{dailyTemperament.earthPercent}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#060411] overflow-hidden border border-[#f5d061]/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#b38600] via-[#f5d061] to-[#ffe484] shadow-[0_0_10px_rgba(245,208,97,0.4)] transition-all duration-700"
                      style={{ width: `${dailyTemperament.earthPercent}%` }}
                    />
                  </div>
                </div>

                {/* Ateş */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-[#f2ecfd]">
                      <span>🔥</span> Ateş (Eylem Kıvılcımı &amp; Tutkulu Cesaret)
                    </span>
                    <span className="font-bold text-[#ffb4ab] drop-shadow-[0_0_6px_rgba(255,180,171,0.5)]">
                      %{dailyTemperament.firePercent}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#060411] overflow-hidden border border-[#ffb4ab]/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#93000a] via-[#ffb4ab] to-[#ffdad6] shadow-[0_0_10px_rgba(255,180,171,0.3)] transition-all duration-700"
                      style={{ width: `${dailyTemperament.firePercent}%` }}
                    />
                  </div>
                </div>

                {/* Hava */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-[#f2ecfd]">
                      <span>💨</span> Hava (Strateji, Vizyon &amp; İletişim)
                    </span>
                    <span className="font-bold text-[#ddb7ff] drop-shadow-[0_0_6px_rgba(221,183,255,0.5)]">
                      %{dailyTemperament.airPercent}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#060411] overflow-hidden border border-[#ddb7ff]/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6f00be] via-[#ddb7ff] to-[#f0dbff] shadow-[0_0_10px_rgba(221,183,255,0.3)] transition-all duration-700"
                      style={{ width: `${dailyTemperament.airPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Günlük Beden & Ritim Durumu */}
              <div className="pt-2 border-t border-[#443b56]/30 flex items-center justify-between text-xs text-[#c9bfdc]">
                <span className="flex items-center gap-1 text-[#f5d061] font-semibold">
                  <span className="material-symbols-outlined text-[15px]">vital_signs</span>
                  <span>{dailyTemperament.bodilyState}</span>
                </span>
                <span className="text-[10px] text-[#00dce6]">Nöro-Mizaç Harmonisi</span>
              </div>
            </div>

            {/* Kişisel Mizaç Notu & Günlük Dengeleme */}
            <div className="rounded-2xl bg-[#181427]/90 p-4 border border-[#443b56]/40 space-y-3 text-xs leading-relaxed text-[#c9bfdc]">
              <div>
                <span className="font-bold text-[#f5d061] uppercase tracking-wider block mb-1">
                  Bugünün Mizaç Rehberliği
                </span>
                <p className="text-[#f2ecfd]">
                  {dailyTemperament.dailyInterpretation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#231e36]/70 border border-[#f5d061]/25 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#f5d061] text-[18px] shrink-0 mt-0.5">
                  spa
                </span>
                <div>
                  <span className="font-bold text-[#f5d061] block mb-0.5">Günlük Dengeleme Ritüeli</span>
                  <p className="text-[11.5px] text-[#c9bfdc]">
                    {dailyTemperament.balancingAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* Gezinme Butonları */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSelectSubTab('harita')}
                className="py-2.5 px-4 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[#c9bfdc] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                <span>Doğum Haritası</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSubTab('gezegenler')}
                className="py-2.5 px-4 rounded-full bg-gradient-to-r from-[#7f00ff]/40 to-[#f5d061]/25 hover:from-[#7f00ff]/60 hover:to-[#f5d061]/35 border border-[#f5d061]/40 text-[#f5d061] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Gezegen Yerleşimleri</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            GEZEGEN YERLEŞİMLERİ (DİNAMİK GÜNLÜK & HAFTALIK AKORDİYON)
           ----------------------------------------------------------------------- */}
        {activeSubTab === 'gezegenler' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-[#ddb7ff]/20 text-[#ddb7ff] text-[11px] font-bold uppercase tracking-widest border border-[#ddb7ff]/35 shadow-[0_0_10px_rgba(221,183,255,0.25)]">
                  🪐 Gezegen Yerleşimleri
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f2ecfd] tracking-wide">
                  Gezegen Konumları &amp; Yorumlar
                </h2>
              </div>
              <button
                type="button"
                onClick={handleToggleAllPlanets}
                className="text-xs text-[#00dce6] hover:underline font-semibold cursor-pointer"
              >
                Tümünü Aç / Kapa
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#231e36]/60 border border-[#443b56]/40 flex items-center justify-between text-xs text-[#c9bfdc]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#f5d061] text-[16px]">calendar_month</span>
                <span>Haftalık ve Günlük Canlı Transit Etkileri</span>
              </span>
              <span className="text-[11px] text-[#f5d061] font-semibold">
                {selectedHoroscopeSign} İçin Güncel
              </span>
            </div>

            {/* Gezegen Kartları Listesi (Dinamik) */}
            <div className="space-y-2.5">
              {dynamicPlanets.map((planet) => {
                const isOpen = !!expandedPlanets[planet.id];
                return (
                  <div
                    key={planet.id}
                    onClick={() => togglePlanet(planet.id)}
                    className={`rounded-xl bg-[#181427]/90 p-4 border transition-all cursor-pointer select-none ${
                      isOpen
                        ? 'border-[#f5d061]/60 shadow-[0_4px_20px_rgba(245,208,97,0.18)]'
                        : 'border-[#443b56]/40 hover:border-[#f5d061]/45'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border shrink-0 font-serif text-[20px] font-bold shadow-sm bg-[#f5d061]/15 border-[#f5d061]/50 text-[#f5d061]">
                          {planet.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[#f2ecfd]">
                              {planet.name} • {planet.sign}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#7f00ff]/20 border-[#7f00ff]/40 text-[#ddb7ff]">
                              {planet.house}
                            </span>
                            {planet.statusBadge && (
                              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#f5d061] text-[9.5px] font-bold">
                                {planet.statusBadge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#c9bfdc]">
                            {planet.degree} • {planet.theme}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[#c9bfdc] text-[20px] transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#f5d061]' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-[#443b56]/30 text-[#f2ecfd] text-xs space-y-2.5 animate-fadeIn">
                        <p className="leading-relaxed text-[#f2ecfd]/95">
                          {planet.weeklyForecast}
                        </p>
                        <div className="flex items-center gap-1.5 text-[#f5d061] text-[11px] font-medium pt-0.5">
                          <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
                          <span>Günün Tavsiyesi: {planet.dailyAdvice}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bölüm Altı Gezinme Butonları */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSelectSubTab('element')}
                className="py-2.5 px-4 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[#c9bfdc] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                <span>Mizaç &amp; Denge</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSubTab('transitler')}
                className="py-2.5 px-4 rounded-full bg-gradient-to-r from-[#7f00ff]/40 to-[#f5d061]/25 hover:from-[#7f00ff]/60 hover:to-[#f5d061]/35 border border-[#f5d061]/40 text-[#f5d061] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Günün Transitleri</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            GÜNÜN TRANSİTLERİ & BÜYÜK AÇILAR (DİNAMİK GÜNLÜK VE DERİN YORUMLAR)
           ----------------------------------------------------------------------- */}
        {activeSubTab === 'transitler' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-[#00dce6]/20 text-[#00dce6] text-[11px] font-bold uppercase tracking-widest border border-[#00dce6]/35 shadow-[0_0_10px_rgba(0,220,230,0.2)]">
                  🌌 Günün Canlı Transitleri
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f2ecfd] tracking-wide">
                  Günün Transitleri &amp; Açılar
                </h2>
              </div>
              <span className="material-symbols-outlined text-[#00dce6] text-[20px] drop-shadow-[0_0_8px_rgba(0,220,230,0.5)]">
                auto_awesome
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#7f00ff]/20 to-[#f5d061]/15 border border-[#7f00ff]/30 text-xs text-[#f2ecfd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f5d061] text-[18px]">timelapse</span>
                <span>Gökyüzü transitleri günlük olarak yenilenir ve burcunuza özel rezonans üretir.</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#181427]/90 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-[#443b56]/40 space-y-3.5 backdrop-blur-xl">
              {dailyTransits.map((transit) => (
                <div
                  key={transit.id}
                  className="p-4 rounded-xl bg-[#231e36]/75 hover:bg-[#231e36] border border-[#443b56]/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#f2ecfd]">
                          {transit.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#00dce6]/15 text-[#00dce6] text-[10px] font-bold border border-[#00dce6]/30">
                          {transit.aspectDegree}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#f5d061]/15 text-[#f5d061] text-[10px] font-bold border border-[#f5d061]/30">
                          {transit.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#00dce6]">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>Zirve Saati: {transit.peakHours}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#f5d061] text-[20px] shrink-0">
                      {transit.icon}
                    </span>
                  </div>

                  <p className="text-xs text-[#c9bfdc] leading-relaxed pt-1">
                    {transit.detailedReading}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#f5d061]">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    <span>Günün Tavsiyesi: {transit.practicalTip}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 432Hz Dinleme Butonu */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onToggleAudio();
                  onPlayChime();
                  onShowToast(
                    isAudioPlaying
                      ? '432Hz dinleme duraklatıldı.'
                      : '✦ 432Hz Göksel Niyet frekansı başlatıldı! ✦',
                    'headphones'
                  );
                }}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#7f00ff] via-[#6f00be] to-[#f5d061] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_0_28px_rgba(127,0,255,0.45),0_0_15px_rgba(245,208,97,0.3)] active:scale-95 transition-all relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="material-symbols-outlined text-[22px] text-[#ffe484]">
                  {isAudioPlaying ? 'pause_circle' : 'headphones'}
                </span>
                <span className="tracking-wide">
                  {isAudioPlaying
                    ? '432Hz Göksel Niyeti Duraklat'
                    : 'Bugünün Göksel Niyetini Dinle (432Hz)'}
                </span>
              </button>
            </div>

            {/* Bölüm Altı Gezinme Butonları */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSelectSubTab('gezegenler')}
                className="py-2.5 px-4 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[#c9bfdc] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                <span>Gezegenler</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSubTab('gunluk')}
                className="py-2.5 px-4 rounded-full bg-[#231e36] hover:bg-[#2e2747] border border-[#443b56]/40 text-[#f5d061] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Günlük Yorum'a Dön</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          DOĞUM BİLGİLERİ DÜZENLEME MODALI (Modal Popup)
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#181427] border border-[#7f00ff]/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f5d061] text-[20px]">auto_awesome</span>
                <h3 className="font-serif text-base font-bold text-[#f2ecfd]">
                  Doğum Haritanı Güncelle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#c9bfdc] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#c9bfdc]">
              Doğum bilgilerin 360° Harita Çarkı ve gezegen yerleşimlerini tam hesaplamak için kullanılır.
            </p>

            <form onSubmit={handleSaveBirthDetails} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#d5baff] block mb-1">
                  Adın veya Takma Adın
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Örn: Selin"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#d5baff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#d5baff] block mb-1">
                  Doğum Tarihi
                </label>
                <input
                  type="date"
                  value={formBirthDate}
                  onChange={(e) => setFormBirthDate(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#d5baff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#d5baff] block mb-1">
                  Doğum Saati (Akslar ve Yükselen için kritik)
                </label>
                <input
                  type="time"
                  value={formBirthTime}
                  onChange={(e) => setFormBirthTime(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#d5baff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#d5baff] block mb-1">
                  Doğum Şehri &amp; Ülke
                </label>
                <input
                  type="text"
                  value={formBirthPlace}
                  onChange={(e) => setFormBirthPlace(e.target.value)}
                  placeholder="Örn: İstanbul, TR"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#060411] border border-[#443b56]/60 text-xs text-[#f2ecfd] focus:outline-none focus:border-[#d5baff]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="min-h-[44px] px-4 rounded-xl text-xs text-[#c9bfdc] hover:text-white cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#7f00ff] to-[#f5d061] text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  Haritamı Hesapla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
