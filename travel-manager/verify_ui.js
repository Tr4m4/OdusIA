const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Starting Chrome...");
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,1000'],
        defaultViewport: { width: 1400, height: 1000 }
    });
    const page = await browser.newPage();
    
    // Clear localStorage to avoid old broken messages
    await page.goto('http://localhost:8765');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await wait(1000);
    console.log("App ready. Opening chatbot...");
    
    await page.click('#chatbot-trigger');
    await wait(1000);
    
    // Maximize chat
    const expandBtn = await page.$('#chatbot-expand');
    if (expandBtn) await expandBtn.click();
    await wait(500);
    
    console.log("Typing query...");
    await page.type('#chatbot-input', 'Hotel lusso Riviera Ligure con SPA e accesso diretto al mare');
    await page.click('#chatbot-send');
    
    console.log("Waiting for AI response...");
    await page.waitForSelector('.curator-report', { timeout: 60000 });
    await wait(2000);
    
    // Dump report HTML
    const reportHtml = await page.evaluate(() => document.querySelector('.curator-report').outerHTML);
    fs.writeFileSync('report_dump.html', reportHtml);
    console.log("HTML dump saved to report_dump.html");
    
    // Check for raw tags
    if (reportHtml.includes('&lt;div') || reportHtml.includes('&lt;p')) {
        console.error("FAILED - Found escaped HTML tags.");
    } else {
        console.log("PASS - No escaped HTML tags found.");
    }
    
    // Check table
    const hasTable = await page.evaluate(() => !!document.querySelector('.curator-report table'));
    console.log(hasTable ? "PASS - Table found in report." : "FAIL - No table found in report!");
   
    // Check buttons
    const buttons = await page.evaluate(() => document.querySelectorAll('.curator-report button').length);
    console.log(`${buttons > 0 ? 'PASS' : 'FAIL'} - Found ${buttons} action buttons in the report.`);
    
    // Scroll to bottom of chat messages
    await page.evaluate(() => {
        const msgs = document.getElementById('chatbot-messages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
    });
    await wait(500);
    
    // Full page screenshot
    await page.screenshot({ path: 'final_verification_fullpage.png', fullPage: false });
    console.log("Screenshot saved!");
    
    await browser.close();
})();
