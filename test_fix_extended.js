const { chromium } = require('playwright');

async function testScrollingFixExtended() {
  console.log('Testing the scrolling fix with extended timing...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Enable all console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    console.log('Step 1: Navigate to site');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('Step 2: Wait for initial load and Spline to potentially load');
    await page.waitForTimeout(3000);

    console.log('Step 3: Check current page state');
    const initialState = await page.evaluate(() => {
      // Check for IntroGate component
      const introGateElements = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
      const showNavigation = document.querySelectorAll('nav a[href="#about"]').length > 0;

      return {
        introGateElements: introGateElements.length,
        showNavigation,
        splineCanvases: document.querySelectorAll('canvas').length,
        bodyOverflow: window.getComputedStyle(document.body).overflow
      };
    });
    console.log('Initial state:', initialState);

    console.log('Step 4: Try clicking on the scene and wait for fallback');
    await page.mouse.click(960, 540);
    console.log('Clicked once, now waiting 7 seconds for fallback mechanism...');
    await page.waitForTimeout(7000);

    console.log('Step 5: Check state after fallback period');
    const afterFallbackState = await page.evaluate(() => {
      const showNavigation = document.querySelectorAll('nav a[href="#about"]').length > 0;
      const navigationVisible = Array.from(document.querySelectorAll('nav a[href="#about"]')).some(link =>
        window.getComputedStyle(link).display !== 'none'
      );

      return {
        showNavigation,
        navigationVisible,
        bodyOverflow: window.getComputedStyle(document.body).overflow
      };
    });
    console.log('After fallback state:', afterFallbackState);

    console.log('Step 6: Try clicking again after fallback');
    await page.mouse.click(960, 540);
    await page.waitForTimeout(3000);

    const afterSecondClickState = await page.evaluate(() => {
      const showNavigation = document.querySelectorAll('nav a[href="#about"]').length > 0;
      const navigationVisible = Array.from(document.querySelectorAll('nav a[href="#about"]')).some(link =>
        window.getComputedStyle(link).display !== 'none'
      );

      return {
        showNavigation,
        navigationVisible,
        bodyOverflow: window.getComputedStyle(document.body).overflow
      };
    });
    console.log('After second click state:', afterSecondClickState);

    console.log('Step 7: Test scrolling behavior');
    console.log('Trying scroll...');
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(2000);

    const scrollState = await page.evaluate(() => ({
      scrollY: window.scrollY,
      bodyOverflow: window.getComputedStyle(document.body).overflow,
      documentHeight: document.documentElement.scrollHeight
    }));
    console.log('Scroll state:', scrollState);

    console.log('Step 8: Check About Me visibility');
    const aboutVisibility = await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (!aboutSection) return { exists: false };

      const rect = aboutSection.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(aboutSection);

      return {
        exists: true,
        visible: rect.top < window.innerHeight && rect.bottom > 0,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height
        },
        styles: {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          zIndex: computedStyle.zIndex
        },
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight
      };
    });
    console.log('About Me visibility:', aboutVisibility);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/fix_test_extended_final.png', fullPage: true });

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testScrollingFixExtended();