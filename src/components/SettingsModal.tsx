import { ChangeEvent } from 'react';
import { Settings as SettingsType } from '../types';
import { X } from 'lucide-react';

interface SettingsModalProps {
  settings: SettingsType;
  onUpdate: (newSettings: SettingsType) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onUpdate, onClose }: SettingsModalProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onUpdate({
      ...settings,
      [name]: type === 'checkbox' ? checked : Math.max(1, parseInt(value, 10) || 1),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white mt-1">专注设置</h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">时长（分钟）</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">专注</label>
                <input
                  type="number"
                  name="workDuration"
                  min="1"
                  value={settings.workDuration}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-center font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">短休息</label>
                <input
                  type="number"
                  name="shortBreakDuration"
                  min="1"
                  value={settings.shortBreakDuration}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-center font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">长休息</label>
                <input
                  type="number"
                  name="longBreakDuration"
                  min="1"
                  value={settings.longBreakDuration}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-center font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">选项</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                长休息间隔
              </label>
              <input
                type="number"
                name="longBreakInterval"
                min="1"
                value={settings.longBreakInterval}
                onChange={handleChange}
                className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 text-center font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                自动开始休息
              </label>
              <input
                type="checkbox"
                name="autoStartBreaks"
                checked={settings.autoStartBreaks}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                自动开始番茄钟
              </label>
              <input
                type="checkbox"
                name="autoStartPomodoros"
                checked={settings.autoStartPomodoros}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 bg-gray-900 text-white dark:bg-white dark:text-gray-900 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          完成
        </button>
      </div>
    </div>
  );
}
