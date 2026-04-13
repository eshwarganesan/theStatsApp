# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scorekeeping-page.spec.ts >> Scorekeeping Page >> Responsive Design >> should render correctly on desktop viewport (1920px)
- Location: tests/e2e/scorekeeping-page.spec.ts:62:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 2 elements:
    1) <main class="w-full h-screen flex flex-col bg-white">…</main> aka getByRole('main').filter({ hasText: ':00○ PausedClick play to start' })
    2) <main role="main" aria-label="Scorekeeping canvas" class="w-full h-screen bg-white flex items-center justify-center"></main> aka getByRole('main', { name: 'Scorekeeping canvas' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('main')

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
  24  |     await expect(mainElement).toBeVisible()
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
> 68  |       await expect(mainElement).toBeVisible()
      |                                 ^ Error: expect(locator).toBeVisible() failed
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
  125 | 
  126 |     test('timer counts down when running', async ({ page }) => {
  127 |       await page.goto('/scorekeeping')
  128 |       const playButton = page.getByRole('button', { name: /start timer/i })
  129 |       await playButton.click()
  130 | 
  131 |       // Initial time
  132 |       await expect(page.getByText('10:00')).toBeVisible()
  133 | 
  134 |       // Wait 2.5 seconds and check time decreased
  135 |       await page.waitForTimeout(2500)
  136 |       const displayedTime = await page.getByRole('status').textContent()
  137 |       expect(displayedTime).not.toContain('10:00')
  138 |       expect(displayedTime).toContain(':') // Still in MM:SS format
  139 |     })
  140 | 
  141 |     test('keyboard navigation: Space key toggles timer', async ({ page }) => {
  142 |       await page.goto('/scorekeeping')
  143 |       const playButton = page.getByRole('button', { name: /start timer/i })
  144 |       await playButton.focus()
  145 |       await page.keyboard.press('Space')
  146 | 
  147 |       const pauseButton = page.getByRole('button', { name: /pause timer/i })
  148 |       await expect(pauseButton).toBeVisible()
  149 |     })
  150 | 
  151 |     test('keyboard navigation: Enter key toggles timer', async ({ page }) => {
  152 |       await page.goto('/scorekeeping')
  153 |       const playButton = page.getByRole('button', { name: /start timer/i })
  154 |       await playButton.focus()
  155 |       await page.keyboard.press('Enter')
  156 | 
  157 |       const pauseButton = page.getByRole('button', { name: /pause timer/i })
  158 |       await expect(pauseButton).toBeVisible()
  159 |     })
  160 | 
  161 |     test('responsive on mobile viewport (320px)', async ({ page }) => {
  162 |       await page.setViewportSize({ width: 320, height: 568 })
  163 |       await page.goto('/scorekeeping')
  164 |       const timer = page.getByRole('status')
  165 |       await expect(timer).toBeVisible()
  166 |       const isInViewport = await timer.isVisible()
  167 |       expect(isInViewport).toBe(true)
  168 |     })
```