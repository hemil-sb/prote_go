// Re-exports the hero posters from the live scene (public/design-b/*.jpg). Run against the dev server:
//   npm i --no-save playwright@1.63   (once; browsers: npx playwright install chromium)
//   node scripts/capture-posters.mjs public/design-b
// The second argument is the story progress for the "shield" poster (default 0.77, inside "protect").
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on("console", (m) => m.type() === "error" && console.log("console:", m.text()));
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForFunction(() => getComputedStyle(document.querySelector("#story canvas")).opacity === "1", null, { timeout: 60000 });
await page.waitForTimeout(1500);
// hide everything over the canvas except the background gradient
await page.evaluate(() => {
  const stage = document.querySelector("#story canvas").parentElement;
  for (const el of stage.children) if (el.tagName !== "CANVAS") el.style.visibility = "hidden";
  document.querySelector("header").style.visibility = "hidden";
  const portal = document.querySelector("nextjs-portal"); if (portal) portal.style.display = "none";
});
const stage = page.locator("#story canvas").locator("..");
await stage.screenshot({ path: `${out}/opening-poster.jpg`, type: "jpeg", quality: 82 });
// scroll to the middle of "protect": stage top + p * (innerHeight * 6) on desktop
const p = Number(process.argv[3] ?? 0.77);
await page.evaluate((p) => { const s = document.querySelector("#story canvas").parentElement; window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY + p * window.innerHeight * 6); }, p);
await page.waitForTimeout(2500);
await stage.screenshot({ path: `${out}/shield-poster.jpg`, type: "jpeg", quality: 82 });
await browser.close();
console.log("done");
