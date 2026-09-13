import React, { useState } from 'react';
import { Sparkles, Heart, Award, Clock, ShoppingBag, Edit2, Check } from 'lucide-react';
import { CatMascot } from './CatMascot';
import { HATS_CATALOG } from '../data/hats';
import { playClickSound } from '../utils/audio';

interface CatRoomTabProps {
  catName: string;
  setCatName: (name: string) => void;
  coins: number;
  ownedHatIds: string[];
  equippedHatId: string | null;
  soundEnabled: boolean;
  totalFocusMinutes: number;
  totalSessionsCompleted: number;
  onEquipHat: (hatId: string | null) => void;
  onOpenShop: () => void;
}

export const CatRoomTab: React.FC<CatRoomTabProps> = ({
  catName,
  setCatName,
  coins,
  ownedHatIds,
  equippedHatId,
  soundEnabled,
  totalFocusMinutes,
  totalSessionsCompleted,
  onEquipHat,
  onOpenShop,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(catName);
  const [petCount, setPetCount] = useState<number>(() => {
    const saved = localStorage.getItem('nekotimer_pet_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleSaveName = () => {
    if (tempName.trim()) {
      setCatName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handlePet = () => {
    setPetCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('nekotimer_pet_count', next.toString());
      return next;
    });
  };

  const equippedHat = HATS_CATALOG.find((h) => h.id === equippedHatId);

  return (
    <div className="flex-1 flex flex-col px-4 py-3 max-w-lg mx-auto w-full select-none overflow-y-auto">
      {/* Cat Room Header with Editable Name */}
      <div className="flex items-center justify-between bg-white/90 rounded-2xl p-3 border border-orange-100 shadow-xs mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-200">
            🐾
          </div>
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={16}
                  className="text-sm font-bold text-stone-900 border border-orange-300 rounded-lg px-2 py-0.5 w-28 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 rounded-lg bg-orange-500 text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h2 className="font-['Fredoka',sans-serif] font-bold text-stone-900 text-base">
                  {catName}
                </h2>
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    setTempName(catName);
                  }}
                  className="text-stone-400 hover:text-orange-500 transition"
                  title="Rename your cat"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-[11px] font-semibold text-stone-500">
              {equippedHat ? `Wearing ${equippedHat.name}` : 'Natural Feline Style'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 text-xs font-bold text-rose-600">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>{petCount} Pets</span>
        </div>
      </div>

      {/* Cat Play Area & Interactive Mascot */}
      <div className="bg-gradient-to-b from-amber-100/90 via-orange-50 to-amber-50 rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-col items-center justify-center relative mb-3">
        {/* Soft background room elements */}
        <div className="absolute top-3 left-4 text-xs font-bold text-amber-800/60 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Tap to pet {catName}!</span>
        </div>

        <div className="my-2">
          <CatMascot
            mood="happy"
            equippedHatId={equippedHatId}
            size="xl"
            soundEnabled={soundEnabled}
            interactive={true}
            onPet={handlePet}
            speechText={`Purr! I love spending focus time with you, meow!`}
          />
        </div>

        <div className="text-[11px] font-bold text-stone-500 text-center bg-white/70 px-3 py-1 rounded-full border border-orange-100 shadow-2xs">
          🧶 Happy level: Purring & Content
        </div>
      </div>

      {/* Lifetime Focus & Economy Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/90 p-2.5 rounded-2xl border border-orange-100/90 shadow-2xs text-center">
          <div className="text-amber-500 flex justify-center mb-1">
            <span className="text-lg">🪙</span>
          </div>
          <div className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-base">
            {coins}
          </div>
          <div className="text-[10px] font-bold text-stone-400">Total Coins</div>
        </div>

        <div className="bg-white/90 p-2.5 rounded-2xl border border-orange-100/90 shadow-2xs text-center">
          <div className="text-orange-500 flex justify-center mb-1">
            <Clock className="w-5 h-5" />
          </div>
          <div className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-base">
            {totalFocusMinutes}m
          </div>
          <div className="text-[10px] font-bold text-stone-400">Focus Time</div>
        </div>

        <div className="bg-white/90 p-2.5 rounded-2xl border border-orange-100/90 shadow-2xs text-center">
          <div className="text-purple-500 flex justify-center mb-1">
            <Award className="w-5 h-5" />
          </div>
          <div className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-base">
            {totalSessionsCompleted}
          </div>
          <div className="text-[10px] font-bold text-stone-400">Sessions</div>
        </div>
      </div>

      {/* Wardrobe of Owned Hats */}
      <div className="bg-white/90 rounded-2xl p-3.5 border border-orange-100/90 shadow-xs mb-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-sm">
              My Hat Wardrobe ({ownedHatIds.length}/{HATS_CATALOG.length})
            </span>
          </div>
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 underline"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop (60🪙)</span>
          </button>
        </div>

        {/* Owned hat items row */}
        <div className="grid grid-cols-4 gap-2">
          {/* Natural Option */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onEquipHat(null);
            }}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center transition ${
              equippedHatId === null
                ? 'bg-amber-100 border-amber-400 shadow-xs ring-2 ring-amber-300'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
            }`}
          >
            <span className="text-xl mb-0.5">🐱</span>
            <span className="text-[10px] font-bold text-stone-700 truncate w-full text-center">
              Natural
            </span>
          </button>

          {ownedHatIds.map((hatId) => {
            const hat = HATS_CATALOG.find((h) => h.id === hatId);
            if (!hat) return null;
            const isEquipped = equippedHatId === hatId;

            return (
              <button
                key={hat.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onEquipHat(hat.id);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition ${
                  isEquipped
                    ? 'bg-emerald-100 border-emerald-400 shadow-xs ring-2 ring-emerald-300'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span className="text-xl mb-0.5">{hat.emoji}</span>
                <span className="text-[10px] font-bold text-stone-700 truncate w-full text-center">
                  {hat.name}
                </span>
              </button>
            );
          })}
        </div>

        {ownedHatIds.length === 0 && (
          <div className="mt-2 text-center py-2 bg-amber-50 rounded-xl border border-dashed border-amber-200 text-xs text-amber-800">
            No hats yet! Complete 10-minute focus sessions to get 10 coins, then visit the shop for 60-coin custom hats! 🎩
          </div>
        )}
      </div>
    </div>
  );
};
