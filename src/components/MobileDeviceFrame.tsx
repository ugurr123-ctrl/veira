import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onToggleFrame: () => void;
  lang?: 'tr' | 'en';
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  enabled,
  onToggleFrame,
  lang = 'tr',
}) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="w-full min-h-[100vh] min-h-[100svh] min-h-[100dvh] py-4 md:py-8 px-2 flex flex-col items-center justify-center bg-[#05060e] relative z-10">
      {/* Top Device Simulator Controller Bar (Desktop only) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs text-[#c7c4d7]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          <span className="font-medium text-[#fdf4dc]">
            {lang === 'tr' ? 'Mobil Cihaz Görünümü (414 x 896)' : 'Mobile Shell View (414 x 896)'}
          </span>
        </div>

        <button
          onClick={onToggleFrame}
          className="hover:text-white underline text-[11px] font-medium transition-colors"
        >
          {lang === 'tr' ? 'Tam Ekrana Geç' : 'Switch to Full Screen'}
        </button>
      </div>

      {/* Realistic Flagship Smartphone Frame */}
      <div className="relative w-full max-w-[420px] h-[92vh] h-[92svh] h-[92dvh] max-h-[896px] rounded-[48px] bg-[#0c1024] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15),0_0_40px_rgba(99,102,241,0.2)] border-4 border-[#1e2238] flex flex-col overflow-hidden">
        
        {/* Smartphone Physical Camera / Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-28 h-6 rounded-full bg-black border border-white/10 flex items-center justify-between px-3 pointer-events-none shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-[#161a30] border border-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#080a16] border border-white/10 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#38bdf8]/60" />
          </div>
        </div>

        {/* Mobile OS Status Bar */}
        <div className="relative z-40 h-8 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-[#dee0ff] select-none shrink-0 pointer-events-none">
          <span className="tracking-tight tabular-nums">09:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] tabular-nums font-mono">98%</span>
              <BatteryMedium className="w-4 h-4 text-[#f5d061]" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden rounded-[36px] bg-[#080A16] flex flex-col no-scrollbar">
          {children}

          {/* Bottom Home Indicator Bar (iOS / Android gesture bar) */}
          <div className="sticky bottom-0 left-0 right-0 z-50 h-5 flex items-center justify-center pointer-events-none bg-gradient-to-t from-[#080A16] via-[#080A16]/80 to-transparent">
            <div className="w-32 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
};
