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
  const pay = async () => { await p.click(".apay-pay"); await p.waitForTimeout(2400); };

  console.log("the launch");
  await p.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
  is("the splash is up", await p.locator(".splash").count(), 1);
  await p.waitForTimeout(1400);
  is("and lets go", await p.locator(".splash").count(), 0);

  console.log("a frozen card is turned away");
  await go(".landing-actions > *:nth-child(2)"); await go(".scr-footer .btn"); await go(".scr-footer .btn");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(5)"); await go(".lost-actions .btn"); await go(".nav-back");
  is("the hero says frozen", (await txt(".hero-frozen")).startsWith("Frozen"), "true");
  await go(".nav-back");
  is("the tile wears the chip", await txt(".card-stack > *:nth-child(1) .frozen-chip"), "FROZEN");
  await go(".card-stack > *:nth-child(1)"); await go(".linkish");
  await go(".section:nth-of-type(1) .history-head");
  await go(".section:nth-of-type(1) .history-gate");
  is("the gate turns it away", await txt(".tap-title"), "Declined");
  is("and says why", await txt(".tap-amount"), "Card frozen");
  await go(".escape");
  await go(".nav-back"); await go(".tile-grid > *:nth-child(5)"); await go(".lost-actions .btn");
  is("unfreezing turns it back", await txt(".lost-actions .btn"), "Freeze Card");
  await go(".nav-back"); await go(".linkish"); await go(".section:nth-of-type(1) .history-head");
  await go(".section:nth-of-type(1) .history-gate");
  is("the gate accepts again", await txt(".tap-title"), "Accepted");
  await go(".escape");

  console.log("the ledger runs deep");
  is("ten days of riding", await p.locator(".history-groups .section").count(), 10);
  await go(".section:nth-of-type(3) > *:nth-child(3)");   // Feb-21, the 2-Zone trip
  is("a trip opens onto its taps", (await txt(".section:nth-of-type(3) .history-taps")).includes("Lougheed Tn Ctr"), "true");
  is("a bus trip is one tap", await p.locator(".section:nth-of-type(9) .history-tap").count(), 1);

  console.log("the shelf starts empty, the reserve page books");
  await go(".tab-bar .tab:nth-of-type(2)");
  is("a fitting page does not scroll", await p.evaluate(() => {
    const el = document.querySelector(".scr-body"); return el.scrollHeight - el.clientHeight;
  }), 0);
  is("nothing is seeded onto the shelf", await p.locator(".ticket-card").count(), 0);
  is("only the empty card waits", await p.locator(".empty-card").count(), 1);
  await go(".tickets-actions .btn:nth-of-type(1)");        // Reserve Ferries
  is("the reserve page opens", await txt(".scr-title"), "Reserve Ferries");
  await go(".pick-group:nth-of-type(1) .pick-box--tap");   // Fare
  is("two fares to pick from", await p.locator(".menu-item").count(), 2);
  await go(".menu-item:nth-of-type(2)");                   // Child (5-11)
  is("the child fare follows", (await txt(".scr-footer--fixed .btn")).includes("$9.55"), "true");
  await go(".pick-group:nth-of-type(1) .pick-box--tap");
  await go(".menu-item:nth-of-type(1)");                   // Adult again
  await go(".pick-group:nth-of-type(2) .pick-box--tap");   // From
  is("five terminals to leave from", await p.locator(".menu-item").count(), 5);
  await go(".menu-item:nth-of-type(2)");                   // West Vancouver (Horseshoe Bay)
  is("the partner follows the route", await txt(".pick-group:nth-of-type(3) .pick-value"), "Nanaimo (Departure Bay)");
  is("and the schedule follows the run", await txt(".reserve-row .pick-group:nth-of-type(2) .pick-value"), "06:15 AM");
  await go(".pick-group:nth-of-type(2) .pick-box--tap");
  await go(".menu-item:nth-of-type(1)");                   // back to Tsawwassen
  await go(".reserve-row .pick-group:nth-of-type(1) .pick-box--tap"); // Date
  is("a calendar opens", await p.locator(".cal").count(), 1);
  await go(".cal-day--on");                                // today, re-picked
  is("and closes on the day", await p.locator(".cal").count(), 0);
  await go(".reserve-row .pick-group:nth-of-type(2) .pick-box--tap"); // Departure
  await go(".menu-item:nth-of-type(6)");                   // 06:00 PM — the board's sailing
  await go(".scr-footer--fixed .btn");                     // Next
  is("paying is its own step", await txt(".scr-title"), "Payment");
  is("three ways to pay", await p.locator(".section .settings-row").count(), 3);
  await go(".scr-footer--fixed .btn");                     // Compass Card, 15.00 < 19.10
  is("short balance is refused", (await txt(".reserve-warn")).startsWith("Not enough stored value"), "true");
  await go(".nav-back"); await go(".nav-back");
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(1)");
  await go(".preset-row > *:nth-child(1)");                // +$10 -> 25.00
  await go(".scr-footer .btn");
  await p.click(".apay-pay"); await p.waitForTimeout(2400);
  await go(".done-footer .btn");
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".tickets-actions .btn:nth-of-type(1)");
  await go(".reserve-row .pick-group:nth-of-type(2) .pick-box--tap");
  await go(".menu-item:nth-of-type(6)");                   // 06:00 PM
  await go(".scr-footer--fixed .btn");                     // Next
  await go(".scr-footer--fixed .btn");                     // Pay with Compass Card
  is("reserving files under BC Ferries", await txt(".section:nth-of-type(1) .section-label"),
     "RESERVED SAILINGS · BC FERRIES");
  is("and issues the ticket", (await txt(".ticket-card")).includes("Victoria (Swartz Bay)"), "true");
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  is("paid from stored value", await txt(".hero-figure"), "5.90");
  is("and written down", await txt(".history-row .history-label"), "BC Ferries · Walk-on");

  console.log("a ticket unfolds into its wallet pass");
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".ticket-card");
  is("the ferry pass unfolds", await p.locator(".wpass--ferry").count(), 1);
  is("terminal codes fly the route", (await txt(".wpass-route")).includes("TSA"), "true");
  is("with its eight-digit reference", /^\d{8}$/.test(await txt(".wpass-ref")), "true");
  is("and a code to scan", await p.locator(".wpass-qr").count(), 1);
  is("the crossing is BC Ferries' own", (await txt(".wpass")).includes("1 h 35 min"), "true");
  await go(".tikd-wallet");                                // hands over to Wallet
  is("the pass lands in Wallet", await p.locator(".wallet-pass").count(), 1);
  await go(".escape");                                     // Back to Compass
  await go(".ticket-card");                                // unfold again
  is("the button remembers", await txt(".tikd-wallet"), "Added to Apple Wallet");
  await go(".ticket-cancel");                              // the quiet way out
  is("cancelling asks first", await txt(".scr-title"), "Cancel Reservation");
  is("the page states the fare", (await txt(".scr-body")).includes("$19.10"), "true");
  is("and where it returns to", (await txt(".scr-body")).includes("Stored value"), "true");
  await go(".scr-footer--fixed .btn");                     // Confirm Refund
  is("confirming clears the shelf", await p.locator(".ticket-card").count(), 0);
  is("and the empty card returns", await p.locator(".empty-card").count(), 1);
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  is("the fare comes home", await txt(".hero-figure"), "25.00");
  is("as a refund line", await txt(".history-row .history-label"), "BC Ferries · Refund");

  console.log("an event sells its pass through the same till");
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".tickets-actions .btn:nth-of-type(2)");        // Purchase Tickets
  is("the shop opens", await txt(".scr-title"), "Purchase Tickets");
  await go(".sailing-card:nth-of-type(1) .sailing-head");
  is("the pass names its price", (await txt(".sailing-more")).includes("$12.55"), "true");
  await go(".event-buy");                                  // -> Payment
  is("events pay the same way", await txt(".scr-title"), "Payment");
  await go(".section .settings-row:nth-of-type(2)");       // Apple Pay
  await go(".scr-footer--fixed .btn");                     // Pay -> the sheet
  await pay();
  is("and the ticket lands", (await txt(".ticket-card")).includes("Whitecaps FC Match"), "true");
  await go(".ticket-card");
  is("the event wears a board skin", await p.locator(".wpass--event").count(), 1);
  is("its strip carries the artwork", await p.locator(".wpass-strip").count(), 1);
  is("and names the event", (await txt(".wpass--event")).includes("Whitecaps FC Match"), "true");
  is("paid the way it chose", (await txt(".ticket-paidline")).includes("Apple Pay"), "true");
  await go(".ticket-cancel");                              // the quiet way out
  is("refunding asks first", await txt(".scr-title"), "Refund Ticket");
  await go(".scr-footer--fixed .btn");                     // Confirm Refund
  is("confirming removes it", await p.locator(".ticket-card").count(), 0);

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

  console.log("logging in brings a life along");
  await p.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1400);
  await go(".landing-actions > *:nth-child(1)"); await go(".scr-footer .btn");
  is("the corner wears the portrait", await p.locator(".nav-avatar").count(), 1);
  await go(".tab-bar .tab:nth-of-type(2)");
  is("the shelf arrives stocked", await p.locator(".ticket-card").count(), 3);
  is("a crossing filed under BC Ferries", await txt(".section:nth-of-type(1) .section-label"),
     "RESERVED SAILINGS · BC FERRIES");
  is("with its return alongside", (await txt(".section:nth-of-type(1)")).includes("01:00 PM"), "true");
  is("and an event on the shelf", (await txt(".section--tickets")).includes("Whitecaps FC Match"), "true");
  await go(".nav-account");
  is("the account knows its rider", (await txt(".scr-body")).includes("Hajin Lee"), "true");
  is("their e-mail", (await txt(".scr-body")).includes("hajinlee.ca@gmail.com"), "true");
  is("and their phone", (await txt(".scr-body")).includes("(604) 555-0132"), "true");

  console.log("the flows join hands");
  await go(".nav-back");                                   // Account -> Tickets
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(2)");                 // Autoload
  await go(".panel--pop .settings-row:nth-of-type(1)");    // threshold menu
  await go(".menu-item:nth-of-type(2)");                   // below $10
  await go(".scr-footer .btn");                            // Turn on Autoload
  await go(".nav-back");
  await go(".tile-grid > *:nth-child(1)");                 // Reload +$10 -> 25.00
  await go(".preset-row > *:nth-child(1)");
  await go(".scr-footer .btn");
  await pay();
  await go(".done-footer .btn");
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".tickets-actions .btn:nth-of-type(1)");        // reserve the 6 PM again
  await go(".reserve-row .pick-group:nth-of-type(2) .pick-box--tap");
  await go(".menu-item:nth-of-type(6)");
  await go(".scr-footer--fixed .btn");
  await go(".scr-footer--fixed .btn");                     // stored value: 25 - 19.10 = 5.90 < 10
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  is("autoload catches the dip", await txt(".history-row .history-label"), "Autoload");
  is("and tops the card back up", await txt(".hero-figure"), "15.90");

  console.log("the month turns for the U-Pass");
  await go(".tile-grid > *:nth-child(4)");                 // U-Pass -> connect first
  await go(".scr-footer--connect .btn");
  await go(".upass-roll");                                 // Jump to next month
  is("the pass renews itself", (await txt(".upass-state")).includes("Renewed"), "true");
  await go(".nav-back");
  is("and the ledger says Included", (await txt(".history-row")).includes("Included"), "true");
  await go(".tile-grid > *:nth-child(4)");                 // straight to U-Pass now
  await go(".upass-stack .toggle");                        // auto-renew off
  await go(".upass-roll");
  is("without it the pass lapses", (await txt(".upass-state")).includes("Not renewed"), "true");
  await go(".nav-back");

  console.log("a frozen card hands itself to its successor");
  await go(".tile-grid > *:nth-child(5)");                 // Lost
  await go(".lost-actions .btn:nth-of-type(1)");           // Freeze
  await go(".lost-actions .btn:nth-of-type(2)");           // Move to replacement
  await go(".scr-footer--fixed .btn");                     // Order Replacement
  is("the order stays placed", await txt(".scr-footer--fixed .btn"), "Replacement Ordered");
  await go(".nav-back"); await go(".nav-back");            // Replace -> Lost -> the card
  is("the freeze lifts with the move", await p.locator(".hero-frozen").count(), 0);
  is("and the fee is written down", await txt(".history-row .history-label"), "Card replaced");

  console.log("the assistant opens the doors it names");
  await go(".nav-account");
  await go(".section:nth-of-type(3) .settings-row:nth-of-type(1)");
  await p.fill(".chat-input", "Can I reserve a ferry to Victoria?");
  await go(".chat-send");
  await p.waitForTimeout(1200);
  await go(".chat-action");
  is("the reserve page answers the door", await txt(".scr-title"), "Reserve Ferries");

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
