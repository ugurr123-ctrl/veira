import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../utils/audioEngine';

interface VeiraSplashScreenProps {
  onComplete: () => void;
  onPlayChime?: () => void;
}

const MILESTONES = [
  { at: 0, text: 'Zihinsel mimari hazırlanıyor...' },
  { at: 35, text: 'Nöral frekanslar eşitleniyor...' },
  { at: 70, text: 'Vizyon panosu uyandırılıyor ✨' },
  { at: 100, text: 'Dinginlik alanı açıldı.' },
];

export const VeiraSplashScreen: React.FC<VeiraSplashScreenProps> = ({
  onComplete,
  onPlayChime,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Match current status text based on progress
  const currentMilestone =
    MILESTONES.slice()
      .reverse()
      .find((m) => progress >= m.at) || MILESTONES[0];

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    if (onPlayChime) {
      onPlayChime();
    } else {
      audioEngine.playCelestialChime();
    }
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  // Progress Bar Timer Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 300);
          return 100;
        }
        return Math.min(100, prev + 1.5);
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  // Ambient Stardust Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
      pulse: number;
      color: string;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(50, Math.floor(window.innerWidth / 18));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.4,
          speedY: -(Math.random() * 0.35 + 0.1),
          speedX: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * 0.02 + 0.01,
          color: Math.random() > 0.4 ? '#e7c355' : '#c0c1ff',
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(now * 0.002) * p.pulse;

        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.8, p.alpha));
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between min-h-[100svh] min-h-[100dvh] bg-[#080A16] px-5 sm:px-8 py-8 sm:py-12 select-none overflow-hidden transition-all duration-700 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-95 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Celestial Particles Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 w-full h-full opacity-70"
      />

      {/* Top Ambient Badge */}
      <div className="relative z-20 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#161A30]/80 backdrop-blur-md border border-[#e7c355]/30 shadow-lg animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e7c355] shadow-[0_0_8px_#e7c355]" />
        <span className="text-[11px] font-semibold text-[#e7c355] tracking-widest uppercase">
          432Hz Bilişsel Dinginlik
        </span>
        <span className="text-[#908fa0] text-[10px]">•</span>
        <span className="text-[11px] text-[#c7c4d7]">Nöro-Rezonans</span>
      </div>

      {/* Centerpiece: Sacred Emblem & Glowing Polaris Star */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* Ambient Rotating Celestial Rings & Sacred Geometry */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Outermost Subtle Pulsing Mandala Ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite] opacity-40"
            fill="none"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="95"
              stroke="#e7c355"
              strokeDasharray="3 7"
              strokeWidth="0.75"
            />
            <circle
              cx="100"
              cy="100"
              r="82"
              stroke="#8083ff"
              strokeDasharray="1 9"
              strokeWidth="0.5"
            />
            <circle
              cx="100"
              cy="100"
              opacity="0.3"
              r="70"
              stroke="#dee0ff"
              strokeWidth="0.5"
            />
            {/* Star nodes */}
            <circle cx="100" cy="5" fill="#e7c355" r="1.5" />
            <circle cx="100" cy="195" fill="#e7c355" r="1.5" />
            <circle cx="5" cy="100" fill="#e7c355" r="1.5" />
            <circle cx="195" cy="100" fill="#e7c355" r="1.5" />
            <circle cx="33" cy="33" fill="#c0c1ff" r="1" />
            <circle cx="167" cy="167" fill="#c0c1ff" r="1" />
            <circle cx="167" cy="33" fill="#c0c1ff" r="1" />
            <circle cx="33" cy="167" fill="#c0c1ff" r="1" />
          </svg>

          {/* Counter-rotating Sacred Orbit */}
          <svg
            className="absolute w-48 h-48 sm:w-56 sm:h-56 animate-[spin_24s_linear_infinite_reverse] opacity-50"
            fill="none"
            viewBox="0 0 160 160"
          >
            <ellipse
              cx="80"
              cy="80"
              rx="72"
              ry="32"
              stroke="#e7c355"
              strokeWidth="0.8"
              transform="rotate(35 80 80)"
            />
            <ellipse
              cx="80"
              cy="80"
              opacity="0.4"
              rx="72"
              ry="32"
              stroke="#c0c1ff"
              strokeWidth="0.6"
              transform="rotate(-35 80 80)"
            />
          </svg>

          {/* Ambient Nebula Radiance Behind Monogram */}
          <div className="absolute w-36 h-36 rounded-full bg-[#e7c355]/15 blur-2xl animate-pulse" />
          <div className="absolute w-28 h-28 rounded-full bg-[#8083ff]/20 blur-xl" />

          {/* Veira Gold Monogram SVG Emblem */}
          <div className="relative z-10 w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center drop-shadow-[0_0_25px_rgba(231,195,85,0.45)]">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Radiant Back Arc */}
              <path
                d="M 62 38 C 50 60 48 95 72 120 C 58 108 54 80 66 48 Z"
                fill="#e7c355"
                fillOpacity="0.35"
              />
              {/* The Elegant 'V' Arms */}
              <path
                d="M 44 46 L 79 122 Q 80 124 81 122 L 116 46 Q 118 42 113 43 L 108 45 Q 106 46 104 50 L 80 109 L 56 50 Q 54 46 52 45 L 47 43 Q 42 42 44 46 Z"
                fill="url(#veiraGoldGrad)"
              />
              {/* Bottom Anchor Bead */}
              <circle cx="80" cy="123" fill="#ffe089" r="3.5" />
              <circle cx="80" cy="123" fill="#ffffff" r="1.5" />

              {/* Radiating 8-Point Polaris Star */}
              <g
                className="animate-[pulse_3s_ease-in-out_infinite]"
                transform="translate(80, 52)"
              >
                {/* Primary Vertical & Horizontal Rays */}
                <polygon
                  fill="url(#polarisGoldGrad)"
                  points="0,-22 2.5,-5 20,0 2.5,5 0,22 -2.5,5 -20,0 -2.5,-5"
                />
                {/* Diagonal Soft Rays */}
                <polygon
                  fill="#ffe089"
                  opacity="0.85"
                  points="0,-12 1.8,-3 11,0 1.8,3 0,12 -1.8,3 -11,0 -1.8,-3"
                  transform="rotate(45)"
                />
                {/* Core Luminous Diamond */}
                <circle cx="0" cy="0" fill="#ffffff" r="2.2" />
              </g>

              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="veiraGoldGrad"
                  x1="40"
                  x2="120"
                  y1="40"
                  y2="130"
                >
                  <stop offset="0%" stopColor="#ffe089" />
                  <stop offset="45%" stopColor="#e7c355" />
                  <stop offset="80%" stopColor="#a4811a" />
                  <stop offset="100%" stopColor="#ffe089" />
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="polarisGoldGrad"
                  x1="0"
                  x2="0"
                  y1="-22"
                  y2="22"
                >
                  <stop offset="0%" stopColor="#fff8db" />
                  <stop offset="50%" stopColor="#ffe089" />
                  <stop offset="100%" stopColor="#c99f24" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* High Editorial Title & Tagline */}
        <div className="text-center mt-4">
          <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-[#ffe089] via-[#e7c355] to-[#fceb9f] uppercase drop-shadow-[0_2px_14px_rgba(231,195,85,0.4)]">
            VEIRA
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="w-1 h-1 rounded-full bg-[#e7c355]/60" />
            <p className="text-[11px] font-semibold text-[#e7c355] tracking-[0.22em] uppercase">
              Mind &amp; Vision Architecture
            </p>
            <span className="w-1 h-1 rounded-full bg-[#e7c355]/60" />
          </div>
          <p className="text-xs text-[#c7c4d7]/90 mt-1 italic tracking-wide">
            Bilinçli Eylem &amp; Dingin Odak Sistemi
          </p>
        </div>
      </div>

      {/* Bottom Progress & Immediate Entry Controls */}
      <div className="relative z-20 w-full max-w-sm flex flex-col items-center space-y-4">
        {/* Real-time Loading Status */}
        <div className="flex items-center space-x-2 text-center h-5">
          <span className="material-symbols-outlined text-[15px] text-[#e7c355] animate-spin">
            auto_awesome
          </span>
          <span className="text-xs text-[#c7c4d7] tracking-wider transition-opacity duration-300">
            {currentMilestone.text}
          </span>
        </div>

        {/* Astral Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#252840]/80 overflow-hidden relative p-[1px] border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e7c355] via-[#ffe089] to-[#8083ff] shadow-[0_0_12px_#e7c355] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter & Instant Skip Pill */}
        <div className="w-full flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-[#e7c355] tabular-nums font-mono">
            {Math.floor(progress)}%
          </span>

          {/* Instant Skip / Entry Glow Pill */}
          <button
            type="button"
            onClick={handleFinish}
            className="group flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#e7c355]/20 to-[#8083ff]/20 hover:from-[#e7c355]/30 hover:to-[#8083ff]/30 active:scale-95 transition-all duration-200 border border-[#e7c355]/30 shadow-sm"
          >
            <span className="text-xs text-[#ffe089] group-hover:text-white font-medium tracking-wide">
              Kapıyı Arala
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#e7c355] transition-transform group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
