/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { TimerTab } from './components/TimerTab';
import { CalendarTab } from './components/CalendarTab';
import { ShopTab } from './components/ShopTab';
import { CatRoomTab } from './components/CatRoomTab';
import { CoinRewardBanner } from './components/CoinRewardBanner';
import { CalendarEvent, FocusSessionLog, HatItem, TimerMode } from './types';
import { playClickSound, playCoinSound } from './utils/audio';

// Friendly starter calendar events
const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Math Study & Practice Problems',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    durationMinutes: 25,
    category: 'study',
    completed: false,
  },
  {
    id: 'evt-2',
    title: 'Read 20 Pages of Novel',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:30',
    durationMinutes: 20,
    category: 'reading',
    completed: false,
  },
  {
    id: 'evt-3',
    title: 'Quick Room Tidy & Water Plants',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:00',
    durationMinutes: 10,
    category: 'chores',
    completed: false,
  },
];

export default function App() {
  // Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('timer');

  // Coin Balance: Starter gift of 60 coins so user can immediately buy their first custom hat!
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('nekotimer_coins');
    return saved !== null ? parseInt(saved, 10) : 60;
  });

  // Owned Hats list
  const [ownedHatIds, setOwnedHatIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nekotimer_owned_hats');
    return saved ? JSON.parse(saved) : [];
  });

  // Equipped Hat
  const [equippedHatId, setEquippedHatId] = useState<string | null>(() => {
    const saved = localStorage.getItem('nekotimer_equipped_hat');
    return saved !== null ? saved : null;
  });

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('nekotimer_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // Cat custom name
  const [catName, setCatName] = useState<string>(() => {
    const saved = localStorage.getItem('nekotimer_cat_name');
    return saved || 'Mochi';
  });

  // Calendar Events
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('nekotimer_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Focus Session History Logs
  const [focusLogs, setFocusLogs] = useState<FocusSessionLog[]>(() => {
    const saved = localStorage.getItem('nekotimer_focus_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Task Title currently being worked on in the Timer
  const [activeTaskTitle, setActiveTaskTitle] = useState<string>('Focus & Earn Coins 🐾');

  // Stats
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('nekotimer_total_mins');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState<number>(() => {
    const saved = localStorage.getItem('nekotimer_total_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Coin Reward Banner popup state
  const [rewardBanner, setRewardBanner] = useState<{
    show: boolean;
    amount: number;
    message: string;
  }>({
    show: false,
    amount: 10,
    message: '10 Minutes of Focus Completed!',
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('nekotimer_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('nekotimer_owned_hats', JSON.stringify(ownedHatIds));
  }, [ownedHatIds]);

  useEffect(() => {
    if (equippedHatId !== null) {
      localStorage.setItem('nekotimer_equipped_hat', equippedHatId);
    } else {
      localStorage.removeItem('nekotimer_equipped_hat');
    }
  }, [equippedHatId]);

  useEffect(() => {
    localStorage.setItem('nekotimer_sound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('nekotimer_cat_name', catName);
  }, [catName]);

  useEffect(() => {
    localStorage.setItem('nekotimer_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('nekotimer_focus_logs', JSON.stringify(focusLogs));
  }, [focusLogs]);

  useEffect(() => {
    localStorage.setItem('nekotimer_total_mins', totalFocusMinutes.toString());
  }, [totalFocusMinutes]);

  useEffect(() => {
    localStorage.setItem('nekotimer_total_sessions', totalSessionsCompleted.toString());
  }, [totalSessionsCompleted]);

  // Handler: Award coins (from 10-min timer interval)
  const handleEarnCoins = (amount: number, reason: string) => {
    setCoins((prev) => prev + amount);
    setRewardBanner({
      show: true,
      amount,
      message: reason,
    });
  };

  // Handler: Buy a Hat in the shop for 60 coins
  const handleBuyHat = (hat: HatItem) => {
    if (coins < hat.price) return;
    setCoins((prev) => prev - hat.price);
    setOwnedHatIds((prev) => {
      if (prev.includes(hat.id)) return prev;
      return [...prev, hat.id];
    });
    setEquippedHatId(hat.id);
  };

  // Handler: Equip / Unequip a hat
  const handleEquipHat = (hatId: string | null) => {
    setEquippedHatId(hatId);
  };

  // Handler: Timer Session Finished
  const handleSessionComplete = (
    durationMinutes: number,
    title: string,
    coinsEarned: number,
    mode: TimerMode
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog: FocusSessionLog = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      date: todayStr,
      title,
      durationMinutes,
      coinsEarned,
      mode,
    };

    setFocusLogs((prev) => [newLog, ...prev]);
    setTotalFocusMinutes((prev) => prev + durationMinutes);
    setTotalSessionsCompleted((prev) => prev + 1);

    // Also mark matching event as completed if present
    setEvents((prev) =>
      prev.map((evt) =>
        evt.title.toLowerCase() === title.toLowerCase() && evt.date === todayStr
          ? { ...evt, completed: true }
          : evt
      )
    );
  };

  // Handler: Add Calendar Event
  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  // Handler: Delete Calendar Event
  const handleDeleteEvent = (id: string) => {
    playClickSound(soundEnabled);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Handler: Toggle Event Complete
  const handleToggleEventComplete = (id: string) => {
    playClickSound(soundEnabled);
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  // Handler: Start Timer for an Event
  const handleStartTimerForEvent = (event: CalendarEvent) => {
    playClickSound(soundEnabled);
    setActiveTaskTitle(event.title);
    setActiveTab('timer');
  };

  return (
    <AndroidFrame>
      {/* Coin Reward Banner */}
      <CoinRewardBanner
        show={rewardBanner.show}
        coinsEarned={rewardBanner.amount}
        message={rewardBanner.message}
        soundEnabled={soundEnabled}
        onClose={() => setRewardBanner((prev) => ({ ...prev, show: false }))}
      />

      {/* Android Top App Header */}
      <TopBar
        coins={coins}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenShop={() => {
          playClickSound(soundEnabled);
          setActiveTab('shop');
        }}
      />

      {/* Main Screen Content based on Active Tab */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {activeTab === 'timer' && (
          <TimerTab
            equippedHatId={equippedHatId}
            soundEnabled={soundEnabled}
            activeTaskTitle={activeTaskTitle}
            setActiveTaskTitle={setActiveTaskTitle}
            onEarnCoins={handleEarnCoins}
            onSessionComplete={handleSessionComplete}
            pomodoroMinutes={25}
            shortBreakMinutes={5}
            longBreakMinutes={15}
            onOpenShop={() => {
              playClickSound(soundEnabled);
              setActiveTab('shop');
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            events={events}
            focusLogs={focusLogs}
            soundEnabled={soundEnabled}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleEventComplete={handleToggleEventComplete}
            onStartTimerForEvent={handleStartTimerForEvent}
          />
        )}

        {activeTab === 'shop' && (
          <ShopTab
            coins={coins}
            ownedHatIds={ownedHatIds}
            equippedHatId={equippedHatId}
            soundEnabled={soundEnabled}
            onBuyHat={handleBuyHat}
            onEquipHat={handleEquipHat}
            onGoToTimer={() => {
              playClickSound(soundEnabled);
              setActiveTab('timer');
            }}
          />
        )}

        {activeTab === 'cat' && (
          <CatRoomTab
            catName={catName}
            setCatName={setCatName}
            coins={coins}
            ownedHatIds={ownedHatIds}
            equippedHatId={equippedHatId}
            soundEnabled={soundEnabled}
            totalFocusMinutes={totalFocusMinutes}
            totalSessionsCompleted={totalSessionsCompleted}
            onEquipHat={handleEquipHat}
            onOpenShop={() => {
              playClickSound(soundEnabled);
              setActiveTab('shop');
            }}
          />
        )}
      </main>

      {/* Android Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          playClickSound(soundEnabled);
          setActiveTab(tab);
        }}
        hatCount={ownedHatIds.length}
      />
    </AndroidFrame>
  );
}
