import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import { money } from "../data/seed.js";

/* Losing the plastic is not losing the money, which is the whole point of
   the screen: it names the card, states what is on the account behind it,
   and offers to stop the card rather than to replace what it held. The
   button does what it says — a frozen card can be let go again from the
   same place, so it turns around rather than leaving. */
export default function LostCard({ card, onBack, onFreeze, onMove }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

      <div className="scr-body">
        <h1 className="scr-title">Lost Card</h1>
        <p className="scr-sub">
          Your balance lives on your account — not the card. Freeze it now and nothing is lost.
        </p>

        <div className="lost-stack">
          <div className="lost-rows">
            <div className="card-row">
              <span className="card-chip">CARD</span>
              <span className="card-row-what">
                <span className="card-row-name">Compass Card · Plastic</span>
                <span className="card-row-sub">Registered to your account</span>
              </span>
            </div>
            <div className="value-row">
              <span className="value-label">On your account</span>
              <span className="value-amount tnum">{money(card.balance)}</span>
            </div>
          </div>

          <div className="lost-actions">
            <Button onClick={() => onFreeze?.(!card.frozen)}>
              {card.frozen ? "Unfreeze Card" : "Freeze Card"}
            </Button>
            <Button tone="secondary" onClick={onMove}>
              Move Balance to New Card
            </Button>
          </div>

          <p className="lost-note">
            {card.frozen
              ? "This card is frozen. It stops working at the gate right away."
              : "A frozen card stops working at the gate right away."}
          </p>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
