const { chromium } = require('playwright');

async function simpleTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE:', msg.text()));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  console.log('Taking screenshot before click...');
  await page.screenshot({ path: '/home/oneknight/projects/portfolio/before_click.png' });

  // Try clicking the debug button
  const button = await page.$('button:has-text("Click Me (Debug)")');
  if (button) {
    console.log('Found debug button, clicking...');
    await button.click();
    await page.waitForTimeout(3000);

    console.log('Taking screenshot after click...');
    await page.screenshot({ path: '/home/oneknight/projects/portfolio/after_click.png' });

    // Check for navigation
    const nav = await page.$('nav');
    console.log('Navigation element found:', !!nav);
  } else {
    console.log('Debug button not found');
  }

  await browser.close();
}

simpleTest();