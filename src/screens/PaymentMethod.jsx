import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import appleLogo from "../assets/apple-logo.png";
import tick from "../assets/icon-tick.svg";
import chevron from "../assets/icon-chevron.svg";

/* The methods on file. Nothing is charged anywhere in the demo, so this
   states what would be used rather than offering to change it. */
function PayRow({ label }) {
  return (
    <div className="settings-row">
      <span className="pay-method">
        <span className="tile-apple">
          <img src={appleLogo} alt="" />
        </span>
        {label}
      </span>
      <img src={tick} alt="in use" width="12.45" height="9.075" />
    </div>
  );
}

export default function PaymentMethod({ onBack, onAdd }) {
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
              <PayRow label="Apple Pay" />
              <div className="panel-rule panel-rule--inset" />
              <button type="button" className="settings-row" onClick={onAdd}>
                <span className="settings-label settings-label--action">Add payment method</span>
                <img src={chevron} alt="" width="8" height="14" />
              </button>
            </div>
          </section>

          <section className="section">
            <h2 className="section-label">AUTO PAYMENT</h2>
            <div className="panel">
              <PayRow label="Apple Pay" />
            </div>
          </section>

          <p className="payment-note">Used for Autoload and automatic pass renewals.</p>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
