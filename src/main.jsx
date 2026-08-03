import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import App from "./App.jsx";

/* The screen is laid out at one fixed size and is not responsive by design,
   so a window too small to hold it scales it down whole rather than making
   it reflow or clipping it. Anything with room to spare gets it at 1:1 —
   the size never grows past the frames' own. The measurements come from the
   tokens so 402×874 is stated in exactly one place. */
const root = document.documentElement;

function fit() {
  const style = getComputedStyle(root);
  const width = parseFloat(style.getPropertyValue("--screen-width"));
  const height = parseFloat(style.getPropertyValue("--screen-height"));
  const scale = Math.min(1, window.innerWidth / width, window.innerHeight / height);
  root.style.setProperty("--fit", scale);
}

fit();
window.addEventListener("resize", fit);
window.addEventListener("orientationchange", fit);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
