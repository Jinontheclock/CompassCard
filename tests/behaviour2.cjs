/* The interactive layer: what typing, picking and buying now actually do. */
const { chromium } = require("playwright");
const { launchOptions, routeKit } = require("./env.cjs");
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NOW = new Date();
const TODAY_SHORT = "Today";
const MONTH_END = `${MON[NOW.getMonth()]} ${new Date(NOW.getFullYear(), NOW.getMonth() + 1, 0).getDate()}`;
let fails = 0;
const is = (label, got, want) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(36)} ${ok ? got : `${got}  want ${want}`}`);
};

(async () => {
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 402, height: 874 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await routeKit(p);
  const go = async (s) => { await p.click(s); await p.waitForTimeout(430); };
  const txt = async (s) => (await p.textContent(s)).trim().replace(/\s+/g, " ");
  /* the Apple Pay sheet: press Pay, then wait out processing + done + the
     transition into whatever the payment leads to */
  const pay = async () => { await p.click(".apay-pay"); await p.waitForTimeout(2400); };

  console.log("a fresh account earns its cards");
  await p.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await go(".landing-actions > *:nth-child(2)");           // Sign Up
  await go(".scr-footer .btn");                            // Create Account
  await go(".scr-footnote .linkish");                      // continue without a card
  is("signup starts with none", await p.locator(".card-tile").count(), 0);
  await go(".empty-actions > *:nth-child(2)");             // register a plastic card
  await go(".scr-footer .btn");                            // Register Card
  is("registering imports the plastic", await p.locator(".card-stack > *").count(), 1);
  await go(".card-stack > *:nth-child(1)");
  is("with its balance", await txt(".hero-figure"), "15.00");
  is("and its history", await p.locator(".history-row").count() > 0, "true");
  await go(".tab-bar .tab:nth-of-type(1)");

  console.log("purchase describes the card it creates");
  await go(".home-cards > .btn");
  is("preview starts on the default", await txt(".card-tile-title"), "Second Card");
  await p.fill(".settings-input:not(.settings-input--amount)", "Work Card");
  is("the name lands on the preview", await txt(".card-tile-title"), "Work Card");
  await p.fill(".settings-input--amount", "20");
  is("the load lands on the figure", await txt(".card-tile-amount"), "$20.00");
  await go(".scr-footer--fixed .btn");                     // Purchase
  is("the load is what Apple Pay asks", await txt(".apay-total"), "$20.00");
  await pay();
  is("the card joins the list", await p.locator(".card-stack > *").count(), 2);
  is("named as typed", await txt(".card-stack > *:nth-child(2) .card-tile-title"), "Work Card");
  await go(".card-stack > *:nth-child(2)");
  is("holding what was loaded", await txt(".hero-figure"), "20.00");
  await go(".nav-back");

  console.log("the payment method is chosen once, read everywhere");
  await go(".nav-account");
  await go(".section:nth-of-type(2) .settings-row:nth-of-type(1)");
  await go(".settings-label--action");                     // Add payment method
  is("a method joins the list", await p.locator(".section:nth-of-type(1) .pay-method").count(), 2);
  await go(".section:nth-of-type(1) .settings-row:nth-of-type(2)"); // pick Credit Card
  is("auto payment restates it", await txt(".section:nth-of-type(2) .pay-method"), "Credit Card");
  await go(".nav-back"); await go(".nav-back");
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(1)");                 // Reload
  is("reload charges it", await txt(".value-row--tap .pay-method"), "Credit Card");
  await go(".scr-footer .btn"); await go(".done-footer .btn");
  is("the ledger names it", await txt(".history-row .history-sub"), `Credit Card · ${TODAY_SHORT}`);
  await go(".tile-grid > *:nth-child(7)");                 // Refund
  is("refund returns to it", await txt(".panel > div:nth-of-type(3) .settings-value"), "Credit Card");
  await go(".nav-back");

  console.log("the account rows hold what is saved");
  await go(".nav-account");
  await go(".section:nth-of-type(1) .settings-row:nth-of-type(1)"); // Name
  is("the editor opens on the row", await txt(".scr-title"), "Name");
  await p.fill(".field-input", "Hajin Lee");
  await go(".scr-footer .btn");                            // Save
  is("the value sits in the slot", await txt(".section:nth-of-type(1) .settings-row:nth-of-type(1) .settings-value"), "Hajin Lee");
  await go(".section:nth-of-type(1) .settings-row:nth-of-type(5)"); // Password
  is("a first password asks twice", await p.locator(".stack-fields .field").count(), 2);
  await p.fill(".stack-fields .field:nth-of-type(1) .field-input", "hunter2");
  await go(".scr-footer .btn");
  is("a lone password is refused", await txt(".field-error"), "The passwords don't match");
  await p.fill(".stack-fields .field:nth-of-type(2) .field-input", "hunter2");
  await go(".scr-footer .btn");
  is("a password shows as dots", await txt(".section:nth-of-type(1) .settings-row:nth-of-type(5) .settings-value"), "••••••••");
  await go(".section:nth-of-type(1) .settings-row:nth-of-type(5)"); // change it
  is("changing asks for the current one", await p.locator(".stack-fields .field").count(), 3);
  await p.fill(".stack-fields .field:nth-of-type(1) .field-input", "wrong");
  await p.fill(".stack-fields .field:nth-of-type(2) .field-input", "hunter3");
  await p.fill(".stack-fields .field:nth-of-type(3) .field-input", "hunter3");
  await go(".scr-footer .btn");
  is("a wrong proof is refused", await txt(".field-error"), "That isn't your current password");
  await p.fill(".stack-fields .field:nth-of-type(1) .field-input", "hunter2");
  await go(".scr-footer .btn");
  is("the right one is accepted", await txt(".scr-title"), "Account");
  const toggled = p.locator(".settings-row--still .toggle");
  is("notifications start on", await toggled.getAttribute("aria-checked"), "true");
  await go(".settings-row--still .toggle");
  is("and switch off where they lie", await toggled.getAttribute("aria-checked"), "false");
  await go(".section:nth-of-type(3) .settings-row:nth-of-type(2)"); // Contact info
  is("contact info opens", await txt(".scr-title"), "Contact Info");
  is("with the Compass line", await txt(".settings-row:nth-of-type(1) .settings-value"), "604.398.2042");
  await go(".nav-back"); await go(".nav-back");

  console.log("the connect screen picks a real school");
  // the two backs from Contact land on the card detail we came from
  await go(".tile-grid > *:nth-child(4)");                 // U-Pass -> connect
  is("starts at the seed's school", await txt(".pick-value"), "British Columbia Institute of Technology");
  await go(".pick-box--tap");
  is("the box opens the school list", await p.locator(".menu-item").count(), 7);
  await go(".menu-item:nth-of-type(2)");
  is("picking writes it in", await txt(".pick-value"), "University of British Columbia");
  await go(".scr-footer--connect .btn");                   // Connect
  is("the card writes it short", await txt(".card-tile-passname"), "UBC");
  await go(".nav-back");
  is("the pass slot shows the U-Pass", await txt(".hero-pass-value"), `U-Pass BC · expires ${MONTH_END}`);

  console.log("ordering a replacement is done once");
  await go(".tile-grid > *:nth-child(6)");
  is("the row carries the pass and balance", await txt(".settings-row--value:nth-of-type(2) .settings-value"), "$35.00 · U-Pass BC");
  await go(".scr-footer--fixed .btn");                     // Order
  is("the button stays pressed", await txt(".scr-footer--fixed .btn"), "Replacement Ordered");
  is("and is inert", await p.locator(".scr-footer--fixed .btn").isDisabled(), "true");
  is("the warning became the fact", (await txt(".note-panel")).startsWith("Replacement ordered"), "true");
  await go(".nav-back");

  console.log("a refund closes the card");
  await go(".tile-grid > *:nth-child(7)");
  await go(".scr-footer--fixed .btn");                     // Request Refund
  is("the card is gone", await p.locator(".card-stack > *").count(), 1);
  is("home is what is left", await txt(".card-stack > *:nth-child(1) .card-tile-title"), "Work Card");

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
