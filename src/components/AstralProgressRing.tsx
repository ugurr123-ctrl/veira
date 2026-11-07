import React from 'react';

interface AstralProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

export const AstralProgressRing: React.FC<AstralProgressRingProps> = ({
  progress,
  size = 96,
  strokeWidth = 7,
  label,
  sublabel,
  onClick,
  className = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  // Starlight endpoint angle
  const angle = (clampedProgress / 100) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const endX = size / 2 + radius * Math.cos(rad);
  const endY = size / 2 + radius * Math.sin(rad);

  const gradientId = React.useId();
  const filterId = React.useId();

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Glowing Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />

        {/* Starlight Endpoint Marker */}
        {clampedProgress > 2 && (
          <circle
            cx={endX}
            cy={endY}
            r={strokeWidth / 1.7}
            fill="#FDF4DC"
            filter={`url(#${filterId})`}
            className="transition-all duration-700 ease-out transform rotate-90 origin-center"
          />
        )}
      </svg>

      {/* Interior Metric Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-1">
        <span className="font-editorial text-lg md:text-xl font-medium tracking-tight text-[#dee0ff]">
          {label ?? `${Math.round(clampedProgress)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] tracking-wider uppercase font-medium text-[#c7c4d7]/70 truncate max-w-[80%]">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
