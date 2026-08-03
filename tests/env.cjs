/* Shared launch settings for every test script.
   - CHROME: path to a Chromium binary; falls back to common locations, then
     to whatever Playwright has installed.
   - TEST_PROXY: an HTTP proxy for the browser, if the machine needs one.
   - tests/kit/: an optional local mirror of the Adobe Fonts kit. When it is
     present the scripts serve the fonts from it and never touch the network;
     when it is absent the live kit loads as it does in the app. The mirror
     is never committed — the fonts are licensed, not ours to ship. */
const fs = require("fs");
const path = require("path");

const KIT = path.join(__dirname, "kit");
const EXE =
  process.env.CHROME ||
  ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find((p) =>
    fs.existsSync(p)
  );

const launchOptions = {
  ...(EXE ? { executablePath: EXE } : {}),
  ...(process.env.TEST_PROXY
    ? { proxy: { server: process.env.TEST_PROXY, bypass: "localhost,127.0.0.1" } }
    : {}),
};

async function routeKit(page) {
  if (!fs.existsSync(path.join(KIT, "kit.local.css"))) return;
  await page.route("**://use.typekit.net/**", (route) =>
    route.fulfill({ contentType: "text/css", body: fs.readFileSync(path.join(KIT, "kit.local.css")) })
  );
  await page.route("**/__kit/*.bin", (route) => {
    const name = route.request().url().split("/").pop();
    const buf = fs.readFileSync(path.join(KIT, name));
    const sig = buf.toString("ascii", 0, 4);
    const type = sig === "wOF2" ? "font/woff2" : sig === "wOFF" ? "font/woff" : "font/otf";
    route.fulfill({ contentType: type, body: buf });
  });
}

module.exports = { launchOptions, routeKit };
