import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [phoneFrameMode, setPhoneFrameMode] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-colors font-['Nunito',sans-serif]">
      {/* Desktop view switcher toggle bar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-stone-200/80 shadow-xs text-xs font-semibold text-stone-600">
        <div className="flex items-center gap-1.5 text-stone-500">
          <span className="text-amber-500">🐾</span>
          <span>NekoTimer Android Edition</span>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl">
          <button
            onClick={() => setPhoneFrameMode(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition ${
              phoneFrameMode
                ? 'bg-white text-orange-600 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            onClick={() => setPhoneFrameMode(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition ${
              !phoneFrameMode
                ? 'bg-white text-orange-600 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full View</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 ${
          phoneFrameMode
            ? 'max-w-[420px] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[44px] sm:shadow-2xl sm:shadow-stone-900/15 sm:border-[8px] sm:border-stone-800 relative flex flex-col overflow-hidden bg-amber-50/50'
            : 'max-w-4xl min-h-[850px] sm:rounded-3xl sm:shadow-xl sm:border border-stone-200/80 flex flex-col overflow-hidden bg-amber-50/50'
        }`}
      >
        {/* Android Hardware Camera Notch / Island (Only on phone frame mode) */}
        {phoneFrameMode && (
          <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-stone-800 rounded-full z-50">
            <div className="absolute right-4 top-1 w-2 h-2 rounded-full bg-stone-900 border border-stone-700" />
          </div>
        )}

        {/* Android Status Bar */}
        <div className="w-full h-9 bg-amber-100/70 backdrop-blur-md px-5 flex items-center justify-between text-xs font-bold text-stone-700 select-none shrink-0 z-40 border-b border-amber-200/40">
          <div className="flex items-center gap-2">
            <span>{currentTime || '12:00'}</span>
            <span className="text-[10px] text-orange-600">🐱🐾</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold tracking-tighter">5G</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px]">96%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* App Main Body */}
        <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
          {children}
        </div>

        {/* Android Gesture Navigation Pill Bar */}
        <div className="w-full h-5 bg-amber-50/90 flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-stone-400/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
