import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { FARES, money } from "../data/seed.js";
import appleLogo from "../assets/apple-logo.png";
import chevron from "../assets/icon-chevron.svg";

/* Picking what to put on the card. The presets are the seed's; the one that
   is chosen carries the frame's filled treatment rather than a checkmark, so
   the choice reads at a glance. Nothing is charged — the payment row opens
   the method screen and the button moves the flow on. */
export default function Reload({ card, amount, onAmount, onBack, onNext, onOpen }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title scr-title--alone">Reload</h1>

        <div className="reload-stack">
          <div className="value-row">
            <span className="value-label">Current balance</span>
            <span className="value-amount tnum">{money(card.balance)}</span>
          </div>

          <section className="section section--gap8">
            <h2 className="section-label">ADD</h2>
            <div className="preset-row">
              {FARES.reloadPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={"preset" + (preset === amount ? " preset--on" : "")}
                  aria-pressed={preset === amount}
                  onClick={() => onAmount?.(preset)}
                >
                  {/* one line of type, not two boxes, so the pair sits on a
                      shared baseline and centres in the chip as a whole */}
                  <span className="preset-text">
                    <span className="preset-unit">$</span>
                    <span className="preset-figure tnum">{preset.toFixed(2)}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="section section--gap8">
            <h2 className="section-label">PAYMENT</h2>
            <button type="button" className="value-row value-row--tap" onClick={() => onOpen?.("payment")}>
              <span className="pay-method">
                <span className="tile-apple">
                  <img src={appleLogo} alt="" />
                </span>
                Apple Pay
              </span>
              <img src={chevron} alt="" width="8" height="14" />
            </button>
          </section>
        </div>
      </div>

      <div className="scr-footer scr-footer--tight">
        <Button onClick={onNext}>Add {money(amount)}</Button>
        <p className="scr-footnote">Added to your card balance instantly.</p>
      </div>

      <HomeIndicator />
    </div>
  );
}
