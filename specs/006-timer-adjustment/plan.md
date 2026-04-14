# Feature 006: Timer Adjustment Controls - Implementation Plan

**Feature Branch**: `006-timer-adjustment`  
**Status**: Planning Phase  
**Date**: 2026-04-14  
**Planning Completed**: Based on clarified specification and existing Feature 004 architecture

---

## Executive Summary

Feature 006 adds timer adjustment arrows to the existing Feature 004 Scorekeeping Timer. Users can increment/decrement minutes (left arrows) and seconds (right arrows) when the timer is paused. Implementation extends the existing `useTimer` hook with adjustment methods and adds a reusable `ArrowButton` component.

**Key Design Decision**: Single reusable `ArrowButton` component used on both sides of timer (minutes left, seconds right). Integrated within existing `ScoreboardTimerContainer` component for minimal disruption.

---

## Constitutional Compliance Check

Verifying Feature 006 against project constitution (6 principles):

### ✅ Principle I: User-Centric Design
- Intuitive up/down arrow buttons adjacent to timer display
- Clear visual grouping (left = minutes, right = seconds)
- Disabled state when timer running (prevents accidental adjustments during play)
- 44px+ touch targets meet mobile accessibility requirements

### ✅ Principle II: Robust Architecture
- Extends existing `useTimer` hook without breaking changes (backward compatible)
- Stateless `ArrowButton` component (pure function, single responsibility)
- Type-safe with TypeScript strict mode
- Proper error boundaries (cannot go negative, cannot exceed 59:59)

### ✅ Principle III: Accessibility First
- Keyboard navigation: Tab through arrow buttons, Enter/Space to activate
- ARIA labels: aria-label "Increment minutes" / "Decrement minutes" / etc.
- Semantic HTML: `<button>` elements with proper roles
- Touch: 44px+ minimum on mobile
- Color contrast: 4.5:1 (visual distinct from running/paused state)
- Screen reader: Announces unit being adjusted (minutes/seconds)

### ✅ Principle IV: Quality & Testing
- Unit tests for ArrowButton component (enabled/disabled states, click handlers)
- Unit tests for useTimer adjustments (increment/decrement logic, boundaries)
- E2E tests for keyboard navigation, responsive layout, accessibility
- 100% coverage of critical paths (boundary conditions, state changes)

### ✅ Principle V: Performance & Reliability
- No layout shift when buttons enabled/disabled (flexbox layout)
- Instant time updates (no animation delay)
- No additional network requests (client-side only)
- No memory leaks (proper cleanup of event listeners)

### ✅ Principle VI: Maintainability & Documentation
- Self-documenting component names (`ArrowButton`, `incrementMinutes`, `decrementSeconds`)
- JSDoc comments on all public functions
- Clear prop interfaces with required/optional annotations
- Consistent with Feature 004 code style and patterns

**Result**: ✅ **All 6 principles passing** - Feature 006 maintains project constitution compliance.

---

## Technical Architecture

### Component Hierarchy

```
ScoreboardTimerContainer (extended)
├─ Left Arrow Controls (Minutes)
│  ├─ ArrowButton (up arrow, increment minutes)
│  └─ ArrowButton (down arrow, decrement minutes)
├─ ScoreboardTimer (display, unchanged)
├─ TimerToggle (play/pause, unchanged)
└─ Right Arrow Controls (Seconds)
   ├─ ArrowButton (up arrow, increment seconds)
   └─ ArrowButton (down arrow, decrement seconds)
```

### Layout Structure (Tailwind CSS)

```
┌─────────────────────────────────────┐
│   ▲       ▲                        ▲  ▲
│  MIN    (empty)              SEC   ▼  ▼
│   ▼                                   
│
│       10:00 ● Running
│
│        ⏸ (pause button)
│
└─────────────────────────────────────┘

Responsive:
- Mobile (320px): Vertical stack, smaller buttons
- Tablet (768px): Horizontal, medium buttons
- Desktop (1920px): Horizontal, larger buttons
```

### State Management

```typescript
// Extended useTimer hook maintains:
TimerState {
  currentTime: number       // 0-3600 (0:00 to 59:00)
  isRunning: boolean        // true | false
  initialTime: number       // original duration
  lastUpdateTime: number    // timestamp of last change
}

// New methods added to useTimer:
{
  incrementMinutes: () => void      // +1 minute, capped at 59
  decrementMinutes: () => void      // -1 minute, floored at 0
  incrementSeconds: () => void      // +1 second, wraps at 60
  decrementSeconds: () => void      // -1 second, floored at 0
  setTime: (minutes: number, seconds: number) => void  // direct set
}
```

---

## Implementation Components

### 1. ArrowButton Component (New)

**File**: `src/components/scorekeeping/ArrowButton.tsx`

```typescript
interface ArrowButtonProps {
  direction: 'up' | 'down'
  unit: 'minutes' | 'seconds'
  onClick: () => void
  disabled: boolean
  className?: string
}

export const ArrowButton: React.FC<ArrowButtonProps> = ({ 
  direction, 
  unit, 
  onClick, 
  disabled, 
  className 
}) => {
  // Renders: <button>▲</button> or <button>▼</button>
  // ARIA: aria-label="Increment minutes" | "Decrement minutes" | etc.
  // Tailwind: h-12 w-12 md:h-14 md:w-14, hover/focus states, disabled:opacity-50
}
```

**Responsibilities**:
- Display up/down arrow icon
- Handle click events
- Apply disabled state styling
- Provide ARIA labels for screen readers
- Keyboard accessible (Tab, Enter, Space)

### 2. Extended useTimer Hook (Modified)

**File**: `src/components/scorekeeping/ScoreboardTimerContainer.tsx` (extended)

```typescript
function useTimer(initialTime: number = 600) {
  const [state, setState] = React.useState<TimerState>(() => ({...}))
  
  // New methods for adjustment:
  const incrementMinutes = React.useCallback(() => {
    setState(prev => {
      const newMinutes = Math.min(prev.currentTime + 60, 3600) // max 60 minutes
      return { ...prev, currentTime: newMinutes }
    })
  }, [])
  
  const decrementMinutes = React.useCallback(() => {
    setState(prev => {
      const newSeconds = Math.max(prev.currentTime - 60, 0) // min 0:00
      return { ...prev, currentTime: newSeconds }
    })
  }, [])
  
  const incrementSeconds = React.useCallback(() => {
    setState(prev => {
      const newSeconds = prev.currentTime + 1
      return { ...prev, currentTime: newSeconds }
    })
  }, [])
  
  const decrementSeconds = React.useCallback(() => {
    setState(prev => {
      const newSeconds = Math.max(prev.currentTime - 1, 0)
      return { ...prev, currentTime: newSeconds }
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
```

**Boundary Logic**:
- Minutes: 0-59 range, capped at 59 (59*60 = 3540 seconds)
- Seconds: 0-59 range within minute boundaries
- Absolute minimum: 0:00 (cannot go negative)
- Absolute maximum: 59:59 (3599 seconds)

### 3. Updated ScoreboardTimerContainer (Modified)

**File**: `src/components/scorekeeping/ScoreboardTimerContainer.tsx`

Layout change from vertical to horizontal with arrows:

```tsx
<div role="region" aria-label="Game timer control">
  <div className="flex items-center justify-center gap-4 md:gap-6">
    {/* Left Arrow Controls - Minutes */}
    <div className="flex flex-col gap-2 items-center">
      <ArrowButton
        direction="up"
        unit="minutes"
        onClick={incrementMinutes}
        disabled={isRunning || currentTime >= 3540}
      />
      <div className="text-xs text-slate-600 font-semibold">MIN</div>
      <ArrowButton
        direction="down"
        unit="minutes"
        onClick={decrementMinutes}
        disabled={isRunning || currentTime < 60}
      />
    </div>

    {/* Timer Display & Toggle (vertical flex) */}
    <div className="flex flex-col items-center gap-4">
      <ScoreboardTimer {...props} />
      <TimerToggle {...props} />
    </div>

    {/* Right Arrow Controls - Seconds */}
    <div className="flex flex-col gap-2 items-center">
      <ArrowButton
        direction="up"
        unit="seconds"
        onClick={incrementSeconds}
        disabled={isRunning || currentTime >= 3599}
      />
      <div className="text-xs text-slate-600 font-semibold">SEC</div>
      <ArrowButton
        direction="down"
        unit="seconds"
        onClick={decrementSeconds}
        disabled={isRunning || currentTime === 0}
      />
    </div>
  </div>
</div>
```

**Disabled Logic**:
- All arrows disabled when `isRunning === true`
- Up arrow disabled at upper boundary (59:59)
- Down arrow disabled at lower boundary (00:00)
- Minute up disabled when >= 59:00 (3540 sec)
- Minute down disabled when < 1:00 (60 sec)
- Second up disabled when >= 59:59 (3599 sec)
- Second down disabled when at 0:00 (0 sec)

### 4. Type Updates (Modified)

**File**: `src/types/scorekeeping.types.ts`

```typescript
// Add ArrowButtonProps interface
export interface ArrowButtonProps {
  direction: 'up' | 'down'
  unit: 'minutes' | 'seconds'
  onClick: () => void
  disabled: boolean
  className?: string
}

// Extend useTimer return type (internal, not exported)
interface UseTimerReturn extends TimerState {
  toggle: () => void
  reset: () => void
  incrementMinutes: () => void
  decrementMinutes: () => void
  incrementSeconds: () => void
  decrementSeconds: () => void
}

// No changes needed to ScoreboardTimerContainerProps (backward compatible)
```

---

## Integration Points

### With Feature 004 (Scorekeeping Timer)

- ✅ Extends `useTimer` hook (backward compatible)
- ✅ Wraps `ScoreboardTimer` and `TimerToggle` (no changes to child components)
- ✅ Uses same styling patterns (Tailwind CSS, responsive breakpoints)
- ✅ Uses same accessibility patterns (ARIA labels, semantic HTML)
- ✅ Maintains existing timer functionality (play/pause, countdown, boundaries)

### Data Flow

```
ScoreboardTimerContainer
├─ state: TimerState
├─ methods: toggle, reset, increment*, decrement*
└─ Children receive:
   ├─ ScoreboardTimer: (currentTime, isRunning, initialTime)
   ├─ TimerToggle: (isRunning, onToggle)
   └─ ArrowButtons: (onClick handler, disabled state, unit, direction)
```

---

## Testing Strategy

### Unit Tests (Phase 1)

**Test File**: `src/components/scorekeeping/__tests__/ArrowButton.test.tsx`

1. Renders up/down arrow icons
2. Calls onClick when clicked
3. Disables when disabled prop is true
4. Sets aria-label for unit and direction
5. Keyboard accessible (Enter, Space)
6. Touch target >= 44px

**Test File**: `src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx` (extended)

1. Renders arrow buttons on sides of timer
2. Up arrow increments by 1 unit (minutes/seconds)
3. Down arrow decrements by 1 unit
4. Arrows disabled when timer running
5. Minute up disabled at 59:xx
6. Minute down disabled at 00:xx
7. Second up disabled at 59:99
8. Second down disabled at 00:00
9. Independent adjustment (minutes ≠ seconds)
10. Boundary conditions (cannot go negative, cannot exceed max)

### E2E Tests (Phase 2)

**Test File**: `tests/e2e/scorekeeping-adjustment.spec.ts` (new)

1. Display: Arrows visible on both sides of timer
2. Interaction: Click up/down arrows, verify time changes
3. Boundaries: Try to exceed 59:59, stays at max
4. Boundaries: Try to go below 00:00, stays at min
5. State: Arrows disabled when timer running
6. State: Arrows enabled when timer paused
7. Keyboard: Tab to arrows, Enter/Space to activate
8. Responsive: 320px mobile, 768px tablet, 1920px desktop
9. Accessibility: Focus visible, ARIA labels read by screen reader
10. Integration: Pause timer, adjust, start timer (starts from adjusted time)

### Coverage Targets

- ✅ Critical paths: 100% (boundary conditions, state transitions)
- ✅ Component rendering: 100% (all prop combinations)
- ✅ User flows: 100% (adjust minutes, adjust seconds, pause/resume)

---

## Acceptance Criteria

Implementation is complete when:

1. ✅ ArrowButton component created (reusable, Tailwind styled)
2. ✅ useTimer hook extended with increment/decrement methods
3. ✅ ScoreboardTimerContainer updated with horizontal arrow layout
4. ✅ Arrow buttons positioned left (minutes) and right (seconds)
5. ✅ Arrows disabled when timer running
6. ✅ Arrows disabled at boundaries (00:00 min, 59:59 max)
7. ✅ Minute arrows increment/decrement by 1 minute
8. ✅ Second arrows increment/decrement by 1 second
9. ✅ All unit tests passing (ArrowButton + useTimer extensions)
10. ✅ All E2E tests passing (display, interaction, boundaries, responsive)
11. ✅ TypeScript strict mode passing (0 errors)
12. ✅ ESLint clean (0 errors on new components)
13. ✅ Keyboard accessible (Tab, Enter, Space)
14. ✅ Touch targets >= 44px on mobile
15. ✅ ARIA labels present (aria-label, aria-disabled)
16. ✅ Integration with Feature 004 verified (no regression)

---

## Risk Assessment & Mitigations

### Risk 1: State Mutation Edge Cases
**Risk**: Rapid clicks could cause out-of-sync state or boundary violations  
**Mitigation**: Use React.useCallback for all adjustment methods; ensure each operation is atomic; test with rapid consecutive clicks

### Risk 2: Layout Shift on Arrow Button Visibility
**Risk**: Disabling arrows might shift layout, causing CLS (Cumulative Layout Shift)  
**Mitigation**: Use fixed sizing with Tailwind (h-12 w-12, md:h-14 md:w-14); replace button text with opacity change, not visibility toggle

### Risk 3: Mobile Responsive Layout Issues
**Risk**: Arrow buttons might overflow or overlap on small screens  
**Mitigation**: Design with mobile-first approach; test on 320px, 480px, 768px viewports; use gap and flex-wrap as needed

### Risk 4: Accessibility Compliance
**Risk**: Screen reader users might not understand up/down arrow buttons without labels  
**Mitigation**: Use semantic `<button>` elements; include aria-label with unit and direction; test with actual screen readers (NVDA, JAWS, VoiceOver)

---

## File Structure

```
frontend/web/src/
├── components/scorekeeping/
│   ├── ArrowButton.tsx                          [NEW: 50-70 lines]
│   ├── ScoreboardTimerContainer.tsx             [MODIFIED: +80 lines]
│   ├── __tests__/
│   │   ├── ArrowButton.test.tsx                 [NEW: 100+ lines]
│   │   └── ScoreboardTimerContainer.test.tsx    [MODIFIED: +100 lines]
│   ├── ScoreboardTimer.tsx                      [unchanged]
│   └── TimerToggle.tsx                          [unchanged]
├── types/
│   └── scorekeeping.types.ts                    [MODIFIED: +15 lines for ArrowButtonProps]
└── app/scorekeeping/
    └── page.tsx                                 [unchanged]

tests/e2e/
└── scorekeeping-adjustment.spec.ts              [NEW: 200+ lines]
```

---

## Implementation Schedule

**Estimated Total Time**: 4-6 hours

| Phase | Task | Estimated Time | Status |
|-------|------|-----------------|--------|
| 1 | Add ArrowButtonProps to types | 15 min | ⏳ Pending |
| 2 | Create ArrowButton component | 45 min | ⏳ Pending |
| 3 | Write ArrowButton unit tests | 1 hour | ⏳ Pending |
| 4 | Extend useTimer hook methods | 1 hour | ⏳ Pending |
| 5 | Update ScoreboardTimerContainer layout | 1.5 hours | ⏳ Pending |
| 6 | Update container unit tests | 1 hour | ⏳ Pending |
| 7 | Create E2E test suite | 2 hours | ⏳ Pending |
| 8 | Integration testing & bug fixes | 1 hour | ⏳ Pending |
| **Total** | | **8-9 hours** | ⏳ Pending |

**Optimization**: Could reduce by running tests in parallel and using TDD (tests guide implementation).

---

## Known Dependencies

- React 19.x (hooks: useState, useCallback, useRef, useEffect)
- TypeScript 5.x (strict mode)
- Tailwind CSS 4.x (responsive utilities, button styling)
- Jest + React Testing Library (unit tests)
- Playwright (E2E tests)
- Feature 004 (Scorekeeping Timer) - already implemented and deployed

---

## Success Metrics

Upon completion, Feature 006 will enable:

✅ **User Capability**: Adjust game timer to desired duration before play without manual entry  
✅ **Code Quality**: All tests passing, TypeScript strict, ESLint clean, accessibility compliant  
✅ **Performance**: Instant time updates, no layout shift, no network requests  
✅ **Maintainability**: Self-documenting code, consistent with Feature 004 patterns  
✅ **User Experience**: Intuitive controls, responsive design, fully accessible

---

## Next Phase

Upon approval of this plan:
1. Commit plan to git: `git commit -m "plan(006): implement timer adjustment controls"`
2. Proceed to **Task Breaking** phase (`/speckit.tasks`)
3. Generate 30-40 granular TDD-first tasks
4. Begin implementation in next session

---

**Planning Phase Complete**: ✅ READY FOR TASK GENERATION
