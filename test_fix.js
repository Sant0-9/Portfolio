const { chromium } = require('playwright');

async function testScrollingFix() {
  console.log('Testing the scrolling fix...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('Spline') || msg.text().includes('Fallback') || msg.text().includes('geometrical')) {
      console.log('PAGE LOG:', msg.text());
    }
  });

  try {
    console.log('Step 1: Navigate to site');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('Step 2: Wait for initial load');
    await page.waitForTimeout(3000);

    console.log('Step 3: Take initial screenshot');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/fix_test_1_initial.png', fullPage: true });

    console.log('Step 4: Try clicking on the scene multiple times');
    // Click center of screen several times
    for (let i = 0; i < 3; i++) {
      console.log(`Click attempt ${i + 1}`);
      await page.mouse.click(960, 540);
      await page.waitForTimeout(2000);

      // Check if navigation appeared (indicating we reached stage 2)
      const navigationVisible = await page.evaluate(() => {
        const navLinks = document.querySelectorAll('a[href="#about"], a[href="#projects"]');
        return navLinks.length > 0 &&
               Array.from(navLinks).some(link =>
                 window.getComputedStyle(link).display !== 'none' &&
                 window.getComputedStyle(link).visibility !== 'hidden'
               );
      });

      console.log(`After click ${i + 1}, navigation visible:`, navigationVisible);

      if (navigationVisible) {
        console.log('SUCCESS: Navigation is now visible, reached stage 2!');
        break;
      }
    }

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/fix_test_2_after_clicks.png', fullPage: true });

    console.log('Step 5: Now test scrolling');
    const scrollBeforeTest = await page.evaluate(() => window.scrollY);
    console.log('Scroll position before test:', scrollBeforeTest);

    // Try scrolling down
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);

    const scrollAfterWheel = await page.evaluate(() => window.scrollY);
    console.log('Scroll position after wheel:', scrollAfterWheel);

    // Check if About Me section is now visible
    const aboutMeVisible = await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (!aboutSection) return false;

      const rect = aboutSection.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    console.log('About Me section visible after scroll:', aboutMeVisible);

    console.log('Step 6: Final screenshot');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/fix_test_3_final.png', fullPage: true });

    if (aboutMeVisible) {
      console.log('🎉 SUCCESS: Fix worked! About Me section is now visible after scrolling.');
    } else {
      console.log('❌ Issue still exists: About Me section not visible.');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testScrollingFix();