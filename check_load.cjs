const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  console.log('Navigating to http://localhost:3003...');
  const startTime = Date.now();
  
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle2', timeout: 60000 });
  const loadTime = Date.now() - startTime;
  
  console.log(`Page loaded in ${loadTime}ms`);
  
  // Get performance timings
  const perfData = await page.evaluate(() => {
    return JSON.stringify(window.performance.timing);
  });
  console.log('Performance:', perfData);
  
  // Check what's visible
  const content = await page.evaluate(() => {
    return {
      title: document.title,
      bodyText: document.body.innerText.substring(0, 500)
    };
  });
  console.log('Content:', content);
  
  await browser.close();
})();
