/* The fifth layer: what an audit found the app saying about itself that was
   not true — a ledger whose lines did not add up to its own balance, a gate
   screen that read one figure whichever trip it was opened from, a back
   control that named the wrong screen, and two controls that were never
   the same twice. Each of these is a claim that has to keep being checked,
   because each of them drifted quietly the first time. */
const { chromium } = require("playwright");
const { launchOptions, routeKit } = require("./env.cjs");
let fails = 0;
const is = (label, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(44)} ${ok ? got : `${got}  want ${want}`}`);
};

(async () => {
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 402, height: 874 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await routeKit(p);
  const go = async (s) => { await p.click(s); await p.waitForTimeout(430); };
  const txt = async (s) => (await p.textContent(s)).trim().replace(/\s+/g, " ");
  const label = () => txt("button.nav-back");
  /* a header toggles, so opening one already open would close it */
  const openRow = async (s) => {
    if ((await p.getAttribute(s, "aria-expanded")) !== "true") await go(s);
  };
  const load = async (query = "") => {
    await p.goto("http://localhost:4173/" + query, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(1400);
    await go(".landing-actions > *:nth-child(1)");           // Log In
    await go(".scr-footer .btn");
  };

  /* The ledger is the truth about the money, so it has to add up — read
     from the seed itself rather than through the screen, because what would
     break here is arithmetic and not rendering. */
  console.log("the ledger adds up to the card");
  const { seedState } = await import("../src/data/seed.js");
  const card = seedState().cards[0];
  let running = null;
  const oldestFirst = [...card.history].reverse();
  const broken = oldestFirst.filter((entry) => {
    if (entry.balanceAfter == null) return false;
    const wrong = running != null && Math.abs(entry.balanceAfter - running - entry.amount) > 0.001;
    running = entry.balanceAfter;
    return wrong;
  });
  is("every line follows the one before it", broken.length, 0);
  is("and the newest is the card's balance", oldestFirst[oldestFirst.length - 1].balanceAfter, card.balance);
  is("the card never goes overdrawn",
     Math.min(...oldestFirst.filter((e) => e.balanceAfter != null).map((e) => e.balanceAfter)) >= 0, "true");
  is("nothing is a pass purchase in disguise",
     card.history.filter((e) => e.movesBalance === false && e.balanceAfter != null).length, 0);

  /* The gate screen belongs to the trip it was opened from, not to a
     constant — the two gates the seed carries must disagree. */
  console.log("each gate screen reads its own trip");
  await load();
  await go(".card-stack > *:nth-child(1)");
  await go(".section-label--split .linkish");
  await openRow(".section:nth-of-type(1) .history-head");
  await go(".section:nth-of-type(1) .history-gate");
  const bus = await txt(".tap-amount");
  await go(".escape");
  await openRow(".section:nth-of-type(2) .history-head");
  await go(".section:nth-of-type(2) .history-gate");
  const ferry = await txt(".tap-amount");
  await go(".escape");
  is("the 1-Zone gate", bus, "$2.85 Deducted · $12.15 Remaining");
  is("the ferry gate says as much", ferry, "$19.10 Deducted · $5.00 Remaining");
  is("neither takes the fare's minus sign", /-\$/.test(bus + ferry), "false");

  /* A reload pushes this morning's trip down its group. Nothing about the
     trip changed, so nothing about its row may. */
  console.log("position decides nothing about a row");
  is("two gate doors", await p.locator("button.history-gate").count(), 2);
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(1)");                   // Reload
  await go(".preset-row > *:nth-child(2)");                  // $20
  await go(".scr-footer .btn");
  await p.click(".apay-pay"); await p.waitForTimeout(2400);
  await go(".done-footer .btn");
  is("the reload lands on the card", await txt(".hero-figure"), "32.15");
  await go(".section-label--split .linkish");
  is("still two gate doors", await p.locator("button.history-gate").count(), 2);
  await openRow(".section:nth-of-type(1) > *:nth-child(3) .history-head");
  const fold = await txt(".section:nth-of-type(1) > *:nth-child(3) .history-taps");
  is("the pushed-down trip keeps its door", fold.includes("View gate screen"), "true");
  is("and what it was left holding", /Balance\s*\$12\.15/.test(fold), "true");
  is("no row that opens nothing is a button", await p.locator("button.history-card--still").count(), 0);

  /* A back control names where it goes. Replace Card is the one reached two
     ways, which is what made a hardcoded label wrong. */
  console.log("a back control names where it goes");
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(5)");                   // Lost Card
  await go(".lost-actions .btn:nth-of-type(2)");             // Move Balance to New Card
  is("Replace, entered from Lost Card", await label(), "Lost Card");
  await go(".nav-back");
  is("and that is where it goes", await txt(".scr-title"), "Lost Card");
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(6)");                   // the Replace tile
  is("Replace, entered from the card", await label(), "My Compass Card");
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(1)");                   // Reload
  await go(".value-row--tap");                               // Payment Method
  is("Payment Method, entered from Reload", await label(), "Reload");
  await go(".nav-back"); await go(".nav-back");
  await go(".nav-header .nav-account");
  await go(".section:nth-of-type(2) .settings-row:nth-of-type(1)");
  is("Payment Method, entered from Account", await label(), "Account");

  /* Nothing connects a school account on an empty field. */
  console.log("the U-Pass asks for a student number");
  await go(".nav-back"); await go(".nav-back");
  await go(".tile-grid > *:nth-child(4)");
  const connect = p.locator(".scr-footer--connect .btn");
  is("Connect is off on arrival", await connect.isDisabled(), "true");
  is("and the field says what for", await txt(".pick-hint"), "Enter your student number to connect.");
  await p.fill(".pick-input", "   ");
  await p.waitForTimeout(120);
  is("blanks are not a number", await connect.isDisabled(), "true");
  await p.fill(".pick-input", "A1");
  await p.waitForTimeout(120);
  is("anything typed is — no format is invented", await connect.isDisabled(), "false");
  await p.fill(".pick-input", "");
  await p.waitForTimeout(120);
  is("and clearing it turns Connect off again", await connect.isDisabled(), "true");

  /* What a capture shows must be what the next capture shows. */
  console.log("a capture taken twice is the same capture");
  await p.fill(".pick-input", "A01234567");
  await go(".scr-footer--connect .btn");
  is("no demo control without the flag", await p.locator("button.upass-roll").count(), 0);
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(6)");                   // Replace card
  await go(".scr-footer--fixed .btn");                       // Order
  await go(".nav-back");
  is("the successor's last four are fixed", await txt(".hero-twin"), "Plastic ···· 0142 · one balance");

  await load("?demo=1");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(4)");
  await p.fill(".pick-input", "A01234567");
  await go(".scr-footer--connect .btn");
  is("and the flag brings the demo control back", await p.locator("button.upass-roll").count(), 1);

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
