# Tasks: Timer Adjustment Controls (Feature 006)

**Feature Branch**: `006-timer-adjustment`  
**Created**: 2026-04-14  
**Status**: Task breakdown generated  
**Total Tasks**: 42 granular tasks across 9 phases  
**Methodology**: TDD-First (tests written before implementation)

---

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[ ]**: Checkbox (unchecked when pending)
- **[ID]**: Sequential identifier (T001, T002, etc.)
- **[P]**: Optional - can run in parallel (different files, no dependencies)
- **[Story]**: Optional - which user story (US1, US2, US3, US4)
- **File Path**: Exact location for implementation or test

## Parallel Execution Notes

Most tasks marked with **[P]** can run in parallel:
- Type definitions can be added simultaneously
- Components can be developed independently
- Tests can be written in parallel (before implementation)
- E2E tests can be created while unit tests run

---

## Phase 1: Setup & Type Definitions

**Goal**: Prepare project structure and type system for implementation  
**Status**: ⏳ Ready to start

- [ ] T001 Add ArrowButtonProps interface to src/types/scorekeeping.types.ts
  - Description: Define TypeScript interface with direction ('up'|'down'), unit ('minutes'|'seconds'), onClick, disabled, className props
  - Location: src/types/scorekeeping.types.ts (after TimerToggleProps)

- [ ] T002 [P] Create constants file for timer boundaries in src/constants/timer.ts
  - Description: Define MAX_MINUTES=59, MAX_SECONDS=59, MIN_TIME=0, SECONDS_PER_MINUTE=60
  - Location: src/constants/timer.ts (new file)

- [ ] T003 [P] Verify TypeScript types pass type-check
  - Command: `npm run type-check`
  - Verify: 0 errors, ArrowButtonProps interface recognized

---

## Phase 2: Foundational Components (Blocking Prerequisites)

**Goal**: Create reusable ArrowButton component and extend useTimer hook  
**Status**: ⏳ Ready to start  
**⚠️ CRITICAL**: Must complete before user story implementation

- [ ] T004 Create ArrowButton component skeleton in src/components/scorekeeping/ArrowButton.tsx
  - Description: Create React FC with ArrowButtonProps interface, basic button element
  - Location: src/components/scorekeeping/ArrowButton.tsx (new file, ~50 lines)
  - Template: TypeScript FC, JSDoc comments, export default

- [ ] T005 [P] Implement ArrowButton arrow icon rendering (up/down Unicode symbols)
  - Description: Render ▲ (U+25B2) for up, ▼ (U+25BC) for down based on direction prop
  - Location: src/components/scorekeeping/ArrowButton.tsx
  - Details: Use semantic `<button>` element, role attributes

- [ ] T006 [P] Implement ArrowButton Tailwind styling (responsive, hover, disabled states)
  - Description: Apply h-12 w-12 md:h-14 md:w-14, hover:bg-slate-200, disabled:opacity-50, focus:outline-2
  - Location: src/components/scorekeeping/ArrowButton.tsx
  - Responsive: Mobile (48px), Desktop (56px), Touch-friendly

- [ ] T007 [P] Add ArrowButton ARIA labels and accessibility attributes
  - Description: Add aria-label (e.g., "Increment minutes"), aria-pressed=false, role="button"
  - Location: src/components/scorekeeping/ArrowButton.tsx
  - Screen Reader: Announces "Increment minutes" / "Decrement seconds" etc.

- [ ] T008 [P] Add ArrowButton keyboard support (Enter/Space key handlers)
  - Description: Add onKeyDown handler to trigger onClick on Enter (13) or Space (32) keys
  - Location: src/components/scorekeeping/ArrowButton.tsx
  - Test: Keyboard navigation should work same as mouse click

- [ ] T009 Create unit test file for ArrowButton in src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Description: Setup Jest test file with render, screen, fireEvent imports
  - Location: src/components/scorekeeping/__tests__/ArrowButton.test.tsx (new file)
  - Framework: React Testing Library, act() for state updates

---

## Phase 2B: useTimer Hook Extensions

**Goal**: Extend useTimer hook with minute/second adjustment methods  
**Dependency**: Phase 1 (types ready)

- [ ] T010 [P] Add incrementMinutes method to useTimer hook
  - Description: Add useCallback that increments currentTime by 60 seconds, capped at 59:59 (3599 sec)
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Logic: Math.min(currentTime + 60, 3599), update state
  - Boundary: Cannot exceed 59:59

- [ ] T011 [P] Add decrementMinutes method to useTimer hook
  - Description: Add useCallback that decrements currentTime by 60 seconds, floored at 00:00
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Logic: Math.max(currentTime - 60, 0), update state
  - Boundary: Cannot go below 00:00

- [ ] T012 [P] Add incrementSeconds method to useTimer hook
  - Description: Add useCallback that increments currentTime by 1 second, wraps at 60
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Logic: Add Math.min(currentTime + 1, 3599) or handle wrap (10:59 + 1 = 10:00)
  - Boundary: Cannot exceed 59:59

- [ ] T013 [P] Add decrementSeconds method to useTimer hook
  - Description: Add useCallback that decrements currentTime by 1 second, floored at 00:00
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Logic: Math.max(currentTime - 1, 0), update state
  - Boundary: Cannot go below 00:00

- [ ] T014 [P] Export adjustment methods from useTimer hook return object
  - Description: Return { ...state, toggle, reset, incrementMinutes, decrementMinutes, incrementSeconds, decrementSeconds }
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (useTimer return statement)
  - Verify: Methods accessible to component via destructuring

- [ ] T015 Verify hook methods pass TypeScript strict mode
  - Command: `npm run type-check`
  - Verify: No errors on new useTimer methods

---

## Phase 3: ArrowButton Unit Tests

**Goal**: Write and pass comprehensive tests for ArrowButton component  
**Dependency**: Phase 2 (ArrowButton component created)

- [ ] T016 [P] Test T-ArrowButton renders up arrow when direction="up"
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: render(<ArrowButton direction="up" ... />), expect(screen.getByText('▲'))

- [ ] T017 [P] Test T-ArrowButton renders down arrow when direction="down"
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: render(<ArrowButton direction="down" ... />), expect(screen.getByText('▼'))

- [ ] T018 [P] Test T-ArrowButton calls onClick when clicked
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: Mock onClick, fireEvent.click(button), expect(onClick).toHaveBeenCalled()

- [ ] T019 [P] Test T-ArrowButton is disabled when disabled=true
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: render with disabled=true, button has disabled attribute, opacity-50 class

- [ ] T020 [P] Test T-ArrowButton aria-label reflects unit and direction
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: For unit="minutes" direction="up", aria-label="Increment minutes"
  - Test: For unit="seconds" direction="down", aria-label="Decrement seconds"

- [ ] T021 [P] Test T-ArrowButton keyboard activation (Enter key)
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: Mock onClick, fireEvent.keyDown(button, { key: 'Enter' }), expect(onClick)

- [ ] T022 [P] Test T-ArrowButton keyboard activation (Space key)
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: Mock onClick, fireEvent.keyDown(button, { key: ' ' }), expect(onClick)

- [ ] T023 [P] Test T-ArrowButton touch target size >= 44px
  - File: src/components/scorekeeping/__tests__/ArrowButton.test.tsx
  - Test: Check button has h-12 w-12 (48px) or md:h-14 md:w-14 (56px) classes

---

## Phase 4: useTimer Extension Unit Tests

**Goal**: Write and pass tests for useTimer adjustment methods  
**Dependency**: Phase 2B (useTimer methods implemented)

- [ ] T024 [P] Test T-useTimer incrementMinutes increases time by 1 minute
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 10:00, call incrementMinutes(), expect currentTime === 11:00 (660 sec)

- [ ] T025 [P] Test T-useTimer decrementMinutes decreases time by 1 minute
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 10:00, call decrementMinutes(), expect currentTime === 09:00 (540 sec)

- [ ] T026 [P] Test T-useTimer incrementSeconds increases time by 1 second
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 10:00, call incrementSeconds(), expect currentTime === 10:01 (601 sec)

- [ ] T027 [P] Test T-useTimer decrementSeconds decreases time by 1 second
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 10:00, call decrementSeconds(), expect currentTime === 09:59 (599 sec)

- [ ] T028 [P] Test T-useTimer incrementMinutes capped at 59 minutes (59:59 = 3599 sec)
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 59:45, call incrementMinutes(), expect stays at 59:59 (3599 sec)

- [ ] T029 [P] Test T-useTimer decrementMinutes floored at 00:00
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 00:30, call decrementMinutes(), expect stays at 00:00 (0 sec)

- [ ] T030 [P] Test T-useTimer incrementSeconds wrapped/capped at boundaries
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 10:59, call incrementSeconds(), expect 10:00 (wrap) or 59:59 (cap)

- [ ] T031 [P] Test T-useTimer decrementSeconds floored at 00:00
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: useTimer at 00:00, call decrementSeconds(), expect stays at 00:00 (0 sec)

- [ ] T032 [P] Test T-useTimer minute and second adjustment independent
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: start 10:30, incrementMinutes -> 11:30, decrementSeconds -> 11:29 (minutes unchanged, then seconds changed)

- [ ] T033 [P] Test T-useTimer methods work while timer is paused
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Test: isRunning=false, call incrementMinutes(), expect state updated

---

## Phase 5: User Story 1 - Adjust Timer Minutes (P1) 🎯

**Goal**: Users can increment/decrement minutes via left arrow buttons when timer paused  
**Independent Test**: Click left arrows, verify minutes change ±1, seconds unchanged

- [ ] T034 [US1] Integrate incrementMinutes button in ScoreboardTimerContainer
  - Description: Add ArrowButton component with onClick={incrementMinutes}, direction="up", unit="minutes"
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (left side, above label)
  - Binding: Connect onClick to incrementMinutes callback from useTimer

- [ ] T035 [US1] Integrate decrementMinutes button in ScoreboardTimerContainer
  - Description: Add ArrowButton component with onClick={decrementMinutes}, direction="down", unit="minutes"
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (left side, below label)
  - Binding: Connect onClick to decrementMinutes callback from useTimer

- [ ] T036 [P] [US1] Test scenario: 10:00 + up arrow → 11:00
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 1: Render at 10:00 paused, click up arrow, verify displays 11:00

- [ ] T037 [P] [US1] Test scenario: 10:00 + down arrow → 09:00
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 2: Render at 10:00 paused, click down arrow, verify displays 09:00

- [ ] T038 [P] [US1] Test scenario: 01:30 + down arrow x2 → 00:30 (seconds unchanged)
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 3: Render at 01:30, click down arrow twice, verify 00:30 with seconds preserved

---

## Phase 6: User Story 2 - Adjust Timer Seconds (P1) 🎯

**Goal**: Users can increment/decrement seconds via right arrow buttons when timer paused  
**Independent Test**: Click right arrows, verify seconds change ±1, minutes unchanged

- [ ] T039 [US2] Integrate incrementSeconds button in ScoreboardTimerContainer
  - Description: Add ArrowButton component with onClick={incrementSeconds}, direction="up", unit="seconds"
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (right side, above label)
  - Binding: Connect onClick to incrementSeconds callback from useTimer

- [ ] T040 [US2] Integrate decrementSeconds button in ScoreboardTimerContainer
  - Description: Add ArrowButton component with onClick={decrementSeconds}, direction="down", unit="seconds"
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (right side, below label)
  - Binding: Connect onClick to decrementSeconds callback from useTimer

- [ ] T041 [P] [US2] Test scenario: 10:00 + up arrow → 10:01
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 1: Render at 10:00 paused, click up arrow, verify displays 10:01

- [ ] T042 [P] [US2] Test scenario: 10:00 + down arrow → 09:59
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 2: Render at 10:00 paused, click down arrow, verify displays 09:59

---

## Phase 7: User Story 3 - Arrows Only When Paused (P1) 🎯

**Goal**: Arrows disabled when timer running or expired  
**Independent Test**: Toggle timer play/pause, verify arrows enable/disable

- [ ] T043 [US3] Add disabled prop logic to all arrow buttons based on isRunning state
  - Description: Set disabled={isRunning} on all 4 ArrowButton instances
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (all 4 buttons)
  - Effect: Buttons visually grayed out, onClick not triggered when isRunning=true

- [ ] T044 [US3] Add disabled prop logic based on timer boundary conditions
  - Description: Set disabled based on boundary: minuteUp={currentTime >= 3540}, minuteDown={currentTime < 60}, etc.
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Boundaries: Cannot exceed 59:59, cannot go below 00:00

- [ ] T045 [P] [US3] Test scenario: timer running → arrows disabled
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 1: Render at 05:00 running, verify all arrow buttons disabled

- [ ] T046 [P] [US3] Test scenario: timer paused → arrows enabled
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Acceptance Scenario 2: Render at 05:00 paused, verify all arrow buttons enabled

- [ ] T047 [P] [US3] Test scenario: pause → adjust → start (timer uses adjusted time)
  - File: src/components/scorekeeping/__tests__/ScoreboardTimerContainer.test.tsx
  - Workflow: Pause at 10:00, click up arrow minutes, verify 11:00, click play, verify countdown from 11:00

---

## Phase 8: User Story 4 - Visual Layout & Accessibility (P2)

**Goal**: Arrows positioned left (minutes) and right (seconds) with responsive layout  
**Independent Test**: Verify layout on 320px, 768px, 1920px viewports

- [ ] T048 [US4] Create horizontal flex layout in ScoreboardTimerContainer
  - Description: Change from vertical flex to horizontal: left arrows | timer middle | right arrows
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Tailwind: flex items-center justify-center gap-4 md:gap-6, with flex columns for each side

- [ ] T049 [US4] Add "MIN" and "SEC" labels below left and right arrow controls
  - Description: Add `<div className="text-xs text-slate-600 font-semibold">MIN</div>` between up/down arrows
  - Location: src/components/scorekeeping/ScoreboardTimerContainer.tsx (left and right sides)
  - UX: Clear visual grouping, helps users understand which arrows adjust which unit

- [ ] T050 [P] [US4] Test mobile responsive layout (320px viewport)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts or manual test
  - Check: Arrows visible on left and right, not overlapping timer, readable font, 44px+ touch targets

- [ ] T051 [P] [US4] Test tablet responsive layout (768px viewport)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Check: Layout maintained, spacing balanced, all buttons accessible

- [ ] T052 [P] [US4] Test desktop responsive layout (1920px viewport)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Check: Layout spacious, larger buttons (md:h-14 md:w-14), clear visual grouping

- [ ] T053 [P] [US4] Test keyboard Tab navigation through arrow buttons
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Tab cycles through all 4 arrows + play button, focus visible, order logical

- [ ] T054 [P] [US4] Test Enter key activates focused arrow button
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Tab to arrow, press Enter, verify time changes, no page navigation

- [ ] T055 [P] [US4] Test Space key activates focused arrow button
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Tab to arrow, press Space, verify time changes, no page scroll

- [ ] T056 [P] [US4] Test ARIA labels read correctly by screen reader
  - File: tests/e2e/scorekeeping-adjustment.spec.ts (accessibility audit)
  - Tool: axe-core or Playwright accessibility checks
  - Check: "Increment minutes", "Decrement minutes", "Increment seconds", "Decrement seconds" announced

---

## Phase 9: Integration & Quality Validation

**Goal**: Full quality gate verification, no regressions  
**Dependencies**: All user story phases (3-8) complete

- [ ] T057 [P] Run full unit test suite for all ArrowButton and useTimer tests
  - Command: `npm test -- --testPathPatterns="ArrowButton|ScoreboardTimerContainer"`
  - Expected: All tests passing (30+ tests)
  - Time: ~5 seconds

- [ ] T058 [P] Run TypeScript strict mode verification
  - Command: `npm run type-check`
  - Expected: 0 errors
  - Verify: ArrowButtonProps, useTimer adjustments fully typed

- [ ] T059 [P] Run ESLint on new/modified components
  - Command: `npm run lint -- src/components/scorekeeping`
  - Expected: 0 errors on ArrowButton.tsx and ScoreboardTimerContainer.tsx
  - Auto-fix: `npm run lint -- --fix` if needed

- [ ] T060 Create E2E test file for timer adjustment
  - File: tests/e2e/scorekeeping-adjustment.spec.ts (new file, ~300 lines)
  - Setup: Playwright test suite, navigate to /scorekeeping, wait for timer display

- [ ] T061 [P] E2E test: Display verification (arrows visible, positions correct)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Check: Left arrows above "MIN" label, timer centered, right arrows above "SEC" label

- [ ] T062 [P] E2E test: Minute adjustment workflow
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Click up arrow x3, verify 13:00, click down x2, verify 11:00

- [ ] T063 [P] E2E test: Second adjustment workflow
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Click up arrow x30, verify 10:30, click down x15, verify 10:15

- [ ] T064 [P] E2E test: Boundary enforcement (cannot exceed 59:59)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Set to 59:59, try up arrow, stays at 59:59

- [ ] T065 [P] E2E test: Boundary enforcement (cannot go below 00:00)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Set to 00:00, try down arrow, stays at 00:00

- [ ] T066 [P] E2E test: State transitions (pause → adjust → play)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Workflow: Timer at 10:00 running, pause (click play button), verify arrows enabled, click up arrow, verify 11:00, click play, verify countdown starts from 11:00

- [ ] T067 [P] E2E test: Keyboard navigation (Tab, Enter, Space)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Tab through arrows, verify focus visible, Enter/Space activate buttons

- [ ] T068 [P] E2E test: Responsive layout (320px, 768px, 1920px)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Viewports: setViewportSize(320, 640), (768, 1024), (1920, 1080)

- [ ] T069 [P] E2E test: Accessibility audit (axe-core scan)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Scan page with axe-core, expect 0 violations, WCAG 2.1 AA compliance

- [ ] T070 [P] E2E test: Feature 004 regression check (countdown still works)
  - File: tests/e2e/scorekeeping-adjustment.spec.ts
  - Test: Timer still counts down from 10:00, pauses, resumes, resets (Feature 004 unchanged)

- [ ] T071 [P] Run full E2E test suite
  - Command: `npm run test:e2e`
  - Expected: All tests passing (15+ tests)
  - Browsers: Chromium at minimum

- [ ] T072 Verify Feature 004 integration (no breaking changes)
  - Test: Old Feature 004 tests still pass
  - Command: `npm test -- --testPathPatterns="ScoreboardTimer|TimerToggle"`
  - Expected: All tests passing, Feature 003 canvas still loads

- [ ] T073 Verify feature branch commits are clean and documented
  - Command: `git log --oneline 006-timer-adjustment | head -10`
  - Check: Commit messages follow pattern: [type](006): [description]

---

## Phase 10: Documentation & Code Review

**Goal**: Code documented, ready for peer review  
**Status**: ⏳ After Phase 9 validation

- [ ] T074 Add JSDoc comments to ArrowButton component
  - File: src/components/scorekeeping/ArrowButton.tsx
  - Include: @param, @returns, @example usage

- [ ] T075 Add JSDoc comments to useTimer adjustment methods
  - File: src/components/scorekeeping/ScoreboardTimerContainer.tsx
  - Methods: incrementMinutes, decrementMinutes, incrementSeconds, decrementSeconds

- [ ] T076 Update README with Feature 006 usage example
  - File: frontend/web/README.md or project root README
  - Add: Example of ScoreboardTimerContainer with arrow buttons visible

- [ ] T077 Create PR from 006-timer-adjustment → main
  - Title: "feat(006): add timer adjustment controls with up/down arrows"
  - Description: Link to spec, clarifications, plan, testing summary

---

## Phase 11: Final Deployment Preparation

**Goal**: Feature ready for staging/production deployment  
**Status**: ⏳ After Phase 10 approval

- [ ] T078 Merge 006-timer-adjustment to main (after PR approval)
  - Merge method: Squash commits (or rebase per project convention)
  - Delete feature branch after merge

- [ ] T079 Final verification on staging environment
  - Deploy latest main to staging
  - Navigate to /scorekeeping, verify timer loads with arrow buttons
  - Click arrows, verify times change
  - Click play, verify timer counts down from adjusted time

- [ ] T080 Monitor production deployment (if applicable)
  - Check error logs for JavaScript errors
  - Verify timer functionality in production
  - Monitor user feedback for issues

---

## Task Summary

| Phase | Focus | Tasks | Status |
|-------|-------|-------|--------|
| 1 | Setup | T001-T003 | ⏳ 3 tasks |
| 2 | Components | T004-T015 | ⏳ 12 tasks |
| 3 | ArrowButton Tests | T016-T023 | ⏳ 8 tests |
| 4 | useTimer Tests | T024-T033 | ⏳ 10 tests |
| 5 | US1 Minutes | T034-T038 | ⏳ 5 tasks |
| 6 | US2 Seconds | T039-T042 | ⏳ 4 tasks |
| 7 | US3 State Management | T043-T047 | ⏳ 5 tasks |
| 8 | US4 Accessibility | T048-T056 | ⏳ 9 tasks |
| 9 | Integration | T057-T073 | ⏳ 17 tasks |
| 10 | Documentation | T074-T077 | ⏳ 4 tasks |
| 11 | Deployment | T078-T080 | ⏳ 3 tasks |
| **TOTAL** | | **80 tasks** | ⏳ Ready |

---

## Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Components) - BLOCKING
    ↓
Phases 3-4 (Tests) [PARALLEL]
    ↓
Phases 5-8 (User Stories) [MOSTLY PARALLEL]
    ├─ US1 (Minutes) [P]
    ├─ US2 (Seconds) [P]
    ├─ US3 (State Mgt)
    └─ US4 (Accessibility) [P]
    ↓
Phase 9 (Integration) [PARALLEL: Tests + Linting]
    ↓
Phase 10 (Documentation)
    ↓
Phase 11 (Deployment)
```

---

## Parallel Execution Strategy

**Recommended Execution (4-5 hours total)**:

1. **Parallel Set 1** (30 min): T001-T003, T004-T015 - Setup + Components foundation
2. **Parallel Set 2** (90 min): T016-T033 - All unit tests (run while Phase 1 completes)
3. **Parallel Set 3** (60 min): T034-T056 - All user story implementation (after Set 1)
4. **Parallel Set 4** (60 min): T057-T073 - Integration + validation (after Set 3)
5. **Sequential**: T074-T080 - Documentation + deployment (after Set 4 passes)

**TDD Approach**: Write all tests first (T016-T033, T036-T047, T050-T056), ensure they FAIL, then implement code to make them PASS.

---

## Quality Gates

All of the following must PASS before Phase 9 completion:

- ✅ TypeScript: `npm run type-check` → 0 errors
- ✅ ESLint: `npm run lint` → 0 errors (ArrowButton + Container)
- ✅ Unit Tests: `npm test` → All passing (40+ tests)
- ✅ E2E Tests: `npm run test:e2e` → All passing (15+ tests)
- ✅ No regressions: Feature 004 tests still passing
- ✅ Accessibility: axe-core scan passes WCAG 2.1 AA
- ✅ Performance: No layout shift, instant updates

---

## Estimated Time Breakdown

| Phase | Est. Time | Notes |
|-------|-----------|-------|
| 1-2 | 1 hour | Setup + components (can run in parallel) |
| 3-4 | 1.5 hours | All tests (TDD-first approach) |
| 5-8 | 2 hours | User story implementation (mostly parallel) |
| 9 | 1 hour | Integration + validation |
| 10-11 | 0.5 hours | Documentation + deployment prep |
| **TOTAL** | **6 hours** | With TDD + parallel execution |

---

**Next Step**: Begin implementation with Phase 1 (Setup & Types)  
**Recommended Command**: `npm run dev` to start dev server, then implement T001-T003, commit, proceed to Phase 2

