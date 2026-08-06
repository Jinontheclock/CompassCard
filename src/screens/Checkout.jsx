import { Fragment, useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { money , whenLabel } from "../data/seed.js";
import appleLogo from "../assets/apple-logo.png";
import tick from "../assets/icon-tick.svg";

/* The paying step, one screen for everything the Tickets tab sells. What
   was chosen sits at the top the way the boarding pass will write it, and
   beneath it the ways to pay: the Compass card's own stored value, Apple
   Pay — which presents its sheet, as a reload does — or a credit card.
   Stored value is the one that can fall short, and a short balance is told
   to reload rather than charged. */
export default function Checkout({ order, card, onBack, backLabel, onPay }) {
  const ferry = order.kind === "ferry";
  const methods = [...(card ? ["Compass Card"] : []), "Apple Pay", "Credit Card"];
  const [payWith, setPayWith] = useState(methods[0]);
  const [warn, setWarn] = useState(false);

  const short = payWith === "Compass Card" && card && card.balance < order.fare;
  const note = warn
    ? `Not enough stored value on ${card.name} — reload first.`
    : payWith === "Compass Card"
      ? `Stored value balance ${money(card.balance)}.`
      : payWith === "Apple Pay"
        ? "Apple Pay confirms before anything is charged."
        : "Charged to your credit card.";

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Payment</h1>

        <div className="tikd-stack">
          <div className="panel tikd-pass">
            <div className="tikd-legs">
              {ferry ? (
                <>
                  <span className="sailing-leg">{order.from} -</span>
                  <span className="sailing-leg">{order.to}</span>
                  <span className="sailing-time">{whenLabel(order.time, order.days)}</span>
                </>
              ) : (
                <>
                  <span className="sailing-leg">{order.ev.name}</span>
                  <span className="sailing-time">{order.ev.venue}</span>
                  <span className="sailing-time">{whenLabel(order.ev.time, order.ev.days)}</span>
                </>
              )}
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--value">
              <span className="settings-label">{ferry ? order.fareLabel : "Event pass"}</span>
              <span className="settings-value settings-value--strong tnum">{money(order.fare)}</span>
            </div>
          </div>

          <section className="section section--gap8">
            <h2 className="section-label">PAY WITH</h2>
            <div className="panel panel--flat">
              {methods.map((m, i) => (
                <Fragment key={m}>
                  {i > 0 && <div className="panel-rule panel-rule--inset" />}
                  <button
                    type="button"
                    className="settings-row"
                    onClick={() => { setPayWith(m); setWarn(false); }}
                  >
                    <span className="pay-method">
                      {m === "Apple Pay" && (
                        <span className="tile-apple">
                          <img src={appleLogo} alt="" />
                        </span>
                      )}
                      {m === "Compass Card" ? `Compass Card · ${money(card.balance)}` : m}
                    </span>
                    {payWith === m && <img src={tick} alt="chosen" width="12.45" height="9.075" />}
                  </button>
                </Fragment>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button
          onClick={() => {
            if (short) { setWarn(true); return; }
            onPay?.(payWith);
          }}
        >
          Pay {money(order.fare)}
        </Button>
        <p className={"scr-footnote" + (warn ? " reserve-warn" : "")}>{note}</p>
      </div>

      <HomeIndicator />
    </div>
  );
}
