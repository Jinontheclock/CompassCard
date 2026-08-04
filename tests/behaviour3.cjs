/* The third layer: launch, frozen cards at the gate, the forgot flow,
   sailings opening, validation complaining, and the assistant's new topics. */
const { chromium } = require("playwright");
const { launchOptions, routeKit } = require("./env.cjs");
let fails = 0;
const is = (label, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(38)} ${ok ? got : `${got}  want ${want}`}`);
};

(async () => {
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 402, height: 874 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await routeKit(p);
  const go = async (s) => { await p.click(s); await p.waitForTimeout(430); };
  const txt = async (s) => (await p.textContent(s)).trim().replace(/\s+/g, " ");

  console.log("the launch");
  await p.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
  is("the splash is up", await p.locator(".splash").count(), 1);
  await p.waitForTimeout(1400);
  is("and lets go", await p.locator(".splash").count(), 0);

  console.log("a frozen card is turned away");
  await go(".landing-actions > *:nth-child(1)"); await go(".scr-footer .btn");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(5)"); await go(".lost-actions .btn"); await go(".nav-back");
  is("the hero says frozen", (await txt(".hero-frozen")).startsWith("Frozen"), "true");
  await go(".nav-back");
  is("the tile wears the chip", await txt(".card-stack > *:nth-child(1) .frozen-chip"), "FROZEN");
  await go(".card-stack > *:nth-child(1)"); await go(".linkish");
  await go(".section:nth-of-type(1) .panel--tap");
  is("the gate turns it away", await txt(".tap-title"), "Declined");
  is("and says why", await txt(".tap-amount"), "Card frozen");
  await go(".escape");
  await go(".nav-back"); await go(".tile-grid > *:nth-child(5)"); await go(".lost-actions .btn");
  is("unfreezing turns it back", await txt(".lost-actions .btn"), "Freeze Card");
  await go(".nav-back"); await go(".linkish"); await go(".section:nth-of-type(1) .panel--tap");
  is("the gate accepts again", await txt(".tap-title"), "Accepted");
  await go(".escape");

  console.log("the ledger runs deep");
  is("ten days of riding", await p.locator(".history-groups .section").count(), 10);
  await go(".section:nth-of-type(3) > *:nth-child(3)");   // Feb-21, the 2-Zone trip
  is("a trip opens onto its taps", (await txt(".section:nth-of-type(3) .history-taps")).includes("Lougheed Tn Ctr"), "true");
  is("a bus trip is one tap", await p.locator(".section:nth-of-type(9) .history-tap").count(), 1);

  console.log("a sailing opens onto its fare, and reserves");
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".sailing-card:nth-of-type(1)");
  is("the fare unfolds", await txt(".sailing-card:nth-of-type(1) .sailing-more"),
     "Adult walk-on · pays from stored value$19.10");
  await go(".sailing-reserve");                            // balance 15.00 < 19.10
  is("short balance is refused", (await txt(".sailing-warn")).startsWith("Not enough stored value"), "true");
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(1)");
  await go(".preset-row > *:nth-child(1)");                // +$10 -> 25.00
  await go(".scr-footer .btn");
  await p.click(".apay-pay"); await p.waitForTimeout(2400);
  await go(".done-footer .btn");
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".sailing-card:nth-of-type(1)");
  await go(".sailing-reserve");
  is("reserving marks the sailing", await txt(".sailing-card:nth-of-type(1) .status-ok"), "Reserved");
  is("and issues the ticket", (await txt(".ticket-card")).includes("Victoria (Swartz Bay)"), "true");
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  is("paid from stored value", await txt(".hero-figure"), "5.90");
  is("and written down", await txt(".history-row .history-label"), "BC Ferries · Walk-on");

  console.log("the forgot flow");
  await p.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1400);
  await go(".landing-actions > *:nth-child(1)");
  await p.fill(".field:nth-of-type(1) .field-input", "rider@mail.com");
  await go(".forgot .linkish");
  is("it opens", await txt(".scr-title"), "Forgot Password");
  is("holding the typed email", await p.inputValue(".field-input"), "rider@mail.com");
  await go(".scr-footer .btn");
  is("sending becomes the receipt", (await txt(".note-panel")).includes("rider@mail.com"), "true");
  is("and the button stays sent", await txt(".scr-footer .btn"), "Link Sent");

  console.log("sign up complains only about what is wrong");
  await go(".scr-footnote .linkish"); // back to login
  await go(".scr-footnote .linkish"); // to sign up
  await p.fill(".field:nth-of-type(1) .field-input", "not-an-email");
  await go(".scr-footer .btn");
  is("a bad email is named", await txt(".field-error"), "That doesn't look like an email address.");
  is("and the screen stays", await txt(".scr-title"), "Sign Up");
  await p.fill(".field:nth-of-type(1) .field-input", "");
  await go(".scr-footer .btn");
  is("empty still walks through", await txt(".scr-title"), "Register Your Card");

  console.log("the assistant's new topics");
  await go(".scr-footnote .linkish"); // continue without a card
  await go(".nav-account"); await go(".section:nth-of-type(3) .settings-row:nth-of-type(1)");
  const ask = async (q) => {
    await p.fill(".chat-input", q); await go(".chat-send"); await p.waitForTimeout(1100);
    const bubbles = p.locator(".chat-bubble--theirs");
    return (await bubbles.nth(await bubbles.count() - 1).textContent()).trim().replace(/\s+/g, " ");
  };
  is("typing dots hold the place", await (async () => {
    await p.fill(".chat-input", "concession fares?"); await p.click(".chat-send");
    await p.waitForTimeout(300); return p.locator(".chat-bubble--typing").count();
  })(), 1);
  await p.waitForTimeout(1200);
  is("concession is answered", (await txt(".chat-bubble--theirs >> nth=-1")).includes("$2.30"), "true");
  is("off-peak is answered", (await ask("is the weekend cheaper?")).includes("1-Zone $2.85"), "true");

  console.log("home scrolls once the cards outgrow it");
  await go(".nav-back"); await go(".nav-back");            // chat -> account -> empty home
  await go(".empty-actions > *:nth-child(1)");             // Purchase New Card
  await go(".scr-footer--fixed .btn");                     // free digital card
  for (let i = 0; i < 3; i++) { await go(".home-cards > .btn"); await go(".scr-footer--fixed .btn"); }
  is("four cards on the stack", await p.locator(".card-stack > *").count(), 4);
  const scroll = await p.evaluate(() => {
    const el = document.querySelector(".home-body");
    return el.scrollHeight - el.clientHeight;
  });
  is("the body holds more than it shows", scroll > 0, "true");
  await p.evaluate(() => { const el = document.querySelector(".home-body"); el.scrollTop = el.scrollHeight; });
  await p.waitForTimeout(200);
  is("the button rides below the cards", await p.locator(".home-cards > .btn").isVisible(), "true");
  await go(".home-cards > .btn");                          // reachable, not overlapped
  is("and still opens purchase", await txt(".scr-title"), "Purchase New Card");

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
