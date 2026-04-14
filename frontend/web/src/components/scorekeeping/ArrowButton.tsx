'use client'

import React from 'react'
import { ArrowButtonProps } from '@/types/scorekeeping.types'

/**
 * ArrowButton: Reusable up/down arrow button for timer adjustment
 *
 * A stateless, accessible button component for incrementing/decrementing
 * timer values (minutes or seconds). Used as left (minutes) and right (seconds)
 * controls in the ScoreboardTimerContainer.
 *
 * @param {ArrowButtonProps} props - Component props
 * @param {('up'|'down')} props.direction - Arrow direction indicator
 * @param {('minutes'|'seconds')} props.unit - Time unit being adjusted
 * @param {() => void} props.onClick - Handler when button is clicked
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} [props.className] - Additional Tailwind CSS classes
 *
 * @returns {React.ReactElement} Button element with arrow icon
 *
 * @example
 * <ArrowButton
 *   direction="up"
 *   unit="minutes"
 *   onClick={handleIncrementMinutes}
 *   disabled={isRunning || currentTime >= 3599}
 * />
 */
export const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  unit,
  onClick,
  disabled,
  className = '',
}) => {
  // Arrow symbols: ▲ (U+25B2) for up, ▼ (U+25BC) for down
  const arrowSymbol = direction === 'up' ? '▲' : '▼'

  // ARIA label for screen readers: "Increment minutes", "Decrement seconds", etc.
  const actionVerb = direction === 'up' ? 'Increment' : 'Decrement'
  const ariaLabel = `${actionVerb} ${unit}`

  // Handle keyboard activation (Enter and Space keys)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={false}
      className={`
        h-12 w-12 md:h-14 md:w-14
        flex items-center justify-center
        rounded-lg
        bg-slate-200 hover:bg-slate-300
        text-slate-700 hover:text-slate-900
        font-bold text-lg
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200
        focus:outline-2 focus:outline-blue-500 focus:outline-offset-2
        ${className}
      `}
    >
      {arrowSymbol}
    </button>
  )
}

ArrowButton.displayName = 'ArrowButton'
