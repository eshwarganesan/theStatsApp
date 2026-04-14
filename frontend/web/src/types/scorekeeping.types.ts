/**
 * Type definitions for blank scorekeeping canvas feature
 *
 * This module defines minimal TypeScript interfaces required by the scorekeeping
 * canvas implementation. In v1, these are largely empty/placeholder interfaces,
 * allowing for future expansion without breaking existing code.
 *
 * @module scorekeeping.types
 */

/**
 * Props for the BlankScoreKeepingCanvas component
 *
 * In v1, this component is stateless and doesn't require props.
 * The interface is defined here to support future extensibility.
 *
 * @interface BlankScoreKeeperProps
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BlankScoreKeeperProps {
  // Future props can be added here without breaking existing code
  // Examples: onScoreUpdate?: (team: 'home' | 'away', score: number) => void
}

/**
 * Page route type for scorekeeping pages
 *
 * @enum ScoreKeeperPageType
 */
export enum ScoreKeeperPageType {
  BLANK = 'blank',
  WITH_CONTROLS = 'with-controls',
  WITH_TIMER = 'with-timer',
}

/**
 * Score state for future scorekeeping features
 *
 * @interface ScoreState
 */
export interface ScoreState {
  homeScore: number
  awayScore: number
  quarterNumber: number
  timeRemaining: number
}

/**
 * Timer state managed by the countdown component
 *
 * @interface TimerState
 */
export interface TimerState {
  currentTime: number
  isRunning: boolean
  initialTime: number
  lastUpdateTime: number
}

/**
 * Return type for useTimer hook
 *
 * @interface UseTimerReturn
 */
export interface UseTimerReturn extends TimerState {
  toggle: () => void
  reset: () => void
  incrementMinutes: () => void
  decrementMinutes: () => void
  incrementSeconds: () => void
  decrementSeconds: () => void
}

/**
 * Props for ScoreboardTimer display component
 *
 * @interface ScoreboardTimerProps
 */
export interface ScoreboardTimerProps {
  initialTime?: number
  isRunning: boolean
  currentTime: number
  onTimeUpdate?: (time: number) => void
  className?: string
}

/**
 * Props for TimerToggle button component
 *
 * @interface TimerToggleProps
 */
export interface TimerToggleProps {
  isRunning: boolean
  onToggle: () => void
  disabled?: boolean
  ariaLabel?: string
  className?: string
}

/**
 * Props for ArrowButton adjustment control component
 *
 * @interface ArrowButtonProps
 */
export interface ArrowButtonProps {
  direction: 'up' | 'down'
  unit: 'minutes' | 'seconds'
  onClick: () => void
  disabled: boolean
  className?: string
}

/**
 * Formatted display time (MM:SS)
 *
 * @interface FormattedTime
 */
export interface FormattedTime {
  minutes: number
  seconds: number
  display: string
}

/**
 * Props for ScoreboardTimerContainer component
 *
 * @interface ScoreboardTimerContainerProps
 */
export interface ScoreboardTimerContainerProps {
  initialTime?: number
  className?: string
  onTimeUpdate?: (time: number) => void
}

/**
 * Formats seconds to MM:SS display format
 *
 * @param seconds - Number of seconds (0-600 for MVP)
 * @returns FormattedTime object with minutes, seconds, and display string
 *
 * @example
 * formatTime(600) // { minutes: 10, seconds: 0, display: '10:00' }
 * formatTime(65)  // { minutes: 1, seconds: 5, display: '01:05' }
 */
export function formatTime(seconds: number): FormattedTime {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return {
    minutes,
    seconds: secs,
    display: `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
  }
}
