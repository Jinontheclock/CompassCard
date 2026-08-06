import { useState } from "react";
import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import Dropdown from "../components/Dropdown.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { FARES, money } from "../data/seed.js";
import appleLogo from "../assets/apple-logo.png";
import chevron from "../assets/icon-chevron.svg";

/* Standing instructions for the card: how low it may fall and what to put
   on it when it does. Both rows open a menu of TransLink's own amounts —
   the chevron says a row opens something, and this is the something. The
   footer says whether any of it is running, and the button starts it. */
export default function Autoload({ autoload, method, onBack, backLabel, onSet, onToggle, onOpen }) {
  const [menu, setMenu] = useState(null);
  const amounts = (list) => list.map((n) => ({ label: money(n), value: n }));

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title">Autoload</h1>
        <p className="scr-sub">Reload automatically so your balance is always ready at the gate.</p>

        <div className="autoload-stack">
          <div className="panel panel--flat panel--pop">
            <div className="menu-anchor">
              <SettingsRow
                label="When balance falls below"
                value={money(autoload.threshold)}
                strong
                onClick={() => setMenu(menu === "threshold" ? null : "threshold")}
              />
              <Dropdown
                open={menu === "threshold"}
                options={amounts(FARES.autoloadThresholds)}
                value={autoload.threshold}
                onPick={(v) => onSet?.("threshold", v)}
                onClose={() => setMenu(null)}
              />
            </div>
            <div className="panel-rule panel-rule--inset" />
            <div className="menu-anchor">
              <SettingsRow
                label="Add"
                value={money(autoload.amount)}
                strong
                onClick={() => setMenu(menu === "amount" ? null : "amount")}
              />
              <Dropdown
                open={menu === "amount"}
                options={amounts(FARES.autoloadAmounts)}
                value={autoload.amount}
                onPick={(v) => onSet?.("amount", v)}
                onClose={() => setMenu(null)}
              />
            </div>
          </div>

          <section className="section section--gap8">
            <h2 className="section-label">PAYMENT</h2>
            <button type="button" className="value-row value-row--tap" onClick={() => onOpen?.("payment")}>
              <span className="pay-method">
                {method === "Apple Pay" && (
                  <span className="tile-apple">
                    <img src={appleLogo} alt="" />
                  </span>
                )}
                {method}
              </span>
              <img src={chevron} alt="" width="8" height="14" />
            </button>
          </section>

          <NotePanel>You will get a notification each time Autoload runs.</NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--tight">
        <Button onClick={() => onToggle?.(!autoload.on)}>
          {autoload.on ? "Turn off Autoload" : "Turn on Autoload"}
        </Button>
        <p className="scr-footnote">
          {autoload.on
            ? `Autoload adds ${money(autoload.amount)} below ${money(autoload.threshold)}.`
            : "Autoload is currently off."}
        </p>
      </div>

      <HomeIndicator />
    </div>
  );
}
