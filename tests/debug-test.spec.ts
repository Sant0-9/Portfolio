import { test, expect } from '@playwright/test'

test('Debug Application Issues', async ({ page }) => {
  // Log console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  page.on('pageerror', exception => console.log('PAGE ERROR:', exception))

  await page.goto('/')
  
  // Wait for page load
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-homepage.png', fullPage: true })
  
  console.log('Page title:', await page.title())
  console.log('URL:', page.url())
  
  // Check what buttons are actually present
  const buttons = await page.locator('button').all()
  console.log('Number of buttons found:', buttons.length)
  
  for (const button of buttons) {
    const text = await button.textContent()
    console.log('Button text:', text)
    const isVisible = await button.isVisible()
    console.log('Button visible:', isVisible)
  }
  
  // Check for canvas
  const canvasCount = await page.locator('canvas').count()
  console.log('Canvas elements found:', canvasCount)
  
  if (canvasCount > 0) {
    const canvas = page.locator('canvas').first()
    const boundingBox = await canvas.boundingBox()
    console.log('Canvas bounding box:', boundingBox)
  }
  
  // Try to find the About Me button and click it
  const aboutButton = page.locator('button:has-text("About Me")')
  const aboutButtonExists = await aboutButton.count() > 0
  console.log('About Me button exists:', aboutButtonExists)
  
  if (aboutButtonExists) {
    await aboutButton.click()
    await page.waitForTimeout(2000)
    
    // Check for modal
    const modalCount = await page.locator('[role="dialog"]').count()
    console.log('Modal count after click:', modalCount)
    
    // Take another screenshot
    await page.screenshot({ path: 'debug-after-click.png', fullPage: true })
  }
  
  // Check page source for debugging
  const html = await page.content()
  console.log('Page contains "About Me":', html.includes('About Me'))
  console.log('Page contains "canvas":', html.includes('canvas'))
  console.log('Page contains "Solar Portfolio":', html.includes('Solar Portfolio'))
})