const puppeteer = require("puppeteer");

function sleep(millisecondsCount) {
    return new Promise(resolve => setTimeout(resolve, millisecondsCount));
}

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 

    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    // await page.waitFor(checkDurationMsecs);
    await sleep(checkDurationMsecs);
  }  
};

async function captureScreenshot(url) {
  // Launch Puppeteer in headless mode
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to full HD for a full-sized screenshot
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to the URL
//   await page.goto(url, { waitUntil: "networkidle0" });
//   await page.goto(url, { waitUntil: "networkidle2" });
//   await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.goto(url, { timeout: 10000, waitUntil: "load" });
  await waitTillHTMLRendered(page);
  const data = await page.content();

  // Take screenshot and save as PNG, capturing the full page
    await page.screenshot({ path: './greengarment.jpg', type: 'jpeg', fullPage: true });

  await browser.close();
}

// Replace 'https://example.com' with the URL of the homepage you want to capture
captureScreenshot("https://greengarment.id/").catch(console.error);