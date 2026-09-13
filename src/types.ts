export type TimerMode = 'pomodoro' | 'short_break' | 'long_break' | 'custom' | 'stopwatch';

export type CatMood = 'idle' | 'focusing' | 'celebrating' | 'sleeping' | 'happy';

export interface HatItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number; // Always 60 coins
  category: 'cute' | 'fancy' | 'silly' | 'seasonal';
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  category: 'study' | 'work' | 'reading' | 'workout' | 'chores' | 'wellness';
  completed?: boolean;
  notes?: string;
  coinsEarned?: number;
}

export interface FocusSessionLog {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  title: string;
  durationMinutes: number;
  coinsEarned: number;
  mode: TimerMode;
}

export interface AppSettings {
  soundEnabled: boolean;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  catName: string;
}
