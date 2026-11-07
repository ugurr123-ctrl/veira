import React from 'react';
import { StitchTab } from './StitchHeader';

interface StitchBottomDockProps {
  currentTab: StitchTab;
  onSelectTab: (tab: StitchTab) => void;
}

export const StitchBottomDock: React.FC<StitchBottomDockProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: Array<{ id: StitchTab; label: string; icon: string }> = [
    { id: 'bugun', label: 'Cosmos', icon: 'star' },
    { id: 'astro', label: 'Astro', icon: 'planet' },
    { id: 'vizyon', label: 'Vizyon', icon: 'visibility' },
    { id: '432hz', label: '432Hz', icon: 'graphic_eq' },
    { id: 'asistan', label: 'Asistan', icon: 'psychology' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none select-none">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-3 sm:px-4 pb-2.5 sm:pb-3 pointer-events-auto">
        <div className="h-16 bg-[#201e2d]/90 backdrop-blur-2xl rounded-full shadow-[0_16px_40px_-8px_rgba(0,0,0,0.85),0_0_24px_rgba(245,208,97,0.22)] border border-[#f5d061]/30 px-2 sm:px-4 flex items-center justify-around relative overflow-hidden">
          {/* Subtle Stardust Sparkle along Top of Bottom Bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f5d061]/60 to-transparent pointer-events-none" />

          {tabs.map((tab) => {
            const active = currentTab === tab.id || (tab.id === 'vizyon' && currentTab === 'hedefler');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] min-h-[48px] px-2 py-1 transition-all rounded-full relative group ${
                  active
                    ? 'text-[#f5d061] font-bold scale-105'
                    : 'text-[#cdc2da] hover:text-[#f5d061] active:scale-95'
                }`}
                aria-label={tab.label}
              >
                {tab.id === 'bugun' ? (
                  active ? (
                    <svg
                      className="w-5 h-5 text-[#f5d061] animate-star-pulse filter drop-shadow-[0_0_8px_#f5d061]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-[#cdc2da] group-hover:text-[#f5d061] transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0 L13.5 9.5 L23 12 L13.5 14.5 L12 24 L10.5 14.5 L1 12 L10.5 9.5 Z" />
                    </svg>
                  )
                ) : (
                  <span
                    className={`material-symbols-outlined text-[21px] sm:text-[22px] transition-transform ${
                      active ? 'filter drop-shadow-[0_0_8px_rgba(245,208,97,0.7)]' : ''
                    }`}
                  >
                    {tab.icon}
                  </span>
                )}

                <span
                  className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight ${
                    active ? 'text-[#f5d061] font-bold' : 'text-[#cdc2da]'
                  }`}
                >
                  {tab.label}
                </span>

                {active && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#f5d061] shadow-[0_0_6px_#f5d061]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
