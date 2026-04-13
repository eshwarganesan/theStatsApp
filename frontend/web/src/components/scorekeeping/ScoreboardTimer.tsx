import React from 'react'
import { ScoreboardTimerProps, formatTime } from '@/types/scorekeeping.types'

/**
 * ScoreboardTimer: Displays countdown time in MM:SS format
 *
 * Props:
 * - isRunning: Whether timer is counting down
 * - currentTime: Current time in seconds
 * - initialTime: Initial time (default 600)
 * - onTimeUpdate: Optional callback on each tick
 * - className: Optional Tailwind classes
 */
export const ScoreboardTimer: React.FC<ScoreboardTimerProps> = ({
  isRunning,
  currentTime,
  onTimeUpdate,
  className = '',
}) => {
  const formatted = formatTime(currentTime)

  // Fire callback on time change
  React.useEffect(() => {
    onTimeUpdate?.(currentTime)
  }, [currentTime, onTimeUpdate])

  return (
    <div
      className={`flex items-center justify-center py-4 px-2 ${className}`}
      aria-live="polite"
      aria-label={`Timer: ${formatted.display}`}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Timer Display */}
        <time
          className={`text-5xl md:text-6xl font-bold font-mono tracking-wider ${
            currentTime === 0 ? 'text-red-600' : 'text-slate-900'
          } ${isRunning ? 'animate-pulse' : ''}`}
          dateTime={`PT${formatted.minutes}M${formatted.seconds}S`}
          role="status"
          aria-label={`${formatted.minutes} minutes ${formatted.seconds} seconds remaining`}
        >
          {formatted.display}
        </time>

        {/* Status Indicator */}
        <div
          className={`text-xs font-semibold uppercase tracking-widest ${
            isRunning
              ? 'text-green-600'
              : currentTime === 0
                ? 'text-red-600'
                : 'text-slate-500'
          }`}
          aria-hidden="true"
        >
          {isRunning ? '● Running' : currentTime === 0 ? '● Expired' : '○ Paused'}
        </div>
      </div>
    </div>
  )
}

ScoreboardTimer.displayName = 'ScoreboardTimer'
