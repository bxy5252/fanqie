export type Mode = 'work' | 'shortBreak' | 'longBreak';

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface PomodoroRecord {
  id: string;
  type: Mode;
  startTime: number;
  duration: number; // actual seconds spent
  completed: boolean;
}

export const defaultSettings: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};
