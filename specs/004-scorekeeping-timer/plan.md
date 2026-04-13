# Implementation Plan: Scorekeeping Timer

**Branch**: `004-scorekeeping-timer` | **Date**: 2026-04-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-scorekeeping-timer/spec.md`

## Summary

Implement a countdown timer component for the basketball game scorekeeping interface. The timer displays at the top-center of the scorekeeping canvas in MM:SS format (initial display: 10:00 for standard quarter), with a start/stop toggle switch. The component must be keyboard accessible, responsive across all devices (320px-1920px), and maintain WCAG 2.1 AA accessibility compliance.

**Implementation Approach**: Build a reusable `ScoreboardTimer` React component that will be integrated as a child of or sibling to the existing `BlankScoreKeepingCanvas` component on the `/scorekeeping` page. The timer will use React hooks for state management (running/stopped, current time) and setInterval for countdown logic. A companion `TimerToggle` button component provides play/pause control with keyboard accessibility via Enter/Space keys.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode, no `any` types)  
**Primary Dependencies**: React 19.x, Next.js 16.x, Tailwind CSS 4.x  
**Storage**: None (client-side state only; no persistence in v1)  
**Testing**: Jest + React Testing Library (unit tests), Playwright (E2E tests)  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge); mobile-first responsive  
**Project Type**: Web application (React/Next.js SPA)  
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals), Page load < 1s  
**Constraints**: No layout shift during countdown (CLS < 0.05), accurate countdown (±0.1s over 10 minutes), debounce toggle to prevent double-clicks  
**Scale/Scope**: Single timer component, 2 main components (Timer display + Toggle control), ~200 LOC component code, ~300 LOC tests

## Constitution Check

**Mandatory Gates** (all MUST pass before Phase 0 research):

| Principle | Check | Status | Notes |
|-----------|-------|--------|-------|
| **I. Component-Driven** | Timer built as reusable React component with clear props? | ✅ PASS | Component receives initialTime, onToggle callback; has single responsibility |
| **II. Type Safety** | All TypeScript code in strict mode? All functions typed? | ✅ PASS | Requires strict: true in tsconfig; all component props/returns typed; no `any` |
| **III. Test-Driven Dev** | Tests written before implementation? Unit + E2E required? | ✅ PASS | Will write tests in Phase 1 (TDD: tests first, then code) |
| **IV. API Contracts** | No backend APIs required (client-side only)? | ✅ N/A | Timer is client-side; no API contracts needed in v1 |
| **V. Performance & A11y** | WCAG 2.1 AA compliance + Core Web Vitals targets? | ✅ PASS | Keyboard accessible (Tab, Enter/Space), ARIA labels required, no layout shift |
| **VI. Dependency Mgmt** | Only use existing dependencies (React, Next, Tailwind)? | ✅ PASS | No new npm packages; leverages existing project stack |

**Result**: ✅ All gates PASS. No violations. Feature complies with Constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/004-scorekeeping-timer/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 research (TBD if needed)
├── data-model.md        # Phase 1 design (component types, state shape)
├── quickstart.md        # Phase 1 quickstart (step-by-step implementation guide)
├── contracts/           # Phase 1 (N/A for v1 - no API contracts)
│   └── README.md        # Explains no contracts needed in v1
├── spec.md              # Feature specification (requirements)
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 task breakdown (TBD)
```

### Source Code (frontend/web repository)

**Option Selected**: Web Application (Next.js + React + TypeScript)

```text
src/
├── components/
│   ├── scorekeeping/
│   │   ├── BlankScoreKeepingCanvas.tsx    # Existing from Feature 003
│   │   ├── ScoreboardTimer.tsx            # NEW: Timer display component
│   │   ├── TimerToggle.tsx                # NEW: Play/pause button control
│   │   └── __tests__/
│   │       ├── ScoreboardTimer.test.tsx   # NEW: Unit tests for timer
│   │       └── TimerToggle.test.tsx       # NEW: Unit tests for toggle
│   └── [other components...]
├── types/
│   └── scorekeeping.types.ts              # Existing from Feature 003
│       # Will add: TimerProps, TimerState interfaces
├── app/
│   └── scorekeeping/
│       └── page.tsx                        # Existing from Feature 003
│           # Integration: Add <ScoreboardTimer /> to layout
└── [other directories...]

tests/
├── e2e/
│   ├── scorekeeping-page.spec.ts          # Existing from Feature 003
│   # Will add: TimerToggle test cases, responsive tests
└── [other tests...]
```

**Structure Decision**: Extend the existing `/scorekeeping` page by adding two new React components (`ScoreboardTimer` and `TimerToggle`) to the scorekeeping canvas. Components will be co-located in `src/components/scorekeeping/` directory alongside existing canvas component. Tests will follow existing patterns (Jest unit tests in `__tests__/`, E2E in `tests/e2e/`).

## Complexity Tracking

**Feature Complexity**: ⭐⭐☆☆☆ (Low) — Single countdown timer with toggle control

**No Constitutional Violations** - complexity tracking not required. All gates pass; design is simple and maintainable.

---

## Phase 0: Research & Clarification

**Status**: ✅ COMPLETE (no research needed)

**Resolved Clarifications** (from clarification session 2026-04-13):
1. Timer duration: Fixed to 10:00 (not user-configurable in v1)
2. Initial display: 10:00 on page load
3. Page focus: Running timer continues counting when tab loses focus

**No Open Questions**: All ambiguities from spec resolved. Technical context is clear. Ready to proceed to Phase 1 Design.

---

## Phase 1: Design & Contracts

### 1.1 Component Design

**Primary Components**:

1. **ScoreboardTimer** (Display Component)
   - Props: `initialTime: number` (seconds, default 600 = 10:00), `isRunning: boolean`, `currentTime: number`
   - State: `currentTime: number`, `isRunning: boolean`
   - Renders: MM:SS formatted time display, large legible font (24px+)
   - Styling: Tailwind utility classes, centered at top of canvas
   - Accessibility: ARIA labels, semantic time element

2. **TimerToggle** (Control Component)
   - Props: `isRunning: boolean`, `onToggle: () => void`, `disabled?: boolean`
   - Renders: "Play" or "Pause" icon button, 44px+ touch target
   - Accessibility: Keyboard focusable (Tab), Enter/Space to activate, aria-label
   - Styling: Tailwind icon classes, centered below timer

3. **useScoringTimer** (Custom Hook)
   - Purpose: Encapsulate timer countdown logic
   - Returns: `{ currentTime, isRunning, toggle, reset }`
   - Logic: Handle setInterval, page focus loss, accurate countdown

### 1.2 Data Model

**TypeScript Interfaces** (in `src/types/scorekeeping.types.ts`):

```typescript
// Timer state interface
interface TimerState {
  currentTime: number        // Current time in seconds
  isRunning: boolean         // Is timer counting down?
  initialTime: number        // Initial duration in seconds (600 for 10:00)
  lastUpdateTime: number     // Timestamp of last update (for accurate counting)
}

// Timer props interface
interface ScoreboardTimerProps {
  initialTime?: number       // Initial duration, default 600 (10:00)
  isRunning: boolean         // Is timer running?
  currentTime: number        // Current time in seconds
  onTimeUpdate?: (time: number) => void  // Callback on each tick
}

// Toggle props interface
interface TimerToggleProps {
  isRunning: boolean         // Current running state
  onToggle: () => void       // Callback when user clicks toggle
  disabled?: boolean         // Disable toggle (optional)
  ariaLabel?: string         // ARIA label (optional)
}

// Formatted timer display
interface FormattedTime {
  minutes: number            // 0-99
  seconds: number            // 0-59
  display: string            // MM:SS format string
}
```

### 1.3 Component Contracts

**No API contracts** (v1 is client-side only). See `contracts/README.md` for future extensibility.

### 1.4 Integration Points

- **Parent**: `BlankScoreKeepingCanvas` (existing component on Feature 003)
- **Integration**: Add `ScoreboardTimer` and `TimerToggle` as children within canvas
- **Layout**: Timer at top-center, toggle control below timer
- **State Management**: Use React hooks locally; no Redux/state library needed for v1

## Quality Gates (Phase 1 Outputs)

The following documents will be generated as part of Phase 1:

1. **data-model.md** — TypeScript interfaces, state shapes, entity relationships
2. **quickstart.md** — Step-by-step implementation guide with code examples
3. **contracts/README.md** — Explains why no API contracts in v1
