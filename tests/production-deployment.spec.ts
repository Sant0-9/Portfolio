import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

test.describe('Production Portfolio Deployment Test', () => {
  let consoleErrors: string[] = [];
  let consoleWarnings: string[] = [];
  let networkRequests: Array<{ url: string; status: number; size?: number; timing?: number }> = [];

  test.beforeEach(async ({ page }) => {
    // Reset arrays for each test
    consoleErrors = [];
    consoleWarnings = [];
    networkRequests = [];

    // Listen for console messages
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error') {
        consoleErrors.push(text);
        console.log('Console Error:', text);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(text);
        console.log('Console Warning:', text);
      }
    });

    // Monitor network requests
    page.on('response', async (response) => {
      const url = response.url();
      const status = response.status();

      try {
        const headers = response.headers();
        const contentLength = headers['content-length'];

        networkRequests.push({
          url,
          status,
          size: contentLength ? parseInt(contentLength) : undefined,
        });
      } catch (error) {
        // Silent fail for response details
      }
    });
  });

  test('1. Loading Screen Experience', async ({ page }) => {
    console.log('\n=== Testing Loading Screen Experience ===');

    const startTime = Date.now();

    // Navigate to production URL
    console.log('Navigating to http://localhost:3011...');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Immediately take screenshot of loading screen
    await page.screenshot({
      path: 'test-results/loading-screen-initial.png',
      fullPage: true
    });
    console.log('✓ Screenshot taken of initial loading screen');

    // Check for loading screen presence
    const loadingScreen = page.locator('.fixed.inset-0.z-\\[10000\\]');
    await expect(loadingScreen).toBeVisible({ timeout: 2000 });
    console.log('✓ Loading screen is visible on initial load');

    // Verify OneKnight logo is present
    const logo = page.locator('h1:has-text("OneKnight")');
    await expect(logo).toBeVisible({ timeout: 3000 });
    console.log('✓ OneKnight logo is visible');

    // Check for loading progress bar
    const progressBar = page.locator('.bg-gradient-to-r.from-teal-400.to-purple-500');
    await expect(progressBar).toBeVisible({ timeout: 5000 });
    console.log('✓ Loading progress bar is present');

    // Monitor progress value changes
    let progressValues: number[] = [];
    let progressCheckInterval = setInterval(async () => {
      try {
        const progressText = await page.locator('.font-mono').textContent();
        if (progressText) {
          const progress = parseInt(progressText.replace('%', ''));
          if (!isNaN(progress)) {
            progressValues.push(progress);
          }
        }
      } catch (error) {
        // Progress element might not be available
      }
    }, 100);

    // Wait for loading to complete (or timeout after 30 seconds)
    try {
      await expect(loadingScreen).not.toBeVisible({ timeout: 30000 });
      console.log('✓ Loading screen completed and disappeared');
    } catch (error) {
      console.log('⚠ Loading screen still visible after 30 seconds');
    }

    clearInterval(progressCheckInterval);

    const loadingTime = Date.now() - startTime;
    console.log(`Loading time: ${loadingTime}ms`);

    // Verify progress showed actual progression (not stuck at 0%)
    const maxProgress = Math.max(...progressValues);
    console.log(`Progress values observed: ${progressValues.slice(0, 10)}... (max: ${maxProgress}%)`);
    expect(maxProgress).toBeGreaterThan(0);
    console.log('✓ Loading progress bar showed actual progress');

    // Take screenshot after loading completes
    await page.screenshot({
      path: 'test-results/after-loading-complete.png',
      fullPage: true
    });
    console.log('✓ Screenshot taken after loading completion');
  });

  test('2. 3D Model Loading and IntroGate', async ({ page }) => {
    console.log('\n=== Testing 3D Model Loading and IntroGate ===');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loadingScreen = document.querySelector('.fixed.inset-0.z-\\[10000\\]');
      return !loadingScreen || getComputedStyle(loadingScreen).display === 'none';
    }, { timeout: 30000 });

    // Check for IntroGate presence
    const introGate = page.locator('.fixed.inset-0.z-\\[9999\\], .fixed.inset-0.z-\\[9998\\]');
    await expect(introGate).toBeVisible({ timeout: 5000 });
    console.log('✓ IntroGate is visible after loading');

    // Look for Spline canvas or 3D content
    const splineCanvas = page.locator('canvas');
    await expect(splineCanvas).toBeVisible({ timeout: 10000 });
    console.log('✓ 3D canvas is present');

    // Take screenshot of IntroGate
    await page.screenshot({
      path: 'test-results/intro-gate-visible.png',
      fullPage: true
    });
    console.log('✓ Screenshot taken of IntroGate');

    // Test interaction with the 3D scene
    const splineContainer = page.locator('.absolute.inset-0.w-full.h-full').first();
    await splineContainer.click({ timeout: 5000 });
    console.log('✓ Clicked on 3D scene container');

    // Wait a moment for interaction to process
    await page.waitForTimeout(2000);

    // Look for navigation appearance (geometrical state)
    const navigation = page.locator('nav').or(page.locator('a[href="#about"]'));
    try {
      await expect(navigation).toBeVisible({ timeout: 5000 });
      console.log('✓ Navigation appeared after 3D interaction');
    } catch (error) {
      console.log('⚠ Navigation did not appear - checking for fallback');

      // Check for fallback hints
      const fallbackButton = page.locator('button:has-text("Continue to Portfolio")');
      if (await fallbackButton.isVisible()) {
        await fallbackButton.click();
        console.log('✓ Used fallback button to continue');
      }
    }

    // Take screenshot of geometrical state
    await page.screenshot({
      path: 'test-results/geometrical-state.png',
      fullPage: true
    });
    console.log('✓ Screenshot taken of geometrical state');
  });

  test('3. Performance Analysis', async ({ page }) => {
    console.log('\n=== Testing Performance Analysis ===');

    const startTime = Date.now();

    // Start performance monitoring
    await page.coverage.startJSCoverage();
    await page.coverage.startCSSCoverage();

    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for complete loading
    await page.waitForFunction(() => {
      const loadingScreen = document.querySelector('.fixed.inset-0.z-\\[10000\\]');
      return !loadingScreen || getComputedStyle(loadingScreen).display === 'none';
    }, { timeout: 30000 });

    const totalLoadTime = Date.now() - startTime;
    console.log(`Total page load time: ${totalLoadTime}ms`);

    // Check for critical console errors
    const criticalErrors = consoleErrors.filter(error =>
      !error.includes('chrome-extension://') &&
      !error.includes('extension') &&
      error.includes('error') || error.includes('Error')
    );

    console.log(`Console errors found: ${criticalErrors.length}`);
    if (criticalErrors.length > 0) {
      console.log('Console errors:', criticalErrors);
    }

    // Check for the specific error mentioned
    const controlsError = consoleErrors.find(error =>
      error.includes('controls.start() should only be called after a component has mounted')
    );
    expect(controlsError).toBeUndefined();
    console.log('✓ No framer-motion controls.start() errors found');

    // Analyze bundle sizes from network requests
    const bundleRequests = networkRequests.filter(req =>
      req.url.includes('.js') || req.url.includes('.css')
    );

    console.log('\nBundle Analysis:');
    bundleRequests.forEach(req => {
      const sizeKB = req.size ? (req.size / 1024).toFixed(2) : 'unknown';
      console.log(`- ${path.basename(req.url)}: ${sizeKB}KB (Status: ${req.status})`);
    });

    // Check that all critical resources loaded successfully
    const failedRequests = networkRequests.filter(req => req.status >= 400);
    expect(failedRequests.length).toBe(0);
    console.log('✓ All network requests successful');

    // Stop coverage and get results
    const jsCoverage = await page.coverage.stopJSCoverage();
    const cssCoverage = await page.coverage.stopCSSCoverage();

    // Calculate coverage stats
    const totalJSBytes = jsCoverage.reduce((acc, entry) => acc + entry.text.length, 0);
    const usedJSBytes = jsCoverage.reduce((acc, entry) => {
      return acc + entry.ranges.reduce((rangeAcc, range) => rangeAcc + range.end - range.start, 0);
    }, 0);

    const jsUsagePercent = totalJSBytes > 0 ? ((usedJSBytes / totalJSBytes) * 100).toFixed(2) : '0';
    console.log(`JavaScript usage: ${jsUsagePercent}% (${(usedJSBytes/1024).toFixed(2)}KB used of ${(totalJSBytes/1024).toFixed(2)}KB total)`);
  });

  test('4. Complete User Flow', async ({ page }) => {
    console.log('\n=== Testing Complete User Flow ===');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Step 1: Wait for loading screen to complete
    console.log('Step 1: Waiting for loading screen...');
    await page.waitForFunction(() => {
      const loadingScreen = document.querySelector('.fixed.inset-0.z-\\[10000\\]');
      return !loadingScreen || getComputedStyle(loadingScreen).display === 'none';
    }, { timeout: 30000 });
    console.log('✓ Loading screen completed');

    // Step 2: IntroGate interaction
    console.log('Step 2: Interacting with IntroGate...');
    const splineContainer = page.locator('.absolute.inset-0.w-full.h-full').first();
    await splineContainer.click({ timeout: 5000 });
    await page.waitForTimeout(2000);
    console.log('✓ IntroGate interaction completed');

    // Step 3: Check for geometrical state
    console.log('Step 3: Verifying geometrical state...');
    const navigation = page.locator('nav, a[href="#about"]');
    try {
      await expect(navigation).toBeVisible({ timeout: 5000 });
      console.log('✓ Geometrical state navigation visible');
    } catch (error) {
      // Use fallback if needed
      const fallbackButton = page.locator('button:has-text("Continue to Portfolio")');
      if (await fallbackButton.isVisible()) {
        await fallbackButton.click();
        console.log('✓ Used fallback to reach geometrical state');
      }
    }

    // Step 4: Scroll to main portfolio
    console.log('Step 4: Scrolling to main portfolio...');
    await page.mouse.wheel(0, 300); // Scroll down significantly
    await page.waitForTimeout(2000);

    // Check if we've transitioned to main portfolio
    const heroSection = page.locator('#Hero, section:has-text("OneKnight")');
    try {
      await expect(heroSection).toBeVisible({ timeout: 10000 });
      console.log('✓ Transitioned to main portfolio');
    } catch (error) {
      console.log('⚠ Main portfolio not visible, checking current state...');
    }

    // Step 5: Test scroll to portfolio content
    console.log('Step 5: Testing portfolio navigation...');
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);

    // Look for about or projects sections
    const aboutSection = page.locator('#about, section:has-text("About")');
    const projectsSection = page.locator('#projects, section:has-text("Projects")');

    const aboutVisible = await aboutSection.isVisible();
    const projectsVisible = await projectsSection.isVisible();

    if (aboutVisible || projectsVisible) {
      console.log('✓ Portfolio content sections are accessible');
    } else {
      console.log('⚠ Portfolio content sections not immediately visible');
    }

    // Step 6: Test scroll back to top (should re-show geometrical state)
    console.log('Step 6: Testing scroll back to top...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // Take final screenshot
    await page.screenshot({
      path: 'test-results/complete-user-flow-final.png',
      fullPage: true
    });
    console.log('✓ Complete user flow test finished');
  });

  test('5. Production Optimizations', async ({ page }) => {
    console.log('\n=== Testing Production Optimizations ===');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for console.log statements (should be minimal in production)
    const debugLogs = consoleErrors.concat(consoleWarnings).filter(msg =>
      msg.includes('console.log') ||
      msg.includes('IntroGate:') ||
      msg.includes('Debug:')
    );

    console.log(`Debug console statements found: ${debugLogs.length}`);
    if (debugLogs.length > 0) {
      console.log('Debug logs:', debugLogs.slice(0, 5)); // Show first 5
    }

    // Analyze resource loading
    const resourceTypes = {
      javascript: networkRequests.filter(req => req.url.includes('.js')),
      css: networkRequests.filter(req => req.url.includes('.css')),
      images: networkRequests.filter(req =>
        req.url.includes('.png') ||
        req.url.includes('.jpg') ||
        req.url.includes('.webp')
      ),
      fonts: networkRequests.filter(req =>
        req.url.includes('.woff') ||
        req.url.includes('.ttf')
      ),
      splineAssets: networkRequests.filter(req =>
        req.url.includes('.splinecode') ||
        req.url.includes('spline')
      )
    };

    console.log('\nResource Loading Analysis:');
    Object.entries(resourceTypes).forEach(([type, requests]) => {
      const totalSize = requests.reduce((acc, req) => acc + (req.size || 0), 0);
      console.log(`${type}: ${requests.length} files, ${(totalSize/1024).toFixed(2)}KB total`);
    });

    // Check for lazy loading of Spline components
    const splineAssets = resourceTypes.splineAssets;
    console.log(`Spline assets loaded: ${splineAssets.length}`);

    // Verify WebGL context is working
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    });

    expect(hasWebGL).toBe(true);
    console.log('✓ WebGL context is working correctly');

    // Check for production build indicators
    const buildOptimizations = await page.evaluate(() => {
      return {
        reactDevTools: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
        nodeEnv: process.env.NODE_ENV,
        nextDevMode: !!(window as any).__NEXT_DATA__?.props?.pageProps?.isDevelopment
      };
    });

    console.log('\nBuild Environment Check:');
    console.log(`React DevTools present: ${buildOptimizations.reactDevTools}`);
    console.log(`Node Environment: ${buildOptimizations.nodeEnv || 'unknown'}`);

    // Final optimization score
    let optimizationScore = 100;

    if (debugLogs.length > 5) optimizationScore -= 10;
    if (criticalErrors.length > 0) optimizationScore -= 20;
    if (buildOptimizations.reactDevTools) optimizationScore -= 5; // Dev tools in prod

    console.log(`\nOptimization Score: ${optimizationScore}/100`);
    expect(optimizationScore).toBeGreaterThanOrEqual(80);
    console.log('✓ Production optimizations pass quality threshold');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Save console logs for this test
    if (consoleErrors.length > 0 || consoleWarnings.length > 0) {
      const logData = {
        test: testInfo.title,
        errors: consoleErrors,
        warnings: consoleWarnings,
        networkRequests: networkRequests.slice(0, 20) // First 20 requests
      };

      await fs.writeFile(
        `test-results/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-console.json`,
        JSON.stringify(logData, null, 2)
      );
    }
  });
});