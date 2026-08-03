import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import { money } from "../data/seed.js";
import checkIcon from "../assets/icon-check-lg.svg";
import appleLogo from "../assets/apple-logo.png";

/* The end of the reload. No back control — the flow is finished, and Done
   returns to the card rather than stepping back through it. */
export default function ReloadDone({ card, amount, method, onDone }) {
  return (
    <div className="scr">
      <StatusBar />

      <span className="done-badge">
        <img src={checkIcon} alt="" width="38" height="38" />
      </span>

      <h1 className="done-title">Reload complete</h1>

      <div className="done-lines">
        <span className="done-amount tnum">{money(amount)} Added</span>
        <span className="done-note">Available at the gate right away.</span>
      </div>

      <div className="panel panel--flat done-panel">
        <div className="panel-row">
          <span className="settings-label">Card </span>
          <span className="settings-label">{card.name}</span>
        </div>
        <div className="panel-rule panel-rule--inset" />
        <div className="panel-row">
          <span className="settings-label">Payment</span>
          <span className="pay-method">
            {method === "Apple Pay" && (
              <span className="tile-apple">
                <img src={appleLogo} alt="" />
              </span>
            )}
            {method}
          </span>
        </div>
      </div>

      <div className="done-footer">
        <Button onClick={onDone}>Done</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
