# Data Model: Scorekeeping Timer

**Feature**: 004-scorekeeping-timer  
**Version**: 1.0  
**Date**: 2026-04-13

---

## Overview

The timer component manages a simple countdown state: a single number representing elapsed seconds in a 10-minute quarter. The component is stateless from persistence (client-side only) and requires no database schema. All state is managed in React hooks during the session.

---

## Core Entities

### TimerState (Internal Component State)

Represents the complete runtime state of the countdown timer.

```typescript
interface TimerState {
  // Current time remaining in seconds (0-600)
  currentTime: number
  
  // Whether the timer is currently counting down
  isRunning: boolean
  
  // Initial duration in seconds (fixed at 600 for 10:00)
  initialTime: number
  
  // Timestamp of the last update (for accurate interval-based counting)
  lastUpdateTime: number
}
```

**Initialization**:
```typescript
const initialState: TimerState = {
  currentTime: 600,      // 10:00 on page load
  isRunning: false,      // Timer starts paused
  initialTime: 600,      // Fixed - not configurable in v1
  lastUpdateTime: Date.now()
}
```

**Constraints**:
- `currentTime`: Integer 0-600 (inclusive); no fractions
- `isRunning`: Boolean only
- `initialTime`: Always 600; immutable
- `lastUpdateTime`: UNIX timestamp (ms); updates on every state change

---

### ScoreboardTimerProps (Component Interface)

Props passed to the `<ScoreboardTimer />` component.

```typescript
interface ScoreboardTimerProps {
  // Initial duration in seconds (default: 600 for 10:00)
  // Fixed in v1; not user-configurable
  initialTime?: number
  
  // Current running state
  isRunning: boolean
  
  // Current time remaining in seconds
  currentTime: number
  
  // Optional callback fired on each timer tick (per second)
  onTimeUpdate?: (time: number) => void
  
  // Optional CSS class for container (for Tailwind styling)
  className?: string
}
```

**Example Usage**:
```typescript
<ScoreboardTimer
  initialTime={600}
  isRunning={timerRunning}
  currentTime={timeRemaining}
  onTimeUpdate={(time: number) => console.log(`${time}s remaining`)}
  className="py-4"
/>
```

---

### TimerToggleProps (Control Interface)

Props passed to the `<TimerToggle />` button component.

```typescript
interface TimerToggleProps {
  // Current state: true = counting down, false = paused
  isRunning: boolean
  
  // Callback when user clicks toggle or presses Enter/Space
  onToggle: () => void
  
  // Optional: disable the button (e.g., at time 0:00)
  disabled?: boolean
  
  // Optional: ARIA label for screen readers
  ariaLabel?: string
  
  // Optional: CSS class for styling
  className?: string
}
```

**Example Usage**:
```typescript
<TimerToggle
  isRunning={isRunning}
  onToggle={handleToggle}
  disabled={currentTime === 0}
  ariaLabel={isRunning ? "Pause timer" : "Start timer"}
/>
```

---

### FormattedTime (Display Value)

Utility object for displaying timer in MM:SS format.

```typescript
interface FormattedTime {
  // Minutes portion (0-99)
  minutes: number
  
  // Seconds portion (0-59)
  seconds: number
  
  // Formatted display string: "MM:SS"
  display: string
}
```

**Example Usage**:
```typescript
// Convert 65 seconds to FormattedTime
const formatted = formatTime(65)
// Result: { minutes: 1, seconds: 5, display: "01:05" }

// Display in JSX
<time dateTime={`PT${formatted.minutes}M${formatted.seconds}S`}>
  {formatted.display}
</time>
```

---

## State Transitions

### Timer Lifecycle

```
Initial (0:00.0)
    ↓
    └─→ isRunning = false
        [User presses Play]
        ↓
        → isRunning = true
        → currentTime decrements every 1000ms
        ↓
        [Timer reaches 0:00]
        ↓
        → isRunning = false (auto-stop)
        → currentTime = 0
        ↓
        [User presses reset OR reloads page]
        → currentTime = 600 (10:00)
        → isRunning = false
```

### State Change Rules

| Event | Input | Output | Side Effects |
|-------|-------|--------|--------------|
| **Initialize** | Page load | `currentTime=600, isRunning=false` | None |
| **User presses Play** | `currentTime > 0, isRunning=false` | `isRunning=true` | Start setInterval |
| **User presses Pause** | `isRunning=true` | `isRunning=false` | Clear setInterval |
| **Countdown tick** | 1000ms elapsed | `currentTime -= 1` | None |
| **Timer reaches 0** | `currentTime=0, isRunning=true` | `isRunning=false, currentTime=0` | Clear setInterval, optional sound |
| **Page loses focus** | Browser event `blur` | `isRunning` unchanged | Continue/pause logic unaffected |
| **Page gains focus** | Browser event `focus` | Resync currentTime | Recalculate from timestamp |
| **Page reload** | Browser refresh | `currentTime=600, isRunning=false` | Session state lost |

---

## Type Definitions (Complete TypeScript)

Add to `src/types/scorekeeping.types.ts`:

```typescript
/**
 * Timer state managed by the countdown component
 */
export interface TimerState {
  currentTime: number
  isRunning: boolean
  initialTime: number
  lastUpdateTime: number
}

/**
 * Props for ScoreboardTimer (display component)
 */
export interface ScoreboardTimerProps {
  initialTime?: number
  isRunning: boolean
  currentTime: number
  onTimeUpdate?: (time: number) => void
  className?: string
}

/**
 * Props for TimerToggle (button component)
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
 * Props for ScoreboardTimerContainer (parent component)
 * Combines timer display + toggle control
 */
export interface ScoreboardTimerContainerProps {
  initialTime?: number
  className?: string
  onTimeUpdate?: (time: number) => void
}
```

---

## Utility Functions

### formatTime(seconds: number): FormattedTime

Converts seconds to MM:SS display format.

```typescript
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

**Examples**:
- `formatTime(0)` → `{minutes: 0, seconds: 0, display: "00:00"}`
- `formatTime(600)` → `{minutes: 10, seconds: 0, display: "10:00"}`
- `formatTime(65)` → `{minutes: 1, seconds: 5, display: "01:05"}`

---

## Validation Rules

### Timer Value Constraints

| Field | Valid Range | Invalid | Action |
|-------|-------------|---------|--------|
| `currentTime` | 0–600 | < 0, > 600 | Clamp to range |
| `initialTime` | 600 | Other values | Reject; use 600 |
| `isRunning` | true \| false | Any other | Only toggle |
| `minutes` (display) | 0–99 | Negative | Floor to 0 |
| `seconds` (display) | 0–59 | Negative or ≥ 60 | Modulo 60 |

### Input Validation

```typescript
// Validate timer state
function isValidTimerState(state: Partial<TimerState>): boolean {
  return (
    typeof state.currentTime === 'number' &&
    state.currentTime >= 0 &&
    state.currentTime <= 600 &&
    typeof state.isRunning === 'boolean'
  )
}
```

---

## No Persistence Layer (v1)

**Important**: The timer has no backend storage in v1.

- Timer state exists only in React component state
- State is lost on page reload (by design - user expectation is to reset clock on reload)
- No localStorage, sessionStorage, or database queries
- Future versions may persist timer state for advanced features

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-13 | Initial data model; 4 core interfaces; formatTime utility |

---

**Status**: ✅ Ready for Phase 2 implementation
