import React from 'react';
import { Timer, CalendarDays, ShoppingBag, Heart } from 'lucide-react';

export type NavTab = 'timer' | 'calendar' | 'shop' | 'cat';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hatCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hatCount,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'timer',
      label: 'Timer',
      icon: <Timer className="w-5 h-5" />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: 'shop',
      label: 'Hat Shop',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: '60🪙',
    },
    {
      id: 'cat',
      label: 'My Cat',
      icon: <Heart className="w-5 h-5" />,
      badge: hatCount > 0 ? `${hatCount}🎩` : undefined,
    },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-orange-100/80 px-2 py-1.5 flex items-center justify-around shrink-0 z-30 shadow-lg select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all relative ${
              isActive
                ? 'text-orange-600 font-bold'
                : 'text-stone-500 hover:text-stone-700 font-medium'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute inset-x-2 inset-y-0.5 bg-orange-100/70 -z-10 rounded-xl" />
            )}

            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1.5 -right-3 text-[9px] font-extrabold px-1 py-0.2 bg-amber-400 text-amber-950 rounded-full border border-amber-300">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 font-['Nunito',sans-serif] tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
