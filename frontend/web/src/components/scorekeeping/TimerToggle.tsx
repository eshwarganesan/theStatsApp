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
        px-8 py-3 md:px-10 md:py-4
        flex items-center justify-center
        rounded-full
        font-semibold text-base md:text-lg
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
      <span>{isRunning ? 'Stop' : 'Start'}</span>
    </button>
  )
}

TimerToggle.displayName = 'TimerToggle'
