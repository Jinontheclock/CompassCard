/* The wrist's whole story: one balance, two faces, the gate and the till. */
const { chromium } = require("playwright");
const { launchOptions } = require("./env.cjs");
let fails = 0;
const is = (label, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(38)} ${ok ? got : `${got}  want ${want}`}`);
};

(async () => {
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 700, height: 860 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  const txt = async (s) => (await p.textContent(s)).trim().replace(/\s+/g, " ");

  console.log("the wallet face");
  await p.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(400);
  is("the card carries its balance", await txt(".w-balance"), "$15.00");
  is("express mode stands ready", await txt(".w-line"), "Express Mode");
  is("the title says where we are", await txt(".w-title"), "Wallet");

  console.log("the gate");
  await p.click(".w-card");
  await p.waitForTimeout(400);
  is("the reader asks for the wrist", (await txt(".w-overlay .w-line")), "Hold Near Reader");
  await p.waitForTimeout(1700);
  is("the fare comes off", await txt(".w-result"), "$2.85 Deducted");
  is("and says what is left", await txt(".w-sub"), "$12.15 Remaining");
  await p.click(".w-overlay--result");
  await p.waitForTimeout(400);
  is("the face carries the new balance", await txt(".w-balance"), "$12.15");

  console.log("the reload face");
  await p.click(".w-dot:nth-of-type(2)");
  await p.waitForTimeout(500);
  is("the title turns to Reload", await txt(".w-title"), "Reload");
  is("and reads the same balance", await txt(".w-balance-line"), "Balance $12.15");
  is("three presets wait", await p.locator(".w-preset").count(), 3);
  await p.click(".w-preset");
  await p.waitForTimeout(400);
  is("ten dollars land", await txt(".w-result"), "+$10.00 Added");
  is("and the balance says so", await txt(".w-sub"), "Balance $22.15");
  await p.click(".w-overlay--result");
  await p.waitForTimeout(400);
  is("the reload face agrees", await txt(".w-balance-line"), "Balance $22.15");
  await p.click(".w-dot:nth-of-type(1)");
  await p.waitForTimeout(500);
  is("and so does the wallet", await txt(".w-balance"), "$22.15");

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
