# Quickstart: Implementing the Scorekeeping Timer

**Feature**: 004-scorekeeping-timer  
**Difficulty**: 🟢 Beginner-Friendly  
**Estimated Time**: 2.5–3 hours (including tests and integration)

---

## Table of Contents

1. [Pre-Implementation Setup](#pre-implementation-setup)
2. [Component Overview](#component-overview)
3. [Step 1: Update Types](#step-1-update-types)
4. [Step 2: Create Timer Display Component](#step-2-create-timer-display-component)
5. [Step 3: Create Toggle Button Component](#step-3-create-toggle-button-component)
6. [Step 4: Create Timer Container](#step-4-create-timer-container)
7. [Step 5: Integrate into Scorekeeping Page](#step-5-integrate-into-scorekeeping-page)
8. [Step 6: Write Unit Tests](#step-6-write-unit-tests)
9. [Step 7: Write E2E Tests](#step-7-write-e2e-tests)
10. [Quality Checks](#quality-checks)

---

## Pre-Implementation Setup

### 1. Verify Project Structure

Confirm these files exist:

```bash
# Check existing Feature 003 files
ls -la src/components/scorekeeping/
ls -la src/types/scorekeeping.types.ts
ls -la src/app/scorekeeping/page.tsx
```

**Expected output**:
```
BlankScoreKeepingCanvas.tsx
__tests__/
  └── BlankScoreKeepingCanvas.test.tsx

scorekeeping.types.ts (should exist)

src/app/scorekeeping/page.tsx (should exist)
```

### 2. Verify Test Infrastructure

```bash
# Check Jest and Playwright configs
ls -la jest.config.js
ls -la jest.setup.ts
ls -la playwright.config.ts
```

All three should exist from Feature 003 setup.

---

## Component Overview

### Architecture Diagram

```
ScoreboardTimerContainer (manages state)
├── ScoreboardTimer (display: MM:SS)
└── TimerToggle (button: play/pause)
```

### Implementation Sequence

1. **Phase 1a**: Update TypeScript types
2. **Phase 1b**: Create display component (ScoreboardTimer)
3. **Phase 1c**: Create control component (TimerToggle)
4. **Phase 1d**: Create container component with hook logic
5. **Phase 2a**: Write unit tests (TDD: tests first!)
6. **Phase 2b**: Write E2E tests
7. **Phase 2c**: Integrate into scorekeeping page
8. **Phase 3**: Quality validation

---

## Step 1: Update Types

### Edit `src/types/scorekeeping.types.ts`

Add the following interfaces at the end of the file (after existing feature 003 types):

```typescript
/**
 * Timer state for countdown component
 */
export interface TimerState {
  currentTime: number        // Seconds remaining (0-600)
  isRunning: boolean         // Timer counting down?
  initialTime: number        // Initial duration (600 = 10:00)
  lastUpdateTime: number     // Timestamp of last update
}

/**
 * Props for ScoreboardTimer display component
 */
export interface ScoreboardTimerProps {
  initialTime?: number       // Default 600 (10:00)
  isRunning: boolean
  currentTime: number
  onTimeUpdate?: (time: number) => void
  className?: string
}

/**
 * Props for TimerToggle button component
 */
export interface TimerToggleProps {
  isRunning: boolean
  onToggle: () => void
  disabled?: boolean
  ariaLabel?: string
  className?: string
}

/**
 * Formatted display time (MM:SS)
 */
export interface FormattedTime {
  minutes: number
  seconds: number
  display: string
}

/**
 * Props for ScoreboardTimerContainer component
 */
export interface ScoreboardTimerContainerProps {
  initialTime?: number
  className?: string
  onTimeUpdate?: (time: number) => void
}

/**
 * Utility: Convert seconds to MM:SS format
 */
export function formatTime(seconds: number): FormattedTime {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return {
    minutes,
    seconds: secs,
    display: `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
}
```

**Verify**:
```bash
npm run type-check
# Should pass with no errors
```

---

## Step 2: Create Timer Display Component

### Create `src/components/scorekeeping/ScoreboardTimer.tsx`

```typescript
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
  initialTime = 600,
  onTimeUpdate,
  className = ''
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
```

**Verify**:
```bash
npm run type-check
# Should pass with no errors
```

### Accessibility Notes

- Uses `<time>` semantic element for timer display
- `aria-live="polite"` announces changes to screen readers
- Dynamic `aria-label` provides context for screen readers
- Pulse animation only when running (visual feedback)
- Color coding: green (running), red (expired), gray (paused)

---

## Step 3: Create Toggle Button Component

### Create `src/components/scorekeeping/TimerToggle.tsx`

```typescript
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
  className = ''
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
```

**Verify**:
```bash
npm run type-check
# Should pass with no errors
```

### Accessibility Notes

- 44px minimum touch target (12x12 on mobile, 14x14 on desktop)
- `aria-pressed` indicates button state
- Keyboard support: Enter/Space to activate
- Focus ring with blue outline (visible on keyboard navigation)
- Icon and label for visual + semantic clarity

---

## Step 4: Create Timer Container

### Create `src/components/scorekeeping/ScoreboardTimerContainer.tsx`

```typescript
import React from 'react'
import { ScoreboardTimer } from './ScoreboardTimer'
import { TimerToggle } from './TimerToggle'
import { ScoreboardTimerContainerProps, TimerState } from '@/types/scorekeeping.types'

/**
 * useTimer: Custom hook for timer countdown logic
 */
function useTimer(initialTime: number = 600) {
  const [state, setState] = React.useState<TimerState>({
    currentTime: initialTime,
    isRunning: false,
    initialTime: initialTime,
    lastUpdateTime: Date.now()
  })

  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastTickRef = React.useRef<number>(Date.now())

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
            currentTime: 0
          }
        }

        const newTime = Math.max(0, prevState.currentTime - 1)
        return {
          ...prevState,
          currentTime: newTime,
          lastUpdateTime: Date.now()
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

  // Handle page focus/blur events
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      // Timer continues counting even when tab is unfocused
      // (No special handling needed - setInterval continues in background)
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggle = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isRunning: !prevState.isRunning
    }))
  }, [])

  const reset = React.useCallback(() => {
    setState({
      currentTime: initialTime,
      isRunning: false,
      initialTime: initialTime,
      lastUpdateTime: Date.now()
    })
  }, [initialTime])

  return {
    ...state,
    toggle,
    reset
  }
}

/**
 * ScoreboardTimerContainer: Combines timer display and toggle control
 * 
 * Props:
 * - initialTime: Initial duration in seconds (default 600)
 * - className: Optional Tailwind classes for container
 * - onTimeUpdate: Optional callback on each tick
 */
export const ScoreboardTimerContainer: React.FC<
  ScoreboardTimerContainerProps
> = ({
  initialTime = 600,
  className = '',
  onTimeUpdate
}) => {
  const { currentTime, isRunning, toggle, reset } = useTimer(initialTime)

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

      {/* Info Text (Optional) */}
      <p className="text-xs text-slate-500 text-center mt-2">
        {isRunning
          ? 'Timer running'
          : currentTime === 0
            ? 'Time expired'
            : 'Click play to start'}
      </p>
    </div>
  )
}

ScoreboardTimerContainer.displayName = 'ScoreboardTimerContainer'
```

**Verify**:
```bash
npm run type-check
# Should pass with no errors
```

---

## Step 5: Integrate into Scorekeeping Page

### Update `src/app/scorekeeping/page.tsx`

```typescript
import React from 'react'
import { BlankScoreKeepingCanvas } from '@/components/scorekeeping/BlankScoreKeepingCanvas'
import { ScoreboardTimerContainer } from '@/components/scorekeeping/ScoreboardTimerContainer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scorekeeping | theStatsApp',
  description: 'Live scorekeeping canvas for basketball games'
}

export default function ScoreKeepingPage() {
  return (
    <main className="w-full h-screen bg-white flex flex-col items-center justify-start pt-8">
      {/* Timer at top */}
      <ScoreboardTimerContainer initialTime={600} />

      {/* Canvas below */}
      <div className="flex-1 w-full flex items-center justify-center">
        <BlankScoreKeepingCanvas />
      </div>
    </main>
  )
}
```

**Verify**:
```bash
npm run type-check
npm run lint
```

Both should pass with no errors.

---

## Step 6: Write Unit Tests

### Create `src/components/scorekeeping/__tests__/ScoreboardTimer.test.tsx`

```typescript
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScoreboardTimer } from '../ScoreboardTimer'

describe('ScoreboardTimer', () => {
  it('renders with initial time 10:00', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
      />
    )
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('displays time in MM:SS format', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={65}
        initialTime={600}
      />
    )
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('shows paused status when not running', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={300}
        initialTime={600}
      />
    )
    expect(screen.getByText('○ Paused')).toBeInTheDocument()
  })

  it('shows running status when active', () => {
    render(
      <ScoreboardTimer
        isRunning={true}
        currentTime={300}
        initialTime={600}
      />
    )
    expect(screen.getByText('● Running')).toBeInTheDocument()
  })

  it('shows expired status at 0:00', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={0}
        initialTime={600}
      />
    )
    expect(screen.getByText('● Expired')).toBeInTheDocument()
  })

  it('has semantic time element', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
      />
    )
    const timeElement = screen.getByRole('status')
    expect(timeElement).toBeInTheDocument()
    expect(timeElement.tagName).toBe('TIME')
  })

  it('has aria-live for screen reader announcements', () => {
    const { container } = render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
      />
    )
    const ariaLiveElement = container.querySelector('[aria-live="polite"]')
    expect(ariaLiveElement).toBeInTheDocument()
  })

  it('calls onTimeUpdate callback', () => {
    const mockCallback = jest.fn()
    const { rerender } = render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
        onTimeUpdate={mockCallback}
      />
    )
    expect(mockCallback).toHaveBeenCalledWith(600)

    rerender(
      <ScoreboardTimer
        isRunning={false}
        currentTime={300}
        initialTime={600}
        onTimeUpdate={mockCallback}
      />
    )
    expect(mockCallback).toHaveBeenCalledWith(300)
  })
})
```

### Create `src/components/scorekeeping/__tests__/TimerToggle.test.tsx`

```typescript
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerToggle } from '../TimerToggle'

describe('TimerToggle', () => {
  it('renders play button when not running', () => {
    render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
      />
    )
    const button = screen.getByRole('button', { name: /start timer/i })
    expect(button).toBeInTheDocument()
  })

  it('renders pause button when running', () => {
    render(
      <TimerToggle
        isRunning={true}
        onToggle={jest.fn()}
      />
    )
    const button = screen.getByRole('button', { name: /pause timer/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const mockToggle = jest.fn()
    render(
      <TimerToggle
        isRunning={false}
        onToggle={mockToggle}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when Enter key pressed', () => {
    const mockToggle = jest.fn()
    render(
      <TimerToggle
        isRunning={false}
        onToggle={mockToggle}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when Space key pressed', () => {
    const mockToggle = jest.fn()
    render(
      <TimerToggle
        isRunning={false}
        onToggle={mockToggle}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: ' ' })
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('has aria-pressed attribute matching isRunning state', () => {
    const { rerender } = render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
      />
    )
    let button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <TimerToggle
        isRunning={true}
        onToggle={jest.fn()}
      />
    )
    button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('button is disabled when prop is true', () => {
    render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
        disabled={true}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('minimum touch target size is 44px', () => {
    const { container } = render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
      />
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-12', 'w-12')
    // 12 * 4px (Tailwind unit) = 48px (exceeds 44px minimum)
  })
})
```

**Verify**:
```bash
npm test -- --testPathPattern="ScoreboardTimer|TimerToggle"
# All tests should pass ✅
```

---

## Step 7: Write E2E Tests

### Create/Update `tests/e2e/scorekeeping-page.spec.ts`

Add these test cases to the existing file:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Scorekeeping Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scorekeeping')
  })

  test('displays initial time 10:00', async ({ page }) => {
    const timer = page.getByText('10:00')
    await expect(timer).toBeVisible()
  })

  test('timer display is readable (large font)', async ({ page }) => {
    const timer = page.getByRole('status')
    const fontSize = await timer.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })
    const size = parseInt(fontSize)
    expect(size).toBeGreaterThanOrEqual(36) // at least 2.25rem
  })

  test('toggle button has minimum 44px touch target', async ({ page }) => {
    const button = page.getByRole('button', { name: /start timer/i })
    const size = await button.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    })
    expect(size.width).toBeGreaterThanOrEqual(44)
    expect(size.height).toBeGreaterThanOrEqual(44)
  })

  test('clicking play button starts timer', async ({ page }) => {
    const playButton = page.getByRole('button', { name: /start timer/i })
    await playButton.click()

    const pauseButton = page.getByRole('button', { name: /pause timer/i })
    await expect(pauseButton).toBeVisible()
  })

  test('timer counts down when running', async ({ page }) => {
    const playButton = page.getByRole('button', { name: /start timer/i })
    await playButton.click()

    // Initial time
    await expect(page.getByText('10:00')).toBeVisible()

    // Wait 2 seconds and check time decreased
    await page.waitForTimeout(2100)
    const displayedTime = await page.getByRole('status').textContent()
    expect(displayedTime).not.toBe('10:00')
  })

  test('keyboard navigation: Space key toggles timer', async ({ page }) => {
    const playButton = page.getByRole('button', { name: /start timer/i })
    await playButton.focus()
    await page.keyboard.press('Space')

    const pauseButton = page.getByRole('button', { name: /pause timer/i })
    await expect(pauseButton).toBeVisible()
  })

  test('keyboard navigation: Enter key toggles timer', async ({ page }) => {
    const playButton = page.getByRole('button', { name: /start timer/i })
    await playButton.focus()
    await page.keyboard.press('Enter')

    const pauseButton = page.getByRole('button', { name: /pause timer/i })
    await expect(pauseButton).toBeVisible()
  })

  test('responsive on mobile viewport (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    const timer = page.getByRole('status')
    await expect(timer).toBeVisible()
    const isInViewport = await timer.isVisible()
    expect(isInViewport).toBe(true)
  })

  test('responsive on desktop viewport (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    const timer = page.getByRole('status')
    await expect(timer).toBeVisible()
    const isInViewport = await timer.isVisible()
    expect(isInViewport).toBe(true)
  })

  test('no accessibility violations', async ({ page }) => {
    const accessibilityScan = await page.accessibility.snapshot()
    expect(accessibilityScan?.violations?.length || 0).toBe(0)
  })

  test('layout does not shift during countdown (CLS test)', async ({ page }) => {
    // Start timer
    const playButton = page.getByRole('button', { name: /start timer/i })
    await playButton.click()

    // Get initial position
    const timer = page.getByRole('status')
    const initialPosition = await timer.boundingBox()

    // Wait for countdown
    await page.waitForTimeout(3000)

    // Check position hasn't changed significantly
    const finalPosition = await timer.boundingBox()
    expect(finalPosition?.x).toBeCloseTo(initialPosition?.x || 0, 1)
    expect(finalPosition?.y).toBeCloseTo(initialPosition?.y || 0, 1)
  })
})
```

**Verify**:
```bash
npm run test:e2e -- --grep "Scorekeeping Timer"
# All tests should pass ✅
```

---

## Quality Checks

### TypeScript Strict Mode

```bash
npm run type-check
# Expected: ✅ No errors
```

### ESLint

```bash
npm run lint
# Expected: ✅ No errors
```

### Unit Tests

```bash
npm test
# Expected: ✅ All tests pass with >80% coverage
```

### E2E Tests

```bash
npm run test:e2e
# Expected: ✅ All tests pass
```

### Lighthouse Audit (Local)

```bash
npm run build
npm run start
# Visit http://localhost:3000/scorekeeping
# Run Lighthouse in DevTools → Expected Accessibility ≥ 90
```

### Browser Compatibility

Test on:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+
- ✅ Mobile Safari (iOS 17+)
- ✅ Chrome Android

---

## Troubleshooting

### Timer Not Counting

**Issue**: Timer display shows 10:00 but doesn't decrease.

**Solution**:
1. Verify `useTimer` hook has `useEffect` with `isRunning` dependency
2. Check `setInterval` is being set when `isRunning === true`
3. Inspect browser console for errors

### Toggle Button Not Responding

**Issue**: Clicking button doesn't pause/resume timer.

**Solution**:
1. Verify `onToggle` callback calls `setState` with `isRunning: !isRunning`
2. Check button is not `disabled={true}`
3. Verify click event is not being prevented

### Accessibility Test Failing

**Issue**: Screen reader not announcing time updates.

**Solution**:
1. Verify `aria-live="polite"` is on container div
2. Check `<time>` element has `role="status"` 
3. Verify `aria-label` is being updated dynamically

---

## Next Steps

1. ✅ Complete all steps above
2. Run full test suite: `npm test && npm run test:e2e`
3. Commit changes: `git add . && git commit -m "feat(004): implement scorekeeping timer"`
4. Push to branch: `git push origin 004-scorekeeping-timer`
5. Create pull request for code review

---

**Status**: ✅ Ready to implement  
**Estimated Duration**: 2.5–3 hours  
**Difficulty**: 🟢 Beginner-Friendly
