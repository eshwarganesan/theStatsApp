import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../ScoreboardTimerContainer'
import { TIMER_CONSTANTS } from '@/constants/timer'

describe('useTimer Hook', () => {
  describe('Initial State', () => {
    it('should initialize with default time of 600 seconds (10:00)', () => {
      const { result } = renderHook(() => useTimer())
      expect(result.current.currentTime).toBe(600)
      expect(result.current.isRunning).toBe(false)
      expect(result.current.initialTime).toBe(600)
    })

    it('should initialize with custom initial time', () => {
      const customTime = 300
      const { result } = renderHook(() => useTimer(customTime))
      expect(result.current.currentTime).toBe(customTime)
      expect(result.current.initialTime).toBe(customTime)
    })
  })

  describe('Minute Adjustment', () => {
    it('should increment minutes by 60 seconds', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.incrementMinutes()
      })
      expect(result.current.currentTime).toBe(660)
    })

    it('should decrement minutes by 60 seconds', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.decrementMinutes()
      })
      expect(result.current.currentTime).toBe(540)
    })

    it('should cap increment at 59:59 (3599 seconds)', () => {
      const { result } = renderHook(() => useTimer(3570))
      act(() => {
        result.current.incrementMinutes()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MAX_TIME_SECONDS)
    })

    it('should not exceed 3599 seconds on multiple increments', () => {
      const { result } = renderHook(() => useTimer(3599))
      act(() => {
        result.current.incrementMinutes()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MAX_TIME_SECONDS)
    })

    it('should floor decrement at 00:00 (0 seconds)', () => {
      const { result } = renderHook(() => useTimer(30))
      act(() => {
        result.current.decrementMinutes()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MIN_TIME_SECONDS)
    })

    it('should not go below 0 seconds on multiple decrements', () => {
      const { result } = renderHook(() => useTimer(0))
      act(() => {
        result.current.decrementMinutes()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MIN_TIME_SECONDS)
    })
  })

  describe('Second Adjustment', () => {
    it('should increment seconds by 1', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.incrementSeconds()
      })
      expect(result.current.currentTime).toBe(601)
    })

    it('should decrement seconds by 1', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.decrementSeconds()
      })
      expect(result.current.currentTime).toBe(599)
    })

    it('should cap increment seconds at 59:59 (3599 seconds)', () => {
      const { result } = renderHook(() => useTimer(3599))
      act(() => {
        result.current.incrementSeconds()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MAX_TIME_SECONDS)
    })

    it('should floor decrement seconds at 00:00 (0 seconds)', () => {
      const { result } = renderHook(() => useTimer(0))
      act(() => {
        result.current.decrementSeconds()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MIN_TIME_SECONDS)
    })

    it('should allow fine-grained second adjustments', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.incrementSeconds()
        result.current.incrementSeconds()
        result.current.incrementSeconds()
      })
      expect(result.current.currentTime).toBe(603)
    })

    it('should allow decrementing multiple seconds', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.decrementSeconds()
        result.current.decrementSeconds()
        result.current.decrementSeconds()
      })
      expect(result.current.currentTime).toBe(597)
    })
  })

  describe('Boundary Testing', () => {
    it('should prevent increment below maximum at 59:59', () => {
      const { result } = renderHook(() => useTimer(3599))
      act(() => {
        result.current.incrementMinutes()
        result.current.incrementSeconds()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MAX_TIME_SECONDS)
    })

    it('should prevent decrement above minimum at 00:00', () => {
      const { result } = renderHook(() => useTimer(0))
      act(() => {
        result.current.decrementMinutes()
        result.current.decrementSeconds()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MIN_TIME_SECONDS)
    })

    it('should maintain correct state at boundary 59:59', () => {
      const { result } = renderHook(() => useTimer(3599))
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MAX_TIME_SECONDS)
    })

    it('should maintain correct state at boundary 00:00', () => {
      const { result } = renderHook(() => useTimer(0))
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MIN_TIME_SECONDS)
    })
  })

  describe('Method Independence', () => {
    it('should separate minute and second adjustments', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.incrementMinutes()
        result.current.incrementSeconds()
      })
      // 600 + 60 (1 minute) + 1 (1 second) = 661
      expect(result.current.currentTime).toBe(661)
    })

    it('should not interfere with other state when adjusting', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.toggle()
      })
      expect(result.current.isRunning).toBe(true)
      act(() => {
        result.current.incrementMinutes()
      })
      // isRunning should still be true
      expect(result.current.isRunning).toBe(true)
      expect(result.current.currentTime).toBe(660)
    })

    it('should reset to initial time when reset is called', () => {
      const initialTime = 600
      const { result } = renderHook(() => useTimer(initialTime))
      act(() => {
        result.current.incrementMinutes()
        result.current.incrementMinutes()
      })
      expect(result.current.currentTime).toBe(720)
      act(() => {
        result.current.reset()
      })
      expect(result.current.currentTime).toBe(initialTime)
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('Toggle Functionality', () => {
    it('should toggle isRunning from false to true', () => {
      const { result } = renderHook(() => useTimer())
      expect(result.current.isRunning).toBe(false)
      act(() => {
        result.current.toggle()
      })
      expect(result.current.isRunning).toBe(true)
    })

    it('should toggle isRunning from true to false', () => {
      const { result } = renderHook(() => useTimer())
      act(() => {
        result.current.toggle()
        result.current.toggle()
      })
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe('Constants Usage', () => {
    it('should use TIMER_CONSTANTS.MAX_TIME_SECONDS as upper bound', () => {
      const { result } = renderHook(() => useTimer(TIMER_CONSTANTS.MAX_TIME_SECONDS - 30))
      act(() => {
        result.current.incrementMinutes()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MAX_TIME_SECONDS)
    })

    it('should use TIMER_CONSTANTS.MIN_TIME_SECONDS as lower bound', () => {
      const { result } = renderHook(() => useTimer(30))
      act(() => {
        result.current.decrementMinutes()
      })
      expect(result.current.currentTime).toBe(TIMER_CONSTANTS.MIN_TIME_SECONDS)
    })

    it('should use TIMER_CONSTANTS.SECONDS_PER_MINUTE for minute adjustments', () => {
      const { result } = renderHook(() => useTimer(600))
      act(() => {
        result.current.incrementMinutes()
      })
      expect(result.current.currentTime).toBe(600 + TIMER_CONSTANTS.SECONDS_PER_MINUTE)
    })
  })

  describe('Return Object', () => {
    it('should expose all required methods in return object', () => {
      const { result } = renderHook(() => useTimer())
      expect(typeof result.current.toggle).toBe('function')
      expect(typeof result.current.reset).toBe('function')
      expect(typeof result.current.incrementMinutes).toBe('function')
      expect(typeof result.current.decrementMinutes).toBe('function')
      expect(typeof result.current.incrementSeconds).toBe('function')
      expect(typeof result.current.decrementSeconds).toBe('function')
    })

    it('should expose timer state in return object', () => {
      const { result } = renderHook(() => useTimer())
      expect(typeof result.current.currentTime).toBe('number')
      expect(typeof result.current.isRunning).toBe('boolean')
      expect(typeof result.current.initialTime).toBe('number')
      expect(typeof result.current.lastUpdateTime).toBe('number')
    })
  })
})
