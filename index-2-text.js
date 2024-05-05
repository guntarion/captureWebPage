const puppeteer = require("puppeteer");
const fs = require("fs");

async function extractText(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Extract text from the body of the webpage
  const text = await page.evaluate(() => document.body.innerText);

  console.log(text); // Output the text content to the console
  fs.writeFile("webcontent-ptprogress.txt", text, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  await browser.close();
}

// Replace 'https://example.com' with the URL from which you want to extract text
extractText("https://ptprogress.co.id/").catch(console.error);
