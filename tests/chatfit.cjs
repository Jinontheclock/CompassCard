/* Every assistant line is set nowrap in a 330 bubble whose content box is
   300. A line that overruns would spill out of the bubble silently, so it is
   measured here rather than trusted. */
const { chromium } = require("playwright");
const fs = require("fs");
const { launchOptions, routeKit } = require("./env.cjs");
const LIMIT = 300;
/* the one line Figma itself overhangs its 300 box with, kept as drawn */
const FRAME_LINE = "That was a 2-Zone trip — the adult 2-Zone";

(async () => {
  const src = fs.readFileSync(__dirname + "/../src/data/assistant.js", "utf8");
  const b = await chromium.launch(launchOptions);
  const p = await b.newPage({ viewport: { width: 402, height: 874 } });
  await routeKit(p);
  await p.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);

  /* read the authored strings and resolve ${money(...)} the way seed does */
  const F = { 1: 2.85, 2: 4.20, 3: 5.40 }, M = { 1: 117.20, 2: 156.70, 3: 211.65 };
  const money = (n) => (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2);
  const vals = {
    "money(FARES.storedValue[1])": money(F[1]), "money(FARES.storedValue[2])": money(F[2]), "money(FARES.storedValue[3])": money(F[3]),
    "money(FARES.monthly[1])": money(M[1]), "money(FARES.monthly[2])": money(M[2]), "money(FARES.monthly[3])": money(M[3]),
    "money(FARES.dayPass)": money(12.55), "money(FARES.upassMonthly)": money(46.9),
    "money(FARES.cardFee)": money(6), "money(FARES.programCardFee)": money(25),
    "money(FARES.ferryWalkOn)": money(19.1),
    "money(FARES.reloadPresets[0])": money(10), "money(FARES.reloadPresets[1])": money(20), "money(FARES.reloadPresets[2])": money(50),
  };
  const resolve = (s) => s.replace(/\$\{([^}]+)\}/g, (_, e) => vals[e.trim()] ?? "??");

  const raw = [...src.matchAll(/lines:\s*\[([\s\S]*?)\]/g)].flatMap((m) =>
    [...m[1].matchAll(/[`"']((?:[^`"'\\]|\\.)*)[`"']/g)].map((q) => resolve(q[1])));
  // the bot's answers only — the one user line the seed carries is short
  const measured = await p.evaluate((items) => {
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:400 17px/24px 'ff-meta-web-pro'";
    document.body.appendChild(probe);
    return items.map((t) => { probe.textContent = t; return [t, +probe.getBoundingClientRect().width.toFixed(1)]; });
  }, raw);

  let bad = 0;
  for (const [text, w] of measured) {
    const over = w > LIMIT && text !== FRAME_LINE;
    if (over) bad++;
    if (over) console.log(`  OVER ${String(w).padStart(6)}  ${JSON.stringify(text)}`);
  }
  console.log(`${measured.length} lines checked, widest ${Math.max(...measured.map((m) => m[1]))}, limit ${LIMIT}`);
  console.log(bad ? `${bad} OVERRUN` : "every assistant line fits the bubble");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
