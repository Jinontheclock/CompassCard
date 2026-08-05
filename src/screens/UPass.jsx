import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import NavHeader from "../components/NavHeader.jsx";
import TabBar from "../components/TabBar.jsx";
import Toggle from "../components/Toggle.jsx";
import contactless from "../assets/icon-contactless.svg";
import radioTick from "../assets/icon-radio-tick.svg";

/* The U-Pass once it is connected. The card is the programme's own — the
   deepest Compass blue, with the two initials in its gold — and everything
   under it is the state of this month: whether it has renewed, and whether
   it will keep renewing. */
export default function UPass({ card, upass, nextMonth, onBack, onAutoRenew, onRoll, onSelectTab }) {
  return (
    <div className="scr">
      <StatusBar />
      {/* The frame labels this "Cards", but the screen is reached from a
          card, not from the list — so it is named for the card it belongs
          to, the way every other screen under a card is. */}
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">U-Pass BC</h1>

        <div className="upass-stack">
          <div className="card-tile card-tile--upass">
            <div className="card-tile-head">
              <div className="card-tile-name">
                <span className="card-tile-title">
                  <span className="tile-gold">U</span>-Pass <span className="tile-gold">BC</span>
                </span>
              </div>
              <img src={contactless} alt="" width="22" height="22" />
            </div>
            <div className="card-tile-foot">
              <div className="card-tile-value">
                <span className="card-tile-label">VALID</span>
                <span className="card-tile-amount">{upass.month}</span>
              </div>
              <div className="card-tile-pass">
                <span className="card-tile-passname">{upass.school}</span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="settings-row settings-row--value upass-status">
              <span className="upass-mark">
                <img src={radioTick} alt="" width="12" height="12" />
              </span>
              <span className="upass-state">
                {upass.month} —{" "}
                <span className="upass-renewed">{upass.renewed ? "Renewed" : "Not renewed"}</span>
              </span>
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="settings-row settings-row--tall">
              <span className="settings-label">Auto-renew</span>
              <Toggle on={upass.autoRenew} label="Auto-renew" onChange={onAutoRenew} />
            </div>
          </div>

          <p className="upass-note">
            <span>Renews automatically each month while you are enrolled.</span>
            <span>Managed through your school.</span>
          </p>

          {/* the demo's hand on the calendar: turn the month and watch the
              toggle above decide what happens to the pass */}
          <button type="button" className="linkish upass-roll" onClick={onRoll}>
            Jump to {nextMonth} 1 →
          </button>
        </div>
      </div>

      <TabBar active="card" onSelect={onSelectTab} />
      <HomeIndicator />
    </div>
  );
}
