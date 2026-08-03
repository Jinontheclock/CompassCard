import { SHOTS } from "../data/seed.js";
import tapArt from "../assets/tap-art.png";
import tapCheck from "../assets/icon-tap-check.svg";
import signal from "../assets/icon-tap-signal.svg";
import wifi from "../assets/icon-tap-wifi.svg";
import battery from "../assets/icon-tap-battery.svg";

/* What the gate shows back, not what the app does. These two frames are
   drawn on their own chrome — a 54 bar with no Dynamic Island and a 140
   home bar rather than the 144 the app carries — so the screen is built
   from the frame's own marks rather than the app's.

   Everything else on it is off the app's scale too, being a different
   surface: the type maps to the nearest step the app has, and the two inks
   the frame uses raw take the nearest of the app's own.

   The frames give the screen no way out, so the whole of it dismisses. */
export default function TapResult({ shot, onDismiss }) {
  const s = SHOTS[shot] ?? SHOTS.tap;

  return (
    <button type="button" className="tap-scr" onClick={onDismiss}>
      <div className="tap-status">
        <span className="tap-time tnum">9:41</span>
        <span className="tap-levels">
          <img src={signal} alt="" width="18" height="12" />
          <img src={wifi} alt="" width="17" height="12" />
          <img src={battery} alt="" width="26" height="12" />
        </span>
      </div>

      {s.eyebrow && <span className="tap-eyebrow">{s.eyebrow}</span>}
      <img className="tap-art" src={tapArt} alt="" width="254" height="160" />

      <span className="tap-mark">
        <img src={tapCheck} alt="" width="38" height="38" />
      </span>

      <span className="tap-title">Accepted</span>
      <span className={"tap-amount tnum" + (s.centred ? " tap-amount--centred" : "")}>{s.amount}</span>
      <span className="tap-sub">{s.sub}</span>

      <span className="tap-home" />
    </button>
  );
}
