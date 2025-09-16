const { chromium } = require('playwright');

async function detailedScrollTest() {
  console.log('Starting detailed Spline scroll test...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Enable JavaScript console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('Step 1: Navigate and wait for network idle');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('Step 2: Initial page analysis');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/detailed_1_initial.png', fullPage: true });

    // Wait for potential 3D scene loading
    console.log('Step 3: Wait for Spline to potentially load');
    await page.waitForTimeout(5000);

    // Check for Spline-related elements
    const splineElements = await page.evaluate(() => {
      // Look for Spline-specific elements
      const splineScript = document.querySelector('script[src*="spline"]');
      const splineCanvases = document.querySelectorAll('canvas');
      const splineContainers = document.querySelectorAll('[class*="spline"], [id*="spline"]');

      console.log('Spline script found:', !!splineScript);
      console.log('Canvas elements found:', splineCanvases.length);
      console.log('Spline containers found:', splineContainers.length);

      // Check for any clickable elements or text related to interaction
      const allText = document.body.innerText.toLowerCase();
      const hasClickText = allText.includes('click') || allText.includes('interact');

      return {
        splineScript: !!splineScript,
        canvasCount: splineCanvases.length,
        splineContainers: splineContainers.length,
        hasClickText,
        bodyText: allText.substring(0, 500) // First 500 chars for debugging
      };
    });

    console.log('Spline analysis:', splineElements);

    console.log('Step 4: Check current scroll position and document height');
    const initialDimensions = await page.evaluate(() => ({
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight
    }));
    console.log('Initial dimensions:', initialDimensions);

    // Look for the IntroGate component or overlay that might be blocking
    console.log('Step 5: Check for overlay/gate components');
    const overlayInfo = await page.evaluate(() => {
      const overlays = [];

      // Look for elements with high z-index
      const allElements = document.querySelectorAll('*');
      for (let el of allElements) {
        const style = window.getComputedStyle(el);
        const zIndex = parseInt(style.zIndex);
        if (zIndex > 1000) {
          overlays.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            zIndex: zIndex,
            position: style.position,
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity
          });
        }
      }

      return overlays;
    });
    console.log('High z-index elements found:', overlayInfo);

    // Take a screenshot before any interaction
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/detailed_2_before_interaction.png', fullPage: true });

    console.log('Step 6: Try to find and trigger Spline interaction');

    // Method 1: Click on canvas elements
    const canvases = await page.locator('canvas').all();
    console.log(`Found ${canvases.length} canvas elements`);

    for (let i = 0; i < canvases.length; i++) {
      console.log(`Attempting to click canvas ${i + 1}`);
      const canvas = canvases[i];

      // Get canvas properties
      const canvasInfo = await canvas.evaluate(el => ({
        width: el.width,
        height: el.height,
        offsetWidth: el.offsetWidth,
        offsetHeight: el.offsetHeight,
        display: window.getComputedStyle(el).display,
        visibility: window.getComputedStyle(el).visibility,
        opacity: window.getComputedStyle(el).opacity
      }));
      console.log(`Canvas ${i + 1} info:`, canvasInfo);

      // Try clicking different areas of the canvas
      if (canvasInfo.display !== 'none' && canvasInfo.visibility !== 'hidden') {
        const box = await canvas.boundingBox();
        if (box) {
          console.log(`Canvas ${i + 1} bounding box:`, box);

          // Click multiple points on the canvas
          const clickPoints = [
            { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 }, // center
            { x: box.x + box.width * 0.3, y: box.y + box.height * 0.3 }, // top-left quadrant
            { x: box.x + box.width * 0.7, y: box.y + box.height * 0.3 }, // top-right quadrant
            { x: box.x + box.width * 0.3, y: box.y + box.height * 0.7 }, // bottom-left quadrant
            { x: box.x + box.width * 0.7, y: box.y + box.height * 0.7 }, // bottom-right quadrant
          ];

          for (let j = 0; j < clickPoints.length; j++) {
            console.log(`Clicking point ${j + 1} on canvas ${i + 1}: ${clickPoints[j].x}, ${clickPoints[j].y}`);
            await page.mouse.click(clickPoints[j].x, clickPoints[j].y);
            await page.waitForTimeout(2000);

            // Check if anything changed after click
            const afterClickState = await page.evaluate(() => ({
              scrollY: window.scrollY,
              currentOpacity: document.querySelector('[style*="opacity"]') ?
                window.getComputedStyle(document.querySelector('[style*="opacity"]')).opacity : null,
              visibleText: document.body.innerText.substring(0, 100)
            }));
            console.log(`After click ${j + 1} on canvas ${i + 1}:`, afterClickState);

            await page.screenshot({
              path: `/home/oneknight/projects/portfolio/detailed_3_after_canvas_${i + 1}_click_${j + 1}.png`,
              fullPage: true
            });
          }
        }
      }
    }

    console.log('Step 7: Now test scrolling behavior extensively');

    // Check scroll before
    const beforeScroll = await page.evaluate(() => ({
      scrollY: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight
    }));
    console.log('Before scroll test:', beforeScroll);

    // Try different scrolling methods
    const scrollMethods = [
      { name: 'wheel_500', action: () => page.mouse.wheel(0, 500) },
      { name: 'wheel_1000', action: () => page.mouse.wheel(0, 1000) },
      { name: 'keyboard_pagedown', action: () => page.keyboard.press('PageDown') },
      { name: 'keyboard_space', action: () => page.keyboard.press('Space') },
      { name: 'keyboard_down_arrow', action: () => page.keyboard.press('ArrowDown') },
      { name: 'evaluateScroll', action: () => page.evaluate(() => window.scrollTo(0, window.scrollY + 500)) }
    ];

    for (let i = 0; i < scrollMethods.length; i++) {
      const method = scrollMethods[i];
      console.log(`Testing scroll method: ${method.name}`);

      const beforeMethodScroll = await page.evaluate(() => window.scrollY);
      await method.action();
      await page.waitForTimeout(1000);
      const afterMethodScroll = await page.evaluate(() => window.scrollY);

      console.log(`${method.name}: ${beforeMethodScroll} -> ${afterMethodScroll} (moved: ${afterMethodScroll - beforeMethodScroll}px)`);

      await page.screenshot({
        path: `/home/oneknight/projects/portfolio/detailed_4_scroll_${method.name}.png`,
        fullPage: true
      });

      // Check what's visible
      const visibleContent = await page.evaluate(() => {
        const aboutSection = document.querySelector('#about, [id*="about"], [class*="about"]');
        const skillsSection = document.querySelector('#skills, [id*="skills"], [class*="skills"]');

        return {
          aboutVisible: aboutSection ? aboutSection.getBoundingClientRect().top < window.innerHeight : false,
          skillsVisible: skillsSection ? skillsSection.getBoundingClientRect().top < window.innerHeight : false,
          currentScroll: window.scrollY,
          viewportHeight: window.innerHeight
        };
      });
      console.log(`Visible content after ${method.name}:`, visibleContent);
    }

    console.log('Step 8: Final analysis of page state');
    const finalState = await page.evaluate(() => {
      // Look for any elements that might be preventing scrolling or hiding content
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;

      // Check for fixed positioned elements that might be covering content
      const fixedElements = [];
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed') {
          fixedElements.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            zIndex: style.zIndex,
            top: style.top,
            left: style.left,
            width: style.width,
            height: style.height
          });
        }
      });

      return {
        bodyOverflow,
        htmlOverflow,
        fixedElements,
        finalScrollY: window.scrollY,
        documentHeight: document.documentElement.scrollHeight,
        aboutSectionExists: !!document.querySelector('#about'),
        aboutSectionVisible: document.querySelector('#about') ?
          document.querySelector('#about').getBoundingClientRect().top < window.innerHeight : false
      };
    });

    console.log('Final page state:', finalState);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/detailed_5_final_state.png', fullPage: true });

  } catch (error) {
    console.error('Error during testing:', error);
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/detailed_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

detailedScrollTest();