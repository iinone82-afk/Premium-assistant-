import React, { useState } from 'react';
import { Sparkles, Check, Lock, Shirt } from 'lucide-react';
import { HatItem } from '../types';
import { HATS_CATALOG } from '../data/hats';
import { CatMascot } from './CatMascot';
import { playClickSound, playCoinSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ShopTabProps {
  coins: number;
  ownedHatIds: string[];
  equippedHatId: string | null;
  soundEnabled: boolean;
  onBuyHat: (hat: HatItem) => void;
  onEquipHat: (hatId: string | null) => void;
  onGoToTimer: () => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({
  coins,
  ownedHatIds,
  equippedHatId,
  soundEnabled,
  onBuyHat,
  onEquipHat,
  onGoToTimer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewHatId, setPreviewHatId] = useState<string | null>(equippedHatId);

  const categories = [
    { id: 'all', label: 'All Hats' },
    { id: 'cute', label: 'Cute' },
    { id: 'fancy', label: 'Fancy' },
    { id: 'silly', label: 'Silly' },
    { id: 'seasonal', label: 'Party' },
  ];

  const filteredHats = HATS_CATALOG.filter(
    (h) => selectedCategory === 'all' || h.category === selectedCategory
  );

  const handlePreview = (hatId: string | null) => {
    playClickSound(soundEnabled);
    setPreviewHatId(hatId);
  };

  const handleBuy = (hat: HatItem) => {
    if (coins < hat.price) return;
    playCoinSound(soundEnabled);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FBBF24', '#F472B6', '#60A5FA'],
    });
    onBuyHat(hat);
    setPreviewHatId(hat.id);
  };

  const activeHatObject = HATS_CATALOG.find((h) => h.id === (previewHatId ?? equippedHatId));

  return (
    <div className="flex-1 flex flex-col px-4 py-3 max-w-lg mx-auto w-full select-none">
      {/* Top Banner: Cat Fitting Room / Live Mirror */}
      <div className="w-full bg-gradient-to-b from-amber-100/90 to-orange-100/60 rounded-3xl p-3.5 border border-amber-200/80 shadow-xs flex flex-col items-center mb-3">
        <div className="w-full flex items-center justify-between text-xs font-bold text-stone-700 px-1 mb-1">
          <div className="flex items-center gap-1 text-amber-900 font-['Fredoka',sans-serif]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Feline Fitting Mirror</span>
          </div>
          <div className="flex items-center gap-1 text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
            <span>🪙 {coins} Coins</span>
          </div>
        </div>

        {/* Live Cat Preview */}
        <div className="my-1">
          <CatMascot
            mood="happy"
            equippedHatId={previewHatId}
            size="md"
            soundEnabled={soundEnabled}
            speechText={
              previewHatId
                ? `Trying on: ${activeHatObject?.name || 'Custom Hat'}!`
                : 'Natural cat ears look adorable too!'
            }
          />
        </div>

        {/* Current mirror status & quick actions */}
        <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
          {previewHatId !== null && (
            <button
              onClick={() => handlePreview(null)}
              className="px-2.5 py-1 bg-white/90 hover:bg-white text-stone-600 text-xs font-bold rounded-xl border border-stone-200 shadow-2xs transition"
            >
              Take Off Hat (Natural)
            </button>
          )}

          {previewHatId !== null && ownedHatIds.includes(previewHatId) && previewHatId !== equippedHatId && (
            <button
              onClick={() => onEquipHat(previewHatId)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Equip This Hat
            </button>
          )}

          {previewHatId === null && equippedHatId !== null && (
            <button
              onClick={() => onEquipHat(null)}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Keep Natural Ears
            </button>
          )}
        </div>
      </div>

      {/* Pricing Rule Reminder Card */}
      <div className="w-full bg-amber-50 rounded-2xl p-2.5 border border-amber-200/70 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
          <span className="text-base">🛍️</span>
          <span>Every hat costs 60 coins!</span>
        </div>
        <button
          onClick={onGoToTimer}
          className="text-[11px] font-bold text-orange-600 hover:text-orange-700 underline"
        >
          Earn Coins in Timer →
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hats Grid */}
      <div className="grid grid-cols-2 gap-2.5 pb-6 overflow-y-auto">
        {filteredHats.map((hat) => {
          const isOwned = ownedHatIds.includes(hat.id);
          const isEquipped = equippedHatId === hat.id;
          const isPreviewing = previewHatId === hat.id;
          const canAfford = coins >= hat.price;

          return (
            <div
              key={hat.id}
              onClick={() => handlePreview(hat.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                isEquipped
                  ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-200 shadow-xs'
                  : isPreviewing
                  ? 'bg-orange-50/90 border-orange-300 ring-2 ring-orange-200 shadow-xs'
                  : 'bg-white/90 hover:bg-white border-stone-200/80 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Equipped or Preview Badge */}
              {isEquipped && (
                <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-500 text-white rounded-full flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> Equipped
                </span>
              )}
              {!isEquipped && isPreviewing && (
                <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-orange-500 text-white rounded-full">
                  Preview
                </span>
              )}

              {/* Hat Icon & Emoji */}
              <div className="flex items-center justify-center my-1.5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border"
                  style={{ backgroundColor: `${hat.color}15`, borderColor: `${hat.color}40` }}
                >
                  {hat.emoji}
                </div>
              </div>

              {/* Hat Info */}
              <div className="text-center my-1">
                <h3 className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-sm leading-snug">
                  {hat.name}
                </h3>
                <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">
                  {hat.description}
                </p>
              </div>

              {/* Action button */}
              <div className="mt-2">
                {isEquipped ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEquipHat(null);
                    }}
                    className="w-full py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition"
                  >
                    Unequip
                  </button>
                ) : isOwned ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEquipHat(hat.id);
                      setPreviewHatId(hat.id);
                    }}
                    className="w-full py-1.5 px-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(hat);
                    }}
                    disabled={!canAfford}
                    className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 shadow-xs border border-amber-500'
                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <span>🪙</span>
                        <span>Buy (60🪙)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>60 🪙 ({60 - coins} more)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
