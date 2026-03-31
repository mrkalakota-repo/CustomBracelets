import { test, expect } from '@playwright/test'

test.describe('Builder Flow — Full E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
  })

  // ─── STEP 1: BASE STYLE ──────────────────────────────────────────────────

  test('step 1 is visible on load', async ({ page }) => {
    await expect(page.getByTestId('step-1')).toBeVisible()
  })

  test('all 5 base style options are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /beaded/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /cord/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /chain/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /charm/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /stackable/i })).toBeVisible()
  })

  test('step indicator shows step 1 as active', async ({ page }) => {
    await expect(page.getByTestId('step-dot-1')).toHaveAttribute('data-active', 'true')
    await expect(page.getByTestId('step-dot-2')).toHaveAttribute('data-active', 'false')
  })

  // ─── STEP 2: COLOR ───────────────────────────────────────────────────────

  test('selecting a base style advances to step 2', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await expect(page.getByTestId('step-2')).toBeVisible()
    await expect(page.getByTestId('step-1')).not.toBeVisible()
  })

  test('step indicator shows step 2 active after base selection', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await expect(page.getByTestId('step-dot-2')).toHaveAttribute('data-active', 'true')
  })

  // ─── STEP 3: PATTERN ─────────────────────────────────────────────────────

  test('selecting a color advances to step 3 for beaded base', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await expect(page.getByTestId('step-3')).toBeVisible()
  })

  test('step 3 shows only beaded-compatible patterns', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await expect(page.getByRole('button', { name: /stripe/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /checker/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /knotted/i })).not.toBeVisible()
  })

  test('step 3 shows only cord-compatible patterns for cord base', async ({ page }) => {
    await page.getByRole('button', { name: /^cord$/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await expect(page.getByRole('button', { name: /knotted/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /braided/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /stripe/i })).not.toBeVisible()
  })

  test('charm base skips pattern step and goes to step 4', async ({ page }) => {
    await page.getByRole('button', { name: /^charm$/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await expect(page.getByTestId('step-4')).toBeVisible()
    await expect(page.getByTestId('step-3')).not.toBeVisible()
  })

  // ─── STEP 4: ADD-ONS ─────────────────────────────────────────────────────

  test('selecting a pattern advances to step 4', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /stripe/i }).click()
    await expect(page.getByTestId('step-4')).toBeVisible()
  })

  test('skip button on step 4 advances to step 5', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /stripe/i }).click()
    await page.getByRole('button', { name: /skip/i }).click()
    await expect(page.getByTestId('step-5')).toBeVisible()
  })

  // ─── STEP 5: PREVIEW ──────────────────────────────────────────────────────

  test('preview shows correct selections summary', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /stripe/i }).click()
    await page.getByRole('button', { name: /skip/i }).click()

    await expect(page.getByTestId('preview-summary')).toContainText(/beaded/i)
    await expect(page.getByTestId('preview-summary')).toContainText(/sage/i)
  })

  test('Add to Cart button is visible on step 5', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /stripe/i }).click()
    await page.getByRole('button', { name: /skip/i }).click()
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible()
  })

  test('Share button is visible on step 5', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /stripe/i }).click()
    await page.getByRole('button', { name: /skip/i }).click()
    await expect(page.getByRole('button', { name: /share/i })).toBeVisible()
  })

  // ─── BACK NAVIGATION ──────────────────────────────────────────────────────

  test('back button from step 2 returns to step 1', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /back/i }).click()
    await expect(page.getByTestId('step-1')).toBeVisible()
  })

  test('back button from step 3 returns to step 2', async ({ page }) => {
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /back/i }).click()
    await expect(page.getByTestId('step-2')).toBeVisible()
  })

  test('changing base style on step 1 resets downstream state', async ({ page }) => {
    // Go forward to step 2 with beaded
    await page.getByRole('button', { name: /beaded/i }).click()
    // Go back
    await page.getByRole('button', { name: /back/i }).click()
    // Select cord instead
    await page.getByRole('button', { name: /^cord$/i }).click()
    // Step 3 should show cord patterns, not beaded patterns
    await page.getByRole('button', { name: /sage green/i }).click()
    await expect(page.getByRole('button', { name: /knotted/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /stripe/i })).not.toBeVisible()
  })

  // ─── MOBILE VIEWPORT ─────────────────────────────────────────────────────

  test('full flow completes on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }) // iPhone 14
    await page.getByRole('button', { name: /beaded/i }).click()
    await page.getByRole('button', { name: /sage green/i }).click()
    await page.getByRole('button', { name: /stripe/i }).click()
    await page.getByRole('button', { name: /skip/i }).click()
    await expect(page.getByTestId('step-5')).toBeVisible()
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible()
  })
})
