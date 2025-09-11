import { test, expect } from '@playwright/test'

test('Manual Visual Test', async ({ page }) => {
  // Navigate to the page
  await page.goto('/')
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(5000)
  
  // Take full page screenshot
  await page.screenshot({ path: 'homepage-full.png', fullPage: true })
  
  // Check what's visible in the viewport
  await page.screenshot({ path: 'homepage-viewport.png' })
  
  // Print page details
  console.log('Page URL:', page.url())
  console.log('Page Title:', await page.title())
  
  // Get all visible elements
  const headings = await page.locator('h1, h2, h3').allTextContents()
  console.log('Headings:', headings)
  
  const buttons = await page.locator('button').allTextContents()
  console.log('Buttons:', buttons)
  
  // Check canvas
  const canvas = page.locator('canvas')
  const canvasCount = await canvas.count()
  console.log('Canvas count:', canvasCount)
  
  if (canvasCount > 0) {
    const bbox = await canvas.boundingBox()
    console.log('Canvas dimensions:', bbox)
  }
  
  // Try clicking the About Me button if it exists
  const aboutBtn = page.locator('button').filter({ hasText: 'About Me' })
  const aboutCount = await aboutBtn.count()
  console.log('About Me button count:', aboutCount)
  
  if (aboutCount > 0) {
    console.log('Clicking About Me button...')
    await aboutBtn.click()
    await page.waitForTimeout(2000)
    
    // Take screenshot after clicking
    await page.screenshot({ path: 'after-about-click.png' })
    
    // Check for modal
    const dialog = page.locator('[role="dialog"]')
    const dialogCount = await dialog.count()
    console.log('Dialog count after click:', dialogCount)
    
    if (dialogCount > 0) {
      console.log('Modal is visible!')
      const modalBbox = await dialog.boundingBox()
      console.log('Modal dimensions:', modalBbox)
    }
  }
  
  // Check console logs and errors
  const logs: string[] = []
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`))
  
  // Wait a bit more to collect logs
  await page.waitForTimeout(2000)
  
  console.log('Console messages:', logs.slice(0, 10)) // Show first 10
})