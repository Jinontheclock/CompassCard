import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WatchApp from "./watch/WatchApp.jsx";

/* This branch is the watch. The rig — case, bands, crown — is laid out at
   one fixed size, and a window too small to hold it scales it down whole
   rather than making it reflow; anything with room to spare gets it at
   1:1. The phone app lives on main and is not loaded here. */
const RIG = { width: 500, height: 760 };
const root = document.documentElement;

function fit() {
  const scale = Math.min(1, window.innerWidth / RIG.width, window.innerHeight / RIG.height);
  root.style.setProperty("--fit", scale);
}

fit();
window.addEventListener("resize", fit);
window.addEventListener("orientationchange", fit);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WatchApp />
  </StrictMode>,
);
