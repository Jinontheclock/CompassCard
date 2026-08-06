import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { PASSES, passPrice } from "../data/seed.js";
import radioTick from "../assets/icon-radio-tick.svg";

/* The passes that can be put on a card. One is chosen at a time, and the
   button restates the choice rather than saying only "Purchase" — which is
   how the frame writes it: the product's short name, and the zone where the
   product has zones. Picking a zone reprices the monthly, since a monthly
   is priced by zone; a DayPass covers them all and holds its price. */
export default function PurchasePasses({ passId, zone, onPass, onZone, onBack, backLabel, onPurchase }) {
  const chosen = PASSES.find((p) => p.id === passId) ?? PASSES[0];
  const label = "Purchase " + chosen.short + (chosen.zones ? ` · ${zone}-Zone` : "");

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <div className="passes-stack">
          <h1 className="scr-title scr-title--alone">Purchase Passes</h1>

          <div className="passes-list">
            {PASSES.map((pass) => {
              const on = pass.id === passId;
              return (
                <div
                  key={pass.id}
                  className={
                    "product" +
                    (on ? " product--on" : "") +
                    (pass.zones ? " product--zones" : "")
                  }
                >
                  <div className="product-top">
                    <button
                      type="button"
                      className="product-pick"
                      role="radio"
                      aria-checked={on}
                      onClick={() => onPass(pass.id)}
                    >
                      <span className="product-name">{pass.name}</span>
                      {/* the mark is drawn only when it is on: unselected, the
                          frame leaves an empty ring */}
                      <span className={"product-radio" + (on ? " product-radio--on" : "")}>
                        {on && <img src={radioTick} alt="" width="12" height="12" />}
                      </span>
                    </button>
                    <p className="product-desc">{pass.desc}</p>
                  </div>

                  {pass.zones && (
                    <div className="zone-row">
                      {pass.zones.map((z) => (
                        <button
                          key={z}
                          type="button"
                          className={"zone" + (z === zone ? " zone--on" : "")}
                          onClick={() => onZone(z)}
                        >
                          <span className="zone-text">
                            <span className="zone-figure">{z}</span>
                            <span className="zone-unit">-Zone</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="product-foot">
                    <span className="product-valid">{pass.valid}</span>
                    <span className="product-price tnum">
                      <span className="product-price-unit">$</span>
                      {passPrice(pass, zone).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="home-note">Passes attach to this card and start covering taps immediately.</p>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button onClick={onPurchase}>{label}</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
