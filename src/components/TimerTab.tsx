import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sparkles, CheckCircle2 } from 'lucide-react';
import { TimerMode, CatMood } from '../types';
import { CatMascot } from './CatMascot';
import { playClickSound, playTimerCompleteSound } from '../utils/audio';

interface TimerTabProps {
  equippedHatId: string | null;
  soundEnabled: boolean;
  activeTaskTitle: string;
  setActiveTaskTitle: (title: string) => void;
  onEarnCoins: (amount: number, reason: string) => void;
  onSessionComplete: (durationMinutes: number, title: string, coinsEarned: number, mode: TimerMode) => void;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  onOpenShop: () => void;
}

export const TimerTab: React.FC<TimerTabProps> = ({
  equippedHatId,
  soundEnabled,
  activeTaskTitle,
  setActiveTaskTitle,
  onEarnCoins,
  onSessionComplete,
  pomodoroMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  onOpenShop,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  // Time remaining in seconds
  const [secondsRemaining, setSecondsRemaining] = useState(pomodoroMinutes * 60);
  const [totalSeconds, setTotalSeconds] = useState(pomodoroMinutes * 60);

  // Focus time accumulation for the 10-minute -> 10-coin rule
  // Persisted in localStorage so progress towards the next 10 coins is never lost!
  const [coinAccumulator, setCoinAccumulator] = useState<number>(() => {
    const saved = localStorage.getItem('nekotimer_coin_accumulator');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track session stats
  const [sessionFocusSeconds, setSessionFocusSeconds] = useState(0);
  const [sessionCoinsEarned, setSessionCoinsEarned] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync totalSeconds when mode changes
  const switchMode = (newMode: TimerMode, durationMins?: number) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    playClickSound(soundEnabled);
    setMode(newMode);

    let mins = 25;
    if (newMode === 'pomodoro') mins = pomodoroMinutes;
    else if (newMode === 'short_break') mins = shortBreakMinutes;
    else if (newMode === 'long_break') mins = longBreakMinutes;
    else if (newMode === 'custom') mins = durationMins || customMinutes;
    else if (newMode === 'stopwatch') mins = 0;

    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setSessionFocusSeconds(0);
    setSessionCoinsEarned(0);
  };

  // Main tick engine
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          // Count up
          setSecondsRemaining((prev) => {
            const next = prev + 1;
            handleFocusTick();
            return next;
          });
        } else {
          // Count down
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              handleTimerFinished();
              return 0;
            }
            // If in focus mode (pomodoro or custom), increment focus time
            if (mode === 'pomodoro' || mode === 'custom') {
              handleFocusTick();
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Handle focus tick: 10 minutes (600 seconds) = 10 coins!
  const handleFocusTick = () => {
    setSessionFocusSeconds((s) => s + 1);

    setCoinAccumulator((prevAccum) => {
      const nextAccum = prevAccum + 1;
      localStorage.setItem('nekotimer_coin_accumulator', nextAccum.toString());

      // Check if reached 600 seconds (10 minutes)
      if (nextAccum >= 600) {
        // Award 10 coins!
        onEarnCoins(10, '10 minutes of focus completed!');
        setSessionCoinsEarned((c) => c + 10);
        const remainder = nextAccum - 600;
        localStorage.setItem('nekotimer_coin_accumulator', remainder.toString());
        return remainder;
      }
      return nextAccum;
    });
  };

  const handleTimerFinished = () => {
    setIsRunning(false);
    playTimerCompleteSound(soundEnabled);

    const focusedMinutes = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    const title = activeTaskTitle.trim() || (mode === 'pomodoro' ? 'Pomodoro Focus' : 'Focus Session');

    onSessionComplete(focusedMinutes, title, sessionCoinsEarned, mode);

    // If pomodoro completed, suggest break
    if (mode === 'pomodoro') {
      setTimeout(() => {
        switchMode('short_break');
      }, 2500);
    }
  };

  const toggleTimer = () => {
    playClickSound(soundEnabled);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playClickSound(soundEnabled);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsRemaining(totalSeconds);
    setSessionFocusSeconds(0);
    setSessionCoinsEarned(0);
  };

  const skipTimer = () => {
    playClickSound(soundEnabled);
    handleTimerFinished();
  };

  // Formatting helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Percentage for circular progress ring
  const progressFraction =
    mode === 'stopwatch'
      ? (secondsRemaining % 600) / 600
      : totalSeconds > 0
      ? 1 - secondsRemaining / totalSeconds
      : 0;

  // Cat mood logic
  const getCatMood = (): CatMood => {
    if (secondsRemaining === 0 && totalSeconds > 0) return 'celebrating';
    if (!isRunning) return 'idle';
    if (mode === 'short_break' || mode === 'long_break') return 'sleeping';
    return 'focusing';
  };

  const getSpeechBubbleText = (): string => {
    if (secondsRemaining === 0 && totalSeconds > 0) {
      return 'Purr-fect job! You completed your session! 🎉';
    }
    if (!isRunning) {
      return 'Ready to focus? Every 10 mins gives 10 coins! 🪙';
    }
    if (mode === 'short_break' || mode === 'long_break') {
      return 'Stretch your paws and relax! You earned it~ 🐾';
    }
    const minsLeftForCoins = Math.ceil((600 - coinAccumulator) / 60);
    return `Stay paws-itive! +10 coins in ~${minsLeftForCoins}m! ✨`;
  };

  const circumference = 2 * Math.PI * 108; // radius 108
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-3 max-w-lg mx-auto w-full">
      {/* Mode Switcher Tabs */}
      <div className="w-full grid grid-cols-4 gap-1.5 p-1 bg-amber-100/70 backdrop-blur-xs rounded-2xl border border-amber-200/70 mb-3 select-none">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`py-1.5 px-1 rounded-xl text-xs font-bold transition ${
            mode === 'pomodoro'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode('short_break')}
          className={`py-1.5 px-1 rounded-xl text-xs font-bold transition ${
            mode === 'short_break'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Break (5m)
        </button>
        <button
          onClick={() => switchMode('long_break')}
          className={`py-1.5 px-1 rounded-xl text-xs font-bold transition ${
            mode === 'long_break'
              ? 'bg-white text-teal-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Rest (15m)
        </button>
        <button
          onClick={() => switchMode('stopwatch')}
          className={`py-1.5 px-1 rounded-xl text-xs font-bold transition ${
            mode === 'stopwatch'
              ? 'bg-white text-amber-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Open
        </button>
      </div>

      {/* Task / Session Goal Input */}
      <div className="w-full mb-3">
        <input
          type="text"
          value={activeTaskTitle}
          onChange={(e) => setActiveTaskTitle(e.target.value)}
          placeholder="What are we focusing on? (e.g. Math homework, Coding)"
          className="w-full text-center text-xs sm:text-sm font-semibold py-2 px-3.5 bg-white/90 border border-orange-200/80 rounded-2xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-stone-400 text-stone-800"
        />
      </div>

      {/* Circular Timer Display with Cat Mascot inside or atop */}
      <div className="relative w-64 h-64 flex items-center justify-center my-1 select-none">
        {/* SVG Circular Progress Ring */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
          {/* Background track */}
          <circle
            cx="120"
            cy="120"
            r="108"
            stroke="#fed7aa"
            strokeWidth="10"
            fill="transparent"
            className="opacity-40"
          />
          {/* Animated fill ring */}
          <circle
            cx="120"
            cy="120"
            r="108"
            stroke={
              mode === 'short_break' || mode === 'long_break'
                ? '#10b981'
                : '#f97316'
            }
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Content: Cat Mascot + Time */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <CatMascot
            mood={getCatMood()}
            equippedHatId={equippedHatId}
            size="sm"
            soundEnabled={soundEnabled}
            speechText={getSpeechBubbleText()}
          />

          {/* Time digits */}
          <div className="mt-1 font-['Fredoka',sans-serif] font-bold text-3xl sm:text-4xl text-stone-800 tracking-tight drop-shadow-2xs">
            {formatTime(secondsRemaining)}
          </div>
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider -mt-0.5">
            {mode === 'pomodoro'
              ? 'Focus Interval'
              : mode === 'short_break'
              ? 'Short Break'
              : mode === 'long_break'
              ? 'Long Rest'
              : mode === 'stopwatch'
              ? 'Open Stopwatch'
              : 'Custom Timer'}
          </div>
        </div>
      </div>

      {/* 10-Minute = 10 Coins Progress Tracker Card */}
      <div className="w-full mt-2 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/80 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🪙</span>
            <span>Every 10 min = 10 Coins!</span>
          </div>
          <button
            onClick={onOpenShop}
            className="text-[10px] text-orange-600 hover:text-orange-700 underline font-bold"
          >
            Hats (60🪙) →
          </button>
        </div>

        {/* Progress Bar towards next 10 coins */}
        <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden p-0.5 border border-amber-300/60">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${Math.min(100, (coinAccumulator / 600) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1.5 text-[10px] font-semibold text-amber-800/80">
          <span>
            {Math.floor(coinAccumulator / 60)}m {coinAccumulator % 60}s / 10m 00s
          </span>
          <span className="text-amber-900 font-bold">
            {600 - coinAccumulator > 0
              ? `${Math.ceil((600 - coinAccumulator) / 60)} min left for +10 🪙`
              : 'Awarding +10 🪙!'}
          </span>
        </div>
      </div>

      {/* Main Controls: Play / Pause / Reset / Skip */}
      <div className="flex items-center justify-center gap-4 mt-4 select-none">
        <button
          onClick={resetTimer}
          title="Reset timer"
          className="p-3 rounded-2xl bg-white hover:bg-stone-50 active:scale-95 border border-stone-200 text-stone-600 shadow-xs transition"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          title={isRunning ? 'Pause' : 'Start'}
          className={`flex items-center justify-center w-16 h-16 rounded-3xl shadow-lg active:scale-95 transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 ring-4 ring-amber-200'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30 ring-4 ring-orange-200'
          }`}
        >
          {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </button>

        <button
          onClick={skipTimer}
          title="Complete / Skip session"
          className="p-3 rounded-2xl bg-white hover:bg-stone-50 active:scale-95 border border-stone-200 text-stone-600 shadow-xs transition"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Presets row */}
      <div className="flex items-center justify-center gap-1.5 mt-3 select-none flex-wrap">
        <span className="text-[10px] font-bold text-stone-400 mr-1">Quick:</span>
        {[10, 20, 25, 30, 50].map((mins) => (
          <button
            key={mins}
            onClick={() => {
              setCustomMinutes(mins);
              switchMode('custom', mins);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
              mode === 'custom' && customMinutes === mins
                ? 'bg-orange-100 text-orange-800 border-orange-300 shadow-2xs'
                : 'bg-white/80 hover:bg-white text-stone-600 border-stone-200'
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>
    </div>
  );
};
