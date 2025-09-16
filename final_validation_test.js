const { chromium } = require('playwright');

async function finalValidationTest() {
  console.log('🏆 FINAL VALIDATION TEST - Both Fixes');
  console.log('======================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 400
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Results tracking
  const results = {
    fix1_runtimeError: { status: 'UNKNOWN', errors: [] },
    fix2_scrollUp: { status: 'UNKNOWN', details: [] },
    overallHealth: { consoleErrors: [] }
  };

  // Monitor for the specific runtime error we fixed
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      results.overallHealth.consoleErrors.push(text);

      if (text.includes('controls.start() should only be called after a component has mounted')) {
        results.fix1_runtimeError.errors.push(text);
        console.log('🚨 CRITICAL: Found the runtime error we fixed!');
      }
    }
  });

  page.on('pageerror', error => {
    const message = error.message;
    results.overallHealth.consoleErrors.push(message);
    if (message.includes('controls.start()')) {
      results.fix1_runtimeError.errors.push(message);
    }
  });

  try {
    console.log('📍 PHASE 1: Testing Runtime Error Fix');
    console.log('======================================');

    await page.goto('http://localhost:3010', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/final_test_1_initial.png' });

    console.log('⏳ Waiting for auto-transition (triggers various animations)...');
    await page.waitForTimeout(4000);

    console.log('📜 Triggering final transition (this should trigger starfield warp)...');
    await page.evaluate(() => {
      // Trigger scroll down to cause final transition
      const event = new WheelEvent('wheel', { deltaY: 250 });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const event = new WheelEvent('wheel', { deltaY: 250 });
      window.dispatchEvent(event);
    });

    // Wait for starfield warp animation to complete
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/final_test_2_portfolio.png' });

    // Evaluate Fix 1
    if (results.fix1_runtimeError.errors.length === 0) {
      results.fix1_runtimeError.status = 'PASSED';
      console.log('✅ FIX 1: No runtime errors detected during transitions!');
    } else {
      results.fix1_runtimeError.status = 'FAILED';
      console.log('❌ FIX 1: Runtime errors detected!');
    }

    console.log('\n📍 PHASE 2: Testing Scroll Up Fix');
    console.log('==================================');

    console.log('📏 Testing scroll to top functionality...');
    const scrollBefore = await page.evaluate(() => window.scrollY);
    console.log(`Current scrollY: ${scrollBefore}`);

    // Scroll to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // Wait for scroll event handler to process
    await page.waitForTimeout(2000);

    const scrollAfter = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY after scroll to top: ${scrollAfter}`);

    // Check if IntroGate is visible again
    const introGateVisible = await page.evaluate(() => {
      const introGates = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
      return Array.from(introGates).some(element => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               rect.width > 0 &&
               rect.height > 0;
      });
    });

    results.fix2_scrollUp.details.push({
      scrollBefore,
      scrollAfter,
      introGateVisible
    });

    if (introGateVisible && scrollAfter === 0) {
      results.fix2_scrollUp.status = 'PASSED';
      console.log('✅ FIX 2: IntroGate successfully returned on scroll to top!');
    } else {
      results.fix2_scrollUp.status = 'FAILED';
      console.log('❌ FIX 2: IntroGate did not return on scroll to top');
    }

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/final_test_3_after_scroll_top.png' });

    console.log('\n📍 PHASE 3: Testing Stability & Return Button');
    console.log('===============================================');

    if (introGateVisible) {
      console.log('🔄 Testing return functionality...');

      // Try to trigger return to initial state by interacting with Spline
      // The return button is part of the Spline scene
      await page.evaluate(() => {
        // Simulate a return action - this would normally be triggered by Spline
        const event = new CustomEvent('spline:return', { detail: { action: 'return' } });
        window.dispatchEvent(event);
      });

      await page.waitForTimeout(2000);

      // Test another full cycle
      console.log('🔄 Testing full cycle repeatability...');

      // Trigger transition again
      await page.evaluate(() => {
        const event = new WheelEvent('wheel', { deltaY: 200 });
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
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' &&
                 style.visibility !== 'hidden' &&
                 style.opacity !== '0' &&
                 rect.width > 0 &&
                 rect.height > 0;
        });
      });

      if (secondCycleVisible) {
        console.log('✅ STABILITY: Second cycle successful!');
      } else {
        console.log('⚠️ STABILITY: Second cycle had issues');
      }

      await page.screenshot({ path: '/home/oneknight/projects/portfolio/final_test_4_stability.png' });
    }

    console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
    console.log('==============================');

    console.log('\n📊 FIX 1: Runtime Error Prevention');
    console.log(`   Status: ${results.fix1_runtimeError.status}`);
    console.log(`   Target Error Count: ${results.fix1_runtimeError.errors.length}`);
    console.log(`   Details: ${results.fix1_runtimeError.status === 'PASSED' ? 'No "controls.start() should only be called after a component has mounted" errors found' : 'Runtime errors detected'}`);

    console.log('\n📊 FIX 2: Scroll Up Behavior');
    console.log(`   Status: ${results.fix2_scrollUp.status}`);
    console.log(`   ScrollY reached 0: ${results.fix2_scrollUp.details[0]?.scrollAfter === 0}`);
    console.log(`   IntroGate returned: ${results.fix2_scrollUp.details[0]?.introGateVisible}`);
    console.log(`   Details: ${results.fix2_scrollUp.status === 'PASSED' ? 'Geometrical spline screen returns when scrolling to top' : 'Scroll up behavior not working as expected'}`);

    console.log('\n📊 Overall Health');
    console.log(`   Total console errors: ${results.overallHealth.consoleErrors.length}`);
    console.log(`   Critical errors: ${results.fix1_runtimeError.errors.length}`);

    console.log('\n🏆 FINAL VERDICT');
    console.log('================');
    const fix1Passed = results.fix1_runtimeError.status === 'PASSED';
    const fix2Passed = results.fix2_scrollUp.status === 'PASSED';

    console.log(`✅ Issue 1 Fixed (Runtime Error): ${fix1Passed ? '✅ CONFIRMED' : '❌ FAILED'}`);
    console.log(`✅ Issue 2 Fixed (Scroll Up): ${fix2Passed ? '✅ CONFIRMED' : '❌ FAILED'}`);
    console.log(`✅ Overall Implementation: ${fix1Passed && fix2Passed ? '✅ SUCCESS' : '⚠️ PARTIAL'}`);

    if (results.overallHealth.consoleErrors.length > 0) {
      console.log('\n📝 Console Messages (for reference):');
      results.overallHealth.consoleErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    console.log('\n⏳ Browser staying open for 20 seconds for manual verification...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('❌ Test execution error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Comprehensive test completed!');
  }
}

finalValidationTest().catch(console.error);