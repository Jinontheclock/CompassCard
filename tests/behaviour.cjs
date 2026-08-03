/* What the screens now do, rather than where they go. */
const { chromium } = require("playwright");
const { launchOptions, routeKit } = require("./env.cjs");
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NOW = new Date();
const MONTH_END = `${MON[NOW.getMonth()]} ${new Date(NOW.getFullYear(), NOW.getMonth() + 1, 0).getDate()}`;
let fails = 0;
const is = (label, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(34)} ${ok ? got : `${got}  want ${want}`}`);
};

(async () => {
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 402, height: 874 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await routeKit(p);
  const go = async (s) => { await p.click(s); await p.waitForTimeout(430); };
  const txt = async (s) => (await p.textContent(s)).trim().replace(/\s+/g, " ");
  await p.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await go(".landing-actions > *:nth-child(1)"); await go(".scr-footer .btn");
  await go(".card-stack > *:nth-child(1)");

  console.log("zone prices follow TransLink");
  await go(".tile-grid > *:nth-child(3)");
  is("2-Zone monthly (frame default)", await txt(".product-price"), "$156.70");
  await go(".zone-row > *:nth-child(1)");
  is("1-Zone monthly", await txt(".product-price"), "$117.20");
  is("button restates the zone", await txt(".scr-footer--fixed .btn"), "Purchase Monthly · 1-Zone");
  await go(".zone-row > *:nth-child(3)");
  is("3-Zone monthly", await txt(".product-price"), "$211.65");
  is("DayPass is flat", await txt(".passes-list > *:nth-child(2) .product-price"), "$12.55");
  is("DayPass has its own words", await txt(".passes-list > *:nth-child(2) .product-desc"),
     "Unlimited travel in all zones for one day");
  await go(".zone-row > *:nth-child(2)");
  await go(".scr-footer--fixed .btn");
  is("the pass lands on the card", await txt(".hero-pass-value"), `Monthly · 2-Zone · expires ${MONTH_END}`);

  console.log("autoload is set, not stated");
  await go(".tile-grid > *:nth-child(2)");
  is("threshold starts at", await txt(".menu-anchor:nth-child(1) .settings-value"), "$5.00");
  await go(".menu-anchor:nth-child(1) .settings-row");
  is("the row opens a menu", await p.locator(".menu-item").count(), 3);
  await go(".menu-item:nth-of-type(2)");
  is("picking sets the threshold", await txt(".menu-anchor:nth-child(1) .settings-value"), "$10.00");
  await go(".menu-anchor:nth-child(3) .settings-row");
  await go(".menu-item:nth-of-type(3)");
  is("and the amount", await txt(".menu-anchor:nth-child(3) .settings-value"), "$20.00");
  is("footnote before", await txt(".scr-footnote"), "Autoload is currently off.");
  await go(".scr-footer--tight .btn");
  is("footnote after", await txt(".scr-footnote"), "Autoload adds $20.00 below $10.00.");
  is("button turns around", await txt(".scr-footer--tight .btn"), "Turn off Autoload");
  await go(".nav-back");

  console.log("freeze does what it says");
  await go(".tile-grid > *:nth-child(5)");
  is("before", await txt(".lost-actions .btn"), "Freeze Card");
  await go(".lost-actions .btn");
  is("after", await txt(".lost-actions .btn"), "Unfreeze Card");
  is("the note says so", await txt(".lost-note"), "This card is frozen. It stops working at the gate right away.");
  await go(".nav-back");

  console.log("replacement fee follows the card");
  await go(".tile-grid > *:nth-child(6)");
  is("plain card", await txt(".settings-row:nth-of-type(3) .settings-value"), "$6.00");
  is("note still names the other", await txt(".replace-note"), "$25.00 applies to Program pass cards.");
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(4)"); await go(".scr-footer--connect .btn"); await go(".nav-back");
  await go(".tile-grid > *:nth-child(6)");
  is("program pass card", await txt(".settings-row:nth-of-type(3) .settings-value"), "$25.00");
  await go(".nav-back");

  console.log("reload actually credits");
  const before = await txt(".hero-figure");
  await go(".tile-grid > *:nth-child(1)");
  await go(".preset-row > *:nth-child(1)");
  await go(".scr-footer .btn"); await go(".done-footer .btn");
  is("balance", `${before} -> ${await txt(".hero-figure")}`, "15.00 -> 25.00");
  is("newest history line", await txt(".history-row .history-label"), "Reload");

  console.log("the assistant answers");
  await go(".nav-account");
  await go(".section:nth-of-type(3) .settings-row:nth-of-type(1)");
  const ask = async (q) => {
    await p.fill(".chat-input", q); await go(".chat-send");
    await p.waitForTimeout(1100); // the assistant types before it answers
    const bubbles = p.locator(".chat-bubble--theirs");
    return (await bubbles.nth(await bubbles.count() - 1).textContent()).trim().replace(/\s+/g, " ");
  };
  is("a fare question", (await ask("how much is a 3-zone trip?")).slice(0, 46), "A trip costs $2.85 in one zone,$4.20 in two an");
  is("a pass question", (await ask("what does a monthly pass cost")).includes("$117.20"), "true");
  is("u-pass", (await ask("is u-pass included?")).includes("$46.90"), "true");
  is("nothing it knows", (await ask("hello there")).startsWith("I can help with fares"), "true");
  await go(".chat-footer .btn");
  is("talk to a person", (await ask("ok")).length > 0, "true");

  console.log("wallet hands back to the app");
  await go(".nav-back"); await go(".nav-back");
  await go(".tile-grid > *:nth-child(8)");
  await go(".wallet-card");
  is("balance in Wallet", await txt(".wallet-balance-amount"), "CAD$25.00");
  await go(".wallet-pill");
  is("Add Money opens", await txt(".scr-title"), "Reload");
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(8)");
  is("wallet has a way out", await txt(".escape"), "Back to Compass");
  await go(".escape");
  is("and it works", await txt(".scr-title"), "My Compass Card");

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
