import { StatusBar, HomeIndicator } from "../components/Chrome.jsx";
import Button from "../components/Button.jsx";
import NavHeader from "../components/NavHeader.jsx";
import NotePanel from "../components/NotePanel.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import { FARES, money } from "../data/seed.js";

/* Ordering a new piece of plastic. Nothing about the account changes, which
   is what the rows say: the card is named, what travels with it is listed,
   and the fee is stated before the button rather than after it. */
export default function Replace({ card, onBack, onOrder }) {
  return (
    <div className="scr">
      <StatusBar />
      <NavHeader onBack={onBack} backLabel={card.name} />

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
              <SettingsRow
                label="Moves with it"
                value={`${money(card.balance)} · Monthly 2-Zone`}
                strong
                chevron={false}
              />
              <div className="panel-rule panel-rule--inset" />
              <SettingsRow
                label="Replacement fee"
                value={money(FARES.replacementFee)}
                strong
                chevron={false}
              />
            </div>
            <p className="replace-note">
              {money(FARES.replacementFee)} applies to Program pass cards.
            </p>
          </div>

          <NotePanel tone="warning">
            <span className="note-lead">Heads up</span> — the old card stops working as soon as the
            replacement is ordered.
          </NotePanel>
        </div>
      </div>

      <div className="scr-footer scr-footer--fixed">
        <Button onClick={onOrder}>Order Replacement</Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
