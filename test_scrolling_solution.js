const { chromium } = require('playwright');

async function testScrollingSolution() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  console.log('🚀 Starting comprehensive scrolling solution test...\n');

  try {
    // Navigate to the website
    console.log('1. Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    console.log('2. Taking initial screenshot');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_initial.png', fullPage: true });
    console.log('   ✅ Initial screenshot saved as test_initial.png');

    // Wait 2 seconds and take screenshot to see if hint appears
    console.log('3. Waiting 2 seconds to check for interaction hint...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_2sec_hint.png', fullPage: true });
    console.log('   ✅ Screenshot after 2 seconds saved as test_2sec_hint.png');

    // Check if hint text is visible
    const hintVisible = await page.isVisible('text="Click anywhere on the scene to continue"');
    console.log(`   📋 Interaction hint visible: ${hintVisible ? '✅ YES' : '❌ NO'}`);

    // Try clicking anywhere on the Spline scene
    console.log('4. Testing click interaction on Spline scene...');
    const splineContainer = await page.locator('div[style*="cursor:pointer"]').first();
    if (await splineContainer.isVisible()) {
      await splineContainer.click();
      console.log('   ✅ Clicked on Spline container');

      // Wait a moment to see if transition happens
      await page.waitForTimeout(1000);

      // Check if we're in geometrical state (scroll indicator should be visible)
      const scrollIndicator = await page.isVisible('text="Scroll to explore"');
      if (scrollIndicator) {
        console.log('   ✅ Click successfully triggered transition to geometrical state!');
        await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_after_click.png', fullPage: true });
        console.log('   ✅ Screenshot after click saved as test_after_click.png');
      } else {
        console.log('   ⚠️  Click didn\'t trigger transition, waiting for auto-fallback...');
      }
    }

    // Test auto-fallback (wait for 3 seconds total from page load)
    console.log('5. Testing 3-second auto-fallback...');
    // We've already waited 2 seconds, so wait 1 more for total of 3
    await page.waitForTimeout(1000);

    // Check if we're now in geometrical state
    const scrollIndicatorAfterFallback = await page.isVisible('text="Scroll to explore"');
    console.log(`   📋 Auto-fallback to geometrical state: ${scrollIndicatorAfterFallback ? '✅ SUCCESS' : '❌ FAILED'}`);

    if (scrollIndicatorAfterFallback) {
      await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_geometrical_state.png', fullPage: true });
      console.log('   ✅ Screenshot in geometrical state saved as test_geometrical_state.png');
    }

    // Test scrolling in geometrical state
    console.log('6. Testing scrolling to reveal portfolio content...');

    // Scroll down multiple times
    for (let i = 1; i <= 5; i++) {
      console.log(`   📜 Scroll attempt ${i}/5`);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(300);
    }

    // Check if About Me section is visible
    const aboutMeVisible = await page.isVisible('#about');
    console.log(`   📋 About Me section visible: ${aboutMeVisible ? '✅ YES' : '❌ NO'}`);

    // Check if portfolio content is visible
    const skillsVisible = await page.isVisible('#skills');
    console.log(`   📋 Skills section visible: ${skillsVisible ? '✅ YES' : '❌ NO'}`);

    // Take final screenshot
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_final_scrolled.png', fullPage: true });
    console.log('   ✅ Final screenshot saved as test_final_scrolled.png');

    // Test keyboard shortcuts by refreshing and using them
    console.log('7. Testing keyboard shortcuts...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('   ⌨️  Testing Space key...');
    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    const spaceWorked = await page.isVisible('text="Scroll to explore"');
    console.log(`   📋 Space key triggered transition: ${spaceWorked ? '✅ YES' : '❌ NO'}`);

    // Refresh and test Enter key
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('   ⌨️  Testing Enter key...');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const enterWorked = await page.isVisible('text="Scroll to explore"');
    console.log(`   📋 Enter key triggered transition: ${enterWorked ? '✅ YES' : '❌ NO'}`);

    // Refresh and test Escape key
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('   ⌨️  Testing Escape key...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    const escapeWorked = await page.isVisible('text="Scroll to explore"');
    console.log(`   📋 Escape key triggered transition: ${escapeWorked ? '✅ YES' : '❌ NO'}`);

    // Final comprehensive test - full workflow
    console.log('8. Final comprehensive workflow test...');
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for auto-fallback
    await page.waitForTimeout(3500);

    // Scroll to reveal content
    for (let i = 1; i <= 6; i++) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(200);
    }

    // Check final state
    const finalAboutMe = await page.isVisible('#about');
    const finalSkills = await page.isVisible('#skills');

    console.log('📊 FINAL RESULTS:');
    console.log(`   ✅ About Me section accessible: ${finalAboutMe ? 'YES' : 'NO'}`);
    console.log(`   ✅ Skills section accessible: ${finalSkills ? 'YES' : 'NO'}`);

    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test_final_comprehensive.png', fullPage: true });
    console.log('   ✅ Final comprehensive screenshot saved');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 Test completed. Check the generated screenshots for visual verification.');
  }
}

testScrollingSolution();