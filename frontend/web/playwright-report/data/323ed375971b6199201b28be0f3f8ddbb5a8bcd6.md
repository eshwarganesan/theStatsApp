# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scorekeeping-page.spec.ts >> Scorekeeping Page >> Scorekeeping Timer (Feature 004) >> toggle button has proper visual feedback
- Location: tests/e2e/scorekeeping-page.spec.ts:213:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "rgb"
Received string:    "lab(70.552101 -66.514702 45.807301)"
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
  - alert [ref=e25]
```

# Test source

```ts
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
  169 | 
  170 |     test('responsive on desktop viewport (1920px)', async ({ page }) => {
  171 |       await page.setViewportSize({ width: 1920, height: 1080 })
  172 |       await page.goto('/scorekeeping')
  173 |       const timer = page.getByRole('status')
  174 |       await expect(timer).toBeVisible()
  175 |       const isInViewport = await timer.isVisible()
  176 |       expect(isInViewport).toBe(true)
  177 |     })
  178 | 
  179 |     test('timer positioned at top of page', async ({ page }) => {
  180 |       await page.goto('/scorekeeping')
  181 |       const timer = page.getByRole('status')
  182 |       const position = await timer.evaluate((el) => {
  183 |         const rect = (el as HTMLElement).getBoundingClientRect()
  184 |         return rect.top
  185 |       })
  186 |       expect(position).toBeLessThan(200) // Should be near top of page
  187 |     })
  188 | 
  189 |     test('no layout shift during timer countdown (CLS test)', async ({ page }) => {
  190 |       await page.goto('/scorekeeping')
  191 | 
  192 |       // Start timer
  193 |       const playButton = page.getByRole('button', { name: /start timer/i })
  194 |       await playButton.click()
  195 | 
  196 |       // Get initial position
  197 |       const timer = page.getByRole('status')
  198 |       const initialBox = await timer.boundingBox()
  199 | 
  200 |       // Wait for countdown
  201 |       await page.waitForTimeout(2000)
  202 | 
  203 |       // Check position hasn't changed significantly
  204 |       const finalBox = await timer.boundingBox()
  205 |       if (initialBox && finalBox) {
  206 |         const xDiff = Math.abs((finalBox.x || 0) - (initialBox.x || 0))
  207 |         const yDiff = Math.abs((finalBox.y || 0) - (initialBox.y || 0))
  208 |         expect(xDiff).toBeLessThan(2) // Allow 2px tolerance
  209 |         expect(yDiff).toBeLessThan(2)
  210 |       }
  211 |     })
  212 | 
  213 |     test('toggle button has proper visual feedback', async ({ page }) => {
  214 |       await page.goto('/scorekeeping')
  215 |       const playButton = page.getByRole('button', { name: /start timer/i })
  216 | 
  217 |       // Get initial state (should be green for play)
  218 |       let bgColor = await playButton.evaluate((el) => {
  219 |         return window.getComputedStyle(el as HTMLElement).backgroundColor
  220 |       })
> 221 |       expect(bgColor).toContain('rgb') // Has a color
      |                       ^ Error: expect(received).toContain(expected) // indexOf
  222 | 
  223 |       // Click to toggle
  224 |       await playButton.click()
  225 |       await page.waitForTimeout(100)
  226 | 
  227 |       // Get new state (should be red for pause)
  228 |       const pauseButton = page.getByRole('button', { name: /pause timer/i })
  229 |       bgColor = await pauseButton.evaluate((el) => {
  230 |         return window.getComputedStyle(el as HTMLElement).backgroundColor
  231 |       })
  232 |       expect(bgColor).toContain('rgb') // Still has a color (different from before)
  233 |     })
  234 | 
  235 |     test('pause and resume timer works correctly', async ({ page }) => {
  236 |       await page.goto('/scorekeeping')
  237 | 
  238 |       // Start timer
  239 |       let button = page.getByRole('button', { name: /start timer/i })
  240 |       await button.click()
  241 | 
  242 |       // Wait for countdown
  243 |       await page.waitForTimeout(1500)
  244 | 
  245 |       // Get time after 1.5 seconds
  246 |       const timeAfterStart = await page.getByRole('status').textContent()
  247 | 
  248 |       // Click pause
  249 |       button = page.getByRole('button', { name: /pause timer/i })
  250 |       await button.click()
  251 | 
  252 |       // Wait a bit
  253 |       await page.waitForTimeout(1000)
  254 | 
  255 |       // Time should be same (paused)
  256 |       const timeAfterPause = await page.getByRole('status').textContent()
  257 |       expect(timeAfterPause).toContain(timeAfterStart?.split(':')[1] || '') // Seconds should match
  258 | 
  259 |       // Resume
  260 |       button = page.getByRole('button', { name: /start timer/i })
  261 |       await button.click()
  262 | 
  263 |       // Wait more
  264 |       await page.waitForTimeout(1000)
  265 | 
  266 |       // Time should be different now
  267 |       const timeAfterResume = await page.getByRole('status').textContent()
  268 |       expect(timeAfterResume).not.toBe(timeAfterPause)
  269 |     })
  270 |   })
  271 | })
  272 | 
```