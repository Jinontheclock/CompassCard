/* Measure the rendered screen against the Figma frame coordinates.
   usage: node measure.js <spec.json> [--shot out.png] */
const { chromium } = require("playwright");
const fs = require("fs");

const { launchOptions, routeKit } = require("./env.cjs");
const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const shotArg = process.argv.indexOf("--shot");
const shot = shotArg > -1 ? process.argv[shotArg + 1] : null;

(async () => {
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
  });
  /* the fonts come from tests/kit when a mirror is there, else the live kit */
  await routeKit(page);

  await page.goto(spec.url || "http://localhost:4173/", { waitUntil: "networkidle" });
  for (const step of spec.steps || []) {
    /* a "wait:ms" step stands for time rather than a tap — the Apple Pay
       sheet takes ~1.8s to pay before the next screen arrives */
    if (step.startsWith("wait:")) { await page.waitForTimeout(+step.slice(5)); continue; }
    /* a "fill:selector|text" step types into a field rather than tapping */
    if (step.startsWith("fill:")) {
      const [sel, text] = step.slice(5).split("|");
      await page.fill(sel, text ?? "");
      continue;
    }
    await page.click(step);
    await page.waitForTimeout(430);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const fontReport = await page.evaluate(() => {
    const loaded = [...document.fonts].filter((f) => f.status === "loaded")
      .map((f) => `${f.family} ${f.weight} ${f.style}`);
    const probe = (w, s) => document.fonts.check(`${w} ${s}px ff-meta-web-pro`);
    return {
      loaded: [...new Set(loaded)].sort(),
      check: { w400: probe(400, 17), w500: probe(500, 20), w700: probe(700, 34) },
    };
  });

  const measured = await page.evaluate((sel) => {
    const out = {};
    for (const [name, s] of Object.entries(sel)) {
      const el = document.querySelector(s);
      if (!el) { out[name] = null; continue; }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const rec = {
        x: +r.x.toFixed(2), y: +r.y.toFixed(2),
        w: +r.width.toFixed(2), h: +r.height.toFixed(2),
        font: `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight}`,
        family: cs.fontFamily.split(",")[0].replace(/"/g, ""),
        color: cs.color,
      };
      // line boxes AND the text on each, so wrapping is checked not eyeballed
      const tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (tn) {
        const range = document.createRange();
        range.selectNodeContents(el);
        rec.lines = [...range.getClientRects()].map((q) => +q.width.toFixed(1));
        const text = tn.textContent;
        const r2 = document.createRange();
        let top = null, start = 0;
        const out = [];
        for (let i = 0; i < text.length; i++) {
          r2.setStart(tn, i); r2.setEnd(tn, i + 1);
          const t = r2.getBoundingClientRect().top;
          if (top === null) top = t;
          else if (Math.abs(t - top) > 1) { out.push(text.slice(start, i).trim()); start = i; top = t; }
        }
        out.push(text.slice(start).trim());
        rec.lineText = out;
      }
      out[name] = rec;
    }
    return out;
  }, spec.selectors);

  const rows = [];
  let fails = 0;
  for (const [name, exp] of Object.entries(spec.expect || {})) {
    const got = measured[name];
    if (!got) { rows.push(`MISSING  ${name}`); fails++; continue; }
    const parts = [];
    let bad = false;
    for (const k of ["x", "y", "w", "h"]) {
      if (exp[k] === undefined) continue;
      const d = +(got[k] - exp[k]).toFixed(2);
      if (Math.abs(d) > (spec.tolerance ?? 0.5)) { bad = true; parts.push(`${k} ${got[k]} want ${exp[k]} (${d > 0 ? "+" : ""}${d})`); }
      else parts.push(`${k} ${got[k]}`);
    }
    if (bad) fails++;
    rows.push(`${bad ? "FAIL" : "ok  "}  ${name.padEnd(22)} ${parts.join("  ")}`);
  }

  console.log("=== fonts ===");
  console.log("  loaded:", fontReport.loaded.join(" | ") || "(none)");
  console.log("  ff-meta-web-pro available:", JSON.stringify(fontReport.check));
  console.log("=== geometry (Figma frame coords) ===");
  rows.forEach((r) => console.log("  " + r));
  console.log("=== detail ===");
  for (const [k, v] of Object.entries(measured)) {
    if (!v) continue;
    console.log(`  ${k.padEnd(22)} ${v.family} ${v.font} ${v.color}` +
      (v.lines ? `  lines=[${v.lines.join(", ")}]` : ""));
    if (v.lineText) v.lineText.forEach((t, i) => console.log(`  ${" ".repeat(22)}   L${i + 1}: "${t}"`));
  }
  console.log(fails ? `\n${fails} MISMATCH(ES)` : "\nall measured boxes match Figma");

  if (shot) { await page.screenshot({ path: shot }); console.log("shot ->", shot); }
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
