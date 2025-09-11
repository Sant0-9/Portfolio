import { test, expect } from '@playwright/test'

test.describe('Solar Portfolio Basic Tests', () => {
  test('should load the homepage and display main elements', async ({ page }) => {
    await page.goto('/')
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('Solar Portfolio')
    
    // Check canvas exists
    await expect(page.locator('canvas')).toBeVisible()
    
    // Check buttons are present
    await expect(page.locator('button:has-text("Explore Projects")')).toBeVisible()
    await expect(page.locator('button:has-text("About Me")')).toBeVisible()
  })

  test('should open About modal when clicked', async ({ page }) => {
    await page.goto('/')
    
    // Click About Me button
    await page.click('button:has-text("About Me")')
    
    // Check modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('#about-title')).toContainText('About Me')
    
    // Check close button
    await expect(page.locator('[aria-label="Close about modal"]')).toBeVisible()
  })

  test('should close About modal with Escape', async ({ page }) => {
    await page.goto('/')
    
    // Open modal
    await page.click('button:has-text("About Me")')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Close with Escape
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('should have accessibility features', async ({ page }) => {
    await page.goto('/')
    
    // Open modal
    await page.click('button:has-text("About Me")')
    
    // Check ARIA attributes
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    await expect(modal).toHaveAttribute('aria-labelledby', 'about-title')
    
    // Check close button has proper label
    await expect(page.locator('[aria-label="Close about modal"]')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    
    // Check main elements are still visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('canvas')).toBeVisible()
    await expect(page.locator('button:has-text("Explore Projects")')).toBeVisible()
    
    // Check responsive layout
    const title = page.locator('h1')
    const boundingBox = await title.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375)
  })

  test('should have WebGL context', async ({ page }) => {
    await page.goto('/')
    
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return false
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    })
    
    expect(hasWebGL).toBe(true)
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Tab through elements
    await page.keyboard.press('Tab')
    let focused = page.locator(':focus')
    await expect(focused).toBeVisible()
    
    await page.keyboard.press('Tab')
    focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })
})