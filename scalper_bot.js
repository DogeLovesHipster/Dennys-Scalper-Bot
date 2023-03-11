console.log("Starting bot...");

const { executablePath } = require("puppeteer");
const puppeteer = require("puppeteer-extra");

const product_url = "https://dinerdrip.com/products/the-everyday-value-tee";
// Practice Link
// https://dinerdrip.com/products/rope-hat
// https://dinerdrip.com/products/the-everyday-value-tee
const first_name = "John";
const last_name = "Doe";
const email = "JohnDoe01@gmail.com";
const phone = "9788392202";
const address = "1234 Main St";
const city = "San Francisco";
const state = "CA";
const zip = "00001";
const country = "United States";

// Card details [CURRENTLY FAKE]

const card_number = "4532010382261046";
const cardholder_name = "Clean Machine";
const card_expiration = "02/25";
const card_cvv = "160";

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Sleep Function (Zzzzzz)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createPage() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });
  const page = await browser.newPage();
  return page;
}

async function addToCart(page) {
  await page.goto(product_url); // Go to the product page
  await page.waitForSelector("button[name='add']");
  await page.click("button[name='add']", (btn) => btn.click());
  await sleep(1000);
  await page.waitForSelector("button[name='checkout']");
  await page.click("button[name='checkout']", (btn) => btn.click()); // Continue to shipping
}

async function shipping(page) {
  await page.setDefaultTimeout(0);
  await page.waitForSelector("input[name='email']");
  await page.type("input[name='email']", email);
  await page.type("input[name='firstName']", first_name);
  await page.type("input[name='lastName']", last_name);
  await page.click("input[name='address1']", (btn) => btn.click());
  await page.type("input[name='address1']", address);
  await page.type("input[name='city']", city);
  await page.type("input[name='postalCode']", zip);
  await page.click("button[type='submit']", (btn) => btn.click()); // Continue to shipping
}

async function methodShipping(page) {
  await sleep(2000);
  await page.click("button[type='submit']", (btn) => btn.click()); // Continue to payment
}

async function payment(page) {
  await sleep(2000);
  await page.setDefaultTimeout(0);
  await page.waitForSelector(
    "iframe[id='card-fields-number-uf9utw8hpp000000-scope-dinerdrip.com']"
  );
  const elementHandle = await page.$(
    "iframe[id='card-fields-number-uf9utw8hpp000000-scope-dinerdrip.com']"
  );
  const frame = await elementHandle.contentFrame();
  await frame.click("input[name='number']", (btn) => btn.click());
  await frame.type("input[name='number']", card_number, { delay: 100 });
}

async function checkout() {
  var page = await createPage();
  await addToCart(page);
  await shipping(page);
  await methodShipping(page);
  await payment(page);
}

checkout();
