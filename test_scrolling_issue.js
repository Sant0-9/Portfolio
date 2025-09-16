const { chromium } = require('playwright');

async function testScrollingIssue() {
  console.log('Starting Playwright test for scrolling issue...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Slow down actions for better observation
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('Step 1: Navigate to localhost:3000');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('Step 2: Take initial screenshot');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshot_1_initial.png', fullPage: true });

    console.log('Step 3: Wait for page to fully load and check for Spline scene');
    await page.waitForTimeout(3000);

    // Check if Spline canvas is present
    const splineCanvas = await page.locator('canvas').first();
    const canvasExists = await splineCanvas.count() > 0;
    console.log('Spline canvas found:', canvasExists);

    // Look for any clickable elements or "Click Me" text
    const clickableElements = await page.locator('text=/click/i').all();
    console.log('Found clickable elements with "click" text:', clickableElements.length);

    console.log('Step 4: Take screenshot showing Spline scene state');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshot_2_spline_loaded.png', fullPage: true });

    console.log('Step 5: Try clicking on the Spline canvas center');
    if (canvasExists) {
      const canvasBox = await splineCanvas.boundingBox();
      if (canvasBox) {
        // Click center of canvas
        await page.mouse.click(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
        console.log('Clicked center of Spline canvas');
        await page.waitForTimeout(2000);

        await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshot_3_after_first_click.png', fullPage: true });
      }
    }

    console.log('Step 6: Try clicking multiple areas of the canvas to find interaction');
    if (canvasExists) {
      const canvasBox = await splineCanvas.boundingBox();
      if (canvasBox) {
        // Try different click positions
        const clickPositions = [
          { x: canvasBox.x + canvasBox.width * 0.3, y: canvasBox.y + canvasBox.height * 0.3 },
          { x: canvasBox.x + canvasBox.width * 0.7, y: canvasBox.y + canvasBox.height * 0.3 },
          { x: canvasBox.x + canvasBox.width * 0.5, y: canvasBox.y + canvasBox.height * 0.7 },
        ];

        for (let i = 0; i < clickPositions.length; i++) {
          console.log(`Clicking position ${i + 1}: ${clickPositions[i].x}, ${clickPositions[i].y}`);
          await page.mouse.click(clickPositions[i].x, clickPositions[i].y);
          await page.waitForTimeout(1500);
          await page.screenshot({ path: `/home/oneknight/projects/portfolio/screenshot_4_click_${i + 1}.png`, fullPage: true });
        }
      }
    }

    console.log('Step 7: Check for any state changes or new interactive elements');
    // Look for any text that might indicate we're in the "second stage"
    const bodyText = await page.textContent('body');
    console.log('Page contains "second stage" or similar:', bodyText.toLowerCase().includes('second') || bodyText.toLowerCase().includes('stage'));

    console.log('Step 8: Now test scrolling behavior');
    const scrollSteps = 5;
    for (let i = 1; i <= scrollSteps; i++) {
      console.log(`Scroll attempt ${i}: Scrolling down`);

      // Get scroll position before
      const scrollBefore = await page.evaluate(() => window.scrollY);
      console.log(`Scroll position before scroll ${i}: ${scrollBefore}`);

      // Perform scroll
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1000);

      // Get scroll position after
      const scrollAfter = await page.evaluate(() => window.scrollY);
      console.log(`Scroll position after scroll ${i}: ${scrollAfter}`);

      await page.screenshot({ path: `/home/oneknight/projects/portfolio/screenshot_5_scroll_${i}.png`, fullPage: true });
    }

    console.log('Step 9: Check for About Me section visibility');
    const aboutSection = await page.locator('text=/about me/i').first();
    const aboutVisible = await aboutSection.isVisible().catch(() => false);
    console.log('About Me section visible:', aboutVisible);

    if (!aboutVisible) {
      console.log('About Me not visible, checking DOM structure...');

      // Check if About Me exists in DOM but is hidden
      const aboutExists = await page.locator('text=/about me/i').count() > 0;
      console.log('About Me exists in DOM:', aboutExists);

      if (aboutExists) {
        const aboutElement = await page.locator('text=/about me/i').first();
        const aboutStyles = await aboutElement.evaluate(el => {
          const computedStyle = window.getComputedStyle(el);
          return {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            zIndex: computedStyle.zIndex,
            position: computedStyle.position
          };
        });
        console.log('About Me element styles:', aboutStyles);
      }
    }

    console.log('Step 10: Check for IntroGate overlay or z-index conflicts');
    const overlayElements = await page.locator('[class*="overlay"], [class*="intro"], [class*="gate"]').all();
    console.log('Found potential overlay elements:', overlayElements.length);

    for (let i = 0; i < overlayElements.length; i++) {
      const element = overlayElements[i];
      const className = await element.getAttribute('class');
      const styles = await element.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return {
          zIndex: computedStyle.zIndex,
          position: computedStyle.position,
          display: computedStyle.display,
          visibility: computedStyle.visibility
        };
      });
      console.log(`Overlay element ${i + 1} (${className}):`, styles);
    }

    console.log('Step 11: Check viewport and document dimensions');
    const dimensions = await page.evaluate(() => ({
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
      maxScrollY: document.documentElement.scrollHeight - window.innerHeight
    }));
    console.log('Page dimensions:', dimensions);

    console.log('Step 12: Final comprehensive screenshot');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshot_6_final_state.png', fullPage: true });

    console.log('Test completed. Screenshots saved to project directory.');

  } catch (error) {
    console.error('Error during testing:', error);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshot_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testScrollingIssue();