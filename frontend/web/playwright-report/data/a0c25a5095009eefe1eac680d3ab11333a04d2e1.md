# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scorekeeping-page.spec.ts >> Scorekeeping Page >> should render main element with ARIA label
- Location: tests/e2e/scorekeeping-page.spec.ts:21:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main[aria-label*="scorekeeping"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('main[aria-label*="scorekeeping"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - region "Game timer control" [ref=e3]:
      - 'generic "Timer: 10:00" [ref=e4]':
        - generic [ref=e5]:
          - status "10 minutes 0 seconds remaining" [ref=e6]: 10:00
          - generic [ref=e7]: ○ Paused
      - button "Start timer" [ref=e8]:
        - img [ref=e9]
      - paragraph [ref=e11]: Click play to start
    - main "Scorekeeping canvas" [ref=e13]
  - button "Open Next.js Dev Tools" [ref=e19] [cursor=pointer]:
    - img [ref=e20]
  - alert [ref=e23]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('Scorekeeping Page', () => {
  4   |   test('should load at /scorekeeping route', async ({ page }) => {
  5   |     await page.goto('/scorekeeping')
  6   |     expect(page.url()).toContain('/scorekeeping')
  7   |   })
  8   | 
  9   |   test('should not have console errors', async ({ page }) => {
  10  |     const errors: string[] = []
  11  |     page.on('console', (msg) => {
  12  |       if (msg.type() === 'error') {
  13  |         errors.push(msg.text())
  14  |       }
  15  |     })
  16  | 
  17  |     await page.goto('/scorekeeping')
  18  |     expect(errors).toHaveLength(0)
  19  |   })
  20  | 
  21  |   test('should render main element with ARIA label', async ({ page }) => {
  22  |     await page.goto('/scorekeeping')
  23  |     const mainElement = page.locator('main[aria-label*="scorekeeping"]')
> 24  |     await expect(mainElement).toBeVisible()
      |                               ^ Error: expect(locator).toBeVisible() failed
  25  |   })
  26  | 
  27  |   test('should display page without crashing', async ({ page }) => {
  28  |     await page.goto('/scorekeeping')
  29  |     const mainElement = page.locator('main')
  30  |     await expect(mainElement).toBeVisible()
  31  |   })
  32  | 
  33  |   test('should have proper meta tags', async ({ page }) => {
  34  |     await page.goto('/scorekeeping')
  35  |     const title = await page.title()
  36  |     expect(title).toContain('Scorekeeping')
  37  |   })
  38  | 
  39  |   test.describe('Responsive Design', () => {
  40  |     test('should render correctly on mobile viewport (320px)', async ({
  41  |       page,
  42  |     }) => {
  43  |       await page.setViewportSize({ width: 320, height: 568 })
  44  |       await page.goto('/scorekeeping')
  45  |       const mainElement = page.locator('main')
  46  |       await expect(mainElement).toBeVisible()
  47  |       // Check for horizontal scroll
  48  |       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  49  |       const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  50  |       expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // +1 for rounding
  51  |     })
  52  | 
  53  |     test('should render correctly on tablet viewport (768px)', async ({
  54  |       page,
  55  |     }) => {
  56  |       await page.setViewportSize({ width: 768, height: 1024 })
  57  |       await page.goto('/scorekeeping')
  58  |       const mainElement = page.locator('main')
  59  |       await expect(mainElement).toBeVisible()
  60  |     })
  61  | 
  62  |     test('should render correctly on desktop viewport (1920px)', async ({
  63  |       page,
  64  |     }) => {
  65  |       await page.setViewportSize({ width: 1920, height: 1080 })
  66  |       await page.goto('/scorekeeping')
  67  |       const mainElement = page.locator('main')
  68  |       await expect(mainElement).toBeVisible()
  69  |     })
  70  |   })
  71  | 
  72  |   test.describe('Accessibility', () => {
  73  |     test('should be keyboard navigable', async ({ page }) => {
  74  |       await page.goto('/scorekeeping')
  75  |       await page.keyboard.press('Tab')
  76  |       // Just verify tab key works without errors
  77  |       const mainElement = page.locator('main')
  78  |       await expect(mainElement).toBeVisible()
  79  |     })
  80  | 
  81  |     test('should have proper landmark structure', async ({ page }) => {
  82  |       await page.goto('/scorekeeping')
  83  |       const mainElement = page.locator('main')
  84  |       await expect(mainElement).toHaveCount(1) // Should have exactly one main element
  85  |     })
  86  |   })
  87  | 
  88  |   test.describe('Scorekeeping Timer (Feature 004)', () => {
  89  |     test('displays initial time 10:00 on page load', async ({ page }) => {
  90  |       await page.goto('/scorekeeping')
  91  |       const timer = page.getByText('10:00')
  92  |       await expect(timer).toBeVisible()
  93  |     })
  94  | 
  95  |     test('timer display is readable (large font)', async ({ page }) => {
  96  |       await page.goto('/scorekeeping')
  97  |       const timer = page.getByRole('status')
  98  |       await expect(timer).toBeVisible()
  99  |       const fontSize = await timer.evaluate((el) => {
  100 |         const style = window.getComputedStyle(el as HTMLElement)
  101 |         return parseInt(style.fontSize)
  102 |       })
  103 |       expect(fontSize).toBeGreaterThanOrEqual(36) // at least 36px (1.5rem for desktop)
  104 |     })
  105 | 
  106 |     test('toggle button has minimum 44px touch target', async ({ page }) => {
  107 |       await page.goto('/scorekeeping')
  108 |       const button = page.getByRole('button', { name: /start timer/i })
  109 |       const size = await button.evaluate((el) => {
  110 |         const rect = (el as HTMLElement).getBoundingClientRect()
  111 |         return { width: rect.width, height: rect.height }
  112 |       })
  113 |       expect(size.width).toBeGreaterThanOrEqual(44)
  114 |       expect(size.height).toBeGreaterThanOrEqual(44)
  115 |     })
  116 | 
  117 |     test('clicking play button starts timer', async ({ page }) => {
  118 |       await page.goto('/scorekeeping')
  119 |       const playButton = page.getByRole('button', { name: /start timer/i })
  120 |       await playButton.click()
  121 | 
  122 |       const pauseButton = page.getByRole('button', { name: /pause timer/i })
  123 |       await expect(pauseButton).toBeVisible()
  124 |     })
```