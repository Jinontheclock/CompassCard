import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import { FARES, SAILING_TIMES, ROUTE, money } from "../data/seed.js";
import tick from "../assets/icon-tick.svg";

/* Reserving a sailing, on its own screen: pick the leg, pick the departure,
   and the button restates both. The fare is the walk-on fare and it comes
   off stored value, so a card short of it is told to reload rather than
   charged — the same rule everywhere money moves in this app. */
export default function ReserveFerries({ card, onBack, onReserve }) {
  const [leg, setLeg] = useState("out");
  const [time, setTime] = useState(SAILING_TIMES[SAILING_TIMES.length - 1]);
  const [warn, setWarn] = useState(false);

  const route = ROUTE[leg];
  const short = !card || card.balance < FARES.ferryWalkOn;

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Tickets" />

      <div className="scr-body">
        <h1 className="scr-title">Reserve Ferries</h1>
        <p className="scr-sub">Adult walk-on · Tsawwassen – Swartz Bay</p>

        <div className="reserve-stack">
          <section className="section section--gap8">
            <h2 className="section-label">ROUTE</h2>
            <div className="panel panel--flat">
              {["out", "back"].map((key, i) => (
                <div key={key}>
                  {i > 0 && <div className="panel-rule panel-rule--inset" />}
                  <button type="button" className="settings-row settings-row--route" onClick={() => setLeg(key)}>
                    <span className="sailing">
                      <span className="sailing-leg">{ROUTE[key].from}</span>
                      <span className="sailing-leg">{ROUTE[key].to}</span>
                      <span className="sailing-time">{ROUTE[key].date}</span>
                    </span>
                    {leg === key && <img src={tick} alt="chosen" width="12.45" height="9.075" />}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="section section--gap8">
            <h2 className="section-label">DEPARTURE</h2>
            <div className="ferry-times">
              {SAILING_TIMES.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={"preset" + (t === time ? " preset--on" : "")}
                  aria-pressed={t === time}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <NotePanel>
            Ticket sales for foot passengers end 10 minutes before the sailing.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button
          onClick={() => {
            if (short) { setWarn(true); return; }
            onReserve?.(route, time);
          }}
        >
          Reserve walk-on · {money(FARES.ferryWalkOn)}
        </Button>
        <p className={"scr-footnote" + (warn ? " reserve-warn" : "")}>
          {warn
            ? `Not enough stored value on ${card ? card.name : "your card"} — reload first.`
            : `Pays from stored value${card ? ` · balance ${money(card.balance)}` : ""}.`}
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
