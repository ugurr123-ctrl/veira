import React from 'react';

interface FlameStreakBadgeProps {
  streak: number;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const FlameStreakBadge: React.FC<FlameStreakBadgeProps> = ({
  streak,
  label = 'days',
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#f5d061]/35 select-none transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#f5d061]/60 hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(245, 208, 97, 0.15) 100%)',
        boxShadow: '0 0 16px rgba(245, 208, 97, 0.15)',
      }}
    >
      {/* Dual-tone vector flame utilizing Dawn Rose (#EC4899) core with Champagne Gold (#F5D061) crown */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M12 2C10.5 4.5 9 7.5 10 10.5C8 9.5 7.5 7.5 7.5 7.5C5 11 5.5 15.5 8 18.5C10.5 21.5 15.5 22 18 19C20.5 16 20 12 17.5 9C17.5 9 17 11 15 11C15 8 13.5 4 12 2Z"
          fill="url(#flameGrad)"
        />
        <path
          d="M12 13C10.5 14.5 10.5 16.5 11.5 18C12.5 19.5 14.5 19.5 15.5 18C16.5 16.5 15.5 14.5 14 13.5C14 13.5 13.5 14.5 12.5 14.5C12.5 14 12 13.5 12 13Z"
          fill="#FDF4DC"
        />
        <defs>
          <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5D061" />
            <stop offset="0.6" stopColor="#EC4899" />
            <stop offset="1" stopColor="#93000A" />
          </linearGradient>
        </defs>
      </svg>

      <span className="text-xs font-semibold tracking-tight text-[#fdf4dc] tabular-nums">
        {streak}
      </span>
      {label && (
        <span className="text-[11px] text-[#fdf4dc]/70 lowercase font-medium">
          {label}
        </span>
      )}
    </div>
  );
};
