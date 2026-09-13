import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, Trash2, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { CalendarEvent, FocusSessionLog } from '../types';
import { playClickSound } from '../utils/audio';

interface CalendarTabProps {
  events: CalendarEvent[];
  focusLogs: FocusSessionLog[];
  soundEnabled: boolean;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleEventComplete: (id: string) => void;
  onStartTimerForEvent: (event: CalendarEvent) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  events,
  focusLogs,
  soundEnabled,
  onAddEvent,
  onDeleteEvent,
  onToggleEventComplete,
  onStartTimerForEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newDuration, setNewDuration] = useState(25);
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('study');

  // Month navigation
  const prevMonth = () => {
    playClickSound(soundEnabled);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    playClickSound(soundEnabled);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    playClickSound(soundEnabled);
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar matrix calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Days array for calendar grid
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, dateStr });
  }

  // Filter events and focus logs for the selected date
  const selectedEvents = events.filter((e) => e.date === selectedDateStr);
  const selectedLogs = focusLogs.filter((log) => log.date === selectedDateStr);

  const totalMinutesFocusedOnDay = selectedLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalCoinsEarnedOnDay = selectedLogs.reduce((acc, l) => acc + l.coinsEarned, 0);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    playClickSound(soundEnabled);

    onAddEvent({
      title: newTitle.trim(),
      date: selectedDateStr,
      startTime: newStartTime,
      durationMinutes: newDuration,
      category: newCategory,
      completed: false,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  const categoryMeta: Record<CalendarEvent['category'], { label: string; emoji: string; color: string }> = {
    study: { label: 'Study', emoji: '📚', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    work: { label: 'Work', emoji: '💻', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    reading: { label: 'Reading', emoji: '📖', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    workout: { label: 'Exercise', emoji: '🏃', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    chores: { label: 'Chores', emoji: '🧹', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    wellness: { label: 'Rest & Care', emoji: '🌿', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 flex flex-col px-4 py-3 max-w-lg mx-auto w-full select-none">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between bg-white/90 rounded-2xl px-3 py-2 border border-orange-100 shadow-xs mb-3">
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-sm">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xs font-bold rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
          >
            Today
          </button>
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Event</span>
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-stone-400 mb-1">
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1 bg-white/80 p-2 rounded-2xl border border-orange-100/80 shadow-2xs mb-3">
        {days.map((item, index) => {
          if (!item) {
            return <div key={`empty-${index}`} className="h-10 rounded-xl" />;
          }

          const isSelected = item.dateStr === selectedDateStr;
          const isToday = item.dateStr === todayStr;
          const dayEvents = events.filter((e) => e.date === item.dateStr);
          const hasFocusLog = focusLogs.some((l) => l.date === item.dateStr);

          return (
            <button
              key={item.dateStr}
              onClick={() => {
                playClickSound(soundEnabled);
                setSelectedDateStr(item.dateStr);
              }}
              className={`h-10 rounded-xl flex flex-col items-center justify-between p-1 transition relative ${
                isSelected
                  ? 'bg-orange-500 text-white font-bold shadow-xs'
                  : isToday
                  ? 'bg-orange-100 text-orange-950 font-bold border border-orange-300'
                  : 'hover:bg-amber-50 text-stone-700 font-semibold'
              }`}
            >
              <span className="text-xs leading-none">{item.day}</span>
              <div className="flex items-center gap-0.5">
                {hasFocusLog && (
                  <span
                    title="Focus session completed!"
                    className={`text-[9px] ${isSelected ? 'opacity-90' : 'text-amber-500'}`}
                  >
                    🐾
                  </span>
                )}
                {dayEvents.length > 0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-orange-500'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda & Focus Summary */}
      <div className="flex-1 flex flex-col overflow-y-auto pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-['Fredoka',sans-serif] font-bold text-stone-800 text-sm">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('default', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {selectedDateStr === todayStr && (
              <span className="text-[10px] font-bold uppercase bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full">
                Today
              </span>
            )}
          </div>

          {/* Daily Paw Stamped Achievement Badge */}
          {totalMinutesFocusedOnDay > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              <span>🐾 {totalMinutesFocusedOnDay}m</span>
              <span>• 🪙 {totalCoinsEarnedOnDay}</span>
            </div>
          )}
        </div>

        {/* Focus history banner on selected day if any */}
        {selectedLogs.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-2.5 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
              <span>🐾 Focus Sessions Completed ({selectedLogs.length})</span>
            </div>
            <div className="space-y-1">
              {selectedLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-[11px] bg-white/90 px-2.5 py-1 rounded-xl border border-amber-100"
                >
                  <span className="font-semibold text-stone-700 truncate max-w-[180px]">
                    {log.title}
                  </span>
                  <div className="flex items-center gap-2 font-bold text-stone-500">
                    <span>{log.durationMinutes}m</span>
                    <span className="text-amber-600">+{log.coinsEarned} 🪙</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Tasks for Selected Day */}
        <div className="space-y-2">
          {selectedEvents.length === 0 && selectedLogs.length === 0 ? (
            <div className="bg-white/70 rounded-2xl p-6 text-center border border-dashed border-stone-200 flex flex-col items-center">
              <span className="text-3xl mb-1">🐱💤</span>
              <p className="text-xs font-bold text-stone-600">No events scheduled for this day</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Tap '+ Event' above to plan your study sessions!
              </p>
            </div>
          ) : (
            selectedEvents.map((evt) => {
              const meta = categoryMeta[evt.category];
              return (
                <div
                  key={evt.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    evt.completed
                      ? 'bg-stone-50/80 border-stone-200 opacity-60'
                      : 'bg-white/95 border-orange-100/90 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => onToggleEventComplete(evt.id)}
                      className={`p-1 rounded-full transition ${
                        evt.completed ? 'text-emerald-500' : 'text-stone-300 hover:text-stone-400'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${meta.color}`}>
                          {meta.emoji} {meta.label}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {evt.startTime} ({evt.durationMinutes}m)
                        </span>
                      </div>
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${
                          evt.completed ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {evt.title}
                      </h4>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!evt.completed && (
                      <button
                        onClick={() => onStartTimerForEvent(evt)}
                        title="Start timer for this task"
                        className="flex items-center gap-1 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Focus</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-orange-100 text-stone-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Fredoka',sans-serif] font-bold text-base text-stone-900 flex items-center gap-1.5">
                <span>📅</span> Add Calendar Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Event / Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Science Review, Reading, Homework"
                  className="w-full text-xs font-semibold py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full text-xs font-semibold py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Duration (Minutes)
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs font-semibold py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value={10}>10 min (+10🪙)</option>
                    <option value={20}>20 min (+20🪙)</option>
                    <option value={25}>25 min (Pomodoro)</option>
                    <option value={30}>30 min (+30🪙)</option>
                    <option value={50}>50 min (+50🪙)</option>
                    <option value={60}>60 min (+60🪙)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(categoryMeta) as CalendarEvent['category'][]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition text-center ${
                        newCategory === cat
                          ? 'bg-orange-100 text-orange-800 border-orange-400'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {categoryMeta[cat].emoji} {categoryMeta[cat].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
