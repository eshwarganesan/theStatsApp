# Quickstart: Blank Scorekeeping Canvas Implementation

**Feature**: Blank Scorekeeping Canvas  
**Date**: 2026-04-13  
**Audience**: Developers implementing the blank page

## Overview

This guide provides step-by-step instructions for building a minimal, blank scorekeeping page in Next.js with TypeScript and Tailwind CSS. The page is empty (no header/nav/title), responsive, accessible, and ready for future features.

**Estimated time**: 1-2 hours (including tests and Lighthouse audit)

## Prerequisites

- Node.js 18+ and npm
- Next.js 14+ (already configured in theStatsApp)
- TypeScript 5.x configured
- Tailwind CSS 3.x configured
- Jest + React Testing Library
- Playwright (for E2E tests)

## Step 1: Create TypeScript Types (Optional—May Not Be Needed)

**File**: `src/types/scorekeeping.types.ts`

Since the blank page is stateless and receives no props, you can skip this file entirely OR create it as documentation for future features.

**Minimal version** (if creating the file):

```typescript
// src/types/scorekeeping.types.ts

export interface BlankScoreKeeperProps {
  // Intentionally empty for v1
  // Future versions can add props as features are built
}

// Export empty interface so file exists for consistency
export type ScoreKeeperCanvasType = {
  route: '/scorekeeping';
  accessible: true;
  responsive: true;
};
```

**Alternative**: Skip this file and add types later when features require state/props. ✅ Recommended for MVP.

## Step 2: Create Component

**File**: `src/components/scorekeeping/BlankScoreKeepingCanvas.tsx`

Create a minimal, stateless component that renders an empty `<main>` element.

```typescript
import React from 'react';

interface BlankScoreKeeperProps {
  // Intentionally empty
}

/**
 * BlankScoreKeepingCanvas
 * 
 * A minimal, stateless component representing the empty scorekeeping page.
 * This component serves as the foundation for future scorekeeping features
 * (timer, scores, controls). In v1, it renders as a simple blank canvas.
 */
export const BlankScoreKeepingCanvas: React.FC<BlankScoreKeeperProps> = () => {
  return (
    <main
      className="w-full h-screen bg-white flex items-center justify-center"
      role="main"
      aria-label="Scorekeeping canvas"
    >
      {/* Intentionally blank - ready for future features */}
    </main>
  );
};

export default BlankScoreKeepingCanvas;
```

**Notes**:
- `w-full h-screen` ensures page fills viewport
- `bg-white` uses Tailwind theme color (can use `bg-slate-50` or other theme color)
- `flex items-center justify-center` centers future content (optional; can be plain white space)
- `role="main"` and `aria-label` provide accessibility

## Step 3: Create Page Route

**File**: `src/pages/scorekeeping.tsx`

Create a Next.js page that imports and renders the component.

```typescript
import React from 'react';
import Head from 'next/head';
import { BlankScoreKeepingCanvas } from '@/components/scorekeeping/BlankScoreKeepingCanvas';

/**
 * Scorekeeping Page
 * 
 * Route: /scorekeeping
 * This page serves as the entry point for the scorekeeping application.
 * It renders a blank canvas ready for scorekeeping features (timer, scores, controls).
 */
export default function ScoreKeepingPage() {
  return (
    <>
      <Head>
        <title>Scorekeeping - theStatsApp</title>
        <meta name="description" content="Basketball game scorekeeping and stat tracking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <BlankScoreKeepingCanvas />
    </>
  );
}
```

**Notes**:
- `<Head>` sets page title and meta tags
- Viewport meta tag enables responsive design
- Component is mounted without props

## Step 4: Write Unit Test

**File**: `src/components/scorekeeping/__tests__/BlankScoreKeepingCanvas.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { BlankScoreKeepingCanvas } from '../BlankScoreKeepingCanvas';

describe('BlankScoreKeepingCanvas', () => {
  it('renders without crashing', () => {
    render(<BlankScoreKeepingCanvas />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('has accessible ARIA label', () => {
    render(<BlankScoreKeepingCanvas />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label', 'Scorekeeping canvas');
  });

  it('is responsive (has w-full class)', () => {
    render(<BlankScoreKeepingCanvas />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('w-full', 'h-screen');
  });

  it('is accessible with proper contrast (bg-white)', () => {
    render(<BlankScoreKeepingCanvas />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('bg-white');
    // Contrast verified via Lighthouse audit
  });
});
```

**Run tests**:
```bash
npm test -- BlankScoreKeepingCanvas.test.tsx --watch
```

**Expected result**: All tests pass ✅

## Step 5: Write E2E Test

**File**: `tests/e2e/scorekeeping-page.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Scorekeeping Page', () => {
  test('loads page at /scorekeeping route', async ({ page }) => {
    await page.goto('/scorekeeping');
    // Page loaded successfully
    expect(page.url()).toContain('/scorekeeping');
  });

  test('page title is set correctly', async ({ page }) => {
    await page.goto('/scorekeeping');
    expect(page).toHaveTitle('Scorekeeping - theStatsApp');
  });

  test('renders with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/scorekeeping');
    expect(errors).toHaveLength(0);
  });

  test('main element is accessible', async ({ page }) => {
    await page.goto('/scorekeeping');
    const main = page.locator('main');
    await expect(main).toBeVisible();
    // Check ARIA label
    const ariaLabel = await main.getAttribute('aria-label');
    expect(ariaLabel).toBe('Scorekeeping canvas');
  });

  test('page is responsive on mobile (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/scorekeeping');

    const main = page.locator('main');
    const box = await main.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(320);
    // No horizontal scrollbar
  });

  test('page is responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/scorekeeping');

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('page is responsive on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/scorekeeping');

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/scorekeeping');
    const main = page.locator('main');

    // Tab to main element (no focusable children = should stay here)
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    // Focus should be manageable (no traps)
  });
});
```

**Run E2E tests**:
```bash
npx playwright test tests/e2e/scorekeeping-page.spec.ts
```

**Expected result**: All tests pass ✅

## Step 6: Run Accessibility & Performance Audit

### Lighthouse Audit

1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000/scorekeeping`
3. Open Chrome DevTools (F12)
4. Click "Lighthouse" tab
5. Click "Analyze page load"
6. Review scores:
   - **Accessibility**: Target ≥ 90
   - **Performance**: Target ≥ 90
   - **Best Practices**: Target ≥ 90

**Expected result**: All scores ≥ 90 ✅

### axe DevTools Audit (Optional)

1. Install [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
2. Open to `/scorekeeping`
3. Click axe icon → "Scan ALL of my page"
4. Review results: Target 0 violations, minimal warnings

**Expected result**: 0 critical violations ✅

### Manual Accessibility Check

**Keyboard Navigation**:
- Press Tab key; focus should move predictably
- Page should not trap keyboard focus

**Screen Reader** (optional, but recommended):
- macOS: Enable VoiceOver (Cmd+F5)
- Windows: Enable NVDA
- Test: Page title announced, main element identified

**Expected result**: Page reads and navigates logically ✅

## Step 7: Responsive Testing

Test on multiple viewports using Chrome DevTools:

1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Cmd+Shift+M)
3. Test viewports:
   - **Mobile** (360x640): Verify no horizontal scroll
   - **Tablet** (768x1024): Verify layout is readable
   - **Desktop** (1920x1080): Verify efficient space use

**Expected result**: Page looks good on all sizes ✅

## Step 8: Commit & Push

```bash
# Stage all files
git add src/components/scorekeeping/ src/pages/scorekeeping.tsx tests/e2e/scorekeeping-page.spec.ts

# Commit with descriptive message
git commit -m "feat: implement blank scorekeeping canvas page

- Create minimal blank page at /scorekeeping route
- No header/nav/title - just empty white canvas
- Use inherited Tailwind theme colors/typography
- Fully responsive (320px-1920px)
- WCAG 2.1 AA accessible
- Unit tests + E2E tests
- Lighthouse audit: Accessibility ≥90, Performance ≥90"

# Push to feature branch
git push origin 003-blank-scorekeeping-canvas
```

## Deployment Checklist

- [ ] Unit tests pass (`npm test`)
- [ ] E2E tests pass (`npx playwright test`)
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Lighthouse scores: Accessibility ≥ 90, Performance ≥ 90
- [ ] No console errors when loading `/scorekeeping`
- [ ] Responsive design tested on 320px, 768px, 1920px
- [ ] Keyboard navigation working
- [ ] Page loads within 1 second
- [ ] Git branch is clean and up-to-date
- [ ] PR created and reviewed
- [ ] Merge to main

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Page doesn't render | Check `pages/scorekeeping.tsx` path and import; ensure component exports correctly |
| Tailwind classes not applied | Verify `tailwind.config.ts` includes `src/` paths; rebuild with `npm run dev` |
| Tests fail with "not wrapped in act" | Use `waitFor()` from React Testing Library or wrap state updates in `act()` |
| Lighthouse low score | Remove CSS animation, defer non-critical CSS, minify assets (should be automatic) |
| E2E test times out | Increase Playwright timeout; check dev server is running (`npm run dev`) |
| Page shows 404 | Verify route file is at correct path `src/pages/scorekeeping.tsx`; restart dev server |

## Success Criteria

✅ All tests pass  
✅ Lighthouse: Accessibility ≥ 90, Performance ≥ 90  
✅ No console errors  
✅ Responsive on 320px-1920px  
✅ Keyboard accessible  
✅ Page loads in < 1 second  
✅ PR approved and merged  

---

**Version**: 1.0.0 | **Created**: 2026-04-13
