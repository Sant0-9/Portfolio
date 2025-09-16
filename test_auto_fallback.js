const { chromium } = require('playwright');

async function testAutoFallback() {
  console.log('Testing auto-fallback mechanism...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
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

    console.log('Step 2: Wait for auto-fallback (8 seconds + buffer)');
    await page.waitForTimeout(10000);

    console.log('Step 3: Check if navigation appeared after auto-fallback');
    const navigationState = await page.evaluate(() => {
      const navLinks = document.querySelectorAll('nav a[href="#about"]');
      const bodyOverflow = window.getComputedStyle(document.body).overflow;

      return {
        navigationExists: navLinks.length > 0,
        navigationVisible: Array.from(navLinks).some(link =>
          window.getComputedStyle(link).display !== 'none' &&
          window.getComputedStyle(link).visibility !== 'hidden'
        ),
        bodyOverflow,
        scrollHintExists: document.body.textContent.includes('Scroll down')
      };
    });

    console.log('Navigation state after auto-fallback:', navigationState);

    if (navigationState.navigationExists) {
      console.log('Step 4: Test scrolling behavior');

      // Try scrolling down
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(3000);

      const afterScrollState = await page.evaluate(() => {
        const aboutSection = document.querySelector('#about');
        const rect = aboutSection ? aboutSection.getBoundingClientRect() : null;

        return {
          scrollY: window.scrollY,
          aboutExists: !!aboutSection,
          aboutVisible: rect ? (rect.top < window.innerHeight && rect.bottom > 0) : false,
          aboutTop: rect ? rect.top : null,
          viewportHeight: window.innerHeight
        };
      });

      console.log('State after scrolling:', afterScrollState);

      if (afterScrollState.aboutVisible) {
        console.log('🎉 SUCCESS: Auto-fallback mechanism worked! About section is visible.');
      } else if (afterScrollState.scrollY === 0) {
        console.log('❌ Scrolling was blocked - transition may not have completed');
      } else {
        console.log('⚠️ Scrolling worked but About section not visible. Need to investigate positioning.');
      }
    } else {
      console.log('❌ Auto-fallback did not trigger navigation state');
    }

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/auto_fallback_test.png', fullPage: true });

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testAutoFallback();