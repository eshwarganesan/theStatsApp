import React from 'react'
import { ScoreboardTimer } from './ScoreboardTimer'
import { TimerToggle } from './TimerToggle'
import { ScoreboardTimerContainerProps, TimerState } from '@/types/scorekeeping.types'

/**
 * useTimer: Custom hook for timer countdown logic
 *
 * Manages countdown state with 1-second intervals. Continues counting
 * even when page tab loses focus. Stops automatically at 0:00.
 */
function useTimer(initialTime: number = 600) {
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

  return {
    ...state,
    toggle,
    reset,
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
  const { currentTime, isRunning, toggle } = useTimer(initialTime)
  // reset is available for future use (e.g., exposed via ref)

  return (
    <div
      className={`
        flex flex-col items-center gap-4
        py-4 px-2
        ${className}
      `}
      role="region"
      aria-label="Game timer control"
    >
      {/* Timer Display */}
      <ScoreboardTimer
        initialTime={initialTime}
        isRunning={isRunning}
        currentTime={currentTime}
        onTimeUpdate={onTimeUpdate}
      />

      {/* Toggle Button */}
      <TimerToggle
        isRunning={isRunning}
        onToggle={toggle}
        disabled={false}
        ariaLabel={isRunning ? 'Pause timer' : 'Start timer'}
      />

      {/* Info Text */}
      <p className="text-xs text-slate-500 text-center mt-2">
        {isRunning ? 'Timer running' : currentTime === 0 ? 'Time expired' : 'Click play to start'}
      </p>
    </div>
  )
}

ScoreboardTimerContainer.displayName = 'ScoreboardTimerContainer'
