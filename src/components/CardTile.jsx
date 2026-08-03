import { money } from "../data/seed.js";
import contactless from "../assets/icon-contactless.svg";

/* A card as the list draws it. The frame gives the tile two variants: the
   full one carries the twin line and the pass it holds, the compact one is
   just a name and a balance. Which one a card gets follows from the card —
   only a card with a pass is drawn full. */
export default function CardTile({ card, compact = false, onClick }) {
  return (
    <button type="button" className={"card-tile" + (compact ? " card-tile--compact" : "")} onClick={onClick}>
      <div className="card-tile-head">
        <div className="card-tile-name">
          <span className="card-tile-title">
            {card.name}
            {card.frozen && <span className="frozen-chip">FROZEN</span>}
          </span>
          {card.twin && <span className="card-tile-twin">{card.twin}</span>}
        </div>
        <img src={contactless} alt="" width="22" height="22" />
      </div>

      <div className="card-tile-foot">
        <div className="card-tile-value">
          <span className="card-tile-label">STORED VALUE</span>
          <span className="card-tile-amount tnum">{money(card.balance)}</span>
        </div>
        {card.pass && (
          <div className="card-tile-pass">
            <span className="card-tile-label card-tile-label--pass">PASS</span>
            <span className="card-tile-passname">{card.pass.type}</span>
          </div>
        )}
      </div>
    </button>
  );
}
