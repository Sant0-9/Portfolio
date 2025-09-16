const { chromium } = require('playwright');

(async () => {
  console.log('Starting comprehensive scrolling issue test...');

  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to the site
    console.log('Step 1: Navigating to localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test-screenshots/01-initial-state.png', fullPage: true });
    console.log('✓ Initial screenshot taken');

    // Step 2: Look for the Spline scene and analyze its state
    console.log('Step 2: Analyzing Spline scene...');

    // Check if Spline canvas exists
    const splineCanvas = await page.locator('canvas').first();
    const canvasExists = await splineCanvas.count() > 0;
    console.log(`Spline canvas exists: ${canvasExists}`);

    if (canvasExists) {
      const canvasBox = await splineCanvas.boundingBox();
      console.log('Canvas bounding box:', canvasBox);
    }

    // Check IntroGate component state
    const introGate = await page.locator('[class*="IntroGate"]').first();
    const introGateExists = await introGate.count() > 0;
    console.log(`IntroGate component exists: ${introGateExists}`);

    if (introGateExists) {
      const introGateStyles = await introGate.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          position: styles.position,
          zIndex: styles.zIndex,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity
        };
      });
      console.log('IntroGate styles:', introGateStyles);
    }

    // Step 3: Wait and look for "Click Me" or any clickable elements
    console.log('Step 3: Looking for clickable elements...');
    await page.waitForTimeout(3000); // Wait for Spline to fully load

    // Try to find any text that might be "Click Me" or similar
    const clickableTexts = await page.getByText(/click/i).all();
    console.log(`Found ${clickableTexts.length} elements with "click" text`);

    // Take screenshot after Spline loads
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test-screenshots/02-after-spline-load.png', fullPage: true });
    console.log('✓ Post-load screenshot taken');

    // Step 4: Try clicking on various parts of the Spline scene
    console.log('Step 4: Attempting to click on Spline scene...');

    if (canvasExists) {
      const canvasBox = await splineCanvas.boundingBox();
      if (canvasBox) {
        // Try clicking center of canvas
        console.log('Clicking center of canvas...');
        await page.mouse.click(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
        await page.waitForTimeout(1000);

        // Try clicking different areas
        console.log('Clicking various canvas areas...');
        await page.mouse.click(canvasBox.x + canvasBox.width * 0.3, canvasBox.y + canvasBox.height * 0.3);
        await page.waitForTimeout(1000);

        await page.mouse.click(canvasBox.x + canvasBox.width * 0.7, canvasBox.y + canvasBox.height * 0.7);
        await page.waitForTimeout(1000);
      }
    }

    // Step 5: Take screenshot after clicking
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test-screenshots/03-after-clicking.png', fullPage: true });
    console.log('✓ Post-click screenshot taken');

    // Check if IntroGate state changed
    if (introGateExists) {
      const introGateAfterClick = await introGate.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          position: styles.position,
          zIndex: styles.zIndex,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          transform: styles.transform
        };
      });
      console.log('IntroGate styles after click:', introGateAfterClick);
    }

    // Step 6: Try scrolling multiple times and analyze
    console.log('Step 6: Testing scroll behavior...');

    for (let i = 1; i <= 5; i++) {
      console.log(`Scroll attempt ${i}...`);

      // Get current scroll position
      const scrollBefore = await page.evaluate(() => ({
        scrollY: window.scrollY,
        scrollTop: document.documentElement.scrollTop,
        bodyScrollTop: document.body.scrollTop
      }));
      console.log(`Scroll position before attempt ${i}:`, scrollBefore);

      // Try mouse wheel scroll
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);

      // Get scroll position after
      const scrollAfter = await page.evaluate(() => ({
        scrollY: window.scrollY,
        scrollTop: document.documentElement.scrollTop,
        bodyScrollTop: document.body.scrollTop
      }));
      console.log(`Scroll position after attempt ${i}:`, scrollAfter);

      // Take screenshot
      await page.screenshot({ path: `/home/oneknight/projects/portfolio/test-screenshots/04-scroll-attempt-${i}.png`, fullPage: true });
      console.log(`✓ Scroll attempt ${i} screenshot taken`);

      // Check if About Me section is visible
      const aboutMeSection = await page.locator('[id*="about"], [class*="about"], h2:has-text("About"), h1:has-text("About")').first();
      const aboutMeVisible = await aboutMeSection.count() > 0;

      if (aboutMeVisible) {
        const aboutMeBox = await aboutMeSection.boundingBox();
        const isInViewport = aboutMeBox && aboutMeBox.y < 1080 && aboutMeBox.y > -100;
        console.log(`About Me section visible: ${aboutMeVisible}, in viewport: ${isInViewport}`);
        if (aboutMeBox) {
          console.log('About Me bounding box:', aboutMeBox);
        }
      } else {
        console.log('About Me section not found in DOM');
      }
    }

    // Step 7: Analyze DOM structure for content availability
    console.log('Step 7: Analyzing DOM structure...');

    // Check all main sections
    const allSections = await page.locator('section, div[class*="section"], main > div').all();
    console.log(`Found ${allSections.length} potential sections`);

    for (let i = 0; i < Math.min(allSections.length, 10); i++) {
      const section = allSections[i];
      const sectionInfo = await section.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          textContent: el.textContent.substring(0, 50) + '...',
          boundingBox: rect,
          styles: {
            position: styles.position,
            zIndex: styles.zIndex,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            top: styles.top,
            transform: styles.transform
          }
        };
      });
      console.log(`Section ${i}:`, sectionInfo);
    }

    // Step 8: Check z-index conflicts
    console.log('Step 8: Checking z-index conflicts...');

    const elementsWithZIndex = await page.evaluate(() => {
      const elements = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        const styles = window.getComputedStyle(node);
        const zIndex = styles.zIndex;
        if (zIndex !== 'auto' && zIndex !== '0') {
          elements.push({
            tagName: node.tagName,
            className: node.className,
            id: node.id,
            zIndex: zIndex,
            position: styles.position
          });
        }
      }
      return elements.sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));
    });

    console.log('Elements with z-index (sorted by highest first):');
    elementsWithZIndex.forEach((el, i) => {
      console.log(`  ${i + 1}. ${el.tagName}.${el.className} - z-index: ${el.zIndex}, position: ${el.position}`);
    });

    // Step 9: Check scroll event handling
    console.log('Step 9: Testing scroll event detection...');

    await page.evaluate(() => {
      let scrollCount = 0;
      window.addEventListener('scroll', () => {
        scrollCount++;
        console.log(`Scroll event ${scrollCount} detected, scrollY: ${window.scrollY}`);
      });

      // Store scroll count on window for later access
      window.testScrollCount = scrollCount;
    });

    // Scroll again and check if events are firing
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(1000);

    const scrollEventCount = await page.evaluate(() => window.testScrollCount);
    console.log(`Scroll events detected: ${scrollEventCount}`);

    // Final comprehensive screenshot
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/test-screenshots/05-final-state.png', fullPage: true });
    console.log('✓ Final screenshot taken');

    // Step 10: Check for any overlays or blocking elements
    console.log('Step 10: Checking for blocking overlays...');

    const overlayElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const overlays = [];

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        if (
          styles.position === 'fixed' ||
          styles.position === 'absolute' ||
          (parseInt(styles.zIndex) > 100 && styles.position !== 'static')
        ) {
          overlays.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            position: styles.position,
            zIndex: styles.zIndex,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
          });
        }
      });

      return overlays;
    });

    console.log('Potential overlay elements:');
    overlayElements.forEach((el, i) => {
      console.log(`  ${i + 1}. ${el.tagName}.${el.className} - position: ${el.position}, z-index: ${el.zIndex}, size: ${el.width}x${el.height}`);
    });

    console.log('\n=== TEST COMPLETE ===');
    console.log('Check the screenshots in /home/oneknight/projects/portfolio/test-screenshots/ for visual analysis');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();