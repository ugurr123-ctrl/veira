import React, { useEffect, useRef, useState } from 'react';
import { Share2, Sparkles, Compass, Flame, BookOpen, Download, CheckCircle2 } from 'lucide-react';
import { GoalItem, HabitItem, JournalEntry, VisionItem } from '../../types';

interface ConstellationScreenProps {
  visions: VisionItem[];
  goals: GoalItem[];
  habits: HabitItem[];
  journals: JournalEntry[];
  onTriggerConfetti: () => void;
}

interface StarNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  type: 'vision' | 'goal' | 'habit' | 'journal';
  title: string;
  subtitle: string;
  completed: boolean;
  pulsing: boolean;
}

export const ConstellationScreen: React.FC<ConstellationScreenProps> = ({
  visions,
  goals,
  habits,
  journals,
  onTriggerConfetti,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredStar, setHoveredStar] = useState<StarNode | null>(null);
  const starsRef = useRef<StarNode[]>([]);

  const manifestedCount = visions.filter((v) => v.status === 'manifested').length;
  const fulfilledGoalsCount = goals.filter((g) => g.progress === 100).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const totalReflections = journals.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 480;
      generateStars(canvas.width, canvas.height);
    };

    const generateStars = (canvasWidth: number, canvasHeight: number) => {
      const nodes: StarNode[] = [];
      const margin = 50;

      // Add Vision items as major alpha stars
      visions.forEach((v) => {
        const isManifest = v.status === 'manifested';
        nodes.push({
          id: v.id,
          x: margin + Math.random() * (canvasWidth - margin * 2),
          y: margin + Math.random() * (canvasHeight - margin * 2),
          radius: isManifest ? 6 : 4,
          color: isManifest ? '#F5D061' : '#818CF8',
          type: 'vision',
          title: v.title,
          subtitle: isManifest ? `Manifested (${v.category})` : `Vision (${v.category})`,
          completed: isManifest,
          pulsing: isManifest,
        });
      });

      // Add Goals
      goals.forEach((g) => {
        const isDone = g.progress === 100;
        nodes.push({
          id: g.id,
          x: margin + Math.random() * (canvasWidth - margin * 2),
          y: margin + Math.random() * (canvasHeight - margin * 2),
          radius: isDone ? 5.5 : 3.5,
          color: isDone ? '#FDF4DC' : '#38BDF8',
          type: 'goal',
          title: g.title,
          subtitle: `${g.progress}% Complete (${g.orbitCategory})`,
          completed: isDone,
          pulsing: isDone,
        });
      });

      // Add Habits
      habits.forEach((h) => {
        nodes.push({
          id: h.id,
          x: margin + Math.random() * (canvasWidth - margin * 2),
          y: margin + Math.random() * (canvasHeight - margin * 2),
          radius: 3 + Math.min(3, h.streak / 5),
          color: h.streak > 7 ? '#EC4899' : '#C0C1FF',
          type: 'habit',
          title: h.title,
          subtitle: `${h.streak} Day Streak (${h.timeOfDay})`,
          completed: h.streak > 0,
          pulsing: h.streak >= 14,
        });
      });

      // Add Journal Reflections
      journals.slice(0, 6).forEach((j) => {
        nodes.push({
          id: j.id,
          x: margin + Math.random() * (canvasWidth - margin * 2),
          y: margin + Math.random() * (canvasHeight - margin * 2),
          radius: 3.5,
          color: '#A78BFA',
          type: 'journal',
          title: j.title,
          subtitle: `${j.displayDate} · ${j.energy} State`,
          completed: true,
          pulsing: false,
        });
      });

      starsRef.current = nodes;
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation loop for subtle starlight twinkling and connecting constellation lines
    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const stars = starsRef.current;

      // Draw faint constellation lines between nearby stars (distance threshold)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw each star node
      stars.forEach((star, index) => {
        const pulseFactor = star.pulsing ? Math.sin(time * 2 + index) * 0.25 + 1 : 1;
        const currentRadius = star.radius * pulseFactor;

        // Outer glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.15;
        ctx.fill();

        // Core star
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [visions, goals, habits, journals]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const found = starsRef.current.find((s) => {
      const dx = s.x - mouseX;
      const dy = s.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) < s.radius * 3 + 8;
    });

    setHoveredStar(found || null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 md:p-10 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#f5d061] tracking-widest uppercase font-medium">
              <Share2 className="w-4 h-4 text-[#818cf8]" />
              <span>Living Constellation Map</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-semibold text-[#fdf4dc] leading-tight">
              The Cosmic Pattern of Your Devotions
            </h1>

            <p className="text-[#c7c4d7] text-sm sm:text-base leading-relaxed">
              Every intention set, milestone checked, and daily breath recorded shines as a star. As you maintain orbit, your unique celestial constellation forms in the void.
            </p>
          </div>

          <button
            onClick={() => {
              onTriggerConfetti();
            }}
            className="btn-ghost-glass px-4 py-2.5 rounded-full text-xs font-semibold text-[#f5d061] hover:text-white flex items-center gap-2 shrink-0 border border-[#f5d061]/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Illuminate Stars</span>
          </button>
        </div>

        {/* 4 Constellation Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-[#080a16]/40 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#f5d061] tracking-wider block">
              Manifestations
            </span>
            <span className="font-editorial text-2xl font-bold text-[#fdf4dc] tabular-nums">
              {manifestedCount}
            </span>
            <span className="text-[11px] text-[#c7c4d7]/70 block">Stars Fulfilled</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080a16]/40 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#38bdf8] tracking-wider block">
              Orbital Goals
            </span>
            <span className="font-editorial text-2xl font-bold text-[#fdf4dc] tabular-nums">
              {fulfilledGoalsCount} / {goals.length}
            </span>
            <span className="text-[11px] text-[#c7c4d7]/70 block">Completed Orbits</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080a16]/40 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#ec4899] tracking-wider block">
              Longest Streak
            </span>
            <span className="font-editorial text-2xl font-bold text-[#fdf4dc] tabular-nums">
              {bestStreak}
            </span>
            <span className="text-[11px] text-[#c7c4d7]/70 block">Solar Days</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080a16]/40 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#818cf8] tracking-wider block">
              Reflections
            </span>
            <span className="font-editorial text-2xl font-bold text-[#fdf4dc] tabular-nums">
              {totalReflections}
            </span>
            <span className="text-[11px] text-[#c7c4d7]/70 block">Inscribed Moments</span>
          </div>
        </div>
      </section>

      {/* Interactive Starlight Canvas */}
      <section className="relative rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#818cf8] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#f5d061]" />
            <span>Interactive Constellation Canvas</span>
          </div>
          <span className="text-[11px] text-[#c7c4d7]/60">
            Hover over any star to inspect its celestial coordinate
          </span>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden bg-[#080A16] border border-white/10">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredStar(null)}
            className="w-full h-[440px] cursor-crosshair block"
          />

          {/* Star Inspect Tooltip Overlay */}
          {hoveredStar && (
            <div className="absolute top-4 left-4 z-20 p-3.5 rounded-xl glass-panel-elevated border border-[#818cf8]/50 max-w-xs shadow-2xl animate-scaleUp pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: hoveredStar.color }}
                />
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#818cf8]">
                  {hoveredStar.type}
                </span>
                {hoveredStar.completed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#f5d061] ml-auto" />
                )}
              </div>

              <h4 className="font-editorial text-sm font-semibold text-[#fdf4dc] leading-tight">
                {hoveredStar.title}
              </h4>
              <p className="text-[11px] text-[#c7c4d7] mt-0.5 font-mono">
                {hoveredStar.subtitle}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
