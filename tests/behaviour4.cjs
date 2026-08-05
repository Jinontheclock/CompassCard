/* The fourth layer: the paths an audit found the first three walking past —
   giving the last card back, paying a child's fare, and asking the assistant
   something it used to answer for a different question. */
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
  const login = async () => {
    await p.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(1400);
    await go(".landing-actions > *:nth-child(1)");
    await go(".scr-footer .btn");
  };

  /* The seeded account holds exactly one card, so refunding it empties the
     list — and the screen being left behind is a screen about that card. */
  console.log("the last card can be given back");
  await login();
  is("one card to start", await p.locator(".card-stack > *").count(), 1);
  await go(".card-stack > *:nth-child(1)");
  await go(".tile-grid > *:nth-child(7)");                 // Refund
  is("the refund page states the card", await txt(".scr-title"), "Refund");
  await go(".scr-footer--fixed .btn");                     // Request Refund
  await p.waitForTimeout(600);
  is("the app is still standing", await p.locator(".scr").count(), 1);
  is("and shows the empty card list", await txt(".empty-title"), "No card yet");
  is("nothing threw", errs.length, 0);

  /* And with a card left over, the screen sliding away must still be the
     card it was about — not whichever card the list falls back to. */
  console.log("a card given back while another is held");
  await login();
  await go(".home-cards > .btn");                          // Purchase New Card
  await go(".scr-footer--fixed .btn");
  await go(".card-stack > *:nth-child(2)");                // the new one
  await go(".tile-grid > *:nth-child(7)");                 // Refund
  const leaving = p.locator(".stage--out-push .scr-title, .stage--out-pop .scr-title, .stage--out-fade .scr-title");
  await p.click(".scr-footer--fixed .btn");                // Request Refund
  await p.waitForTimeout(120);
  is("the leaving screen is still drawn", await leaving.count(), 1);
  is("and is still the refund it was", (await leaving.textContent()).trim(), "Refund");
  await p.waitForTimeout(600);
  is("one card remains", await p.locator(".card-stack > *").count(), 1);
  is("nothing threw on the way", errs.length, 0);

  /* The fare picker is the first control on Reserve Ferries, and the figure
     it settles on has to survive all the way to the pass. */
  console.log("a child's fare stays a child's fare");
  await login();
  await go(".tab-bar .tab:nth-of-type(2)");
  await go(".tickets-actions .btn:nth-of-type(1)");
  await go(".pick-group:nth-of-type(1) .pick-box--tap");   // Fare
  await go(".menu-item:nth-of-type(2)");                   // Child (5–11)
  is("the button carries the child fare", await txt(".scr-footer--fixed .btn"), "Next · $9.55");
  await go(".scr-footer--fixed .btn");                     // Next
  is("and so does the checkout", (await txt(".scr-body")).includes("Child (5–11) walk-on$9.55"), "true");
  await go(".scr-footer--fixed .btn");                     // pay from stored value
  await p.waitForTimeout(400);
  const child = p.locator(".ticket-card", { hasText: "$9.55" });
  is("the ticket is issued at that fare", await child.count(), 1);
  await child.click(); await p.waitForTimeout(500);
  is("and the pass prints Child", (await txt(".sailing-card--open .wpass--ferry")).includes("Child"), "true");
  await go(".tab-bar .tab:nth-of-type(1)");
  await go(".card-stack > *:nth-child(1)");
  is("the card was charged the child fare", await txt(".hero-figure"), "5.45");

  /* Every question that two topics both have a word for. The table is read
     straight from the assistant rather than through the screen, because what
     breaks here is the routing, not the rendering. */
  console.log("the assistant sends each question to one place");
  const { reply } = await import("../src/data/assistant.js");
  const ROUTES = [
    ["cancel my compass card", "refund"],
    ["how do I cancel my card", "refund"],
    ["how do I cancel", "refund"],
    ["I want my money back", "refund"],
    ["Cancel my ferry booking", "tickets"],
    ["refund my ticket", "tickets"],
    ["cancel the ferry, I cant make the sailing", "tickets"],
    ["I bought the wrong ferry ticket, can I get a refund?", "tickets"],
    ["How do I set up Autoload?", "autoload"],
    ["Can I reload my card?", "reload"],
    ["whitecaps tickets", "buytickets"],
    ["how much is a monthly pass", "passes"],
    ["where is my wallet pass", "wallet"],
    ["u-pass", "upass"],
  ];
  const misrouted = ROUTES.filter(([q, to]) => (reply(q).action?.to ?? "(none)") !== to);
  is("no question lands on another's screen", misrouted.map(([q]) => q).join(", ") || "none", "none");

  /* Three questions the assistant used to answer for something else. */
  console.log("the assistant answers what was asked");
  await login();
  await go(".nav-account");
  await go(".section:nth-of-type(3) .settings-row:nth-of-type(1)");
  const ask = async (text) => {
    await p.fill(".chat-input", text);
    await go(".chat-send");
    await p.waitForTimeout(1100);
    return txt(".chat-bubble--theirs:last-of-type");
  };
  is("autoload is its own answer", (await ask("How do I set up Autoload?")).includes("tops the card up"), "true");
  is("cancelling a sailing is a ticket", (await ask("Cancel my ferry booking")).includes("Tickets tab"), "true");
  is("closing a card is still a refund", (await ask("I want a refund for this card")).includes("closes the card"), "true");

  /* Two questions inside one beat: both must be answered, and no dots may
     be left spinning. */
  console.log("the assistant keeps up with a fast typist");
  await p.fill(".chat-input", "What does a trip cost?");
  await p.click(".chat-send");
  await p.waitForTimeout(200);
  await p.fill(".chat-input", "And a monthly pass?");
  await p.click(".chat-send");
  await p.waitForTimeout(1800);
  is("no dots left spinning", await p.locator(".chat-bubble--typing").count(), 0);
  is("both questions were answered", await p.locator(".chat-bubble--theirs").count(), 5);

  /* The tile routes an unconnected U-Pass to the connect screen; the
     assistant has to route it the same way. */
  console.log("the assistant opens the same door the tile does");
  await login();
  await go(".nav-account");
  await go(".section:nth-of-type(3) .settings-row:nth-of-type(1)");
  await p.fill(".chat-input", "Tell me about U-Pass");
  await go(".chat-send");
  await p.waitForTimeout(1100);
  await go(".chat-action");
  is("an unconnected pass asks to connect", await txt(".scr-title"), "Connect U-Pass BC");

  console.log(`\npage errors: ${errs.length ? errs.join(" | ") : "none"}`);
  await b.close();
  process.exit(fails || errs.length ? 1 : 0);
})();
