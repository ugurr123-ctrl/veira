import React from 'react';
import { OrbitCategory } from '../types';

interface RadiantCategoryPillProps {
  category: OrbitCategory | string;
  active?: boolean;
  onClick?: () => void;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const RadiantCategoryPill: React.FC<RadiantCategoryPillProps> = ({
  category,
  active = false,
  onClick,
  showDot = true,
  size = 'md',
  className = '',
}) => {
  const isInteractive = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={`inline-flex items-center gap-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap shrink-0 ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      } ${
        active
          ? 'bg-[#6366f1]/25 text-[#dee0ff] border border-[#818cf8]/60 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
          : 'bg-[#6366f1]/12 text-[#818cf8] border border-[#6366f1]/30 hover:border-[#818cf8]/50 hover:bg-[#6366f1]/20'
      } ${isInteractive ? 'cursor-pointer active:scale-95' : 'cursor-default'} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            active ? 'bg-[#f5d061] shadow-[0_0_8px_#f5d061]' : 'bg-[#818cf8]/70'
          }`}
        />
      )}
      <span className="font-medium tracking-wide">{category}</span>
    </button>
  );
};
