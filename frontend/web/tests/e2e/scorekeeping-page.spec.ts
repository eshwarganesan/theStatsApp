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
})
