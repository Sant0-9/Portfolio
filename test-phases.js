const puppeteer = require('puppeteer');

async function testPhases() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get document height for calculating scroll positions
    const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const windowHeight = await page.evaluate(() => window.innerHeight);
    const maxScroll = documentHeight - windowHeight;
    
    console.log(`Document height: ${documentHeight}px, Window height: ${windowHeight}px, Max scroll: ${maxScroll}px`);
    
    // Test different scroll phases
    const testPositions = [
      { percent: 0, expected: 'Phase 1' },
      { percent: 15, expected: 'Phase 1' },
      { percent: 30, expected: 'Phase 1->2 transition' },
      { percent: 45, expected: 'Phase 2' },
      { percent: 60, expected: 'Phase 2' },
      { percent: 70, expected: 'Phase 2->3 transition' },
      { percent: 85, expected: 'Phase 3' },
      { percent: 100, expected: 'Phase 3' },
    ];
    
    for (const test of testPositions) {
      const scrollY = Math.floor((test.percent / 100) * maxScroll);
      
      await page.evaluate((scroll) => {
        window.scrollTo(0, scroll);
      }, scrollY);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const scrollIndicator = await page.$eval('.fixed.top-4.right-4', el => el.textContent);
      console.log(`${test.percent}% scroll (${scrollY}px): ${scrollIndicator} - Expected: ${test.expected}`);
    }
    
    console.log('Phase testing complete!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testPhases();