# Implementation Plan: Blank Scorekeeping Canvas

**Branch**: `003-blank-scorekeeping-canvas` | **Date**: 2026-04-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-blank-scorekeeping-canvas/spec.md`

## Summary

Build a truly minimal, blank page for the scorekeeping application in Next.js with TypeScript and Tailwind CSS. The page provides an empty canvas with no UI chrome (header, navigation, title), inherits subtle branding via Tailwind theme tokens, and is fully responsive (320px-1920px) and accessible (WCAG 2.1 AA). This is a foundational, low-complexity feature that establishes the route and basic page structure for future scorekeeping features (timer, scores, controls).

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js strict mode  
**Primary Dependencies**: Next.js 14+, React 18+, Tailwind CSS 3.x  
**Storage**: N/A (client-side page, no persistence)  
**Testing**: Jest + React Testing Library (unit tests), Playwright (E2E tests)  
**Target Platform**: Web (responsive: 320px mobile to 1920px desktop)  
**Project Type**: Web application / SPA (Next.js frontend)  
**Performance Goals**: Core Web Vitals - LCP < 2.5s, FID < 100ms, CLS < 0.1  
**Constraints**: WCAG 2.1 AA accessibility compliance (mandatory); no UI chrome (no header/nav/title); truly blank/empty canvas  
**Scale/Scope**: Single page route with minimal structure; ~50-100 lines of component code estimated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Component-Driven Architecture ✅
- **Requirement**: Every feature built as reusable, independently testable React component with clear props
- **Status**: PASS - `ScoreKeepingCanvas` (or `BlankScorekeeper`) component is stateless, receives minimal props, can be tested independently
- **Implementation**: Single component for blank page; no subcomponents (intentionally minimal)

### Principle II: Type Safety (NON-NEGOTIABLE) ✅
- **Requirement**: TypeScript strict mode; all functions have explicit parameter/return types; no `any` types
- **Status**: PASS - Component has typed props; page route typed; no `any` types
- **Implementation**: `interface BlankScoreKeeperProps { /* minimal or empty */ }` in TypeScript; strict tsconfig.json enforced

### Principle III: Test-Driven Feature Development ✅
- **Requirement**: Tests written and approved BEFORE implementation; unit + integration tests; 80% coverage critical paths
- **Status**: PASS - Tests written first; unit test for component rendering; integration test for route navigation
- **Implementation**: Jest tests for component; Playwright E2E test for page load and responsiveness

### Principle IV: API Contract Enforcement ⚠️
- **Requirement**: Documented contracts for backend APIs; integration tests before consumption
- **Status**: NOT APPLICABLE - Blank page has no backend dependencies; page is entirely client-side
- **Justification**: This feature is purely UI/layout. No external API consumption. Future features will invoke contracts

### Principle V: Performance & Accessibility ✅
- **Requirement**: Core Web Vitals targets; WCAG 2.1 AA compliance; real-time updates don't block rendering
- **Status**: PASS - Page is static (instant load < 1s); semantic HTML; ARIA labels; keyboard navigation tested
- **Implementation**: Minimal CSS; critical CSS inlined; Lighthouse audit ≥ 90 accessibility score

### Principle VI: Dependency Management & Versioning ✅
- **Requirement**: Semantic Versioning; dependencies pinned; security updates within 1 week
- **Status**: PASS - Uses existing Next.js + Tailwind stack; no new dependencies added
- **Implementation**: No changes to package.json needed; existing versions maintained

**Constitution Check Result**: ✅ PASS - All applicable principles satisfied; no violations requiring justification

---

## Project Structure

### Documentation (this feature)

```text
specs/003-blank-scorekeeping-canvas/
├── plan.md                      # This file (Phase 0-1 output)
├── research.md                  # Phase 0 output (not needed; no discoveries)
├── data-model.md                # Phase 1 output (PageProps type)
├── quickstart.md                # Phase 1 output (implementation steps)
├── contracts/                   # Phase 1 output (not applicable; no APIs)
│   └── README.md
└── checklists/
    └── requirements.md
```

### Source Code (frontend/web)

```text
frontend/web/
├── src/
│   ├── pages/
│   │   └── scorekeeping.tsx                    # Route: /scorekeeping
│   ├── components/
│   │   └── scorekeeping/
│   │       ├── BlankScoreKeepingCanvas.tsx     # Main component
│   │       └── __tests__/
│   │           ├── BlankScoreKeepingCanvas.test.tsx    # Unit test
│   │           └── BlankScoreKeepingCanvas.integration.test.tsx  # E2E
│   ├── types/
│   │   └── scorekeeping.types.ts               # TypeScript types (minimal)
│   └── styles/
│       └── globals.css                         # Already exists; no changes
├── tests/
│   └── e2e/
│       └── scorekeeping-page.spec.ts           # Playwright E2E test
└── package.json                                 # No changes
```

**Structure Decision**: Minimal web application. Blank page is added to existing Next.js Pages Router structure. Component is intentionally stateless and simple. No subcomponents, no complex logic. Tests co-located with component for clarity.

---

## Complexity Tracking

| Consideration | Addressed | Notes |
|---|---|---|
| **Blank Canvas Definition** | Via clarification: no header/nav/title, just white space | Reduces scope; clearly bounded |
| **Responsive Design** | Tailwind responsive utilities (mobile-first approach) | No custom breakpoints; use Tailwind defaults |
| **Accessibility (WCAG 2.1 AA)** | Semantic HTML (`<main>`), ARIA labels, keyboard focus | Simple page = easy to make accessible |
| **TypeScript Strict Mode** | Minimal types needed (almost always inferred) | Component may have no props; page route is typed |
| **Performance (Core Web Vitals)** | Static page renders instantly; no JS blocking | Minimal CSS; no animations; critical path optimized |
| **Design System (Tailwind)** | Inherit from existing theme; no new tokens | Use existing `tailwind.config.ts` |
| **Error Handling** | Propagate to global error boundary | No feature-specific error page needed |

---

## Phase 0: Research

**Status**: ✅ COMPLETE (No unknowns; all clarifications resolved)

### Research Completed in `/speckit.clarify`

The clarification phase resolved all ambiguities:

1. **Design System**: Use existing Tailwind `tailwind.config.ts` theme tokens (colors, fonts, spacing)
2. **Blank Canvas**: No header, navigation, title, or UI chrome—just empty white space
3. **Error Handling**: Propagate to global Next.js error boundary; no feature-specific handling

**Conclusion**: No additional research needed. All technical decisions are clear. Proceeding to Phase 1 design.

---

## Phase 1: Design & Contracts

### 1.1 Data Model: Minimal Type Definitions

See [data-model.md](data-model.md) for complete type definitions.

**Key Types**:

```typescript
// types/scorekeeping.types.ts

// Minimal types for blank page
interface BlankScoreKeeperProps {
  // Intentionally empty for this version
  // Future: could accept game ID, initial state, etc.
}

// Page component receives no props in basic implementation
// Can extend later when features are added
```

**Entities**:

- **BlankScoreKeepingCanvas**: The root component representing the empty page. No state. No children. Static render.
- **Page Route**: `/scorekeeping` - Next.js page file that imports and renders component

**No database entities, no API data models—entirely client-side rendering.**

### 1.2 API Contracts

**Status**: NOT APPLICABLE (v1 is client-only)

See [contracts/README.md](contracts/README.md) for explanation.

### 1.3 Implementation Quickstart

See [quickstart.md](quickstart.md) for step-by-step guide.

**Key Steps** (Phase 1 summary):

1. Create TypeScript types: `src/types/scorekeeping.types.ts` (minimal)
2. Create component: `src/components/scorekeeping/BlankScoreKeepingCanvas.tsx` (~30 lines)
3. Create page route: `src/pages/scorekeeping.tsx` (~20 lines)
4. Write unit test for component rendering
5. Write E2E test for page navigation and responsiveness
6. Run Lighthouse audit; verify accessibility ≥ 90
7. Verify responsive design on 320px, 768px, 1920px viewports

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Test File**: `src/components/scorekeeping/__tests__/BlankScoreKeepingCanvas.test.tsx`

```typescript
describe('BlankScoreKeepingCanvas', () => {
  it('renders without crashing', () => {
    render(<BlankScoreKeepingCanvas />);
    // Component exists and no errors
  });

  it('renders as semantic main element', () => {
    render(<BlankScoreKeepingCanvas />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<BlankScoreKeepingCanvas />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('className', expect.stringContaining('bg-'));
  });
});
```

**Expected Coverage**: 100% (4 lines of code → easy to cover)

### E2E Tests (Playwright)

**Test File**: `tests/e2e/scorekeeping-page.spec.ts`

```typescript
test.describe('Scorekeeping Page', () => {
  test('loads page at /scorekeeping route', async ({ page }) => {
    await page.goto('/scorekeeping');
    expect(page).toHaveTitle('Scorekeeping'); // or just URL check
  });

  test('renders blank canvas without errors', async ({ page }) => {
    await page.goto('/scorekeeping');
    // No console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    // After load: expect consoleErrors.length === 0
  });

  test('responsive layout on mobile (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/scorekeeping');
    // No horizontal scroll
    const body = page.locator('body');
    const boundingBox = await body.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(320);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/scorekeeping');
    // Can tab through page without trapping focus
    // (page has minimal interactive elements)
  });
});
```

**Expected Results**: All tests pass; page loads in < 1 second; no console errors

---

## Performance & Accessibility Targets

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 1 second (target 2.5s, aiming for instant)
- **FID (First Input Delay)**: < 50ms (target 100ms, minimal UI = instant)
- **CLS (Cumulative Layout Shift)**: 0 (target 0.1, static page = no shift)

### Lighthouse Audit

- **Accessibility**: ≥ 90
- **Performance**: ≥ 90
- **Best Practices**: ≥ 90

### WCAG 2.1 AA

- ✅ Text/background contrast ≥ 4.5:1
- ✅ Interactive elements keyboard accessible
- ✅ Focus visible on all focusable elements
- ✅ Semantic HTML tags (`<main>`, proper heading hierarchy if any)
- ✅ ARIA labels where needed

---

## Deployment & Rollout

**Approach**: Direct deployment to production (no feature flags needed; feature is safe and minimal)

1. Create feature branch: `003-blank-scorekeeping-canvas`
2. Implement per Phase 1 steps
3. Run tests locally; verify Lighthouse scores
4. Open PR; peer review
5. Merge to main; deploy

**Rollback**: If needed, remove route file and component; feature is additive and isolated

---

## Next Steps

1. ✅ Specification clarified (3 ambiguities resolved)
2. ✅ Implementation plan created
3. ⏭️ **NEXT**: Run `/speckit.tasks` to generate task list for implementation

---

**Version**: 1.0.0 | **Created**: 2026-04-13 | **Status**: Ready for Phase 2 (Task Generation)
