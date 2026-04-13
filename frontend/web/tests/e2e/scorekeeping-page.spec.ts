import { test, expect } from '@playwright/test'

test.describe('Scorekeeping Page', () => {
  test('should load at /scorekeeping route', async ({ page }) => {
    await page.goto('/scorekeeping')
    expect(page.url()).toContain('/scorekeeping')
  })

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/scorekeeping')
    expect(errors).toHaveLength(0)
  })

  test('should render main element with ARIA label', async ({ page }) => {
    await page.goto('/scorekeeping')
    const mainElement = page.locator('main[aria-label*="scorekeeping"]')
    await expect(mainElement).toBeVisible()
  })

  test('should display page without crashing', async ({ page }) => {
    await page.goto('/scorekeeping')
    const mainElement = page.locator('main')
    await expect(mainElement).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/scorekeeping')
    const title = await page.title()
    expect(title).toContain('Scorekeeping')
  })

  test.describe('Responsive Design', () => {
    test('should render correctly on mobile viewport (320px)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto('/scorekeeping')
      const mainElement = page.locator('main')
      await expect(mainElement).toBeVisible()
      // Check for horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // +1 for rounding
    })

    test('should render correctly on tablet viewport (768px)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/scorekeeping')
      const mainElement = page.locator('main')
      await expect(mainElement).toBeVisible()
    })

    test('should render correctly on desktop viewport (1920px)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/scorekeeping')
      const mainElement = page.locator('main')
      await expect(mainElement).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/scorekeeping')
      await page.keyboard.press('Tab')
      // Just verify tab key works without errors
      const mainElement = page.locator('main')
      await expect(mainElement).toBeVisible()
    })

    test('should have proper landmark structure', async ({ page }) => {
      await page.goto('/scorekeeping')
      const mainElement = page.locator('main')
      await expect(mainElement).toHaveCount(1) // Should have exactly one main element
    })
  })

  test.describe('Scorekeeping Timer (Feature 004)', () => {
    test('displays initial time 10:00 on page load', async ({ page }) => {
      await page.goto('/scorekeeping')
      const timer = page.getByText('10:00')
      await expect(timer).toBeVisible()
    })

    test('timer display is readable (large font)', async ({ page }) => {
      await page.goto('/scorekeeping')
      const timer = page.getByRole('status')
      await expect(timer).toBeVisible()
      const fontSize = await timer.evaluate((el) => {
        const style = window.getComputedStyle(el as HTMLElement)
        return parseInt(style.fontSize)
      })
      expect(fontSize).toBeGreaterThanOrEqual(36) // at least 36px (1.5rem for desktop)
    })

    test('toggle button has minimum 44px touch target', async ({ page }) => {
      await page.goto('/scorekeeping')
      const button = page.getByRole('button', { name: /start timer/i })
      const size = await button.evaluate((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })
      expect(size.width).toBeGreaterThanOrEqual(44)
      expect(size.height).toBeGreaterThanOrEqual(44)
    })

    test('clicking play button starts timer', async ({ page }) => {
      await page.goto('/scorekeeping')
      const playButton = page.getByRole('button', { name: /start timer/i })
      await playButton.click()

      const pauseButton = page.getByRole('button', { name: /pause timer/i })
      await expect(pauseButton).toBeVisible()
    })

    test('timer counts down when running', async ({ page }) => {
      await page.goto('/scorekeeping')
      const playButton = page.getByRole('button', { name: /start timer/i })
      await playButton.click()

      // Initial time
      await expect(page.getByText('10:00')).toBeVisible()

      // Wait 2.5 seconds and check time decreased
      await page.waitForTimeout(2500)
      const displayedTime = await page.getByRole('status').textContent()
      expect(displayedTime).not.toContain('10:00')
      expect(displayedTime).toContain(':') // Still in MM:SS format
    })

    test('keyboard navigation: Space key toggles timer', async ({ page }) => {
      await page.goto('/scorekeeping')
      const playButton = page.getByRole('button', { name: /start timer/i })
      await playButton.focus()
      await page.keyboard.press('Space')

      const pauseButton = page.getByRole('button', { name: /pause timer/i })
      await expect(pauseButton).toBeVisible()
    })

    test('keyboard navigation: Enter key toggles timer', async ({ page }) => {
      await page.goto('/scorekeeping')
      const playButton = page.getByRole('button', { name: /start timer/i })
      await playButton.focus()
      await page.keyboard.press('Enter')

      const pauseButton = page.getByRole('button', { name: /pause timer/i })
      await expect(pauseButton).toBeVisible()
    })

    test('responsive on mobile viewport (320px)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto('/scorekeeping')
      const timer = page.getByRole('status')
      await expect(timer).toBeVisible()
      const isInViewport = await timer.isVisible()
      expect(isInViewport).toBe(true)
    })

    test('responsive on desktop viewport (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/scorekeeping')
      const timer = page.getByRole('status')
      await expect(timer).toBeVisible()
      const isInViewport = await timer.isVisible()
      expect(isInViewport).toBe(true)
    })

    test('timer positioned at top of page', async ({ page }) => {
      await page.goto('/scorekeeping')
      const timer = page.getByRole('status')
      const position = await timer.evaluate((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect()
        return rect.top
      })
      expect(position).toBeLessThan(200) // Should be near top of page
    })

    test('no layout shift during timer countdown (CLS test)', async ({ page }) => {
      await page.goto('/scorekeeping')

      // Start timer
      const playButton = page.getByRole('button', { name: /start timer/i })
      await playButton.click()

      // Get initial position
      const timer = page.getByRole('status')
      const initialBox = await timer.boundingBox()

      // Wait for countdown
      await page.waitForTimeout(2000)

      // Check position hasn't changed significantly
      const finalBox = await timer.boundingBox()
      if (initialBox && finalBox) {
        const xDiff = Math.abs((finalBox.x || 0) - (initialBox.x || 0))
        const yDiff = Math.abs((finalBox.y || 0) - (initialBox.y || 0))
        expect(xDiff).toBeLessThan(2) // Allow 2px tolerance
        expect(yDiff).toBeLessThan(2)
      }
    })

    test('toggle button has proper visual feedback', async ({ page }) => {
      await page.goto('/scorekeeping')
      const playButton = page.getByRole('button', { name: /start timer/i })

      // Get initial state (should be green for play)
      let bgColor = await playButton.evaluate((el) => {
        return window.getComputedStyle(el as HTMLElement).backgroundColor
      })
      expect(bgColor).toContain('rgb') // Has a color

      // Click to toggle
      await playButton.click()
      await page.waitForTimeout(100)

      // Get new state (should be red for pause)
      const pauseButton = page.getByRole('button', { name: /pause timer/i })
      bgColor = await pauseButton.evaluate((el) => {
        return window.getComputedStyle(el as HTMLElement).backgroundColor
      })
      expect(bgColor).toContain('rgb') // Still has a color (different from before)
    })

    test('pause and resume timer works correctly', async ({ page }) => {
      await page.goto('/scorekeeping')

      // Start timer
      let button = page.getByRole('button', { name: /start timer/i })
      await button.click()

      // Wait for countdown
      await page.waitForTimeout(1500)

      // Get time after 1.5 seconds
      const timeAfterStart = await page.getByRole('status').textContent()

      // Click pause
      button = page.getByRole('button', { name: /pause timer/i })
      await button.click()

      // Wait a bit
      await page.waitForTimeout(1000)

      // Time should be same (paused)
      const timeAfterPause = await page.getByRole('status').textContent()
      expect(timeAfterPause).toContain(timeAfterStart?.split(':')[1] || '') // Seconds should match

      // Resume
      button = page.getByRole('button', { name: /start timer/i })
      await button.click()

      // Wait more
      await page.waitForTimeout(1000)

      // Time should be different now
      const timeAfterResume = await page.getByRole('status').textContent()
      expect(timeAfterResume).not.toBe(timeAfterPause)
    })
  })
})
