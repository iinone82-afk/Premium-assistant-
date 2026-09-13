import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { playCoinSound } from '../utils/audio';

interface CoinRewardBannerProps {
  show: boolean;
  coinsEarned: number;
  message?: string;
  soundEnabled?: boolean;
  onClose: () => void;
}

export const CoinRewardBanner: React.FC<CoinRewardBannerProps> = ({
  show,
  coinsEarned,
  message = '10 Minutes of Focus Completed!',
  soundEnabled = true,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      playCoinSound(soundEnabled);
      // Joyful gold and orange confetti
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F59E0B', '#F97316', '#FDA4AF'],
      });

      const timer = setTimeout(() => {
        onClose();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [show, soundEnabled, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.85 }}
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
        >
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-0.5 rounded-3xl shadow-xl shadow-amber-500/25">
            <div className="bg-amber-50/95 backdrop-blur-md rounded-[22px] px-5 py-3.5 flex items-center gap-3.5 border border-amber-200">
              <motion.div
                animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.25, 1] }}
                transition={{ duration: 0.8 }}
                className="w-12 h-12 rounded-2xl bg-amber-400/30 flex items-center justify-center text-3xl shadow-inner border border-amber-300 shrink-0"
              >
                🪙
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-amber-900 text-base font-['Fredoka',sans-serif]">
                    +{coinsEarned} COINS!
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-800">
                    Reward
                  </span>
                </div>
                <p className="text-xs font-semibold text-amber-800/80 truncate">
                  {message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-amber-800/60 hover:text-amber-900 p-1.5 rounded-full hover:bg-amber-200/50 transition"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
