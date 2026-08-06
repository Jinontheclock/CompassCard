import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import appleLogo from "../assets/apple-logo.png";
import visaMark from "../assets/visa.png";
import mastercardMark from "../assets/mastercard.png";
import amexMark from "../assets/amex.png";
import paypalMark from "../assets/paypal.png";
import giftcardMark from "../assets/giftcard.png";
import tick from "../assets/icon-tick.svg";
import chevron from "../assets/icon-chevron.svg";
import { PAYMENT_METHODS } from "../data/seed.js";

/* The methods on file. The tick marks the one everything charges to, and
   tapping another row moves it there — the auto-payment panel below simply
   restates the choice, since Autoload draws on the same method. Adding a
   method puts a generic card on file; only Apple Pay carries the mark. */
/* What each method is known by on sight. A credit card is not one brand, so
   it carries the three the network marks cover, overlapped the way a till
   sticker sets them; the rest are one mark each. Apple Pay keeps the Apple
   mark it already had rather than a card of its own. */
const MARKS = {
  "Credit Card": [visaMark, mastercardMark, amexMark],
  PayPal: [paypalMark],
  "Gift Card": [giftcardMark],
};

function PayMark({ label }) {
  return (
    <span className="pay-marks">
      {label === "Apple Pay" ? (
        <span className="tile-apple">
          <img src={appleLogo} alt="" />
        </span>
      ) : (
        (MARKS[label] ?? []).map((src) => (
          <img key={src} className="pay-mark" src={src} alt="" />
        ))
      )}
    </span>
  );
}

function PayRow({ label, chosen, onPick }) {
  return (
    <button type="button" className="settings-row" onClick={onPick}>
      <span className="pay-method">
        <PayMark label={label} />
        {label}
      </span>
      {chosen && <img src={tick} alt="in use" width="12.45" height="9.075" />}
    </button>
  );
}

export default function PaymentMethod({ methods, primary, onSelect, onAdd, onBack, backLabel }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Payment Method</h1>

        <div className="payment-stack">
          <section className="section">
            <h2 className="section-label">PRIMARY PAYMENT</h2>
            {/* the rule goes between two rows, never after the last one —
                once every method is on file the add row goes away, and a
                rule drawn behind it would be left hanging on the floor of
                the panel */}
            <div className="panel panel--flat">
              {methods.map((method, i) => (
                <Fragment key={method}>
                  {i > 0 && <div className="panel-rule panel-rule--inset" />}
                  <PayRow label={method} chosen={method === primary} onPick={() => onSelect?.(method)} />
                </Fragment>
              ))}
              {methods.length < PAYMENT_METHODS.length && (
                <>
                  <div className="panel-rule panel-rule--inset" />
                  <button type="button" className="settings-row" onClick={onAdd}>
                    <span className="settings-label settings-label--action">Add payment method</span>
                    <img src={chevron} alt="" width="8" height="14" />
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="section">
            <h2 className="section-label">AUTO PAYMENT</h2>
            <div className="panel">
              <PayRow label={primary} chosen />
            </div>
          </section>

          <p className="payment-note">Used for Autoload and automatic pass renewals.</p>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
