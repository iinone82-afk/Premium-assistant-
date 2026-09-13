import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShop: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  coins,
  soundEnabled,
  onToggleSound,
  onOpenShop,
}) => {
  return (
    <header className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-md border-b border-orange-100 flex items-center justify-between shrink-0 select-none z-30 sticky top-0">
      {/* Brand Title with Cat Icon */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-lg shadow-xs border border-orange-200">
          🐱
        </div>
        <div>
          <h1 className="font-['Fredoka',sans-serif] font-bold text-stone-900 text-sm tracking-tight leading-tight">
            NekoTimer
          </h1>
          <p className="text-[10px] font-bold text-amber-600 leading-none">
            Focus & Calendar
          </p>
        </div>
      </div>

      {/* Action items */}
      <div className="flex items-center gap-2">
        {/* Coin Pill */}
        <button
          onClick={onOpenShop}
          title="Open Hat Shop (Hats cost 60 coins)"
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/80 rounded-full text-amber-900 font-extrabold text-xs shadow-2xs active:scale-95 transition group"
        >
          <span className="text-sm transition group-hover:rotate-12 inline-block">🪙</span>
          <span className="font-['Fredoka',sans-serif] tracking-wide">{coins}</span>
          <Sparkles className="w-3 h-3 text-amber-600 group-hover:scale-125 transition" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className={`p-1.5 rounded-full border transition ${
            soundEnabled
              ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
              : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* PWA Install */}
        <PWAInstallButton />
      </div>
    </header>
  );
};
