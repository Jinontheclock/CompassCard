import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { FARES, money, replacementFee } from "../data/seed.js";

/* Ordering a new piece of plastic. The rows say the whole of it before the
   button: the card is named, what travels with it is listed — the balance,
   and the pass where there is one — and the fee is the one this card would
   actually be charged, since a card carrying a Program pass costs more.

   Ordering does what it says: the warning about the old card becomes the
   fact of it, and the button stays pressed rather than offering to order
   the same card twice. */
export default function Replace({ card, programPass = false, onBack, backLabel, onOrder }) {
  const fee = replacementFee(programPass);
  const moves = card.pass ? `${money(card.balance)} · ${card.pass.type}` : money(card.balance);

  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={backLabel} />

      <div className="scr-body">
        <h1 className="scr-title">Replace Card</h1>
        <p className="scr-sub">
          Order a replacement — your balance, passes and history move to the new card.
        </p>

        <div className="replace-stack">
          <div className="replace-group">
            <div className="panel panel--flat">
              <SettingsRow label="Card to replace" value={card.name} strong chevron={false} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Moves with it" value={moves} strong chevron={false} />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow label="Replacement fee" value={money(fee)} strong chevron={false} />
            </div>
            <p className="replace-note">
              {money(FARES.programCardFee)} applies to Program pass cards.
            </p>
          </div>

          {card.replaced ? (
            <NotePanel tone="success">
              Replacement ordered — the old card has stopped working.
            </NotePanel>
          ) : (
            <NotePanel tone="warning">
              <span className="note-lead">Heads up</span> — the old card stops working as soon as
              the replacement is ordered.
            </NotePanel>
          )}
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button disabled={card.replaced} onClick={onOrder}>
          {card.replaced ? "Replacement Ordered" : "Order Replacement"}
        </Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
