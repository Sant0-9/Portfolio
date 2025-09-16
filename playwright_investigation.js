const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function investigateScrollingIssue() {
  console.log('Starting Playwright investigation of scrolling issue...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    console.log('Taking initial screenshot...');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/01_initial.png', fullPage: true });

    // Log initial page state
    console.log('Initial page title:', await page.title());
    console.log('Initial page URL:', page.url());

    // Check for Spline container and 3D scene
    console.log('Looking for Spline 3D scene elements...');
    const splineElements = await page.$$('canvas, [class*="spline"], [id*="spline"], spline-viewer');
    console.log(`Found ${splineElements.length} potential Spline elements`);

    // Look for any clickable elements that might be the "Click Me" button
    console.log('Searching for interactive elements...');

    // Try to find clickable elements in different ways
    const clickableSelectors = [
      'button:has-text("Click Me")',
      '[role="button"]:has-text("Click Me")',
      'div:has-text("Click Me")',
      'span:has-text("Click Me")',
      '*:has-text("Click Me")',
      'canvas', // Spline canvas might be clickable
      '[class*="click"]',
      '[id*="click"]'
    ];

    let clickableElement = null;

    for (const selector of clickableSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          clickableElement = elements[0];
          break;
        }
      } catch (e) {
        // Selector might not be valid, continue
      }
    }

    // If we found a canvas (likely Spline), try clicking on it
    if (!clickableElement) {
      const canvases = await page.$$('canvas');
      if (canvases.length > 0) {
        console.log(`Found ${canvases.length} canvas elements, will try clicking the first one`);
        clickableElement = canvases[0];
      }
    }

    if (clickableElement) {
      console.log('Found clickable element, attempting to click...');

      // Get element position for clicking
      const box = await clickableElement.boundingBox();
      if (box) {
        console.log(`Element position: x=${box.x}, y=${box.y}, width=${box.width}, height=${box.height}`);

        // Click in the center of the element
        await page.click(`canvas`, { position: { x: box.width / 2, y: box.height / 2 } });

        // Wait for any transitions
        await page.waitForTimeout(2000);

        console.log('Taking screenshot after click...');
        await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/02_after_click.png', fullPage: true });
      }
    } else {
      console.log('No clickable element found, taking screenshot anyway...');
      await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/02_no_click.png', fullPage: true });
    }

    // Test scrolling behavior
    console.log('Testing scroll behavior...');

    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll position: ${initialScrollY}`);

    // Try scrolling down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);

    let scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Scroll position after scrollTo(0, 500): ${scrollY}`);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/03_scroll_500.png', fullPage: true });

    // Try scrolling further
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);

    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Scroll position after scrollTo(0, 1000): ${scrollY}`);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/04_scroll_1000.png', fullPage: true });

    // Try using keyboard scroll
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(1000);
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Scroll position after PageDown: ${scrollY}`);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/05_pagedown.png', fullPage: true });

    // Inspect DOM structure
    console.log('Inspecting DOM structure...');

    const bodyInfo = await page.evaluate(() => {
      const body = document.body;
      return {
        children: Array.from(body.children).map(child => ({
          tagName: child.tagName,
          className: child.className,
          id: child.id,
          zIndex: getComputedStyle(child).zIndex,
          position: getComputedStyle(child).position,
          height: getComputedStyle(child).height,
          overflow: getComputedStyle(child).overflow
        }))
      };
    });

    console.log('Body children:', JSON.stringify(bodyInfo, null, 2));

    // Look specifically for IntroGate component
    const introGateInfo = await page.evaluate(() => {
      const introGate = document.querySelector('[class*="IntroGate"], [id*="introgate"], [class*="intro-gate"]');
      if (introGate) {
        const styles = getComputedStyle(introGate);
        return {
          found: true,
          tagName: introGate.tagName,
          className: introGate.className,
          id: introGate.id,
          zIndex: styles.zIndex,
          position: styles.position,
          height: styles.height,
          width: styles.width,
          overflow: styles.overflow,
          display: styles.display,
          top: styles.top,
          left: styles.left
        };
      }
      return { found: false };
    });

    console.log('IntroGate info:', JSON.stringify(introGateInfo, null, 2));

    // Look for About Me section
    const aboutMeInfo = await page.evaluate(() => {
      const selectors = [
        '[class*="about"]',
        '[id*="about"]',
        'section:has-text("About Me")',
        '*:has-text("About Me")',
        'h1:has-text("About")',
        'h2:has-text("About")',
        'h3:has-text("About")'
      ];

      const results = [];

      for (const selector of selectors) {
        try {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const styles = getComputedStyle(element);
            results.push({
              selector,
              tagName: element.tagName,
              className: element.className,
              id: element.id,
              textContent: element.textContent.substring(0, 100),
              zIndex: styles.zIndex,
              position: styles.position,
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity,
              height: styles.height,
              top: styles.top
            });
          }
        } catch (e) {
          // Invalid selector
        }
      }

      return results;
    });

    console.log('About Me section info:', JSON.stringify(aboutMeInfo, null, 2));

    // Check document height and scroll height
    const documentInfo = await page.evaluate(() => {
      return {
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        bodyHeight: document.body.scrollHeight,
        maxScrollY: document.documentElement.scrollHeight - window.innerHeight
      };
    });

    console.log('Document info:', JSON.stringify(documentInfo, null, 2));

    // Check all elements with high z-index that might be blocking
    const highZIndexElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const highZElements = [];

      for (const element of allElements) {
        const zIndex = getComputedStyle(element).zIndex;
        if (zIndex !== 'auto' && parseInt(zIndex) > 10) {
          const styles = getComputedStyle(element);
          highZElements.push({
            tagName: element.tagName,
            className: element.className,
            id: element.id,
            zIndex: zIndex,
            position: styles.position,
            height: styles.height,
            width: styles.width,
            top: styles.top,
            left: styles.left,
            display: styles.display
          });
        }
      }

      return highZElements.sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));
    });

    console.log('High z-index elements:', JSON.stringify(highZIndexElements, null, 2));

    // Take final full page screenshot
    console.log('Taking final full page screenshot...');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/06_final_full.png', fullPage: true });

  } catch (error) {
    console.error('Error during investigation:', error);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/screenshots/error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Create screenshots directory if it doesn't exist
const screenshotsDir = '/home/oneknight/projects/portfolio/screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

investigateScrollingIssue().then(() => {
  console.log('Investigation completed. Check the screenshots directory for visual evidence.');
}).catch(console.error);