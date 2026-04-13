---
description: "Task list for blank scorekeeping canvas feature"
---

# Tasks: Blank Scorekeeping Canvas

**Input**: Design documents from `/specs/003-blank-scorekeeping-canvas/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, quickstart.md

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2])
- Include exact file paths in descriptions

## Path Conventions

- Components: `frontend/web/src/components/`
- Pages: `frontend/web/src/pages/`
- Types: `frontend/web/src/types/`
- Tests: `frontend/web/src/components/__tests__/` and `frontend/web/tests/e2e/`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project structure and configuration; no feature-specific setup needed (repo already initialized)

- [X] T001 Verify Next.js 14+ and TypeScript 5.x are configured in frontend/web ✅
- [X] T002 Verify Tailwind CSS 3.x is configured with src/ paths included in tailwind.config.ts ✅
- [X] T003 Verify Jest and React Testing Library are configured in frontend/web ✅
- [X] T004 Verify Playwright is installed and configured in frontend/web ✅

**Checkpoint**: Development environment ready for blank page implementation ✅ COMPLETE

---

## Phase 2: Foundational (Minimal TypeScript Setup)

**Purpose**: TypeScript type definitions (minimal for this feature)

- [X] T005 [P] Create types file at frontend/web/src/types/scorekeeping.types.ts with BlankScoreKeeperProps interface (empty/minimal) ✅
- [X] T006 Create scorekeeping components directory at frontend/web/src/components/scorekeeping/ ✅

**Checkpoint**: Type definitions and directory structure in place ✅ COMPLETE

---

## Phase 3: User Story 1 - Access Blank Scorekeeping Canvas (Priority: P1) 🎯 MVP

**Goal**: Build a route at /scorekeeping that loads successfully and displays a blank canvas

**Independent Test**: Navigate to /scorekeeping; verify page loads without errors and displays empty canvas. Delivers: accessible, clean scorekeeping entry point.

### Tests for User Story 1 (TDD - Write Tests First)

- [X] T007 [P] [US1] Write unit test for BlankScoreKeepingCanvas rendering in frontend/web/src/components/scorekeeping/__tests__/BlankScoreKeepingCanvas.test.tsx (verify renders without crashing, has proper ARIA label) ✅
- [X] T008 [P] [US1] Write E2E test for page navigation in frontend/web/tests/e2e/scorekeeping-page.spec.ts (verify route loads at /scorekeeping, no console errors) ✅

### Implementation for User Story 1

- [X] T009 [US1] Create BlankScoreKeepingCanvas component at frontend/web/src/components/scorekeeping/BlankScoreKeepingCanvas.tsx with semantic <main> element, minimal styling, proper ARIA labels ✅
- [X] T010 [US1] Create page route at frontend/web/src/app/scorekeeping/page.tsx that imports and renders BlankScoreKeepingCanvas with proper metadata (using App Router) ✅
- [X] T011 [US1] Run unit tests and verify T007 passes (component renders correctly) - All 9 tests pass ✅
- [ ] T012 [US1] Run E2E tests and verify T008 passes (page loads at /scorekeeping) - Pending (browser setup in progress)

**Checkpoint**: User Story 1 ~ COMPLETE (1 test pending Playwright setup)

---

## Phase 4: User Story 2 - Responsive Blank Canvas (Priority: P1) 🎯 MVP

**Goal**: Ensure page adapts to all screen sizes (320px-1920px) without horizontal scrolling

**Independent Test**: Load page on multiple viewports (320px, 768px, 1920px using DevTools); verify layout adapts smoothly, no horizontal scroll. Delivers: multi-device usable page.

### Tests for User Story 2

- [X] T013 [P] [US2] Write responsive E2E tests in frontend/web/tests/e2e/scorekeeping-page.spec.ts (verify 320px mobile, 768px tablet, 1920px desktop viewports render correctly) ✅
- [X] T014 [P] [US2] Add unit test for responsive classes in frontend/web/src/components/scorekeeping/__tests__/BlankScoreKeepingCanvas.test.tsx (verify has w-full, h-screen classes) ✅

### Implementation for User Story 2

- [X] T015 [US2] Update BlankScoreKeepingCanvas component to use Tailwind responsive utilities (w-full h-screen bg-white flex) to ensure full viewport coverage ✅
- [X] T016 [US2] Verify component uses mobile-first Tailwind utilities for responsiveness (no fixed widths or breakpoints needed for blank canvas) ✅
- [ ] T017 [US2] Run E2E tests T013 on multiple viewport sizes and verify all pass (no horizontal scroll on 320px, proper layout on 768px and 1920px) - Pending
- [ ] T018 [US2] Manual responsive testing in Chrome DevTools: test zoom levels up to 200% per edge cases in spec - Not yet tested

**Checkpoint**: User Story 2 ~ COMPLETE (E2E testing pending)

---

## Phase 5: User Story 3 - Minimal Styling and Branding (Priority: P1) 🎯 MVP

**Goal**: Apply subtle Tailwind theme branding (colors, typography) from theStatsApp design system without adding UI chrome

**Independent Test**: Load page; compare styling to home page (colors, fonts); verify WCAG 2.1 AA contrast compliance. Delivers: branded but minimalist canvas.

### Tests for User Story 3

- [X] T019 [P] [US3] Write accessibility/contrast test in frontend/web/src/components/scorekeeping/__tests__/BlankScoreKeepingCanvas.test.tsx (verify bg-white has sufficient contrast via theme token) ✅
- [ ] T020 [P] [US3] Add Lighthouse audit check to E2E tests to verify accessibility score ≥ 90 in frontend/web/tests/e2e/scorekeeping-page.spec.ts - Pending

### Implementation for User Story 3

- [X] T021 [US3] Update BlankScoreKeepingCanvas component to use Tailwind theme colors: bg-white for background, inherit typography from globals.css (no custom fonts needed) ✅
- [X] T022 [US3] Verify no custom CSS is added; all styling uses existing Tailwind tokens from tailwind.config.ts (colors, spacing, typography) ✅
- [ ] T023 [US3] Run Lighthouse audit on /scorekeeping: verify Accessibility ≥ 90, Performance ≥ 90; document results - Pending
- [ ] T024 [US3] Manual contrast verification: check text on background meets WCAG 2.1 AA minimum (4.5:1 body text, 3:1 UI) using axe DevTools or similar - Pending
- [X] T025 [US3] Verify page maintains blank canvas aesthetic: no decorative elements, no clutter, minimal UI ✅

**Checkpoint**: User Story 3 ~ COMPLETE (Lighthouse audit pending)

---

## Phase 6: Testing & Accessibility Audit

**Purpose**: Complete test suite and accessibility verification

- [ ] T026 [P] Run full unit test suite: `npm test -- BlankScoreKeepingCanvas.test.tsx` in frontend/web; verify all tests pass
- [ ] T027 [P] Run full E2E test suite: `npx playwright test tests/e2e/scorekeeping-page.spec.ts` in frontend/web; verify all tests pass
- [ ] T028 [P] Run Lighthouse audit on /scorekeeping:
  - [ ] Accessibility score ≥ 90
  - [ ] Performance score ≥ 90
  - [ ] Best Practices score ≥ 90
  - [ ] Document results in PR
- [ ] T029 [P] Manual keyboard navigation test: Tab through /scorekeeping page; verify focus moves predictably, no focus traps
- [ ] T030 [P] Manual screen reader test (optional but recommended): Test with NVDA (Windows) or VoiceOver (macOS); verify page is readable and navigation logical

**Checkpoint**: All tests passing. Accessibility verified. Page ready for production.

---

## Phase 7: User Story 4 - Loading Indicator (Optional, Priority: P3)

**Goal**: (Optional) Display subtle loading indicator if async operations occur (none in v1, but placeholder for future)

**Independent Test**: Verify page renders instantly without visible delay or loading state. Delivers: clear instant feedback.

**Status**: DEFERRED - Not required for MVP (v1 is fully synchronous). Can be added in future release if async requirements arise.

- [ ] T031 [P3] If async initialization is needed in future: Implement brief, non-blocking loading indicator in BlankScoreKeepingCanvas component
- [ ] T032 [P3] If async initialization is needed in future: Add test for loading state display and timeout (< 1 second to ready)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final review, documentation, and deployment preparation

- [ ] T033 [P] Verify TypeScript compilation passes: `npm run type-check` in frontend/web
- [ ] T034 [P] Verify ESLint passes: `npm run lint` in frontend/web (no errors)
- [ ] T035 [P] Verify no unused imports or code in new files: clean implementation
- [ ] T036 Run full test suite again: `npm test` and `npx playwright test` in frontend/web; all pass
- [ ] T037 Verify git branch is clean and up-to-date with main
- [ ] T038 Create PR with descriptive message (see template below)
- [ ] T039 Code review: peer reviews PR for:
  - TypeScript types correct and no `any` types
  - Component follows Constitution Principle I (component-driven, props clear)
  - Tests are adequate and pass
  - Accessibility verified
  - No UI chrome present (truly minimal)
  - Responsive design working
- [ ] T040 Merge PR to main branch after approval
- [ ] T041 Verify deployment completes successfully

**Checkpoint**: Feature deployed to production. Blank scorekeeping canvas available at /scorekeeping.

---

## Implementation Order & Dependencies

**Dependency Graph**:
```
T001-T004 (Setup) 
  → T005-T006 (Foundational types & dirs)
    → T007-T008 (US1 Tests) 
      → T009-T010 (US1 Component & Route)
        → T011-T012 (US1 Test execution)
          → T013-T018 (US2 Tests & Implementation)
            → T019-T025 (US3 Tests & Implementation)
              → T026-T030 (Test Suite & Audit)
                → T033-T041 (Polish & Deployment)
```

**Parallelization Opportunities**:
- T005-T006 can run in parallel (independent files)
- T007-T008 can run in parallel (different test files)
- T013-T014 can run in parallel
- T019-T020 can run in parallel
- T026-T030 can run in parallel
- T033-T035 can run in parallel

---

## Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|-----------------|
| Setup | T001-T004 | 15 min (mostly verification) |
| Foundational | T005-T006 | 10 min |
| US1 | T007-T012 | 30 min (write tests, implement component) |
| US2 | T013-T018 | 30 min (responsive testing, ensure responsive layout) |
| US3 | T019-T025 | 30 min (accessibility audit, verify branding) |
| Testing & Audit | T026-T030 | 30 min |
| Polish & Deploy | T031-T041 | 30 min (code review, merge, monitor) |
| **TOTAL** | 41 tasks | **3-4 hours** |

---

## Success Criteria (Task Completion Checklist)

- [ ] All tests pass (T011-T012, T013, T017, T026-T027)
- [ ] Lighthouse audit: Accessibility ≥ 90, Performance ≥ 90, Best Practices ≥ 90 (T023, T028)
- [ ] TypeScript: No `any` types, strict mode passes (T033)
- [ ] ESLint: No errors or warnings (T034)
- [ ] Responsive: Page renders correctly at 320px, 768px, 1920px (T017-T018)
- [ ] Accessibility: WCAG 2.1 AA compliant, keyboard navigable (T024, T029-T030)
- [ ] Page loads: < 1 second, no console errors (T012, T017)
- [ ] Code review: Approved by peer (T039)
- [ ] Deployed: Successfully merged to main and deployed (T040-T041)

---

## PR Template

```markdown
## Blank Scorekeeping Canvas (Feature 003)

### Description
Implement a minimal, blank scorekeeping page at `/scorekeeping` route using Next.js, TypeScript, and Tailwind CSS.

### Changes
- Create `BlankScoreKeepingCanvas` component at `frontend/web/src/components/scorekeeping/BlankScoreKeepingCanvas.tsx`
- Create page route at `frontend/web/src/pages/scorekeeping.tsx`
- Add unit tests in `frontend/web/src/components/scorekeeping/__tests__/BlankScoreKeepingCanvas.test.tsx`
- Add E2E tests in `frontend/web/tests/e2e/scorekeeping-page.spec.ts`
- Add minimal TypeScript types in `frontend/web/src/types/scorekeeping.types.ts`

### Checklist
- [ ] All tests pass (`npm test` + `npx playwright test`)
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Lighthouse audit: Accessibility ≥ 90, Performance ≥ 90
- [ ] Responsive design tested on 320px, 768px, 1920px
- [ ] Keyboard navigation verified
- [ ] WCAG 2.1 AA contrast compliance verified
- [ ] No UI chrome (no header/nav/title)
- [ ] Page loads in < 1 second

### Testing
- Unit tests: Verify component renders, has ARIA labels, responsive classes
- E2E tests: Verify page loads at /scorekeeping, responsive on all sizes, keyboard accessible
- Lighthouse audit: Verify accessibility and performance scores ≥ 90

### Notes
- Feature is intentionally minimal; focused on blank canvas foundation for future scorekeeping features
- No new dependencies added; uses existing Next.js + TypeScript + Tailwind stack
- Page has no state or props in v1; enables simple testing and deployment
```

---

## Architecture Notes

### Component Design
- **BlankScoreKeepingCanvas**: Stateless, no props, ~30 lines of code
- Semantic HTML: `<main>` element with proper ARIA labels
- Responsive: Uses Tailwind utilities (w-full, h-screen, flex, items-center, justify-center)
- Accessible: Inherited from defaults; no special accessibility workarounds needed

### Styling
- All styling via Tailwind theme tokens (bg-white, inherited fonts)
- No custom CSS files needed
- Mobile-first responsive approach (Tailwind defaults)

### Testing Strategy
- Unit tests: Verify component renders correctly, has accessibility attributes
- E2E tests: Verify page navigation, responsive layout, keyboard accessibility
- No API mocking needed (no backend calls)

### Performance
- Static page: Renders instantly (< 1 second LCP target easily met)
- No JavaScript blocking: Minimal JS required, only React mounting
- CSS: All Tailwind utility classes (no custom CSS to slow load)

---

**Version**: 1.0.0 | **Created**: 2026-04-13 | **Status**: Ready for Implementation
