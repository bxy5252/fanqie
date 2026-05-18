import { useEffect, useState, useRef } from 'react';
import { Settings as SettingsIcon, RotateCcw, Play, Pause, Square, List } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsModal } from './components/SettingsModal';
import { Records } from './components/Records';
import { Mode, Settings, PomodoroRecord, defaultSettings } from './types';
import * as motion from 'motion/react-client';

export default function App() {
  const [settings, setSettings] = useLocalStorage<Settings>('pomodoro-settings', defaultSettings);
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [expectedEndTime, setExpectedEndTime] = useState<number | null>(null);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  
  const recordStartTimeRef = useRef<number | null>(null);

  // Sync initial time if settings change and timer is not active
  useEffect(() => {
    if (!isActive) {
      resetTimer();
    }
  }, [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration, mode]);

  useEffect(() => {
    if (!isActive || !expectedEndTime) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((expectedEndTime - now) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        handleComplete();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isActive, expectedEndTime]);

  // Update browser document title
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const modeString = mode === 'work' ? '专注' : '休息';
    document.title = `${timeString} - ${modeString}`;
  }, [timeLeft, mode]);

  const toggleTimer = () => {
    if (isActive) {
      // Pause
      setIsActive(false);
      setExpectedEndTime(null);
    } else {
      // Start
      setIsActive(true);
      setExpectedEndTime(Date.now() + timeLeft * 1000);
      if (!recordStartTimeRef.current) {
        recordStartTimeRef.current = Date.now();
      }
    }
  };

  const getDurationForMode = (m: Mode) => {
    switch (m) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
    }
  };

  const resetTimer = (newMode: Mode = mode) => {
    setIsActive(false);
    setExpectedEndTime(null);
    recordStartTimeRef.current = null;
    setTimeLeft(getDurationForMode(newMode));
    setMode(newMode);
  };

  const changeMode = (newMode: Mode) => {
    if (isActive) {
      saveRecord(false); // save partial
    }
    resetTimer(newMode);
  };

  const saveRecord = (completed: boolean) => {
    if (!recordStartTimeRef.current) return;
    
    const durationSpent = getDurationForMode(mode) - timeLeft;
    if (durationSpent < 5) return; // ignore super short aborted sessions

    const newRecord: PomodoroRecord = {
      id: Date.now().toString(),
      type: mode,
      startTime: recordStartTimeRef.current,
      duration: durationSpent,
      completed,
    };

    setRecords((prev) => [...prev, newRecord]);
    recordStartTimeRef.current = null;
  };

  const handleComplete = () => {
    setIsActive(false);
    saveRecord(true);
    
    // Play sound notification
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}

    // Auto-transition logic
    if (mode === 'work') {
      const newCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompleted);
      
      const nextMode = newCompleted % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      resetTimer(nextMode);
      
      if (settings.autoStartBreaks) {
        setTimeout(() => {
          setIsActive(true);
          setExpectedEndTime(Date.now() + getDurationForMode(nextMode) * 1000);
          recordStartTimeRef.current = Date.now();
        }, 1000);
      }
    } else {
      resetTimer('work');
      
      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          setIsActive(true);
          setExpectedEndTime(Date.now() + getDurationForMode('work') * 1000);
          recordStartTimeRef.current = Date.now();
        }, 1000);
      }
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getThemeClasses = () => {
    switch (mode) {
      case 'work': return 'bg-red-500';
      case 'shortBreak': return 'bg-emerald-500';
      case 'longBreak': return 'bg-blue-500';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getThemeClasses()} flex flex-col items-center py-8 px-4 sm:px-6 md:justify-center`}>
      <header className="w-full max-w-2xl flex justify-between items-center mb-12 sm:absolute sm:top-8 px-6">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <span>番茄钟</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            title="设置"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-8 z-10 p-2">
        {/* Timer Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 w-full shadow-2xl shadow-black/10 border border-white/20">
          
          {/* Mode Selector */}
          <div className="flex justify-center gap-2 mb-10 bg-black/10 p-1.5 rounded-full">
            {(['work', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={`flex-1 py-1.5 px-3 rounded-full text-sm font-semibold transition-all ${
                  mode === m 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {m === 'work' ? '番茄时间' : m === 'shortBreak' ? '短休息' : '长休息'}
              </button>
            ))}
          </div>

          {/* Time Display */}
          <div className="flex justify-center my-12">
            <motion.div
              key={mode} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-[6rem] sm:text-[7rem] leading-none font-bold text-white font-mono tracking-tighter"
            >
              {formatTime(timeLeft)}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={() => resetTimer(mode)}
              className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="重置"
            >
              <RotateCcw className="w-7 h-7" />
            </button>

            <button
              onClick={toggleTimer}
              className={`flex items-center justify-center w-24 h-24 rounded-3xl transition-transform active:scale-95 shadow-xl ${
                isActive ? 'bg-white text-gray-900' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              }`}
            >
              {isActive ? (
                <Pause className="w-10 h-10 fill-current" />
              ) : (
                <Play className="w-10 h-10 fill-current ml-2" />
              )}
            </button>

            <button
              onClick={handleSkip}
              className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="跳过"
            >
              <Square className="w-7 h-7 fill-current" />
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < (pomodorosCompleted % settings.longBreakInterval) 
                  ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Records */}
        <div className="w-full mt-4">
          <Records 
            records={records} 
            onClear={() => setRecords([])} 
          />
        </div>
      </main>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
