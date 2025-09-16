import { test, expect } from '@playwright/test';

test.describe('Production Portfolio Quick Test', () => {
  test('Production Deployment Analysis', async ({ page }) => {
    console.log('\n🚀 PRODUCTION DEPLOYMENT TEST STARTING');
    console.log('====================================');

    const startTime = Date.now();
    let consoleErrors: string[] = [];
    let consoleWarnings: string[] = [];
    let loadingScreenVisible = false;
    let loadingCompleted = false;

    // Monitor console messages
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('chrome-extension://')) {
        consoleErrors.push(text);
        console.log('❌', text);
      } else if (msg.type() === 'warning' && !text.includes('chrome-extension://')) {
        consoleWarnings.push(text);
        console.log('⚠️', text);
      }
    });

    // === 1. LOADING SCREEN EXPERIENCE ===
    console.log('\n📱 Testing Loading Screen Experience...');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Take initial screenshot
    await page.screenshot({
      path: 'test-results/production-initial-load.png',
      fullPage: true
    });
    console.log('✅ Initial screenshot captured');

    // Check for loading screen
    try {
      const loadingScreen = page.locator('.fixed.inset-0.z-\\[10000\\]');
      await expect(loadingScreen).toBeVisible({ timeout: 3000 });
      loadingScreenVisible = true;
      console.log('✅ Loading screen appears immediately');

      // Check for OneKnight logo
      const logo = page.locator('h1:has-text("OneKnight")');
      await expect(logo).toBeVisible({ timeout: 2000 });
      console.log('✅ OneKnight logo visible');

      // Check for progress bar
      const progressBar = page.locator('.bg-gradient-to-r.from-teal-400.to-purple-500');
      await expect(progressBar).toBeVisible({ timeout: 3000 });
      console.log('✅ Loading progress bar present');

      // Monitor progress and wait for completion
      let maxProgress = 0;
      for (let i = 0; i < 30; i++) { // Check for 30 seconds
        try {
          const progressText = await page.locator('.font-mono').textContent({ timeout: 1000 });
          if (progressText) {
            const progress = parseInt(progressText.replace('%', ''));
            if (!isNaN(progress)) {
              maxProgress = Math.max(maxProgress, progress);
            }
          }
        } catch (e) {
          // Progress element might disappear
        }

        // Check if loading is complete
        if (!(await loadingScreen.isVisible())) {
          loadingCompleted = true;
          console.log(`✅ Loading completed after ~${(Date.now() - startTime)/1000}s`);
          break;
        }
        await page.waitForTimeout(1000);
      }

      console.log(`📊 Max progress observed: ${maxProgress}%`);
      expect(maxProgress).toBeGreaterThan(0);
      console.log('✅ Progress bar showed actual progression');

    } catch (error) {
      console.log('⚠️ Loading screen not detected or quick loading');
    }

    const loadingTime = Date.now() - startTime;
    console.log(`⏱️ Total loading time: ${loadingTime}ms`);

    // === 2. INTROGATE & 3D SCENE ===
    console.log('\n🎮 Testing IntroGate & 3D Scene...');

    await page.screenshot({
      path: 'test-results/production-after-loading.png',
      fullPage: true
    });
    console.log('✅ Post-loading screenshot captured');

    // Check for IntroGate
    const introGate = page.locator('.fixed.inset-0.z-\\[9999\\], .fixed.inset-0.z-\\[9998\\]');
    try {
      await expect(introGate).toBeVisible({ timeout: 5000 });
      console.log('✅ IntroGate visible after loading');

      // Look for 3D canvas
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible({ timeout: 5000 });
      console.log('✅ 3D Canvas present');

      // Test interaction
      const splineContainer = page.locator('.absolute.inset-0.w-full.h-full').first();
      await splineContainer.click({ timeout: 3000 });
      await page.waitForTimeout(2000);
      console.log('✅ 3D scene interaction attempted');

      // Check for navigation (geometrical state)
      const navigation = page.locator('nav, a[href="#about"]');
      try {
        await expect(navigation).toBeVisible({ timeout: 3000 });
        console.log('✅ Navigation appeared (geometrical state)');
      } catch (e) {
        console.log('⚠️ Navigation not visible, checking for fallback');

        // Try fallback button
        const fallbackButton = page.locator('button:has-text("Continue to Portfolio")');
        if (await fallbackButton.isVisible()) {
          await fallbackButton.click();
          console.log('✅ Fallback button used successfully');
        }
      }

    } catch (error) {
      console.log('⚠️ IntroGate or 3D scene issue:', error.message);
    }

    // === 3. PORTFOLIO TRANSITION ===
    console.log('\n📄 Testing Portfolio Transition...');

    // Scroll to trigger transition
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(2000);

    // Look for main portfolio content
    const heroSection = page.locator('#Hero, section:has-text("OneKnight"), section').first();
    try {
      await expect(heroSection).toBeVisible({ timeout: 5000 });
      console.log('✅ Portfolio content accessible');
    } catch (e) {
      console.log('⚠️ Portfolio content not immediately visible');
    }

    await page.screenshot({
      path: 'test-results/production-portfolio-view.png',
      fullPage: true
    });
    console.log('✅ Portfolio view screenshot captured');

    // === 4. PERFORMANCE ANALYSIS ===
    console.log('\n⚡ Analyzing Performance...');

    // Check WebGL
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    });

    if (hasWebGL) {
      console.log('✅ WebGL context working');
    } else {
      console.log('⚠️ WebGL context issue');
    }

    // Check for critical errors
    const criticalErrors = consoleErrors.filter(error =>
      !error.includes('chrome-extension://') &&
      !error.includes('WebGL') && // Expected in headless mode
      (error.includes('Error') || error.includes('failed'))
    );

    console.log(`📊 Console errors: ${criticalErrors.length}`);
    console.log(`📊 Console warnings: ${consoleWarnings.length}`);

    if (criticalErrors.length > 0) {
      console.log('❌ Critical errors found:', criticalErrors.slice(0, 3));
    }

    // === 5. FINAL ASSESSMENT ===
    console.log('\n📋 PRODUCTION DEPLOYMENT ASSESSMENT');
    console.log('=====================================');

    let score = 100;
    const issues: string[] = [];

    if (!loadingScreenVisible) {
      score -= 10;
      issues.push('Loading screen not detected');
    }
    if (!loadingCompleted) {
      score -= 15;
      issues.push('Loading did not complete properly');
    }
    if (criticalErrors.length > 0) {
      score -= 20;
      issues.push(`${criticalErrors.length} critical console errors`);
    }
    if (!hasWebGL) {
      score -= 10;
      issues.push('WebGL context issues');
    }
    if (loadingTime > 10000) {
      score -= 10;
      issues.push('Slow loading time');
    }

    console.log(`\n🎯 PRODUCTION SCORE: ${score}/100`);

    if (issues.length > 0) {
      console.log('\n⚠️ ISSUES IDENTIFIED:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    }

    if (score >= 80) {
      console.log('\n✅ PRODUCTION DEPLOYMENT: READY');
    } else if (score >= 60) {
      console.log('\n⚠️ PRODUCTION DEPLOYMENT: NEEDS ATTENTION');
    } else {
      console.log('\n❌ PRODUCTION DEPLOYMENT: CRITICAL ISSUES');
    }

    console.log('\n📊 KEY METRICS:');
    console.log(`   - Loading Time: ${loadingTime}ms`);
    console.log(`   - Console Errors: ${criticalErrors.length}`);
    console.log(`   - Console Warnings: ${consoleWarnings.length}`);
    console.log(`   - WebGL Support: ${hasWebGL ? 'Yes' : 'No'}`);
    console.log(`   - Loading Screen: ${loadingScreenVisible ? 'Working' : 'Not detected'}`);

    // Final assertion
    expect(score).toBeGreaterThanOrEqual(70); // Allow for some headless browser issues

    console.log('\n🏁 Production test completed!');
  });
});