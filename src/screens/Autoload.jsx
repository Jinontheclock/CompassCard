import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { money } from "../data/seed.js";
import appleLogo from "../assets/apple-logo.png";
import chevron from "../assets/icon-chevron.svg";

/* Standing instructions for the card: how low it may fall and what to put on
   it when it does. Both figures come from the seed, and the footer states
   plainly that none of it is running yet. */
export default function Autoload({ card, autoload, onBack, onNext, onOpen }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">Autoload</h1>
        <p className="scr-sub">Reload automatically so your balance is always ready a the gate.</p>

        <div className="autoload-stack">
          <div className="panel panel--flat">
            <SettingsRow label="When balance falls below" value={money(autoload.threshold)} strong />
            <div className="panel-rule panel-rule--inset" />
            <SettingsRow label="Add" value={money(autoload.amount)} strong />
          </div>

          <NotePanel>You will get a notification before each reload runs.</NotePanel>

          <section className="section section--gap8">
            <h2 className="section-label">PAYMENT</h2>
            <button type="button" className="value-row value-row--tap" onClick={() => onOpen?.("payment")}>
              <span className="pay-method">
                <span className="tile-apple">
                  <img src={appleLogo} alt="" />
                </span>
                Apply Pay
              </span>
              <img src={chevron} alt="" width="8" height="14" />
            </button>
          </section>

          <NotePanel>You will get a notification each time Autoload runs.</NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--tight">
        <Button onClick={onNext}>Turn on Autoload</Button>
        <p className="scr-footnote">Autoload is currently {autoload.on ? "on" : "off"}.</p>
      </div>

      <HomeIndicator />
    </div>
  );
}
