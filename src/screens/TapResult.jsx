import { useClock } from "../components/useClock.js";
import { SHOTS } from "../data/seed.js";
import tapArt from "../assets/tap-art.webp";
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

   The frames give the screen no way out. The whole of it dismisses, and
   because that is not something you can see, it also carries the way out
   written down — placed in the empty half of the frame, where it displaces
   nothing the frame draws. */
export default function TapResult({ shot, declined = false, onDismiss }) {
  const s = SHOTS[shot] ?? SHOTS.tap;
  const time = useClock();

  return (
    <div className="tap-scr">
      <button type="button" className="tap-dismiss" aria-label="Back to Compass" onClick={onDismiss} />

      <div className="tap-status">
        <span className="tap-time tnum">{time}</span>
        <span className="tap-levels">
          <img src={signal} alt="" width="18" height="12" />
          <img src={wifi} alt="" width="17" height="12" />
          <img src={battery} alt="" width="26" height="12" />
        </span>
      </div>

      {s.eyebrow && <span className="tap-eyebrow">{s.eyebrow}</span>}
      <img className="tap-art" src={tapArt} alt="" width="254" height="160" />

      {/* a frozen card is turned away: the mark goes over to the warning
          colour and the screen says why, instead of replaying the trip */}
      <span className={"tap-mark" + (declined ? " tap-mark--declined" : "")}>
        {declined ? (
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
            <path d="M12 12L26 26M26 12L12 26" stroke="white" strokeWidth="4.75" strokeLinecap="round" />
          </svg>
        ) : (
          <img src={tapCheck} alt="" width="38" height="38" />
        )}
      </span>

      <span className="tap-title">{declined ? "Declined" : "Accepted"}</span>
      <span className={"tap-amount tnum" + (s.centred || declined ? " tap-amount--centred" : "")}>
        {declined ? "Card frozen" : s.amount}
      </span>
      <span className="tap-sub">{declined ? "Unfreeze it in the Compass app" : s.sub}</span>

      <button type="button" className="escape" onClick={onDismiss}>
        Back to Compass
      </button>

      <span className="tap-home" />
    </div>
  );
}
