const puppeteer = require("puppeteer");
const fs = require("fs");

async function fetchSEOInformation(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const seoData = await page.evaluate(() => {
    const getTitle = () =>
      document.querySelector("title")
        ? document.querySelector("title").innerText
        : null;
    const getMetaDescription = () => {
      const element = document.querySelector('meta[name="description"]');
      return element ? element.getAttribute("content") : null;
    };
    const getMetaRobots = () => {
      const element = document.querySelector('meta[name="robots"]');
      return element ? element.getAttribute("content") : null;
    };
    const getFirstH1 = () => {
      const element = document.querySelector("h1");
      return element ? element.innerText : null;
    };

    return {
      title: getTitle(),
      metaDescription: getMetaDescription(),
      metaRobots: getMetaRobots(),
      firstH1: getFirstH1(),
    };
  });

//   console.log(seoData);

  fs.writeFile("seodata-ptprogress.txt", JSON.stringify(seoData, null, 2), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  await browser.close();
}

fetchSEOInformation("https://ptprogress.co.id/").catch(console.error);
