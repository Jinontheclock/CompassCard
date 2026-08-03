import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { FARES, money } from "../data/seed.js";
import appleLogo from "../assets/apple-logo.png";
import chevron from "../assets/icon-chevron.svg";

/* Standing instructions for the card: how low it may fall and what to put on
   it when it does. Both rows carry a chevron in the frame, so both are set
   here rather than stated — each steps through TransLink's own amounts and
   comes back round to the first. The footer says whether any of it is
   running, and the button is what starts it. */
export default function Autoload({ card, autoload, method, onBack, onSet, onToggle, onOpen }) {
  const step = (list, value) => list[(list.indexOf(value) + 1) % list.length];

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">Autoload</h1>
        <p className="scr-sub">Reload automatically so your balance is always ready at the gate.</p>

        <div className="autoload-stack">
          <div className="panel panel--flat">
            <SettingsRow
              label="When balance falls below"
              value={money(autoload.threshold)}
              strong
              onClick={() => onSet?.("threshold", step(FARES.autoloadThresholds, autoload.threshold))}
            />
            <div className="panel-rule panel-rule--inset" />
            <SettingsRow
              label="Add"
              value={money(autoload.amount)}
              strong
              onClick={() => onSet?.("amount", step(FARES.autoloadAmounts, autoload.amount))}
            />
          </div>

          <NotePanel>You will get a notification before each reload runs.</NotePanel>

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
