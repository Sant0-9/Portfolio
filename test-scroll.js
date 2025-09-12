const puppeteer = require('puppeteer');

async function testScrolling() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader']
    });
    
    const page = await browser.newPage();
    
    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Scroll progress changed')) {
        console.log('BROWSER:', text);
      }
    });
    
    console.log('Loading page...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check page dimensions
    const pageInfo = await page.evaluate(() => {
      return {
        documentHeight: document.documentElement.scrollHeight,
        windowHeight: window.innerHeight,
        bodyHeight: document.body.scrollHeight,
        canScroll: document.documentElement.scrollHeight > window.innerHeight
      };
    });
    console.log('Page info:', pageInfo);
    
    // Check for scroll indicator
    console.log('Looking for scroll indicator...');
    const fixedScrollDiv = await page.$('.fixed.top-4.right-4');
    if (fixedScrollDiv) {
      const scrollText = await page.evaluate(el => el.textContent, fixedScrollDiv);
      console.log('Fixed scroll indicator found:', scrollText);
      
      // Test scrolling
      console.log('Testing scroll...');
      
      // Check initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);
      console.log('Initial scroll position:', initialScrollY);
      
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scrollYAfter = await page.evaluate(() => window.scrollY);
      console.log('Scroll position after 500px scroll:', scrollYAfter);
      
      const scrollTextAfter = await page.evaluate(el => el.textContent, fixedScrollDiv);
      console.log('Scroll indicator after 500px scroll:', scrollTextAfter);
      
      // More scrolling
      await page.evaluate(() => window.scrollBy(0, 1000));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scrollYFinal = await page.evaluate(() => window.scrollY);
      console.log('Final scroll position:', scrollYFinal);
      
      const scrollTextFinal = await page.evaluate(el => el.textContent, fixedScrollDiv);
      console.log('Scroll indicator after 1500px total scroll:', scrollTextFinal);
    } else {
      console.log('Scroll indicator not found');
    }
    
    console.log('Test complete');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testScrolling();