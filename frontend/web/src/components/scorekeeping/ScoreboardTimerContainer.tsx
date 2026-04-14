'use client'
import React from 'react'
import { ScoreboardTimer } from './ScoreboardTimer'
import { TimerToggle } from './TimerToggle'
import { ArrowButton } from './ArrowButton'
import { ScoreboardTimerContainerProps, TimerState, UseTimerReturn } from '@/types/scorekeeping.types'
import { TIMER_CONSTANTS } from '@/constants/timer'

/**
 * useTimer: Custom hook for timer countdown logic
 *
 * Manages countdown state with 1-second intervals. Continues counting
 * even when page tab loses focus. Stops automatically at 0:00.
 */
export function useTimer(initialTime: number = 600): UseTimerReturn {
  // Initialize state with Date.now() - called once during component mount
  const [state, setState] = React.useState<TimerState>(() => ({
    currentTime: initialTime,
    isRunning: false,
    initialTime: initialTime,
    lastUpdateTime: Date.now(),
  }))

  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Handle countdown tick
  React.useEffect(() => {
    if (!state.isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      setState((prevState) => {
        if (prevState.currentTime <= 0) {
          return {
            ...prevState,
            isRunning: false,
            currentTime: 0,
          }
        }

        const newTime = Math.max(0, prevState.currentTime - 1)
        return {
          ...prevState,
          currentTime: newTime,
          lastUpdateTime: Date.now(),
        }
      })
    }, 1000)

    // Cleanup on unmount or when running state changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.isRunning])

  // Handle page visibility changes (timer continues counting)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      // Timer continues counting even when tab is unfocused
      // No special handling needed - setInterval continues in background
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggle = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isRunning: !prevState.isRunning,
    }))
  }, [])

  const reset = React.useCallback(() => {
    setState({
      currentTime: initialTime,
      isRunning: false,
      initialTime: initialTime,
      lastUpdateTime: Date.now(),
    })
  }, [initialTime])

  /**
   * Increment minutes by 1 (capped at 59:59)
   */
  const incrementMinutes = React.useCallback(() => {
    setState((prevState) => {
      const newTime = Math.min(
        prevState.currentTime + TIMER_CONSTANTS.SECONDS_PER_MINUTE,
        TIMER_CONSTANTS.MAX_TIME_SECONDS
      )
      return { ...prevState, currentTime: newTime }
    })
  }, [])

  /**
   * Decrement minutes by 1 (floored at 00:00)
   */
  const decrementMinutes = React.useCallback(() => {
    setState((prevState) => {
      const newTime = Math.max(
        prevState.currentTime - TIMER_CONSTANTS.SECONDS_PER_MINUTE,
        TIMER_CONSTANTS.MIN_TIME_SECONDS
      )
      return { ...prevState, currentTime: newTime }
    })
  }, [])

  /**
   * Increment seconds by 1 (capped at 59:59)
   */
  const incrementSeconds = React.useCallback(() => {
    setState((prevState) => {
      const newTime = Math.min(
        prevState.currentTime + 1,
        TIMER_CONSTANTS.MAX_TIME_SECONDS
      )
      return { ...prevState, currentTime: newTime }
    })
  }, [])

  /**
   * Decrement seconds by 1 (floored at 00:00)
   */
  const decrementSeconds = React.useCallback(() => {
    setState((prevState) => {
      const newTime = Math.max(
        prevState.currentTime - 1,
        TIMER_CONSTANTS.MIN_TIME_SECONDS
      )
      return { ...prevState, currentTime: newTime }
    })
  }, [])

  return {
    ...state,
    toggle,
    reset,
    incrementMinutes,
    decrementMinutes,
    incrementSeconds,
    decrementSeconds,
  }
}

/**
 * ScoreboardTimerContainer: Combines timer display and toggle control
 *
 * Props:
 * - initialTime: Initial duration in seconds (default 600 = 10:00)
 * - className: Optional Tailwind classes for container
 * - onTimeUpdate: Optional callback on each tick
 */
export const ScoreboardTimerContainer: React.FC<ScoreboardTimerContainerProps> = ({
  initialTime = 600,
  className = '',
  onTimeUpdate,
}) => {
  const {
    currentTime,
    isRunning,
    toggle,
    incrementMinutes,
    decrementMinutes,
    incrementSeconds,
    decrementSeconds,
  } = useTimer(initialTime)

  // Determine disabled states based on boundaries
  const isMinutesAtMax = currentTime >= TIMER_CONSTANTS.MAX_TIME_SECONDS
  const isMinutesAtMin = currentTime < TIMER_CONSTANTS.SECONDS_PER_MINUTE
  const isSecondsAtMax = currentTime >= TIMER_CONSTANTS.MAX_TIME_SECONDS
  const isSecondsAtMin = currentTime === TIMER_CONSTANTS.MIN_TIME_SECONDS

  return (
    <div
      className={`
        flex flex-row items-center justify-center gap-6
        py-4 px-2
        ${className}
      `}
      role="region"
      aria-label="Game timer control"
    >
      {/* Left Column: Minutes Adjustment */}
      <div className="flex flex-col items-center gap-2">
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={incrementMinutes}
          disabled={isRunning || isMinutesAtMax}
          className="text-slate-700"
        />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Min
        </span>
        <ArrowButton
          direction="down"
          unit="minutes"
          onClick={decrementMinutes}
          disabled={isRunning || isMinutesAtMin}
          className="text-slate-700"
        />
      </div>

      {/* Center Column: Timer Display and Control */}
      <div className="flex flex-col items-center gap-3">
        <ScoreboardTimer
          initialTime={initialTime}
          isRunning={isRunning}
          currentTime={currentTime}
          onTimeUpdate={onTimeUpdate}
        />
        <TimerToggle
          isRunning={isRunning}
          onToggle={toggle}
          disabled={false}
          ariaLabel={isRunning ? 'Pause timer' : 'Start timer'}
        />
      </div>

      {/* Right Column: Seconds Adjustment */}
      <div className="flex flex-col items-center gap-2">
        <ArrowButton
          direction="up"
          unit="seconds"
          onClick={incrementSeconds}
          disabled={isRunning || isSecondsAtMax}
          className="text-slate-700"
        />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Sec
        </span>
        <ArrowButton
          direction="down"
          unit="seconds"
          onClick={decrementSeconds}
          disabled={isRunning || isSecondsAtMin}
          className="text-slate-700"
        />
      </div>
    </div>
  )
}

ScoreboardTimerContainer.displayName = 'ScoreboardTimerContainer'
