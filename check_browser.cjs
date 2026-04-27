const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('BROWSER EXCEPTION:', error.message);
  });

  await page.goto('http://localhost:3003/');
  await new Promise(r => setTimeout(r, 2000));
  
  // Try to log in? If it redirects to /login we can see it
  console.log('URL:', page.url());
  
  await browser.close();
})();