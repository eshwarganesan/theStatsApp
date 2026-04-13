import React from 'react'
import { TimerToggleProps } from '@/types/scorekeeping.types'

/**
 * TimerToggle: Play/Pause button for timer control
 *
 * Props:
 * - isRunning: Current timer state
 * - onToggle: Callback when clicked or keyboard activated
 * - disabled: Optional disable state
 * - ariaLabel: Optional screen reader label
 * - className: Optional Tailwind classes
 */
export const TimerToggle: React.FC<TimerToggleProps> = ({
  isRunning,
  onToggle,
  disabled = false,
  ariaLabel,
  className = '',
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter or Space activates toggle
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onToggle()
    }
  }

  const label = ariaLabel || (isRunning ? 'Pause timer' : 'Start timer')

  return (
    <button
      type="button"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isRunning}
      className={`
        h-12 w-12 md:h-14 md:w-14
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${
          disabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
        }
        ${className}
      `}
    >
      {/* Icon: Play or Pause */}
      {isRunning ? (
        // Pause icon (two vertical bars)
        <svg
          className="w-6 h-6 md:w-7 md:h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        // Play icon (triangle pointing right)
        <svg
          className="w-6 h-6 md:w-7 md:h-7 ml-1"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  )
}

TimerToggle.displayName = 'TimerToggle'
