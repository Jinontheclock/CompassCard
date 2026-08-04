const { chromium } = require("playwright");
const { launchOptions, routeKit } = require("./env.cjs");

(async () => {
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 402, height: 874 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).split("\n")[0]));
  await routeKit(p);

  const go = async (sel) => { await p.click(sel); await p.waitForTimeout(430); };
  const where = async () => {
    const t = await p.evaluate(() => {
      const el = document.querySelector(".scr-title, .home-title, .tap-title, .wallet-name, .landing-title, .done-title, .wallet-open-label");
      const cls = document.querySelector(".screen > *")?.className || "";
      return (el ? el.textContent.trim() : "?") + "  [" + cls + "]";
    });
    return t;
  };
  const step = async (label, sel) => { await go(sel); console.log(String(label).padEnd(30), await where()); };

  await p.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  console.log("start".padEnd(30), await where());

  // onboarding: sign up -> card register -> skip -> empty home
  await step("Sign Up", ".landing-actions > *:nth-child(2)");
  await step("  Next", ".scr-footer .btn");
  await step("  carry on without", ".scr-footnote .linkish");
  await step("  register a plastic card", ".empty-actions > *:nth-child(2)");
  await step("  Register Card", ".scr-footer .btn");

  // card detail and every tile
  await step("card 1", ".card-stack > *:nth-child(1)");
  const tiles = ["Reload","Autoload","Purchase passes","U-Pass","Lost card","Replace card","Refund","Apple Wallet"];
  for (let i = 1; i <= 8; i++) {
    await step("  tile " + i + " " + tiles[i-1], `.tile-grid > *:nth-child(${i})`);
    if (i === 1) { await step("    payment row", ".value-row--tap"); await step("    back", ".nav-back"); }
    if (i === 4) { await step("    Connect", ".scr-footer--connect .btn"); }
    if (i === 8) { await step("    open card", ".wallet-card"); await step("    Open the Compass App", ".wallet-panel--open"); continue; }
    await step("    back", ".nav-back");
  }

  // history + the two tap shots
  await step("See all", ".linkish");
  await step("  1-Zone trip -> tap", ".section:nth-of-type(1) .panel--tap");
  await step("  dismiss", ".escape");
  await step("  BC Ferries -> ferry", ".section:nth-of-type(2) .panel--tap");
  await step("  dismiss", ".escape");
  await step("  open 3-Zone", ".section:nth-of-type(2) > *:nth-child(3)");
  await step("  back", ".nav-back");

  // reload flow through to done
  await step("Reload", ".tile-grid > *:nth-child(1)");
  await step("  preset 3", ".preset-row > *:nth-child(3)");
  await step("  Reload", ".scr-footer .btn");
  await step("  Apple Pay", ".apay-pay");
  await p.waitForTimeout(2100); // the sheet pays, then hands over to Done
  await step("  Done", ".done-footer .btn");

  // tabs, account, help
  await step("Tickets tab", ".tab-bar .tab:nth-of-type(2)");
  await step("Cards tab", ".tab-bar .tab:nth-of-type(1)");
  await step("Account", ".nav-account");
  await step("  Chat with us", ".section:nth-of-type(3) .settings-row:nth-of-type(1)");
  // the chat opens empty now, so the action row must come from the reply —
  // the history topic answers with one
  await p.fill(".chat-input", "Where can I see my trip history?");
  await go(".chat-send");
  console.log("  sent a message".padEnd(30), "bubbles:", await p.locator(".chat-bubble").count());
  await step("  assistant row -> History", ".chat-action");
  await step("  back", ".nav-back");

  // purchase a new card
  await step("  back to Account", ".nav-back");
  await step("  back to Cards", ".nav-back");
  await step("Purchase New Card", ".home-cards > .btn");
  await step("  Purchase", ".scr-footer--fixed .btn");

  console.log("\npage errors:", errs.length ? errs : "none");
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
