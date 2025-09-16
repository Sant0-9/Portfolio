const { chromium } = require('playwright');
const fs = require('fs');

async function investigateScrollingIssueV2() {
  console.log('Starting detailed Playwright investigation...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('Taking initial screenshot...');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_01_initial.png', fullPage: true });

    // First, let's get detailed DOM information
    console.log('Analyzing DOM structure...');

    const domAnalysis = await page.evaluate(() => {
      const body = document.body;

      // Find all elements with high z-index
      const allElements = Array.from(document.querySelectorAll('*'));
      const highZElements = allElements
        .map(el => {
          const styles = getComputedStyle(el);
          const zIndex = styles.zIndex;
          return {
            element: el,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            zIndex: zIndex,
            position: styles.position,
            display: styles.display,
            visibility: styles.visibility,
            pointerEvents: styles.pointerEvents,
            height: styles.height,
            width: styles.width,
            top: styles.top,
            left: styles.left,
            textContent: el.textContent ? el.textContent.substring(0, 100) : ''
          };
        })
        .filter(el => el.zIndex !== 'auto' && parseInt(el.zIndex) >= 0)
        .sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));

      // Look for IntroGate or similar components
      const introGateSelectors = [
        '[class*="IntroGate"]',
        '[class*="intro-gate"]',
        '[id*="introgate"]',
        '[id*="intro-gate"]',
        '.fixed.inset-0',
        '[class*="spline"]'
      ];

      const introElements = [];
      for (const selector of introGateSelectors) {
        try {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const styles = getComputedStyle(el);
            introElements.push({
              selector,
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              zIndex: styles.zIndex,
              position: styles.position,
              display: styles.display,
              height: styles.height,
              width: styles.width,
              pointerEvents: styles.pointerEvents,
              overflow: styles.overflow
            });
          }
        } catch (e) {}
      }

      // Look for sections that might be hidden
      const sectionsAnalysis = [];
      const sections = document.querySelectorAll('section, div[class*="section"], main, article');
      for (const section of sections) {
        const styles = getComputedStyle(section);
        const rect = section.getBoundingClientRect();
        sectionsAnalysis.push({
          tagName: section.tagName,
          className: section.className,
          id: section.id,
          textContent: section.textContent ? section.textContent.substring(0, 150) : '',
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
          position: styles.position,
          top: styles.top,
          height: styles.height,
          boundingRect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom
          }
        });
      }

      return {
        bodyHeight: document.body.scrollHeight,
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
        highZElements: highZElements.slice(0, 10), // Top 10 highest z-index
        introElements,
        sectionsAnalysis,
        bodyChildren: Array.from(body.children).map(child => ({
          tagName: child.tagName,
          className: child.className,
          id: child.id,
          zIndex: getComputedStyle(child).zIndex,
          position: getComputedStyle(child).position,
          height: getComputedStyle(child).height,
          pointerEvents: getComputedStyle(child).pointerEvents
        }))
      };
    });

    console.log('DOM Analysis Results:');
    console.log('Document heights:', {
      body: domAnalysis.bodyHeight,
      document: domAnalysis.documentHeight,
      viewport: domAnalysis.viewportHeight
    });

    console.log('Body children:', JSON.stringify(domAnalysis.bodyChildren, null, 2));
    console.log('High Z-Index elements:', JSON.stringify(domAnalysis.highZElements, null, 2));
    console.log('Intro elements:', JSON.stringify(domAnalysis.introElements, null, 2));
    console.log('Sections analysis:', JSON.stringify(domAnalysis.sectionsAnalysis, null, 2));

    // Try to interact with the Spline scene using different approaches
    console.log('Attempting to interact with Spline scene...');

    // Method 1: Try to click using force
    try {
      console.log('Method 1: Force click on canvas...');
      await page.click('canvas', { force: true });
      await page.waitForTimeout(2000);
      console.log('Force click succeeded');
      await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_02_after_force_click.png', fullPage: true });
    } catch (e) {
      console.log('Force click failed:', e.message);
    }

    // Method 2: Try clicking on the intercepting element first
    try {
      console.log('Method 2: Click on intercepting element...');
      const interceptingElement = await page.$('.fixed.inset-0');
      if (interceptingElement) {
        await interceptingElement.click();
        await page.waitForTimeout(2000);
        console.log('Clicked intercepting element');
        await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_03_clicked_intercepting.png', fullPage: true });
      }
    } catch (e) {
      console.log('Clicking intercepting element failed:', e.message);
    }

    // Method 3: Try using keyboard or mouse actions
    try {
      console.log('Method 3: Using mouse actions...');
      await page.mouse.click(960, 400); // Center of likely Spline area
      await page.waitForTimeout(2000);
      console.log('Mouse click completed');
      await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_04_mouse_click.png', fullPage: true });
    } catch (e) {
      console.log('Mouse click failed:', e.message);
    }

    // Method 4: Try to trigger the transition via JavaScript
    try {
      console.log('Method 4: Triggering via JavaScript...');
      await page.evaluate(() => {
        // Look for any event listeners or functions that might trigger the transition
        const canvas = document.querySelector('canvas');
        if (canvas) {
          canvas.click();
          canvas.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          canvas.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        }
      });
      await page.waitForTimeout(2000);
      console.log('JavaScript events dispatched');
      await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_05_js_events.png', fullPage: true });
    } catch (e) {
      console.log('JavaScript events failed:', e.message);
    }

    // Now let's test scrolling behavior regardless of whether we triggered the transition
    console.log('Testing scroll behavior...');

    const scrollTests = [
      { method: 'scrollTo', y: 500, name: 'scroll_500' },
      { method: 'scrollTo', y: 1000, name: 'scroll_1000' },
      { method: 'scrollTo', y: 1500, name: 'scroll_1500' },
      { method: 'scrollBy', y: 300, name: 'scroll_by_300' },
      { method: 'wheel', y: 500, name: 'wheel_500' }
    ];

    for (const test of scrollTests) {
      try {
        console.log(`Testing ${test.method} with y=${test.y}...`);

        if (test.method === 'scrollTo') {
          await page.evaluate((y) => window.scrollTo(0, y), test.y);
        } else if (test.method === 'scrollBy') {
          await page.evaluate((y) => window.scrollBy(0, y), test.y);
        } else if (test.method === 'wheel') {
          await page.mouse.wheel(0, test.y);
        }

        await page.waitForTimeout(1000);

        const scrollY = await page.evaluate(() => window.scrollY);
        console.log(`Scroll position after ${test.method}: ${scrollY}`);

        await page.screenshot({
          path: `/home/oneknight/projects/portfolio/screenshots/v2_06_${test.name}.png`,
          fullPage: true
        });

        // Check what's visible in the viewport
        const visibleElements = await page.evaluate(() => {
          const viewport = {
            top: window.scrollY,
            bottom: window.scrollY + window.innerHeight
          };

          const visibleSections = [];
          const sections = document.querySelectorAll('section, div[class*="section"], main, article');

          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            const absoluteBottom = absoluteTop + rect.height;

            if (absoluteBottom > viewport.top && absoluteTop < viewport.bottom) {
              visibleSections.push({
                tagName: section.tagName,
                className: section.className,
                id: section.id,
                textContent: section.textContent ? section.textContent.substring(0, 100) : '',
                absoluteTop,
                absoluteBottom,
                visible: true
              });
            }
          }

          return {
            viewport,
            visibleSections,
            totalScrollHeight: document.documentElement.scrollHeight
          };
        });

        console.log(`Visible elements at scroll ${scrollY}:`, JSON.stringify(visibleElements, null, 2));

      } catch (e) {
        console.log(`Scroll test ${test.name} failed:`, e.message);
      }
    }

    // Take final comprehensive screenshot
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_07_final.png', fullPage: true });

  } catch (error) {
    console.error('Error during investigation:', error);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/v2_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

investigateScrollingIssueV2().then(() => {
  console.log('Detailed investigation completed. Check screenshots for results.');
}).catch(console.error);