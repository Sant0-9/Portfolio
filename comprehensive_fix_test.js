const { chromium } = require('playwright');

async function runComprehensiveFixTest() {
  console.log('🚀 Starting Comprehensive Fix Validation Test');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500  // Slow down for better observation
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Monitor console for runtime errors
  const consoleErrors = [];
  const runtimeErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.log('❌ Console Error:', text);
    } else if (text.includes('controls.start()')) {
      runtimeErrors.push(text);
      console.log('🔍 Found controls.start() message:', text);
    }
  });

  page.on('pageerror', error => {
    runtimeErrors.push(error.message);
    console.log('❌ Page Error:', error.message);
  });

  try {
    console.log('📍 TEST 1: Runtime Error Fix - Navigation and Console Monitoring');
    console.log('================================================================');

    // Navigate to the site
    console.log('🌐 Navigating to http://localhost:3010');
    await page.goto('http://localhost:3010', { waitUntil: 'networkidle' });

    // Wait for initial load
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_1_initial.png' });
    console.log('📸 Initial state captured');

    // Check for immediate runtime errors
    console.log('✅ Initial console errors found:', consoleErrors.length);
    console.log('✅ Runtime errors related to controls.start():', runtimeErrors.length);

    console.log('\n📍 PHASE 1: Trigger transition to geometrical state');
    console.log('====================================================');

    // Wait for auto-transition or manually trigger (the component has 3-second auto-fallback)
    console.log('⏳ Waiting for auto-transition or clicking to trigger geometrical state...');
    await page.waitForTimeout(4000); // Wait for auto-transition

    // Try clicking if needed
    const splineCanvas = await page.locator('canvas').first();
    if (await splineCanvas.isVisible()) {
      await splineCanvas.click();
      console.log('🖱️ Clicked on Spline canvas');
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_2_geometrical.png' });
    console.log('📸 Geometrical state captured');

    // Check for errors during transition
    console.log('✅ Console errors after transition:', consoleErrors.length);
    console.log('✅ Runtime errors after transition:', runtimeErrors.length);

    console.log('\n📍 PHASE 2: Trigger final transition with scroll down');
    console.log('=====================================================');

    // Scroll down to trigger final transition
    console.log('📜 Scrolling down to trigger final transition...');
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_3_final_transition.png' });
    console.log('📸 Final transition captured');

    // Check for starfield warp errors
    console.log('✅ Console errors after final transition:', consoleErrors.length);
    console.log('✅ Runtime errors after final transition:', runtimeErrors.length);

    console.log('\n📍 TEST 2: Scroll Up Fix - Testing Return to Geometrical State');
    console.log('================================================================');

    // Wait for transition to complete
    await page.waitForTimeout(3000);

    // Take screenshot of main portfolio
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_4_portfolio.png' });
    console.log('📸 Portfolio page captured');

    // Test the scroll-to-top fix
    console.log('📜 Scrolling to top to test return to geometrical state...');
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Wait for scroll to complete and check
    await page.waitForTimeout(3000);

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`📏 Current scroll position: ${scrollY}`);

    // Check if IntroGate is visible again
    const introGate = page.locator('[class*="fixed inset-0"]').first();
    const isIntroVisible = await introGate.isVisible();
    console.log(`👁️ IntroGate visible after scroll to top: ${isIntroVisible}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_5_returned_geometrical.png' });
    console.log('📸 Returned to geometrical state captured');

    console.log('\n📍 TEST 3: Return Button Functionality');
    console.log('=======================================');

    if (isIntroVisible) {
      // Try to find and click the return button (this would be in the Spline scene)
      console.log('🖱️ Attempting to interact with Spline scene to test return functionality...');

      const splineContainer = page.locator('div').filter({ hasText: /OneKnight/ }).first();
      if (await splineContainer.isVisible()) {
        // Click somewhere in the spline area to potentially trigger return
        await splineContainer.click();
        await page.waitForTimeout(2000);

        await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_6_after_return_attempt.png' });
        console.log('📸 After return attempt captured');
      }
    }

    console.log('\n📍 TEST 4: Cycle Test - Repeat the Flow');
    console.log('========================================');

    // Test the full cycle again to ensure stability
    console.log('🔄 Testing full cycle repeatability...');

    // Trigger transition to geometrical again
    await page.waitForTimeout(2000);

    // Scroll down again
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(3000);

    // Scroll back to top again
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_fix_comprehensive_7_cycle_complete.png' });
    console.log('📸 Full cycle test completed');

    // Final error check
    console.log('\n📊 FINAL RESULTS');
    console.log('=================');
    console.log(`✅ Total console errors: ${consoleErrors.length}`);
    console.log(`✅ Total runtime errors: ${runtimeErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n❌ Console Errors Found:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (runtimeErrors.length > 0) {
      console.log('\n❌ Runtime Errors Found:');
      runtimeErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Test Summary
    console.log('\n🎯 TEST SUMMARY');
    console.log('===============');
    console.log(`✅ Fix 1 (Runtime Error): ${runtimeErrors.filter(e => e.includes('controls.start()')).length === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Fix 2 (Scroll Up): ${isIntroVisible ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Overall Console Health: ${consoleErrors.length === 0 ? 'PASSED' : 'NEEDS_ATTENTION'}`);

    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Test execution error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test completed!');
  }
}

runComprehensiveFixTest().catch(console.error);