import { useEffect, useRef, useState } from "react";
import "./watch.css";
import caseImg from "../assets/watch-case.webp";
import cardArt from "../assets/compass-card.webp";
import contactlessIcon from "../assets/icon-contactless.svg";

/* The watch, built from the Hi-Fi board's five watch frames. It is not
   the phone: nothing here talks to the app. One balance lives on the
   wrist, two faces share it — Wallet with the card and Reload with its
   three presets — and a swipe (or the dots) moves between them, the way
   watchOS pages do. Tapping the card plays the gate: Hold Near Reader
   holds for a beat, the fare comes off, and the green check states what
   happened, in exactly the frames' own words and numbers. */

const FARE = 2.85;
const money = (n) => `$${n.toFixed(2)}`;

function Check() {
  return (
    <div className="w-check" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path
          d="M12 25.5 20.5 34 36 16"
          fill="none"
          stroke="#000"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function WatchApp() {
  const [balance, setBalance] = useState(15);
  const [page, setPage] = useState(0);
  /* what stands over the faces: the reader waiting, or a result showing */
  const [overlay, setOverlay] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  /* the gate: hold near the reader, then the fare comes off */
  const tapCard = () => {
    if (overlay || balance < FARE) return;
    setOverlay({ kind: "reader" });
    timer.current = setTimeout(() => {
      setBalance((b) => {
        setOverlay({ kind: "deducted", amount: FARE, after: b - FARE });
        return b - FARE;
      });
    }, 1600);
  };

  const reload = (amount) => {
    if (overlay) return;
    setBalance((b) => {
      setOverlay({ kind: "added", amount, after: b + amount });
      return b + amount;
    });
  };

  /* a horizontal swipe turns the page, the way watchOS turns its faces */
  const drag = useRef(null);
  const down = (e) => { drag.current = e.clientX; };
  const up = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (dx < -40) setPage(1);
    else if (dx > 40) setPage(0);
  };

  return (
    <div className="watch-stage">
      {/* The case is the owner's mockup — a Series 11 in Jet Black with the
          Sport Loop — photographed with its display punched out, so the app
          shows through the glass. The screen sits under it at the window's
          own scale: the cutout is 372×444 in the artwork, our display is
          374×446, and 1.0054× lines the two up to the pixel. */}
      <div className="watch-rig">
        <img className="watch-case-img" src={caseImg} alt="" draggable="false" />
        <div className="watch-screen" onPointerDown={down} onPointerUp={up}>
          <div className="w-status">
            <span className="w-title">{page === 0 ? "Wallet" : "Reload"}</span>
            <span className="w-time">9:41</span>
          </div>

          <div className="w-pages" style={{ transform: `translateX(${page * -100}%)` }}>
            <div className="w-page">
              <button type="button" className="w-card" onClick={tapCard} aria-label="Pay with Compass Card">
                <img src={cardArt} alt="" />
              </button>
              <p className="w-balance tnum">{money(balance)}</p>
              <p className="w-line">
                <img src={contactlessIcon} alt="" width="28" height="28" />
                Express Mode
              </p>
            </div>

            <div className="w-page">
              <p className="w-balance-line tnum">Balance {money(balance)}</p>
              <div className="w-presets">
                {[10, 20, 50].map((amount) => (
                  <button key={amount} type="button" className="w-preset tnum" onClick={() => reload(amount)}>
                    +${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-dots" aria-hidden={overlay != null}>
            {[0, 1].map((i) => (
              <button
                key={i}
                type="button"
                className={"w-dot" + (page === i ? " w-dot--on" : "")}
                onClick={() => setPage(i)}
                aria-label={i === 0 ? "Wallet" : "Reload"}
              />
            ))}
          </div>

          {overlay?.kind === "reader" && (
            <div className="w-overlay">
              <span className="w-time w-time--corner">9:41</span>
              <div className="w-card w-card--still">
                <img src={cardArt} alt="" />
              </div>
              <p className="w-balance tnum">{money(balance)}</p>
              <p className="w-line">
                <img src={contactlessIcon} alt="" width="28" height="28" />
                Hold Near Reader
              </p>
            </div>
          )}

          {(overlay?.kind === "deducted" || overlay?.kind === "added") && (
            <button type="button" className="w-overlay w-overlay--result" onClick={() => setOverlay(null)}>
              <span className="w-time w-time--corner">9:41</span>
              <Check />
              <span className="w-result tnum">
                {overlay.kind === "deducted"
                  ? `${money(overlay.amount)} Deducted`
                  : `+${money(overlay.amount)} Added`}
              </span>
              <span className="w-sub tnum">
                {overlay.kind === "deducted"
                  ? `${money(overlay.after)} Remaining`
                  : `Balance ${money(overlay.after)}`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
