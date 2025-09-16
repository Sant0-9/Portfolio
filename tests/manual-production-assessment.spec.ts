import { test, expect } from '@playwright/test';

test.describe('Manual Production Assessment', () => {
  test('Production Portfolio Manual Assessment', async ({ page }) => {
    console.log('\n🔍 MANUAL PRODUCTION ASSESSMENT');
    console.log('================================');

    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, any> = {};

    // Listen for console messages
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('chrome-extension://')) {
        errors.push(text);
      } else if (msg.type() === 'warning' && !text.includes('chrome-extension://')) {
        warnings.push(text);
      }
    });

    // Navigate and wait for basic loading
    console.log('\n1. 🌐 Loading Production Page...');
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const pageLoadTime = Date.now() - startTime;
    metrics.pageLoadTime = pageLoadTime;
    console.log(`   ✅ Page loaded in ${pageLoadTime}ms`);

    // Test 1: Basic Page Structure
    console.log('\n2. 🏗️ Checking Page Structure...');
    const hasHtml = await page.locator('html').isVisible();
    const hasBody = await page.locator('body').isVisible();
    const hasContent = await page.locator('*').count() > 10;

    console.log(`   HTML element: ${hasHtml ? '✅' : '❌'}`);
    console.log(`   Body element: ${hasBody ? '✅' : '❌'}`);
    console.log(`   Content elements: ${hasContent ? '✅' : '❌'}`);

    // Test 2: Loading Screen Detection
    console.log('\n3. 📱 Loading Screen Analysis...');
    let loadingScreenFound = false;
    let loadingScreenWithContent = false;

    try {
      // Check multiple possible loading screen selectors
      const loadingSelectors = [
        '.fixed.inset-0.z-\\[10000\\]',
        '[class*="loading"]',
        '[class*="Loading"]',
        'div:has-text("OneKnight")',
        'div:has-text("Loading")'
      ];

      for (const selector of loadingSelectors) {
        try {
          const element = page.locator(selector);
          if (await element.isVisible({ timeout: 2000 })) {
            loadingScreenFound = true;
            console.log(`   ✅ Loading element found: ${selector}`);

            // Check for specific loading content
            const hasOneKnight = await page.locator('h1:has-text("OneKnight")').isVisible({ timeout: 1000 });
            const hasProgress = await page.locator('[class*="gradient"]').isVisible({ timeout: 1000 });

            if (hasOneKnight || hasProgress) {
              loadingScreenWithContent = true;
              console.log(`   ✅ Loading screen has proper content`);
            }
            break;
          }
        } catch (e) {
          // Continue checking other selectors
        }
      }
    } catch (e) {
      console.log(`   ⚠️ Loading screen check timeout`);
    }

    console.log(`   Loading screen found: ${loadingScreenFound ? '✅' : '⚠️'}`);
    console.log(`   Loading content proper: ${loadingScreenWithContent ? '✅' : '⚠️'}`);

    // Test 3: 3D Canvas Detection
    console.log('\n4. 🎮 3D Canvas Analysis...');
    await page.waitForTimeout(5000); // Wait for potential 3D loading

    const canvasElements = await page.locator('canvas').count();
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      try {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    });

    console.log(`   Canvas elements: ${canvasElements} ${canvasElements > 0 ? '✅' : '⚠️'}`);
    console.log(`   WebGL context: ${hasWebGL ? '✅' : '⚠️'}`);

    // Test 4: Interactive Elements
    console.log('\n5. 🖱️ Interactive Elements...');
    const clickableElements = await page.locator('button, a, [role="button"], [onclick]').count();
    const hasNavigation = await page.locator('nav, [role="navigation"]').count();

    console.log(`   Clickable elements: ${clickableElements} ${clickableElements > 0 ? '✅' : '⚠️'}`);
    console.log(`   Navigation elements: ${hasNavigation} ${hasNavigation > 0 ? '✅' : '⚠️'}`);

    // Test 5: Typography and Fonts
    console.log('\n6. 🔤 Typography Check...');
    const hasOrbitronFont = await page.evaluate(() => {
      const element = document.querySelector('[style*="Orbitron"]') ||
                     document.querySelector('[class*="font"]');
      return !!element;
    });

    const hasHeadings = await page.locator('h1, h2, h3').count();

    console.log(`   Orbitron font detected: ${hasOrbitronFont ? '✅' : '⚠️'}`);
    console.log(`   Heading elements: ${hasHeadings} ${hasHeadings > 0 ? '✅' : '⚠️'}`);

    // Test 6: Error Analysis
    console.log('\n7. 🐛 Error Analysis...');
    const criticalErrors = errors.filter(error =>
      !error.includes('WebGL') && // Expected in headless
      !error.includes('chrome-extension') &&
      (error.includes('Error') || error.includes('Failed'))
    );

    console.log(`   Total console errors: ${errors.length}`);
    console.log(`   Critical errors: ${criticalErrors.length} ${criticalErrors.length === 0 ? '✅' : '❌'}`);
    console.log(`   Console warnings: ${warnings.length}`);

    if (criticalErrors.length > 0) {
      console.log(`   First critical error: ${criticalErrors[0].substring(0, 100)}...`);
    }

    // Test 7: Performance Metrics
    console.log('\n8. ⚡ Performance Metrics...');
    const performanceMetrics = await page.evaluate(() => {
      const performance = window.performance;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      return {
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime
      };
    });

    console.log(`   DOM Content Loaded: ${performanceMetrics.domContentLoaded?.toFixed(2) || 'N/A'}ms`);
    console.log(`   First Paint: ${performanceMetrics.firstPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`   First Contentful Paint: ${performanceMetrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms`);

    // Take final screenshot
    await page.screenshot({
      path: 'test-results/manual-assessment-final.png',
      fullPage: true,
      timeout: 30000
    });

    // Calculate Overall Score
    console.log('\n📊 PRODUCTION ASSESSMENT SUMMARY');
    console.log('================================');

    let score = 100;
    const issues: string[] = [];

    // Scoring logic
    if (!hasHtml || !hasBody || !hasContent) {
      score -= 30;
      issues.push('Basic page structure issues');
    }
    if (!loadingScreenFound) {
      score -= 15;
      issues.push('Loading screen not detected');
    }
    if (!loadingScreenWithContent) {
      score -= 10;
      issues.push('Loading screen content incomplete');
    }
    if (canvasElements === 0) {
      score -= 20;
      issues.push('No 3D canvas elements found');
    }
    if (!hasWebGL) {
      score -= 10;
      issues.push('WebGL context issues (expected in headless)');
    }
    if (criticalErrors.length > 0) {
      score -= Math.min(criticalErrors.length * 5, 25);
      issues.push(`${criticalErrors.length} critical errors`);
    }
    if (pageLoadTime > 5000) {
      score -= 10;
      issues.push('Slow page load time');
    }

    console.log(`\n🎯 OVERALL SCORE: ${score}/100`);

    if (score >= 90) {
      console.log('🌟 EXCELLENT - Production ready!');
    } else if (score >= 75) {
      console.log('✅ GOOD - Minor optimizations needed');
    } else if (score >= 60) {
      console.log('⚠️ FAIR - Several issues to address');
    } else {
      console.log('❌ POOR - Significant issues need fixing');
    }

    if (issues.length > 0) {
      console.log('\n🔧 IDENTIFIED ISSUES:');
      issues.forEach(issue => console.log(`   • ${issue}`));
    }

    console.log('\n📈 KEY FINDINGS:');
    console.log(`   • Page Load Time: ${pageLoadTime}ms`);
    console.log(`   • Loading Screen: ${loadingScreenFound ? 'Detected' : 'Not found'}`);
    console.log(`   • 3D Canvas: ${canvasElements} elements found`);
    console.log(`   • WebGL: ${hasWebGL ? 'Working' : 'Issues (expected in headless)'}`);
    console.log(`   • Console Errors: ${criticalErrors.length} critical`);
    console.log(`   • Interactive Elements: ${clickableElements} found`);

    console.log('\n✨ PRODUCTION ASSESSMENT COMPLETE');

    // Assert reasonable score (allowing for headless browser limitations)
    expect(score).toBeGreaterThanOrEqual(60);
  });
});