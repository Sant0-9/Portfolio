const { chromium } = require('playwright');

async function runTargetedFixTest() {
  console.log('🎯 Targeted Fix Validation Test');
  console.log('================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Error monitoring
  const consoleErrors = [];
  const controlsStartErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.log('❌ Console Error:', text);

      if (text.includes('controls.start() should only be called after a component has mounted')) {
        controlsStartErrors.push(text);
        console.log('🚨 FOUND TARGET ERROR: controls.start() before mount!');
      }
    }
  });

  page.on('pageerror', error => {
    const message = error.message;
    consoleErrors.push(message);
    if (message.includes('controls.start()')) {
      controlsStartErrors.push(message);
    }
  });

  try {
    console.log('📍 TEST 1: Runtime Error Fix Validation');
    console.log('=========================================');

    await page.goto('http://localhost:3010', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/targeted_test_1_initial.png' });
    console.log('📸 Initial load captured');

    // Wait for auto-transition (3 seconds per code)
    console.log('⏳ Waiting for auto-transition...');
    await page.waitForTimeout(4000);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/targeted_test_2_after_auto.png' });
    console.log('📸 After auto-transition captured');

    // Force scroll down to trigger starfield warp
    console.log('📜 Force triggering final transition...');
    await page.evaluate(() => {
      const event = new WheelEvent('wheel', { deltaY: 200 });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const event = new WheelEvent('wheel', { deltaY: 200 });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/targeted_test_3_portfolio.png' });
    console.log('📸 Portfolio reached');

    console.log('\n📍 TEST 2: Scroll Up Fix Validation');
    console.log('====================================');

    // Test scroll to top functionality
    console.log('📜 Scrolling to top to test fix...');
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    await page.waitForTimeout(2000);

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`📏 ScrollY after scroll to top: ${scrollY}`);

    // Check if IntroGate returned
    const introVisible = await page.evaluate(() => {
      const introGates = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
      return Array.from(introGates).some(element => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
      });
    });

    console.log(`👁️ IntroGate visible after scroll to top: ${introVisible}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/targeted_test_4_after_scroll_top.png' });
    console.log('📸 After scroll to top captured');

    // Test multiple cycles
    console.log('\n📍 TEST 3: Stability Test');
    console.log('==========================');

    if (introVisible) {
      console.log('✅ Scroll up fix is working! Testing cycle...');

      // Trigger another transition
      await page.evaluate(() => {
        const event = new WheelEvent('wheel', { deltaY: 150 });
        window.dispatchEvent(event);
      });
      await page.waitForTimeout(3000);

      // Scroll to top again
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForTimeout(2000);

      const secondCycleVisible = await page.evaluate(() => {
        const introGates = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
        return Array.from(introGates).some(element => {
          const style = window.getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
        });
      });

      console.log(`🔄 IntroGate visible after second cycle: ${secondCycleVisible}`);
      await page.screenshot({ path: '/home/oneknight/projects/portfolio/targeted_test_5_second_cycle.png' });
    } else {
      console.log('❌ Scroll up fix may not be working');
    }

    console.log('\n📊 FINAL RESULTS');
    console.log('=================');

    console.log(`\n🎯 FIX 1 VALIDATION (Runtime Error Fix):`);
    console.log(`   Total console errors: ${consoleErrors.length}`);
    console.log(`   Controls.start() errors: ${controlsStartErrors.length}`);
    console.log(`   Status: ${controlsStartErrors.length === 0 ? '✅ PASSED' : '❌ FAILED'}`);

    console.log(`\n🎯 FIX 2 VALIDATION (Scroll Up Fix):`);
    console.log(`   IntroGate returns on scroll to top: ${introVisible}`);
    console.log(`   Status: ${introVisible ? '✅ PASSED' : '❌ FAILED'}`);

    console.log(`\n🏆 OVERALL STATUS:`);
    console.log(`   Runtime Fix: ${controlsStartErrors.length === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`   Scroll Fix: ${introVisible ? 'PASSED' : 'FAILED'}`);
    console.log(`   Critical Errors: ${controlsStartErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n📝 All Console Messages:');
      consoleErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    console.log('\n⏳ Keeping browser open for 15 seconds for manual verification...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test completed!');
  }
}

runTargetedFixTest().catch(console.error);