const { chromium } = require('playwright');

async function testDebugButton() {
  console.log('Testing the debug button approach...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    console.log('Step 1: Navigate to site');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('Step 2: Look for debug button');
    const debugButton = page.locator('button:has-text("Click Me (Debug)")');
    const debugButtonExists = await debugButton.count() > 0;
    console.log('Debug button exists:', debugButtonExists);

    if (debugButtonExists) {
      console.log('Step 3: Click debug button');
      await debugButton.first().click();
      await page.waitForTimeout(2000);

      console.log('Step 4: Check if navigation appeared');
      const navigationVisible = await page.evaluate(() => {
        const navLinks = document.querySelectorAll('nav a[href="#about"]');
        return navLinks.length > 0 &&
               Array.from(navLinks).some(link =>
                 window.getComputedStyle(link).display !== 'none'
               );
      });
      console.log('Navigation visible after debug button click:', navigationVisible);

      if (navigationVisible) {
        console.log('Step 5: Test scrolling behavior');
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(2000);

        const aboutMeVisible = await page.evaluate(() => {
          const aboutSection = document.querySelector('#about');
          if (!aboutSection) return false;
          const rect = aboutSection.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });

        console.log('About Me visible after scroll:', aboutMeVisible);

        if (aboutMeVisible) {
          console.log('🎉 SUCCESS: Debug button fix worked!');
        } else {
          console.log('❌ About Me still not visible after scroll');
        }
      }
    }

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/debug_button_test.png', fullPage: true });

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testDebugButton();