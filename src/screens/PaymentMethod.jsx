import { Fragment } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import appleLogo from "../assets/apple-logo.png";
import tick from "../assets/icon-tick.svg";
import chevron from "../assets/icon-chevron.svg";

/* The methods on file. The tick marks the one everything charges to, and
   tapping another row moves it there — the auto-payment panel below simply
   restates the choice, since Autoload draws on the same method. Adding a
   method puts a generic card on file; only Apple Pay carries the mark. */
function PayRow({ label, chosen, onPick }) {
  return (
    <button type="button" className="settings-row" onClick={onPick}>
      <span className="pay-method">
        {label === "Apple Pay" && (
          <span className="tile-apple">
            <img src={appleLogo} alt="" />
          </span>
        )}
        {label}
      </span>
      {chosen && <img src={tick} alt="in use" width="12.45" height="9.075" />}
    </button>
  );
}

export default function PaymentMethod({ methods, primary, onSelect, onAdd, onBack }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel="Account" />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Payment Method</h1>

        <div className="payment-stack">
          <section className="section">
            <h2 className="section-label">NOTIFICATION</h2>
            <div className="panel panel--flat">
              {methods.map((method) => (
                <Fragment key={method}>
                  <PayRow label={method} chosen={method === primary} onPick={() => onSelect?.(method)} />
                  <div className="panel-rule panel-rule--inset" />
                </Fragment>
              ))}
              <button type="button" className="settings-row" onClick={onAdd}>
                <span className="settings-label settings-label--action">Add payment method</span>
                <img src={chevron} alt="" width="8" height="14" />
              </button>
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
