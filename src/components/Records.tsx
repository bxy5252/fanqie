import { PomodoroRecord, Mode } from '../types';

interface RecordsProps {
  records: PomodoroRecord[];
  onClear: () => void;
}

export function Records({ records, onClear }: RecordsProps) {
  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case 'work': return '专注';
      case 'shortBreak': return '短休息';
      case 'longBreak': return '长休息';
    }
  };

  const getModeColor = (mode: Mode) => {
    switch (mode) {
      case 'work': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'shortBreak': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'longBreak': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const formatTime = (dateNum: number) => {
    return new Date(dateNum).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateNum: number) => {
    return new Date(dateNum).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分 ${secs}秒`;
  };

  const workRecords = records.filter(r => r.type === 'work' && r.completed);
  const totalWorkSeconds = workRecords.reduce((acc, curr) => acc + curr.duration, 0);
  const totalWorkHours = (totalWorkSeconds / 3600).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">活动记录</h2>
        {records.length > 0 && (
          <button 
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            清空历史
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">专注次数</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{workRecords.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">总时长</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkHours}小时</p>
        </div>
      </div>

      <div className="overflow-y-auto max-h-64 pr-2 space-y-3">
        {records.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            暂无记录，开始专注吧！
          </p>
        ) : (
          [...records].reverse().map((record) => (
            <div 
              key={record.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getModeColor(record.type)}`}>
                  {getModeLabel(record.type)}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDuration(record.duration)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(record.startTime)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(record.startTime)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
