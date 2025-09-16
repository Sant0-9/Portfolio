const { chromium } = require('playwright');

async function debugScrollFix() {
  console.log('🔍 Debug Scroll Fix Investigation');
  console.log('==================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Inject debugging script
  await page.addInitScript(() => {
    window.debugInfo = [];
    const originalLog = console.log;
    console.log = (...args) => {
      window.debugInfo.push(args.join(' '));
      originalLog(...args);
    };
  });

  try {
    await page.goto('http://localhost:3010', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('📍 Step 1: Check initial state');
    let introVisible = await page.evaluate(() => {
      const introGates = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
      console.log('Found IntroGate elements:', introGates.length);

      introGates.forEach((el, i) => {
        const style = window.getComputedStyle(el);
        console.log(`Element ${i}:`, {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          zIndex: style.zIndex,
          offsetParent: el.offsetParent !== null
        });
      });

      return Array.from(introGates).some(element => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
      });
    });
    console.log(`Initial IntroGate visible: ${introVisible}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/debug_1_initial.png' });

    console.log('\n📍 Step 2: Wait for auto-transition and check navigation state');
    await page.waitForTimeout(4000);

    const hasNavigation = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      console.log('Navigation element found:', !!nav);
      return !!nav;
    });
    console.log(`Navigation visible: ${hasNavigation}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/debug_2_geometrical.png' });

    console.log('\n📍 Step 3: Trigger final transition');
    await page.evaluate(() => {
      console.log('Triggering wheel event...');
      const event = new WheelEvent('wheel', { deltaY: 200 });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const event = new WheelEvent('wheel', { deltaY: 200 });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(3000);

    // Check if intro is still visible
    introVisible = await page.evaluate(() => {
      const introGates = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
      console.log('After transition - IntroGate elements:', introGates.length);

      introGates.forEach((el, i) => {
        const style = window.getComputedStyle(el);
        console.log(`After transition - Element ${i}:`, {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          zIndex: style.zIndex,
          offsetParent: el.offsetParent !== null
        });
      });

      return Array.from(introGates).some(element => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
      });
    });
    console.log(`IntroGate visible after transition: ${introVisible}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/debug_3_after_transition.png' });

    console.log('\n📍 Step 4: Test scroll to top');

    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY before scroll to top: ${scrollBefore}`);

    await page.evaluate(() => {
      console.log('Scrolling to top...');
      window.scrollTo({ top: 0, behavior: 'instant' });
      console.log('ScrollY after scrollTo:', window.scrollY);
    });

    await page.waitForTimeout(3000); // Give time for scroll event handler

    const scrollAfter = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY after scroll to top: ${scrollAfter}`);

    // Check scroll event listeners
    await page.evaluate(() => {
      console.log('Manually triggering scroll event...');
      window.dispatchEvent(new Event('scroll'));
    });

    await page.waitForTimeout(2000);

    introVisible = await page.evaluate(() => {
      const introGates = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
      console.log('After scroll to top - IntroGate elements:', introGates.length);

      introGates.forEach((el, i) => {
        const style = window.getComputedStyle(el);
        console.log(`After scroll - Element ${i}:`, {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          zIndex: style.zIndex,
          offsetParent: el.offsetParent !== null
        });
      });

      return Array.from(introGates).some(element => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
      });
    });
    console.log(`IntroGate visible after scroll to top: ${introVisible}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/debug_4_after_scroll_top.png' });

    console.log('\n📍 Step 5: Get debug information');
    const debugInfo = await page.evaluate(() => window.debugInfo || []);
    console.log('Debug messages from page:');
    debugInfo.forEach((msg, i) => {
      console.log(`  ${i + 1}. ${msg}`);
    });

    console.log('\n⏳ Keeping browser open for manual inspection...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugScrollFix().catch(console.error);