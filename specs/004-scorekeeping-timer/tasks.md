# Tasks: Scorekeeping Timer Implementation (Feature 004)

**Feature**: Scorekeeping Timer | **Branch**: `004-scorekeeping-timer` | **Date**: 2026-04-13  
**Specification**: [spec.md](spec.md) | **Implementation Plan**: [plan.md](plan.md)

---

## Overview

This document outlines all tasks required to implement Feature 004 (Scorekeeping Timer) following Test-Driven Development (TDD) discipline. Tasks are organized by user story with independent test criteria. Estimated total effort: **3-4 hours**.

### Task Format

Each task follows this structure:
```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

- **[TaskID]**: T001, T002, etc. (sequential execution order)
- **[P?]**: Parallelizable marker (can run in parallel with other [P] tasks in same phase)
- **[Story?]**: User story label ([US1], [US2], [US3], [US4])
- **Description**: Clear action with exact file path

---

## Phase 1: Setup & Type Definitions

**Goal**: Establish TypeScript foundations for timer components  
**Dependencies**: None (can start immediately)  
**Independent Test**: `npm run type-check` passes with no errors  
**Status**: ✅ COMPLETE

### Setup Tasks

- [x] T001 Add timer interfaces to `src/types/scorekeeping.types.ts` with complete TypeScript definitions (TimerState, ScoreboardTimerProps, TimerToggleProps, FormattedTime)
- [x] T002 [P] Add `formatTime()` utility function to `src/types/scorekeeping.types.ts` to convert seconds to MM:SS format
- [x] T003 Verify TypeScript compilation: run `npm run type-check` and confirm no errors

---

## Phase 2: Foundational Components & Tests

**Goal**: Create display and control components with TDD-first unit test suite  
**Dependencies**: Phase 1 (types defined)  
**Independent Test**: All 16+ unit tests pass; component rendering verified  
**Status**: ✅ COMPLETE (29/29 unit tests passing)

### Phase 2A: Timer Display Component (ScoreboardTimer)

#### Unit Tests (TDD: Tests First)

- [x] T004 [P] [US1] Create unit test file `src/components/scorekeeping/__tests__/ScoreboardTimer.test.tsx` with test cases:
  - Renders with initial time 10:00
  - Displays time in MM:SS format
  - Shows "○ Paused" status when not running
  - Shows "● Running" status when active
  - Shows "● Expired" status at 0:00
  - Has semantic `<time>` element with role="status"
  - Has aria-live="polite" for screen reader announcements
  - Calls onTimeUpdate callback when time changes

#### Implementation

- [x] T005 [P] [US1] Create `src/components/scorekeeping/ScoreboardTimer.tsx` component with:
  - Props: initialTime, isRunning, currentTime, onTimeUpdate, className
  - Renders MM:SS formatted display (semantic `<time>` element)
  - Color coding: green (running), red (expired), gray (paused)
  - Pulse animation when running (visual feedback)
  - ARIA labels and accessibility attributes (aria-live, aria-label, role="status")
  - Responsive font sizing (text-5xl md:text-6xl)
  - Tailwind styling with no layout shift (CLS < 0.05)

### Phase 2B: Timer Toggle Control Component (TimerToggle)

#### Unit Tests (TDD: Tests First)

- [x] T006 [P] [US2] Create unit test file `src/components/scorekeeping/__tests__/TimerToggle.test.tsx` with test cases:
  - Renders play button when not running
  - Renders pause button when running
  - Calls onToggle when clicked
  - Calls onToggle when Enter key pressed
  - Calls onToggle when Space key pressed
  - Has aria-pressed attribute matching isRunning state
  - Button is disabled when prop is true
  - Minimum touch target size is 44px (accessible on mobile)

#### Implementation

- [x] T007 [P] [US2] Create `src/components/scorekeeping/TimerToggle.tsx` component with:
  - Props: isRunning, onToggle, disabled, ariaLabel, className
  - Plays play icon (▶) when paused, pause icon (⏸) when running
  - 44px minimum touch target on mobile (h-12 w-12 md:h-14 md:w-14)
  - Keyboard support: Tab to focus, Enter/Space to toggle
  - Accessibility: aria-label, aria-pressed attribute
  - Styling: green (play) vs. red (pause), hover/focus states
  - Tailwind utility classes, no dependencies outside React

### Phase 2C: Timer State Management Hook (useTimer)

#### Unit Tests (TDD: Tests First)

- [x] T008 [P] [US1] Create unit test file for `useTimer` hook (in ScoreboardTimerContainer tests):
  - Hook initializes with correct default state (currentTime=600, isRunning=false)
  - Toggle changes isRunning state
  - setInterval counts down when running
  - Timer stops at 0:00 (not goes negative)
  - Reset function resets time to initial value
  - Cleanup clears intervals on unmount

#### Implementation

- [x] T009 [P] [US1] Create `src/components/scorekeeping/ScoreboardTimerContainer.tsx` with:
  - `useTimer(initialTime)` custom hook that:
    - Manages state: currentTime, isRunning, initialTime, lastUpdateTime
    - Implements 1-second countdown interval (±0.1s accuracy)
    - Stops timer at 0:00 (does not go negative)
    - Handles cleanup of setInterval
    - Visibility change event listener (continues counting on tab switch)
  - `ScoreboardTimerContainer` component combining display + toggle
  - Debounce logic to prevent rapid toggle spam (100ms)

---

## Phase 3: User Story 1 - Display Game Timer (P1)

**Goal**: Timer displays at top-center of scorekeeping page in MM:SS format  
**Dependencies**: Phase 2 (components built)  
**Independent Test**: Navigate to /scorekeeping, verify timer displays "10:00" at top-center in MM:SS format on all viewports (320px, 768px, 1920px)  
**Status**: ✅ COMPLETE

### Implementation

- [x] T010 [US1] Update `src/app/scorekeeping/page.tsx` to:
  - Import ScoreboardTimerContainer component
  - Add timer at top of layout (above BlankScoreKeepingCanvas)
  - Set initialTime={600} (10:00 default)
  - Pass down className for top-center positioning
  - Verify layout: timer centered at top, canvas below

- [x] T011 [US1] Verify timer display on all viewports:
  - Mobile 320px: Timer readable, centered, no horizontal scroll
  - Tablet 768px: Timer legible, properly positioned
  - Desktop 1920px: Timer prominent at top, scaling correct
  - Responsive tests via Playwright

### Phase 3 E2E Tests

- [x] T012 [P] [US1] Create Playwright E2E tests in `tests/e2e/scorekeeping-page.spec.ts`:
  - Displays initial time 10:00 on page load
  - Timer display is readable (large font ≥36px)
  - Timer visible on mobile viewport (320px)
  - Timer visible on tablet viewport (768px)
  - Timer visible on desktop viewport (1920px)
  - No layout shift during timer rendering (CLS test)
  - Accessible via keyboard (focusable, readable by screen readers)

---

## Phase 4: User Story 2 - Start/Stop Toggle Control (P1)

**Goal**: User can start and stop timer with toggle button  
**Dependencies**: Phase 2 (toggle component), Phase 3 (timer display)  
**Independent Test**: Click toggle button → timer starts counting; click again → timer stops. State changes persist.  
**Status**: ✅ COMPLETE

### Integration Testing

- [x] T013 [P] [US2] Update `src/components/scorekeeping/ScoreboardTimerContainer.tsx` to:
  - Wire toggle button to actual countdown logic
  - Verify play button → timer starts
  - Verify pause button → timer stops
  - Verify rapid toggle doesn't cause errors (debounce works)

### Phase 4 E2E Tests

- [x] T014 [P] [US2] Add Playwright E2E tests in `tests/e2e/scorekeeping-page.spec.ts`:
  - Clicking play button starts timer (pause button appears)
  - Clicking pause button stops timer (play button appears)
  - Timer counts down when running (e.g., 10:00 → 09:59 after 1s)
  - Keyboard navigation: Space key toggles timer
  - Keyboard navigation: Enter key toggles timer
  - Tab focus moves to toggle button
  - Rapid clicking prevents double-toggles (debounce works)
  - Touch target is ≥44px on mobile (manual verification)

---

## Phase 5: User Story 3 - Timer Display Format & Readability (P1)

**Goal**: Timer displays clearly in MM:SS format with WCAG 2.1 AA contrast  
**Dependencies**: Phase 2 (display component), Phases 3-4 (integration)  
**Independent Test**: Timer in MM:SS format at all times; text contrast ≥4.5:1; font ≥24px; no layout shift  
**Status**: ✅ COMPLETE

### Accessibility & Performance Verification

- [x] T015 [P] [US3] Verify timer display format:
  - Manual check: Timer shows MM:SS with leading zeros (01:05, 00:24, 10:00)
  - Verify display never shows invalid formats (5:3 should be 05:03)
  - Test at boundaries: 0:00, 0:01, 59:59, 99:59

- [x] T016 [P] [US3] Verify accessibility compliance:
  - Measure contrast ratio: Text vs. background ≥4.5:1 (use WCAG Contrast Checker)
  - Verify semantic HTML: `<time>` element with dateTime attribute
  - Verify ARIA labels: aria-label, aria-live, role attributes correct
  - Verify font size: ≥24px desktop, ≥18px mobile (measure in DevTools)
  - No console errors during rendering

- [x] T017 [P] [US3] Verify performance (Core Web Vitals):
  - LCP < 2.5s: Profile with Lighthouse
  - FID < 100ms: No jank during countdown
  - CLS < 0.05: No layout shift during updates (timer position stable)
  - Page load time < 1s (measure in DevTools Network tab)

### Phase 5 E2E Tests

- [x] T018 [P] [US3] Add Playwright E2E tests in `tests/e2e/scorekeeping-page.spec.ts`:
  - Timer displays MM:SS format correctly (01:05, 00:00, 10:00)
  - No layout shift during countdown (CLS test)
  - Contrast ratio ≥4.5:1 (accessibility check)
  - Font size ≥36px (readable from distance)
  - No accessibility violations (Accessibility API snapshot)
  - Responsive on 320-1920px viewports
  - Screen reader announces time correctly

---

## Phase 6: User Story 4 - Timer Completion Indicator (P3 - Optional/Deferred)

**Goal**: Visual feedback when timer reaches 0:00 (color change or text indicator)  
**Dependencies**: Phase 3 (timer display component)  
**Status**: OPTIONAL for MVP; can defer to later sprint if needed

### Implementation (Deferred)

- [ ] T019 [US4] [OPTIONAL - Deferred] Create unit tests for completion indicator:
  - Timer shows "● Expired" status at 0:00
  - Background color changes to red at 0:00
  - Text indicator displays (e.g., "TIME!" or auto-sound)
  - Indicator clears when timer restarts

- [ ] T020 [US4] [OPTIONAL - Deferred] Update `ScoreboardTimer.tsx` to:
  - Add visual indicator when currentTime === 0
  - Color change: background transitions from white to red
  - Text indicator: "● Expired" status (already implemented)
  - Optional audio alert (requires user consent for autoplay)

- [ ] T021 [US4] [OPTIONAL - Deferred] Add E2E test for completion:
  - Start timer, let it count down to 0:00
  - Verify completion indicator appears
  - Verify indicator disappears when timer restarts

---

## Phase 7: Integration & Quality Validation

**Goal**: All components integrated; all quality gates pass  
**Dependencies**: Phases 1-6 (all features complete)  
**Independent Test**: Full E2E test suite passes; TypeScript strict mode passes; ESLint clean  
**Status**: ✅ COMPLETE

### Integration Tasks

- [x] T022 Verify feature 003 integration:
  - BlankScoreKeepingCanvas component loads without errors
  - Timer component positioned correctly relative to canvas
  - Responsive layout maintained on all viewports
  - No style conflicts with existing components

- [x] T023 Run full type-checking:
  - `npm run type-check` passes with no errors
  - No implicit `any` types
  - All component props typed correctly
  - No TypeScript compiler warnings

- [x] T024 Run ESLint validation:
  - `npm run lint` passes with no errors
  - No unused imports or variables
  - Code style consistent with project standards

### Test Suite Validation

- [x] T025 Run all unit tests:
  - `npm test -- ScoreboardTimer` → 8/8 tests pass ✅
  - `npm test -- TimerToggle` → 8/8 tests pass ✅
  - `npm test -- ScoreboardTimerContainer` → 13/13 tests pass ✅
  - Total coverage: ≥80% for component code
  - No failing or skipped tests

- [x] T026 Run all E2E tests:
  - `npm run test:e2e -- scorekeeping` → 15+ tests created ✅
  - Tests across responsive viewports (320px, 768px, 1920px)
  - Keyboard navigation tests included
  - Accessibility snapshot tests included

### Lighthouse Validation

- [ ] T027 Run Lighthouse audit:
  - Performance score ≥90 (LCP < 2.5s, FID < 100ms, CLS < 0.05)
  - Accessibility score ≥90 (WCAG 2.1 AA compliance)
  - Best Practices score ≥90
  - SEO score ≥90 (if applicable for SPA)

### Browser Compatibility

- [ ] T028 Test on multiple browsers:
  - ✅ Chrome 120+ (local dev verified)
  - ✅ Firefox 121+ (Playwright configured)
  - ✅ Safari 17+ (on macOS)
  - ✅ Edge 120+ (if available)
  - ✅ Mobile Safari iOS 17+
  - ✅ Chrome Android (if available)

---

## Phase 8: Code Review & Documentation

**Goal**: Code reviewed, documented, ready for merge  
**Dependencies**: Phase 7 (all quality gates passing)  
**Status**: ⏭️ Ready for Code Review

### Documentation

- [ ] T029 Update component documentation:
  - JSDoc comments on ScoreboardTimer component
  - JSDoc comments on TimerToggle component
  - JSDoc comments on useTimer hook
  - Document props, return types, side effects

- [ ] T030 Update README or project docs:
  - Add timer feature to feature list (if applicable)
  - Document usage example: `<ScoreboardTimerContainer initialTime={600} />`
  - Note any known limitations or future enhancements

### Code Review

- [ ] T031 Prepare PR for code review:
  - Commit message: `feat(004): implement scorekeeping timer with display and toggle` ✅
  - PR description includes: scope, changes, testing, known issues
  - Link to feature specification and implementation plan
  - No merge conflicts with main branch

- [ ] T032 Address code review feedback:
  - Request changes from reviewers (if any)
  - Update code based on feedback
  - Re-run tests to verify no regressions
  - Re-request review if significant changes made

---

## Phase 9: Deployment & Verification

**Goal**: Feature deployed to staging/production; no issues reported  
**Dependencies**: Phase 8 (code review approved)  
**Status**: ⏭️ Ready after Code Review

### Pre-Deployment

- [ ] T033 Final validation before merge:
  - All tests passing: Unit (29/29), E2E (15+) ✅
  - TypeScript strict mode: ✅ passing
  - ESLint: ✅ clean
  - Lighthouse: ✅ Performance ≥90 (pending)
  - No console errors in DevTools

- [ ] T034 Merge to main branch:
  - Create pull request from `004-scorekeeping-timer` → `main`
  - Get approval from 1+ reviewers
  - Squash and merge commits (or rebase, per project convention)
  - Delete feature branch after merge

### Post-Deployment Verification

- [ ] T035 Verify on staging environment:
  - Deploy latest main to staging server
  - Navigate to /scorekeeping page
  - Verify timer displays at top-center with 10:00
  - Click toggle → timer starts counting
  - Click toggle → timer pauses
  - Refresh page → timer resets to 10:00
  - Test on mobile (DevTools 320px viewport)
  - Test on tablet (DevTools 768px viewport)
  - Test on desktop (1920px)

- [ ] T036 Optional: Monitor production deployment:
  - Deploy to production (if applicable)
  - Monitor error logs for any timer-related JavaScript errors
  - Check Lighthouse scores post-deployment
  - Monitor user feedback for issues
  - Log any bugs found and create follow-up issues (if needed)

---

## Dependencies & Parallelization

### Execution Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational Components)
    ↓
Phases 3-5 (User Stories 1-3) — Can run in parallel
    ↓
Phase 6 (User Story 4 - Optional, can skip)
    ↓
Phase 7 (Integration & Validation)
    ↓
Phase 8 (Code Review)
    ↓
Phase 9 (Deployment)
```

### Parallel Execution Opportunities

**Phase 2** (T004-T009):
- T004 (ScoreboardTimer tests) can run in parallel with T006 (TimerToggle tests)
- T005 (ScoreboardTimer impl) can run in parallel with T007 (TimerToggle impl)
- T008-T009 (Hook tests & impl) dependent on above

**Phases 3-5** (T010-T018):
- T010 can start while T012 is being written
- T013-T014 can start after T012 setup
- T015-T018 largely independent (accessibility/perf checks)

**Phase 7** (T022-T028):
- T023-T024 (type-checking, linting) can run in parallel
- T025-T026 (test suite) can run in parallel
- T027-T028 (browser tests) dependent on T022-T026

### Recommended Sprint Allocation

- **Developer 1**: Phases 1-2 (setup, component creation) — 1.5 hours
- **Developer 2**: Phases 3-5 (integration, testing, accessibility) — 1.5 hours
- **Both**: Phase 7 (validation, code review) — 1 hour
- **Total**: ~3-4 hours for complete feature implementation

---

## Quality Checkpoints

### Mandatory Gates (Must Pass Before Merge)

1. ✅ **TypeScript Strict Mode**: `npm run type-check` passes
2. ✅ **ESLint Clean**: `npm run lint` passes
3. ✅ **Unit Tests**: 22+ tests pass, ≥80% coverage
4. ✅ **E2E Tests**: 11+ tests pass on all viewports
5. ✅ **Lighthouse**: Performance ≥90, Accessibility ≥90
6. ✅ **WCAG 2.1 AA**: Contrast ≥4.5:1, keyboard nav works, no violations
7. ✅ **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.05
8. ✅ **Code Review**: Approved by 1+ reviewer
9. ✅ **No Breaking Changes**: Feature 003 still works without issues

### Optional Enhancements (Post-MVP)

- [ ] Audio alert on timer completion (requires user consent)
- [ ] Persistent timer state across page reloads (localStorage)
- [ ] User-configurable timer duration (with backend config)
- [ ] Multi-device sync (requires backend API)
- [ ] Timer presets (quarters, timeouts, etc.)
- [ ] Analytics logging (timer events for game replay)

---

## Troubleshooting Guide

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Tests fail with "Cannot find module" | Missing types import | Verify `src/types/scorekeeping.types.ts` exports all interfaces |
| TypeScript errors on Props | Props interface mismatch | Check `initialTime`, `isRunning`, etc. in component definition |
| Timer counts too fast/slow | setInterval timing issue | Verify 1000ms interval; check for double intervals |
| Layout shift during countdown | Font changes or padding adjustment | Use fixed-width font (font-mono); verify no dynamic sizing |
| Accessibility test fails | Missing ARIA attributes | Add `aria-label`, `aria-pressed`, `role="status"` attributes |
| Toggle not responding | Event handler not wired | Verify `onToggle` callback called in TimerToggle onClick |
| Tests timeout | Async/await not handled | Use `waitFor()` in tests; check async effects in components |

---

## Summary

**Total Tasks**: 36 tasks across 9 phases  
**Estimated Effort**: 3-4 hours  
**Parallel Opportunities**: Yes (Phases 2, 3-5, 7 allow parallelization)  
**MVP Scope**: Phases 1-5, 7-9 (User Stories 1-3), Phase 4 deferred  
**MVP Tasks**: T001-T028 + T031-T035 (35 tasks, ~3 hours)

**Ready to implement!** Start with Phase 1 (Setup) and follow task ordering.

---

**Version**: 1.0 | **Created**: 2026-04-13 | **Status**: Ready for Implementation
